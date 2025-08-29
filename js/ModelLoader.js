import { LoadingManager } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loadedModels = {};

class ModelLoader {
    constructor() {
        this.loadingManager = new LoadingManager();
        this.loader = new GLTFLoader(this.loadingManager);

        this.loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
            console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
    }

    loadModels(models, onComplete) {
        this.loadingManager.onLoad = onComplete;

        for(const model of models) {
            this.loader.load(
                'gltf/' + model + '/scene.gltf',
                (object) => {
                    loadedModels[model] = object.scene;
                }
            );
        }
    }

    get(model) {
        return loadedModels[model].clone();
    }
}

export default ModelLoader;