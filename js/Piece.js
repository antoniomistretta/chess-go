import { BackSide, CanvasTexture, Mesh, MeshBasicMaterial, MeshToonMaterial } from 'three';

import ModelLoader from '/js/ModelLoader.js';

class Piece extends Mesh {
    constructor(identifier, rank, file) {
        super();

        this.userData = {
            'piece': this.getPieceTypeByIdentifier(identifier),
            'color': identifier === identifier.toLowerCase() ? 'white' : 'black',
            'movedCount': 0,
            'rank': rank,
            'file': file
        };

        if(this.type === 'king') {
			this.name = color + ' king';
		}

        const modelLoader = new ModelLoader();
        const model = modelLoader.get(this.userData.piece).children[0];
        model.traverse((object) => {
            if(object.isMesh) {
                object.material = new MeshToonMaterial({
                    color: this.userData.color === 'white' ? 0XE1BCA5 : 0X52301B,
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
    };

    getPieceTypeByIdentifier(identifier) {
        switch(identifier.toLowerCase()) {
            case 'k':
                return 'king';
            case 'q':
                return 'queen';
            case 'r':
                return 'rook';
            case 'b':
                return 'bishop'
            case 'n':
                return 'knight'
            case 'p':
                return 'pawn';
        };
    };

    createGradientMap() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 1;

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 256, 0);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.5, '#777777');
        gradient.addColorStop(1, '#ffffff');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 1);

        return new CanvasTexture(canvas);
    };

    // getAllMoves(rank, file) {
    //     const moves = [];

    //     switch(this.type) {
    //         case 'pawn':
    //             const direction = this.color === 'white' ? 1 : -1;

    //             moves.push([rank + direction, file]);
    //             if(!this.hasMoved) {
    //                 moves.push([rank + (direction * 2), file]);
    //             }

    //             moves.push([rank + direction, file + 1]);
    //             moves.push([rank + direction, file - 1]);

    //             break;
    //         case 'knight':
    //             moves.push(
    //                 [rank + 1, file + 2],
    //                 [rank + 2, file + 1],
    //                 [rank + 1, file - 2],
    //                 [rank + 2, file - 1],
    //                 [rank - 1, file - 2],
    //                 [rank - 2, file - 1],
    //                 [rank - 1, file + 2],
    //                 [rank - 2, file + 1]
    //             );
    //             break;
    //         case 'bishop':
    //             moves.push(
    //                 (rank, file, i) =>  [ rank + i, file + i, i + 1 ],
    //                 (rank, file, i) =>  [ rank - i, file + i, i + 1 ],
    //                 (rank, file, i) =>  [ rank + i, file - i, i + 1 ],
    //                 (rank, file, i) =>  [ rank - i, file - i, i + 1 ]
    //             );
    //             break;
    //         case 'rook':
    //             moves.push(
    //                 (rank, file, i) =>  [ rank + i, file, i + 1 ],
    //                 (rank, file, i) =>  [ rank - i, file, i + 1 ],
    //                 (rank, file, i) =>  [ rank, file + i, i + 1 ],
    //                 (rank, file, i) =>  [ rank, file - i, i + 1 ]
    //             );
    //             break;
    //         case 'queen':
    //             moves.push(
    //                 (rank, file, i) =>  [ rank + i, file, i + 1 ],
    //                 (rank, file, i) =>  [ rank - i, file, i + 1 ],
    //                 (rank, file, i) =>  [ rank, file + i, i + 1 ],
    //                 (rank, file, i) =>  [ rank, file - i, i + 1 ],
    //                 (rank, file, i) =>  [ rank + i, file + i, i + 1 ],
    //                 (rank, file, i) =>  [ rank - i, file + i, i + 1 ],
    //                 (rank, file, i) =>  [ rank + i, file - i, i + 1 ],
    //                 (rank, file, i) =>  [ rank - i, file - i, i + 1 ]
    //             );
    //             break;
    //         case 'king':
    //             moves.push(
    //                 [rank + 1, file],
    //                 [rank, file + 1],
    //                 [rank + 1, file + 1],
    //                 [rank - 1, file],
    //                 [rank, file - 1],
    //                 [rank - 1, file - 1],
    //                 [rank + 1, file - 1],
    //                 [rank - 1, file + 1]
    //             );
    //             break;
    //     }

    //     return moves;
    // }
};

export default Piece;