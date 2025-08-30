import ModelLoader from '/js/ModelLoader.js';
import Game from '/js/Game.js';

document.addEventListener('DOMContentLoaded', () => {
	const modelLoader = new ModelLoader();
	modelLoader.loadModels(['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'], function() {
		startGame();
	});
});

function startGame() {
	new Game();
}