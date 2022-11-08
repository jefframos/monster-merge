import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import UIList from './uiElements/UIList';
import UIButton from './uiElements/UIButton';
export default class AskVideoContainer extends UIList
{
    constructor()
    {
        super();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onCancel = new Signals();


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.75;
        this.prizeDark.interactive = true;
        // this.prizeDark.buttonMode = true;
        // this.prizeDark.on('mousedown', this.hideCallback.bind(this)).on('touchstart', this.hideCallback.bind(this));
        this.addChild(this.prizeDark);

        this.infoContainer = new PIXI.Container();
        let shipInfoSprite = new PIXI.Sprite.from('info_panel');
        this.infoContainer.addChild(shipInfoSprite);

        this.addChild(this.infoContainer)
        this.infoScale = config.height / this.infoContainer.height * 0.5
        this.infoContainer.scale.set(this.infoScale)
        this.infoContainer.pivot.x = shipInfoSprite.width / 2;
        this.infoContainer.pivot.y = shipInfoSprite.height / 2;

        this.infoContainer.x = config.width / 2;
        this.infoContainer.y = config.height / 2;

        this.titlePrizes = new PIXI.Sprite.from('video_rewards_title');
        this.titlePrizes.anchor.set(0.5, 1);
        this.titlePrizesScale = config.width / this.titlePrizes.width * 0.85
        this.titlePrizes.scale.set(this.titlePrizesScale)
        this.addChild(this.titlePrizes)
        this.titlePrizes.x = config.width / 2;
        this.titlePrizes.y = config.height / 2 - this.infoContainer.height * 0.5;

        this.chest = new PIXI.Sprite(PIXI.Texture.from('open_silver_chest'));
        this.chest.anchor.set(0.5);
        this.chestScale = shipInfoSprite.width / this.chest.width * 0.7
        this.chest.scale.set(this.chestScale);

        this.chest.x = shipInfoSprite.width / 2;
        this.chest.y = shipInfoSprite.height / 1.8;

        let angle = 0;
        let tot = 8;
        this.coins = [];
        this.middlePoint = {
            x: this.chest.x,
            y: this.chest.y,
            size:shipInfoSprite.width
        }
        for (var i = tot; i >= 0; i--)
        {
            angle = (Math.PI * 2 / tot) * i;
            let coin = new PIXI.Sprite(PIXI.Texture.from('cat_coin_particle_ingame'));
            this.infoContainer.addChild(coin);
            coin.anchor.set(0.5)
            coin.coinAcc = angle
            coin.angle = angle
            coin.x =  Math.cos(angle) * this.middlePoint.size / 3.5 + this.middlePoint.x
            coin.y =  Math.sin(angle) * this.middlePoint.size / 4 + this.middlePoint.y
            this.coinScale = shipInfoSprite.width / coin.width * 0.2
            coin.scale.set(this.coinScale)
            this.coins.push(coin);
        }

        this.infoContainer.addChild(this.chest)
        this.double = new PIXI.Sprite(PIXI.Texture.from('text_double_points'));
        this.double.anchor.set(0.5);
        this.doubleScale = shipInfoSprite.width / this.double.width * 0.75
        this.double.scale.set(this.doubleScale);
        this.double.y = -this.double.height * 0.2
        this.chest.addChild(this.double)

        // this.double.x = shipInfoSprite.width/2;
        // this.double.y = shipInfoSprite.height/2;

        this.confirmButton = new UIButton('icon_play_video') //PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
            // this.confirmButton.anchor.set(0.5)
        this.playButtonScale = shipInfoSprite.height / this.confirmButton.height * 0.35;
        this.confirmButton.scale.set(this.playButtonScale)
        this.confirmButton.interactive = true;
        this.confirmButton.buttonMode = true;
        this.confirmButton.x = shipInfoSprite.width / 2 // - this.confirmButton.width / 2- shipInfoSprite.width * 0.05;
        this.confirmButton.y = shipInfoSprite.height //- this.confirmButton.height / 2 //- shipInfoSprite.width * 0.05;
        this.confirmButton.on('mouseup', this.confirm.bind(this)).on('touchend', this.confirm.bind(this));
        this.infoContainer.addChild(this.confirmButton)

        this.playButtonSin = 0;



        this.cancelButton = new UIButton('icon_close')
            // this.cancelButton.anchor.set(0.5)
        this.cancelButton.scale.set(shipInfoSprite.height / this.cancelButton.height * 0.12)
        this.cancelButton.interactive = true;
        this.cancelButton.buttonMode = true;
        this.cancelButton.x = shipInfoSprite.width //this.cancelButton.width / 2+ shipInfoSprite.width * 0.05;
        this.cancelButton.y = 0 //shipInfoSprite.height - this.cancelButton.height / 2 - shipInfoSprite.width * 0.05;
        this.cancelButton.on('mouseup', this.cancel.bind(this)).on('touchend', this.cancel.bind(this));
        this.infoContainer.addChild(this.cancelButton)


        this.descriptionLabel = new PIXI.Text('Watch a video\n and double your earns\n for 15 seconds',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.descriptionLabel.x = shipInfoSprite.width / 2 - this.descriptionLabel.width / 2;
        this.descriptionLabel.y = 30
        this.infoContainer.addChild(this.descriptionLabel)

    }
    confirm()
    {
        this.onConfirm.dispatch();
        this.hideCallback();
    }
    cancel()
    {
        this.onCancel.dispatch();
        this.hideCallback();
    }
    update(delta)
    {
        if (this.visible)
        {
            this.playButtonSin += 10 * delta
            this.playButtonSin %= Math.PI * 2;
            this.confirmButton.rotation = Math.sin(this.playButtonSin) * 0.1
            this.confirmButton.scale.set(this.playButtonScale + Math.cos(this.playButtonSin) * 0.01, this.playButtonScale + Math.sin(this.playButtonSin) * 0.01)

            this.chest.scale.set(this.chestScale + Math.cos(this.playButtonSin) * 0.02, this.chestScale + Math.sin(this.playButtonSin) * 0.02)


            for (var i = this.coins.length - 1; i >= 0; i--)
            {
                let coin = this.coins[i];
                coin.coinAcc += delta * 3;
                coin.scale.set(this.coinScale + Math.cos(coin.coinAcc) * 0.1, this.coinScale + Math.sin(coin.coinAcc) * 0.1)

                coin.angle += delta * 2
                coin.x = Math.cos(coin.angle) *this.middlePoint.size / 3.5 + this.middlePoint.x// + Math.cos(coin.coinAcc) * 30
                coin.y = Math.sin(coin.angle) *this.middlePoint.size / 4 +  this.middlePoint.y// + Math.cos(coin.coinAcc) * 30
            }

            // this.videoShine.rotation += delta * 1.5
            // this.videoShine.rotation %= Math.PI * 2;
        }
    }
    hideCallback()
    {
        this.onHide.dispatch();
        this.hide();
    }
    hide()
    {
        this.visible = false;
    }
    show()
    {
        this.infoContainer.scale.set(0)

        TweenLite.to(this.infoContainer.scale, 0.5,
        {
            x: this.infoScale,
            y: this.infoScale,
            ease: Back.easeOut
        })

        this.titlePrizes.scale.set(0);
        TweenLite.to(this.titlePrizes.scale, 1,
        {
            delay: 0.5,
            onStart: () =>
            {
                SOUND_MANAGER.play('pickup_star');
            },
            x: this.titlePrizesScale,
            y: this.titlePrizesScale,
            ease: Elastic.easeOut
        })


        TweenLite.to(this.prizeDark, 0.5,
        {
            alpha: 0.75
        });
        this.visible = true;
    }
}