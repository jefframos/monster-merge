import * as PIXI from 'pixi.js';
import PuzzleBackgroundBase from '../PuzzleBackgroundBase';

export default class PuzzleHumanBackground extends PuzzleBackgroundBase {
	constructor() {

		super();
		this.baseContainer = new PIXI.Container()
		this.addChild(this.baseContainer)
		this.baseTerrain = new PIXI.Sprite.fromFrame('base-terrain')
		this.baseTerrain.anchor.set(0.5, 0)
		this.baseTerrain.scale.set(1)
		this.baseTerrain.tint = 0x888888
		this.baseContainer.addChild(this.baseTerrain)
	}
	build() {
	}
	resize(innerResolution, scale) {
		if (innerResolution && innerResolution.width && innerResolution.height) {

			this.innerResolution = innerResolution;

			if (window.isPortrait) {
				
			} else {

			}

		}

	}


}