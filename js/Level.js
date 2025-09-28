import { Group } from 'three';

import Tile from '/js/Tile.js';
import Piece from '/js/Piece.js';

const levels = {
	// 'classic': {
	// 	board: [
	// 		['R','N','B','Q','K','B','N','R'],
	// 		['P','P','P','P','P','P','P','P'],
	// 		['-','-','-','-','-','-','-','-'],
	// 		['-','-','-','-','-','-','-','-'],
	// 		['-','-','-','-','-','-','-','-'],
	// 		['-','-','-','-','-','-','-','-'],
	// 		['p','p','p','p','p','p','p','p'],
	// 		['r','n','b','q','k','b','n','r']
	// 	]
	// },
	'classic': {
		board: [
			['K','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','-'],
			['Q','-','r','-','k','-','-','-'],
			['-','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','-']
		]
	},
	'1': {
		board: [
			['K','X'],
			['-','X'],
			['-','X'],
			['-','-'],
			['-','r']
		]
	}
};

class Level {
	constructor(name) {
		this.board = levels[name].board.reverse();
		this.length = this.board.length;
		this.width = this.board[0].length;

		this.tiles = new Group();
		this.pieces = new Group();

		for(let rank = 0; rank < this.length; rank++) {
			for(let file = 0; file < this.width; file++) {
				const identifier = this.getPieceAt(rank, file);

				if(identifier === undefined) {
					continue;
				}

				const tile = new Tile(this.getNotationOf(rank, file), rank, file);
				this.tiles.add(tile);

				if(identifier === '-') {
					continue;
				}

				const piece = new Piece(identifier, rank, file);
				this.pieces.add(piece);

				this.board[rank][file] = piece;
			};
		};

		this.tiles.position.set((-this.length / 2) + 0.5, 0, (-this.width / 2) + 0.5);
		this.pieces.position.set((-this.length / 2) + 0.5, 0, (-this.width / 2) + 0.5);
	};

	getPieceAt(rank, file) {
		return this.board?.[rank]?.[file] === 'X' ? undefined : this.board?.[rank]?.[file];
	}

	getNotationOf(rank, file) {
		return String.fromCharCode(97 + file) + String(rank + 1);
	}

	getRankAndFileOfNotation(notation) {
		const rank = notation.split('')[1] - 1;
		const file = notation.split('')[0].charCodeAt(0) - 97;

		return { rank, file };
	}

