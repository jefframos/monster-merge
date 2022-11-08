import * as PIXI from 'pixi.js';
import ScreenManager from '../../screenManager/ScreenManager';
import StartPopUp from './popup/StartPopUp'
import GameOverPopUp from './popup/GameOverPopUp'
import OnboardingPopUp from './popup/OnboardingPopUp'
import ShopPopUp from './popup/ShopPopUp'
import AskVideoPopUp from './popup/AskVideoPopUp'
import config from '../../config';
import utils from '../../utils';
import PrizeContainer from '../ui/PrizeContainer';
import InfoContainer from '../ui/InfoContainer';
import AskVideoContainer from '../ui/AskVideoContainer';
import SettingsContainer from '../ui/SettingsContainer';
import VideoLoader from '../ui/VideoLoader';
import CoinsExplosion from '../effects/CoinsExplosion';
import FbManager from '../../fb/FbManager'
export default class SpaceCatsScreenManager extends ScreenManager
{
    constructor()
    {
        super();
        this.backgroundContainer = new PIXI.Container();
        this.addChild(this.backgroundContainer);
        this.setChildIndex(this.backgroundContainer, 0);

        let bgColor = new PIXI.Graphics().beginFill(0x12073f).drawRect(0, 0, config.width, config.height);
        this.backgroundContainer.addChild(bgColor)

        let tiled = new PIXI.extras.TilingSprite(PIXI.Texture.from('pattern'), 132, 200);
        this.backgroundContainer.addChild(tiled)
        tiled.width = config.width;
        tiled.height = config.height;
        tiled.alpha = 0.05
        tiled.tileScale.set(0.5)

        // goodboy.height = config.height;
        let bigBlur = new PIXI.Sprite(PIXI.Texture.from('bigblur'));
        this.backgroundContainer.addChild(bigBlur)
        bigBlur.width = config.width;
        bigBlur.height = config.height;
        bigBlur.alpha = 0.2

        let vignette = new PIXI.Sprite(PIXI.Texture.from('vignette'));
        this.backgroundContainer.addChild(vignette)
        vignette.width = config.width;
        vignette.height = config.height;

        let goodboy = new PIXI.Sprite(PIXI.Texture.from('goodboy'));
        this.backgroundContainer.addChild(goodboy)
        goodboy.anchor.set(0.5)
        goodboy.scale.set(config.width / goodboy.width * 0.12)
        goodboy.x = config.width / 2;
        goodboy.y = goodboy.height;
        // bigBlur.blendMode = PIXI.BLEND_MODES.ADD
        this.timeScale = 1;



        this.popUpContainer = new PIXI.Container();
        this.addChild(this.popUpContainer);


        this.prizeContainer = new PrizeContainer();
        // this.prizeContainer.onPrizeCollected.add(this.hidePrizeContainer.bind(this));
        this.addChild(this.prizeContainer)
        this.prizeContainer.hide();


        this.settingsContainer = new SettingsContainer(
        {
            w: config.width * 0.6,
            h: config.height * 0.5
        });
        this.addChild(this.settingsContainer)
        this.settingsContainer.x = config.width / 2;
        this.settingsContainer.y = config.height / 2;
        this.settingsContainer.hide();


        this.startPopUp = new StartPopUp('init', this);
        this.startPopUp.onConfirm.add(() =>
        {
            this.coinsExplosion.killAll();
            this.showPopUp('onboarding')
                // this.toGame()
        });

        this.startPopUp.onCatsRedirect.add(() =>
        {
            this.coinsExplosion.killAll();
            this.showPopUp('gameover')
        });

        this.askVideoPopUp = new AskVideoPopUp('video', this);
        this.askVideoPopUp.onConfirm.add(() =>
        {
            // this.toStart()
            this.prevPopUp = this.askVideoPopUp;
            this.loadVideo()
        });

        this.askVideoPopUp.onClose.add(() =>
        {
            // this.toStart()
            this.prevPopUp = this.askVideoPopUp;
            this.toGame()
        });

        this.gameOverPopUp = new GameOverPopUp('gameover', this);
        this.gameOverPopUp.onConfirm.add(() =>
        {
            this.coinsExplosion.killAll();
            this.toVideo()
            this.prevPopUp = this.gameOverPopUp;
            // this.toGame()
        });

        this.gameOverPopUp.onShopRedirect.add(() =>
        {
            this.coinsExplosion.killAll();
            this.showPopUp('shop')
        });

        this.onboardingPopUp = new OnboardingPopUp('onboarding', this);
        this.onboardingPopUp.onConfirm.add(() =>
        {
            this.toGame()
            this.prevPopUp = this.onboardingPopUp;
            // this.toGame()
        });

        this.shopPopUp = new ShopPopUp('shop', this);
        this.shopPopUp.onHide.add(() =>
        {
            this.gameOverPopUp.updateCurrency();
            this.currentPopUp = this.gameOverPopUp;
        });



        this.popUpList = [];
        this.popUpList.push(this.startPopUp);
        this.popUpList.push(this.gameOverPopUp);
        this.popUpList.push(this.onboardingPopUp);
        this.popUpList.push(this.shopPopUp);
        this.popUpList.push(this.askVideoPopUp);


        this.currentPopUp = null;
        this.prevPopUp = null;



        this.videoContainer = new PIXI.Container();
        let vdBg = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, config.width, config.height);
        this.videoContainer.addChild(vdBg)

