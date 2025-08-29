import { Group } from 'three';

import Tile from '/js/Tile.js';
import Piece from '/js/Piece.js';

const conditions = {
	'checkmate': () => {
		console.log('checking for checkmate');
	}
};

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
			['-','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','-'],
			['-','-','-','-','-','-','-','B'],
			['B','-','-','-','-','-','-','-'],
			['-','-','-','r','-','b','N','-'],
			['-','P','-','-','-','-','-','-'],
			['-','-','-','k','-','-','-','-'],
			['-','-','-','-','-','-','-','-']
		]
	}
};

class Level {
	constructor(name) {
		this.board = levels[name].board.reverse();
		this.length = this.board.length;
		this.width = this.board[0].length;

		this.loadBoard();
	}

	getRankAndFileOf(piece) {
		const rank = piece.tile.split('')[1] - 1;
		const file = piece.tile.split('')[0].charCodeAt(0) - 97;

		return { rank, file };
	}

	getPieceAt(rank, file) {
		return this.board?.[rank]?.[file] === 'X' ? undefined : this.board?.[rank]?.[file];
	}

	getTileNotationOf(rank, file) {
		return String.fromCharCode(97 + file) + String(rank + 1);
	}

	getValidMoves(piece) {
		const validMoves = [];
		const pinnedTiles = [];
		const { rank, file } = this.getRankAndFileOf(piece);

		if(piece.type !== 'king') {
			const king = this.pieces.getObjectByName(piece.color + ' king');

			if(king !== undefined) {
				const { rank: kingRank, file: kingFile } = this.getRankAndFileOf(king);

				if(kingRank === rank) {
					if(kingFile < file) {
						pinnedTiles.push(...this.getPinnedMoves(kingRank, kingFile, rank, file, king.color, 0, 1));
					} else if(kingFile > file) {
						pinnedTiles.push(...this.getPinnedMoves(kingRank, kingFile, rank, file, king.color, 0, -1));
					}
				} else if(kingFile === file) {
					if(kingRank < rank) {
						pinnedTiles.push(...this.getPinnedMoves(kingRank, kingFile, rank, file, king.color, 1, 0));
					} else if(kingRank > rank) {
						pinnedTiles.push(...this.getPinnedMoves(kingRank, kingFile, rank, file, king.color, -1, 0));
					}
				} else if(Math.abs(kingRank - rank) === Math.abs(kingFile - file)) {
					const rankMultiplier = Math.sign(rank - kingRank);
					const fileMultiplier = Math.sign(file - kingFile);

					pinnedTiles.push(...this.getPinnedMoves(kingRank, kingFile, rank, file, king.color, rankMultiplier, fileMultiplier));
				}
			}
		}

		switch(piece.type) {
			case 'pawn':
				for(const move of piece.getAllMoves(rank, file)) {
					const target = this.getPieceAt(move[0], move[1]);
					const direction = this.color === 'white' ? 1 : 0;

					if(target === undefined) {
						continue;
					}

					if(
						file !== move[1]
						&& target !== '-'
						&& target.color !== piece.color
					) {
						validMoves.push(this.getTileNotationOf(move[0], move[1]));
					} else if (
						file === move[1]
						&& (
							rank === move[0] - 1
							|| this.getPieceAt(move[0], move[1] - 1) === '-'
						) && target === '-'
					) {
						validMoves.push(this.getTileNotationOf(move[0], move[1]));
					}
				}
				break;
			case 'knight':
				for(const move of piece.getAllMoves(rank, file)) {
					const target = this.getPieceAt(move[0], move[1]);

					if(target === undefined) {
						continue;
					}

					if(
						target === '-' || (
							target !== '-'
							&& target.color !== piece.color
						)
					) {
						validMoves.push(this.getTileNotationOf(move[0], move[1]));
					}
				}
				break;
			case 'king':
				for(const move of piece.getAllMoves(rank, file)) {
					const target = this.getPieceAt(move[0], move[1]);

					if(target === undefined) {
						continue;
					}

					if(
						!this.isTileUnderAttack(move[0], move[1], piece.color)
						&& (
							target === '-'
							|| (
								target !== '-'
								&& target.color !== piece.color
							)
						)
					) {
						validMoves.push(this.getTileNotationOf(move[0], move[1]));
					}
				}
				break;
			case 'bishop':
			case 'rook':
			case 'queen':
				for(const traversalFunction of piece.getAllMoves(rank, file)) {
					let move = traversalFunction(rank, file, 1);
					let target = this.getPieceAt(move[0], move[1]);

					while(target !== undefined) {
						if(target !== '-') {
							if(target.color === piece.color) {
								break;
							} else {
								validMoves.push(this.getTileNotationOf(move[0], move[1]));
								break;
							}
						}

						validMoves.push(this.getTileNotationOf(move[0], move[1]));

						move = traversalFunction(rank, file, move[2]);
						target = this.getPieceAt(move[0], move[1]);
					}
				}
				break;
		}

		if(pinnedTiles.length > 0) {
			return validMoves.filter(function(move) {
				return pinnedTiles.includes(move);
			});
		}

		return validMoves;
	}

