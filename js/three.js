const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 185 / 185, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
let model;

document.body.appendChild(canvas.cloneNode(true));
renderer.setSize(185, 185);
scene.background = new THREE.Color(0x32cd32);
canvas.appendChild(renderer.domElement);

camera.position.z = 20;
camera.position.y = 3;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  model.rotateY(0.01);
}

function loadScene() {
  const loader = new THREE.GLTFLoader();
  loader.load('/models/workBenchM.gltf', (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // gltf.scene.traverse((x) => {
    //   if (x instanceof THREE.Light) x.visible = false;
    // });

    // scene.traverse((objMesh) => {
    //   if (objMesh.isMesh) {
    //     objMesh.castShadow = true;
    //     objMesh.receiveShadow = true;
    //   }
    // });
  });
}

function addlights() {
  const ambientLight = new THREE.AmbientLight(0x404040);
  const pointLight1 = new THREE.PointLight('white');
  scene.add(ambientLight);
  // pointLight1.position.set(5, 6, 0);
  pointLight1.castShadow = true;
  scene.add(pointLight1);
}

loadScene();
addlights();
animate();
