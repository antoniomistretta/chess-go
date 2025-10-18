import ModelLoader from '/js/ModelLoader.js';
import Game from '/js/Game.js';

const { createApp, onMounted, ref  } = Vue;

const app = createApp({
	setup() {
		const game = new Game();
		const percentLoaded = ref(0);

		onMounted(() => {
			const modelLoader = new ModelLoader();
			modelLoader.loadModels(
				['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'],
				(_, itemsLoaded, itemsTotal) => {
					percentLoaded.value = (itemsLoaded / itemsTotal) * 100;
				},
				() => {
					game.loadLevel('classic');
				}
			);
		});

		const handleUIAction = (action, data = {}) => {
			switch(action) {
				case 'reset':
					game.loadLevel(game.level.name);
					break;
			}
		};

		return {
			handleUIAction,
			percentLoaded
		};
	}
});

app.mount('#interface');