import { BackSide, CanvasTexture, Mesh, MeshBasicMaterial, MeshToonMaterial } from 'three';

import ModelLoader from '/js/ModelLoader.js';

class Piece extends Mesh {
	constructor(identifier, rank, file) {
		super();

		this.userData = {
			type: this.getPieceTypeByIdentifier(identifier),
			color: identifier === identifier.toLowerCase() ? 'white' : 'black',
			movedCount: 0,
			rank: rank,
			file: file
		};

		if (this.userData.type === 'king') {
			this.name = this.userData.color + 'king';
		}

		const modelLoader = new ModelLoader();
		const model = modelLoader.get(this.userData.type).children[0];
		model.traverse((object) => {
			if (object.isMesh) {
				object.material = new MeshToonMaterial({
					color: this.userData.color === 'white' ? 0xf9f9f9 : 0x5b5957,
					gradientMap: this.createGradientMap(),
				});

				object.scale.setScalar(0.02);
				object.castShadow = true;
				object.receiveShadow = true;
				object.material.transparent = true;
				object.material.opacity = 0;
			}
		});

		this.add(model);
		this.rotation.y += Math.PI / 2;
		this.position.set(rank, 0, file);
	}

	getPieceTypeByIdentifier(identifier) {
		switch (identifier.toLowerCase()) {
			case 'k':
				return 'king';
			case 'q':
				return 'queen';
			case 'r':
				return 'rook';
			case 'b':
				return 'bishop';
			case 'n':
				return 'knight';
			case 'p':
				return 'pawn';
		}
	}

	createGradientMap() {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 1;

		const ctx = canvas.getContext('2d');
		const gradient = ctx.createLinearGradient(0, 0, 256, 1);
		gradient.addColorStop(0, '#000000');
		gradient.addColorStop(0.5, '#777777');
		gradient.addColorStop(1, '#ffffff');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 256, 1);

		return new CanvasTexture(canvas);
	}
}

export default Piece;