import "../css/index.css";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import BoxModel from './model'


class useWebGL {
	constructor() {
        this.canvas = document.querySelector("canvas.webgl");
        this.width = this.canvas.clientWidth;
		this.height = this.canvas.clientHeight;
        this.clock = new THREE.Clock();

        this.createScene()
        this.createCamera()
        this.createRenderer()
        this.createControl()
        this.createModel()
        this.onResize()
        this.addEventListeners()
        this.update()
    }

    createScene() {
		this.scene = new THREE.Scene();
		this.textureLoader = new THREE.TextureLoader();
	}

    createCamera() {
		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.y = 2;
		this.camera.position.x = -4;

	}

    createRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			// antialias: true,
			// alpha: true,
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.setPixelRatio(window.devicePixelRatio || 1);
		this.renderer.outputEncoding = THREE.sRGBEncoding;
	}

    createControl() {
        const controls = new OrbitControls( this.camera, this.renderer.domElement );
	}

    createModel(){
        const position = new THREE.Vector3(1, 0, 1)
        const object3D = new BoxModel(2, position)
        console.log(object3D)
        this.scene.add(object3D)
    }

    onResize() {
		this.screen = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		this.camera.aspect = this.screen.width / this.screen.height;
		this.camera.updateProjectionMatrix();
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setSize(this.screen.width, this.screen.height);
	}

    update() {
        this.elapsedTime = this.clock.getElapsedTime();
		this.renderer.render(this.scene, this.camera);
		window.requestAnimationFrame(this.update.bind(this));
    }

    addEventListeners() {
		window.addEventListener("resize", this.onResize.bind(this));
	}
}


new useWebGL();
