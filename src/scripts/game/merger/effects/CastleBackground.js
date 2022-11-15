import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import config from '../../../config';
import TweenLite from 'gsap';

export default class CastleBackground extends PIXI.Container {
    constructor() {

        super();

        this.baseContainer = new PIXI.Container()
        this.addChild(this.baseContainer)

        this.baseTerrain = new PIXI.Sprite.fromFrame('sky')
        this.baseTerrain.anchor.set(0.5, 1)
        this.baseTerrain.scale.set(2)
        this.baseContainer.addChild(this.baseTerrain)
        this.baseTerrain.y = 200

        this.moon = new PIXI.Sprite.fromFrame('moon')
        this.moon.anchor.set(0.5)
        this.baseContainer.addChild(this.moon)
        this.moon.x = 0
        this.moon.y = -300

        this.castleBase = new PIXI.Sprite.fromFrame('castleBase')
        this.castleBase.anchor.set(0.5, 1)
        this.baseContainer.addChild(this.castleBase)
        this.castleBase.y = 100
        this.castleBase.scale.set(650 / this.castleBase.width)

        
        this.castleContainer = new PIXI.Container();
        this.baseContainer.addChild(this.castleContainer)

        this.leftDetail = new PIXI.Sprite.fromFrame('backPinePatch1')
        this.leftDetail.scale.set(0.7)
        this.leftDetail.anchor.set(1, 0)
        this.leftDetail.x = -110
        this.leftDetail.y = -185
        this.baseContainer.addChild(this.leftDetail)
        
        
        this.rightDetail = new PIXI.Sprite.fromFrame('backPinePatch2')
        this.rightDetail.scale.set(0.7)
        this.rightDetail.x = 160
        this.rightDetail.y = -155
        this.baseContainer.addChild(this.rightDetail)


        this.castleSet = [
            { src: 'stairs', order: 0, pos: { x: 299.7, y: 676.45 } },
            { src: 'door1', order: 7 , pos: { x: 282.35, y: 562.95 } },
            { src: 'frontTower1', order: 2 , pos: { x: 374.6, y: 447.3 } },
            { src: 'side2', order: 1 , pos: { x: 442.1, y: 532.5 } },
            { src: 'side1', order: 3 , pos: { x: 101.05, y: 368.55 } },
            { src: 'side3', order: 4 , pos: { x: 566.5, y: 506.5 } },
            { src: 'side4', order: 6 , pos: { x: 717.7, y: 264.9 } },
            { src: 'sideTower', order: 5 , pos: { x: 780.65, y: 320.35 } },
            { src: 'middle1', order: 8 , pos: { x: 385.35, y: 387.25 } },
            { src: 'centerHouse1', order: 11 , pos: { x: 274.3, y: 317.1 } },
            { src: 'leftTower', order: 15 , pos: { x: 123, y: 31.6 } },
            { src: 'backforest', order: 20 , pos: { x: -15.85, y: 348 } },
            { src: 'bridgeTower', order: 16 , pos: { x: 518.4, y: 49.4 } },
            { src: 'sideHouse2', order: 10 , pos: { x: 490.8, y: 277.15 } },
            { src: 'sideHouse1', order: 9 , pos: { x: 565.95, y: 308.35 } },
            { src: 'side5', order: 17 , pos: { x: 630.45, y: 0 } },
            { src: 'thinHouse', order: 15 , pos: { x: 225.05, y: 223.25 } },
            { src: 'backTower', order: 19 , pos: { x: 317.9, y: 0 } },
            { src: 'thinMiddle', order: 15 , pos: { x: 448.25, y: 91.7 } },
            { src: 'mainTower', order: 13 , pos: { x: 301.1, y: 133.1 } },
            { src: 'statue1', order: 18 , pos: { x: 355.2, y: 71.05 } }
        ]


        this.castleSet.forEach(element => {
            let img = new PIXI.Sprite.fromFrame(element.src)
            element.sprite = img;
            img.x = element.pos.x
            img.y = element.pos.y
            this.castleContainer.addChild(img)
        });

        this.castleSet.forEach(element => {
            this.castleContainer.addChildAt(element.sprite, 20-element.order)
        });



        this.castleContainer.x = -250
        this.castleContainer.y = -380

        this.castleContainer.scale.set(0.55)

    }

    resize(innerResolution, scale) {
        if (innerResolution && innerResolution.width && innerResolution.height) {

            this.innerResolution = innerResolution;

        }

    }

    update(delta) {

    }

}