        let videoLabel = new PIXI.Text('Reward video playing here\n\nThats how we make money\n\n$$$',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0x0000,
            align: 'center',
            fontWeight: '800'
        });

        this.videoContainer.addChild(videoLabel)
        videoLabel.pivot.x = videoLabel.width / 2;
        videoLabel.pivot.y = videoLabel.height / 2;
        videoLabel.x = config.width / 2;
        videoLabel.y = config.height / 2;

        this.videoContainer.interactive = true;
        this.videoContainer.buttonMode = true;
        this.afterVideoCallback = this.toGameWithBonus;
        // this.videoContainer.on('mouseup', this.afterVideoCallback.bind(this)).on('touchend', this.afterVideoCallback.bind(this));
        this.addChild(this.videoContainer);

        this.videoContainer.visible = false;
        // this.showPopUp('gameover')
        // this.toGame();
        this.showPopUp('init')
            // this.showPopUp('video')

        this.infoContainer = new InfoContainer();
        this.addChild(this.infoContainer)


        this.askVideoContainer = new AskVideoContainer();
        this.addChild(this.askVideoContainer)
        this.askVideoContainer.hide();
        // this.askVideoContainer.show();

        

        this.coinsExplosion = new CoinsExplosion();
        this.addChild(this.coinsExplosion);


        this.videoLoader = new VideoLoader();
        // this.prizeContainer.onPrizeCollected.add(this.hidePrizeContainer.bind(this));
        this.addChild(this.videoLoader)
        this.videoLoader.hide();
    }
    addCoinsParticles(pos, quant = 10, customData = {})
    {
        this.coinsExplosion.show(pos, quant, customData)
    }
    openSettings()
    {

        this.settingsContainer.show();
    }
    showAskVideo()
    {
        this.askVideoContainer.show();
    }
    showInfo(pos, texture, text, align)
    {
        this.infoContainer.show(pos, texture, text, align);
    }
    showPopUp(label, param = null)
    {
        console.log(label);
        switch (label)
        {
            case 'init':
                SOUND_MANAGER.stopAll();
                SOUND_MANAGER.playLoopOnce('spacecat_menu_music')
                break;
            case 'onboarding':
                // SOUND_MANAGER.stopAll();
                SOUND_MANAGER.playLoopOnce('spacecat_menu_music')
                break;
            case 'gameover':
                console.log('stopALLL');
                SOUND_MANAGER.stopAll();
                SOUND_MANAGER.playLoopOnce('spacecat_menu_music')
                break;
        }
        if (this.currentPopUp) //} && this.currentPopUp.label != label)
        {
            this.prevPopUp = this.currentPopUp;
            console.log(this.prevPopUp);
        }
        for (var i = 0; i < this.popUpList.length; i++)
        {
            if (this.popUpList[i].label == label)
            {
                if (this.coinsExplosion)
                {
                    this.coinsExplosion.killAll();
                }
                this.popUpList[i].show(param);
                this.popUpContainer.addChild(this.popUpList[i]);
                this.currentPopUp = this.popUpList[i];
            }
        }
    }
    forceChange(screenLabel, param)
    {

        super.forceChange(screenLabel, param);
    }
    change(screenLabel, param)
    {
        super.change(screenLabel, param);

    }
    update(delta)
    {
        super.update(delta * this.timeScale);

        this.coinsExplosion.update(delta);
        this.prizeContainer.update(delta);
        this.videoLoader.update(delta);
        this.askVideoContainer.update(delta);

        if (this.currentPopUp)
        {
            this.currentPopUp.update(delta * this.timeScale)
        }
        // console.log(this.prevPopUp);
        if (this.prevPopUp && this.prevPopUp.toRemove && this.prevPopUp.parent)
        {
            console.log('remove this', this.prevPopUp);
            this.prevPopUp.parent.removeChild(this.prevPopUp);
            this.prevPopUp = null;
        }
    }

    hideVideoLoader()
    {
        this.videoLoader.hide();
    }
    closeVideo()
    {
        this.videoContainer.visible = false;
    }
    loadVideo(callback, callbackParams, type = '')
    {

        this.videoLoader.show();

        // return
        this.videoContainer.off('mousedown', this.afterVideoCallback, callbackParams).off('touchstart', this.afterVideoCallback, callbackParams);
        if (callback)
        {
            this.afterVideoCallback = callback;
        }
        else
        {
            this.afterVideoCallback = this.toGameWithBonus.bind(this);
        }

        // console.log(this);
        FBInstant.logEvent(
            'reaward_video',
            1,
            {
                type: type,
            },
        );


        FbManager.showAdd(this.afterVideoCallback, callbackParams)


        return

        this.videoContainer.on('mousedown', this.afterVideoCallback, callbackParams).on('touchstart', this.afterVideoCallback, callbackParams);
        // console.log(callback);
        this.videoContainer.visible = true;
    }
    toVideo()
    {
        this.showPopUp('video')
    }
    toGameWithBonus()
    {
        this.videoContainer.visible = false;
        if (this.currentScreen.label == 'GameScreen')
        {
            this.currentScreen.resetGame(true);
            SOUND_MANAGER.play('pickup_star')
            SOUND_MANAGER.play('pickup_item2')
        }
    }
    toGame()
    {
        if (this.currentScreen.label == 'GameScreen')
        {
            this.currentScreen.resetGame();
            this.coinsExplosion.killAll();
            SOUND_MANAGER.play('teleport')
            SOUND_MANAGER.play('pickup_item2')
        }
    }
    toLoad()
    {}
    toStart()
    {
        this.showPopUp('init')
    }

    shake(force = 1, steps = 4, time = 0.25)
    {
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--)
        {
            timelinePosition.append(TweenLite.to(this.screensContainer, speed,
            {
                x: Math.random() * positionForce - positionForce / 2,
                y: Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.screensContainer, speed,
        {
            x: 0,
            y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}