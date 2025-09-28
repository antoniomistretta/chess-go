import { AmbientLight, DirectionalLight, OrthographicCamera, Raycaster, Scene, Plane, Vector2, Vector3, WebGLRenderer } from 'three';

import Cursor from '/js/Cursor.js';
import Level from '/js/Level.js';

class Game {
	constructor() {
		this.cursor = new Cursor();
		this.scene = new Scene();
		this.gameState = {
			hoveredTile: null,
			selectedTile: null,
			isGrabbing: false,
			turn: 'white',
			validMoves: []
		};

		this.fStop = 10;
		this.camera = new OrthographicCamera(
			this.getCameraAperture('left'),
			this.getCameraAperture('right'),
			this.getCameraAperture('top'),
			this.getCameraAperture('bottom'),
			-100,
			100
		);
		this.camera.updateProjectionMatrix();

		this.renderer = new WebGLRenderer({ alpha: true });
		this.renderer.shadowMap.enabled = true;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setAnimationLoop(() => {
			this.renderer.render(this.scene, this.camera);
		});

		const light = new AmbientLight(0XFFFFFF);
		light.intensity = 1;
		this.scene.add(light);

		const directionalLight = new DirectionalLight(0XFFFFFF, 0.5);
		directionalLight.castShadow = true;
		directionalLight.intensity = 1;
		directionalLight.position.set(-10, 20, -10);
		directionalLight.shadow.mapSize.width = 2048;
   		directionalLight.shadow.mapSize.height = 2048;
		this.scene.add(directionalLight);

		document.body.appendChild(this.renderer.domElement);

		window.addEventListener('resize', () => {
			this.fStop = 10;
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.left = this.getCameraAperture('left');
			this.camera.right = this.getCameraAperture('right');
			this.camera.top = this.getCameraAperture('top');
			this.camera.bottom = this.getCameraAperture('bottom');
			this.camera.updateProjectionMatrix();

			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.render(this.scene, this.camera);
		});
	};

	getCameraAperture = (direction) => {
		switch(direction) {
			case 'left':
				return this.fStop * window.innerWidth / window.innerHeight / -2;
			case 'right':
				return this.fStop * window.innerWidth / window.innerHeight / 2;
			case 'top':
				return this.fStop / 2;
			case 'bottom':
				return this.fStop / -2;
		}
	};

	loadLevel = (levelName) => {
		this.level = new Level(levelName);

		this.scene.add(this.level.tiles);
		this.scene.add(this.level.pieces);

		const shuffledTileIndexs = Array.from({ length: this.level.tiles.children.length }, (_, index) => { return index});
		for(let i = shuffledTileIndexs.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledTileIndexs[i], shuffledTileIndexs[j]] = [shuffledTileIndexs[j], shuffledTileIndexs[i]];
		}

		const delay = 0;
		const duration = 0;

		for(const index of shuffledTileIndexs) {
			gsap.to(this.level.tiles.children[shuffledTileIndexs[index]].position, {
				y: -0.05,
				duration: duration,
				delay: index * delay
			});

			gsap.to(this.level.tiles.children[shuffledTileIndexs[index]].material, {
				opacity: 1,
				duration: duration,
				delay: index * delay
			});

			if(this.level.pieces.children?.[shuffledTileIndexs[index]]) {
				gsap.to(this.level.pieces.children[shuffledTileIndexs[index]].position, {
					y: 0,
					duration: duration,
					delay: index * delay
				});

				this.level.pieces.children?.[shuffledTileIndexs[index]].traverse((object) => {
					if(object.type === "Mesh") {
						gsap.to(object.material, {
							opacity: 1,
							duration: duration,
							delay: index * delay
						});
					}
				});
			}
		}

		this.camera.position.set(-1, 2.5, 0);
		this.camera.lookAt(0, 0, 0);

