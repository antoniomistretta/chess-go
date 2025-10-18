import { MeshStandardMaterial } from 'three';

class LightTileMaterial extends MeshStandardMaterial {
    constructor() {
        super();
        this.color.set(0xd2b48c);
    }
}

class DarkTileMaterial extends MeshStandardMaterial {
    constructor() {
        super();
        this.color.set(0x664229);
    }
}

export { LightTileMaterial, DarkTileMaterial };