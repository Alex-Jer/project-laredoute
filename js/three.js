const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(45, 185 / 185, 0.1, 1000);
const camera = new THREE.PerspectiveCamera(70, 1215 / 600, 0.01, 1000);
const renderer = new THREE.WebGLRenderer();
new THREE.OrbitControls(camera, renderer.domElement);
let model;

document.body.appendChild(canvas.cloneNode(true));
scene.background = new THREE.Color(0xf3f4f6);
canvas.appendChild(renderer.domElement);

camera.position.set(0, 0, 14);
camera.lookAt(0, 0, 0);
renderer.setSize(1215, 600);
renderer.shadowMap.enabled = true;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function loadScene() {
  const loader = new THREE.GLTFLoader();
  loader.load('/models/workBenchM.gltf', (gltf) => {
    model = gltf.scene;
    scene.add(model);
    model.position.set(0, -3, 0);

    gltf.scene.traverse((x) => {
      if (x instanceof THREE.Light) x.visible = false;
    });

    scene.traverse((objMesh) => {
      if (objMesh.isMesh) {
        objMesh.castShadow = true;
        objMesh.receiveShadow = true;
      }
    });
  });
}

function addlights() {
  const ambientLight = new THREE.AmbientLight();
  ambientLight.castShadow = true;
  scene.add(ambientLight);

  const pointLightFront = new THREE.PointLight('white');
  pointLightFront.position.set(0, 0, 14);
  scene.add(pointLightFront);

  const pointLightBack = new THREE.PointLight('white');
  pointLightBack.position.set(0, 0, -14);
  scene.add(pointLightBack);

  const pointLightRight = new THREE.PointLight('white');
  pointLightRight.position.set(28, 0, 0);
  scene.add(pointLightRight);

  const pointLightLeft = new THREE.PointLight('white');
  pointLightLeft.position.set(-28, 0, 0);
  scene.add(pointLightLeft);

  const pointLightBelow = new THREE.PointLight('white');
  pointLightBelow.position.set(0, -28, 0);
  scene.add(pointLightBelow);
}

loadScene();
addlights();
animate();
