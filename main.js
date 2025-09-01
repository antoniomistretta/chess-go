import ModelLoader from '/js/ModelLoader.js';
import Game from '/js/Game.js';

document.addEventListener('DOMContentLoaded', () => {
	const modelLoader = new ModelLoader();
	modelLoader.loadModels(['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'], function() {
		document.querySelector('button').addEventListener('click', () => {
			startGame();
		});
	});
});

function startGame() {
	document.querySelector('#interface').remove();
	new Game();
}