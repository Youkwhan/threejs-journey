import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Textures
 */
// LoadingManager - Mutualizethe events: to keep track of global loading progress or be informed when  everything is loaded/pending data (fonts, models, textures, etc.)
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log('loading started');
};
loadingManager.onLoad = () => {
  console.log('loading finished');
};
loadingManager.onProgress = () => {
  console.log('loading progressing');
};
loadingManager.onError = () => {
  console.log('loading error');
};

const textureLoader = new THREE.TextureLoader(loadingManager);
// textureLoader.load(PARAMETERS): path, load (when the image loaded successfully), progress (when the loading is  progressing/ not recommended to use), error (if something went wrong).
const colorTexture = textureLoader.load('/textures/minecraft.png');
colorTexture.colorSpace = THREE.SRGBColorSpace; // for better color representation encode in sRGB.
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

/**
 * UV UNWRAPPING
 *
 * The texture is being stretched or squeezed in different ways to cover the  geometry.
 *
 * This is  called UV unwrapping and it's like unwrapping an origami or a candy wrap to make it flat.
 *
 * Each vertex will have a 2D coordinate on a flat place (usually a square).
 *
 * IT'S LIKE UNWRAPPING A 3D object flat onto a piece of PAPER!!!
 *
 * SUMMARY:
 * The Texture gets placed on the geometry in a very specific way (coordinates) because there are UV coordinates set for each vertex.
 */

/**
 * TRANSFORMING TEXTURE
 *
 * 1. Repeat: The texture is repeated over the geometry.
 * 2. Wrap: The texture is wrapped over the geometry.
 * 3. Mirror: The texture is mirrored over the geometry.
 * 4. Offset: The texture is offset over the geometry.
 * 5. Rotation: The texture is rotated over the geometry.
 * 6. Center: The texture is centered over the geometry.
 * 7. Transform: The texture is transformed over the geometry.
 * 8. Scale: The texture is scaled over the geometry.
 * 9. Flip: The texture is flipped over the geometry.
 */

// Testing on the colorTexture
// Repeat property is a Vector2 with x and y properties
// By default, the texture doesn't repeat and the LAST PIXEL get stretched! (MAY WANT THIS ;))
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;

// We can fix that by adding THREE.RepeatWrapping on wrapS and wrapT properties
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// rotating in 2d space (not Vector). At (0,0) UV coordinates
// colorTexture.rotation = Math.PI * 0.25;
// Move pivot point from bottom-left to the center
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

/**
 * FILTERING and MIPMAPPING
 * 
 * - If you look at the cube's top face really close almost hidden, you'll see a blurry texture. This is good!
 * - This is due to the filtering and the mipmapping
 *
 * MIP MAPPING - is a technique that consist of creating half a smaller version of a texture again  and again until we get a 1x1 texture.
 * (All those texture variations are sent to the GPU, and the GPU will choose the most appropriate version of the texture.)
 * 
 * Two types of FILTER algorithm:
 * 1. minification filter
 * 2. magnification filter
 * 
 * MINIFICATION FILTER: (when texture is too big for the render)
 * The `minification filter`(1) happens when the pixels of texture are smaller than the pixels of the render. In other words, the texture is too big for the surface, it covers.
 * 
 * You can change the minification filter of the texture using the minFilter property.
 * 
 * There are 6 possible values:
    THREE.NearestFilter
    THREE.LinearFilter
    THREE.NearestMipmapNearestFilter
    THREE.NearestMipmapLinearFilter
    THREE.LinearMipmapNearestFilter
    THREE.LinearMipmapLinearFilter
  * The default is THREE.LinearMipmapLinearFilter.
  *
  * MAGNIFICATION FILTER: (When the texture is too small for the surface it covers)
  * The `magnification filter`(2) works just like the minification filter, but when the pixels of the texture are bigger than the render's pixels. In other words, the texture too small for the surface it covers.
  * This is good bcz if not too exaggerated it will blend and stretch the user may not notice.
  * 
  * !!!
  * THREE.NearestFilter (Sharpness)
  *   - is CHEAPER performance than the other ones and if the  result is fine with you just use it
  * 
 */

// When using THREE.NearestFilter on `minFilter`, we don't need mipmaps since we are not generating bunch of 1x1 textures and sending it to the GPU.(performaces) Thus, deactivate the mipmaps:
colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;

// colorTexture.magFilter = THREE.LinearFilter // Default
colorTexture.magFilter = THREE.NearestFilter;

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
const geometry = new THREE.BoxGeometry(1, 1, 1);
// // Or
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// // Or
// const geometry = new THREE.ConeGeometry(1, 1, 32);
// Or
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
