import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';

export default class LevelMeter extends PIXI.Container {
	constructor() {

		super();

        this.baseContainer = new PIXI.Container()
        this.addChild(this.baseContainer)


        this.baseBar = new PIXI.Sprite.fromFrame('backBar2')
        this.baseContainer.addChild(this.baseBar)
        this.baseBar.anchor.set(0, 0.5)
        this.baseBar.scale.set(280 / this.baseBar.width)
        this.baseBar.x = 195
        this.baseBar.y = 50

        this.fillBar = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('fullBar'), 10, 10, 10, 10)
        this.fillBar.width = 250 //468
        this.fillBar.height = 26
        this.fillBar.x = 12
        this.fillBar.y = -17

        this.baseBar.addChild(this.fillBar)
        
        this.baseLevelLabel = new PIXI.Sprite.fromFrame('backLevel')
        this.baseContainer.addChild(this.baseLevelLabel)
        this.baseLevelLabel.anchor.set(0, 0.5)

        this.baseLevelLabel.x = 120

        this.baseLevelLabel.y = 50

        this.levelLabel = new PIXI.Text('2', LABELS.LABEL1);
        this.levelLabel.style.stroke = 0
        this.levelLabel.style.strokeThickness = 4
        this.levelLabel.style.fontSize = 32
        this.levelLabel.anchor.set(0.5)
        this.levelLabel.x = this.baseLevelLabel.width / 2
        this.levelLabel.y = -3
        this.baseLevelLabel.addChild(this.levelLabel)
    }
}