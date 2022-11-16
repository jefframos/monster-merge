import * as PIXI from 'pixi.js';

import EnemySystem from '../systems/EnemySystem';
import EntityShop from '../shop/EntityShop';
import GameEconomy from '../GameEconomy';
import GameModifyers from '../GameModifyers';
import GeneralShop from '../shop/GeneralShop';
import MergeItemsShop from '../shop/MergeItemsShop';
import MergeSystem from '../systems/MergeSystem';
import MergerData from '../data/MergerData';
import ParticleSystem from '../../effects/ParticleSystem';
import ResourceSystem from '../systems/ResourceSystem';
import Screen from '../../../screenManager/Screen';
import SpaceBackground from '../effects/SpaceBackground';
import PuzzleBackground from '../effects/PuzzleBackground';
import CastleBackground from '../effects/CastleBackground';
import StandardPop from '../../popup/StandardPop';
import TweenMax from 'gsap';
import UIButton1 from '../../ui/UIButton1';
import utils from '../../../utils';
import UIList from '../../ui/uiElements/UIList';
import TimeBonusButton from '../../ui/TimeBonusButton';
import PrizeSystem from '../systems/PrizeSystem';
import OpenChestPopUp from '../../popup/OpenChestPopUp';
import SellAllPopUp from '../../popup/SellAllPopUp';
import StandardEnemy from '../enemy/StandardEnemy';
//import SpaceStation from '../../ui/SpaceStation';
import BonusConfirmation from '../../popup/BonusConfirmation';
import UILabelButton1 from '../../ui/UILabelButton1';

//import GameTutorial from '../tutorial/GameTutorial';
import BonusSystem from '../systems/BonusSystem';
import LevelMeter from '../ui/shop/LevelMeter';

