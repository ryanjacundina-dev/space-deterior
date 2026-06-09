import { Funcionality } from "../utils/Functionality.js";

export class MeteorGenerator {
    constructor(scene){
        this.scene = scene;
        this.minSpeed = 50;
        this.maxSpeed = 100;
        this.minMeteors = 1;
        this.maxMeteors = 3;
        this.minNextGenerator = 0.5;
        this.maxNextGenerator = 2.5;
        this.nextGenerator = 1;
        this.nextGeneratorTimer = 0;
    }

    update(dt){
        this.nextGeneratorTimer += dt;

        if(this.nextGeneratorTimer >= this.nextGenerator){
            this.nextGenerator = Funcionality.random(this.minNextGenerator, this.maxNextGenerator);
            this.nextGeneratorTimer = 0;

            let generate = Math.ceil(Funcionality.random(this.minMeteors, this.maxMeteors));
            let meteors = [];
            for(let i = 0; i < generate; i++){
                this.scene.addMeteorToSpawn({
                    whenTimer: this.scene.getTimer(),
                    x: Math.floor(Funcionality.random(-64, 96)),
                    speed: Funcionality.random(this.minSpeed, this.maxSpeed)
                });
            }
        }
    }
}