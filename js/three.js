const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, 1215 / 600, 0.01, 1000);
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
const mixer = new THREE.AnimationMixer(scene);

new THREE.OrbitControls(camera, renderer.domElement);

let actionBench;
let actionDoorLeft;
let actionDoorRight;

document.body.appendChild(canvas.cloneNode(true));
scene.background = new THREE.Color(0xf3f4f6);
canvas.appendChild(renderer.domElement);

camera.position.set(0, 0, 14);
camera.lookAt(0, 0, 0);
renderer.setSize(1215, 600);
renderer.shadowMap.enabled = true;

function animate() {
  requestAnimationFrame(animate);
  mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}

function loadScene() {
  const loader = new THREE.GLTFLoader();
  loader.load('/models/workBenchM.gltf', (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, -3, 0);

    gltf.scene.traverse((x) => {
      if (x instanceof THREE.Light) x.visible = false;
    });

    const clipBench = THREE.AnimationClip.findByName(gltf.animations, 'benchExtendAction');
    const clipDoorLeft = THREE.AnimationClip.findByName(gltf.animations, 'doorAction');
    const clipDoorRight = THREE.AnimationClip.findByName(gltf.animations, 'door1Action');

    actionBench = mixer.clipAction(clipBench);
    actionDoorLeft = mixer.clipAction(clipDoorLeft);
    actionDoorRight = mixer.clipAction(clipDoorRight);

    actionBench.timeScale = -actionBench.timeScale;
    actionDoorLeft.timeScale = -actionDoorLeft.timeScale;
    actionDoorRight.timeScale = -actionDoorRight.timeScale;

    scene.traverse((objMesh) => {
      if (objMesh.isMesh) {
        objMesh.castShadow = true;
        objMesh.receiveShadow = true;
      }
    });
  });
}

function addlights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const pointLightFront = new THREE.PointLight(0xffffff, 1.5);
  pointLightFront.position.set(0, 0, 14);
  scene.add(pointLightFront);

  const pointLightBack = new THREE.PointLight(0xffffff, 1.5);
  pointLightBack.position.set(28, 0, -28);
  // pointLightBack.position.set(0, 0, -14);
  scene.add(pointLightBack);

  const pointLightRight = new THREE.PointLight(0xffffff, 1.5);
  pointLightRight.position.set(28, 0, 0);
  scene.add(pointLightRight);

  const pointLightLeft = new THREE.PointLight(0xffffff, 1.5);
  pointLightLeft.position.set(-28, 0, 0);
  scene.add(pointLightLeft);

  const pointLightBelow = new THREE.PointLight(0xffffff, 1.5);
  pointLightBelow.position.set(0, -28, 0);
  scene.add(pointLightBelow);
}

function actionButtons() {
  document.getElementById('toggle-animation').onclick = () => {
    actionBench.timeScale = -actionBench.timeScale;
    actionDoorLeft.timeScale = -actionDoorLeft.timeScale;
    actionDoorRight.timeScale = -actionDoorRight.timeScale;

    actionBench.paused = false;
    actionDoorLeft.paused = false;
    actionDoorRight.paused = false;

    actionBench.play();
    actionDoorLeft.play();
    actionDoorRight.play();

    actionBench.setLoop(THREE.LoopOnce);
    actionDoorLeft.setLoop(THREE.LoopOnce);
    actionDoorRight.setLoop(THREE.LoopOnce);

    actionBench.clampWhenFinished = true;
    actionDoorLeft.clampWhenFinished = true;
    actionDoorRight.clampWhenFinished = true;
  };
}

loadScene();
addlights();
actionButtons();
animate();
