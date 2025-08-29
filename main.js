import ModelLoader from '/js/ModelLoader.js';
import Game from '/js/Game.js';

document.addEventListener('DOMContentLoaded', () => {
	const modelLoader = new ModelLoader();
	modelLoader.loadModels(['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'], function() {
		startGame();
	});
});

function startGame() {
	const game = new Game();
}


	// for(const piece of ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']) {
	// 	loader.load(
	// 		'gltf/' + piece + '/scene.gltf',
	// 		function(gltf) {
	// 			models[piece] = gltf.scene
	// 		}
	// 	);
	// };
	
	// const pieces = new THREE.Group();
	// loadingManager.onLoad = function() {
	// 	for(let rank = 0; rank < level.length; rank++) {
	// 		for(let file = 0; file < level.width; file++) {
	// 			const identifier = level.board[rank][file];
	
	// 			if(identifier === '-' || identifier === 'X') { continue };
	
	// 			const pieceType = getPieceTypeByIdentifier(identifier.toLowerCase());
	// 			const piece = models[pieceType].clone();
	// 			const isWhite = identifier === identifier.toLowerCase();
	
	// 			console.log('placeing', isWhite ? 'white' : 'black', pieceType, 'at', level.getTileNotationOf(rank, file));
	
	// 			piece.traverse((object) => {
	// 				if(object.type === "Mesh") {
	// 					object.material = object.material.clone();
	// 					object.material.color.set(isWhite ? 0XFFFAF1 : 0X2B2B2B);
	// 					object.rotation.set(0, 0, Math.PI / 2);
	// 				}
	// 			});
	
	// 			piece.castShadow = true;
	// 			piece.position.set(rank, 0, file);
	// 			piece.scale.setScalar(0.2);
	// 			piece.userData = {
	// 				type: pieceType,
	// 				color: isWhite ? 'white' : 'black',
	// 				tile: String.fromCharCode(97 + file) + String(rank % 8 + 1),
	// 				rank,
	// 				file,
	// 				hasMoved: false
	// 			};
	
	// 			if(pieceType === 'king') {
	// 				piece.name = (isWhite ? 'white' : 'black') + 'king'
	// 			}
	
	// 			pieces.add(piece);
	// 			level.board[rank][file] = piece;
	// 		};
	// 	};
	
		
	
	// 	initializeGame();
	// };



// import { AmbientLight, DirectionalLight, GridHelper, Group, Mesh, BoxGeometry, MeshStandardMaterial } from 'three';

// const scene = new Scene();
// const level = new Level('1');

// tiles.position.set((-level.length / 2) + 0.5, 0, (-level.width / 2) + 0.5);
// scene.add(tiles);

// const pieces = new Group();
// for(let rank = 0; rank < level.length; rank++) {
//     for(let file = 0; file < level.width; file++) {
//         const identifier = level.getPieceAt(rank, file);

//         if(identifier === '-' || identifier === 'X') { continue };

//         const piece = new Piece(identifier.toLowerCase(), identifier === identifier.toLowerCase() ? 'white' : 'black');

//         // const pieceType = getPieceTypeByIdentifier(identifier.toLowerCase());
//         // const piece = models[pieceType].clone();
//         // const isWhite = identifier === identifier.toLowerCase();

//         // console.log('placeing', isWhite ? 'white' : 'black', pieceType, 'at', level.getTileNotationOf(rank, file));

//         // piece.traverse((object) => {
//         //     if(object.type === "Mesh") {
//         //         object.material = object.material.clone();
//         //         object.material.color.set(isWhite ? 0XFFFAF1 : 0X2B2B2B);
//         //         object.rotation.set(0, 0, Math.PI / 2);
//         //     }
//         // });

//         // piece.castShadow = true;
//         // piece.position.set(rank, 0, file);
//         // piece.scale.setScalar(0.2);
//         // piece.userData = {
//         //     type: pieceType,
//         //     color: isWhite ? 'white' : 'black',
//         //     tile: String.fromCharCode(97 + file) + String(rank % 8 + 1),
//         //     rank,
//         //     file,
//         //     hasMoved: false
//         // };

//         // if(pieceType === 'king') {
//         //     piece.name = (isWhite ? 'white' : 'black') + 'king'
//         // }

//         // pieces.add(piece);
//         // level.board[rank][file] = piece;
//     };
// };

// pieces.position.set((-level.length / 2) + 0.5, 0, (-level.width / 2) + 0.5);
// scene.add(pieces);