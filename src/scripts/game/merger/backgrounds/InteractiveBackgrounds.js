export default class InteractiveBackgrounds extends PIXI.Container {
    constructor() {
        super();        
    }
    updateMax(max){

    }
    update(delta){

    }
    resize(resolution, innerResolution){
        if (!resolution || !resolution.width || !resolution.height || !innerResolution) {
            return;
        }
    }
}