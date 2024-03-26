import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Three {
  constructor(myCanvas = "#myCanvas") {
    const width = 960;
    const height = 540;
    this.boxSize = 10;
    this.gridSizeX = 20;
    this.gridSizeY = 20;
    const canvas = document.querySelector(`${myCanvas}`);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.scene = new THREE.Scene();
    this.wrap = new THREE.Group();
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.scene.add(this.camera);
    this.camera.position.set(0, 180, 150);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    const axesHelper = new THREE.AxesHelper(1);
    this.scene.add(axesHelper);

    const light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 10;
    light.position.set(1, 1, 1);
    this.scene.add(light);
  }

  createGridMap = (gridSizeX, gridSizeY) => {
    this.gridSizeX = gridSizeX;
    this.gridSizeY = gridSizeY;
    const gridGeometry = new THREE.PlaneGeometry(this.boxSize, this.boxSize);
    const edgesGeometry = new THREE.EdgesGeometry(gridGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x121212,
      blending: THREE.AdditiveBlending,
      depthWrite: true,
    });

    const geometry = new THREE.BoxGeometry(
      this.boxSize,
      this.boxSize,
      this.boxSize
    );
    const material = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.mesh = new THREE.InstancedMesh(geometry, material, 50 * 51);

    this.scene.add(this.mesh);

    //idは0からの連番。
    let count = 0;
    for (let i = 0; i < this.gridSizeX; i++) {
      for (let j = 0; j < this.gridSizeY; j++) {
        const color = new THREE.Color(0x131415);

        const cellMatrix = this.createMatrix4(i, 0, j);
        const gridMatrix = this.createMatrix4(i, 0, j);
        const id = count;
        this.mesh.setMatrixAt(id, cellMatrix);
        this.mesh.setColorAt(id, color);
        this.mesh.instanceColor.needsUpdate = true;
        this.mesh.instanceMatrix.needsUpdate = true;
        const line = new THREE.LineSegments(edgesGeometry, lineMaterial);
        line.applyMatrix4(gridMatrix);
        line.rotation.x = -Math.PI / 2;
        this.wrap.add(line);
        count++;
      }
    }
    this.scene.add(this.wrap);
  };

  createMatrix4 = (x, y, z) => {
    const matrix = new THREE.Matrix4();
    const boxInterval = 10;
    const offsetX = (this.boxSize * this.gridSizeX) / 2 - boxInterval / 2;
    const offsetZ = (this.boxSize * this.gridSizeY) / 2 - boxInterval / 2; //3次元上に2次元盤面を描画するため、YをZに
    matrix.setPosition(10 * x - offsetX, y, 10 * z - offsetZ);
    return matrix;
  };

  raycasterTarget = () => {
    //cameraの向きに応じて円筒状に範囲が変化？
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    const mapIntersects = intersects.filter(
      (value) => value.object.isInstancedMesh
    );
    return mapIntersects;
  };

  pointerHitObject = (x, y, width, height) => {
    this.mouse.x = (x / width) * 2 - 1;
    this.mouse.y = -(y / height) * 2 + 1;
  };

  getRaycastTarget = () => {
    const intersects = this.raycasterTarget();
    if (intersects.length > 0) {
      console.log(intersects);
      //エディタでの型推論のため。idがundefinedになることは無い。
      const id = intersects[0].instanceId ?? 0;
      return { found: true, id: id };
    }
    return { found: false, id: 0 };
  };

  analyserMeshUpdate = (board) => {
    if (board) {
      // Boxの描画の更新
      let count = 0;
      this.gridSizeX = board.length;
      this.gridSizeY = board[0].length;
      for (let i = 0; i < this.gridSizeX; i++) {
        for (let j = 0; j < this.gridSizeY; j++) {
          const tt = board[i][j];
          const color = tt?.alive
            ? new THREE.Color(0x222334)
            : new THREE.Color(0x000000);

          const matrix = this.createMatrix4(i, 0, j);
          const id = count;
          this.mesh.setMatrixAt(id, matrix);
          this.mesh.setColorAt(id, color);
          this.mesh.instanceColor.needsUpdate = true;
          this.mesh.instanceMatrix.needsUpdate = true;
          count++;
        }
      }
      const gridCount = this.gridSizeX * this.gridSizeY;
      const cColor = new THREE.Color(0x0000000);
      const dermatrix = this.createMatrix4(-1, -1, -1);
      for (let i = gridCount; i <= this.mesh.count; i++) {
        this.mesh.setMatrixAt(i, dermatrix);
        this.mesh.setColorAt(i, cColor);
        this.mesh.instanceColor.needsUpdate = true;
        this.mesh.instanceMatrix.needsUpdate = true;
      }
    }
  };

  onResize = (windowWidth) => {
    // レンダラーのサイズを調整する
    const canvasWidth = windowWidth * 0.95;
    const width = canvasWidth <= 800 ? canvasWidth : 800;
    const height = (width / 16) * 9;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  onGridResize = () => {
    const gridGeometry = new THREE.PlaneGeometry(this.boxSize, this.boxSize);
    const edgesGeometry = new THREE.EdgesGeometry(gridGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x121212,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.wrap.clear();

    for (let i = 0; i < this.gridSizeX; i++) {
      for (let j = 0; j < this.gridSizeY; j++) {
        const gridMatrix = this.createMatrix4(i, 0, j);
        const line = new THREE.LineSegments(edgesGeometry, lineMaterial);
        line.applyMatrix4(gridMatrix);
        line.rotation.x = -Math.PI / 2;
        this.wrap.add(line);
      }
    }
  };

  threeUpdate = () => {
    const intersects = this.raycasterTarget();
    if (intersects.length > 0) {
      const id = intersects[0].instanceId;
      const color = new THREE.Color(0x281828);
      this.mesh.setColorAt(id, color);
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
