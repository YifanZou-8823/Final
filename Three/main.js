import './space.css';

import { writeDB, readDB } from './db.js'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;

const spaceId = new URLSearchParams(window.location.search).get('space');

let currentCube = null;

const name = document.getElementById('name');
const year = document.getElementById('year');
const message = document.getElementById('message');
const messageBox = document.getElementById('messageBox');
const cubeInformation = document.querySelector('.cube-information');

//Create scene
const scene = new THREE.Scene();
const spaceTexture = new THREE.TextureLoader().load(spaceId + '.jpg');
scene.background = spaceTexture;

//Create Camera
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 120;
camera.position.y = 40;

//Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;

//Add the renderer to the DOM
document.body.appendChild(renderer.domElement);

//Add Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

//lighting
const pointLight = new THREE.PointLight(0xffffff, 5000);
pointLight.position.set(0, 50, 0);
pointLight.castShadow = true; // Enable shadow casting

const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

// initializing all cubes from lowdb
function initCubesFromDb() {
    const allCubes = readDB();

    for (let i = 0; i < allCubes.length; i++) {
        const data = allCubes[i];

        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshPhongMaterial({ color: data.color });
        const cube = new THREE.Mesh(geometry, material);

        // Set the position of the cube
        cube.position.copy(new THREE.Vector3(data.x, data.y, data.z));

        cube.userData = data;
        scene.add(cube);
    }
}
initCubesFromDb();


//Function to add stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.5, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    let x = THREE.MathUtils.randFloatSpread(500);
    let y = THREE.MathUtils.randFloatSpread(500);
    let z = THREE.MathUtils.randFloatSpread(500);

    star.position.set(x, y, z);
    scene.add(star);
}

for (let i = 0; i < 3000; i++) {
    addStar();
}

//Define an animate function / call it repeatedly
function animate() {
    //allow for controls to update
    controls.update();

    //call render
    renderer.render(scene, camera);

    //cal animate again
    requestAnimationFrame(animate);
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    // Calculate mouse position in normalized device coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Using raycasting to find intersected objects
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // Assume the grid is the first intersected object
        const intersect = intersects[0];

        if (intersect.object.type === "GridHelper") {
            addCube(intersect.point);
        } else if (intersect.object.type === 'Mesh') { // mesh === cube
            // click some cube
            const data = intersect.object.userData
            cubeInformation.innerHTML = `
            <div>In Box</div>
            <div>Name: ${data.name}</div>
            <div>Year: ${data.year}</div>
            <div>Messsage: ${data.message}</div>
            `
        }
    }
}

//random color generator
function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hex
    return `#${randomColor.padStart(6, '0')}`; // Ensure it's a valid 6-digit hex color
}

function addCube(position) {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const color = getRandomColor();
    const material = new THREE.MeshPhongMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = Date.now();

    // Set the position of the new cube
    cube.position.copy(position);

    // Adjust cube height above the grid (if needed)
    cube.position.y += 5; // Adjust this based on cube size and grid position

    scene.add(cube);

    currentCube = {
        cubeName: cube.name,
        x: cube.position.x,
        y: cube.position.y,
        z: cube.position.z,
        color: color
    };

    messageBox.showModal();
}

// Right click to add a cube
window.addEventListener('contextmenu', function (event) {
    event.preventDefault();

    // add cube
    if (!messageBox.open) {
        onDocumentMouseDown(event)
    }
})

// Left click to submit or control scene
window.addEventListener('click', function (event) {
    if (event.target.id === 'submitBtn') {

        if (!name.value || !year.value || !message.value) {
            alert('Please fill out all fields.');
            return;
        }

        const data = {
            cubeName: currentCube.cubeName,
            x: currentCube.x,
            y: currentCube.y,
            z: currentCube.z,
            color: currentCube.color,
            name: name.value,
            year: year.value,
            message: message.value,
        }
        writeDB(data); // save to lowdb

        scene.getObjectByName(currentCube.cubeName).userData = data;

        // clear form
        name.value = '';
        year.value = 2021;
        message.value = '';

        messageBox.close();
    } else if (event.target.id === 'home') {
        location.href = '/'
    } else if (event.target.id === 'cancelBtn') {
        // remove cube
        const cubeAdded = scene.getObjectByName(currentCube.cubeName);
        scene.remove(cubeAdded);
        messageBox.close();
    }
}, false);

animate();


