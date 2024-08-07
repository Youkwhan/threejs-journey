import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

/**
 * DEBUG UI
 * - npm install lil-gui
 *
 * Types of tweaks
 * - Range / sliders - min and max values
 * - Color - color picker
 * - Text - strings
 * - Checkbox - booleans
 * - Select - choice from a list of values
 * - Button - trigger functions
 *
 * Most tweaks can be added with gui.add(_,_)
 * - The object
 * - The property of that object you want to change.
 *
 * Doc - lil-gui.georgealways.com
 * */
const gui = new GUI({
  width: 340,
  title: 'Nice debug UI',
  closeFolders: false,
});
// gui.close();
gui.hide();

window.addEventListener('keydown', (event) => {
  if (event.key == 'h') {
    gui.show(gui._hidden);
  }
});
const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
debugObject.color = '#3a63a6';

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// DEBUG UI, CREATING FOLDERS/TABS
const cubeTweaks = gui.addFolder('Awesome cube');
cubeTweaks.close();
// You can nest folders

// DEBUG UI, elevation 'y' property of the mesh
// [object][property]  == [mesh.position][.y]
//gui.add(mesh.position, 'y', -3, 3, 0.01); // min, max, step
cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');

// DEBUG UI, checkbox to toggle visibility of the mesh
cubeTweaks.add(mesh, 'visible');

// DEBUG UI, wireframe property of the material
cubeTweaks.add(material, 'wireframe');

// DEBUG UI, color proptery of the material
// color is an object, an instance of the THREE.js Color class.
cubeTweaks.addColor(debugObject, 'color').onChange(() => {
  material.color.set(debugObject.color);
});

// Debug UI, function that can toggle rotation
debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};
cubeTweaks.add(debugObject, 'spin');

// Tweaking the Geometry, aka the subdivisions
debugObject.subdivision = 2;
cubeTweaks
  .add(debugObject, 'subdivision')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
