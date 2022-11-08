import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../../config';
import TopMenuButton from './TopMenuButton';
export default class MainTopMenuButton extends TopMenuButton {
    constructor(size) {
        super(size);

        let spriteWidth = (this.buttonSprite.width / this.buttonSprite.scale.x);
        this.plusIcon = new PIXI.Container();
        this.plusLine1 = new PIXI.Sprite(PIXI.Texture.from('line.png'));
        this.plusLine1.anchor.set(0.5);
        this.plusLine1.tint = 0xA128AC;
        this.plusLine1.scale.set(spriteWidth / this.plusLine1.width* 0.5)

        this.plusLine2 = new PIXI.Sprite(PIXI.Texture.from('line.png'));
        this.plusLine2.anchor.set(0.5);
        this.plusLine2.tint = 0x87239D;
        console.log(this.size / this.plusLine2.width);
        this.plusLine2.scale.set(spriteWidth / this.plusLine2.width * 0.5)
        this.plusLine2.rotation = Math.PI / 2;

        this.plusIcon.addChild(this.plusLine1);
        this.plusIcon.addChild(this.plusLine2);
        console.log(this);
        this.buttonSprite.addChild(this.plusIcon)

    }
    active() {
        TweenLite.to(this.plusLine2, 0.25, {
            rotation: 0
        });
    }
    deactive() {
        TweenLite.to(this.plusLine2, 0.25, {
            rotation: Math.PI / 2
        });

    }
}