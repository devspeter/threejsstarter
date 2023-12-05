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

		var light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(0, 0, 1);
		this.scene.add(light);
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
		
		// Define Spirograph parameters
		var spirographMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

		// Create Spirograph lines
		for (var thetaOffset = 0; thetaOffset < Math.PI * 2; thetaOffset += Math.PI / 30) {
		  var curve = new THREE.Curve();
		  curve.getPoint = function(t) {
			var theta = t * Math.PI * 2 + thetaOffset;
			var x = (R-r) * Math.cos(theta) + d * Math.cos((R-r)/r * theta);
			var y = (R-r) * Math.sin(theta) - d * Math.sin((R-r)/r * theta);
			return new THREE.Vector3(x, y, 0);
		  };
		  var points = curve.getPoints(100);
		  var spirographGeometry = new THREE.BufferGeometry().setFromPoints(points);
		  var spirographLine = new THREE.Line(spirographGeometry, spirographMaterial);
		this.scene.add(spirographLine);
	
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
       
		this.renderer.render(this.scene, this.camera);
		window.requestAnimationFrame(this.update.bind(this));
    }

    addEventListeners() {
		window.addEventListener("resize", this.onResize.bind(this));
	}
}


new useWebGL();
