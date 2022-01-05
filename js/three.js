const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, 1215 / 600, 0.01, 1000);
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
const mixer = new THREE.AnimationMixer(scene);

const newMaterial = new THREE.MeshNormalMaterial();
let defaultWorkbenchMaterial = null;
let defaultStonebenchMaterial = null;

new THREE.OrbitControls(camera, renderer.domElement);

let workbench;
let stonebench;
let actionBench;
let actionDoorLeft;
let actionDoorRight;
let isLightOn = true;

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
      // console.log(objMesh.name);
      workbench = scene.getObjectByName('workBench');
      stonebench = scene.getObjectByName('stoneBench');
      if (!objMesh.isMesh) return;
      objMesh.castShadow = true;
      objMesh.receiveShadow = true;
    });
  });
}

function addLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  ambientLight.name = 'ambientLight';
  scene.add(ambientLight);

  const pointLightFront = new THREE.PointLight(0xffffff, 1.5);
  pointLightFront.position.set(0, 0, 54);
  pointLightFront.name = 'PointLightFront';
  scene.add(pointLightFront);

  const pointLightBack = new THREE.PointLight(0xffffff, 1.5);
  pointLightBack.position.set(28, 0, -28);
  pointLightBack.name = 'PointLightBack';
  scene.add(pointLightBack);

  const pointLightRight = new THREE.PointLight(0xffffff, 1.5);
  pointLightRight.position.set(28, 0, 0);
  pointLightRight.name = 'PointLightRight';
  scene.add(pointLightRight);

  const pointLightLeft = new THREE.PointLight(0xffffff, 1.5);
  pointLightLeft.position.set(-28, 0, 0);
  pointLightLeft.name = 'PointLightLeft';
  scene.add(pointLightLeft);

  const pointLightBelow = new THREE.PointLight(0xffffff, 1.5);
  pointLightBelow.position.set(0, -28, 0);
  pointLightBelow.name = 'PointLightBelow';
  scene.add(pointLightBelow);
}

function toggleLights() {
  if (isLightOn) {
    isLightOn = false;
    scene.remove(scene.getObjectByName('PointLightFront'));
    // scene.remove(scene.getObjectByName('PointLightBack'));
    // scene.remove(scene.getObjectByName('PointLightLeft'));
    // scene.remove(scene.getObjectByName('PointLightRight'));
    // scene.remove(scene.getObjectByName('PointLightBelow'));
    renderer.render(scene, camera);
  } else {
    isLightOn = true;
    // const pointLightFront = new THREE.PointLight('red');
    // pointLightFront.position.set(0, 0, 54);
    // pointLightFront.name = 'PointLightFront';
    // scene.add(pointLightFront);
    // renderer.render(scene, camera);
  }
  console.log(scene.children);
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

  document.getElementById('material').onclick = () => {
    if (!workbench) return;
    // if (defaultWorkbenchMaterial) return;
    // defaultWorkbenchMaterial = workbench.material;

    // if (!stonebench) return;
    // if (defaultStonebenchMaterial) return;
    // defaultStonebenchMaterial = stonebench.material;

    toggleLights();

    if (!isLightOn) {
      workbench.material.map = new THREE.TextureLoader().load('/models/materials/Marble018_1K_Color.jpg');
      stonebench.material.map = new THREE.TextureLoader().load('/models/materials/Wood051_1K_Color.png');
    } else {
      workbench.material.map = new THREE.TextureLoader().load('/models/materials/Wood051_1K_Color.png');
      stonebench.material.map = new THREE.TextureLoader().load('/models/materials/Marble018_1K_Color.jpg');
    }
  };
}

loadScene();
addLights();
actionButtons();
animate();
