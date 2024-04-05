import * as THREE from 'three';

/**
 * Cursor coordinates
 *
 * Instead of exact pixel values, we convert it into 0.0 to 1.0 for all screen sizes.
 *
 * In web browser center is top left, and +x goes right and +y goes down
 * In Three.js the center is the located at the center and based on the right-handed system. +y goes up
 */
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener('mousemove', (event) => {
  // console.log(event.clientX)
  cursor.x = event.clientX / sizes.width - 0.5; // -0.5 to 0.5, instead of 0 to 1.
  cursor.y = -(event.clientY / sizes.height - 0.5); // The y axis must be negated because the cursor.y is positive when going down while Threejs y is positive when going up.
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Sizes of our canvas
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100); // (left, right, top, bottom,near,far), camera is a box render but affected by canvas size. Thus solution is aspect ratio
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  //   mesh.rotation.y = elapsedTime;

  // Update camera, animate around our cursor
  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3; // (x * 2*PI for full revolutions) *3 to go farther away
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3; // to rotate around the flat plane
  camera.position.y = cursor.y * 5;
  // We are going to ask the camera to look at our cube after moving it so that we are always centered on the cube regardless of the `camera.position`
  // camera.lookAt(new THREE.Vector3()) // default Vector3(0,0,0)
  camera.lookAt(mesh.position); // mesh is our cube and our cube is at the center not moving ;p

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
