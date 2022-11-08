import * as PIXI from 'pixi.js';
// import * as FILTERS from 'pixi-filters';
export default class TextBox extends PIXI.Container {
    constructor(padding = 10, tex = 'small-no-pattern') {
        super();
        this.padding = padding
        this.background = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(tex), 10, 10, 10, 10)
        this.addChild(this.background)

        this.label = new PIXI.Text('Thanks for helping us\nChoose your prize', LABELS.LABEL1);
        this.label.style.fontSize = 18
        this.label.x = this.padding
        this.label.y = this.padding
        this.addChild(this.label)
    }

    updateText(text) {
        this.label.text = text
        this.background.width = this.label.width + this.padding * 2
        this.background.height = this.label.height + this.padding * 2

    }
}