import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import Screen from '../../screenManager/Screen'

import InGameEffects from '../effects/InGameEffects'
import CatPawn from '../elements/CatPawn'
import InGameCatPawn from '../elements/InGameCatPawn'
import Environment from '../elements/Environment'
import Cat from '../elements/Cat'
import GameItem from '../elements/GameItem'
import waypoints from './waypoints'
import HUD from '../ui/HUD'

export default class GameScreen extends Screen
{
    constructor(label)
    {
        super(label);

        PAWN.width = PAWN.height = config.width * 0.075
        this.inGameEffects = new InGameEffects(this);

        window.COLORS = [0x6699FF, 0x00FF33, 0xFF9900, 0xFF66FF, 0x78c5d5]
            // window.COLORS = [0x78c5d5, 0xc5d747, 0xf18c32, 0xbf63a6, 0x78c5d5]
        this.gameContainer = new PIXI.Container();
        this.environmentContainer = new PIXI.Container();
        this.catsContainer = new PIXI.Container();
        this.frontCats = new PIXI.Container();
        this.particlesContainer = new PIXI.Container();
        this.UIContainer = new PIXI.Container();



        this.vignette = new PIXI.Sprite.from('vignette'); //new PIXI.Sprite(PIXI.Texture.from('vignette.png'));
        this.UIContainer.addChild(this.vignette);

        this.vignette.anchor.set(0.5);
        this.vignette.x = config.width / 2;
        this.vignette.y = config.height / 2;
        this.vignette.scale.set(1.1);

        this.HUD = new HUD(this);
        this.UIContainer.addChild(this.HUD);
        this.HUD.onForceGameOver.add(this.gameOver.bind(this));
        this.HUD.onStartAction.add(this.addAction.bind(this));
        this.HUD.onFinishAction.add(this.killAction.bind(this));


        // this.vignette.width = config.width;
        // this.vignette.height = config.height;
        this.environment = new Environment(this);
        this.environmentContainer.addChild(this.environment);

        this.addChild(this.gameContainer);
        this.gameContainer.addChild(this.environmentContainer);
        this.gameContainer.addChild(this.catsContainer);
        this.gameContainer.addChild(this.frontCats);
        this.gameContainer.addChild(this.particlesContainer);


        this.addChild(this.UIContainer);

        this.particlesList = [];
        this.scaleableElements = [];

        this.updateable = false;
        this.interactive = true;


        this.spawnPointsMiddle = [];
        this.spawnPoints = [];
        this.catPawns = [];
        this.catList = [];
        this.lanes = [];
        this.gameItens = [];


        //add paws
        let tot = 4;
        this.angleAdjust = 0.4;
        this.angleDiff = (Math.PI / 2 - this.angleAdjust) / (tot - 1);
        this.area = {
            width: config.height * 0.3,
            height: config.height * 0.3,
        }
        for (var i = 0; i < tot; i++)
        {
            let catPawn = new InGameCatPawn();
            let ang = this.angleDiff * i + this.angleAdjust / 2
            this.environmentContainer.addChild(catPawn)
            catPawn.x = config.width - Math.cos(this.angleDiff * i + this.angleAdjust / 2) * this.area.width;
            catPawn.y = config.height - Math.sin(this.angleDiff * i + this.angleAdjust / 2) * this.area.height;
            catPawn.rotation = ang - Math.PI / 2;
            catPawn.lane = i;
            catPawn.alpha = 0;
            this.catPawns.push(catPawn);
            this.scaleableElements.push(catPawn);
            this.lanes.push([]);
        }


        this.environment.addWaypoints(waypoints, this.area);


        //control perspective
        this.scaleFactor = {
            min: 0.15,
            max: 1.2
        }
        this.updateScales();
        this.environment.drawLines();

        this.gameTimer = 0;

        this.timeToNextStandard = 1.1;
        this.timeToNext = this.timeToNextStandard;

        this.currentPoints = 0;
        this.currentDeadCats = 0;

        this.gameTimeScale = 1;

        this.scaleSound();
        // SOUND_MANAGER.setRateOnLoops(this.gameTimeScale * this.actionMultiplier);
        // window.addEventListener(
        //     "keydown", this.addSpecialMode.bind(this), false
        //     // "keydown", this.gameOver.bind(this), false
        // );

        this.catLanesList = [];

        for (var i = 0; i < GAME_DATA.catsData.length; i++)
        {
            this.catLanesList.push(0);
        }

        this.environment.hideLines(true);


    }

