export default class InteractiveBackgrounds extends PIXI.Container {
    constructor() {
        super();        
        this.build();
    }
    build(){
        
    }
  

    update(delta) {
        if (this.puzzleBackground) {

            this.puzzleBackground.update(delta)
        }
        if (this.castleBackground) {

            this.castleBackground.update(delta)
        }
    }
    updateMax(max){
        this.castleBackground.updateMax(max)
    }
    resize(resolution, innerResolution){
        if (!resolution || !resolution.width || !resolution.height || !innerResolution) {
            return;
        }
    }
}