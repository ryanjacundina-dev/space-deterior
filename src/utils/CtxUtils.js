import { Colors } from "../resources/Colors.js";

export class CtxUtils {
    static drawTextCenterScreen(ctx, text, config = {}){
        ctx.fillStyle = config.color || 'white';
        ctx.font = `${config.size || '10px'} ${config.font || 'monospace'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            text, 
            ctx.canvas.width / 2, 
            ctx.canvas.height / 2
        );
    }

    static drawTextCenterScreenX(ctx, text, config = {}){
        ctx.fillStyle = config.color || 'white';
        ctx.font = `${config.size || '10px'} ${config.font || 'monospace'}`;
        ctx.textAlign = 'center';
        ctx.fillText(
            text, 
            ctx.canvas.width / 2, 
            config.y || 0
        );
    }

    static drawTextCenterScreenY(ctx, text, config = {}){
        ctx.fillStyle = config.color || 'white';
        ctx.font = `${config.size || '10px'} ${config.font || 'monospace'}`;
        ctx.textBaseline = 'middle';
        ctx.fillText(
            text, 
            config.x || 0, 
            ctx.canvas.height / 2
        );
    }

    static drawTextTopLeft(ctx, text, config = {}){
        ctx.fillStyle = config.color || 'white';
        ctx.font = `${config.size || '10px'} ${config.font || 'monospace'}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(
            text, 
            config.offset || config.offsetx || 0, 
            config.offset || config.offsety || 0
        );
    }

    static drawTextTopRight(ctx, text, config = {}){
        ctx.fillStyle = config.color || 'white';
        ctx.font = `${config.size || '10px'} ${config.font || 'monospace'}`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(
            text, 
            ctx.canvas.width - config.offset || ctx.canvas.width - config.offsetx || 0, 
            config.offset || config.offsety || 0
        );
    }

    static drawFadeIn(ctx, timer, duration){
        const alpha = timer / duration > 0 ? timer / duration : 0;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    static drawParallax(ctx, posX, posY, img){
        // posX = Math.floor(posX);
        // posY = Math.floor(posY);

        ctx.drawImage(
            img,
            posX, posY
        );
        ctx.drawImage(
            img,
            posX, posY - img.height
        );
    }
}