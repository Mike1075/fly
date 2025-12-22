import * as THREE from 'three';

export class Missile {
  constructor(id, position, velocity, owner) {
    this.id = id;
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.owner = owner;
    this.lifetime = 5; // seconds
    this.age = 0;
    this.isActive = true;

    this.mesh = this.createMesh();
    this.updateMeshPosition();
  }

  createMesh() {
    const group = new THREE.Group();

    // Missile body
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF0000,
      emissive: 0xFF4500,
      flatShading: true,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Missile tip
    const tipGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
    const tip = new THREE.Mesh(tipGeometry, bodyMaterial);
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 1.25;
    group.add(tip);

    // Trail effect
    const trailGeometry = new THREE.ConeGeometry(0.3, 1, 8);
    const trailMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFA500,
      emissive: 0xFFA500,
      transparent: true,
      opacity: 0.6,
    });
    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trail.rotation.x = -Math.PI / 2;
    trail.position.z = -1.5;
    group.add(trail);

    return group;
  }

  update(deltaTime) {
    this.age += deltaTime;

    if (this.age >= this.lifetime) {
      this.isActive = false;
      return;
    }

    // Update position
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

    // Check ground collision
    if (this.position.y < 1) {
      this.isActive = false;
      return;
    }

    this.updateMeshPosition();
  }

  updateMeshPosition() {
    this.mesh.position.copy(this.position);

    // Orient missile in direction of velocity
    const direction = this.velocity.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
    this.mesh.quaternion.copy(quaternion);
  }

  checkCollision(planes) {
    if (!this.isActive) return null;

    for (const plane of planes.values()) {
      // Don't hit the owner
      if (plane.playerId === this.owner) continue;
      if (plane.isDead) continue;

      const distance = this.position.distanceTo(plane.position);
      if (distance < 5) {
        // Hit!
        this.isActive = false;
        return plane.playerId;
      }
    }

    return null;
  }

  destroy() {
    this.isActive = false;
  }
}