    onAdded()
    {
        this.screenManager.prizeContainer.onPrizeCollected.add(this.hidePrizeContainer.bind(this));
        this.screenManager.askVideoContainer.onConfirm.add(this.onConfirmOffer.bind(this));
        this.screenManager.askVideoContainer.onCancel.add(this.hidePrizeContainer.bind(this));
    }
    build(param)
    {
        super.build();
        this.addEvents();
    }
    hidePrizeContainer()
    {
        this.isPaused = false;
    }
    openOfferVideoCallback()
    {
        FBInstant.logEvent(
            'in_game_chest',
            1,
            {
                type: 'accept',
            },
        );
        this.screenManager.closeVideo();
        this.doublePoints = 3;

        this.addSpecialMode();
        this.isPaused = false;
        // this.screenManager.prizeContainer.show(3);
    }
    offerPrize()
    {
        FBInstant.logEvent(
            'in_game_chest',
            1,
            {
                type: 'offer',
            },
        );

        this.screenManager.showAskVideo();
        this.isPaused = true;
        // this.onConfirmOffer();
    }
    onConfirmOffer()
    {
        this.screenManager.loadVideo(this.openOfferVideoCallback.bind(this), null, 'in_game_chest');
        this.isPaused = true;
    }
    scaleSound()
    {
        this.actionSpeed = this.actionSpeed || 1;
        this.gameTimeScale = this.gameTimeScale || 1;

        SOUND_MANAGER.setRateOnLoops(this.gameTimeScale * this.actionSpeed);
    }
    removeAutoCollectMode()
    {
        if (!this.isAutoCollectMode)
        {
            return
        }

        this.killAfterSpecial();
        this.inGameEffects.removeDoublePoints();
        this.environment.removeSpecialBackground();
        this.HUD.enableAutoCollectAction();

        TweenLite.to(this, 1,
        {
            gameTimeScale: 1,
            onUpdate: () =>
            {
                this.scaleSound();
            }
        });
        this.isAutoCollectMode = false;
        this.isSpecialMode = false;

        // this.doublePoints = 0;

        this.specialTimer = 0;
        this.specialAcc = 0;

        this.autoCollectTimer = 0;
        // this.specialAcc = 0;

        this.updateSpecialBar();
    }
    killAllActions()
    {
        this.HUD.killAllActions();


        for (var i = this.currentActions.length - 1; i >= 0; i--)
        {
            this.killAction(this.currentActions[i])
                // this[this.currentActions[i].var] = this.currentActions[i].default;
        }
        this.currentActions = [];

        this.inGameEffects.removeAutocollectlModeItem();
        this.inGameEffects.removeSpeedUpModeItem();

    }
    killAction(actionData)
    {
        for (var i = this.currentActions.length - 1; i >= 0; i--)
        {
            if (this.currentActions[i].type == actionData.type)
            {
                this.currentActions.splice(i, 1);
                break;
            }
        }
        this[actionData.var] = actionData.default;

        if (actionData.var == 'actionAutoCollect')
        {
            this.inGameEffects.removeAutocollectlModeItem();
            this.environment.removeSpecialBackground();
        }

        if (actionData.var == 'actionSpeed')
        {
            this.inGameEffects.removeSpeedUpModeItem();

        }

        this.scaleSound();


        // this.HUD.updateActionList();
    }
    addAction(actionData)
    {
        for (var i = this.currentActions.length - 1; i >= 0; i--)
        {
            if (this.currentActions[i].type == actionData.type)
            {
                return false;
            }
        }

        let leveldActionData = GAME_DATA.getActionStats(actionData);

        this.currentActions.push(actionData);

        FBInstant.logEvent(
            'gameplay_action',
            1,
            {
                type: actionData.type,
            },
        );

        if (actionData.var == 'actionAutoCollect')
        {
            this.inGameEffects.addAutocollectlModeItem();
            this.environment.specialBackground();
            TweenLite.to(this, 0.25,
            {
                gameTimeScale: 0,
                onUpdate: () =>
                {
                    this.scaleSound();
                }
            });
            TweenLite.to(this, 1,
            {
                delay: 0.5,
                gameTimeScale: 1,
                onUpdate: () =>
                {
                    this.scaleSound();
                }
            });

            this[actionData.var] = leveldActionData.value;
            // TweenLite.to(this, 1,
            // {
            //     delay: 0,
            // });
        }
        else if (actionData.var == 'actionSpeed')
        {
            this.inGameEffects.speedUpModeItem();
            TweenLite.to(this, 0.5,
            {
                [actionData.var]: leveldActionData.value,
                onUpdate: () =>
                {
                    this.scaleSound();
                }
            });
        }
        else
        {
            this[actionData.var] = leveldActionData.value;

        }

        // this.HUD.updateActionList();
    }
    resetActionsVariables()
    {
        this.actionAutoCollect = false;
        this.actionMultiplier = 1;
        this.actionSpeed = 1;
        this.currentActions = [];
    }
    updateAutoCollectBar()
    {

        if (this.isAutoCollectMode)
        {
            this.HUD.updatePowerBar(this.autoCollectTimer / this.autoCollectTimerMax, 2);
        }
    }
    addAutoCollectMode()
    {
        // if (this.isSpecialMode)
        // {
        // }
        if (this.isAutoCollectMode)
        {
            this.autoCollectTimer = this.autoCollectTimerMax;
            return
        }
        this.inGameEffects.addDoublePoints();
        this.HUD.disableAutoCollectAction();
        this.isSpecialMode = false;
        this.specialTimer = 0;
        // this.specialAcc = 0;

        // this.doublePoints = 2;

        TweenLite.to(this, 0.5,
        {
            gameTimeScale: 0,
            onUpdate: () =>
            {
                this.scaleSound();
            }
        });
        TweenLite.to(this, 1,
        {
            delay: 1.5,
            gameTimeScale: 1.5,
            onUpdate: () =>
            {
                this.scaleSound();
            }
        });

        this.inGameEffects.autocollectlMode();
        this.environment.specialBackground();
        this.isAutoCollectMode = true;
        this.autoCollectTimer = this.autoCollectTimerMax;
    }
    updateSpecialBar(force)
    {
        if (this.specialAcc < 0)
        {
            this.specialAcc = 0;
        }
        this.HUD.updatePowerBar(this.specialAcc, 0, force);
    }
    addSpecialMode()
    {
        if (this.isSpecialMode)
        {
            return
        }

        this.inGameEffects.addDoublePoints();
        // this.killAfterSpecial();
        this.gameTimeScale = 0;
        TweenLite.to(this, 1,
        {
            delay:0.75,
            gameTimeScale: 1,
            onUpdate: () =>
            {
                this.scaleSound();
            }
        });
        // this.inGameEffects.specialMode();
        this.environment.specialBackground();
        this.isSpecialMode = true;
        this.specialTimer = this.specialTimerMax;

    }
    removeSpecialMode()
    {
        if (!this.isSpecialMode)
        {
            return
        }

        this.inGameEffects.removeDoublePoints();
        // this.killAfterSpecial();
        this.environment.removeSpecialBackground();

        // TweenLite.to(this, 1,
        // {
        //     gameTimeScale: 1,
        //     onUpdate: () =>
        //     {
        //         this.scaleSound();
        //     }
        // });
        this.isSpecialMode = false;
        this.specialTimer = 0;
        // this.specialAcc = 0;


    }
    addCat(lane = -1)
    {
        let cat;
        lane = lane >= 0 ? lane : Math.floor(this.spawnPoints.length * Math.random());
        if (CATS_POOL.length)
        {
            cat = CATS_POOL[0];
            CATS_POOL.shift();
        }
        if (!cat)
        {
            cat = new Cat(this);
        }

        cat.reset(lane, GAME_DATA.getAllowedCatsData());
        this.catsContainer.addChildAt(cat, 0);
        cat.x = this.spawnPoints[lane].x;
        cat.y = this.spawnPoints[lane].y;
        // cat.lane = lane;
        let wayps = []
        wayps.push(this.spawnPoints[lane])
        for (var i = 0; i < this.spawnPointsMiddle.length; i++)
        {
            wayps.push(this.spawnPointsMiddle[i][lane]);
        }
        wayps.push(this.catPawns[lane])
            // cat.setWaypoints(wayps);
        cat.setWaypoints(this.environment.lanesWaypoints[lane]);
        cat.onDie.add((cat, forced) =>
        {
            if (!forced)
            {
                this.missCat(cat);
            }
        });
        this.catList.push(cat);
        this.scaleableElements.push(cat);

        this.lanes[lane].push(cat);

        return cat;

    }

