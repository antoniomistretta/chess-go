import { Plane, Raycaster, Vector2, Vector3 } from 'three';

import Scene from '/js/Scene.js';
import Level from '/js/Level.js';

const mouse = new Vector2();
mouse.x = null;
mouse.y = null;

const raycaster = new Raycaster();
const intersects = [];

class Game {
    constructor() {
        this.scene = new Scene();

        this.selectedPiece = null;
        this.grabbingPiece = false;
        this.validMoves = [];
        this.turn = 'white';

        this.loadLevel('classic');
    }

    loadLevel(levelName) {
        const level = new Level(levelName);

        this.scene.add(level.tiles);
        this.scene.add(level.pieces);

        const handleCursorMove = () => {
            raycaster.setFromCamera(mouse, this.scene.camera);

            intersects.length = 0;
		    intersects.push(...raycaster.intersectObjects(level.tiles.children));

            if(this.grabbingPiece) {
                const planeZ = new Plane(new Vector3(0, 1, 0), 0);
                const intersection = new Vector3();
                raycaster.ray.intersectPlane(planeZ, intersection);
    
                this.selectedPiece.position.set(intersection.x + (level.width / 2) - 0.5, 0, intersection.z + (level.length / 2) - 0.5);
            }
        };

        const handleCursorDown = () => {
            if(intersects.length > 0) {
                const selectedTile = intersects[0].object;
                const piece = level.pieces.children.find((piece) => {
                    return piece.tile === selectedTile.name;
                });

                if(
                    piece !== undefined
                    && piece.color === this.turn
                ) {
                    if(this.selectedPiece !== null) {
                        for(const validMove of this.validMoves) {
                            const tile = level.tiles.getObjectByName(validMove);
                            tile.material.emissiveIntensity = 0;
                        }

                        this.validMoves.length = 0;
                    }

                    document.body.style.cursor = 'grabbing';

                    this.selectedPiece = piece;
                    this.grabbingPiece = true;
        
                    this.validMoves = level.getValidMoves(piece);
                    for(const validMove of this.validMoves) {
                        const tile = level.tiles.getObjectByName(validMove);
					    tile.material.emissiveIntensity = 0.4;
                    }
                }
            }
        };

        const handleCursorUp = () => {
            if(intersects.length > 0) {
                const selectedTile = intersects[0].object;

                if(this.selectedPiece !== null) {
                    document.body.style.cursor = 'default';
                    this.grabbingPiece = false;

                    if(this.validMoves.includes(selectedTile.name)) {
                        const { rank, file } = selectedTile.userData;
                        const target = level.getPieceAt(rank, file);

                        if(target !== undefined) {
                            level.pieces.remove(target);
                        }

                        level.board[level.getRankAndFileOf(this.selectedPiece).rank][level.getRankAndFileOf(this.selectedPiece).file] = '-';
                        level.board[rank][file] = this.selectedPiece;
                        this.selectedPiece.hasMoved = true;
                        this.selectedPiece.tile = selectedTile.name;
                        this.selectedPiece.position.set(rank, 0, file);

                        for(const validMove of this.validMoves) {
                            const tile = level.tiles.getObjectByName(validMove);
                            tile.material.emissiveIntensity = 0;
                        }

                        this.selectedPiece = null;
                        this.validMoves = [];

                        this.turn = this.turn === 'white' ? 'black' : 'white';

                        this.scene.camera.position.set(
                            -this.scene.camera.position.x,
                            this.scene.camera.position.y,
                            -this.scene.camera.position.z
                        );

                        this.scene.camera.lookAt(0, 0, 0);
                    } else {
                        const { rank, file } = level.getRankAndFileOf(this.selectedPiece);
                        this.selectedPiece.position.set(rank, 0, file);
                    }
                }
            } else {
                document.body.style.cursor = 'default';
                this.grabbingPiece = false;

                if(this.selectedPiece !== null) {
                    const { rank, file } = level.getRankAndFileOf(this.selectedPiece);
                    this.selectedPiece.position.set(rank, 0, file);
                }
            }
        };

        document.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            handleCursorMove();
        });
        document.addEventListener('mousedown', (event) => handleCursorDown());
        document.addEventListener('mouseup', (event) => handleCursorUp());

        document.addEventListener('touchmove', (event) => {
            const touches = event.changedTouches;
            console.log(touches[0]);

            mouse.x = (touches[0].clientX / window.innerWidth) * 2 - 1;
		    mouse.y = -(touches[0].clientY / window.innerHeight) * 2 + 1;

            handleCursorMove();
        });

        document.addEventListener('touchstart', (event) => handleCursorDown());
        document.addEventListener('touchend', (event) => handleCursorUp());
    }
}

export default Game;