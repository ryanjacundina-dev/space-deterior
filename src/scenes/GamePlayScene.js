import { Player } from '../entities/Player.js';
import { Bullet } from '../entities/Bullet.js';
import { Meteor } from '../entities/Meteor.js';
import { CtxUtils } from '../utils/CtxUtils.js';
import { Funcionality } from '../utils/Functionality.js';
import { Collision } from '../components/Collision.js';
import { MeteorGenerator } from '../components/MeteorGenerator.js';

export class GamePlayScene {
    constructor(sceneManager, inputHandler, assets, canvas){
        this.sceneManager = sceneManager;
        this.inputHandler = inputHandler;
        this.assets = assets;
        this.sceneState = 'intro';
        this.gameOverMessage = 'Your spaceship was destructed';
        this.meteorGenerator = new MeteorGenerator(this);

        this.player = new Player({assets: assets});

        this.camera = {
            x: canvas.width / 2 - this.player.width / 2, 
            y: canvas.height
        };
        this.cameraAnimationDuration = 1;
        this.cameraAnimationTimer = 0;
        this.cameraAnimationFromY = this.camera.y;
        this.cameraAnimationToOffsetY = -80;

        this.regressiveCounter = 3.5;

        this.parallaxLoopDuration = 20;
        this.parallaxLoopTimer = 0;
        this.parallaxPositionX = -50;
        this.parallaxPositionY = 0;

        this.meteors = [];
        this.meteorsStartIndex = 0;
        this.spawnMeteors = [
            // {whenTimer: 1, x: Funcionality.random(-50, 50), speed: 60},
            // {whenTimer: 1, x: Funcionality.random(-50, 50), speed: 60},
            // {whenTimer: 1, x: Funcionality.random(-50, 50), speed: 60},
            // {whenTimer: 1, x: Funcionality.random(-50, 50), speed: 60},
            // {whenTimer: 3, x: Funcionality.random(-50, 50), speed: 60},
            // {whenTimer: 5, x: Funcionality.random(-50, 50), speed: 60},
            // {whenTimer: 6, x: Funcionality.random(-50, 50), speed: 60},
            // {whenTimer: 7, x: Funcionality.random(-50, 50), speed: 60},
            // {whenTimer: 7.5, x: Funcionality.random(-50, 50), speed: 60},
            // {whenTimer: 8, x: Funcionality.random(-50, 50), speed: 60}
        ]
        this.spawnMeteorsStartIndex = 0;
        this.meteorsMaxLeft = 3;
        this.meteorsStillCanLeft = this.meteorsMaxLeft;

        this.bullets = [];
        this.bulletsStartIndex = 0;
        this.lastShotPosition = 'right';
        this.shotBreakDuration = 0.1;
        this.shotBreakTimer = this.shotBreakDuration;
        this.maximumShotLefting = 100;
        this.shotLefting = this.maximumShotLefting;
        this.shotLeftingRecoverDuration = 0.1;
        this.shotLeftingRecoverTimer = 0;
        this.canShot = false;

        this.timer = 0;
        this.distance = 0;
    }

    addMeteorToSpawn(meteor){
        this.spawnMeteors.push(meteor);
    }

    getTimer(){
        return this.timer;
    }