    resetGame(startWithBonus = false)
    {
        GAME_DATA.startNewRound();

        SOUND_MANAGER.stopAll();
        SOUND_MANAGER.playLoopOnce('spacecat_game_music')

        this.start();
        this.resetActionsVariables();
        this.gameSpeed = 1;
        this.gameTimeScale = 1;
        this.timeToNext = 1;
        this.timerSin = 0;
        this.currentPoints = 0;
        this.currentDeadCats = GAME_DATA.maxLife;
        this.catLanesList = [];
        this.HUD.updateActionList();
        this.HUD.updateHUD(this.currentPoints, this.currentDeadCats);
        this.specialAcc = 0;
        this.specialTimer = 0;
        this.specialTimerMax = 15;

        this.autoCollectTimer = 0;
        this.autoCollectTimerMax = 20;

        // this.doublePoints = 0;
        // this.doublePointsTimer = 0;

        this.itemTimerMax = 18;
        this.itemTimer = this.itemTimerMax;

        for (var i = 0; i < GAME_DATA.catsData.length; i++)
        {
            this.catLanesList.push(0);
        }
        for (var i = 0; i < this.catPawns.length; i++)
        {
            TweenLite.to(this.catPawns[i], 0.5,
            {
                alpha: 1
            });
        }
        this.gameItens = [];
        this.environment.showLines();
        this.HUD.startGame();
        this.updateSpecialBar(true);


        if (startWithBonus)
        {
            this.doublePoints = 2;
            this.gameTimeScale = 0;
            this.isPaused = true;
            setTimeout(() =>
            {
                this.addAutoCollectMode();
                this.addSpecialMode();
                this.isPaused = false;
            }, 750);

            for (var i = 0; i < 12; i++)
            {
                let cat = this.addCat();
                cat.forceToWaypoint(i)
            }
            this.updateScales();
        }
        else
        {
            for (var i = 0; i < 4; i++)
            {
                let cat = this.addCat();
                cat.forceToWaypoint(i + 5)
            }
        }

        TweenLite.killTweensOf(this)

        FBInstant.logEvent(
            'gameplay',
            1,
            {
                type: 'reset',
            },
        );

        // console.log(this.gameSpeed, this.actionSpeed, 'START SPEED');
        this.scaleSound();

    }
    updateScales()
    {
        for (var i = 0; i < this.scaleableElements.length; i++)
        {
            if (!this.scaleableElements[i].noScalable)
            {
                let percentage = this.scaleableElements[i].y / config.height * (this.scaleFactor.max - this.scaleFactor.min) + this.scaleFactor.min
                if (this.scaleableElements[i].speedScale)
                {
                    this.scaleableElements[i].speedScale(percentage);
                }
                this.scaleableElements[i].scale.set(percentage)
            }
        }
    }
    removeFromLane(cat)
    {
        for (var i = this.lanes[cat.lane].length - 1; i >= 0; i--)
        {
            if (this.lanes[cat.lane][i] == cat)
            {
                this.lanes[cat.lane].splice(i, 1);
                return;
            }
        }
    }
    gameOver()
    {
        this.environment.hideLines();
        if (this.currentItem)
        {
            this.currentItem.kill = true;
            if (this.currentItem.parent)
            {
                this.currentItem.parent.removeChild(this.currentItem);
            }
        }
        if (this.currentGiftBox)
        {
            this.currentGiftBox.kill = true;
            if (this.currentGiftBox.parent)
            {
                this.currentGiftBox.parent.removeChild(this.currentGiftBox);
            }
        }
        this.removeAutoCollectMode();
        this.removeSpecialMode();
        // this.removeSpecialBackground();
        this.gameStarted = false;
        this.killAllActions();
        this.killAll();
        TweenLite.killTweensOf(this)

        this.HUD.hide();
        for (var i = 0; i < this.catPawns.length; i++)
        {
            TweenLite.to(this.catPawns[i], 0.5,
            {
                alpha: 0
            });
        }

        this.screenManager.coinsExplosion.killAll()
            // GAME_DATA.addCats(this.catLanesList);
        setTimeout(() =>
        {
            this.screenManager.showPopUp('gameover',
            {
                catsList: this.catLanesList,
                points: this.currentPoints
            });
        }, 1000);
        this.resetActionsVariables();
        this.scaleSound();

    }
    killAfterSpecial()
    {
        for (var i = Math.floor(this.catList.length * 0.5); i >= 0; i--)
        {
            this.removeFromLane(this.catList[i]);
            this.catList[i].destroy(true);
        }
        // this.catList = [];
    }
    killAll()
    {
        for (var i = this.catList.length - 1; i >= 0; i--)
        {
            this.removeFromLane(this.catList[i]);
            this.catList[i].destroy(true, i < 5);
        }
        // this.catList = [];
    }
    start()
    {
        this.gameStarted = true;
    }
    update(delta)
    {
        if (this.isPaused)
        {
            return
        }
        delta *= this.gameTimeScale;
        if (this.actionSpeed)
        {
            delta *= this.actionSpeed;

            // console.log(this.actionSpeed, this.gameTimeScale);
        }
        this.gameTimer += delta;
        if (this.gameStarted)
        {
            // console.log(this.actionSpeed);
            if (this.gameTimer >= (this.timeToNext * this.gameSpeed))
            {
                this.gameTimer = 0;
                this.addCat();
            }

            this.timerSin += 0.01;

            this.timeToNext = this.timeToNextStandard + Math.sin(this.timerSin) * 0.1

            // console.log(this.specialAcc)
                // //console.log(this.timeToNext);
            if (this.isAutoCollectMode)
            {
                if (this.autoCollectTimer <= 0)
                {
                    this.removeAutoCollectMode();
                }
                else
                {
                    this.autoCollectTimer -= delta;
                    this.updateAutoCollectBar();
                }
            }
            else
            {
                if (this.specialTimer <= 0)
                {
                    this.removeSpecialMode();
                }
                else
                {
                    this.specialTimer -= delta;
                    this.updateSpecialBar();
                }
            }

            if (this.itemTimer <= 0)
            {
                this.addItem();
            }
            else
            {
                this.itemTimer -= delta;
            }
            if (this.currentGiftBox)
            {
                if (this.currentGiftBox.kill && this.currentGiftBox.parent)
                {
                    this.currentGiftBox.parent.removeChild(this.currentGiftBox)
                }
                else if (!this.currentGiftBox.kill)
                {
                    this.currentGiftBox.update(delta);
                }
            }
            if (this.currentItem)
            {
                if (this.currentItem.kill && this.currentItem.parent)
                {
                    this.currentItem.parent.removeChild(this.currentItem)
                }
                else if (!this.currentItem.kill)
                {
                    this.currentItem.update(delta);
                }
            }

            if (this.actionMultiplier > 1)
            {
                let coinPos = {
                    x: config.width * Math.random(),
                    y: -10
                }
                this.inGameEffects.addCoinParticles(coinPos, 1,
                {
                    texture: 'cat_coin_particle',
                    alphaDecress: 0.5,
                    gravity: 500,
                    forceX: 0,
                    forceY: 0,
                    scale: 0.03
                }, false);
            }

            this.inGameEffects.update(delta);

        }
        this.updateScales();
        for (var i = this.catList.length - 1; i >= 0; i--)
        {
            if (this.catList[i].isFinished)
            {
                this.removeFromLane(this.catList[i]);
            }
            if (this.catList[i].killed)
            {
                this.catList[i].parent.removeChild(this.catList[i]);
                CATS_POOL.push(this.catList[i]);
                this.catList.splice(i, 1);
            }
            else
            {
                this.catList[i].update(delta);
            }
        }
        for (var i = this.particlesList.length - 1; i >= 0; i--)
        {
            if (this.particlesList[i].dead)
            {
                GAME_PARTICLES_POOL.push(this.particlesList[i]);
                this.particlesList.splice(i, 1);
            }
            else
            {
                this.particlesList[i].update(delta)
            }
        }
        for (var i = 0; i < this.particlesList.length; i++)
        {
            this.particlesList[i].update(delta)
        }
        this.environment.update(delta);
        this.HUD.update(delta);

    }