export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);

        window.isPortrait = window.innerWidth < window.innerHeight

        // let a = ''
        // for (let index = 1; index <= 20; index++) {
        //     console.log(Math.pow(1.1, index * 0.5))

        //     a += (Math.pow(1.1, index * 0.5) + 0.28).toFixed(3) + ',\n'
        // }

        // console.log(a)

        window.baseConfigGame = PIXI.loader.resources['baseGameConfig'].data.baseGame;
        window.baseEntities = PIXI.loader.resources[window.baseConfigGame.entitiesData].data;
        window.baseEnemies = PIXI.loader.resources[window.baseConfigGame.entitiesData].data.mergeEntities.enemies;
        window.baseResources = PIXI.loader.resources[window.baseConfigGame.resourcesData].data;
        window.baseModifyers = PIXI.loader.resources[window.baseConfigGame.modifyersData].data;
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
            this.castleBackground = new CastleBackground();
            this.puzzleBackground = new PuzzleBackground();
            this.addChildAt(this.puzzleBackground, 0);
            this.addChildAt(this.castleBackground, 0);
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
        this.gridWrapper = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.gameArea.w, config.height * this.areaConfig.gameArea.h);
        this.container.addChild(this.gridWrapper);
        this.gridWrapper.visible = false;
        //this.gridWrapper.alpha = 0;

        this.resourcesWrapper = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.resourcesArea.w, config.height * this.areaConfig.resourcesArea.h);
        this.container.addChild(this.resourcesWrapper);
        this.resourcesWrapper.visible = false;
        //this.resourcesWrapper.alpha = 0;

        this.resourcesWrapperRight = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.resourcesArea.w, config.height * this.areaConfig.resourcesArea.h);
        this.container.addChild(this.resourcesWrapperRight);
        this.resourcesWrapperRight.visible = false;
        //this.resourcesWrapperRight.alpha = 0;

        this.mergeSystemContainer = new PIXI.Container()
        this.container.addChild(this.mergeSystemContainer);

        this.prizeContainer = new PIXI.Container()
        this.container.addChild(this.prizeContainer);


        this.resourcesContainer = new PIXI.Container()
        this.container.addChild(this.resourcesContainer);

        this.resourcesContainerRight = new PIXI.Container()
        this.container.addChild(this.resourcesContainerRight);


        this.enemiesContainer = new PIXI.Container()
        this.container.addChild(this.enemiesContainer);

        this.uiContainer = new PIXI.Container()
        this.container.addChild(this.uiContainer);

        this.bottomContainer = new PIXI.Container()
        this.container.addChild(this.bottomContainer);

        this.topContainer = new PIXI.Container()
        this.container.addChild(this.topContainer);


        this.dataTiles = []
        this.dataResourcesTiles = []

        this.allMergeData = [];
        this.rawModifyers = []
        for (let index = 0; index < window.baseModifyers.modifyers.length; index++) {
            let mergeData = new MergerData(window.baseModifyers.modifyers[index], index)


            mergeData.currentLevel = window.gameModifyers.getLevel(mergeData);
            console.log(window.baseModifyers.modifyers[index].type)
            mergeData.type = window.baseModifyers.modifyers[index].type
            mergeData.modifyerIcon = window.baseModifyers.modifyers[index].modifyerIcon
            this.rawModifyers.push(mergeData)
            this.allMergeData.push(mergeData)
        }


        this.rawMergeDataList = []
        for (let index = 0; index < window.baseEntities.mergeEntities.list.length; index++) {
            let mergeData = new MergerData(window.baseEntities.mergeEntities.list[index], index)
            mergeData.type = window.baseEntities.mergeEntities.list[index].type
            this.rawMergeDataList.push(mergeData)
            this.allMergeData.push(mergeData)
        }

        this.rawMergeResourceList = []
        this.allRawResources = []
        this.rawMergeResourceListRight = []
        for (let index = 0; index < window.baseResources.generators.length; index++) {
            let mergeData = new MergerData(window.baseResources.generators[index][0], index)
            if (index % 2 == 0) {
                mergeData.isRight = true;
                this.rawMergeResourceListRight.push(mergeData)
            } else {
                this.rawMergeResourceList.push(mergeData)
            }
            this.allRawResources.push(mergeData)
            this.allMergeData.push(mergeData)
        }

        this.mergeSystem1 = new MergeSystem({
            mainContainer: this.mergeSystemContainer,
            uiContainer: this.uiContainer,
            wrapper: this.gridWrapper,
            topContainer: this.topContainer,
        }, window.baseConfigGame, this.rawMergeDataList);
      

      
        this.addSystem(this.mergeSystem1)

        this.mergeSystem1.enemySystem = this.enemiesSystem;

        this.mergeSystem1.onParticles.add(this.addParticles.bind(this));
        this.mergeSystem1.onDealDamage.add(this.addDamageParticles.bind(this));
        this.mergeSystem1.onPopLabel.add(this.popLabel.bind(this));
        this.mergeSystem1.onGetResources.add(this.addResourceParticles.bind(this));

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

        this.rpsContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('grid1'), 20, 20, 20, 5)
        this.rpsContainer.width = this.statsList.w
        this.rpsContainer.height = 40
        this.rpsLabel = new PIXI.Text('', LABELS.LABEL1);
        this.rpsLabel.style.fontSize = 14
        this.rpsContainer.addChild(this.rpsLabel)
        this.statsList.addElement(this.rpsContainer)

        this.resourcesTexture = new PIXI.Sprite.from('coin-s')
        this.resourcesTexture.scale.set(this.rpsContainer.height / this.resourcesTexture.height * 0.5)
        this.resourcesTexture.x = -23
        this.resourcesTexture.y = -3
        this.rpsLabel.addChild(this.resourcesTexture)


        this.shardsCounter = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('grid1'), 20, 20, 20, 5)
        this.shardsCounter.width = this.statsList.w
        this.shardsCounter.height = 40

        this.shardsLabel = new PIXI.Text('0', LABELS.LABEL1);
        this.shardsLabel.style.fontSize = 14
        this.shardsCounter.addChild(this.shardsLabel)
        this.statsList.addElement(this.shardsCounter)

        this.shardsTexture = new PIXI.Sprite.from('shards')
        this.shardsLabel.addChild(this.shardsTexture)
        this.shardsTexture.scale.set(this.shardsCounter.height / this.shardsTexture.height * 0.5)
        this.shardsTexture.x = -23
        this.shardsTexture.y = -3


        this.statsList.updateVerticalList();

        this.particleSystem = new ParticleSystem();
        this.frontLayer.addChild(this.particleSystem)

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
                80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
                * 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
                * 400000000000000000000000)
        })


        this.addRandomShip = new UIButton1(0x002299, 'vampire')
        this.helperButtonList.addElement(this.addRandomShip)
        this.addRandomShip.onClick.add(() => {
            this.mergeSystem1.addShipBasedOnMax()
        })


        // this.autoCollectToggle = new UIButton1(0x002299, 'shards')
        // this.helperButtonList.addElement(this.autoCollectToggle)
        // this.autoCollectToggle.onClick.add(() => {
        //     window.gameModifyers.addShards(Math.max(10, window.gameModifyers.permanentBonusData.shards * 0.2));
        //     this.refreshToggles();

        // })

        this.autoMergeToggle = new UIButton1(0x002299, 'auto-merge-icon')
        this.helperButtonList.addElement(this.autoMergeToggle)
        this.autoMergeToggle.onClick.add(() => {
            if (window.gameModifyers.modifyersData.autoMerge >= 2) {                
                window.gameModifyers.modifyersData.autoMerge = 1
            }
            else{
                window.gameModifyers.modifyersData.autoMerge = 2
                //window.gameModifyers.updateModifyer('autoMerge')

            }
        })
        this.refreshToggles();

        this.helperButtonList.updateVerticalList();
        this.container.addChild(this.helperButtonList)

        this.helperButtonList.visible = false
        this.helperButtonList.scale.set(0.85)
        let buttonSize = 70
        this.shopButtonsList = new UIList();
        this.shopButtonsList.w = buttonSize;
        this.shopButtonsList.h = buttonSize * 2.5;
        //this.container.addChild(this.shopButtonsList)

        this.currentOpenPopUp = null;

        this.autoSpend = new UILabelButton1(80, 40, 'large-square-pattern-green');
        //this.container.addChild(this.autoSpend)
        this.autoSpend.addCenterLabel(window.localizationManager.getLabel('auto-buy'), 0xffffff, 0.9)

        this.shopsLabel = new PIXI.Text(window.localizationManager.getLabel('shops'), LABELS.LABEL1);
        this.container.addChild(this.shopsLabel)
        this.shopsLabel.style.fontSize = 24
        this.shopsLabel.style.stroke = 0x002299
        this.shopsLabel.style.strokeThickness = 6

        this.openSettingsShop = new UIButton1(0x002299, 'stationIcon', 0xFFFFFF, buttonSize, buttonSize)
        this.openSettingsShop.updateIconScale(0.75)
        this.openSettingsShop.addBadge('icon_increase')
        this.openSettingsShop.newItem = new PIXI.Sprite.fromFrame('new_item')
        this.openSettingsShop.newItem.scale.set(0.7)
        this.openSettingsShop.newItem.anchor.set(0)
        this.openSettingsShop.newItem.position.set(-buttonSize / 2)
        this.openSettingsShop.newItem.visible = false;
        this.openSettingsShop.addChild(this.openSettingsShop.newItem)
        this.shopButtonsList.addElement(this.openSettingsShop)
        this.openSettingsShop.onClick.add(() => {
            this.openPopUp(this.generalShop)
        })

        // this.openShop = new UIButton1(0x002299, 'asteroid (2)', 0xFFFFFF, buttonSize, buttonSize)
        // this.openShop.addBadge('icon_increase')
        // this.openShop.updateIconScale(0.75)
        // this.openShop.newItem = new PIXI.Sprite.fromFrame('new_item')
        // this.openShop.newItem.scale.set(0.7)
        // this.openShop.newItem.anchor.set(0)
        // this.openShop.newItem.position.set(-buttonSize / 2)
        // this.openShop.newItem.visible = false;
        // this.openShop.addChild(this.openShop.newItem)
        // this.shopButtonsList.addElement(this.openShop)
        // this.openShop.onClick.add(() => {
        //     this.openPopUp(this.entityShop)
        // })

