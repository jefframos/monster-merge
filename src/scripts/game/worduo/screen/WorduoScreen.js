import * as PIXI from 'pixi.js';

import ParticleSystem from '../../effects/ParticleSystem';
import ScrabbleSystem from '../system/ScrabbleSystem';
import Screen from '../../../screenManager/Screen';
import StandardPop from '../../popup/StandardPop';
import TweenMax from 'gsap';
import UIButton1 from '../../ui/UIButton1';
import WordMakerSystem from '../system/WordMakerSystem';
import utils from '../../../utils';

export default class WorduoScreen extends Screen {
    constructor(label) {
        super(label);
        window.baseConfigGame = PIXI.loader.resources['worduoConfig'].data.baseGame;
        this.areaConfig = window.baseConfigGame.area;
        if (!this.areaConfig.bottomArea) {
            this.areaConfig.bottomArea = 0.2
        }
        if (!this.areaConfig.topArea) {
            this.areaConfig.topArea = 0.2
        }
        if (!this.areaConfig.gameArea) {
            this.areaConfig.gameArea = { w: 0.5, h: 0.5 }
        }

        this.scrabbleSystem = new ScrabbleSystem(window.baseConfigGame.lettersData, window.baseConfigGame.wordsData)
        console.log(this.scrabbleSystem.letters)

        window.TILE_ASSSETS_POOL = []
        this.letters = {}
        for (let index = 0; index <= this.scrabbleSystem.letters.length; index++) {
            let letter = this.scrabbleSystem.letters[index]
            if (letter) {

            //    console.log(letter)
                let container = new PIXI.Container()
                let text = new PIXI.Text(letter.key, LABELS.LABEL1);
                text.style.fill = 0
                text.style.fontSize = 64

                let textPoints = new PIXI.Text(letter.points, LABELS.LABEL1);
                textPoints.style.fill = 0xFFFFFF
                textPoints.style.stroke = 0
                textPoints.style.strokeThickness = 10
                textPoints.style.fontSize = 32
                textPoints.x = 52
                textPoints.y = 48

                container.addChild(text)
                container.addChild(textPoints)
                let tex = utils.generateTextureFromContainer('image-' + letter.key.toUpperCase(), container, window.TILE_ASSSETS_POOL)
                this.letters[letter.key.toUpperCase()] = tex
            }
        }
        console.log(this.letters)
        // console.log(this.scrabbleSystem.isThisAWord('test'))
        // console.log(this.scrabbleSystem.isThisAWord('tee'))
        // console.log(this.scrabbleSystem.isThisAWord('rain'))
        // console.log(this.scrabbleSystem.isThisAWord('shove'))
        // console.log(this.scrabbleSystem.isThisAWord('shovr'))

        // console.log(this.scrabbleSystem.getConsoantSets(3, 3))
        // console.log(this.scrabbleSystem.getVowelSets(1,1))
        //this.scrabbleSystem.fetchWords(3, 10)



        this.container = new PIXI.Container()
        this.addChild(this.container);
        this.frontLayer = new PIXI.Container()
        this.addChild(this.frontLayer);
        this.uiLayer = new PIXI.Container()
        this.addChild(this.uiLayer);

        this.backBlocker = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height);
        this.backBlocker.alpha = 0.5;
        this.backBlocker.interactive = true;
        this.backBlocker.buttonMode = true;
        this.backBlocker.visible = false;

