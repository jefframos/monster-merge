import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import AutoCollectButton from './AutoCollectButton';
import UIList from './uiElements/UIList';
// import CatAnimation from '../elements/CatAnimation';
import StaticCat from '../ui/StaticCat';
export default class CatItem extends UIList {
    constructor(catData, rect = {
        w: 400,
        h: 80
    }) {
        super();
        this.onAutoCollect = new Signals();
        this.onActiveCat = new Signals();
        this.catData = catData;
        this.staticData = GAME_DATA.getStaticCatData(catData.catID);
        
        this.thumbH = 0;
        this.background = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, rect.w, rect.h);
        this.container.addChild(this.background)
        this.background.alpha = 0

        this.w = rect.w;
        this.h = rect.h;

        this.elementsList = [];

        this.totalLabel = new PIXI.Text('0000', {
            fontFamily: 'blogger_sansregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'right',
            fontWeight: '800'
        });
        this.totalLabel.listScl = 0.1;
        this.totalLabel.scaleContentMax = true;
        this.totalLabel.scaleContent = false;
        this.totalLabel.align = 1;

        this.elementsList.push(this.totalLabel);
        this.container.addChild(this.totalLabel)

        this.thumb = new StaticCat();
        // new PIXI.Sprite.from(this.catData.catThumb);
        this.thumb.listScl = 0.2;
        this.thumb.scaleContentMax = true;
        this.thumb.fitWidth = 0.5;
        this.thumb.align = 0.5;
        this.thumb.animationContainer.x = this.thumb.width / 2;
        this.thumb.animationContainer.y = this.thumb.height / 2;
        this.elementsList.push(this.thumb);
        this.container.addChild(this.thumb);
        this.thumbH = this.thumb.height;


        this.plusIcon = new PIXI.Sprite.from('results_arrow');
        this.plusIcon.listScl = 0.065;
        this.plusIcon.fitWidth = 0.65;
        this.plusIcon.scaleContent = true;
        this.plusIcon.align = 0.75;
        this.elementsList.push(this.plusIcon);
        this.container.addChild(this.plusIcon);
        // this.plusIcon.scale.set(this.thumbH / this.plusIcon.height * 0.25)

