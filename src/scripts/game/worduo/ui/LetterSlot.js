import * as PIXI from 'pixi.js';
import * as signals from 'signals';

export default class LetterSlot extends PIXI.Container {
	constructor(width = 50, height = 50, color = 0xaaaaaa) {
		super();

		this.color = color
		this.backShape = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('button-1'), 15, 15, 15, 15)
		this.backShape.width = width
		this.backShape.height = height
		//this.backShape.pivot.set((width) / 2, (height) / 2)
		this.backShape.tint = this.color;
		this.addChild(this.backShape)

		this.letter = new PIXI.Sprite();
		this.letter.anchor.set(0.5);
		this.addChild(this.letter)

		this.letter.x = width / 2
		this.letter.y = height / 2 - 2
	}
	highlight(){
		this.backShape.tint = 0x22aa99;
	}
	normalState(){
		this.backShape.tint = this.color;
	}
	addCheck(){
		this.letter.texture = PIXI.Texture.fromFrame('icon_confirm');
		this.updateletterScale();
	}
	addX(){
		this.letter.texture = PIXI.Texture.fromFrame('icon_close');
		this.updateletterScale();
	}
	addLetter(letter, texture) {
		this.currentLetter = letter
		this.letter.texture = texture;
		this.updateletterScale();
	}
	removeLetter() {
		this.currentLetter = ''
		this.letter.texture = PIXI.Texture.EMPTY;
	}
	updateletterScale(scale = 0.7) {

		utils.resizeToFitAR({
			width: this.backShape.width * scale,
			height: this.backShape.height * scale
		}, this.letter)

	}
}