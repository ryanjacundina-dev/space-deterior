import { Hitboxes } from "../resources/Hitboxes.js";

export class Player {
    constructor(config){
        this.asset = config.assets.images['spaceship'];
        this.x = 0;
        this.y = 0;
        this.width = 64;
        this.height = 64;
        
        this.hitboxes = Hitboxes.getPlayerHitBoxes();

        this.animations = {
            'idle': {frames: 2, duration: 0.2, startSx: 0, startSy: 0, loop: true, next: null},
            'right': {frames: 2, duration: 0.2, startSx: this.width * 2, startSy: 0, loop: true, next: null},
            'left': {frames: 2, duration: 0.2, startSx: this.width * 4, startSy: 0, loop: true, next: null}
        };
        this.currentAnimation = 'idle';
        this.currentAnimationFrame = 0;
        this.animationTimer = 0;

        this.offsetxBullet = {
            'left': 16, 'right': 45
        };

        this.offsetyBullet = {
            'standard': 10
        };

        this.moving = false;
        this.movingDirection = 'left';
        this.movingSpeed = 100;
        this.movingLimitLeft = -64;
        this.movingLimitRight = 64;
        
        this.force = 50;
        this.defense = 0;
        this.maxHealth = 500;
        this.health = this.maxHealth;

        this.wasHitted = false;
        this.wasHittedTimer = 0;
        this.wasHittedDuration = 0.2;

        this.died = false;
    }

    isDied(){
        return this.died;
    }

    getDefense(){
        return this.defense;
    }

    getForce(){
        return this.force;
    }

    getHealthPercentage(normal = false){
        if(!normal) return Math.ceil(this.health / this.maxHealth * 100);
        else return this.health / this.maxHealth;
    }

    removeHealth(qtd){
        this.health -= qtd;
        if(this.health <= 0){
            this.health = 0;
            this.wasHitted = false;
            this.died = true;
        }
        else {
            this.wasHitted = true;
            this.wasHittedTimer = 0;
        }
    }
    
    addHealth(qtd){
        this.health += qtd;
        if(this.health > this.maxHealth) this.health = this.maxHealth;
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

    getBulletX(name){
        return this.offsetxBullet[name] + this.x;
    }

    getBulletY(name){
        return this.offsetyBullet[name || 'standard'] + this.y;
    }

    getPositionX(){
        return this.x;
    }

    getCurrentAnimation(){
        return this.currentAnimation;
    }

    setCurrentAnimation(name){
        this.currentAnimation = name;
        this.currentAnimationFrame = 0;
        this.animationTimer = 0;
    }

    setState(stateName, newState, config = {direction: 'left'}){
        if(stateName == 'moving'){
            if(newState){
                this.moving = true;
                this.movingDirection = config.direction;
            }else{
                this.moving = false;
            }
        }
    }

    update(dt){
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

        //Movement
        if(this.moving){
            if(this.movingDirection == 'left'){
                this.x -= dt * this.movingSpeed;
                if(this.x <= this.movingLimitLeft){
                    this.x = this.movingLimitLeft;
                }
            }
            if(this.movingDirection == 'right'){
                this.x += dt * this.movingSpeed;
                if(this.x >= this.movingLimitRight){
                    this.x = this.movingLimitRight;
                }
            }
        }
    }

    draw(ctx, camera){
        if(this.wasHitted) ctx.filter = 'brightness(500%)';
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