    update(dt){
        if(this.sceneState == 'intro'){
            this.regressiveCounter -= dt;
            this.cameraAnimationTimer += dt;
            if(this.cameraAnimationTimer >= this.cameraAnimationDuration){
                this.camera.y = this.cameraAnimationFromY + this.cameraAnimationToOffsetY;
            }else{
                this.camera.y = this.cameraAnimationFromY + this.cameraAnimationToOffsetY * (this.cameraAnimationTimer / this.cameraAnimationDuration);
            }
            if(this.regressiveCounter <= -0.5){
                this.sceneState = 'play';
            }

            this.player.update(dt);
        }
        
        else if(this.sceneState == 'play'){
            if(this.player.isDied()){
                this.sceneState = 'gameover';
                return;
            }

            this.timer += dt; //Game time
            this.distance += dt * 10;

            //Player controls
            if(this.inputHandler.isPressed('left')){
                if(this.player.getCurrentAnimation()!= 'left'){
                    this.player.setCurrentAnimation('left');
                    this.player.setState('moving', true, {direction: 'left'});
                }
            }else if(this.inputHandler.isPressed('right')){
                if(this.player.getCurrentAnimation()!= 'right'){
                    this.player.setCurrentAnimation('right');
                    this.player.setState('moving', true, {direction: 'right'});
                }
            }else{
                if(this.player.getCurrentAnimation()!= 'idle'){
                    this.player.setCurrentAnimation('idle');
                    this.player.setState('moving', false);
                }
            }
            if(this.inputHandler.isPressed('shot')){
                //Spawn shots
                if(this.shotLefting > 0){
                    this.shotBreakTimer += dt;
                    if(this.shotBreakTimer >= this.shotBreakDuration) this.canShot = true;
                    else this.canShot = false;
                    if(this.canShot){
                        if(this.lastShotPosition == 'right') this.lastShotPosition = 'left';
                        else this.lastShotPosition = 'right';
                        this.bullets.push(new Bullet({
                            x: this.player.getBulletX(this.lastShotPosition),
                            y: this.player.getBulletY(),
                            force: this.player.getForce()
                        }));
                        this.shotBreakTimer = 0;
                        this.shotLefting--;
                    }
                }
            }else{
                this.shotBreakTimer = this.shotBreakDuration;
                if(this.shotLefting < this.maximumShotLefting){
                    if(this.shotLeftingRecoverTimer >= this.shotLeftingRecoverDuration){
                        this.shotLeftingRecoverTimer = 0;
                        this.shotLefting++;
                    }else{
                        this.shotLeftingRecoverTimer += dt;
                    }
                }
            }

            //Parallax loop
            this.parallaxLoopTimer += dt;
            this.parallaxPositionY = Funcionality.getParallaxPositionY(this.parallaxLoopTimer, this.parallaxLoopDuration, this.assets.images['space-bg']);
            if(this.parallaxLoopTimer >= this.parallaxLoopDuration){
                this.parallaxLoopTimer = 0;
                this.parallaxPositionY = 0;
            }

            //Spawn meteors
            for(var i = this.spawnMeteorsStartIndex; i < this.spawnMeteors.length; i++){
                if(this.timer >= this.spawnMeteors[i].whenTimer){
                    this.meteors.push(new Meteor({
                        assets: this.assets,
                        x: this.spawnMeteors[i].x,
                        y: this.spawnMeteors[i].y,
                        speed: this.spawnMeteors[i].speed
                    }));
                    this.spawnMeteorsStartIndex++;
                }
            }

            let calledMeteorUpdate = false;
            for(var i = this.meteorsStartIndex; i < this.meteors.length; i++){
                if(!calledMeteorUpdate){
                    if(this.meteors[i].isVisible() && this.meteors[i].getY() < 64){
                        calledMeteorUpdate = true;
                    }else{
                        this.meteorsStartIndex++;
                        if(this.meteors[i].getY() > 64 && this.meteors[i].isVisible()){
                            this.meteorsStillCanLeft--;
                            if(this.meteorsStillCanLeft == 0){
                                this.sceneState = 'gameover';
                                this.gameOverMessage = `You left ${this.meteorsMaxLeft} meteors`;
                                return;
                            }
                        }
                        continue;
                    }
                }

                this.meteors[i].update(dt);
            }

            let calledBulletUpdate = false;
            for(var i = this.bulletsStartIndex; i < this.bullets.length; i++){
                if(!calledBulletUpdate && this.bullets[i].getY() > -224){
                    if(this.bullets[i].isActive()){
                        calledBulletUpdate = true;
                    }else{
                        this.bulletsStartIndex++;
                        continue;
                    }
                }
                
                this.bullets[i].update(dt);
            }
            // console.log(this.meteorsStartIndex, this.bulletsStartIndex);

            this.player.update(dt);

            //Collision
            for(var i = this.meteorsStartIndex; i < this.meteors.length; i++){
                if(this.meteors[i].isActive()){
                    for(var j = this.bulletsStartIndex; j < this.bullets.length; j++){
                        if(this.bullets[j].isActive()){
                            if(Collision.verfifyCollosion(
                                this.meteors[i],
                                this.bullets[j]
                            )){
                                this.meteors[i].removeHealth(
                                    Math.abs(this.meteors[i].getDefense() - this.player.getForce())
                                );
                                this.bullets[j].setState('inactive');
                            }
                        }
                    }
                }

                if(this.meteors[i].isActive()){
                    if(Collision.verfifyCollosion(
                        this.meteors[i],
                        this.player
                    )){
                        this.meteors[i].setState('explosion');
                        this.player.removeHealth(
                            Math.abs(this.meteors[i].getForce() - this.player.getDefense())
                        )
                    }
                }
            }

            this.meteorGenerator.update(dt);
        }
    }

