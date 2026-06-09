import { Hitboxes } from "../resources/Hitboxes.js";

export class Meteor {
    constructor(config){
        this.asset = config.assets.images['meteor'];
        this.x = config.x;
        this.y = config.y || -224;
        this.width = 32;
        this.height = 32;

        this.hitboxes = Hitboxes.getMeteorHitBoxes();

        this.animations = {
            'active': {frames: 4, duration: 1, startSx: 32, startSy: 0, loop: true, next: null},
            'explosion': {frames: 2, duration: 0.2, startSx: 160, startSy: 0, loop: false, next: false}
        };
        this.currentAnimation = 'active';
        this.currentAnimationFrame = 0;
        this.animationTimer = 0;

        this.active = true;

        this.movingSpeed = config.speed;
        this.moving = true;

        this.force = config.force || 50;
        this.defense = 0;
        this.health = 100;

        this.wasHitted = false;
        this.wasHittedTimer = 0;
        this.wasHittedDuration = 0.1;
    }

    getY(){
        return this.y;
    }

    getForce(){
        return this.force;
    }

    getDefense(){
        return this.defense;
    }

    removeHealth(qtd){
        this.health -= qtd;
        if(this.health <= 0){
            this.health = 0;
            this.wasHitted = false;
        }
        else {
            this.wasHitted = true;
            this.wasHittedTimer = 0;
        }
    }
    
    addHealth(qtd){
        this.health += qtd;
        if(this.health > 100) this.health = 100;
    }

    isActive(){
        return this.active;
    }

    getHitboxesLength(){
        return this.hitboxes.length;
    }

    getRealHitbox(index){
        return {
            "x": this.x + this.hitboxes[index].offsetX,
            "y": this.y + this.hitboxes[index].offsetY,
            "width": this.hitboxes[index].width,
            "height": this.hitboxes[index].height
        }
    }

    getCurrentAnimation(){
        return this.currentAnimation;
    }

    setCurrentAnimation(name){
        this.currentAnimation = name;
        this.currentAnimationFrame = 0;
        this.animationTimer = 0;
    }

    isVisible(){
        return this.currentAnimation;
    }
    
    setState(stateName, newState = true, config = {}){
        if(stateName == 'active'){
            if(newState){
                this.active = true;
                this.moving = true;
            }else{
                this.active = false;
                this.moving = false;
            }
        }else if(stateName == 'explosion'){
            this.health = -1;
            this.moving = false;
            this.active = false;
            this.setCurrentAnimation('explosion');
        }else if(stateName == '....'){
            this.moving = false;
            this.active = false;
            this.currentAnimation = false;
        }
    }

    update(dt){
        if(this.health == 0) this.setState('explosion');

        //Hitted effect
        if(this.wasHitted){
            if(this.wasHittedTimer >= this.wasHittedDuration){
                this.wasHitted = false;
                this.wasHittedTimer = 0;
            }else{
                this.wasHittedTimer += dt;
            }
        }

        //Animation
        if(this.currentAnimation){
            this.animationTimer += dt;
            if(this.animationTimer >= this.animations[this.currentAnimation].duration / this.animations[this.currentAnimation].frames){
                this.animationTimer = 0;
                this.currentAnimationFrame++;
                if(this.currentAnimationFrame >= this.animations[this.currentAnimation].frames){
                    this.currentAnimationFrame = 0;
                    if(this.animations[this.currentAnimation].loop == false){
                        this.setCurrentAnimation(this.animations[this.currentAnimation].next);
                    }
                }
            }
        }

        //Movement
        if(this.moving){
            this.y += dt * this.movingSpeed;
        }
    }

    draw(ctx, camera){
        if(!this.currentAnimation) return;

        if(this.wasHitted) ctx.filter = 'brightness(200%';
        else ctx.filter = 'none';

        ctx.drawImage(
            this.asset,
            this.animations[this.currentAnimation].startSx + (this.currentAnimationFrame * this.width), this.animations[this.currentAnimation].startSy,
            this.width, this.height,
            this.x + camera.x, this.y + camera.y,
            this.width, this.height
        );
    }
}