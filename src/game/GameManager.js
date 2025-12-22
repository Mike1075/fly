import { GameScene } from './Scene.js';
import { Plane } from './Plane.js';
import { Missile } from './Missile.js';
import { WebSocketClient } from '../network/WebSocketClient.js';
import { UIManager } from '../ui/UIManager.js';

export class GameManager {
  constructor() {
    this.scene = new GameScene();
    this.ui = new UIManager();

    this.playerId = this.generatePlayerId();
    this.nickname = '';

    this.localPlayer = null;
    this.remotePlayers = new Map();
    this.missiles = new Map();

    this.ws = null;
    this.isGameRunning = false;

    this.lastTime = performance.now();
    this.missileIdCounter = 0;

    // Input handling
    this.keys = {};
    this.setupInput();

    // Camera follow settings
    this.cameraDistance = 15;
    this.cameraHeight = 5;
  }

  generatePlayerId() {
    const stored = localStorage.getItem('flyGamePlayerId');
    if (stored) return stored;

    const id = 'player_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('flyGamePlayerId', id);
    return id;
  }

  async startGame(nickname) {
    this.nickname = nickname;

    // Create local player
    this.localPlayer = new Plane(this.playerId, nickname, true);
    this.scene.add(this.localPlayer.mesh);
    this.scene.add(this.localPlayer.nameTag);

    // Connect to WebSocket server
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
    this.ws = new WebSocketClient(wsUrl);

    try {
      await this.ws.connect(this.playerId, nickname);
      this.setupNetworkHandlers();
    } catch (error) {
      console.error('Failed to connect to server:', error);
      alert('Failed to connect to game server. You can still play offline!');
    }

    // Hide login screen and show HUD
    this.ui.hideLoginScreen();
    this.ui.showHUD();

    // Start game loop
    this.isGameRunning = true;
    this.gameLoop();
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      // Fire missile
      if (e.code === 'Space') {
        e.preventDefault();
        this.fireMissile();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  updateInput() {
    if (!this.localPlayer) return;

    const input = {
      up: this.keys['w'] || this.keys['arrowup'],
      down: this.keys['s'] || this.keys['arrowdown'],
      left: this.keys['a'] || this.keys['arrowleft'],
      right: this.keys['d'] || this.keys['arrowright'],
      boost: this.keys['shift'],
      forward: true, // Always moving forward
    };

    this.localPlayer.setInput(input);
  }

  fireMissile() {
    if (!this.localPlayer || this.localPlayer.isDead) return;

    const missileData = this.localPlayer.fireMissile();
    if (!missileData) return;

    const missileId = `${this.playerId}_${this.missileIdCounter++}`;
    const missile = new Missile(
      missileId,
      missileData.position,
      missileData.velocity,
      this.playerId
    );

    this.missiles.set(missileId, missile);
    this.scene.add(missile.mesh);

    // Broadcast to server
    if (this.ws) {
      this.ws.send('fire', {
        missileId,
        position: missileData.position,
        velocity: missileData.velocity,
      });
    }
  }

  setupNetworkHandlers() {
    // Player joined
    this.ws.on('playerJoined', (data) => {
      if (data.playerId === this.playerId) return;

      const player = new Plane(data.playerId, data.nickname, false);
      this.remotePlayers.set(data.playerId, player);
      this.scene.add(player.mesh);
      this.scene.add(player.nameTag);
    });

    // Player left
    this.ws.on('playerLeft', (data) => {
      const player = this.remotePlayers.get(data.playerId);
      if (player) {
        this.scene.remove(player.mesh);
        this.scene.remove(player.nameTag);
        this.remotePlayers.delete(data.playerId);
      }
    });

    // Game state update
    this.ws.on('gameState', (data) => {
      // Update remote players
      data.players.forEach(playerData => {
        if (playerData.id === this.playerId) return;

        let player = this.remotePlayers.get(playerData.id);
        if (!player) {
          player = new Plane(playerData.id, playerData.nickname, false);
          this.remotePlayers.set(playerData.id, player);
          this.scene.add(player.mesh);
          this.scene.add(player.nameTag);
        }

        player.updateFromServer(playerData);
      });

      // Update leaderboard
      this.ui.updateLeaderboard(data.players, this.playerId);
    });

    // Player killed
    this.ws.on('playerKilled', (data) => {
      this.ui.showKillFeed(`${data.killerName} shot down ${data.victimName}`);

      if (data.victimId === this.playerId) {
        // Local player died
        setTimeout(() => {
          this.localPlayer.respawn();
          if (this.ws) {
            this.ws.send('respawn', this.localPlayer.getState());
          }
        }, 3000);
      }
    });

    // Remote missile fired
    this.ws.on('missileFired', (data) => {
      if (data.playerId === this.playerId) return;

      const missile = new Missile(
        data.missileId,
        new THREE.Vector3(data.position.x, data.position.y, data.position.z),
        new THREE.Vector3(data.velocity.x, data.velocity.y, data.velocity.z),
        data.playerId
      );

      this.missiles.set(data.missileId, missile);
      this.scene.add(missile.mesh);
    });
  }

  gameLoop() {
    if (!this.isGameRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Update input
    this.updateInput();

    // Update local player
    if (this.localPlayer) {
      this.localPlayer.updatePhysics(deltaTime);

      // Send state to server
      if (this.ws && this.ws.isConnected) {
        this.ws.send('updatePlayer', this.localPlayer.getState());
      }

      // Update camera to follow player
      this.updateCamera();
    }

    // Update missiles
    this.missiles.forEach((missile, id) => {
      missile.update(deltaTime);

      // Check collisions
      const hitPlayerId = missile.checkCollision(
        new Map([...this.remotePlayers, [this.playerId, this.localPlayer]])
      );

      if (hitPlayerId) {
        if (hitPlayerId === this.playerId) {
          this.localPlayer.takeDamage(100);
        }

        // Notify server of hit
        if (this.ws) {
          this.ws.send('missileHit', {
            missileId: id,
            victimId: hitPlayerId,
            killerId: missile.owner,
          });
        }
      }

      // Remove inactive missiles
      if (!missile.isActive) {
        this.scene.remove(missile.mesh);
        this.missiles.delete(id);
      }
    });

    // Update minimap
    this.ui.updateMinimap(this.localPlayer, this.remotePlayers);

    // Render
    this.scene.render();

    requestAnimationFrame(() => this.gameLoop());
  }

  updateCamera() {
    if (!this.localPlayer) return;

    const playerPos = this.localPlayer.position;
    const playerQuat = this.localPlayer.quaternion;

    // Camera position behind the plane
    const offset = new THREE.Vector3(0, this.cameraHeight, this.cameraDistance);
    offset.applyQuaternion(playerQuat);

    const targetCameraPos = playerPos.clone().add(offset);

    // Smooth camera movement
    this.scene.camera.position.lerp(targetCameraPos, 0.1);

    // Look at the plane
    const lookAtPos = playerPos.clone();
    lookAtPos.y += 2;
    this.scene.camera.lookAt(lookAtPos);
  }
}