//36  72 - 120 - 180

//500 - 600 - 720 - 864 - 1040
//1250 - 1500 - 1800 - 2160
//3130 - 3750 - 4500 - 5400
// 7820
//19530



//1040 ?? - 1240 - 1490
//2160 * 3
//6480 * 3
//16200 * 3

//every merge gain the id number of points
        // GameHandler.prototype.calculateCurrencyPerSec = function() {
        //     var e = 0;
        //     this.entity.children.forEach((function(t) {
        //         t.enabled && t.script.has("buildingHandler") && (e += Math.pow(2, t.script.buildingHandler.level + 1))
        //     }
        //     )),
        //     this.currencyPerSec = Math.round(e / 3)
        // }

        // GameHandler.prototype.onExperience = function(e, t) {
        //     this.experienceBar.script.barHandler.changeValues(e, this.remainder),
        //     e >= this.remainder && (this.experience = e - this.remainder,
        //     this.level = pc.math.clamp(this.level + 1, 1, this.maxLevel))
        // }
        // ,
        // GameHandler.prototype.onLevel = function(e, t) {
        //     var i = this;
        //     this.entity.children.forEach((function(t) {
        //         t.name == "Slot_" + (e + 5) && (t.enabled = !0,
        //         i.scaleCamera())
        //     }
        //     )),
        //     this.remainder = e < 6 ? 6 * (e + 1) * (e + 1) - 6 * (e + 1) : e < 7 ? 5 * (e + 1) * (e + 1) - 5 * (e + 1) : e < 8 ? 4 * (e + 1) * (e + 1) - 4 * (e + 1) : e < 9 ? 3 * (e + 1) * (e + 1) - 3 * (e + 1) : e < 10 ? 2 * (e + 1) * (e + 1) - 2 * (e + 1) : (e + 1) * (e + 1) - (e + 1),
        //     this.levelTxt.element.text = e,
        //     this.experienceBar.script.barHandler.changeValues(this.experience, this.remainder),
        //     e != t && (6 == e ? this.levelPopUpWorld.enabled = !0 : this.levelPopUp.enabled = !0,
        //     PokiSDK.happyTime(pc.math.clamp(this.level / 10), 0, 1)),
        //     this.shopHandler.script.worldHandler.updateWorlds()
        // }

