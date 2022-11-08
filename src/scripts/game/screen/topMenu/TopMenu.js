import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import TopMenuButton from './buttons/TopMenuButton';
import MainTopMenuButton from './buttons/MainTopMenuButton';
import BackTopMenuButton from './buttons/BackTopMenuButton';
import SoundTopMenuButton from './buttons/SoundTopMenuButton';
export default class TopMenu extends PIXI.Container {
    constructor() {
        super();

        this.h = window.DIMENSIONS.TOP_HUD * 0.65;

        this.mainButton = new MainTopMenuButton(this.h)
        this.addChild(this.mainButton)

        this.mainButton.x = config.width - this.mainButton.width / 2 - window.DIMENSIONS.TOP_HUD * 0.5 * 0.5
        this.mainButton.y = window.DIMENSIONS.TOP_HUD * 0.5;
        this.mainButton.buttonMode = true;
        this.mainButton.interactive = true;

        this.mainButton.click = this.mainButton.tap = this.expandMenu.bind(this);
        this.buttonList = []

        this.standardButtonScale = this.mainButton.scale.x;

        console.log(this.standardButtonScale);

        this.onBackClick = new Signals();

        const BUTTONS = {
            TopMenuButton,
            BackTopMenuButton,
            MainTopMenuButton,
            SoundTopMenuButton
        }
        this.buttonTypes = [{
            type: 'TopMenuButton',
            callback: null
        }, {
            type: 'TopMenuButton',
            callback: null
        }, {
            type: 'SoundTopMenuButton',
            callback: this.clickSound
        }, {
            type: 'TopMenuButton',
            callback: null
        }, {
            type: 'BackTopMenuButton',
            callback: this.clickBack
        }]


        // new CLASSES[entityData.type](this)
        for (var i = 1; i < this.buttonTypes.length; i++) {
            let temp = new BUTTONS[this.buttonTypes[i].type](this.h)
            temp.x = this.mainButton.x - (temp.width + 10) / 2 * i
            temp.y = this.mainButton.y + (i % 2 != 0 ? (temp.height + 10) / 2 : 0)
            this.addChild(temp)
            this.buttonList.push(temp);
            temp.visible = false;
            temp.buttonMode = true;
            temp.interactive = true;
            temp.type = this.buttonTypes[i]

            if (this.buttonTypes[i].callback) {
                temp.click = temp.tap = this.buttonTypes[i].callback.bind(this, temp);
            }
        }

    }
    clickSound(button) {
        button.toggle();
        if(button.isActive){
            SOUND_MANAGER.unmute();
        }else{
            SOUND_MANAGER.mute();
        }
        console.log(SOUND_MANAGER);
    }
    clickBack() {
        this.onBackClick.dispatch();
        this.recoilMenu();

        console.log('BACK');
    }
    rotateMainButton() {
        TweenLite.to(this.mainButton, 0.5, {
            rotation: Math.PI,
            onComplete: function() {
                this.mainButton.rotation = 0;
            }.bind(this)
        })
    }
    recoilMenu(onChange = false) {
        if (onChange) {
            this.rotateMainButton();
        }
        if (!this.expandedMenu) {
            return
        }

        this.mainButton.deactive();
        let tempPositions = [];


        this.mainButton.scale.set(this.standardButtonScale * 0.7)
        TweenLite.to(this.mainButton.scale, 0.7, {
            x: this.standardButtonScale,
            y: this.standardButtonScale,
            ease: Elastic.easeOut
        })

        for (var i = 0; i < this.buttonList.length; i++) {
            this.buttonList[i].buttonMode = false;
            this.buttonList[i].interactive = false;
            tempPositions.push({
                x: this.mainButton.x - (this.buttonList[i].width + 10) / 2 * (i + 1),
                y: this.mainButton.y + ((i + 1) % 2 != 0 ? (this.buttonList[i].height + 10) / 2 : 0)
            })
        }
        let delay = 0.1;
        // for (var i = 0; i < this.buttonList.length; i++) {
        let id = this.buttonList.length - 1;
        for (var i = this.buttonList.length - 1; i >= 0; i--) {
            this.buttonList[i].visible = true;
            let prevPosition = {
                x: this.mainButton.x,
                y: this.mainButton.y
            };
            if (i > 0) {
                prevPosition.x = tempPositions[i - 1].x
                prevPosition.y = tempPositions[i - 1].y
            }
            TweenLite.killTweensOf(this.buttonList[i]);
            console.log(prevPosition);
            id = this.buttonList.length - i
            TweenLite.to(this.buttonList[i], delay, {
                alpha: 0,
                x: prevPosition.x,
                y: prevPosition.y,
                delay: delay * id,
                onStartParams:[this.buttonList[i]],
                onStart:(btn)=>{
                    btn.hide();
                }
            });
        }
        this.expandedMenu = false;

    }
    expandMenu() {
        if (this.expandedMenu) {
            this.recoilMenu();
            return
        }


        this.mainButton.active();
        this.mainButton.scale.set(this.standardButtonScale * 0.7)
        TweenLite.to(this.mainButton.scale, 0.7, {
            x: this.standardButtonScale,
            y: this.standardButtonScale,
            ease: Elastic.easeOut
        })

        let tempPositions = [];
        for (var i = 0; i < this.buttonList.length; i++) {
            this.buttonList[i].x = this.mainButton.x - (this.buttonList[i].width + 10) / 2 * (i + 1)
            this.buttonList[i].y = this.mainButton.y + ((i + 1) % 2 != 0 ? (this.buttonList[i].height + 10) / 2 : 0)
            tempPositions.push({
                x: this.buttonList[i].x,
                y: this.buttonList[i].y
            })
            this.buttonList[i].visible = false;
        }


        let delay = 0.1;
        for (var i = 0; i < this.buttonList.length; i++) {
            this.buttonList[i].buttonMode = true;
            this.buttonList[i].interactive = true;
            this.buttonList[i].alpha = 1 //0.75;
            this.buttonList[i].visible = true;
            let prevPosition = {
                x: this.mainButton.x,
                y: this.mainButton.y
            };
            if (i > 0) {
                prevPosition.x = tempPositions[i - 1].x
                prevPosition.y = tempPositions[i - 1].y
            }
            TweenLite.killTweensOf(this.buttonList[i]);
            console.log(prevPosition);
            TweenLite.from(this.buttonList[i], delay, {
                alpha: 0,
                x: prevPosition.x,
                y: prevPosition.y,
                delay: delay * i,
                 onStartParams:[this.buttonList[i]],
                onStart:(btn)=>{
                    btn.show();
                }
            });
        }
        this.expandedMenu = true;
    }
}