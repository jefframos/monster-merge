import * as PIXI from 'pixi.js';

import ScreenManager from '../../../screenManager/ScreenManager';
import WorduoScreen from './WorduoScreen';
import config from '../../../config';

export default class WorduoScreenManager extends ScreenManager {
    constructor() {
        super();

        // screenManager.timeScale = 0;
        //create screen manager
        //add screens

        this.worduoScreen = new WorduoScreen('WorduoScreen');
        this.addScreen(this.worduoScreen);

        this.change('WorduoScreen');


        this.backgroundContainer = new PIXI.Container();
        this.addChild(this.backgroundContainer);
        this.setChildIndex(this.backgroundContainer, 0);
       

        this.timeScale = 1;

    }

    showPopUp(label, param = null) {

        if (this.currentPopUp) //} && this.currentPopUp.label != label)
        {
            this.prevPopUp = this.currentPopUp;
        }
        for (var i = 0; i < this.popUpList.length; i++) {
            if (this.popUpList[i].label == label) {
                if (this.particleSystem) {
                    this.particleSystem.killAll();
                }
                this.popUpList[i].show(param);
                this.popUpContainer.addChild(this.popUpList[i]);
                this.currentPopUp = this.popUpList[i];
                if (!this.prevPopUp) {
                    this.prevPopUp = this.popUpList[i];
                }
            }
        }
    }
    forceChange(screenLabel, param) {

        super.forceChange(screenLabel, param);
    }
    change(screenLabel, param) {
        super.change(screenLabel, param);

    }
    redirectToGame(harder) {
        window.HARDER = harder
        this.change('GameScreen');
        this.showPopUp('init')
    }
    update(delta) {
        super.update(delta * this.timeScale);

        if (this.currentPopUp) {
            this.currentPopUp.update(delta * this.timeScale)
        }
        if (this.prevPopUp && this.prevPopUp.toRemove && this.prevPopUp.parent) {
            this.prevPopUp.parent.removeChild(this.prevPopUp);
            this.prevPopUp = null;
        }
        
    }

    toGame() {
    }
    toLoad() { }
    toStart() {
        this.showPopUp('init')
    }

    shake(force = 1, steps = 4, time = 0.25) {
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(this.screensContainer, speed, {
                x: Math.random() * positionForce - positionForce / 2,
                y: Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.screensContainer, speed, {
            x: 0,
            y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}