        // console.log(this.catData);
        this.bonusLabel = new PIXI.Text(this.catData.collectedMultiplier.toFixed(3) + '%', {
            fontFamily: 'blogger_sansregular',
            fontSize: '14px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.bonusLabel.listScl = 0.075;
        this.bonusLabel.scaleContentMax = true;
        this.bonusLabel.align = 0;
        this.elementsList.push(this.bonusLabel);
        this.container.addChild(this.bonusLabel);

        this.activeButtonContainer = new PIXI.Container();
        this.backButton = new PIXI.Sprite.from('back_button');
        this.catNameLabel = new PIXI.Text('', {
            fontFamily: 'blogger_sansregular',
            fontSize: '16px',
            // fill: 0,
            fill: 0xe5519b,
            align: 'center',
            fontWeight: '800'
        });
        this.coinIcon = new PIXI.Sprite.from(GAME_DATA.moneyData.softIcon);
        this.coinIcon.anchor.set(0.5)
        this.coinIcon.visible = false;
        this.activeButtonContainer.scaleContentMax = true;
        this.activeButtonContainer.fitWidth = 0.9;
        this.activeButtonContainer.addChild(this.backButton);
        this.activeButtonContainer.addChild(this.catNameLabel);
        this.activeButtonContainer.addChild(this.coinIcon);

        this.warningIcon = new PIXI.Sprite.from('new_item'); 
        this.warningIcon.anchor.set(0.5)
        this.warningIcon.scale.set(this.backButton.height / this.warningIcon.height * 0.5)
        this.warningIcon.x = this.backButton.width
        this.backButton.addChild(this.warningIcon)

        this.elementsList.push(this.activeButtonContainer);
        this.container.addChild(this.activeButtonContainer)



        this.autocollect = new AutoCollectButton(this.staticData)
        this.autocollect.scaleContent = false;
        this.autocollect.fitWidth = 1;
        this.autocollect.align = 1;
        this.autocollect.listScl = 0.25;
        this.autocollect.enableAutoCollect.add(this.onAutoCollectCallback.bind(this));
        this.elementsList.push(this.autocollect);
        this.container.addChild(this.autocollect);

        this.backButton.on('mouseup', this.activeCat.bind(this)).on('touchend', this.activeCat.bind(this));

    }
    activeCat() {
        this.onActiveCat.dispatch(this.catData);
        SOUND_MANAGER.play(getCatSound())
        SOUND_MANAGER.play('pickup_star');
    }
    updateThumb(delta) {
        if (this.catData.active) {
            // this.thumb.update(delta * 0.1);
        }
    }
    onAutoCollectCallback() {
        this.onAutoCollect.dispatch(this);
    }
    updateItem(catData) {
        this.catData = catData;
        this.staticData = GAME_DATA.getStaticCatData(catData.catID);
        let quant = utils.formatPointsLabel(this.catData.collected / MAX_NUMBER);

        this.totalLabel.text = quant == 0 ? '' : quant
        this.bonusLabel.text = utils.cleanString(this.catData.collectedMultiplier.toFixed(1)) + '%';
        this.backButton.tint = 0xFFFFFF;
        this.backButton.texture = PIXI.Texture.from('back_button')
        this.backButton.alpha = 1;

        if (this.staticData.cost <= GAME_DATA.moneyData.currentCoins && !this.catData.active) {
        // if (this.catData.canBeActive && !this.catData.active) {
            this.thumb.updateCatTextures(this.staticData.catSrc);
            this.thumb.lock();
            this.totalLabel.text = ''
            this.catNameLabel.text = utils.formatPointsLabel(this.staticData.cost / MAX_NUMBER) //('active').toUpperCase();
            this.plusIcon.texture = PIXI.Texture.from('results_lock');
            this.autocollect.visible = false;
            this.coinIcon.visible = true;

            this.backButton.alpha = 1;
            this.backButton.tint = 0x6250e5
            // this.backButton.tint = 0x55d662
            this.catNameLabel.style.fill = 0xFFFFFF;
            this.bonusLabel.visible = false;
            this.plusIcon.visible = true;
            this.backButton.interactive = true;
            this.backButton.buttonMode = true;
            // this.backButton.on('mouseup', this.activeCat.bind(this)).off('touchend', this.activeCat.bind(this));
            this.warningIcon.alpha = 1;
            // this.backButton.on('mouseup', this.activeCat.bind(this)).on('touchend', this.activeCat.bind(this));

        } else if (this.catData.active) {
            this.backButton.off('mouseup', this.activeCat.bind(this)).off('touchend', this.activeCat.bind(this));
            this.thumb.tint = 0xFFFFFF;
            this.thumb.unlock();
            this.coinIcon.visible = false;
            this.thumb.updateCatTextures(this.staticData.catSrc); //.texture = PIXI.Texture.from(this.catData.catThumb);

            // if(!this.staticData.stamp){
            //     this.staticData.stamp = this.thumb.stamp();
            // }
            this.catNameLabel.text = this.staticData.catName.toUpperCase();
            this.plusIcon.texture = PIXI.Texture.from('results_arrow');
            this.catNameLabel.style.fill = 0xFFFFFF;
            this.bonusLabel.visible = true;
            this.plusIcon.visible = true;

            this.backButton.alpha = 0;
            this.backButton.interactive = false;
            this.backButton.buttonMode = false;
            this.autocollect.visible = true;
            if (this.catData.collected >= this.staticData.amountToAutoCollect) {

            } else {
                // this.autocollect.visible = false;
            }

            if (this.catData.isAuto) {
                this.autocollect.enable();
            } else {
                if (GAME_DATA.isPossibleBuyAuto(this.catData.catID)) {

                    this.autocollect.reset(this.staticData);
                } else {

                    this.autocollect.deactive(this.staticData);
                }
                // if()
            }
            // this.autocollect.x = this.catNameLabel.x + this.catNameLabel.width + 25
        } else {
            // this.backButton.off('mouseup', this.activeCat.bind(this)).off('touchend', this.activeCat.bind(this));
            // this.thumb.texture = PIXI.Texture.from('results_locked_cat');
            // console.log(this.staticData);
            this.coinIcon.visible = false;
            this.thumb.updateCatTextures(this.staticData.catSrc);
            this.thumb.lock();
            this.totalLabel.text = ''
            // this.backButton.texture = PIXI.Texture.from('score_plinth')
            this.catNameLabel.text = ('unlock at\n' + utils.formatPointsLabel(this.staticData.cost / MAX_NUMBER)).toUpperCase();
            this.plusIcon.texture = PIXI.Texture.from('results_lock');
            this.warningIcon.alpha = 0;
            this.autocollect.visible = false;
            this.bonusLabel.visible = false;
            this.plusIcon.visible = true;
            this.backButton.alpha = 1;
            this.catNameLabel.style.fill = 0xFFFFFF;
            this.catNameLabel.style.fill = 0xe5519b;
            this.backButton.interactive = false;
            this.backButton.buttonMode = false;
            // this.backButton.alpha = 0;
        }


        let realSize = {
            w: this.catNameLabel.width / this.catNameLabel.scale.x,
            h: this.catNameLabel.height / this.catNameLabel.scale.y
        }
        if (realSize.w / this.backButton.width > 0.7) {
            this.catNameLabel.scale.set(this.backButton.width / realSize.w * 0.7)

        }
        this.catNameLabel.pivot.x = realSize.w / 2;
        this.catNameLabel.pivot.y = realSize.h / 2;

        this.catNameLabel.x = this.backButton.width / 2;
        this.catNameLabel.y = this.backButton.height / 2;

        if (this.coinIcon.visible) {
            this.coinIcon.scale.set(this.catNameLabel.height / (this.coinIcon.height / this.coinIcon.scale.y));
            this.coinIcon.y = this.catNameLabel.y
            this.coinIcon.x = this.catNameLabel.x - this.catNameLabel.width / 2 - this.coinIcon.width / 2 - 5;
        }

        this.autocollect.updateData(this.staticData);

        // this.updateHorizontalList();
        this.updateHorizontalList();
    }

}