import * as PIXI from 'pixi.js';
import CastleBackgroundBase from '../CastleBackgroundBase';

export default class UnicornCastleBackground extends CastleBackgroundBase {
    constructor() {
        super();
    }

    build() {

        this.skyColor = 0xCD75FD
        this.baseColor = new PIXI.Graphics().beginFill(0x74CFE3).drawRect(-5000, -5000, 10000, 10000)
        this.baseContainer.addChild(this.baseColor)

        this.baseSky = new PIXI.Sprite.fromFrame('sky')
        this.baseSky.anchor.set(0.5, 0.5)
        this.baseSky.scale.set(2)
        this.baseSky.alpha = 0.2
        this.baseContainer.addChild(this.baseSky)
        this.baseSky.y = 200


        // this.sun = new PIXI.Sprite.fromFrame('sun')
        // this.sun.anchor.set(0.5)
        // this.baseContainer.addChild(this.sun)
        // this.sun.x = 0
        // this.sun.y = -320
        // this.sun.scale.set(1)

        this.rainbow = new PIXI.Sprite.fromFrame('rainbow')
        this.rainbow.anchor.set(0.5)
        this.baseContainer.addChild(this.rainbow)

        this.rainbow.x = -10
        this.rainbow.y = -180
        this.rainbow.scale.set(0.5)

        this.cloud1 = new PIXI.Sprite.fromFrame('mountain-uni')
        this.cloud1.anchor.set(0.5)
        this.baseContainer.addChild(this.cloud1)

        this.cloud3 = new PIXI.Sprite.fromFrame('mountain-uni')
        this.cloud3.anchor.set(0.5)
        this.baseContainer.addChild(this.cloud3)

        this.cloud1.x = -310
        this.cloud1.y = -100
        this.cloud3.x = 310
        this.cloud3.y = -100
        this.cloud1.scale.set(-1, 1)
        this.cloud3.scale.set(1)




        this.castleBase = new PIXI.Sprite.fromFrame('uni-base')
        this.castleBase.anchor.set(0.5, 1)
        this.baseContainer.addChild(this.castleBase)
        this.castleBase.y = 180
        this.castleBase.scale.set(650 / this.castleBase.width)


        this.leftDetail = new PIXI.Sprite.fromFrame('backPinePatch1')
        this.leftDetail.scale.set(0.7)
        this.leftDetail.anchor.set(1, 0)
        this.leftDetail.x = -190
        this.leftDetail.y = -135
        this.baseContainer.addChild(this.leftDetail)


        this.rightDetail = new PIXI.Sprite.fromFrame('backPinePatch2')
        this.rightDetail.scale.set(0.7)
        this.rightDetail.x = 190
        this.rightDetail.y = -155
        this.baseContainer.addChild(this.rightDetail)

        this.bottomTree = new PIXI.Sprite.fromFrame('bottomTreePatch')
        this.bottomTree.anchor.set(0.5, 1)
        this.baseContainer.addChild(this.bottomTree)
        this.bottomTree.x = 0
        this.bottomTree.y = 280
        this.bottomTree.scale.set(650 / this.bottomTree.width)

        this.bottomTree2 = new PIXI.Sprite.fromFrame('bottomTreePatch')
        this.bottomTree2.anchor.set(0.5, 1)
        this.baseContainer.addChild(this.bottomTree2)
        this.bottomTree2.x = 0
        this.bottomTree2.y = 380
        this.bottomTree2.scale.set(650 / this.bottomTree2.width)




        this.castleContainer = new PIXI.Container();
        this.baseContainer.addChild(this.castleContainer)


        this.castleSet = [
            { src: 'u1', order: 0, pos: { x: 278, y: 230 } },
            { src: 'u2', order: 1, pos: { x: 155, y: 459 } },
            { src: 'u3', order: 4, pos: { x: 385, y: 456 } },
            { src: 'u4', order: 1, pos: { x: 85, y: 345 } },
            { src: 'u5', order: 3, pos: { x: 508, y: 345 } },
            { src: 'u6', order: 1, pos: { x: 85, y: 275 } },
            { src: 'u7', order: 0, pos: { x: 82, y: 169 } },
            { src: 'u8', order: 2, pos: { x: 508, y: 275 } },
            { src: 'u9', order: 2, pos: { x: 508, y: 210 } },
            { src: 'u10', order: 2, pos: { x: 517, y: 30 } },
            { src: 'u11', order: 0, pos: { x: -15, y: 250 } },
            { src: 'u12', order: 0, pos: { x: 605, y: 250 } },
            { src: 'u13-a', order: 3, pos: { x: 630, y: 44 } },
            { src: 'u13', order: 2, pos: { x: 670, y: 125 } },
            { src: 'u14', order: 16, pos: { x: 459, y: 320 } },
            { src: 'u15', order: 100, pos: { x: 150, y: 170 } },
            { src: 'u16', order: 109, pos: { x: 216, y: 48 } },
            { src: 'u17', order: 105, pos: { x: 195, y: 83 } },
            { src: 'u18', order: 8, pos: { x: 381, y: 210 } },
            { src: 'u19', order: 50, pos: { x: 410, y: 120 } },
            { src: 'u20', order: 200, pos: { x: 295, y: -32 } },
        ]


        this.castleContainer.x = -200
        this.castleContainer.y = -320
        this.castleContainer.scale.set(0.55)

    }
    initCastle() {
        super.initCastle();
    }
    resize(innerResolution, scale) {
        if (innerResolution && innerResolution.width && innerResolution.height) {

            this.innerResolution = innerResolution;

        }

    }

    update(delta) {
    }

}