import { LoadingManager } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loadedModels = {};

class ModelLoader {
    constructor() {
        this.loadingManager = new LoadingManager();
        this.loader = new GLTFLoader(this.loadingManager);
    }

    loadModels(models, onProgress, onComplete) {
        this.loadingManager.onLoad = onComplete;
        this.loadingManager.onProgress = onProgress;

        for(const model of models) {
            this.loader.load(
                'gltf/' + model + '/scene.gltf',
                (object) => {
                    loadedModels[model] = object.scene;
                }
            );
        };
    };

    get(model) {
        return loadedModels[model].clone();
    }
}

export default ModelLoader;