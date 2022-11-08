import * as PIXI from 'pixi.js';

import MergeScreen from './MergeScreen';
import ScreenManager from '../../../screenManager/ScreenManager';
import config from '../../../config';

export default class MergerScreenManager extends ScreenManager {
    constructor() {
        super();

        // screenManager.timeScale = 0;
        //create screen manager
        //add screens

        this.mergeScreen = new MergeScreen('MergeScreen');
        // this.addChild(screenManager);
        this.addScreen(this.mergeScreen);

        this.change('MergeScreen');
        //this.change('MainScreen');


        this.backgroundContainer = new PIXI.Container();
        this.addChild(this.backgroundContainer);
        this.setChildIndex(this.backgroundContainer, 0);



        let vignette = new PIXI.Sprite(PIXI.Texture.from('vignette'));
        this.backgroundContainer.addChild(vignette)
        vignette.width = config.width;
        vignette.height = config.height;

        this.timeScale = 1;



        this.popUpContainer = new PIXI.Container();
        this.addChild(this.popUpContainer);


        this.popUpList = [];


        this.currentPopUp = null;
        this.prevPopUp = null;


        // this.startPopUp = new StandardPopUp('init', this);
        // this.startPopUp.onConfirm.add(() => {
        //     this.gameScreen.resetGame();
        // });


        // this.popUpList.push(this.startPopUp);

        // this.gameScreen.onGameOver.add(() => {
        //     setTimeout(() => {
        //         this.change('PartyScreen');
        //     }, 1000);

        // })

        // this.startPopUp.hide();


        // this.showPopUp('init')



        // const urlParams = new URLSearchParams(window.location.search);
        // let levelRedirectParameters = urlParams.get('quickstart')
        // window.SPEED_UP = 1
        // if (levelRedirectParameters) {
        //     levelRedirectParameters = levelRedirectParameters.split(',');
        //     if (levelRedirectParameters[1]) {
        //         window.SPEED_UP = levelRedirectParameters[1]
        //     }
        //     if (levelRedirectParameters) {
        //         setTimeout(() => {
        //             this.change('GameScreen');
        //             this.gameScreen.resetGame();
        //         }, 1);
        //     }
        // }
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            if (urlParams.get('debug')) {
                this.mergeScreen.helperButtonList.visible = true
                window.isDebug = true;
            }
        }


        this.isPaused = false;

        window.onAdds.add(() => {
            this.isPaused = true;
        })

        window.onStopAdds.add(() => {
            this.isPaused = false;
        })

    }
    addCoinsParticles(pos, quant = 5, customData = {}) {
        this.particleSystem.show(pos, quant, customData)
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
        if(this.isPaused) return;
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
        if (this.currentScreen.label == 'GameScreen') {
            this.currentScreen.resetGame();
            this.particleSystem.killAll();
        }
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