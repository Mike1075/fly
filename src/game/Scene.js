import * as THREE from 'three';

export class GameScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.setupEnvironment();
  }

  setupRenderer() {
    const canvas = document.getElementById('game-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 5, 10);
  }

  setupLights() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Hemisphere light for sky gradient
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x545454, 0.4);
    this.scene.add(hemisphereLight);
  }

  setupEnvironment() {
    // Sky
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 1000, 8000);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(10000, 10000, 50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a7c59,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Add some mountains (low-poly style)
    this.createMountains();

    // Grid helper for better spatial awareness (optional)
    const gridHelper = new THREE.GridHelper(5000, 100, 0x000000, 0x333333);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);
  }

  createMountains() {
    const mountainGeometry = new THREE.ConeGeometry(100, 300, 6);
    const mountainMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B7355,
      flatShading: true,
    });

    const positions = [
      { x: 500, z: -800 },
      { x: -600, z: -1000 },
      { x: 800, z: 500 },
      { x: -400, z: 700 },
      { x: 1200, z: -200 },
      { x: -1000, z: -500 },
    ];

    positions.forEach(pos => {
      const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
      mountain.position.set(pos.x, 150, pos.z);
      mountain.castShadow = true;
      mountain.receiveShadow = true;
      this.scene.add(mountain);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  add(object) {
    this.scene.add(object);
  }

  remove(object) {
    this.scene.remove(object);
  }
}
