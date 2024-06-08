import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader(); // helps us load a texture

const doorColorTexture = textureLoader.load('./textures/door/color.jpg'); // public folder so ./textures
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  './textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load(
  './textures/door/metalness.jpg'
);
const doorRoughnessTexture = textureLoader.load(
  './textures/door/roughness.jpg'
);
const matcapTexture = textureLoader.load('./textures/matcaps/1.png');
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Object
 */

//  MATERIALS CAN HAVE DRASTIC IMPACT ON PERFORMANCE, maybe use matcap

// MeshBasicMaterial properties (similar to other Mesh materials)
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture // map property: Apply a texture on the surface of the geometry
// material.color = new THREE.Color('#ff0000'); // color: will apply a uniform color on the surface of the geometry (MUST instantiate a Color class directly)
// material.wireframe = true; // Show triangles that compose the geometry - line of  1px.
// material.transparent = true;
// material.opacity = 0.5; // The opacity controls the transparencey, Need both
// material.alphaMap = doorAlphaTexture; // when white visible, when black transparent
// material.side = THREE.DoubleSide; // Decides which side of the faces is visible.
// THREE.FrontSide(default), THREE.BackSide, THREE.DoubleSide (Avoid performance resources)

/**
 *  MeshNormalMaterial
 *
 * "Normals" (the arrows) are information encoded in each vertex that contains the direction going outside of the face. The color will display the normal orientation relative to the camera
 * Used for calculating light, illuminating the face or how the environment should reflect or refract on geometries surface.
 * MeshNormalMaterial USEFUL to debug the normals. When light isn't spotted as it should. Or just use it the way it is.
 * */
// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true; //flat surface flat  faces

/**
 * MeshMatcapMaterial
 *
 * Looks great while remaining performant
 * Needs a referencetexture that LOOKS like a SPHERE
 *
 * The material will  pick colorsfrom the texture according to the normal orientation relative to the camera
 *
 * Problem:
 * The meshes appear illuminated, but its an ilusion created by the texture
 * Problem is the result is the same regardless of camera orientation we cannot update the light
 * */
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

/**
 * MeshDepthMaterial
 *
 * Color the geometry in white if it's close  to the camera's `near` value and in black if it's close to the `far` value.
 *
 * used for complex computations like shadows
 */
// const material = new THREE.MeshDepthMaterial();

/**
 * MeshLambertMaterial
 *
 * material requies LIGHT!
 *
 * Supports the same properties as the MeshBasicMaterial but also some preperties related to light
 *
 * MeshLambertMaterial is the most performant material that uses lights, but hard to get realistic look for complex shapes
 */
// const material = new THREE.MeshLambertMaterial();

/** MeshPhongMaterial
 *
 * Less performant than MeshLambertMaterial bcz access to more features
 *
 * not realistic look bcz its an arbitrary location, buy cool for other shapes
 */
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100; // bigger the more shiny it looks
// material.specular = new THREE.Color(0x1188ff);

/** MeshToonMaterial
 *
 * maaterial implementing toon shading. (shell shading)
 *
 * used in many ds games, zelda phantom
 *
 * By  default, you only get a two-part coloration (one for the shadow and one for the light)
 *
 * To add more steps, you can use the gradientTexture jpg on the gradientMap property
 *  - If you use a very small gradient texture jpg that is like 3x1 pixels and then stretch it the GPU will merge and blend them together losing our seperation of colors.
 * -  minFilter/magFilter == minify/magnify and  combine to NearestFilter
 *  - We can control how the GPU handles such texture thanks to minFilter and magFilter
 *
 * because the THREE.NearestFilter isn’t actually using any mipmap versions of the texture (the different sizes per pixels it generates), we can deactivate the generation of the mipmaps in order to free some memory by setting gradientTexture.generateMipmaps to false:
 *
 */
// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

/** MeshStandardMaterial !important
 *
 * uses physcially based (physical object) rendering principles, isntead of guessing where to put the light
 *
 * support lights but with more realistic algorithm and better parameters like roughness and metalness
 */
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1; //small rough is smooth so more reflection
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture; // aoMap adds details so light cant go  through these outlines of the shape. (panel lining)
// material.aoMapIntensity = 1;

// //depth
// material.displacementMap = doorHeightTexture;
// // requires  more subdivisions to  the Mesh when it implodes inward
// material.displacementScale = 0.1;
// // adding textures to metal and roughness  so our texture enables  only certain parts
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// //  details  react to light
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);

// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// gui.add(material, 'metalness').min(0).max(1).step(0.0001);
// gui.add(material, 'roughness').min(0).max(1).step(0.0001);

/**
 * MeshPhyscialMaterial
 *
 * same as MeshStandardMaterial but with support of  additional effects, extends the class (inherit)
 * - clearcoat
 * -  sheen
 * - iridesecence
 * -  transmission
 */
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 1;
material.roughness = 1; //small rough is smooth so more reflection
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture; // aoMap adds details so light cant go  through these outlines of the shape. (panel lining)
material.aoMapIntensity = 1;
//depth
material.displacementMap = doorHeightTexture;
// requires  more subdivisions to  the Mesh when it implodes inward
material.displacementScale = 0.1;
// adding textures to metal and roughness  so our texture enables  only certain parts
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
//  details  react to light
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaMap = doorAlphaTexture;
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);

//Clearcoat
// simulate a thin layer of varnish  on top of the actual material,  with  its own  reflective properties, bad performance
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;

// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001);
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001);

// Sheen
// Highlights the material when seen from a narrow angle
// Usually on fluffy material like fabric
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);

// gui.add(material, 'sheen').min(0).max(1).step(0.0001);
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001);
// gui.addColor(material, 'sheenColor');

//Iridescence
// Creates color artifacts like a fuel puddle, soap bubbles, or even LaserDiscs
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001);
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001);
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1);

// Transmission
//
// Enable light too go through the material
// Better than transparency with `opacity` because  the image behind the object gets deformed by the refracted light
//
// ior (Index Of Refraction) and depends on the type of material you want to stimulate
//  Diamond:2.417, Water:1.333, Air:1.000293
//
// Remove all maps(texture?) and  set the metalness  and  roughness to 0 !!!!!! LOOKS LIKE DRAGONBALLS lol
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

gui.add(material, 'transmission').min(0).max(1).step(0.0001);
gui.add(material, 'ior').min(1).max(10).step(0.0001);
gui.add(material, 'thickness').min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Light
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1); // (color, intensity)
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);
// scene.add(new THREE.AxesHelper());

/**
 * Environment map
 *
 * We can see the environment as our Lighting :o
 */
const rgbeLoader = new RGBELoader();
// need callback
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environemntMap) => {
  environemntMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environemntMap;
  scene.environment = environemntMap;
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