		this.addEventsListeners();
	};

	handleCursorMove = () => {
		const raycaster = new Raycaster();
		raycaster.setFromCamera(new Vector2(this.cursor.x, this.cursor.y), this.camera);
		const intersects = raycaster.intersectObjects(this.level.tiles.children);

		if(intersects.length > 0) {
			this.gameState.hoveredTile = intersects[0].object;

			if(this.level.getPieceAt(this.gameState.hoveredTile.userData.rank, this.gameState.hoveredTile.userData.file)?.userData?.color === this.gameState.turn) {
				document.body.style.cursor = 'grab';
			} else {
				document.body.style.cursor = 'default';
			}
		} else {
			this.gameState.hoveredTile = null;
			document.body.style.cursor = 'default';
		}

		if(this.gameState.isGrabbing) {
			document.body.style.cursor = 'grabbing';

			const planeZ = new Plane(new Vector3(0, 1, 0), 0);
			const intersection = new Vector3();
			raycaster.ray.intersectPlane(planeZ, intersection);

			this.level.getPieceAt(this.gameState.selectedTile.userData.rank, this.gameState.selectedTile.userData.file).position.set(intersection.x + (8 / 2) - 0.5, 0, intersection.z + (8 / 2) - 0.5);
		}
	};

	handleCursorDown = () => {
		if(this.gameState.hoveredTile !== null) {
			if(this.level.getPieceAt(this.gameState.hoveredTile.userData.rank, this.gameState.hoveredTile.userData.file)?.userData?.color === this.gameState.turn) {
				if(this.gameState.selectedTile !== null) {
					this.gameState.selectedTile.reset();
					this.gameState.selectedTile = null;
					this.gameState.validMoves = [];
				}

				this.gameState.isGrabbing = true;
				document.body.style.cursor = 'grabbing';
				this.gameState.selectedTile = this.gameState.hoveredTile;
				this.gameState.selectedTile.select();
				this.gameState.validMoves = this.level.getValidMoves(this.level.getPieceAt(this.gameState.hoveredTile.userData.rank, this.gameState.hoveredTile.userData.file));
			} else if(!this.gameState.validMoves.includes(this.gameState.hoveredTile.name)) {
				this.gameState.selectedTile.reset();
				this.gameState.selectedTile = null;
				this.gameState.validMoves = [];
			}
		} else if(this.gameState.selectedTile !== null) {
			this.gameState.selectedTile.reset();
			this.gameState.selectedTile = null;
			this.gameState.validMoves = [];
		}
	};

	handleCursorUp = () => {
		if(this.gameState.selectedTile !== null) {
			const piece = this.level.getPieceAt(this.gameState.selectedTile.userData.rank, this.gameState.selectedTile.userData.file);

			const animateMove = !this.gameState.isGrabbing;
			this.gameState.isGrabbing = false;

			if(this.gameState.hoveredTile !== null) {
				if(this.gameState.validMoves.includes(this.gameState.hoveredTile.name)) {
					const sourceRank = this.gameState.selectedTile.userData.rank;
					const sourceFile = this.gameState.selectedTile.userData.file;
					const targetRank = this.gameState.hoveredTile.userData.rank;
					const targetFile = this.gameState.hoveredTile.userData.file;

					const target = this.level.getPieceAt(targetRank, targetFile);

					if(target !== '-') {
						this.level.pieces.remove(target);
					}

					piece.userData.rank = targetRank;
					piece.userData.file = targetFile;

					this.level.board[sourceRank][sourceFile] = '-';
					this.level.board[targetRank][targetFile] = piece;

					gsap.to(piece.position, {
						duration: animateMove ? 0.25 : 0,
						x: piece.userData.rank,
						z: piece.userData.file
					});

					this.gameState.selectedTile.reset();
					this.gameState.selectedTile = null;
					this.gameState.validMoves = [];
				} else {
					piece.position.set(piece.userData.rank, 0, piece.userData.file);
				}

				if(this.level.getPieceAt(this.gameState.hoveredTile.userData.rank, this.gameState.hoveredTile.userData.file)?.userData?.color === this.gameState.turn) {
					document.body.style.cursor = 'grab';
				} else {
					document.body.style.cursor = 'default';
				}
			} else {
				piece.position.set(piece.userData.rank, 0, piece.userData.file);
				document.body.style.cursor = 'default';
			}
		}
	};

	addEventsListeners() {
		document.addEventListener('mousemove', this.handleCursorMove);
		document.addEventListener('mousedown', this.handleCursorDown);
		document.addEventListener('mouseup', this.handleCursorUp);

		document.addEventListener('touchmove', this.handleCursorMove);
		document.addEventListener('touchstart', this.handleCursorDown);
		document.addEventListener('touchend', this.handleCursorUp());
	};

	removeEventListeners() {
		document.removeEventListener('mousemove', this.handleCursorMove);
		document.removeEventListener('mousedown', this.handleCursorDown);
		document.removeEventListener('mouseup', this.handleCursorUp);

		document.removeEventListener('touchmove', this.handleCursorMove);
		document.removeEventListener('touchstart', this.handleCursorDown);
		document.removeEventListener('touchend', this.handleCursorUp);
	};
};

export default Game;