import { Group, WireframeGeometry, LineBasicMaterial, LineSegments } from 'three';
import ModelLoader from '/js/ModelLoader.js';

class Piece extends Group {
    constructor(identifier, color, position) {
        super();

        this.type = this.getPieceTypeByIdentifier(identifier);
        this.color = color;
        this.tile = position;

        this.hasMoved = false;
        this.inCheck = false;

        if(this.type === 'king') {
			this.name = color + ' king';
		}

        const modelLoader = new ModelLoader();
        this.add(modelLoader.get(this.type));

        this.scale.setScalar(0.2);
        this.traverse((object) => {
            if(object.type === "Mesh") {
                object.castShadow = true;
                object.material = object.material.clone();
                object.material.color.set(this.color === 'white' ? 0XF5F5F5 : 0X2B2B2B);
                object.rotation.set(0, 0, Math.PI / 2);
            }
        });
    }

    getPieceTypeByIdentifier(identifier) {
        switch(identifier) {
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
        }
    }

    getAllMoves(rank, file) {
        const moves = [];

        switch(this.type) {
            case 'pawn':
                const direction = this.color === 'white' ? 1 : -1;

                moves.push([rank + direction, file]);
                if(!this.hasMoved) {
                    moves.push([rank + (direction * 2), file]);
                }

                moves.push([rank + direction, file + 1]);
                moves.push([rank + direction, file - 1]);

                break;
            case 'knight':
                moves.push(
                    [rank + 1, file + 2],
                    [rank + 2, file + 1],
                    [rank + 1, file - 2],
                    [rank + 2, file - 1],
                    [rank - 1, file - 2],
                    [rank - 2, file - 1],
                    [rank - 1, file + 2],
                    [rank - 2, file + 1]
                );
                break;
            case 'bishop':
                moves.push(
                    (rank, file, i) =>  [ rank + i, file + i, i + 1 ],
                    (rank, file, i) =>  [ rank - i, file + i, i + 1 ],
                    (rank, file, i) =>  [ rank + i, file - i, i + 1 ],
                    (rank, file, i) =>  [ rank - i, file - i, i + 1 ]
                );
                break;
            case 'rook':
                moves.push(
                    (rank, file, i) =>  [ rank + i, file, i + 1 ],
                    (rank, file, i) =>  [ rank - i, file, i + 1 ],
                    (rank, file, i) =>  [ rank, file + i, i + 1 ],
                    (rank, file, i) =>  [ rank, file - i, i + 1 ]
                );
                break;
            case 'queen':
                moves.push(
                    (rank, file, i) =>  [ rank + i, file, i + 1 ],
                    (rank, file, i) =>  [ rank - i, file, i + 1 ],
                    (rank, file, i) =>  [ rank, file + i, i + 1 ],
                    (rank, file, i) =>  [ rank, file - i, i + 1 ],
                    (rank, file, i) =>  [ rank + i, file + i, i + 1 ],
                    (rank, file, i) =>  [ rank - i, file + i, i + 1 ],
                    (rank, file, i) =>  [ rank + i, file - i, i + 1 ],
                    (rank, file, i) =>  [ rank - i, file - i, i + 1 ]
                );
                break;
            case 'king':
                moves.push(
                    [rank + 1, file],
                    [rank, file + 1],
                    [rank + 1, file + 1],
                    [rank - 1, file],
                    [rank, file - 1],
                    [rank - 1, file - 1],
                    [rank + 1, file - 1],
                    [rank - 1, file + 1]
                );
                break;
        }

        return moves;
    }
}

export default Piece;