	getValidMoves(piece, color, lastMove) {
		const validMoves = [];

		const rank = piece.userData.rank;
		const file =  piece.userData.file;

		const direction = piece.userData.color === 'white' ? 1 : -1;

		switch(piece.userData.type) {
			case 'pawn':
				if(this.getPieceAt(rank + direction, file) === '-') {
					validMoves.push(this.getNotationOf(rank + direction, file));
					if(this.getPieceAt(rank + (direction * 2), file) === '-' && piece.userData.movedCount === 0) {
						validMoves.push(this.getNotationOf(rank + (direction * 2), file));
					}
				}

				for(const move of [
					[rank + direction, file - 1],
					[rank + direction, file + 1]
				]) {
					const target = this.getPieceAt(move[0], move[1]);
					
					if(target === undefined) {
						continue;
					}

					if(target?.userData?.color ?? color !== color) {
						validMoves.push(this.getNotationOf(move[0], move[1]));
					}
				}
				break;

			case 'knight':
				for(const move of [
					[rank + 1, file + 2],
					[rank + 2, file + 1],
					[rank + 1, file - 2],
					[rank + 2, file - 1],
					[rank - 1, file - 2],
					[rank - 2, file - 1],
					[rank - 1, file + 2],
					[rank - 2, file + 1]
				]) {
					const target = this.getPieceAt(move[0], move[1]);
					
					if(target === undefined) {
						continue;
					}

					if(target?.userData?.color !== color) {
						validMoves.push(this.getNotationOf(move[0], move[1]));
					}
				}
				break;

			case 'king':
				for(const move of [
					[rank + 1, file],
					[rank, file + 1],
					[rank + 1, file + 1],
					[rank - 1, file],
					[rank, file - 1],
					[rank - 1, file - 1],
					[rank + 1, file - 1],
					[rank - 1, file + 1]
				]) {
					const target = this.getPieceAt(move[0], move[1]);

					if(target === undefined) {
						continue;
					}

					if(target?.userData?.color !== color) {
						validMoves.push(this.getNotationOf(move[0], move[1]));
					}
				}
				break;

			case 'bishop':
			case 'rook':
			case 'queen':
				for(const traversalFunction of this.getTraversalFunction(piece.userData.type)) {
					let move = traversalFunction(rank, file, 1);
					let target = this.getPieceAt(move[0], move[1]);

					while(target !== undefined) {
						if(target !== '-') {
							if((target?.userData?.color ?? color) !== color) {
								validMoves.push(this.getNotationOf(move[0], move[1]));
							}

							break;
						}

						validMoves.push(this.getNotationOf(move[0], move[1]));

						move = traversalFunction(rank, file, move[2]);
						target = this.getPieceAt(move[0], move[1]);
					}
				}

				break;
		}

		const invalidMoves = [];
		const king = this.pieces.getObjectByName(color + 'king');

		if(piece === king) {
			for(const move of validMoves) {
				const { rank: targetRank, file: targetFile } = this.getRankAndFileOfNotation(move);

				for(const move of [
					[targetRank + 1, targetFile],
					[targetRank, targetFile + 1],
					[targetRank + 1, targetFile + 1],
					[targetRank - 1, targetFile],
					[targetRank, targetFile - 1],
					[targetRank - 1, targetFile - 1],
					[targetRank + 1, targetFile - 1],
					[targetRank - 1, targetFile + 1]
				]) {
					if((this.getPieceAt(move[0], move[1])?.userData?.color ?? color) !== color && this.getPieceAt(move[0], move[1])?.userData?.type === 'king') {
						invalidMoves.push(this.getNotationOf(targetRank, targetFile));
						break;
					}
				}

				for(const move of [
					[targetRank + direction, targetFile - 1],
					[targetRank + direction, targetFile + 1]
				]) {
					if((this.getPieceAt(move[0], move[1])?.userData?.color ?? color) !== color && this.getPieceAt(move[0], move[1])?.userData?.type === 'pawn') {
						invalidMoves.push(this.getNotationOf(targetRank, targetFile));
						break;
					}
				}

				for(const move of [
					[targetRank + 1, targetFile + 2],
					[targetRank + 2, targetFile + 1],
					[targetRank + 1, targetFile - 2],
					[targetRank + 2, targetFile - 1],
					[targetRank - 1, targetFile - 2],
					[targetRank - 2, targetFile - 1],
					[targetRank - 1, targetFile + 2],
					[targetRank - 2, targetFile + 1]
				]) {
					if((this.getPieceAt(move[0], move[1])?.userData?.color ?? color) !== color && this.getPieceAt(move[0], move[1])?.userData?.type === 'knight') {
						invalidMoves.push(this.getNotationOf(targetRank, targetFile));
						break;
					}
				}

				for(const traversalFunction of this.getTraversalFunction('rook')) {
					let move = traversalFunction(targetRank, targetFile, 1);
					let target = this.getPieceAt(move[0], move[1]);

					while(target !== undefined) {
						if(target !== '-') {
							if(target.userData.color === color) {
								break;
							} else if(target.userData.color !== color && ['rook', 'queen'].includes(this.getPieceAt(move[0], move[1]).userData.type)) {
								invalidMoves.push(this.getNotationOf(targetRank, targetFile));
								break;
							}
						}

						move = traversalFunction(targetRank, targetFile, move[2]);
						target = this.getPieceAt(move[0], move[1]);
					}
				}

				for(const traversalFunction of this.getTraversalFunction('bishop')) {
					let move = traversalFunction(targetRank, targetFile, 1);
					let target = this.getPieceAt(move[0], move[1]);

					while(target !== undefined) {
						if(target !== '-') {
							if(target.userData.color === color) {
								break;
							} else if(target.userData.color !== color && ['bishop', 'queen'].includes(this.getPieceAt(move[0], move[1]).userData.type)) {
								invalidMoves.push(this.getNotationOf(targetRank, targetFile));
								break;
							}
						}

						move = traversalFunction(targetRank, targetFile, move[2]);
						target = this.getPieceAt(move[0], move[1]);
					}
				}
			}
		} else {
			for(const move of validMoves) {
				const kingRank = king.userData.rank;
				const kingFile = king.userData.file;
				const sourceRank = rank;
				const sourceFile = file;
				const targetRank = move[0];
				const targetFile = move[1];

				// eminate from the king and figure out if i can move a piece either from a location or to a location

				// for pinned pieces we need to determine any safe moves that they can make

				// for blocking pieces we need to detemrin which moves block an attacker

				// lastly if the king is under threat then that threat MUST be delt with
				// if there are multiple threats then it is game over AKA no valid moves for any pieces
			}
		}

		console.log(validMoves);
		console.log(invalidMoves);

		return validMoves.filter(move => !invalidMoves.includes(move));
	}

	getTraversalFunction(type) {
		switch(type) {
			case 'bishop':
				return [
					(rank, file, i) =>  [ rank + i, file + i, i + 1 ],
					(rank, file, i) =>  [ rank - i, file + i, i + 1 ],
					(rank, file, i) =>  [ rank + i, file - i, i + 1 ],
					(rank, file, i) =>  [ rank - i, file - i, i + 1 ]
				];
			case 'rook':
				return [
					(rank, file, i) =>  [ rank + i, file, i + 1 ],
					(rank, file, i) =>  [ rank - i, file, i + 1 ],
					(rank, file, i) =>  [ rank, file + i, i + 1 ],
					(rank, file, i) =>  [ rank, file - i, i + 1 ]
				];
			case 'queen':
				return [
					(rank, file, i) =>  [ rank + i, file, i + 1 ],
					(rank, file, i) =>  [ rank - i, file, i + 1 ],
					(rank, file, i) =>  [ rank, file + i, i + 1 ],
					(rank, file, i) =>  [ rank, file - i, i + 1 ],
					(rank, file, i) =>  [ rank + i, file + i, i + 1 ],
					(rank, file, i) =>  [ rank - i, file + i, i + 1 ],
					(rank, file, i) =>  [ rank + i, file - i, i + 1 ],
					(rank, file, i) =>  [ rank - i, file - i, i + 1 ]
				];
		}
	}
};

export default Level;