	loadBoard() {
		this.tiles = new Group();
		this.pieces = new Group();

        for(let rank = 0; rank < this.length; rank++) {
            for(let file = 0; file < this.width; file++) {
				const identifier = this.getPieceAt(rank,file);

                if(identifier === undefined) {
                    continue;
                }

                const tile = new Tile(
					this.getTileNotationOf(rank, file),
					rank % 2 === file % 2 ? 'dark' : 'light'
				);
                tile.position.set(rank, -0.05, file);
				tile.userData = {
					'rank': rank,
					'file': file
				};
				this.tiles.add(tile);

				if(identifier === '-') {
                    continue;
                }

				const piece = new Piece(
					identifier.toLowerCase(),
					identifier === identifier.toLowerCase() ? 'white' : 'black',
					this.getTileNotationOf(rank, file)
				);
				piece.position.set(rank, 0, file);
				this.pieces.add(piece);

				this.board[rank][file] = piece;
            };
        };

		this.tiles.position.set((-this.length / 2) + 0.5, 0, (-this.width / 2) + 0.5);
		this.pieces.position.set((-this.length / 2) + 0.5, 0, (-this.width / 2) + 0.5);
	}

	isTileUnderAttack(rank, file, color) {
		for(const traverse of [
			(rank, file, i) => [ rank + 1, file, i + 1, ['rook','queen']],
			(rank, file, i) => [ rank - 1, file, i + 1, ['rook','queen']],
			(rank, file, i) => [ rank, file + 1, i + 1, ['rook','queen']],
			(rank, file, i) => [ rank, file - 1, i + 1, ['rook','queen']],
			(rank, file, i) => [ rank + 1, file + 1, i + 1, ['bishop','queen']],
			(rank, file, i) => [ rank + 1, file - 1, i + 1, ['bishop','queen']],
			(rank, file, i) => [ rank - 1, file + 1, i + 1, ['bishop','queen']],
			(rank, file, i) => [ rank - 1, file - 1, i + 1, ['bishop','queen']]
		]) {
			let move = traverse(rank, file, 1);

			while(this.getPieceAt(move[0], move[1]) !== undefined) {
				if(
					this.getPieceAt(move[0], move[1]).type === 'king'
					&& this.getPieceAt(move[0], move[1]).color === color
				) {
					move = traverse(move[0], move[1], move[2]);
				} else {
					if(
						move[3].includes(this.getPieceAt(move[0], move[1]).type)
						&& this.getPieceAt(move[0], move[1]).color !== color
					) {
						return true;
					} else if(this.getPieceAt(move[0], move[1]).color === color) {
						// continue;
					}

					move = traverse(move[0], move[1], move[2]);
				}
			}
		}

		const knightPositions = [
			[rank + 1, file + 2],
			[rank + 2, file + 1],
			[rank + 1, file - 2],
			[rank - 2, file + 1],
			[rank - 1, file + 2],
			[rank + 2, file - 1],
			[rank - 1, file - 2],
			[rank - 2, file - 1]
		];

		for(const move of knightPositions) {
			const piece = this.getPieceAt(move[0], move[1]);

			if(piece === undefined) {
				continue;
			}

			if(
				piece.type === 'knight'
				&& piece.color !== color
			) {
				return true;
			}
		}

		const direction = color === 'white' ? 1 : -1;
		const pawnPositions = [
			[rank + direction, file + 1],
			[rank + direction, file - 1]
		];

		for(const move of pawnPositions) {
			const piece = this.getPieceAt(move[0], move[1]);

			if(piece === undefined) {
				continue;
			}

			if(
				piece.type === 'pawn'
				&& piece.color !== color
			) {
				return true;
			}
		}

		return false;
	}

	getPinnedMoves(kingRank, kingFile, pieceRank, pieceFile, color, rankMultiplier, fileMultiplier) {
		const attackingPieces = ['queen', Math.abs(rankMultiplier) === Math.abs(fileMultiplier) ? 'bishop' : 'rook'];
		const tileHistory = [];

		let i = 1;
		let piece = this.getPieceAt(kingRank + (i * rankMultiplier), kingFile + (i * fileMultiplier));

		while(piece !== undefined) {
			tileHistory.push(this.getTileNotationOf(kingRank + (i * rankMultiplier), kingFile + (i * fileMultiplier)));

			if(
				kingRank + (i * rankMultiplier) !== pieceRank
				&& kingFile + (i * fileMultiplier) !== pieceFile
				&& piece.color === color
			) {
				return [];
			}

			if(
				piece.color !== color
				&& attackingPieces.includes(piece.type)
			) {
				return tileHistory;
			}

			i += 1;
			piece = this.getPieceAt(kingRank + (i * rankMultiplier), kingFile + (i * fileMultiplier));
		}

		return [];
	}
}

export default Level;