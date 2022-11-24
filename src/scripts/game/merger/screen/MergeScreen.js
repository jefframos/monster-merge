import * as PIXI from 'pixi.js';

import GameEconomy from '../GameEconomy';
import GameModifyers from '../GameModifyers';
import MergeItemsShop from '../shop/MergeItemsShop';
import MergeSystem from '../systems/MergeSystem';
import MergerData from '../data/MergerData';
import ParticleSystem from '../../effects/ParticleSystem';
import Screen from '../../../screenManager/Screen';
import PuzzleBackground from '../backgrounds/PuzzleBackground';
import CastleBackground from '../backgrounds/CastleBackground';
import StandardPop from '../../popup/StandardPop';
import TweenMax from 'gsap';
import UIButton1 from '../../ui/UIButton1';
import utils from '../../../utils';
import UIList from '../../ui/uiElements/UIList';
import OpenChestPopUp from '../../popup/OpenChestPopUp';
import LevelMeter from '../ui/shop/LevelMeter';
import MonsterBackground from '../backgrounds/MonsterBackground';

export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);

        window.baseConfigGame = PIXI.loader.resources['baseGameConfigMonster'].data.baseGame;
        window.baseConfigGameFairy = PIXI.loader.resources['baseGameConfigFairy'].data.baseGame;
        window.baseConfigGameHumans = PIXI.loader.resources['baseGameConfigHumans'].data.baseGame;
        window.baseMonsters = PIXI.loader.resources['monsters'].data;
        window.baseFairies = PIXI.loader.resources['fairies'].data;
        window.baseHumans = PIXI.loader.resources['humans'].data;
        window.gameEconomy = new GameEconomy()
        window.gameModifyers = new GameModifyers()

        this.systemsList = [];

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
        if (!this.areaConfig.resourcesArea) {
            this.areaConfig.resourcesArea = { w: 0.5, h: 0.5 }
        }

        setTimeout(() => {
            this.monsterBackground = new MonsterBackground();
            this.addChildAt(this.monsterBackground, 0);
        }, 10);
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
        this.gridWrapper = new PIXI.Graphics().lineStyle(10, 0x132215).drawRect(0, 0, config.width * this.areaConfig.gameArea.w, config.height * this.areaConfig.gameArea.h);
        this.container.addChild(this.gridWrapper);
        this.gridWrapper.visible = false;
        //this.gridWrapper.alpha = 0.5;

        this.mergeSystemContainer = new PIXI.Container()
        this.container.addChild(this.mergeSystemContainer);

        this.prizeContainer = new PIXI.Container()
        this.container.addChild(this.prizeContainer);

        this.uiContainer = new PIXI.Container()
        this.container.addChild(this.uiContainer);

        this.topContainer = new PIXI.Container()
        this.container.addChild(this.topContainer);


        this.dataTiles = []
        this.dataResourcesTiles = []
        this.allMergeData = [];
        this.uiPanels = []
        this.mergeSystemsList = []


        let containers = {
            mainContainer: this.mergeSystemContainer,
            uiContainer: this.uiContainer,
            wrapper: this.gridWrapper,
            topContainer: this.topContainer
        }




        this.systemButtonList = new UIList()
        this.systemButtonList.w = 100
        this.systemButtonList.h = 80
        this.container.addChild(this.systemButtonList)


        this.registerSystem(containers, window.baseConfigGame, window.baseMonsters, 'monsters', true)
        this.registerSystem(containers, window.baseConfigGameFairy, window.baseFairies, 'fairies', false)
        this.registerSystem(containers, window.baseConfigGameHumans, window.baseHumans, 'humans', false)


        this.entityDragSprite = new PIXI.Sprite.from('');
        this.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));

        this.statsList = new UIList()
        this.statsList.w = 100
        this.statsList.h = 80
        this.container.addChild(this.statsList)

        this.totalCoinsContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('grid1'), 20, 20, 20, 5)
        this.totalCoinsContainer.width = this.statsList.w
        this.totalCoinsContainer.height = 40
        this.totalCoins = new PIXI.Text('', LABELS.LABEL2);
        this.totalCoins.style.fontSize = 14
        this.totalCoinsContainer.addChild(this.totalCoins)
        this.statsList.addElement(this.totalCoinsContainer)

        this.resourcesTexture = new PIXI.Sprite.from('coin')
        this.resourcesTexture.scale.set(this.totalCoinsContainer.height / this.resourcesTexture.height * 0.5)
        this.resourcesTexture.x = -30
        this.resourcesTexture.y = -3
        this.totalCoins.addChild(this.resourcesTexture)


        this.coinsPerSecondCounter = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('grid1'), 20, 20, 20, 5)
        this.coinsPerSecondCounter.width = this.statsList.w
        this.coinsPerSecondCounter.height = 40

        this.coisPerSecond = new PIXI.Text('0', LABELS.LABEL2);
        this.coisPerSecond.style.fontSize = 14
        this.coinsPerSecondCounter.addChild(this.coisPerSecond)
        this.statsList.addElement(this.coinsPerSecondCounter)

        this.shardsTexture = new PIXI.Sprite.from('coin-s')
        this.coisPerSecond.addChild(this.shardsTexture)
        this.shardsTexture.scale.set(this.coinsPerSecondCounter.height / this.shardsTexture.height * 0.5)
        this.shardsTexture.x = -30
        this.shardsTexture.y = -3


        this.statsList.updateVerticalList();

        this.particleSystem = new ParticleSystem();
        this.frontLayer.addChild(this.particleSystem)


        this.levelMeter = new LevelMeter();
        this.container.addChild(this.levelMeter)

        this.addHelpers();

        let buttonSize = 70
        this.shopButtonsList = new UIList();
        this.shopButtonsList.w = buttonSize;
        this.shopButtonsList.h = buttonSize * 2.5;
        this.container.addChild(this.shopButtonsList)

        this.currentOpenPopUp = null;


        this.shopsLabel = new PIXI.Text(window.localizationManager.getLabel('shops'), LABELS.LABEL1);
        this.container.addChild(this.shopsLabel)
        this.shopsLabel.style.fontSize = 24
        this.shopsLabel.style.stroke = 0x002299
        this.shopsLabel.style.strokeThickness = 6


        this.openMergeShop = new UIButton1(0x002299, 'vampire', 0xFFFFFF, buttonSize, buttonSize)
        this.openMergeShop.updateIconScale(0.75)
        this.openMergeShop.addBadge('icon_increase')
        this.openMergeShop.newItem = new PIXI.Sprite.fromFrame('new_item')
        this.openMergeShop.newItem.scale.set(0.7)
        this.openMergeShop.newItem.anchor.set(0)
        this.openMergeShop.newItem.position.set(-buttonSize / 2)
        this.openMergeShop.newItem.visible = false;
        this.openMergeShop.addChild(this.openMergeShop.newItem)
        this.shopButtonsList.addElement(this.openMergeShop)
        this.openMergeShop.onClick.add(() => {
            this.openPopUp(this.activeMergeSystem.shop)
        })

        this.shopButtonsList.updateVerticalList();

        window.TIME_SCALE = 1

        this.standardPopUp = new StandardPop('any', this.screenManager)
        this.uiLayer.addChild(this.standardPopUp)

        // this.bonusPopUp = new BonusConfirmation('bonus', this.screenManager)
        // this.uiLayer.addChild(this.bonusPopUp)

        this.openChestPopUp = new OpenChestPopUp('chest', this.screenManager)
        this.uiLayer.addChild(this.openChestPopUp)

        this.uiPanels.push(this.standardPopUp)
        this.uiPanels.push(this.openChestPopUp)


        this.sumStart = 0;
        //this.savedResources = COOKIE_MANAGER.getResources('monster');



        this.shopButtonsList.updateVerticalList();

        let now = Date.now() / 1000 | 0
        let diff = 0;//now - this.savedEconomy.lastChanged

        if (this.tutorialStep > 1 && diff > 60 && this.sumStart > 10) {
            let params = {
                label: window.localizationManager.getLabel('offline-money'),
                value1: utils.formatPointsLabel(this.sumStart),
                value2: utils.formatPointsLabel(this.sumStart * 2),
                onConfirm: this.collectStartAmountDouble.bind(this),
                onCancel: this.collectStartAmount.bind(this)
            }
            this.standardPopUpShow(params)
        }

        this.forcePauseSystemsTimer = 0.05;


        this.resetWhiteShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(-config.width * 4, -config.height * 4, config.width * 8, config.height * 8);
        this.addChild(this.resetWhiteShape);
        this.resetWhiteShape.visible = false;
        //this.mergeItemsShop.show()

        //this.tutorialStep = window.COOKIE_MANAGER.getStats().tutorialStep;


        // this.gameTutorial = new GameTutorial(this)
        // if (this.tutorialStep == 0) {
        //     if (window.gameEconomy.currentResources > 10) {
        //         COOKIE_MANAGER.endTutorial(2);
        //     } else {

        //         this.startTutorial();
        //         this.addChild(this.gameTutorial);
        //     }
        // }

        // this.mergeSystemsList.push(this.mergeSystemFairies)
        this.activeMergeSystemID = 0
        this.activeMergeSystem = this.mergeSystemsList[this.activeMergeSystemID]
        this.refreshSystemVisuals();
        //this.savedEconomy = COOKIE_MANAGER.getEconomy(this.activeMergeSystem.systemID);


    }

    registerSystem(containers, baseData, baseMergeData, slug, visible = true) {

        COOKIE_MANAGER.sortCookie(slug)
        let rawMergeDataList = []
        for (let index = 0; index < baseMergeData.mergeEntities.list.length; index++) {
            let mergeData = new MergerData(baseMergeData.mergeEntities.list[index], index)
            mergeData.type = baseMergeData.mergeEntities.list[index].type
            rawMergeDataList.push(mergeData)
            this.allMergeData.push(mergeData)
        }

        let mergeSystem = new MergeSystem(containers, baseData,
            rawMergeDataList,
            slug);
        this.addSystem(mergeSystem)
        mergeSystem.enemySystem = this.enemiesSystem;

        mergeSystem.onParticles.add(this.addParticles.bind(this));
        mergeSystem.onDealDamage.add(this.addDamageParticles.bind(this));
        mergeSystem.onPopLabel.add(this.popLabel.bind(this));
        mergeSystem.onGetResources.add(this.addResourceParticles.bind(this));
        mergeSystem.onBoardLevelUpdate.add(this.onMergeSystemUpdate.bind(this));

        let mergeItemsShop = new MergeItemsShop([mergeSystem])
        this.uiLayer.addChild(mergeItemsShop);
        mergeItemsShop.addItems(rawMergeDataList)
        mergeItemsShop.hide();
        mergeItemsShop.onAddEntity.add((entity) => {
            mergeSystem.buyEntity(entity)
        })


        mergeSystem.updateAvailableSlots.add((availables) => {
            mergeItemsShop.updateLocks(availables)
            //POPUP
        });
        mergeSystem.updateMaxLevel.add((max) => {
            this.monsterBackground.updateMax(max)
            //POPUP
        });

        mergeSystem.shop = mergeItemsShop
        this.uiPanels.push(mergeItemsShop)

        mergeSystem.systemArrayID = this.mergeSystemsList.length;
        mergeSystem.visible = visible;

        let buttonSize = 60

        let toggleSystems = new UIButton1(0x002299, rawMergeDataList[0].rawData.imageSrc, 0xFFFFFF, buttonSize, buttonSize)

        toggleSystems.systemArrayID = this.mergeSystemsList.length;
        toggleSystems.onClick.add(() => {
            this.showSystem(toggleSystems.systemArrayID)
        })

        this.mergeSystemsList.push(mergeSystem)
        this.systemButtonList.addElement(toggleSystems);
    }
    showSystem(id) {
        this.mergeSystemsList.forEach(element => {
            element.visible = false;
        });

        this.activeMergeSystemID = id;
        this.activeMergeSystemID %= this.mergeSystemsList.length

        this.mergeSystemsList[this.activeMergeSystemID].visible = true;
        this.activeMergeSystem = this.mergeSystemsList[this.activeMergeSystemID]

        this.refreshSystemVisuals();
    }
    refreshSystemVisuals() {
        if (!this.activeMergeSystem.isLoaded) {
            this.activeMergeSystem.loadData();
        }

        window.gameEconomy.updateBoard(this.activeMergeSystem.systemID)
        this.resourcesTexture.texture = PIXI.Texture.fromImage(this.activeMergeSystem.baseData.visuals.coin)

        setTimeout(() => {
            this.activeMergeSystem.activeSystem()

        }, 1);

    }
    startTutorial() {
        setTimeout(() => {

        }, 51);
        this.gameTutorial.start();

    }
    endTutorial() {

    }
    onConfirmBonus(target) {
        this.openPopUp(this.bonusPopUp, {
            texture: target.mainButton.icon.texture,
            description: target.fullDescription,
            shortDescription: target.shortDescription,
            onConfirm: () => {
                target.confirmBonus();
            }
        })
    }
    onPrizeCollected(prizes) {
        if (!prizes) return;
        if (prizes.money > 0) {
            window.gameEconomy.addResources(prizes.money)
            let toLocal = this.particleSystem.toLocal({ x: config.width / 2, y: config.height / 2 })
            let customData = {};
            customData.texture = 'coin'
            customData.scale = 0.02
            customData.gravity = 500
            customData.alphaDecress = 0
            customData.ignoreMatchRotation = true
            let coinPosition = this.coinTexture.getGlobalPosition();

            let toLocalTarget = this.particleSystem.toLocal(coinPosition)

            customData.target = { x: toLocalTarget.x, y: toLocalTarget.y, timer: 0.2 + Math.random() * 0.75 }
            this.particleSystem.show(toLocal, 3, customData)
        }
        if (prizes.shards > 0) {
            window.gameModifyers.addShards(prizes.shards)
            setTimeout(() => {
                let toLocal = this.particleSystem.toLocal({ x: config.width / 2, y: config.height / 2 })
                let customData = {};
                customData.texture = 'shards'
                customData.scale = 0.025
                customData.gravity = 200
                customData.alphaDecress = 0
                customData.ignoreMatchRotation = true

                let coinPosition = this.shardsTexture.getGlobalPosition();

                let toLocalTarget = this.particleSystem.toLocal(coinPosition)

                customData.target = { x: toLocalTarget.x, y: toLocalTarget.y, timer: 0.2 + Math.random() * 0.75 }
                this.particleSystem.show(toLocal, 3, customData)
            }, 50);

        }
        if (prizes.ship > 0) {
            this.mergeSystemMonsters.addShipBasedOnMax(prizes.ship)
        }
    }

    addSystem(system) {
        if (!this.systemsList.includes(system)) {
            this.systemsList.push(system)
        }
    }
    collectStartAmountDouble() {
        window.DO_REWARD(() => {
            //this.resourceSystem.collectCustomStartAmount(this.sumStart * 2)
        })
    }
    collectStartAmount() {
        //this.resourceSystem.collectCustomStartAmount(this.sumStart)
    }
    standardPopUpShow(params) {
        this.openPopUp(this.standardPopUp, params)
    }
    openPopUp(target, params) {

        this.uiPanels.forEach(element => {
            if (element.visible) {
                element.hide();
            }
        });

        this.currentOpenPopUp = target;
        target.show(params)
    }
    popLabel(targetPosition, label) {
        let toLocal = this.particleSystem.toLocal(targetPosition)


        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }
    popLabelDamage(targetPosition, label) {
        let toLocal = this.particleSystem.toLocal(targetPosition)


        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, 1, LABELS.LABEL_DAMAGE)
    }
    addParticles(targetPosition, customData, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        this.particleSystem.show(toLocal, quant, customData)
    }

    addDamageParticles(targetPosition, customData, label, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        this.particleSystem.show(toLocal, quant, customData)
        //this.particleSystem.popLabel(targetPosition, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }
    onMergeSystemUpdate(data) {
        this.levelMeter.updateData(data)
    }
    addResourceParticles(targetPosition, customData, totalResources, quantParticles, showParticles = true) {
        window.gameEconomy.addResources(totalResources, this.activeMergeSystem.systemID)

        if (totalResources < 1000) {
            this.popLabelDamage(targetPosition, totalResources)
        } else {
            this.popLabelDamage(targetPosition, utils.formatPointsLabel(totalResources))
        }
        if (quantParticles <= 0) {
            return;
        }
        let toLocal = this.particleSystem.toLocal(targetPosition)
        if (!showParticles) {
            quantParticles = 1
        }

        for (let index = 0; index < quantParticles; index++) {
            //customData.target = { x: coinPosition.x - frontLayer.x, y: coinPosition.y - frontLayer.y, timer: 0.2 + Math.random() * 0.75 }
            //customData.target = { x: toLocal.x, y: toLocal.y - 50, timer: 0 }
            customData.gravity = 0
            customData.ignoreMatchRotation = true;
            this.particleSystem.show(toLocal, 1, customData)
        }


        let coinPosition = this.resourcesTexture.getGlobalPosition()
        let toLocalCoin = this.particleSystem.toLocal(coinPosition)
        for (let index = 0; index < 1; index++) {
            customData.target = { x: toLocalCoin.x, y: toLocalCoin.y, timer: 0.2 + Math.random() * 0.75 }
            customData.scale = 0.01
            customData.forceX = Math.random() * 1000 - 500
            customData.forceY = 500
            customData.gravity = 1200
            customData.alphaDecress = 0.1
            customData.ignoreMatchRotation = true;
            this.particleSystem.show(toLocal, 1, customData)
        }

        if (showParticles) {
            //this.particleSystem.popLabel(toLocal, "+" + utils.formatPointsLabel(totalResources), 0, 1, 1, LABELS.LABEL1)
        }
    }
    onMouseMove(e) {

        if (this.currentOpenPopUp && this.currentOpenPopUp.visible) {
            return;
        }

        this.systemsList.forEach(element => {
            element.updateMouseSystems(e)
        });
        this.mousePosition = e.data.global;
        if (!this.draggingEntity) {
            return;
        }
        if (this.entityDragSprite.visible) {
            this.entityDragSprite.x = this.mousePosition.x;
            this.entityDragSprite.y = this.mousePosition.y;
        }
    }


    onAdded() {


    }
    build(param) {
        super.build();
        this.addEvents();
    }
    update(delta) {
        delta *= window.TIME_SCALE * window.gameModifyers.bonusData.gameSpeed;

        //this.gameTutorial.update(delta);

        if (this.forcePauseSystemsTimer > 0) {
            this.forcePauseSystemsTimer -= delta;

        } else {
            this.systemsList.forEach(element => {
                element.updateSystems(delta)
            });
            this.particleSystem.update(delta)
        }

        this.uiPanels.forEach(element => {
            if (element.update) {
                element.update(delta)
            }
        });


        this.totalCoins.text = utils.formatPointsLabel(window.gameEconomy.currentResources);
        utils.centerObject(this.totalCoins, this.totalCoinsContainer)
        this.totalCoins.x = 40

        this.coisPerSecond.text = utils.formatPointsLabel(this.activeMergeSystem.rps);
        utils.centerObject(this.coisPerSecond, this.coinsPerSecondCounter)
        this.coisPerSecond.x = 40

        this.timestamp = (Date.now() / 1000 | 0);


        this.monsterBackground.update(delta);


    }
    resize(resolution, innerResolution) {
        if (!innerResolution || !innerResolution.height) return
        if (!resolution || !resolution.width || !resolution.height || !innerResolution) {
            //return;
        }

        var newRes = { width: resolution.width * this.screenManager.scale.x }

        if (this.monsterBackground) {

            this.monsterBackground.resize(resolution, innerResolution);
            this.monsterBackground.x = config.width / 2
            this.monsterBackground.y = config.height / 2
        }



        var toGlobal = this.toLocal({ x: 0, y: innerResolution.height })

        this.gridWrapper.x = config.width / 2 - this.gridWrapper.width / 2
        this.gridWrapper.y = config.height * (1 - this.areaConfig.bottomArea) - this.gridWrapper.height



        var topRight = game.getBorder('topRight', this)
        var toGlobalBack = this.toLocal({ x: 0, y: innerResolution.height })


        if (!window.isPortrait) {

            this.gridWrapper.x = toGlobalBack.x + 20
            this.gridWrapper.y = config.height - (this.monsterBackground.puzzleBackground.pivot.y + 25) * this.monsterBackground.puzzleBackground.scale.y//this.puzzleBackground.y - this.puzzleBackground.pivot.y

            this.gridWrapper.width = this.monsterBackground.puzzleBackground.usableArea.width * this.monsterBackground.puzzleBackground.scale.x
            this.gridWrapper.height = this.monsterBackground.puzzleBackground.usableArea.height * this.monsterBackground.puzzleBackground.scale.y


            this.shopButtonsList.x = this.shopButtonsList.width
            this.shopButtonsList.y = 10

            this.shopButtonsList.scale.set(1.8)
            this.levelMeter.scale.set(1.3)

            // this.systemButtonList.w = 65 * this.systemsList.length
            // this.systemButtonList.h = 60
            // this.systemButtonList.updateHorizontalList()
            this.systemButtonList.w = 80
            this.systemButtonList.h = 65 * this.systemsList.length
            this.systemButtonList.updateVerticalList()

        } else {

            this.mergeSystemContainer.scale.set(1)

            this.levelMeter.scale.set(0.7)
            this.gridWrapper.width = config.width * this.areaConfig.gameArea.w
            this.gridWrapper.height = config.height * this.areaConfig.gameArea.h

            this.shopsLabel.x = this.shopButtonsList.x
            this.shopsLabel.y = this.shopButtonsList.y + 50 - this.shopsLabel.height
            this.shopsLabel.visible = false;

            this.systemButtonList.w = 80
            this.systemButtonList.h = 65 * this.systemsList.length
            this.systemButtonList.updateVerticalList()
        }


        this.shopsLabel.visible = false;
        this.statsList.y = 10
        this.statsList.x = toGlobalBack.x + 10

        this.helperButtonList.y = 80
        this.helperButtonList.x = toGlobalBack.x + 60


        if (!window.isPortrait) {

            this.statsList.scale.set(1.5)
            this.shopButtonsList.x = topRight.x - this.shopButtonsList.width / 2 - 20
            this.shopButtonsList.y = config.height - this.shopButtonsList.height - 20
            this.shopButtonsList.scale.set(1.5)

            this.systemButtonList.scale.set(1.5)
            this.systemButtonList.x = topRight.x - this.systemButtonList.width - 10
            this.systemButtonList.y = 70

            this.levelMeter.x = this.statsList.x + this.statsList.width + 20
            this.levelMeter.y = 20

        } else {


            this.levelMeter.x = this.gridWrapper.x - this.levelMeter.width / 2 + this.gridWrapper.width / 2
            this.levelMeter.y = 10//this.gridWrapper.y - this.levelMeter.height

            this.statsList.scale.set(1.25)

            this.systemButtonList.scale.set(1.1)
            this.systemButtonList.x = topRight.x - this.systemButtonList.width
            this.systemButtonList.y = 80

            this.shopButtonsList.x = topRight.x - this.shopButtonsList.width * 0.5 - 20
            this.shopButtonsList.y = this.systemButtonList.y + this.systemButtonList.height// this.shopButtonsList.height * 1.25
            this.shopButtonsList.scale.set(1)
        }


        this.uiPanels.forEach(element => {
            element.x = config.width / 2
            element.y = config.height / 2
        });

        this.systemsList.forEach(element => {
            element.resize(resolution, innerResolution, this.resourcesWrapperRight);
        });


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

    addHelpers() {
        this.helperButtonList = new UIList();
        this.helperButtonList.h = 350;
        this.helperButtonList.w = 60;
        this.speedUpToggle = new UIButton1(0x002299, 'fast_forward_icon')
        this.helperButtonList.addElement(this.speedUpToggle)
        this.speedUpToggle.onClick.add(() => {
            if (window.TIME_SCALE > 1) {
                window.TIME_SCALE = 1
            } else {
                window.TIME_SCALE = 30
            }

            TweenMax.globalTimeScale(window.TIME_SCALE)
        })

        this.clearData = new UIButton1(0x002299, 'icon_reset')
        this.helperButtonList.addElement(this.clearData)
        this.clearData.onClick.add(() => {
            COOKIE_MANAGER.wipeData()
        })

        this.addCash = new UIButton1(0x002299, 'coin')
        this.helperButtonList.addElement(this.addCash)
        this.addCash.onClick.add(() => {
            window.gameEconomy.addResources(
                8000000000000)
        })


        this.addRandomShip = new UIButton1(0x002299, 'vampire')
        this.helperButtonList.addElement(this.addRandomShip)
        this.addRandomShip.onClick.add(() => {
            this.mergeSystemMonsters.addShipBasedOnMax()
        })



        this.autoMergeToggle = new UIButton1(0x002299, 'auto-merge-icon')
        this.helperButtonList.addElement(this.autoMergeToggle)
        this.autoMergeToggle.onClick.add(() => {
            if (window.gameModifyers.modifyersData.autoMerge >= 2) {
                window.gameModifyers.modifyersData.autoMerge = 1
            }
            else {
                window.gameModifyers.modifyersData.autoMerge = 2
                //window.gameModifyers.updateModifyer('autoMerge')

            }
        })

        this.helperButtonList.updateVerticalList();
        this.container.addChild(this.helperButtonList)

        this.helperButtonList.visible = false
        this.helperButtonList.scale.set(0.85)
    }
}