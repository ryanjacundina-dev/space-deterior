export class Animations {
    static getPlayerAnimations(){
        return {
            'idle': {frames: 2, duration: 0.2, startSx: 0, startSy: 0, loop: true, next: null},
            'right': {frames: 2, duration: 0.2, startSx: this.width * 2, startSy: 0, loop: true, next: null},
            'left': {frames: 2, duration: 0.2, startSx: this.width * 4, startSy: 0, loop: true, next: null}
        };
    }

    static getMeteorAnimations(){
        return {
            'active': {frames: 4, duration: 0.4, startSx: 0, startSy: 0, loop: true, next: null},
            'explosion': {frames: 2, duration: 0.2, startSx: 128, startSy: 0, loop: false, next: 'inactive'},
            'inactive': {frames: 0, duration: 0, startSx: 0, startSy: 0, loop: false, next: false}
        };
    }
}