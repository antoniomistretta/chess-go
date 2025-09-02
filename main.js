import ModelLoader from '/js/ModelLoader.js';
import Game from '/js/Game.js';

const { createApp, onMounted, ref  } = Vue;
const app = createApp({
	setup() {
		const menuScreen = ref('main');
		const gameInProgress = ref(false);
		const modelsLoaded = ref(false);
		const game = new Game();

		const startGame = (mode, level) => {
			if(modelsLoaded.value) {
				gameInProgress.value = true;
				game.start(mode, level);
			}
		};

		onMounted(() => {
			const modelLoader = new ModelLoader();
			modelLoader.loadModels(['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'], function() {
				modelsLoaded.value = true;
			});
		});

		return {
			gameInProgress,
			menuScreen,
			startGame
		};
	}
});

app.mount('#interface');