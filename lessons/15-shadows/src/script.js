import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Shadows
 *
 * With lights, we have the dark shadow in the  back of the objects called CORE SHADOW
 * What we are missing are DROP SHADOWS
 *
 *
 * LIFECYCLE:
 * 1. When you do one render, Three.js will do a render for each light supporting shadows.
 * 2. Those renders will simulate what the light sees as if it was a camera.
 * 2.1. During these lights renders, a MeshDepthMaterial replaces all meshes material to calculate the depth.
 * 3. The lights renders are then stored as textures and we call those SHADOW MAPS
 * 3.1 They are then used on every materials supposed to receive shadows and projected on the geometry
 *
 * Only 3 types of lights support shadows
 * - PointLight
 * - DirectionalLight
 * - SpotLight
 *
 * Mixing shadows doesn't look good  and there is not much to do about it.
 */

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001);
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(directionalLight);

directionalLight.castShadow = true;

// Improve the render size of the shadowmap
// keep in mind that you need a power of 2 value for the mipmapping
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
// console.log(directionalLight.shadow.camera);

// Avoid bugs and shadow glitches by giving near and far constraint for the shadowmap camera
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

// shadowmap render is to large, reduce the Amptitude to control how far on each side the camera can see
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

// Blur
// This technique doesn't use the proximity of the camera with the object, it's a general and cheap blur
directionalLight.shadow.radius = 10;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// SpotLight
const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target); // adding an invisible target to update to

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);

/**
 * Objects
 */
// Go through each object and decide if it can cast a shadow with caseShadow and if it can receive shadow with receiveShadow
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

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

// enable shadow maps on the renderer
renderer.shadowMap.enabled = true;

/**
 * Shadow map algorithm
 * Different types of algorithms can be applied to shadow maps:
 *
 * THREE.BasicShadowMap: Very performant but lousy quality
 * THREE.PCFShadowMap: Less performant but smoother edges
 * THREE.PCFSoftShadowMap: Less performant but even softer edges
 * THREE.VSMShadowMap: Less performant, more constraints, can have unexpected results
 * To change it, update the renderer.shadowMap.type property. The default is THREE.PCFShadowMap but you can use THREE.PCFSoftShadowMap for better quality.
 */
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// radius doesn't work with THREE.PCFShadowMap

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
