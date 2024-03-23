import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene is like a container. You place your objects, models, particles, lights, etc. in it, and at some point, you ask Three.js to render that scene.
const scene = new THREE.Scene();

// Objects can be many things.
// A Mesh is a combination of a geometry (the shape) and a material (how it looks)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera is not visable. It's more like a theoretical POV.
// size for our aspect-ratio
const sizes = {
  width: 800,
  height: 600,
};

// Camera, Field of view: 35 usually is good
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// WebGLRenderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
