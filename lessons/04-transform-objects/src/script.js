import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
// scene.add(mesh);

// == SCENE GRAPH ==
// You can put objects inside groups
// Group class is an instance of a Object3D
const group = new THREE.Group();
group.position.y = 1;
group.scale.y = 2;
group.rotation.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = -2;
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2;
group.add(cube3);

// == Position ==
// The position property is not an object, but an instance of the `Vector3` class.
// length of a vector (distance from the center 0,0)
// console.log(mesh.position.length());
//Normazlie vector values (meaning you will reduce the length of the vector to 1 unit, but preserve its direction)
// console.log(mesh.position.normalize());
// To change the vector3 values
// mesh.position.set(0.7, -0.6, 1);

// == Scale ==
// instance of the Vector3 class
// mesh.scale.x = 2;
// mesh.scale.y = 0.25;
// mesh.scale.z = 0.5;
// mesh.scale.set(2, 0.5, 0.5);

// == Rotate ==
// With `rotation` or with `quarternion`.
// 1. Updating one will automatically update the other!

// Rotation, instance of the Euler class (made to do rotation not Vectors)
// Params: x,y,x (optional) the angle of rotation in radians around THAT/THIS axis.
// - order(optional): order that the rotation are applied, default 'XYZ'.
// !! Half a roation is Math.PI, 3.14159. A = 2Pi*r (r rotating 2PI times)
// mesh.rotation.reorder('YXZ');
// mesh.rotation.y = Math.PI * 0.25;
// mesh.rotation.x = Math.PI * 0.25;
// Careful of `gimbal lock`, order of rotation important. i.e. FPS game our head rotates on the y before x to look around.

// Quaterion (Fixes a lot of problems ordering), also expresses a rotation, but in a more mathematical way, matrices.
//

// == AxesHelper ==
// AxesHelper class, an axis object to help visualize the 3 axes in a simple way.
const axesHelper = new THREE.AxesHelper(3); // default length is 1 unit
scene.add(axesHelper); // need to add it to a scene bcz it is an object

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// camera.position.y = 1;
// camera.position.x = 1;
scene.add(camera);

// Object3D instances have a lookAt(...) method which rotates the object so that its -z faces te target provided (target: must be a Vector3)
// lookAt rorates around its CURRENT POSITION to face the target specified.
// camera.lookAt(mesh.position);

// Distance from another Vector3
// console.log(mesh.position.distanceTo(camera.position));

/* COMBINING TRANSFORMATION
You can combine position, rotation (or quaternion), and scale in ANY order!
- Think about it as a state before we render it on the canvas.
*/

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
