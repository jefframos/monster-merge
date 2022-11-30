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
    showAnimation(value){
        this.castleBackground.showAnimation(value)
    }
    getPiece(id){
        return this.castleBackground.getPiece(id)
    }
    updateMax(max, hide){
        this.castleBackground.updateMax(max, hide)
    }
    resize(resolution, innerResolution){
        if (!resolution || !resolution.width || !resolution.height || !innerResolution) {
            return;
        }
    }
}