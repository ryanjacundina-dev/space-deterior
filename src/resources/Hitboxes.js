export class Hitboxes {
    static getPlayerHitBoxes(){
        return [
            {
                "offsetX": 3,
                "offsetY": 35,
                "width": 58,
                "height": 19
            },
            {
                "offsetX": 10,
                "offsetY": 31,
                "width": 44,
                "height": 9
            },
            {
                "offsetX": 18,
                "offsetY": 27,
                "width": 29,
                "height": 15
            }
        ];
    }

    static getMeteorHitBoxes(){
        return [
            {
                "offsetX": 8,
                "offsetY": 5,
                "width": 18,
                "height": 22
            }
        ];
    }
}