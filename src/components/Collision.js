export class Collision {
    static verfifyCollosion(obj1, obj2){
        for(let i = 0; i < obj1.getHitboxesLength(); i++){
            for(let j = 0; j < obj2.getHitboxesLength(); j++){
                let box1 = obj1.getRealHitbox(i);
                let box2 = obj2.getRealHitbox(j);
                if(
                    box1.x < box2.x + box2.width &&
                    box1.x + box1.width > box2.x &&
                    box1.y < box2.y + box2.height &&
                    box1.y + box1.height > box2.y
                ) return true;
            }
        }
        return false;
    }
}