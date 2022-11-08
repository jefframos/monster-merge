import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import UIList from './uiElements/UIList';
import UIButton from './uiElements/UIButton';
import ListScroller from './uiElements/ListScroller';
export default class SettingsContainer extends ListScroller
{
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 4)
    {

        super(rect, 5, false, 0);

        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onCancel = new Signals();

        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.75;
        this.prizeDark.interactive = true;
        this.prizeDark.x = -config.width / 2;
        this.prizeDark.y = -config.height / 2;
        // this.prizeDark.buttonMode = true;
        // this.prizeDark.on('mousedown', this.hideCallback.bind(this)).on('touchstart', this.hideCallback.bind(this));
        this.addChildAt(this.prizeDark, 0);

        this.infoContainer = new PIXI.Container();
        let shipInfoSprite = new PIXI.Sprite.from('info_panel');
        this.infoContainer.addChild(shipInfoSprite);
        // shipInfoSprite.alpha = 0
        this.container.addChild(this.infoContainer)
        this.infoScaleX = this.rect.w / this.infoContainer.width;
        this.infoScaleY = this.rect.h / this.infoContainer.height;
        this.infoContainer.scale.set(this.infoScaleX, this.infoScaleY)
        this.infoContainer.pivot.x = shipInfoSprite.width / 2;
        this.infoContainer.pivot.y = shipInfoSprite.height / 2;


        this.closeButton = new UIButton('icon_close')
        this.addChild(this.closeButton)
        this.closeButton.x = this.infoContainer.width / 2
        this.closeButton.y = - this.infoContainer.height / 2
        this.closeButton.scale.set(config.width / this.closeButton.width * 0.075)

        this.closeButton.interactive = true;
        this.closeButton.buttonMode = true;
        this.closeButton.on('mouseup', this.hideCallback.bind(this)).on('touchend', this.hideCallback.bind(this));
        // this.infoContainer.x = -config.width / 2;
        // this.infoContainer.y = -config.height / 2;

        this.settingsItens = [];

        this.titleList = new UIList();
        this.titleList.h = this.itemHeight;
        this.titleList.w = this.rect.w;


        let settingsLabel = new PIXI.Text('SETTINGS',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '48px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });

        settingsLabel.fitHeight = 0.35;
        settingsLabel.scaleContentMax = true;
        this.titleList.addChild(settingsLabel)
        this.titleList.elementsList.push(settingsLabel);


        this.titleList.updateHorizontalList();

        this.settingsItens.push(this.titleList);
        this.listContainer.addChild(this.titleList)



        this.muteList = new UIList();
        this.muteList.h = this.itemHeight;
        this.muteList.w = this.rect.w;

        this.soundButton = new UIButton('icon_sound_on', 0.75)
        this.soundButton.zeroAnchor();
        this.soundButton.interactive = true;
        this.soundButton.buttonMode = true;
        this.soundButton.on('mouseup', this.toggleSound.bind(this)).on('touchend', this.toggleSound.bind(this));
        this.muteList.addChild(this.soundButton)

        this.soundButton.fitHeight = 0.75;
        this.soundButton.align = 0.9;
        this.muteList.elementsList.push(this.soundButton);

        this.muteLabel = new PIXI.Text('Mute',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });

        this.muteLabel.fitHeight = 0.25;
        this.muteLabel.align = 0.1;
        this.muteLabel.scaleContentMax = true;
        this.muteList.addChild(this.muteLabel)
        this.muteList.elementsList.push(this.muteLabel);

        this.muteList.updateHorizontalList();

        this.settingsItens.push(this.muteList);
        this.listContainer.addChild(this.muteList)


        this.eraseList = new UIList();
        this.eraseList.h = this.itemHeight;
        this.eraseList.w = this.rect.w;

        this.eraseButton = new UIButton('icon_reset', 0.6)
        this.eraseButton.zeroAnchor();
        this.eraseButton.interactive = true;
        this.eraseButton.buttonMode = true;
        this.eraseButton.on('mouseup', this.eraseData.bind(this)).on('touchend', this.eraseData.bind(this));
        this.eraseList.addChild(this.eraseButton)

        this.eraseButton.align = 0.9;
        this.eraseButton.fitHeight = 0.75;
        this.eraseList.elementsList.push(this.eraseButton);

        let eraseData = new PIXI.Text('Clear Data',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });

        eraseData.fitHeight = 0.25;
        eraseData.align = 0.1;
        eraseData.scaleContentMax = true;
        this.eraseList.addChild(eraseData)
        this.eraseList.elementsList.push(eraseData);


        this.eraseList.updateHorizontalList();

        this.settingsItens.push(this.eraseList);
        this.listContainer.addChild(this.eraseList)



        this.socialList = new UIList();
        this.socialList.h = this.itemHeight;
        this.socialList.w = this.rect.w;

        this.fbButton = new UIButton('icon_confirm')
        this.fbButton.zeroAnchor();
        this.fbButton.interactive = true;
        this.fbButton.buttonMode = true;
        this.fbButton.on('mouseup', this.cheat.bind(this)).on('touchend', this.cheat.bind(this));
        this.socialList.addChild(this.fbButton)

        this.fbButton.align = 0.9;
        this.fbButton.fitHeight = 0.75;
        this.socialList.elementsList.push(this.fbButton);


        let cheatLabel = new PIXI.Text('Add Coins, Cats/ Trophies',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '48px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });

        cheatLabel.fitHeight = 0.15;
        cheatLabel.scaleContentMax = true;
        cheatLabel.align = 0.1;
        this.socialList.addChild(cheatLabel)
        this.socialList.elementsList.push(cheatLabel);
        // this.twButton = new UIButton('icon_confirm')
        // this.twButton.zeroAnchor();
        // this.twButton.interactive = true;
        // this.twButton.buttonMode = true;
        // // this.twButton.on('mouseup', this.eraseData.bind(this)).on('touchend', this.eraseData.bind(this));
        // this.socialList.addChild(this.twButton)

        // // this.twButton.align = 0.9;
        // this.twButton.fitHeight = 0.75;
        // this.socialList.elementsList.push(this.twButton);

        this.socialList.updateHorizontalList();

        this.settingsItens.push(this.socialList);
        this.listContainer.addChild(this.socialList)


        this.idList = new UIList();
        this.idList.h = this.itemHeight;
        this.idList.w = this.rect.w;


        let idlabel = new PIXI.Text('id: '+GAME_ID,
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '48px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });

        idlabel.fitHeight = 0.25;
        idlabel.scaleContentMax = true;
        this.idList.addChild(idlabel)
        this.idList.elementsList.push(idlabel);


        this.idList.updateHorizontalList();

        this.settingsItens.push(this.idList);
        this.listContainer.addChild(this.idList)


        this.container.setChildIndex(this.listContainer, this.container.children.length - 1)

        this.listContainer.x = -this.rect.w / 2
        this.listContainer.y = -this.rect.h / 2
            // this.marginTop = this.rect.h * 0.3
        this.addItens(this.settingsItens)

        if(GAME_DATA.mute){
            SOUND_MANAGER.mute();
        }
        this.updateSoundButton();
        // this.muteList.debug()
        // this.eraseList.debug()

    }
    updateSoundButton(){
        if (SOUND_MANAGER.isMute)
        {
            this.muteLabel.text = 'Unmute'
            this.soundButton.changeTexture('icon_sound_off')
        }
        else
        {
            this.muteLabel.text = 'Mute'
            this.soundButton.changeTexture('icon_sound_on')
        }

    }
    cheat(){
        GAME_DATA.addCats([100, 100, 100, 100]);
        GAME_DATA.updateTrophy(10000);
        let tempCurrent = GAME_DATA.maxPoints * 1.5 + 20;
        GAME_DATA.updateCatsAllowed(tempCurrent);
    }
    toggleSound()
    {
        SOUND_MANAGER.toggleMute();
        GAME_DATA.mute = SOUND_MANAGER.isMute;
        this.updateSoundButton();

        GAME_DATA.SAVE();
    }
    eraseData()
    {
        STORAGE.reset();
        location.reload();
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
            this.starBackground.rotation += 0.05
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
            x: this.infoScaleX,
            y: this.infoScaleY,
            ease: Back.easeOut
        })

        this.listContainer.alpha = 0;
        TweenLite.to(this.listContainer, 0.5,
        {
            alpha: 1
        });

        TweenLite.to(this.prizeDark, 0.5,
        {
            alpha: 0.75
        });
        this.visible = true;
    }
}