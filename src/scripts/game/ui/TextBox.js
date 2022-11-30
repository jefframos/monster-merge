import * as PIXI from 'pixi.js';
// import * as FILTERS from 'pixi-filters';
export default class TextBox extends PIXI.Container {
    constructor(padding = 10, tex = 'Progress02') {
        super();
        this.padding = padding
        this.background = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(tex), 35/2, 35/2, 35/2, 35/2)
        this.addChild(this.background)
        this.label = new PIXI.Text('Thanks for helping us\nChoose your prize', LABELS.LABEL1);
        this.label.style.fontSize = 18
        // this.label.x = this.padding
        // this.label.y = this.padding
        this.label.anchor.set(0.5)
        this.addChild(this.label)
    }

    updateText(text) {
        this.label.text = text
        this.background.width = this.label.width + this.padding * 2
        this.background.height = this.label.height + this.padding * 2
        this.background.pivot.set(this.background.width / 2, this.background.height / 2)

    }
}