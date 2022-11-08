import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
export default class GradientElement extends PIXI.Container{
	constructor(backSrc, frontSrc){
		super();

		this.backGradient  = new PIXI.Sprite(PIXI.Texture.from(backSrc));
		
		this.addChild(this.backGradient);

		this.frontGradient  = new PIXI.Sprite(PIXI.Texture.from(frontSrc));
		
		this.addChild(this.frontGradient);

		this.backGradient.anchor.set(0.5);
		this.frontGradient.anchor.set(0.5);
	}
	setColors(colorBack = 0xFFFFFF, colorFront = 0xFFFFFF){
		this.colorBack = colorBack;
		this.colorFront = colorFront;
		this.backGradient.tint = colorBack;
		this.frontGradient.tint = colorFront;
	}
}