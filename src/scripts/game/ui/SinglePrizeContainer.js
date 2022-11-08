import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class SinglePrizeContainer extends PIXI.Container {
    constructor(size = 40) {
        super();
        this.size = size;
        this.iconContainer = new PIXI.Sprite.fromFrame('coin');
        this.addChild(this.iconContainer)
        this.iconContainer.anchor.set(0.5)
        this.iconContainer.scale.set(size / this.iconContainer.height)

        this.label = new PIXI.Text('Open', LABELS.LABEL_CHEST);
        this.addChild(this.label)
        this.label.style.fontSize = 24

    }
    updateIcon(texture) {

        this.iconContainer.texture = PIXI.Texture.fromFrame(texture);

        this.iconContainer.scale.set(this.size / this.iconContainer.height * 2)

    }
    updateLabel2(label) {
        this.label.text = label;
        this.label.style.stroke = 0
        this.label.pivot.x = this.label.width / 2
        this.label.pivot.y = this.label.height / 2
        this.label.y = this.size
    }
    updateLabel(label, border = 0x00ffff) {
        this.label.text = label;
        this.label.style.stroke = 0
        this.label.style.fill = border
        this.label.pivot.x = this.label.width / 2
        this.label.pivot.y = this.label.height / 2
        this.label.y = this.size
    }
    
}