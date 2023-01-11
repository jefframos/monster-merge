export default class InteractiveBackgrounds extends PIXI.Container {
    constructor() {
        super();
        this.build();
        this.skyColor = this.castleBackground.skyColor
    }
    build() {

    }


    update(delta) {
        if (this.puzzleBackground) {

            this.puzzleBackground.update(delta)
        }
        if (this.castleBackground) {

            this.castleBackground.update(delta)
        }
    }
    showAnimation(value) {
        return this.castleBackground.showAnimation(value)
    }
    showAll() {
        this.castleBackground.showAll()
    }
    getPiece(id) {
        return this.castleBackground.getPiece(id)
    }
    updateMax(max, hide, system) {
        this.castleBackground.updateMax(max, hide, system)
    }
    resize(resolution, innerResolution) {
        if (!resolution || !resolution.width || !resolution.height || !innerResolution) {
            return;
        }
    }
}