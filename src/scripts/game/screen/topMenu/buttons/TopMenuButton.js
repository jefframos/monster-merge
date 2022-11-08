import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../../config';
export default class TopMenuButton extends PIXI.Container {
    constructor(size) {
        super();
        this.size = size;

        this.buttonSprite = new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.buttonSprite.anchor.set(0.5);
        this.buttonSprite.scale.set((this.size / this.buttonSprite.width));
        this.buttonSprite.alpha = 1;
        this.buttonSprite.tint = 0xFFFFFF;
        this.buttonSprite.blendMode = PIXI.BLEND_MODES.ADD;

        this.addChild(this.buttonSprite)
        this.isActive = true;
    }
    hide(){

    }
    show(){

    }
    active(){

    }
    deactive(){

    }
    toggle(){
    	if(this.isActive){
    		this.deactive();
    	}else{
    		this.active();
    	}
    }
}