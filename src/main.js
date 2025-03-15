import "./style.css";
import * as THREE from 'three'; 
import gsap from "gsap";

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

const  orbitradius = 4.5;
const radius = 1.5;
const segments = 64;
const colors = [0x00ff00, 0x0000ff, 0xff00ff, 0xffff00];

const spheres = new THREE.Group();

for(let i =0; i<4; i++){
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshBasicMaterial({ color: colors[i] });
  const sphere = new THREE.Mesh(geometry, material);

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

 setInterval(() => {
gsap.to(spheres.rotation,{
    y: `+=${Math.PI/2}`,
    duration: 2,
    ease: "expo.easeOut",
    repeatDelay: 1,
})
 }, 2000);
 


// Animation loop
function animate() {
    
  requestAnimationFrame(animate);
   
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

 