window.getCurrency = function(e){
    let a = Math.pow(2, e)
    console.log(a)
}

window.getLevels = function(e){
    let a = e < 6 ? 6 * (e + 1) * (e + 1) - 6 * (e + 1) : e < 7 ? 5 * (e + 1) * (e + 1) - 5 * (e + 1) : e < 8 ? 4 * (e + 1) * (e + 1) - 4 * (e + 1) : e < 9 ? 3 * (e + 1) * (e + 1) - 3 * (e + 1) : e < 10 ? 2 * (e + 1) * (e + 1) - 2 * (e + 1) : (e + 1) * (e + 1) - (e + 1)
    console.log(a)
}

window.getPrices = function(e){
    let s = 50;
    for (let index = 0; index < e; index++) {
        s *= 2.5        
    }
    s = Math.floor(s)
    console.log(s * 10)
}
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
            this.openPopUp(this.mergeItemsShop)
        })

        this.shopButtonsList.updateVerticalList();

        window.TIME_SCALE = 1

        this.uiPanels = []

        // this.entityShop = new EntityShop([this.resourceSystem, this.resourceSystemRight]);
        // this.uiLayer.addChild(this.entityShop);
        // this.entityShop.hide();


        // this.entityShop.addItems(this.allRawResources)

        this.mergeItemsShop = new MergeItemsShop([this.mergeSystem1])
        this.uiLayer.addChild(this.mergeItemsShop);
        this.mergeItemsShop.addItems(this.rawMergeDataList)
        this.mergeItemsShop.hide();

        this.generalShop = new GeneralShop()
        this.uiLayer.addChild(this.generalShop);
        this.generalShop.addItems(this.rawModifyers)
        this.generalShop.hide();
        this.generalShop.onPurchase.add(() => {
            this.mergeSystem1.findAllAutomerges();
            this.mergeSystem1.updateAllData();
        });

        this.standardPopUp = new StandardPop('any', this.screenManager)
        this.uiLayer.addChild(this.standardPopUp)

        this.bonusPopUp = new BonusConfirmation('bonus', this.screenManager)
        this.uiLayer.addChild(this.bonusPopUp)

        this.openChestPopUp = new OpenChestPopUp('chest', this.screenManager)
        this.uiLayer.addChild(this.openChestPopUp)


        this.sellAllPopUp = new SellAllPopUp('sell', this.screenManager)
        this.uiLayer.addChild(this.sellAllPopUp)


        //this.uiPanels.push(this.entityShop)
        this.uiPanels.push(this.mergeItemsShop)
        this.uiPanels.push(this.generalShop)
        this.uiPanels.push(this.standardPopUp)
        this.uiPanels.push(this.bonusPopUp)
        this.uiPanels.push(this.openChestPopUp)
        this.uiPanels.push(this.sellAllPopUp)

        // this.entityShop.onPossiblePurchase.add((canBuy) => {
        //     this.openShop.newItem.visible = canBuy;
        // })
        this.mergeItemsShop.onPossiblePurchase.add((canBuy) => {
            this.openMergeShop.newItem.visible = canBuy;
        })
        this.generalShop.onPossiblePurchase.add((canBuy) => {
            this.openSettingsShop.newItem.visible = canBuy;
        })
        //this.openPopUp(this.generalShop)

        this.sumStart = 0;
        this.savedResources = COOKIE_MANAGER.getResources();
        this.allRawResources.forEach(element => {
            if (this.savedResources.entities[element.rawData.nameID]) {
                let saved = this.savedResources.entities[element.rawData.nameID];
                let time = saved.latestResourceAdd - saved.latestResourceCollect
                if (time < 0) {
                    time = 0.1
                }
                this.sumStart += time * element.getRPS();

                //console.log(this.sumStart, element.getRPS(), time)
            }
        });


        this.shopButtonsList.updateVerticalList();
        this.savedEconomy = COOKIE_MANAGER.getEconomy();

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


        this.levelMeter = new LevelMeter();
        this.uiLayer.addChild(this.levelMeter)
        // this.spaceStation = new SpaceStation()
        // //this.container.addChild(this.spaceStation);
        // this.spaceStation.onParticles.add(this.addParticles.bind(this))
        // this.spaceStation.scale.set(0.55)
        // this.spaceStation.addCallback(() => {

        //     var shards = this.getShardBonusValue()
        //     this.openPopUp(this.sellAllPopUp, { shards, onConfirm: this.resetAll.bind(this) })
        //     //this.resetAll();
        // })


        this.resetWhiteShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(-config.width * 4, -config.height * 4, config.width * 8, config.height * 8);
        this.addChild(this.resetWhiteShape);
        this.resetWhiteShape.visible = false;
        //this.mergeItemsShop.show()

        this.tutorialStep = window.COOKIE_MANAGER.getStats().tutorialStep;


        // this.gameTutorial = new GameTutorial(this)
        // if (this.tutorialStep == 0) {
        //     if (window.gameEconomy.currentResources > 10) {
        //         COOKIE_MANAGER.endTutorial(2);
        //     } else {

        //         this.startTutorial();
        //         this.addChild(this.gameTutorial);
        //     }
        // }


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
            this.mergeSystem1.addShipBasedOnMax(prizes.ship)
        }
    }
    getShardBonusValue() {
        let progression = COOKIE_MANAGER.getProgression()

        let coef = 1.008
        return Math.pow(Math.pow(coef, 7), Math.max(progression.currentEnemyLevel - 100, 1)) + window.gameModifyers.permanentBonusData.shards * 0.25;
    }
    resetAll(shardsTotal) {

        this.resetWhiteShape.visible = true;
        this.resetWhiteShape.alpha = 1
        TweenMax.to(this.resetWhiteShape, 1, {
            delay: 0.5, alpha: 0, onComplete: () => {
                this.resetWhiteShape.visible = false;
            }
        })
        let progression = COOKIE_MANAGER.getProgression()
        let shards = 10;

        let dps = Math.max(1, this.mergeSystem1.dps * 0.01) / (2000 / (progression.currentEnemyLevel + 1))
        let res = 1//Math.max(1, window.gameEconomy.currentResources)

        shards = shardsTotal//this.getShardBonusValue()
        shards = Math.max(shards, 10)

        window.gameEconomy.resetAll();
        COOKIE_MANAGER.resetProgression();
        window.gameModifyers.resetModifyers();

        this.systemsList.forEach(element => {
            if (element.resetSystem) {
                element.resetSystem()
            }
        });
        this.allMergeData.forEach(element => {
            element.reset();
        });
        COOKIE_MANAGER.resetProgression();
        window.gameEconomy.resetAll();


        window.gameEconomy.addResources(4)
        //window.gameModifyers.permanentBonusData.shards        

        window.gameModifyers.addShards(Math.round(shards));
        this.particleSystem.killAll();
        this.forcePauseSystemsTimer = 0.5;

        for (let index = 0; index < 8; index++) {
            setTimeout(() => {
                let toLocal = this.particleSystem.toLocal({ x: config.width / 2, y: config.height / 2 })
                let customData = {};
                customData.texture = 'shards'
                customData.scale = 0.02 + Math.random() * 0.01
                customData.gravity = 200
                customData.alphaDecress = 0
                let coinPosition = this.shardsTexture.parent.getGlobalPosition();
                let toLocalTarget = this.particleSystem.toLocal(coinPosition)

                customData.target = { x: toLocalTarget.x, y: toLocalTarget.y, timer: 0.2 + Math.random() * 0.75 }
                this.particleSystem.show(toLocal, 1, customData)
            }, 20 * index);
        }

        setTimeout(() => {
            this.systemsList.forEach(element => {
                if (element.resetSystem) {
                    element.resetSystem()
                }
            });
            this.allMergeData.forEach(element => {
                element.reset();
            });
        }, 10);

    }
    refreshToggles() {
        let toggleValue = window.gameModifyers.modifyersData.autoCollectResource

        // if (toggleValue) {
        //     this.autoCollectToggle.enableState();
        // } else {
        //     this.autoCollectToggle.disableState();
        // }
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
    addResourceParticles(targetPosition, customData, totalResources, quantParticles, showParticles = true) {
        window.gameEconomy.addResources(totalResources)

        this.popLabelDamage(targetPosition, utils.formatPointsLabel(totalResources))
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

        if (showParticles) {
            //this.particleSystem.popLabel(toLocal, "+" + utils.formatPointsLabel(totalResources), 0, 1, 1, LABELS.LABEL1)
        }
    }
    onMouseMove(e) {

        if (this.currentOpenPopUp && this.currentOpenPopUp.visible) {
            return;
        }

        this.mergeSystem1.updateMouseSystems(e)
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

            this.mergeSystem1.updateSystems(delta)
            this.particleSystem.update(delta)
        }
        // this.mergeSystem1.update(delta);

        this.uiPanels.forEach(element => {
            if (element.update) {
                element.update(delta)
            }
        });


        this.rpsLabel.text = utils.formatPointsLabel(window.gameEconomy.currentResources);
        utils.centerObject(this.rpsLabel, this.rpsContainer)
        this.rpsLabel.x = 30

        this.shardsLabel.text = 'x ' + utils.formatPointsLabel(window.gameModifyers.permanentBonusData.shards);
        utils.centerObject(this.shardsLabel, this.shardsCounter)
        this.shardsLabel.x = 30

        this.timestamp = (Date.now() / 1000 | 0);

        if (this.puzzleBackground) {

            this.puzzleBackground.update(delta)
        }
        if (this.castleBackground) {

            this.castleBackground.update(delta)
        }

    }
    resize(resolution, innerResolution) {
        if (!resolution || !resolution.width || !resolution.height || !innerResolution) {
            return;
        }
        window.isPortrait = innerResolution.width < innerResolution.height

        //console.log(resolution.width * this.screenManager.scale.x)
        var newRes = { width: resolution.width * this.screenManager.scale.x }
        if (this.puzzleBackground) {

            this.puzzleBackground.resize(resolution, this.screenManager.scale);

            this.puzzleBackground.x = config.width / 2
            this.puzzleBackground.y = config.height / 2 - 100
        }
        if (this.castleBackground) {

            this.castleBackground.resize(resolution, this.screenManager.scale);

            this.castleBackground.x = config.width / 2
            this.castleBackground.y = config.height / 2 - 150
        }


        this.levelMeter.y = this.castleBackground.y
        var toGlobal = this.toLocal({ x: 0, y: innerResolution.height })

        this.gridWrapper.x = config.width / 2 - this.gridWrapper.width / 2
        this.gridWrapper.y = config.height * (1 - this.areaConfig.bottomArea) - this.gridWrapper.height

        // if (this.helperButtonList.visible) {

        //     this.statsList.y = config.height - 240
        // } else {
        //     this.statsList.y = config.height - this.statsList.h - 20

        // }
        // this.statsList.x = config.width - this.statsList.w
        // this.statsList.y = 150

        if (!window.isPortrait) {
            this.statsList.scale.set(1)

            var toGlobalBack = this.toLocal({ x: 0, y: innerResolution.height })

            this.puzzleBackground.x = toGlobalBack.x + 390
            this.puzzleBackground.y = 200
            this.puzzleBackground.scale.set(1.3)

            let resF = (innerResolution.width - 500)
            let castScale = resF / 500
            castScale = Math.min(castScale, 1.8)
            castScale = Math.max(castScale, 0.4)
            this.castleBackground.scale.set(castScale)
            this.castleBackground.x = this.puzzleBackground.x + 450 + resF/2
            //this.castleBackground.x = this.puzzleBackground.x +( 800 * castScale )
           // this.castleBackground.x = Math.max(this.castleBackground.x, this.puzzleBackground.x + 500)
            //this.castleBackground.x = Math.min(this.castleBackground.x, this.puzzleBackground.x + 1000)
            this.castleBackground.y = toGlobalBack.y + 20
            
            this.gridWrapper.x = toGlobalBack.x + 50
            this.gridWrapper.y= 200
            
            this.gridWrapper.width = config.width * 1.15
            this.gridWrapper.height = config.height * 0.7
            

            this.levelMeter.x = toGlobalBack.x + 10
            this.levelMeter.y = 140

            this.levelMeter.scale.set(1.3)

            // this.spaceStation.x = this.resourcesWrapper.x + 180;
            // this.spaceStation.y = this.resourcesWrapper.y + 150;
            
        } else {
            this.statsList.scale.set(1.1)
            this.puzzleBackground.scale.set(1)
            this.mergeSystemContainer.scale.set(1)
            this.castleBackground.scale.set(1)
            this.levelMeter.scale.set(1)
            this.levelMeter.x = 0
            this.gridWrapper.width = config.width * this.areaConfig.gameArea.w
            this.gridWrapper.height = config.height * this.areaConfig.gameArea.h

            // this.spaceStation.x = this.resourcesWrapper.x + 50;
            // this.spaceStation.y = this.resourcesWrapper.y + 40;
        }
        



        this.statsList.x = config.width - 110
        this.statsList.y = 10
        this.shopButtonsList.x = this.shopButtonsList.width
        this.shopButtonsList.y = 60

        this.shopsLabel.x = this.shopButtonsList.x
        this.shopsLabel.y = this.shopButtonsList.y + 50 - this.shopsLabel.height
        this.shopsLabel.visible = false;

        this.autoSpend.x = this.shopButtonsList.x - this.autoSpend.width - 50
        this.autoSpend.y = this.shopButtonsList.y - 45
        this.helperButtonList.x = config.width  - 30
        this.helperButtonList.y = 120


        this.enemiesContainer.x = config.width / 2;
        this.enemiesContainer.y = config.height * this.areaConfig.topArea * 0.5;

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
}