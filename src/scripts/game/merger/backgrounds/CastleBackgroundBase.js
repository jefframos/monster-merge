import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import config from '../../../config';
import TweenLite from 'gsap';

export default class CastleBackgroundBase extends PIXI.Container {
    constructor() {

        super();
        this.baseContainer = new PIXI.Container()
        this.addChild(this.baseContainer)
        this.castleContainer = new PIXI.Container();
        this.build();
        this.initCastle();
        this.usableArea = new PIXI.Graphics().beginFill(0x00FF00).drawRect(0, 0, 530, 500)
        //this.addChild(this.usableArea)
        this.usableArea.alpha = 0.15
        this.usableArea.x = - this.usableArea.width / 2
        this.usableArea.y = - 450
    }
    initCastle() {
        

        this.castleSet.forEach(element => {
            let img = new PIXI.Sprite.fromFrame(element.src)
            element.sprite = img;
            img.x = element.pos.x
            img.y = element.pos.y
            this.castleContainer.addChild(img)

        });

        this.castleSet.forEach(element => {
            this.castleContainer.addChildAt(element.sprite, this.castleSet.lenght - element.order)
            element.sprite.visible = false
        });

    }

    updateMax(value) {
        value = Math.min(value, this.castleSet.length - 1)
        for (let index = 0; index < this.castleSet.length; index++) {
            const element = this.castleSet[index];
            element.sprite.visible = false
        }
        for (let index = 0; index <= value; index++) {
            const element = this.castleSet[index];
            element.sprite.visible = true
        }
    }
    build() {

    }
    update(delta){

    }
}