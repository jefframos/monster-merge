import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../../../config';

export default class LevelMeter extends PIXI.Container {
	constructor() {

		super();

        this.baseContainer = new PIXI.Container()
        this.addChild(this.baseContainer)


        this.baseBar = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(config.assets.bars.background), 10, 10, 10, 10)

        this.baseContainer.addChild(this.baseBar)
        this.baseBar.width = 400
        this.baseBar.height = 35

        config.addPaddingBackBar(this.baseBar)
        //this.baseBar.anchor.set(0, 0.5)
        //this.baseBar.scale.set(280 / this.baseBar.width)
        this.baseBar.x = 195
        this.baseBar.y = 0

        this.fillBar = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(config.assets.bars.extra), 15, 0, 15, 0)
        this.fillBar.width = 250 //468
        this.fillBar.height = 26
        this.fillBar.x = 4
        this.fillBar.y = 4
        config.addPaddingBar(this.fillBar)

        this.baseBar.addChild(this.fillBar)
        
        this.baseLevelLabel = new PIXI.Sprite.fromFrame(config.assets.box.squareExtra)
        this.baseContainer.addChild(this.baseLevelLabel)
        this.baseLevelLabel.anchor.set(0, 0.5)

        this.baseLevelLabel.x = -5


        this.levelLabel = new PIXI.Text('2', LABELS.LABEL1);
        this.levelLabel.style.stroke = 0
        this.levelLabel.style.strokeThickness = 4
        this.levelLabel.style.fontSize = 42
        this.levelLabel.anchor.set(0.5)
        this.levelLabel.x = this.baseLevelLabel.width / 2
        this.levelLabel.y = 0
        this.baseLevelLabel.addChild(this.levelLabel)


        this.progressLabel = new PIXI.Text('2', LABELS.LABEL2);
        this.progressLabel.style.stroke = 0
        this.progressLabel.style.strokeThickness = 4
        this.progressLabel.style.fontSize = 24
        this.progressLabel.anchor.set(0.5)
        this.progressLabel.x = this.baseContainer.width / 2 + this.fillBar.x - 20
        this.progressLabel.y = 40
        this.baseContainer.addChild(this.progressLabel)


        this.usableArea = new PIXI.Graphics().beginFill(0x00FF00).drawRect(0,0,480,80)
        //this.addChild(this.usableArea)
        this.usableArea.alpha = 0.15

        this.baseLevelLabel.scale.set(this.usableArea.height / this.baseLevelLabel.height)
        this.baseLevelLabel.y = this.baseLevelLabel.height / 2-5

        this.baseBar.x = this.baseLevelLabel.width
        this.baseBar.y = this.usableArea.height / 2 - this.baseBar.height / 2

    }

    updateData(data){

        this.levelLabel.text = data.currentLevel
        this.progressLabel.text = data.progress+'/'+getLevels(data.currentLevel)
        let targetBar = Math.max((this.baseBar.width-8) * data.percent, 30);

        console.log(data)
        if(targetBar < this.fillBar.width){

            this.fillBar.width = targetBar
        }else{
            TweenMax.to(this.fillBar, 0.5, {width:targetBar})
        }
    }
}