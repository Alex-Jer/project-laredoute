const materialsButton = document.getElementById('materials');

const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, 1215 / 600, 0.01, 1000);
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
const mixer = new THREE.AnimationMixer(scene);

new THREE.OrbitControls(camera, renderer.domElement);

let workbench;
let stonebench;
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
      // console.log(objMesh.name);
      workbench = scene.getObjectByName('workBench');
      stonebench = scene.getObjectByName('stoneBench');
      if (!objMesh.isMesh) return;
      objMesh.castShadow = true;
      objMesh.receiveShadow = true;
    });
  });
}

let isLightOn = true;
const pointLightFront = new THREE.PointLight(0xffffff, 1.5);
const pointLightBack = new THREE.PointLight(0xffffff, 1.5);
const pointLightRight = new THREE.PointLight(0xffffff, 1.5);
const pointLightLeft = new THREE.PointLight(0xffffff, 1.5);
const pointLightBelow = new THREE.PointLight(0xffffff, 1.5);

/**
 * Adiciona os pontos de luz ao canvas
 */
function addLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  ambientLight.name = 'ambientLight';
  scene.add(ambientLight);

  pointLightFront.position.set(0, 0, 54);
  pointLightFront.name = 'PointLightFront';
  scene.add(pointLightFront);

  pointLightBack.position.set(28, 0, -28);
  pointLightBack.name = 'PointLightBack';
  scene.add(pointLightBack);

  pointLightRight.position.set(28, 0, 0);
  pointLightRight.name = 'PointLightRight';
  scene.add(pointLightRight);

  pointLightLeft.position.set(-28, 0, 0);
  pointLightLeft.name = 'PointLightLeft';
  scene.add(pointLightLeft);

  pointLightBelow.position.set(0, -28, 0);
  pointLightBelow.name = 'PointLightBelow';
  scene.add(pointLightBelow);
}

/**
 * Corre as animações de abrir e fechar a workbench
 */
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

/**
 * Liga/Desliga as luzes
 */
function toggleLights() {
  isLightOn = !isLightOn;
  pointLightFront.intensity = isLightOn;
  pointLightBack.intensity = isLightOn;
  pointLightRight.intensity = isLightOn;
  pointLightLeft.intensity = isLightOn;
  pointLightBelow.intensity = isLightOn;
}

/**
 * Responsável por ligar/desligar a luz
 */
document.getElementById('luz').onclick = () => toggleLights();

/**
 * Responsável por trocar a textura do tampo e da workbench
 */
materialsButton.onchange = () => {
  if (!workbench) return;
  if (!stonebench) return;

  if (materialsButton.value === 'marble') {
    workbench.material.map = new THREE.TextureLoader().load('/models/materials/Marble018_1K_Color.jpg');
    stonebench.material.map = new THREE.TextureLoader().load('/models/materials/Wood051_1K_Color.png');
    return;
  }

  workbench.material.map = new THREE.TextureLoader().load('/models/materials/Wood051_1K_Color.png');
  stonebench.material.map = new THREE.TextureLoader().load('/models/materials/Marble018_1K_Color.jpg');
};

/**
 * Coloca a câmera na posição default
 */
document.getElementById('reset').onclick = () => {
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);
};

let isContrastOn = false;

/**
 * Ativa/Desativa o modo de alto contraste (background claro/escuro)
 */
document.getElementById('contraste').onclick = () => {
  isContrastOn = !isContrastOn;
  if (isContrastOn) return (scene.background = new THREE.Color(0x181d1f));
  return (scene.background = new THREE.Color(0xf3f4f6));
};

loadScene();
addLights();
animate();
