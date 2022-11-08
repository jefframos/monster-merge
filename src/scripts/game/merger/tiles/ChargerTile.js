import * as PIXI from 'pixi.js';

import CircleCounter from '../../ui/hudElements/CircleCounter';
import MergeTile from './MergeTile';
import ProgressBar from '../ProgressBar';
import Signals from 'signals';
import UIBar from '../../ui/uiElements/UIBar';

export default class ChargerTile extends MergeTile {
    constructor(i, j, size, lockIcon, standardChargeTime = 2) {
        super(i, j, size, lockIcon);
        this.backShape.texture = PIXI.Texture.fromFrame('backTilesSquare')

        this.defaultChargeTime = standardChargeTime;
        this.currentChargeTime = this.defaultChargeTime * Math.random();

        this.onCompleteCharge = new Signals();



        this.levelBar = new ProgressBar({ width: size/2, height: 10 }, 3, 3)
        this.levelBar.updateBackgroundColor(0x20516c)
        this.levelBar.updateBackgroundFront(0x00ffff)
        this.levelBar.x = size/4
        this.levelBar.y = size - 10
        this.container.addChild(this.levelBar)
        
        //this.levelBar.rotation = Math.PI * 0.5


        this.container.removeChild(this.damageTimerView)

        this.isCharged = false;

        this.outState()

    }
    onMouseDown(e) {
        super.onMouseDown(e);
        this.currentChargeTime -= 0.2
        if(this.currentChargeTime <= 0){
            this.completeCharge();
        }else{
            
            this.onShowParticles.dispatch()
        }
    }
    update(delta, timeStamp){
        // if(COOKIE_MANAGER.getStats().tutorialStep <= 0){
        //     this.currentChargeTime = delta
        // }
        //console.log(this.currentChargeTime)
        super.update(delta, timeStamp);
        if(this.currentChargeTime > 0){
            this.currentChargeTime  -= delta;
            if(this.currentChargeTime <= 0){
                this.completeCharge();
            }else{
                this.tileSprite.visible = false;
            }
            this.levelBar.setProgressBar(1-(this.currentChargeTime / this.defaultChargeTime))
            this.levelBar.visible = true;

            //this.circleCounter.update(1-(this.currentChargeTime / this.defaultChargeTime))

            
            this.backSlot.tint = 0x999999
            this.backShape.tint = 0x999999
        }else{
            this.backSlot.tint = 0x00FFFF
            this.backShape.tint = 0x00FFFF
        }
        //this.levelBar.visible = false;

        this.label.visible = this.tileSprite.visible;
    }
    startCharging(){
        this.isCharged = false;
        this.tileData = null;
        this.currentChargeTime = this.defaultChargeTime;
        this.levelBar.visible = false;
        this.levelBar.setProgressBar(0, 0,true);
    }
    completeCharge(){

        console.log(this.currentChargeTime)

        
        this.isCharged = true;
        this.levelBar.visible = false;
        this.tileSprite.visible = true;
        this.currentChargeTime = this.defaultChargeTime;
        this.onCompleteCharge.dispatch();
    }
    lookAt(target) {
       
    }
    overState() {
        // this.backSlot.tint = 0x00FFFF
        // this.backShape.tint = 0x00FFFF

    }
    outState() {
        // this.backSlot.tint = 0x00FFFF
        // this.backShape.tint = 0x00FFFF

    }
}