    draw(ctx){
        if(this.sceneState == 'intro'){
            CtxUtils.drawParallax(ctx, this.parallaxPositionX, this.parallaxPositionY, this.assets.images['space-bg']);

            CtxUtils.drawTextCenterScreen(
                ctx, 
                Funcionality.getRegressiveCounterText(this.regressiveCounter),
                {size: '20px'}
            );

            this.player.draw(ctx, this.camera);
        }

        else if(this.sceneState == 'play'){
            CtxUtils.drawParallax(ctx, this.parallaxPositionX, this.parallaxPositionY, this.assets.images['space-bg']);
            
            for(var i = this.bulletsStartIndex; i < this.bullets.length; i++){
                this.bullets[i].draw(ctx, this.camera);
            }

            this.player.draw(ctx, this.camera);

            for(var i = this.meteorsStartIndex; i < this.meteors.length; i++){
                this.meteors[i].draw(ctx, this.camera);
            }

            //HUD
            // CtxUtils.drawTextTopLeft(
            //     ctx, 
            //     `${this.shotLefting} shot left`,
            //     { 
            //         color: Funcionality.getColorBasedOnCritic(this.shotLefting / this.maximumShotLefting),
            //         offset: 10
            //     }
            // );
            CtxUtils.drawTextTopRight(
                ctx,
                Math.ceil(this.distance),
                {
                    offset: 10
                }
            );

            CtxUtils.drawTextTopRight(
                ctx,
                `${this.meteorsStillCanLeft}/${this.meteorsMaxLeft}`,
                {
                    offsetx: 10,
                    offsety: 20
                }
            );

            CtxUtils.drawTextTopLeft(
                ctx, 
                `${this.player.getHealthPercentage()} health left`,
                { 
                    color: Funcionality.getColorBasedOnCritic(this.player.getHealthPercentage(true)),
                    offset: 10
                }
            );

            CtxUtils.drawTextTopLeft(
                ctx, 
                `${this.shotLefting} / ${this.maximumShotLefting} shots left`,
                {
                    offsetx: 10,
                    offsety: 20
                }
            );
        }

        else if(this.sceneState == 'gameover'){
            CtxUtils.drawTextCenterScreenX(
                ctx,
                'Game Over',
                {
                    size: '20px',
                    y: 100
                }
            );

            CtxUtils.drawTextCenterScreenX(
                ctx,
                this.gameOverMessage,
                {
                    y: 150
                }
            );

            CtxUtils.drawTextCenterScreenX(
                ctx,
                `Distance: ${Math.ceil(this.distance) / 1000} light years`,
                {
                    size: '10px',
                    y: 170
                }
            );

            CtxUtils.drawTextCenterScreenX(
                ctx,
                `Press F5 to reload`,
                {
                    size: '9px',
                    y: 190
                }
            );
        }
    }
}