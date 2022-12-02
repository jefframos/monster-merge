import * as PIXI from 'pixi.js';
import config from '../../../config';
import UIList from '../../ui/uiElements/UIList';
import Signals from 'signals';
import TweenMax from 'gsap';
import ProgressBar from '../ProgressBar';
import ShopButton from './ShopButton';
import utils from '../../../utils';

export default class AchievmentView extends PIXI.Container {
    constructor(width, height, padding = 0, texture = config.assets.popup.secondary) {
        super();
        this.container = new PIXI.Container();

        this.addChild(this.container)
        this.onClaim = new Signals();
        this.popUp = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(texture), 50, 100, 50, 50)
        this.popUp.width = width
        this.popUp.height = height

        config.addPaddingPopup(this.popUp)

        this.container.addChild(this.popUp)

        this.contentList = new UIList()
        this.contentList.w = width - padding * 2
        this.contentList.h = height - padding * 2
        this.contentList.x = padding
        this.contentList.y = padding
        this.container.addChild(this.contentList)

        this.descriptionContainer = new PIXI.Container();
        this.claimContainer = new PIXI.Container();
        this.claimContainer.align = 1
        this.claimButton = new ShopButton()

        this.claimContainer.addChild(this.claimButton)





        this.claimButton.onClickItem.removeAll()
        this.claimButton.onClickItem.add(
            () => {
                this.onClaim.dispatch(this)

                COOKIE_MANAGER.claimAchievment(this.systemID, this.data.variable);

                this.updateCurrentData()
            });
        this.systemID = ''
        this.data = {}
    }
    setData(data, systemID) {
        this.systemID = systemID;

        this.data = data;
        //let desc = data.title+'\n'+data.description
        let desc = data.description
        this.descriptionLabel = this.addLabelToNotification(desc, this.popUp.width / 2)
        this.descriptionLabel.style.align = 'left'

        this.descriptionContainer.addChild(this.descriptionLabel)

        this.progressBar = new ProgressBar({ width: this.popUp.width / 2, height: 30 }, 2)
        this.descriptionContainer.addChild(this.progressBar)
        this.progressBar.y = 60
        this.addElement(this.descriptionContainer)
        this.addElement(this.claimContainer)


        console.log(COOKIE_MANAGER.getAchievment(this.systemID, data.variable))
    }
    cleatList() {
        this.contentList.removeAllElements();
    }

    addElement(element) {
        this.contentList.addElement(element)
        this.contentList.updateHorizontalList();
    }

    addLabelToNotification(text, wrap = 0) {
        let label = new PIXI.Text(text, LABELS.LABEL1);
        label.scaleContentMax = true;
        if (wrap) {
            label.style.wordWrap = true
            label.style.wordWrapWidth = wrap
        }
        return label
    }

    addImageToNotification(imageSrc) {
        let sprite = new PIXI.Sprite.fromFrame(imageSrc);
        sprite.scaleContentMax = true;
        sprite.fitHeight = 0.8;
        return sprite
    }
    updateCurrentData(){


        let achieveData = COOKIE_MANAGER.getAchievment(this.systemID, this.data.variable);
        if(achieveData.claimed >= this.data.values.length){
            this.claimButton.deactiveMax();
            this.progressBar.visible = false;
            this.descriptionLabel.text = this.data.title
            this.contentList.updateHorizontalList();
            return false
        }
        let currentValue = achieveData.progress;
        let nextUnclaimed = this.data.values[achieveData.claimed]
        this.progressBar.setLabel(currentValue + '/' + nextUnclaimed);
        this.descriptionLabel.text = this.descriptionLabel.text.replace('{x}', nextUnclaimed)

        this.claimButton.updateCoast(utils.formatPointsLabel(this.data.prizes[achieveData.claimed]))
        if (currentValue == 0) {
            this.progressBar.setProgressBar(0)
            this.claimButton.deactive();
            return false
        }

        let bar = currentValue / nextUnclaimed;
        bar = Math.min(bar, 1)
        this.progressBar.setProgressBar(bar)
        if(bar >= 1){
            this.claimButton.enable();
            return true
        }else{
            this.claimButton.deactive();
        }

        return false
    }
    show() {
        this.visible = true;

        this.updateCurrentData()
       
    }
    hide() {
        this.visible = false;
    }
}