import { BoxGeometry, Mesh } from 'three';
import { LightTileMaterial, DarkTileMaterial } from '/js/Material.js';

class Tile extends Mesh {
    constructor(name, type) {
        super(
            new BoxGeometry(1, 0.1, 1),
            type === 'light' ? new LightTileMaterial() : new DarkTileMaterial()
        );

        this.name = name;
        this.material.emissive.set(0XFFFFFF);
        this.material.emissiveIntensity = 0;

        this.receiveShadow = true;
    }

    highlight() {
        this.material.emissiveIntensity = 0.5;
    }

    unhighlight() {
        this.material.emissiveIntensity = 0;
    }
}

export default Tile;