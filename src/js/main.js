import "../css/index.css"
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

class useWebGL {
	constructor() {
		this.canvas = document.querySelector("canvas.webgl")
		this.width = this.canvas.clientWidth
		this.height = this.canvas.clientHeight
		this.clock = new THREE.Clock()
		this.actions = {}
		this.mixer = null

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
		this.scene = new THREE.Scene()
	}

	createCamera() {
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
		this.camera.position.y = 0
		this.camera.position.z = 2
		this.camera.position.x = 4

		this.hemiLight = new THREE.HemisphereLight(0x000000, 0xffffff, 0.5)
		this.hemiLight.color.setHSL(0.6, 10, 0.6)
		this.hemiLight.groundColor.setHSL(0.095, 1, 0.75)
		this.hemiLight.position.set(0, 10, 0)
		this.scene.add(this.hemiLight)

		const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2.5)
		directionalLight1.position.set(5, 10, 7.5)
		this.scene.add(directionalLight1)

		const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.1)
		directionalLight2.position.set(-5, 5, -7.5)
		this.scene.add(directionalLight2)
	}

	createRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			alpha: true
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping
		this.renderer.setPixelRatio(window.devicePixelRatio || 1)
		this.renderer.outputEncoding = THREE.sRGBEncoding
	}

	createControl() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enableDamping = true
		this.controls.autoRotate = false
		this.controls.autoRotateSpeed = 1.5
	}

	createModel() {
		const loader = new GLTFLoader()
		loader.load("./dist/spine-4actions.glb", (gltf) => {
			this.spine = gltf.scene
			this.spine.position.y = -1

			this.scene.add(this.spine)
			this.mixer = new THREE.AnimationMixer(this.spine)

			gltf.animations.forEach((clip) => {
				this.actions[clip.name] = this.mixer.clipAction(clip)
			})
			this.setupButtons()
		})
	}

	setupButtons() {
		document.getElementById("1").addEventListener("click", () => this.toggleAnimation("extension"))
		document.getElementById("2").addEventListener("click", () => this.toggleAnimation("flexion"))
		document.getElementById("3").addEventListener("click", () => this.toggleAnimation("lateralFlexionLeft"))
		document.getElementById("4").addEventListener("click", () => this.toggleAnimation("lateralFlexionRight"))
		document.getElementById("bg").addEventListener("click", () => this.changeBackground())
	}

	changeBackground() {
		document.getElementsByClassName("relative")[0].style.backgroundImage = "none"
	}

	toggleAnimation(name) {
		if (this.actions[name]) {
			const action = this.actions[name]
			if (action.isRunning()) {
				action.stop()
			} else {
				for (let actionName in this.actions) {
					if (this.actions[actionName].isRunning()) {
						this.actions[actionName].stop()
					}
				}
				action.reset()
				action.play()
			}
		}
	}

	onResize() {
		this.screen = {
			width: window.innerWidth,
			height: window.innerHeight
		}
		this.camera.aspect = this.screen.width / this.screen.height
		this.camera.updateProjectionMatrix()
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		this.renderer.setSize(this.screen.width, this.screen.height)
	}

	update() {
		this.elapsedTime = this.clock.getElapsedTime()
		this.deltaTime = this.elapsedTime - this.previousTime
		this.previousTime = this.elapsedTime

		if (this.mixer) {
			this.mixer.update(this.deltaTime)
		}
		this.renderer.render(this.scene, this.camera)
		this.controls.update()
		window.requestAnimationFrame(this.update.bind(this))
	}
	autoRotate() {
		this.controls.autoRotate = !this.controls.autoRotate
	}

	addEventListeners() {
		window.addEventListener("resize", this.onResize.bind(this))
		const autoRotate = document.getElementById("autoRotate")
		autoRotate.addEventListener("click", this.autoRotate.bind(this))
	}
}

new useWebGL()
