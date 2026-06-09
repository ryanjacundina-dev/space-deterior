export class InputHandler {
    constructor(){
        this.keys = {};

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isPressed(action){
        if(action == 'shot') return this.keys['KeyA'];
        if(action == 'left') return this.keys['ArrowLeft'];
        if(action == 'right') return this.keys['ArrowRight'];
        return false;
    }
}