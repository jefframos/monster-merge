import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import config from '../../../config';
import TweenLite from 'gsap';

export default class PuzzleBackground extends PIXI.Container {
	constructor() {

		super();

        this.baseContainer = new PIXI.Container()
        this.addChild(this.baseContainer)

        this.baseTerrain = new PIXI.Sprite.fromFrame('base-terrain')
        this.baseTerrain.anchor.set(0.5,0)
        this.baseTerrain.scale.set(2)
        this.baseContainer.addChild(this.baseTerrain)


        this.leftDetail = new PIXI.Sprite.fromFrame('leftPatch')
        this.leftDetail.anchor.set(1,0)
        this.leftDetail.x = -150
        this.leftDetail.y = -185
        this.baseContainer.addChild(this.leftDetail)
        
        
        this.rightDetail = new PIXI.Sprite.fromFrame('rightPatch')
        this.rightDetail.x = 150
        this.rightDetail.y = -185
        this.baseContainer.addChild(this.rightDetail)
        
        this.leftPines = new PIXI.Sprite.fromFrame('pineSidePatch')
        this.leftPines.anchor.set(1,0)
        this.leftPines.x = -400
        this.leftPines.y = -350
        this.baseContainer.addChild(this.leftPines)


        this.rightPines = new PIXI.Sprite.fromFrame('pineSidePatch')
        this.rightPines.x = 400
        this.rightPines.y = -350
        this.baseContainer.addChild(this.rightPines)
    }

    resize(innerResolution, scale) {
		if (innerResolution && innerResolution.width && innerResolution.height) {

			this.innerResolution = innerResolution;
			
		}

	}

	update(delta) {
		
	}

}