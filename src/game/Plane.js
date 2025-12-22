import * as THREE from 'three';

export class Plane {
  constructor(playerId, nickname, isLocalPlayer = false) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.isLocalPlayer = isLocalPlayer;

    // Physics properties
    this.position = new THREE.Vector3(0, 100, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, 0, 0);
    this.quaternion = new THREE.Quaternion();

    this.speed = 0;
    this.maxSpeed = 200;
    this.minSpeed = 30;
    this.acceleration = 40;
    this.turnSpeed = 1.5;
    this.pitchSpeed = 1.0;
    this.rollSpeed = 2.0;

    this.health = 100;
    this.score = 0;
    this.isDead = false;

    // Input state
    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
      boost: false,
      fire: false,
    };

    // Create 3D model
    this.mesh = this.createMesh();
    this.updateMeshPosition();

    // Name tag
    this.nameTag = this.createNameTag();
  }

  createMesh() {
    const group = new THREE.Group();

    // Simple low-poly plane
    // Fuselage
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 5);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: this.isLocalPlayer ? 0x4169E1 : 0xFF6347,
      flatShading: true,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    group.add(body);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(10, 0.2, 2);
    const wingMaterial = new THREE.MeshStandardMaterial({
      color: this.isLocalPlayer ? 0x1E90FF : 0xFF4500,
      flatShading: true,
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.y = -0.3;
    wings.castShadow = true;
    group.add(wings);

    // Tail
    const tailGeometry = new THREE.BoxGeometry(0.2, 2, 1);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(0, 0.5, -2);
    tail.castShadow = true;
    group.add(tail);

    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(0.6, 8, 8);
    const cockpitMaterial = new THREE.MeshStandardMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.6,
      flatShading: true,
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(0, 0.5, 1);
    group.add(cockpit);

    return group;
  }

  createNameTag() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;

    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'bold 24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.nickname, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(8, 2, 1);
    sprite.position.y = 3;

    return sprite;
  }

  updatePhysics(deltaTime) {
    if (this.isDead) return;

    // Update speed based on input
    if (this.input.boost) {
      this.speed += this.acceleration * deltaTime * 2;
    } else if (this.input.forward) {
      this.speed += this.acceleration * deltaTime;
    } else if (this.input.backward) {
      this.speed -= this.acceleration * deltaTime;
    } else {
      // Gradually return to cruise speed
      const targetSpeed = 60;
      this.speed += (targetSpeed - this.speed) * deltaTime;
    }

    // Clamp speed
    this.speed = Math.max(this.minSpeed, Math.min(this.maxSpeed, this.speed));

    // Rotation controls
    let pitchDelta = 0;
    let yawDelta = 0;
    let rollDelta = 0;

    if (this.input.up) pitchDelta -= this.pitchSpeed * deltaTime;
    if (this.input.down) pitchDelta += this.pitchSpeed * deltaTime;
    if (this.input.left) {
      yawDelta += this.turnSpeed * deltaTime;
      rollDelta -= this.rollSpeed * deltaTime;
    }
    if (this.input.right) {
      yawDelta -= this.turnSpeed * deltaTime;
      rollDelta += this.rollSpeed * deltaTime;
    }

    // Apply rotation
    this.rotation.x += pitchDelta;
    this.rotation.y += yawDelta;
    this.rotation.z += rollDelta;

    // Limit pitch
    this.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.rotation.x));

    // Gradually return roll to zero when not turning
    if (!this.input.left && !this.input.right) {
      this.rotation.z *= 0.95;
    }
    this.rotation.z = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.rotation.z));

    // Update quaternion from euler
    this.quaternion.setFromEuler(this.rotation);

    // Calculate forward direction
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this.quaternion);

    // Update velocity
    this.velocity.copy(forward).multiplyScalar(this.speed);

    // Apply gravity (slight downward force)
    this.velocity.y -= 9.8 * deltaTime * 0.5;

    // Lift force (counters gravity when moving)
    const liftForce = (this.speed / this.maxSpeed) * 15;
    this.velocity.y += liftForce * deltaTime;

    // Update position
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

    // Ground collision
    if (this.position.y < 5) {
      this.position.y = 5;
      if (this.velocity.y < -20) {
        this.die();
      } else {
        this.velocity.y = 0;
      }
    }

    this.updateMeshPosition();
  }

  updateMeshPosition() {
    this.mesh.position.copy(this.position);
    this.mesh.quaternion.copy(this.quaternion);
    this.nameTag.position.copy(this.position);
    this.nameTag.position.y += 3;
  }

  setInput(input) {
    this.input = { ...this.input, ...input };
  }

  fireMissile() {
    if (this.isDead) return null;

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this.quaternion);

    const missilePosition = this.position.clone().add(forward.multiplyScalar(5));
    const missileVelocity = forward.clone().multiplyScalar(300);

    return {
      position: missilePosition,
      velocity: missileVelocity,
      owner: this.playerId,
    };
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.health = 0;
  }

  respawn() {
    this.isDead = false;
    this.health = 100;
    this.position.set(
      Math.random() * 1000 - 500,
      100 + Math.random() * 100,
      Math.random() * 1000 - 500
    );
    this.velocity.set(0, 0, 0);
    this.rotation.set(0, Math.random() * Math.PI * 2, 0);
    this.speed = 60;
  }

  // Update from server data (for remote players)
  updateFromServer(data) {
    if (!this.isLocalPlayer) {
      // Smooth interpolation
      this.position.lerp(new THREE.Vector3(data.x, data.y, data.z), 0.3);

      const serverQuat = new THREE.Quaternion(
        data.qx,
        data.qy,
        data.qz,
        data.qw
      );
      this.quaternion.slerp(serverQuat, 0.3);

      this.updateMeshPosition();
    }

    this.score = data.score || this.score;
    this.health = data.health !== undefined ? data.health : this.health;
  }

  getState() {
    return {
      id: this.playerId,
      nickname: this.nickname,
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
      qx: this.quaternion.x,
      qy: this.quaternion.y,
      qz: this.quaternion.z,
      qw: this.quaternion.w,
      health: this.health,
      score: this.score,
      isDead: this.isDead,
    };
  }
}
