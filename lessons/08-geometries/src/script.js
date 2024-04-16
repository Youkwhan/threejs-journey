import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/** "GEOMETRIES" doc.
 * we are moving the verticies NOT the mesh.
 *
 * BoxGeometry: rectangular cuboid
 * TextGeometry: text
 * TorusGeometry: torus
 * TorusKnotGeometry: torus knot (good for testing)
 * OctahedronGeometry: octahedron (RAMEL!)
 * LatheGeometry: lathe (create a shape and rotate it around an axis, integrals)
 * ...
 *
 * Subdivisions: correspond to how many triangles should compose the face. By default, it's 1. Meaning that  there will onoly be 2 triangles per face.If we increase the subdivisions, we will have more triangles per face.
 *
 * Why is it important to have many subdivisions/segments?
 * Allows us to move the verticies, which equates to moving the terrain elevation i.e. More triangles  == More details. Cost performance.
 *
 * wireframe:true, will  show the lines that delimit each triangle. (Don't put in production will see 'stairs')
 */

/**
 * BufferGeometry
 * - A way to store multiple geometries.
 * How to store buffer gemoetry data? Float32Array: Typed array, can only store floats, fixed length, and easier to handle for cpu.
 *
 */

// Object
const geometry = new THREE.BufferGeometry();

// We need 50 triangles. Each triangle is composed of 3 verticies and each vertex is composed of 3 values (x,y,z)
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  // remember -0.5 to center it bcz 0 to 1 vs -0.5 to 0.5
  positionsArray[i] = (Math.random() - 0.5) * 4;
}

const positionsAtrribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAtrribute);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
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
