import {
	AmbientLight,
	Color,
	DirectionalLight,
	Scene as ThreeScene,
	OrthographicCamera,
	WebGLRenderer as Renderer
} from 'three';

class Scene {
	constructor() {
		this.scene = new ThreeScene();
		this.scene.background = new Color(0x2B2B2B);

		this.renderer = new Renderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;

		this.camera = new OrthographicCamera(
			this.getCamera('left'),
			this.getCamera('right'),
			this.getCamera('top'),
			this.getCamera('bottom'),
			-100,
			100
		);

		this.camera.zoom = 1.2;
		this.camera.updateProjectionMatrix();

		this.camera.position.set(-1, 2.5, 0);
		this.camera.lookAt(0, 0, 0);

		this.renderer.setAnimationLoop(() => {
			this.renderer.render(this.scene, this.camera);
		});

		const light = new AmbientLight(0x404040);
		light.intensity = 25;
		this.scene.add(light);

		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( {color: 0X000000} );
		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		const directionalLight = new DirectionalLight(0XFFFFFF, 0.5);
		directionalLight.castShadow = true;
		directionalLight.intensity = 3;
		directionalLight.position.set(-3, 5, 3)
		this.scene.add(directionalLight);

		document.body.appendChild(this.renderer.domElement);

		window.addEventListener('resize', () => {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.left = this.getCamera('left');
			this.camera.right = this.getCamera('right');
			this.camera.top = this.getCamera('top');
			this.camera.bottom = this.getCamera('bottom');
			this.camera.updateProjectionMatrix();
			this.renderer.render(this.scene, this.camera);
		});
	}

	add(object) {
		this.scene.add(object);
	}

	getCamera(direction) {
		switch(direction) {
			case 'left':
				return 10 * window.innerWidth / window.innerHeight / -2;
			case 'right':
				return 10 * window.innerWidth / window.innerHeight / 2;
			case 'top':
				return 10 / 2;
			case 'bottom':
				return 10 / -2;
		}
	}
}

export default Scene;