import { MeshStandardMaterial } from 'three';

class LightTileMaterial extends MeshStandardMaterial {
    constructor() {
        super();
        this.color.set(0XD2B48C);
    }
}

class DarkTileMaterial extends MeshStandardMaterial {
    constructor() {
        super();
        this.color.set(0X664229);
    }
}

export { LightTileMaterial, DarkTileMaterial };