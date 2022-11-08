import * as PIXI from 'pixi.js';
import * as signals from 'signals';

import TweenLite from 'gsap';
import utils from '../../utils';
import UIButton2 from './UIButton2';
import ProgressBar from '../merger/ProgressBar';

export default class TimeBonusButton extends PIXI.Container {
    constructor(texture = 'spiky-field', width = 70, height = 50,  mainTexture = 'large-square-pattern-cyan') {
        super();
        this.mainTexture = mainTexture;
        this.buttonWidth = width;
        this.buttonHeight = height;
        this.mainButton = new UIButton2(0x002299, texture, 0xFFFFFF, width, height, this.mainTexture)
        this.mainButton.updateIconScale(0.7)
        this.mainButton.icon.x = -20
        this.onClickBuff = new signals.Signal();
        this.onCompleteBuff = new signals.Signal();

        this.shine = new PIXI.Sprite.fromFrame('shine')
        this.shine.anchor.set(0.5)
        this.addChild(this.shine);
        this.shine.scale.set(1.3)
        this.shine.tint = 0xffff00

        this.addChild(this.mainButton)

        this.videoSprite = new PIXI.Sprite.fromFrame('video-trim')
        this.videoSprite.anchor.set(0.5)
        this.videoSprite.scale.set(0.65)
        this.videoSprite.x = 25
        this.videoSprite.y = 0
        this.addChild(this.videoSprite)
        //this.shopButtonsList.addElement(this.mainButton)
        this.mainButton.onClick.add(() => {
            if (this.activeTimer > 0) return;
            // this.activeTimer = this.bonusTime
            this.onClickBuff.dispatch(this);

            //console.log(this.targetObject)
        })

        this.mainButton.x = 0
        this.mainButton.y = 0
        this.bonusTimer = new ProgressBar({ width: width - 3, height: 10 }, 3, 3)
        this.bonusTimer.updateBackgroundFront(0x4e2300)
        this.bonusTimer.updateBackgroundColor(0xdd8009)
        this.bonusTimer.x = width*0.5 +1//-width*0.5 + 50
        this.bonusTimer.y = height * 0.5 + 5 + 10
        //this.bonusTimer = new CircleCounter(10,10)
        this.addChild(this.bonusTimer)
        this.bonusTimer.rotation = Math.PI
        this.bonusTimer.visible = false;
        this.activeTimer = 0;
        this.bonusTime = 120;

        this.bonusLabel = new PIXI.Text('', LABELS.LABEL1);
        this.bonusLabel.style.fill = 0xffffff
        this.bonusLabel.style.aligh = 'right'
        this.bonusLabel.style.fontSize = 17
        this.bonusLabel.x = this.buttonWidth / 2 - this.bonusLabel.width
        this.bonusLabel.y = -this.buttonHeight / 2 - this.bonusLabel.height - 2
        this.addChild(this.bonusLabel);

        this.seconds = new PIXI.Text('30s', LABELS.LABEL1);
        this.seconds.style.fill = 0xffffff
        this.seconds.style.stroke = 0
        this.seconds.style.strokeThickness = 4
        this.seconds.style.aligh = 'right'
        this.seconds.style.fontSize = 14
        this.addChild(this.seconds);

        this.sin = 0;
    }
    confirmBonus(){
        window.DO_REWARD(() => {
            this.confirmConfirm()
           
        })

    }
    confirmConfirm(){
        this.activeTimer = this.bonusTime
        setTimeout(() => {
            window.gameModifyers.updateModifyer(this.param)                
        }, 10);
    }
    addCallback(callback) {
        this.callback = callback
    }
    updateIconScale(scale) {
        this.mainButton.updateIconScale(scale)
        this.mainButton.icon.x = 0
        this.mainButton.icon.y = 0
    }
    stop() {
        this.activeTimer = 0;
        this.targetObject[this.param] = this.defaultValue;
    }
    update(delta) {
        if (this.activeTimer > 0) {
            this.bonusTimer.visible = true;
            this.shine.visible = true;
            this.shine.rotation += delta * 50
            this.shine.rotation %= Math.PI * 2
            this.activeTimer -= delta;
            this.bonusTimer.setProgressBar(this.activeTimer / this.bonusTime);
            if (this.activeTimer <= 0) {
                this.targetObject[this.param] = this.defaultValue;
                this.onCompleteBuff.dispatch(this);
            } else {
                this.targetObject[this.param] = this.targetValue;
            }
            this.mainButton.backShape.texture = PIXI.Texture.fromFrame('large-square-pattern-orange')
            this.sin += delta * 5;
            this.mainButton.y = Math.sin(this.sin) * 2


            this.bonusLabel.y = -this.buttonHeight / 2 - this.bonusLabel.height - 2 + Math.sin(this.sin) * 2

            this.bonusTimer.y = this.buttonHeight * 0.5 + 9 + Math.sin(this.sin) * 2
            this.videoSprite.visible = false;
            this.seconds.visible = false;

            this.mainButton.icon.x = 0
        } else {
            this.mainButton.backShape.texture = PIXI.Texture.fromFrame(this.mainTexture)
            this.bonusTimer.visible = false;
            this.videoSprite.visible = true;
            this.seconds.visible = true;
            
            this.shine.visible = false;
            this.mainButton.y = 0
            this.sin = 0;

            this.bonusLabel.y = -this.buttonHeight / 2 - this.bonusLabel.height - 2

            this.mainButton.icon.x = -20

            this.visible = false;
        }
    }
    setDescription(text,detail, addTime = false) {
        this.shortDescription = text;
        let extra = addTime? '\n'+window.localizationManager.getLabel('for')+' '+this.bonusTime+' '+window.localizationManager.getLabel('seconds'):'';
        this.fullDescription = detail + extra
        this.bonusLabel.text = text;
        this.bonusLabel.x = this.buttonWidth / 2 - this.bonusLabel.width
        this.bonusLabel.y = -this.buttonHeight / 2 - this.bonusLabel.height - 2
    }
    setParams(object, param, defaultValue, targetValue, bonusTime = 120) {
        this.seconds.text = bonusTime + 's';
        this.seconds.x = -this.seconds.width*0.5-10
        this.bonusTime = bonusTime;
        this.targetObject = object;
        this.param = param;
        this.defaultValue = defaultValue;
        this.targetValue = targetValue;
    }
}
