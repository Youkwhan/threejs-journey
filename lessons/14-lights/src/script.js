import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
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
 * Lights
 *
 * Lights can COST a lot when it comes to performances
 * Try to add as few lights as possible and try to use the lights that cost less.
 *
 * Minimal cost: AmbientLight, HemisphereLight
 * Moderate cost:  DirectionalLight, PointLight
 * High cost: SpotLight, RectAreaLight
 *
 * Baking:
 * The idea is to bake  the light into the texture.
 * This can  be  done in a 3D  software
 * The  drawback is that  we cannot move the light anymore  and we have to load huge textures.
 *
 * Helpers:
 * To assist us with positioning the lights, we can use helpers,
 * -  HemisphereLightHelper
 * - DirectionalLightHelper
 * - PointLightHelper
 * - RectAreaLightHelper
 * - SpotLightHelper
 */

/*
 * AmbientLight, omnidirectional lighting:
 * Good way to simulate light bouncing, which is very hard in irl. Thus we can use ambientLight in combination with directional light to simulate light bouncing
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001);

/*
 * DirectionalLight (sun rays) above + dim AmbientLight below creating the effect of light bouncing from the ground to behind the object.
 * (ambient below, directional above)
 *
 */
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001);

// Similar to AmbientLight but with a different color from the sky and coming from the ground.
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
scene.add(hemisphereLight);

// PointLight is almost like a lighter. The light starts at an infinitely small point and spreads uniformly in every direction
const pointLight = new THREE.PointLight(0xff9000, 1.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

// RectAreaLight works like the big rectrangle lights you can see on the photoshoot set
// mix between directional light and a diffuse light
// only work with MeshStandardMaterial and MeshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
// lookAt() good way to orientate lights/scenes
rectAreaLight.lookAt(new THREE.Vector3()); // after we move, now look at the center of the scene (0,0,0)
scene.add(rectAreaLight);

// SpotLight is like a flashlight.
// It's a cone of light starting at a point and oriented in a direction
const spotLight = new THREE.SpotLight(
  0x78ff00,
  4.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

spotLight.target.position.x - 0.75;
scene.add(spotLight.target);

// HELPERS
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

// The SpotLightHelper has no size
// We  need to call its update() method on the next frame after moving the target
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
window.requestAnimationFrame(() => {
  spotLightHelper.update();
});

// Not part of the THREE variable,  must import
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
