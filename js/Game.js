import { Plane, Raycaster, Vector2, Vector3 } from 'three';

import Cursor from '/js/Cursor.js';
import Scene from '/js/Scene.js';
import Level from '/js/Level.js';

const levels = {
	'classic': {
		board: [
			['R','N','B','Q','K','B','N','R'],
			['P','P','P','P','P','P','P','P'],
			['-','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','-'],
			['p','p','p','p','p','p','p','p'],
			['r','n','b','q','k','b','n','r']
		]
	},
	'test': {
		board: [
            ['Q','-'],
			['-','-'],
			['-','-'],
			['-','r']
		],
		onTurnComplete: () => {
			const conditionsMet = true;
			return { conditionsMet }
		},
		switchTurn: (turn) => {
			return turn === 'white' ? 'black' : 'white';
		}
	}
};

const raycaster = new Raycaster();
const intersects = [];

class Game {
    constructor() {
        this.cursor = new Cursor();
        this.scene = new Scene();
        this.level = new Level(levels['test']);

        this.loadLevel();
        this.startGame();
    }

    startGame() {
        this.selectedPiece = null;
        this.grabbingPiece = false;
        this.validMoves = [];

        this.turn = 'white';
        this.moveCount = 0;

        this.addEventsListeners();
    }

    unloadLevel() {
        this.level.tiles.removeFromParent();
        this.level.pieces.removeFromParent();
    }

    loadLevel() {
        this.scene.add(this.level.tiles);
        this.scene.add(this.level.pieces);
    }

    handleCursorMove = () => {
        raycaster.setFromCamera(new Vector2(this.cursor.x, this.cursor.y), this.scene.camera);

        intersects.length = 0;
        intersects.push(...raycaster.intersectObjects(this.level.tiles.children));

        if(this.grabbingPiece) {
            const planeZ = new Plane(new Vector3(0, 1, 0), 0);
            const intersection = new Vector3();
            raycaster.ray.intersectPlane(planeZ, intersection);

            this.selectedPiece.position.set(intersection.x + (this.level.width / 2) - 0.5, 0, intersection.z + (this.level.length / 2) - 0.5);
        }
    };

    handleCursorDown = () => {
        if(intersects.length > 0) {
            const selectedTile = intersects[0].object;
            const piece = this.level.pieces.children.find((piece) => {
                return piece.tile === selectedTile.name;
            });

            if(
                piece !== undefined
                && piece.color === this.turn
            ) {
                if(this.selectedPiece !== null) {
                    for(const validMove of this.validMoves) {
                        const tile = this.level.tiles.getObjectByName(validMove);
                        tile.unhighlight();
                    }

                    this.validMoves.length = 0;
                }

                document.body.style.cursor = 'grabbing';

                this.selectedPiece = piece;
                this.grabbingPiece = true;

                this.validMoves = this.level.getValidMoves(piece);
                for(const validMove of this.validMoves) {
                    const tile = this.level.tiles.getObjectByName(validMove);
                    tile.highlight();
                }
            }
        }
    };

    handleCursorUp = () => {
        if(intersects.length > 0) {
            const selectedTile = intersects[0].object;

            if(this.selectedPiece !== null) {
                document.body.style.cursor = 'default';
                this.grabbingPiece = false;

                if(this.validMoves.includes(selectedTile.name)) {
                    const { rank, file } = selectedTile.userData;
                    const target = this.level.getPieceAt(rank, file);

                    if(target !== undefined) {
                        this.level.pieces.remove(target);
                    }

                    const { rank: selectedRank, file: selectedFile } = this.level.getRankAndFileOf(this.selectedPiece);

                    this.level.board[selectedRank][selectedFile] = '-';
                    this.level.board[rank][file] = this.selectedPiece;
                    this.selectedPiece.hasMoved = true;
                    this.selectedPiece.tile = selectedTile.name;
                    this.selectedPiece.position.set(rank, 0, file);

                    for(const validMove of this.validMoves) {
                        const tile = this.level.tiles.getObjectByName(validMove);
                        tile.unhighlight();
                    }

                    const { conditionsMet } = this.level.onTurnComplete();
                    if(!conditionsMet) {
                        const turn = this.level.switchTurn(this.turn);

                        if(turn !== this.turn) {
                            this.turn = turn;

                            this.scene.camera.position.set(
                                -this.scene.camera.position.x,
                                this.scene.camera.position.y,
                                -this.scene.camera.position.z
                            );

                            this.scene.camera.lookAt(0, 0, 0);
                        }

                        this.selectedPiece = null;
                        this.validMoves = [];
                    } else {
                        this.removeEventListeners();

                        setTimeout(() => {
                            this.unloadLevel();
                            this.level = new Level(levels['classic']);
                            this.loadLevel();
                            this.startGame();
                        }, 1000);
                    }
                } else {
                    const { rank, file } = this.level.getRankAndFileOf(this.selectedPiece);
                    this.selectedPiece.position.set(rank, 0, file);
                }
            }
        } else {
            document.body.style.cursor = 'default';
            this.grabbingPiece = false;

            if(this.selectedPiece !== null) {
                const { rank, file } = this.level.getRankAndFileOf(this.selectedPiece);
                this.selectedPiece.position.set(rank, 0, file);
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
    }

    removeEventListeners() {
        document.removeEventListener('mousemove', this.handleCursorMove);
        document.removeEventListener('mousedown', this.handleCursorDown);
        document.removeEventListener('mouseup', this.handleCursorUp);

        document.removeEventListener('touchmove', this.handleCursorMove);
        document.removeEventListener('touchstart', this.handleCursorDown);
        document.removeEventListener('touchend', this.handleCursorUp);
    }
}

export default Game;