    addGiftBox()
    {
        if (!this.currentGiftBox)
        {
            this.currentGiftBox = new GameItem();
            this.currentGiftBox.onCollect.add((item) =>
            {
                this.collectItem(item)
            })
        }
        this.addChild(this.currentGiftBox);

        // console.log('addGIFT');
        // let ids = [0, 2, 3, 3, 3, 3, 3, 3, 3]
        // let ids = [0, 2]
        this.currentGiftBox.reset(
        {
            x: -config.width * 0.125,
            y: (Math.random() * config.height / 4) + config.height / 2
        }, 4);


    }

    addItem()
    {
        this.itemTimer = this.itemTimerMax + (Math.random() * this.itemTimerMax * 0.5)
        if (!this.currentItem)
        {
            this.currentItem = new GameItem();
            this.currentItem.onCollect.add((item) =>
            {
                this.collectItem(item)
            })
        }
        this.addChild(this.currentItem);

        // let ids = [3, 3, 3, 3, 3]
        let ids = [0, 2, 3, 3, 3, 3, 3, 3, 3]
            // let ids = [0, 2]
        this.currentItem.reset(
        {
            x: config.width * 0.125,
            y: config.height + PAWN.height
        }, ids[Math.floor(Math.random() * ids.length)]);
        //, Math.floor(Math.random() * 3));

    }
    collectItem(item)
    {
        switch (item.itemType)
        {
            case 0:
                let tempTrophy = GAME_DATA.getTrophyAmount()
                GAME_DATA.updateTrophy(tempTrophy);
                this.inGameEffects.popLabel(
                {
                    x: item.x,
                    y: item.y - 30
                }, '+' + utils.formatPointsLabel(tempTrophy / MAX_NUMBER), 0, 3, 1);
                FBInstant.logEvent(
                    'in_game_collectables',
                    1,
                    {
                        type: 'trophy',
                    },
                );

                break;
            case 1:
                this.addAutoCollectMode();
                break;
            case 2:
                let tempPoints = this.currentPoints * (Math.random() * 0.3 + 0.1)
                if (tempPoints == 0)
                {
                    tempPoints = (50 * Math.random() + 0.1) / MAX_NUMBER
                }
                this.currentPoints += tempPoints
                this.inGameEffects.popLabel(
                {
                    x: item.x,
                    y: item.y - 20
                }, '+' + utils.formatPointsLabel(tempPoints), 0, 3, 1);
                this.inGameEffects.addCoinParticles(
                {
                    x: item.x,
                    y: item.y - 20
                }, 15);
                FBInstant.logEvent(
                    'in_game_collectables',
                    1,
                    {
                        type: 'coins',
                    },
                );
                break;
            case 3:
                FBInstant.logEvent(
                    'in_game_collectables',
                    1,
                    {
                        type: 'chest',
                    },
                );
                this.offerPrize();
                break;
            case 4:
                FBInstant.logEvent(
                    'in_game_collectables',
                    1,
                    {
                        type: 'gift',
                    },
                );
                this.screenManager.prizeContainer.show(1);
                this.isPaused = true
                break;

        }

        SOUND_MANAGER.play('pickup_star');

        this.HUD.updateHUD(this.currentPoints, this.currentDeadCats)
            // this.itemTimer = this.itemTimerMax;

    }

