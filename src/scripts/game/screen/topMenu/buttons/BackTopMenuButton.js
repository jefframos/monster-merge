import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../../config';
import TopMenuButton from './TopMenuButton';
export default class BackTopMenuButton extends TopMenuButton {
    constructor(size) {
        super(size);
        this.size = size;

        let spriteWidth = (this.buttonSprite.width / this.buttonSprite.scale.x);

        this.backIcon = new PIXI.Container();
        this.backLine1 = new PIXI.Sprite(PIXI.Texture.from('line.png'));
        this.backLine1.anchor.set(0.5);
        this.backLine1.tint = 0x87239D;
        this.backLine1.scale.set(spriteWidth / this.backLine1.width * 0.5)

        this.backLine2 = new PIXI.Sprite(PIXI.Texture.from('line.png'));
        this.backLine2.anchor.set(0, 0.5);
        this.backLine2.tint = 0xA128AC;
        this.backLine2.scale.set(spriteWidth / this.backLine2.width * 0.35, spriteWidth / this.backLine2.width* 0.5)
        this.backLine2.rotation = Math.PI / 4;
        this.backLine2.x = -this.backLine1.width / 2 //- 30;
        this.backLine2.y = -2 //-this.backLine1.height / 2;

        this.backLine3 = new PIXI.Sprite(PIXI.Texture.from('line.png'));
        this.backLine3.anchor.set(0, 0.5);
        this.backLine3.tint = 0xA128AC;
        this.backLine3.scale.set(spriteWidth / this.backLine3.width * 0.35, spriteWidth / this.backLine3.width* 0.5)
        this.backLine3.rotation = -Math.PI / 4;
        this.backLine3.x = -this.backLine1.width / 2 //- 30;
        this.backLine3.y = 2 // this.backLine1.height / 2;

        this.backIcon.addChild(this.backLine1);
        this.backIcon.addChild(this.backLine2);
        this.backIcon.addChild(this.backLine3);
        this.buttonSprite.addChild(this.backIcon)

    }
    active() {
        
    }
    deactive() {
        
    }
}