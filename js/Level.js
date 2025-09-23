import { Group } from 'three';

import Tile from '/js/Tile.js';
import Piece from '/js/Piece.js';

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
};

export default Level;