    onMouseMove(e)
    {
        return
        this.mousePosition = e.data.global;
        if (this.mouseDown)
        {
            if (!this.getPawn())
            {
                //this.releasePawn();
            }
        }
    }
    onTapUp(e)
    {
        this.mouseDown = false;
        this.releasePawn();
    }

    onTapDown(e)
    {
        this.mouseDown = true;
        this.mousePosition = e.data.global;
        if (this.getPawn())
        {
            if (this.lanes[this.selectedPawn.lane].length)
            {
                let cat = this.lanes[this.selectedPawn.lane][0];
                let dist = utils.distance(cat.x, cat.y, this.selectedPawn.x, this.selectedPawn.y)
                if (dist < this.selectedPawn.width * 0.75 && !cat.isFinished)
                {
                    this.collectThisCat(cat, dist);
                }
                else if (dist < this.selectedPawn.width * 2)
                {
                    cat.finish();
                }
            }
        }

    }

    missCat(cat)
    {
        console.log(this.actionAutoCollect);
        if (cat.catData.isAuto || this.isAutoCollectMode || this.actionAutoCollect)
        {
            //cat.finishTimer = -999
            cat.auto = true;
            // cat.currentWaypointID = 0;
            this.collectThisCat(cat, 0, true);
            return;
        }
        cat.auto = false;
        // cat.finish();
        this.screenManager.shake();
        this.gameSpeed += 0.15
        let labelPos = {
            x: cat.x,
            y: cat.y - cat.height / 2
        }
        if (labelPos.x > config.width * 0.9)
        {
            labelPos.x -= config.width * 0.1
        }
        if (this.gameSpeed > 1.1)
        {
            this.gameSpeed = 1.1;
        }

        this.inGameEffects.popLabel(labelPos, 'MISS', 0, -1, 0.7);
        this.currentDeadCats--;
        if (this.currentDeadCats <= 0)
        {
            this.gameOver();
        }

        if (cat.parent)
        {
            cat.parent.removeChild(cat);
            this.frontCats.addChild(cat);
        }
        this.HUD.updateHUD(this.currentPoints, this.currentDeadCats)
    }
    collectThisCat(cat, dist, auto = false)
    {
        cat.collectCat(dist);
        let labelPos = {
            x: cat.x,
            y: cat.y
        }
        let coinPos = {
            x: cat.x,
            y: cat.y - cat.height
        }
        let points = 0;

        let labelData = {
            text: '',
            scagmle: 1,
            points: 0,
            special: 0
        }
        if (dist < PAWN.width * 0.2)
        {
            points = 10;
            this.gameSpeed -= 0.05
            labelData.special += 0.005;
            labelData.text = 'PURRFECT\n+'
            labelData.scale = 1
            this.inGameEffects.addBean(cat,
            {
                x: cat.x,
                y: 0
            });
            this.inGameEffects.addBombAreaBean(cat);
        }
        else if (dist < PAWN.width * 0.5)
        {
            points = 5;
            this.gameSpeed -= 0.025
            labelData.special += 0.0025;
            labelData.text = 'GREAT\n+'
            labelData.scale = 0.9
            this.inGameEffects.addBean(cat,
            {
                x: cat.x,
                y: 0
            });
        }
        else
        {
            points = 1;
            this.gameSpeed -= 0.01
            labelData.special += 0.0015;
            labelData.text = 'GOOD\n+'
            labelData.scale = 0.75
        }
        this.specialAcc += labelData.special;
        console.log(this.specialAcc);

        // forceY: Math.random() * 150 - 75,
        this.inGameEffects.addCoinParticles(coinPos, Math.ceil(points / 2),
        {
            texture: 'results_newcat_star',
            scale: 0.02
        });
        this.inGameEffects.addCoinParticles(coinPos, Math.ceil(points / 2),
        {
            texture: 'cat_coin_particle_ingame',
            alphaDecress: 0,
            gravity: 800,
            forceX: 600,
            target:
            {
                timer: 1,
                x: 20,
                y: 20
            },
            scale: 0.07
        });
        points *= cat.catData.pointsMultiplier;
        points += points * cat.catData.collectedMultiplier
        points += points * GAME_DATA.trophyData.collectedMultiplier;
        points += points * this.actionMultiplier;
        if (this.isSpecialMode)
        {
            points *= this.doublePoints;

        }
        points /= MAX_NUMBER;

        this.currentPoints += points;

        this.catLanesList[cat.catID]++;

        labelData.text = '+' + utils.formatPointsLabel(points);
        // labelData.text += utils.formatPointsLabel(points);
        this.inGameEffects.popLabel(labelPos, labelData.text, 0, 3, labelData.scale);

        this.updateSpecialBar();

        if (this.specialAcc >= 1)
        {
            this.specialAcc = 0;
            this.updateSpecialBar();
            this.addGiftBox();
            // this.addSpecialMode();
        }
        if (this.gameSpeed < 0.75)
        {
            this.gameSpeed = 0.75;
        }
        if (cat.parent)
        {
            cat.parent.removeChild(cat);
            this.frontCats.addChild(cat);
        }
        this.HUD.updateHUD(this.currentPoints, this.currentDeadCats)
            // //console.log(this.gameSpeed);
    }
    releasePawn()
    {
        if (this.selectedPawn)
        {
            this.selectedPawn.release();
            this.selectedPawn = null;
        }
    }
    getPawn()
    {
        let dist = 0;
        for (var i = 0; i < this.catPawns.length; i++)
        {
            let pawn = this.catPawns[i];
            dist = utils.distance(this.mousePosition.x, this.mousePosition.y, pawn.x, pawn.y);
            if (dist < PAWN.width * pawn.scale.x * 1.25)
            {
                pawn.hold();
                this.selectedPawn = pawn;
                return true;
            }
        }
        return false;
    }
    transitionOut(nextScreen)
    {
        this.removeEvents();
        this.nextScreen = nextScreen;
        setTimeout(function()
        {
            this.endTransitionOut();
        }.bind(this), 0);
    }
    transitionIn()
    {
        super.transitionIn();
    }
    destroy()
    {

    }
    removeEvents()
    {
        this.gameContainer.interactive = false;
        // this.screenManager.topMenu.onBackClick.removeAll();
        this.gameContainer.off('mousemove', this.onMouseMove.bind(this));
        this.gameContainer.off('mousedown', this.onTapDown.bind(this)).off('touchstart', this.onTapDown.bind(this));
        this.gameContainer.off('mouseup', this.onTapUp.bind(this)).off('touchend', this.onTapUp.bind(this)).off('mouseupoutside', this.onTapUp.bind(this));
    }
    addEvents()
    {
        this.removeEvents();
        // this.screenManager.topMenu.onBackClick.add(this.redirectToInit.bind(this));
        this.gameContainer.interactive = true;
        this.gameContainer.on('mousemove', this.onMouseMove.bind(this));
        this.gameContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
        this.gameContainer.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this)).on('mouseupoutside', this.onTapUp.bind(this));

    }



}