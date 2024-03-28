import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Axis
const axesHelper = new THREE.AxesHelper(3); // default length is 1 unit
scene.add(axesHelper);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// camera.position.z = 3;
camera.position.set(1, 1, 3.5);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animations
/*
// 1. The purpose of requestAnimationFrame is NOT FOR ANIMATION! The initial purpose is to call a funciton on the next frame and on each NEW frame it will call itself again.

// Time
let time = Date.now();

function tick() {
  // gameLoop or tick per frames

  // Timestamp, deltaTime so everyone has same tick speed regardless of the user's frame rate.
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  //Update object
  mesh.rotation.y += 0.001 * deltaTime;

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();
*/

// 2. Clock, alternative to deltaTime Date.now()
const clock = new THREE.Clock();
function tick() {
  //Clock
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // 1 revolution per sec = 2*PI * elapsedTime(sec)
  //mesh.rotation.y = elapsedTime * Math.PI * 2;

  // cube moves in a circle
  // mesh.position.y = Math.sin(elapsedTime); // starts at 0
  // mesh.position.x = Math.cos(elapsedTime); // starts at 1

  camera.position.y = Math.sin(elapsedTime);
  camera.position.x = Math.cos(elapsedTime);
  camera.lookAt(mesh.position);

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();