        this.frontLayer.addChild(this.backBlocker);
        this.wrapper = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, config.width * this.areaConfig.gameArea.w, config.height * this.areaConfig.gameArea.h);
        this.container.addChild(this.wrapper);

        this.topWrapper = new PIXI.Graphics().beginFill(0xaaaaaa).drawRect(0, 0, config.width, config.height * this.areaConfig.topArea);
        this.container.addChild(this.topWrapper);

        this.bottomWrapper = new PIXI.Graphics().beginFill(0xaaaaaa).drawRect(0, 0, config.width, config.height * this.areaConfig.bottomArea);
        this.container.addChild(this.bottomWrapper);

        //this.wrapper.visible = false;


        this.mainContainer = new PIXI.Container()
        this.container.addChild(this.mainContainer);

        this.uiContainer = new PIXI.Container()
        this.container.addChild(this.uiContainer);

        this.bottomContainer = new PIXI.Container()
        this.container.addChild(this.bottomContainer);

        this.topContainer = new PIXI.Container()
        this.container.addChild(this.topContainer);

        this.wordMakerSystem = new WordMakerSystem({
            mainContainer: this.mainContainer,
            topContainer: this.topContainer,
            bottomContainer: this.bottomContainer,
            wrapper: this.wrapper,
            bottomWrapper: this.bottomWrapper,
            topWrapper: this.topWrapper
        },
            this.scrabbleSystem,
            this.letters)

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));


        this.rpsLabel = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.rpsLabel)


        this.particleSystem = new ParticleSystem();
        this.frontLayer.addChild(this.particleSystem)





        window.TIME_SCALE = 1

        this.uiPanels = []


        this.standardPopUp = new StandardPop('any', this.screenManager)
        this.uiLayer.addChild(this.standardPopUp)
        this.uiPanels.push(this.standardPopUp)

    }

    standardPopUpShow(params) {
        //this.standardPopUp.show(params)
        this.openPopUp(this.standardPopUp, params)
    }
    openPopUp(target, params) {
        this.uiPanels.forEach(element => {
            if (element.visible) {
                element.hide();
            }
        });

        console.log('show', params)
        target.show(params)
    }
    popLabel(targetPosition, label) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }

    addParticles(targetPosition, customData, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        this.particleSystem.show(toLocal, quant, customData)
    }

    addDamageParticles(targetPosition, customData, label, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        this.particleSystem.show(toLocal, quant, customData)
    }
    addResourceParticles(targetPosition, customData, totalResources, quantParticles, showParticles = true) {

        let toLocal = this.particleSystem.toLocal(targetPosition)

        if (!showParticles) {
            quantParticles = 1
        }
        for (let index = 0; index < quantParticles; index++) {
            customData.target = { x: this.resourcesLabel.x, y: this.resourcesLabel.y, timer: 0.2 + Math.random() * 0.75 }
            this.particleSystem.show(toLocal, 1, customData)
        }

        if (showParticles) {
            this.particleSystem.popLabel(toLocal, "+" + utils.formatPointsLabel(totalResources), 0, 1, 1, LABELS.LABEL1)
        }
    }
    onMouseMove(e) {

        this.mousePosition = e.data.global;
    }


    onAdded() {


    }
    build(param) {
        super.build();
        this.addEvents();
    }
    update(delta) {
        this.wordMakerSystem.update(delta)
    }
    resize(resolution) {
        this.wrapper.x = config.width / 2 - this.wrapper.width / 2
        this.wrapper.y = config.height * (1 - this.areaConfig.bottomArea) - this.wrapper.height

        this.topWrapper.x = config.width / 2 - this.topWrapper.width / 2


        this.bottomWrapper.x = config.width / 2 - this.bottomWrapper.width / 2
        this.bottomWrapper.y = config.height * (1 - this.areaConfig.bottomArea)


        this.wordMakerSystem.resize(resolution)

        // this.entityShop.x = config.width / 2 - this.entityShop.width / 2
        // this.entityShop.y = config.height / 2 - this.entityShop.height / 2

        // this.mergeItemsShop.x = config.width / 2 - this.mergeItemsShop.width / 2
        // this.mergeItemsShop.y = config.height / 2 - this.mergeItemsShop.height / 2
    }

    transitionOut(nextScreen) {
        this.removeEvents();
        this.nextScreen = nextScreen;
        setTimeout(function () {
            this.endTransitionOut();
        }.bind(this), 0);
    }
    transitionIn() {
        super.transitionIn();
    }
    destroy() {

    }
    removeEvents() {
    }
    addEvents() {
        this.removeEvents();

    }
}