import "./style.css";
import * as THREE from 'three';
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/Addons.js";

// Setup scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
});


// Set pixel ratio and size
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const orbitradius = 4.5;
const radius = 1.5;
const segments = 64;

// const colors = [0x00ff00, 0x0000ff, 0xff00ff, 0xffff00];
const textures = ['./csilla/color.png', './earth/map.jpg', './venus/map.jpg', './volcanic/color.png']
const spheres = new THREE.Group();

const starTexture = new THREE.TextureLoader().load('./stars.jpg');
const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  side: THREE.BackSide
})
const starSphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starSphere);

const spheresmesh = [];


// Add ambient and directional lighting

const loader = new RGBELoader();
loader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/flamingo_pan_1k.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;



  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
})

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Enable physically correct lighting
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;


for (let i = 0; i < 4; i++) {

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i])
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);

  spheresmesh.push(sphere);


  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitradius * Math.cos(angle);
  sphere.position.z = orbitradius * Math.sin(angle);

  spheres.add(sphere);
}
spheres.rotation.x = 0.13
spheres.position.y = -0.8
scene.add(spheres);

// Add orbit controls


// Position camera
camera.position.z = 9;

let lastWheelTime = 0;
const throttleDelay = 500;
let scrollIndex = 0;

function throttledWheelHandler(e) {
  const currentTime = Date.now();
  if (currentTime - lastWheelTime < throttleDelay) return;

  lastWheelTime = currentTime;

  const headings = document.querySelectorAll(".heading");
  const maxSlides = headings.length - 1;

  // Store previous index to check if we actually moved
  const prevIndex = scrollIndex;

  // Update scrollIndex based on wheel direction
  if (e.deltaY > 0) {
    scrollIndex = Math.min(scrollIndex + 1, maxSlides);
  } else {
    scrollIndex = Math.max(scrollIndex - 1, 0);
  }

  // Only rotate sphere if scrollIndex actually changed
  if (scrollIndex !== prevIndex) {
    // Calculate rotation based on scroll direction
    const rotationAmount = e.deltaY > 0 ? -Math.PI / 2 : Math.PI / 2;

    // Animate sphere rotation based on scrollIndex
    gsap.to(spheres.rotation, {
      duration: 1,
      y: scrollIndex * (Math.PI / 2), // Rotation matches text position
      ease: "power2.inOut",
    });

    // Animate headings
    gsap.to(headings, {
      duration: 1,
      y: `-${scrollIndex * 100}%`,
      ease: "power2.inOut",
    });
  }
}

window.addEventListener("wheel", throttledWheelHandler);


//  setInterval(() => {
// gsap.to(spheres.rotation,{
//     y: `+=${Math.PI/2}`,
//     duration: 2,
//     ease: "expo.easeOut",
//     repeatDelay: 1,
// })
//  }, 2000);

// Animation loop

const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);


  for (let i = 0; i < spheresmesh.length; i++) {
    const sphere = spheresmesh[i];
    sphere.rotation.y = clock.getElapsedTime() * 0.06;
    sphere.rotation.x = clock.getElapsedTime() * 0.03;

  }


  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

