export class Funcionality {
    static getRegressiveCounterText(counter){
        let text;
        if(counter > 3) text = '';
        else if(counter > 2) text = '3';
        else if(counter > 1) text = '2';
        else if(counter > 0) text = '1';
        else text = 'Go!';
        return text;
    }

    static getParallaxPositionY(timer, duration, img){
        let res;
        let perc = timer / duration;
        res = img.height * perc;
        return res;
    }

    static random(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getColorBasedOnCritic(perc){
        if(perc > 0.7) return 'white';
        else if(perc > 0.2) return 'yellow';
        else return 'red';
    }
}