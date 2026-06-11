export class AssetLoader{
    constructor(){
        this.images = {};
        this.sounds = {};
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }
    
    loadImage(key, src){
        this.totalAssets++;
        const img = new Image();
        img.src = './assets/images/' + src;
        img.onload = ()=>{
            this.loadedAssets++;
        };
        this.images[key] = img;
    }

    isReady(){
        return this.loadedAssets == this.totalAssets && this.totalAssets > 0;
    }

    getProgress(){
        return Math.floor((this.loadedAssets / this.totalAssets) * 100);
    }
}
