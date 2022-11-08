import * as PIXI from 'pixi.js';

import Signals from 'signals';
import UIList from '../../ui/uiElements/UIList';

export default class ShopLockState extends PIXI.Container {
    constructor(width, height) {
        super()
        this.backShape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('small-no-pattern-grey'), 10, 10, 10, 10)
        this.backShape.width = width
        this.backShape.height = height
        this.addChild(this.backShape)


        this.lockList = new UIList()
        this.lockList.w = width;
        this.lockList.h = height;

        this.addChild(this.lockList);

        this.lockIcon = new PIXI.Sprite.fromFrame('results_lock')
        this.lockList.addElement(this.lockIcon)
        //this.lockIcon.fitHeight = 1;
        this.lockIcon.listScl = 0.15;
        this.lockIcon.align = 0.5;
        this.lockIcon.scaleContentMax = true;
        this.lockIcon.fitWidth = 0.65;
        this.lockIcon.tint = 0
        //this.lockIcon.scaleContentMax = 0.9;
        this.labelContainer = new PIXI.Container();
        this.infoLabel = new PIXI.Text('Unlock this upgrade at level XXXX', LABELS.LABEL2);
        this.labelContainer.addChild(this.infoLabel);
        this.infoLabel.style.fontSize = 24
        this.infoLabel.style.fill = 0xFFFFFF
        this.labelContainer.align = 0.45;
        this.labelContainer.listScl = 0.85;
        this.lockList.addElement(this.labelContainer)

        this.lockList.updateHorizontalList()
    }
    setLabel(text) {
        this.infoLabel.text = text;
        this.lockList.updateHorizontalList()
    }
    setIcon(texture, fit = 1) {
        this.lockIcon.texture = new PIXI.Texture.fromFrame(texture)
        //this.lockIcon.fitHeight = fit;

        //this.lockIcon.scaleContentMax = fit;
        this.lockList.updateHorizontalList()
    }
}