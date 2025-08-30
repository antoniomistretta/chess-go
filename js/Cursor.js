class Cursor {
    constructor() {
        this.x = null;
        this.y = null;

        document.addEventListener('mousemove', (event) => {
            this.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        document.addEventListener('touchmove', (event) => {
            const touches = event.changedTouches;

            this.x = (touches[0].clientX / window.innerWidth) * 2 - 1;
            this.y = -(touches[0].clientY / window.innerHeight) * 2 + 1;
        });
    }
}

export default Cursor;