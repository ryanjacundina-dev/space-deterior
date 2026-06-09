import { AssetLoader } from '/src/utils/AssetLoader.js';
import { CtxUtils } from '/src/utils/CtxUtils.js';
import { MenuScene } from '/src/scenes/MenuScene.js';
import { GamePlayScene } from '/src/scenes/GamePlayScene.js';
import { InputHandler } from '/src/components/InputHandler.js';

const canvas = document.querySelector('#game-screen');
canvas.width = 64 * 3;
canvas.height = 64 * 4;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const assets = new AssetLoader();
const input = new InputHandler();

assets.loadImage('meteor', 'meteor.png');
assets.loadImage('spaceship', 'spaceship.png');
assets.loadImage('home-screen', 'home-screen.png');
assets.loadImage('space-bg', 'space-bg.png');

class SceneManager {
    constructor(){
        this.scenes = {
            menu: new MenuScene(this, input, assets),
            gamePlay: new GamePlayScene(this, input, assets, canvas)
        }
        this.currentScene = this.scenes.menu;
    }

    changeScene(sceneName){
        this.currentScene = this.scenes[sceneName];
    }

    update(dt){
        this.currentScene.update(dt);
    }

    draw(ctx){
        this.currentScene.draw(ctx);
    }
}

const sceneManager = new SceneManager();

let lastTime = 0;

function gameLoop(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if(!assets.isReady()){
        CtxUtils.drawTextCenterScreen(ctx, `Loading ${assets.getProgress()}%`);
    }else{
        sceneManager.update(dt);
        sceneManager.draw(ctx);
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    gameLoop(timestamp);
})