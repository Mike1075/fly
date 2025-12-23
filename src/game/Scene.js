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

    // Water (ocean surrounding the island)
    const waterGeometry = new THREE.PlaneGeometry(50000, 50000);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e90ff,
      roughness: 0.3,
      metalness: 0.1,
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -1;
    this.scene.add(water);

    // Island ground (much larger)
    const groundGeometry = new THREE.CircleGeometry(5000, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a7c59,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Beach ring around island
    const beachGeometry = new THREE.RingGeometry(4800, 5200, 64);
    const beachMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4d03f,
      roughness: 0.9,
    });
    const beach = new THREE.Mesh(beachGeometry, beachMaterial);
    beach.rotation.x = -Math.PI / 2;
    beach.position.y = 0.1;
    this.scene.add(beach);

    // Add environment elements
    this.createAirport();
    this.createMountains();
    this.createTrees();
    this.createBuildings();
    this.createClouds();
  }

  createAirport() {
    // Runway
    const runwayGeometry = new THREE.PlaneGeometry(40, 400);
    const runwayMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.9,
    });
    const runway = new THREE.Mesh(runwayGeometry, runwayMaterial);
    runway.rotation.x = -Math.PI / 2;
    runway.position.set(0, 0.2, 0);
    runway.receiveShadow = true;
    this.scene.add(runway);

    // Runway stripes
    const stripeGeometry = new THREE.PlaneGeometry(3, 20);
    const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    for (let i = -180; i <= 180; i += 40) {
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0.3, i);
      this.scene.add(stripe);
    }

    // Control tower
    const towerGroup = new THREE.Group();

    // Tower base
    const towerBaseGeometry = new THREE.BoxGeometry(15, 40, 15);
    const towerMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      flatShading: true
    });
    const towerBase = new THREE.Mesh(towerBaseGeometry, towerMaterial);
    towerBase.position.y = 20;
    towerBase.castShadow = true;
    towerGroup.add(towerBase);

    // Control room (glass top)
    const controlRoomGeometry = new THREE.BoxGeometry(20, 10, 20);
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.7,
      metalness: 0.3,
    });
    const controlRoom = new THREE.Mesh(controlRoomGeometry, glassMaterial);
    controlRoom.position.y = 45;
    controlRoom.castShadow = true;
    towerGroup.add(controlRoom);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(15, 8, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 54;
    roof.rotation.y = Math.PI / 4;
    towerGroup.add(roof);

    towerGroup.position.set(60, 0, 0);
    this.scene.add(towerGroup);

    // Hangar
    const hangarGeometry = new THREE.BoxGeometry(60, 25, 40);
    const hangarMaterial = new THREE.MeshStandardMaterial({
      color: 0x708090,
      flatShading: true
    });
    const hangar = new THREE.Mesh(hangarGeometry, hangarMaterial);
    hangar.position.set(-60, 12.5, -50);
    hangar.castShadow = true;
    this.scene.add(hangar);
  }

  createMountains() {
    const mountainPositions = [
      { x: 1500, z: -1500, scale: 1.5 },
      { x: -1800, z: -1400, scale: 1.2 },
      { x: 2000, z: 1200, scale: 1.8 },
      { x: -1400, z: 1800, scale: 1.3 },
      { x: 2800, z: -400, scale: 2.0 },
      { x: -2400, z: -800, scale: 1.6 },
      { x: 1000, z: 2400, scale: 1.4 },
      { x: -1000, z: -2600, scale: 1.7 },
      { x: 3000, z: 1500, scale: 2.2 },
      { x: -2800, z: 1200, scale: 1.9 },
      { x: 800, z: -3000, scale: 1.8 },
      { x: -600, z: 3200, scale: 1.5 },
    ];

    mountainPositions.forEach(pos => {
      const mountainGeometry = new THREE.ConeGeometry(80 * pos.scale, 200 * pos.scale, 6);
      const mountainMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        flatShading: true,
      });
      const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
      mountain.position.set(pos.x, 100 * pos.scale, pos.z);
      mountain.castShadow = true;
      mountain.receiveShadow = true;
      this.scene.add(mountain);

      // Snow cap on larger mountains
      if (pos.scale > 1.4) {
        const snowCapGeometry = new THREE.ConeGeometry(30 * pos.scale, 50 * pos.scale, 6);
        const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const snowCap = new THREE.Mesh(snowCapGeometry, snowMaterial);
        snowCap.position.set(pos.x, 175 * pos.scale, pos.z);
        this.scene.add(snowCap);
      }
    });
  }

  createTrees() {
    const treePositions = [];

    // Generate random tree positions (avoiding runway area)
    for (let i = 0; i < 500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 150 + Math.random() * 4500;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      // Avoid runway area
      if (Math.abs(x) < 100 && Math.abs(z) < 300) continue;

      treePositions.push({ x, z, scale: 0.5 + Math.random() * 1.2 });
    }

    treePositions.forEach(pos => {
      const treeGroup = new THREE.Group();

      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(1, 2, 8 * pos.scale, 6);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 4 * pos.scale;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Foliage (low-poly cone)
      const foliageGeometry = new THREE.ConeGeometry(6 * pos.scale, 15 * pos.scale, 6);
      const foliageMaterial = new THREE.MeshStandardMaterial({
        color: 0x228B22,
        flatShading: true,
      });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.y = 12 * pos.scale;
      foliage.castShadow = true;
      treeGroup.add(foliage);

      treeGroup.position.set(pos.x, 0, pos.z);
      this.scene.add(treeGroup);
    });
  }

  createBuildings() {
    const buildingConfigs = [
      // Village near airport
      { x: 200, z: 400, w: 20, h: 15, d: 20, color: 0xDEB887 },
      { x: 250, z: 380, w: 15, h: 12, d: 15, color: 0xF5DEB3 },
      { x: 180, z: 450, w: 18, h: 18, d: 18, color: 0xD2B48C },
      { x: 280, z: 420, w: 12, h: 10, d: 12, color: 0xFFE4C4 },
      // Industrial area
      { x: -400, z: 300, w: 40, h: 20, d: 30, color: 0x708090 },
      { x: -480, z: 350, w: 25, h: 35, d: 25, color: 0x778899 },
      { x: -350, z: 380, w: 30, h: 15, d: 35, color: 0x696969 },
      // Residential area 1
      { x: -300, z: -400, w: 15, h: 12, d: 15, color: 0xFFE4E1 },
      { x: -350, z: -450, w: 18, h: 14, d: 18, color: 0xFFF0F5 },
      { x: -250, z: -380, w: 14, h: 10, d: 14, color: 0xFAF0E6 },
      { x: -380, z: -380, w: 16, h: 16, d: 16, color: 0xFDF5E6 },
      // Town center (larger buildings)
      { x: 800, z: -600, w: 30, h: 40, d: 30, color: 0xB0C4DE },
      { x: 860, z: -580, w: 25, h: 55, d: 25, color: 0xA9A9A9 },
      { x: 750, z: -650, w: 35, h: 30, d: 35, color: 0xC0C0C0 },
      { x: 820, z: -700, w: 20, h: 25, d: 20, color: 0xDCDCDC },
      // Coastal village
      { x: -1200, z: 800, w: 18, h: 12, d: 18, color: 0xFFE4C4 },
      { x: -1150, z: 850, w: 15, h: 10, d: 15, color: 0xFAEBD7 },
      { x: -1250, z: 780, w: 20, h: 14, d: 20, color: 0xFFDEAD },
      // Mountain village
      { x: 1800, z: 1000, w: 16, h: 12, d: 16, color: 0xD2691E },
      { x: 1850, z: 1050, w: 14, h: 10, d: 14, color: 0xCD853F },
      { x: 1750, z: 980, w: 18, h: 15, d: 18, color: 0xDEB887 },
    ];

    buildingConfigs.forEach(config => {
      const buildingGeometry = new THREE.BoxGeometry(config.w, config.h, config.d);
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: config.color,
        flatShading: true,
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(config.x, config.h / 2, config.z);
      building.castShadow = true;
      building.receiveShadow = true;
      this.scene.add(building);

      // Add roof
      const roofGeometry = new THREE.ConeGeometry(
        Math.max(config.w, config.d) * 0.7,
        config.h * 0.3,
        4
      );
      const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.set(config.x, config.h + config.h * 0.15, config.z);
      roof.rotation.y = Math.PI / 4;
      this.scene.add(roof);
    });
  }

  createClouds() {
    for (let i = 0; i < 40; i++) {
      const cloudGroup = new THREE.Group();

      // Create fluffy cloud from multiple spheres
      const numPuffs = 3 + Math.floor(Math.random() * 4);
      // Use MeshBasicMaterial with depthWrite: false to prevent Z-fighting
      const cloudMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,  // Prevents Z-fighting with overlapping transparent objects
      });

      for (let j = 0; j < numPuffs; j++) {
        const puffSize = 30 + Math.random() * 50;
        const puffGeometry = new THREE.SphereGeometry(puffSize, 8, 8);
        const puff = new THREE.Mesh(puffGeometry, cloudMaterial);
        puff.position.set(
          (j - numPuffs / 2) * 40 + Math.random() * 20,
          Math.random() * 25,
          Math.random() * 30
        );
        cloudGroup.add(puff);
      }

      // Position clouds higher in the sky (above typical flight altitude)
      const angle = Math.random() * Math.PI * 2;
      const distance = 800 + Math.random() * 4000;
      cloudGroup.position.set(
        Math.cos(angle) * distance,
        400 + Math.random() * 400,  // Higher: 400-800 instead of 200-500
        Math.sin(angle) * distance
      );

      this.scene.add(cloudGroup);
    }
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
