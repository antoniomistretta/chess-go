import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';

class Tile extends Mesh {
    constructor(name, rank, file) {
        super(
            new BoxGeometry(1, 0.1, 1),
            new MeshStandardMaterial({ color: rank % 2 === file % 2 ? 0XD2B48C : 0X664229 })
        );

        this.name = name;
        this.userData = {
            'rank': rank,
            'file': file
        };

        this.receiveShadow = true;
        this.material.transparent = true;
        this.material.opacity = 0;
        this.material.emissive.set(0XFFFFFF);
        this.material.emissiveIntensity = 0;
        this.position.set(rank, -3, file);
    }

    highlight() {
        this.material.emissiveIntensity = 0.5;
    }

    unhighlight() {
        this.material.emissiveIntensity = 0;
    }
}

export default Tile;