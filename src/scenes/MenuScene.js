import { CtxUtils } from '/src/utils/CtxUtils.js';

export class MenuScene {
    constructor(sceneManager, inputHandler, assets){
        this.sceneManager = sceneManager;
        this.inputHandler = inputHandler;
        this.assets = assets;
        this.sceneState = 'before-space-pressed';
        
        this.currentFrame = 0;
        this.totalFrames = 4;
        this.animationSpeed = 0.300;
        this.animationTimer = 0;

        this.fadeTimer = 0;
    }

    update(dt){
        //Animação da tela
        this.animationTimer += dt;
        if(this.animationTimer >= this.animationSpeed){
            this.currentFrame++;
            this.animationTimer = 0;
        }
        if(this.currentFrame >= this.totalFrames) this.currentFrame = 0;

        if(this.sceneState == 'before-space-pressed'){
            if(this.inputHandler.keys['Space']){
                this.sceneState = 'after-space-pressed';
                document.body.requestFullscreen();
            }
        }else{
            if(this.fadeTimer >= 1){
                this.sceneManager.changeScene('gamePlay');
                return;
            }
            this.fadeTimer += dt;
        }
    }

    draw(ctx){
        ctx.drawImage(
            this.assets.images['home-screen'], 
            this.currentFrame * ctx.canvas.width, 0,
            ctx.canvas.width, ctx.canvas.height,
            0, 0,
            ctx.canvas.width, ctx.canvas.height
        );

        if(this.sceneState == 'after-space-pressed'){
            ctx.fillStyle = `rgb(0, 0, 0, ${this.fadeTimer})`;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }
}