import ModelLoader from '/js/ModelLoader.js';
import Game from '/js/Game.js';

const { createApp, onMounted, ref  } = Vue;

const app = createApp({
	setup() {
		const game = new Game();
		const uiState = ref('loading');
		const percentLoaded = ref(0);

		onMounted(() => {
			const modelLoader = new ModelLoader();
			modelLoader.loadModels(
				['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'],
				(_, itemsLoaded, itemsTotal) => {
					percentLoaded.value = itemsLoaded / itemsTotal
				},
				() => {
					uiState.value = 'level';
					game.loadLevel('classic');
					// uiState.value = 'mainmenu';
				}
			);
		});

		const handleUIAction = (action, data = {}) => {
			switch(action) {
				case 'showLevels':
					uiState.value = 'levels';
					break;
				case 'loadLevel':
					uiState.value = 'level';
					game.loadLevel(data.level);
					break;
			}
		}

		return {
			handleUIAction,
			percentLoaded,
			uiState
		};
	}
});

app.mount('#interface');