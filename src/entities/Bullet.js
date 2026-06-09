export class Bullet {
    constructor(config){
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = 3;
        this.height = 0;
        this.finalHeight = 12;
        this.color = 'red';

        this.hitboxes = [
            {
                "offsetX": 0,
                "offsetY": 0,
                "width": this.width,
                "height": this.height
            }
        ];

        this.currentAnimation = true;

        this.active = true;

        this.movingSpeed = 100;
        this.moving = true;

        this.force = config.force || 100;
        this.defense = 0;
        this.health = 100;
    }

    getY(){
        return this.y;
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
            "width": this.width,
            "height": this.height
        }
    }

    setState(newState){
        if(newState == 'inactive'){
            this.moving = false;
            this.currentAnimation = false;
            this.active = false;
        }
    }

    update(dt){
        //Movement & Height Spanding
        if(this.moving){
            this.y -= dt * this.movingSpeed;
            this.height += dt * this.movingSpeed;
            if(this.height >= this.finalHeight) this.height = this.finalHeight;
        }
    }

    draw(ctx, camera){
        if(!this.currentAnimation) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(
            Math.floor(this.x + camera.x), Math.floor(this.y + camera.y),
            this.width, this.height
        )
    }
}