import * as PIXI from 'pixi.js';

import TweenLite from 'gsap';
import config from '../../../config';
import utils from '../../../utils';

export default class CastleBackgroundBase extends PIXI.Container {
    constructor() {

        super();
        this.baseContainer = new PIXI.Container()
        this.addChild(this.baseContainer)
        this.castleContainer = new PIXI.Container();
        this.build();
        this.initCastle();
        this.usableArea = new PIXI.Graphics().beginFill(0x00FF00).drawRect(0, 0, 550, 550)
        //this.addChild(this.usableArea)
        this.usableArea.alpha = 0.15
        this.usableArea.x = - this.usableArea.width / 2
        this.usableArea.y = - 450


        this.roundContainer = new PIXI.Container();

        this.backSprite = new PIXI.Sprite.from('round1')
        this.nextIcon = new PIXI.Sprite.from('round1')
        this.nextIcon.anchor.set(0.5)

        this.questionMark = new PIXI.Text('?', LABELS.LABEL1);
        this.questionMark.style.fontSize = 48
        this.questionMark.anchor.set(0.5)
        this.questionMark.sin = 0;

        this.questionMark.x = 40
        this.questionMark.y = 40

        this.backSprite.anchor.set(0.5)
        this.backSprite.addChild(this.nextIcon)
        this.roundContainer.addChild(this.backSprite)
        this.roundContainer.addChild(this.questionMark)
    }
    initCastle() {

        let copy = []
        this.castleSet.forEach(element => {
            copy.push(element)
        });

        copy.sort(function(a, b){return b.order-a.order});

        copy.forEach(element => {
            let img = new PIXI.Sprite.fromFrame(element.src)
            img.x = element.pos.x
            img.y = element.pos.y
            this.castleContainer.addChild(img)

            this.castleSet.forEach(element2 => {
                if(element2.src == element.src){
                    element2.sprite = img;
                }
            });
        })
    }
    showAll(){
        for (let index = 0; index < this.castleSet.length; index++) {
            const element = this.castleSet[index];
            element.sprite.visible = true
        }

        setTimeout(() => {
            for (let index = 0; index < this.castleSet.length; index++) {
                const element = this.castleSet[index];
                element.sprite.visible = true
            }
        }, 50);
    }
    getPiece(id) {
        return this.castleSet[id];
    }
    updateMax(value, hide = false, system = null) {
        value = Math.min(value, this.castleSet.length - 1)
        for (let index = 0; index < this.castleSet.length; index++) {
            const element = this.castleSet[index];
            element.sprite.visible = false
        }
        for (let index = 0; index <= value; index++) {
            const element = this.castleSet[index];            
            element.sprite.visible = true
            this.castleSet[index].sprite.tint = 0xFFFFFF;
        }
        this.castleSet.forEach(element => {
            element.sprite.x = element.pos.x
            element.sprite.y = element.pos.y

        });      

        
        if(hide){
            this.castleSet[value].sprite.alpha = 0
        }

        let next = value + 1
        if(next < this.castleSet.length - 1){

            
            this.castleSet[next].sprite.visible = true;
            this.castleSet[next].sprite.tint = 0;
            this.castleSet[next].sprite.alpha = 1;

            this.roundContainer.x = this.castleSet[next].sprite.x + this.castleSet[next].sprite.width / 2
            this.roundContainer.y = this.castleSet[next].sprite.y + this.castleSet[next].sprite.height / 2 - 30

            this.castleSet[next].sprite.parent.addChild(this.roundContainer)

            this.nextIcon.texture = PIXI.Texture.from(system.dataTiles[next].rawData.imageSrc)
            this.nextIcon.scale.set(0.5)
            this.nextIcon.tint = 0;

            TweenLite.killTweensOf(this.roundContainer.scale)
            this.roundContainer.scale.set(0)
            TweenLite.to(this.roundContainer.scale, 1.5, {delay:1, x:1,y:1, ease:Elastic.easeOut})
            this.roundContainer.visible = true;

        }else{
            this.roundContainer.visible = false;
        }
        
        console.log("castle")
    }
    showNext(){
        
    }
    showAnimation(value){


        this.castleSet[0].sprite.visible = true
        this.castleSet[0].sprite.alpha = 1

        this.castleSet.forEach(element => {
            element.sprite.x = element.pos.x
            element.sprite.y = element.pos.y
            TweenLite.killTweensOf(element.sprite);

        }); 

        if (value > 0){
            this.castleSet[value].sprite.tint = 0xFFFFFF;
            this.castleSet[value].sprite.visible = true
            this.castleSet[value].sprite.alpha = 0
            //TweenLite.to(this.castleSet[value].sprite, 3, {delay:0.5, alpha:1})
            TweenLite.to(this.castleSet[value].sprite, 2, {alpha:1})
            //TweenLite.from(this.castleSet[value].sprite, 0.8, {delay:0.5,  y: this.castleSet[value - 1].sprite.y - this.castleSet[value - 1].sprite.height * 1.5, ease:Bounce.easeOut });

            return this.castleSet[value].sprite;
        }
    }
    build() {

    }
    update(delta) {
        this.questionMark.sin += delta * 5;
        this.questionMark.sin %= Math.PI * 2
        this.questionMark.scale.set(Math.sin(this.questionMark.sin) * 0.1 + 0.9, Math.cos(this.questionMark.sin) * 0.1 + 0.9)
        this.questionMark.rotation = Math.sin(this.questionMark.sin) * 0.2
    }
}