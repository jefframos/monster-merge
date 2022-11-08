import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../../config';
import TopMenuButton from './TopMenuButton';
export default class SoundTopMenuButton extends TopMenuButton {
    constructor(size) {
        super(size);
        this.size = size;
        let spriteWidth = (this.buttonSprite.width / this.buttonSprite.scale.x);
        this.backIcon = new PIXI.Container();
        this.backLine1 = new PIXI.Sprite(PIXI.Texture.from('line.png'));
        this.linesScale = {
            x: spriteWidth / this.backLine1.width * 0.5,
            y: spriteWidth / this.backLine1.width * 0.5
        }
        this.backLine1.anchor.set(0.5);
        this.backLine1.tint = 0xA128AC;
        this.backLine1.rotation = Math.PI / 2;
        this.backLine1.scale.set(this.linesScale.x)

        this.backIcon = new PIXI.Container();
        this.backLine2 = new PIXI.Sprite(PIXI.Texture.from('line.png'));
        this.backLine2.anchor.set(0.5);
        this.backLine2.tint = 0x87239D;
        this.backLine2.rotation = Math.PI / 2;
        this.backLine2.x = this.size * 0.75
        this.backLine2.scale.set(this.linesScale.x * 0.75, this.linesScale.y)

        this.backIcon = new PIXI.Container();
        this.backLine3 = new PIXI.Sprite(PIXI.Texture.from('line.png'));
        this.backLine3.anchor.set(0.5);
        this.backLine3.tint = 0x87239D;
        // this.backLine3.tint = 0x382360 ;
        this.backLine3.rotation = Math.PI / 2;
        this.backLine3.x = -this.size * 0.75
        this.backLine3.scale.set(this.linesScale.x * 0.75, this.linesScale.y)

        this.backIcon.addChild(this.backLine1);
        this.backIcon.addChild(this.backLine2);
        this.backIcon.addChild(this.backLine3);
        this.buttonSprite.addChild(this.backIcon)

        this.isActive = true;
    }
    show() {
        if (this.isActive) {
            this.backLine1.scale.x = 0.5;
            this.backLine2.scale.x = 0.5;
            this.backLine3.scale.x = 0.5;

            this.active();
        } else {

            this.backLine1.scale.x = this.linesScale.x;
            this.backLine2.scale.x = this.linesScale.x * 0.75;
            this.backLine3.scale.x = this.linesScale.x * 0.75;

            this.deactive();
        }
    }
    active() {
        this.isActive = true;
        TweenLite.to(this.backLine1.scale, 0.75, {
            x: this.linesScale.x,
            y: this.linesScale.y,
            ease: Back.easeOut
        })
        TweenLite.to(this.backLine2.scale, 0.75, {
            x: this.linesScale.x * 0.75,
            y: this.linesScale.y,
            ease: Back.easeOut
        })
        TweenLite.to(this.backLine3.scale, 0.75, {
            x: this.linesScale.x * 0.75,
            y: this.linesScale.y,
            ease: Back.easeOut
        })

    }
    deactive() {
        this.isActive = false;
        TweenLite.to(this.backLine1.scale, 0.5, {
            x: this.linesScale.x * 0.3,
            y: this.linesScale.y
        })
        TweenLite.to(this.backLine2.scale, 0.5, {
            x: this.linesScale.x * 0.3,
            y: this.linesScale.y
        })
        TweenLite.to(this.backLine3.scale, 0.5, {
            x: this.linesScale.x * 0.3,
            y: this.linesScale.y
        })
    }
}