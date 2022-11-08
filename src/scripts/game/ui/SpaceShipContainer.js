import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import UIList from './uiElements/UIList';
import UIButton from './uiElements/UIButton';
export default class SpaceShipContainer extends PIXI.Container
{
    constructor()
    {
        super();
        this.onOpenInfo = new Signals();
        this.onCloseInfo = new Signals();
        this.onConfirm = new Signals();
        this.onInfoSpaceship = new Signals();
        this.container = new PIXI.Container();
        this.addChild(this.container)

        this.spaceShipSin = 0;
        this.spaceShipBubble = new PIXI.Sprite.from('pickup_bubble');
        this.spaceShipBubble.anchor.set(0.5, 0.5);
        this.container.addChild(this.spaceShipBubble);
        this.spaceShipBubble.interactive = true;
        this.spaceShipBubble.buttonMode = true;
        this.spaceShipBubble.on('mousedown', this.openSpaceshipInfo.bind(this)).on('touchstart', this.openSpaceshipInfo.bind(this));

        let trophyIcon = new PIXI.Sprite.from('spaceship');
        trophyIcon.anchor.set(0.5, 0.5);
        trophyIcon.scale.set(this.spaceShipBubble.width / trophyIcon.width * 0.5)
        this.container.addChild(trophyIcon);

        this.availableTrohpy = new PIXI.Text('1.5T',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.availableTrohpy.pivot.x = this.availableTrohpy.width / 2;
        this.availableTrohpy.y = -15;

        this.containerScale = config.width / this.container.width * 0.25
        this.container.scale.set(this.containerScale)

        this.infoIcon = new PIXI.Sprite.from('info');
        this.infoIcon.anchor.set(0.5, 0.5);
        this.infoIcon.scale.set((this.spaceShipBubble.width) / this.infoIcon.width * 0.2);
        this.container.addChild(this.infoIcon);

        this.infoIcon.x = this.spaceShipBubble.width / 3.5;
        this.infoIcon.y = this.spaceShipBubble.height / 3.5;


        //INFO
        this.spaceShipInfoContainer = new PIXI.Container();
        let shipInfoSprite = new PIXI.Sprite.from('info_panel');
        this.spaceShipInfoContainer.addChild(shipInfoSprite);





        this.uiList = new UIList();
        this.uiList.h = shipInfoSprite.height * 0.3;
        this.uiList.w = shipInfoSprite.width// * 0.8;
        shipInfoSprite.addChild(this.uiList);


        let rescueCats = new PIXI.Sprite.from('rescue_cats');
        rescueCats.anchor.set(0.5);
        rescueCats.scale.set(shipInfoSprite.width / rescueCats.width * 0.6);
        rescueCats.x = shipInfoSprite.width / 2;
        rescueCats.y = shipInfoSprite.height / 2.5;
        shipInfoSprite.addChild(rescueCats);


        this.infoButton = new PIXI.Sprite.from('info');
        this.infoButton.anchor.set(0.5)
        shipInfoSprite.addChild(this.infoButton);
        this.infoButton.scale.set(shipInfoSprite.width / this.infoButton.width * 0.1);
        this.infoButton.interactive = true;
        this.infoButton.buttonMode = true;
        this.infoButton.on('mousedown', this.onInfoCallback.bind(this)).on('touchstart', this.onInfoCallback.bind(this));
        this.infoButton.x = rescueCats.x + rescueCats.width / 2;
        this.infoButton.y = rescueCats.y + rescueCats.height / 2;
        // this.uiList.x = shipInfoSprite.width * 0.1;

        this.cancelButton = new UIButton('icon_close')
        // this.cancelButton.back.anchor.set(0)
        // this.cancelButton.icon.position.set(this.cancelButton.back.width / 2, this.cancelButton.back.height / 2)
        this.cancelButton.fitHeight = 0.5;
        this.cancelButton.scaleContentMax = true;
        this.cancelButton.scale.set(shipInfoSprite.width /this.cancelButton.width * 0.1)
        this.cancelButton.x = shipInfoSprite.width
        // this.uiList.elementsList.push(this.cancelButton);
        shipInfoSprite.addChild(this.cancelButton);


        this.trophyContainer = new PIXI.Container();
        this.backTrophy = new PIXI.Sprite.from('results_newcat_rays_02');//new PIXI.Sprite.from('results_newcat_rays_02');
        this.backTrophy.anchor.set(0.5)
        this.backTrophy.x = this.backTrophy.width / 2
        this.backTrophy.y = this.backTrophy.height / 2
        this.backTrophySin = 0;

        this.infoTrophy = new PIXI.Sprite.from(GAME_DATA.trophyData.icon);
        this.infoTrophy.x = this.backTrophy.x;
        this.infoTrophy.y = this.backTrophy.y;
        this.infoTrophy.anchor.set(0.5)
        this.infoTrophy.scale.set(this.backTrophy.height / this.infoTrophy.height * 0.65)
        this.trophyContainer.addChild(this.backTrophy);
        this.trophyContainer.addChild(this.infoTrophy);
        this.trophyContainer.fitHeight = 0.75;
        this.trophyContainer.scaleContentMax = true;
        this.uiList.elementsList.push(this.trophyContainer);
        this.uiList.addChild(this.trophyContainer);


        let sellCatsInfo = new PIXI.Text('Do you want send your cats\nback to Earth?',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        shipInfoSprite.addChild(sellCatsInfo);
        sellCatsInfo.x = shipInfoSprite.width / 2 - sellCatsInfo.width / 2
        sellCatsInfo.y = 20

        this.spaceShipInfoLabel = new PIXI.Text('x 582',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '64px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '800'
        });
        // this.spaceShipInfoLabel.fitHeight = 0.5;
        this.spaceShipInfoLabel.scaleContentMax = true;
        this.uiList.elementsList.push(this.spaceShipInfoLabel);
        this.uiList.addChild(this.spaceShipInfoLabel);
        

        this.confirmSpaceship = new UIButton('icon_play_video')
        this.confirmSpaceship.zeroAnchor();
        // this.confirmSpaceship.back.anchor.set(0)
        // this.confirmSpaceship.icon.position.set(this.confirmSpaceship.back.width / 2, this.confirmSpaceship.back.height / 2)
        this.confirmSpaceship.fitHeight = 0.5;
        this.confirmSpaceship.scaleContentMax = true;
        this.uiList.elementsList.push(this.confirmSpaceship);
        this.uiList.addChild(this.confirmSpaceship);

        shipInfoSprite.scale.set(config.width / shipInfoSprite.width * 0.9)
        this.container.addChild(this.spaceShipInfoContainer);

        this.spaceShipInfoContainer.visible = false;
        this.confirmSpaceship.interactive = true;
        this.confirmSpaceship.buttonMode = true;
        this.confirmSpaceship.on('mousedown', this.onSpaceshipClick.bind(this)).on('touchstart', this.onSpaceshipClick.bind(this));

        this.spaceShipInfoContainer.scale.set(config.width / this.spaceShipInfoContainer.width / this.containerScale * 0.65)
        this.spaceShipInfoContainer.x = -this.spaceShipInfoContainer.width
        this.spaceShipInfoContainer.y = -this.spaceShipInfoContainer.height / 2

        this.uiList.updateHorizontalList();

        this.uiList.y = shipInfoSprite.height / shipInfoSprite.scale.y - this.uiList.h;
        // this.uiList.y = shipInfoSprite.height - this.uiList.h;

    }
    onInfoCallback(){
        this.onInfoSpaceship.dispatch();
    }
    onSpaceshipClick(){
        this.onConfirm.dispatch();
        SOUND_MANAGER.play('rocket_launch_01', 0.25)
    }
    closeSpaceship()
    {
        SOUND_MANAGER.play('button_click')
        this.onCloseInfo.dispatch();
        TweenLite.to(this.spaceShipInfoContainer, 0.25,
        {
            alpha: 0,
            onComplete: () =>
            {
                this.spaceInfoOpen = false;
                this.spaceShipInfoContainer.visible = false;
                // this.container.interactive = true;
            }
        })

    }
    openSpaceshipInfoCallback(){


        this.spaceShipInfoLabel.text = 'x' + utils.formatPointsLabel(GAME_DATA.getNumberTrophyToSend() / MAX_NUMBER);

        this.spaceShipInfoContainer.alpha = 0;
        this.spaceShipInfoContainer.visible = true;
        TweenLite.to(this.spaceShipInfoContainer, 0.5,
        {
            alpha: 1,
        })
        this.spaceInfoOpen = true;

        this.uiList.updateHorizontalList();
    }
    openSpaceshipInfo(){
        if(this.spaceInfoOpen){
            return
        }
        SOUND_MANAGER.play('button_click')
        this.onOpenInfo.dispatch();
    }
    update(delta)
    {

        if(this.spaceInfoOpen){
            this.backTrophySin += 0.1;
            this.backTrophySin %= Math.PI;
            this.backTrophy.rotation = this.backTrophySin
            this.container.scale.set(this.containerScale)
        }else{

            this.spaceShipSin += this.spaceInfoOpen ? 0.005 : 0.05
            this.spaceShipSin %= Math.PI * 2;
            this.infoIcon.rotation = -this.container.rotation;
            this.container.rotation = Math.sin(this.spaceShipSin) * 0.1 + 0.2
            this.container.scale.set(this.containerScale + Math.cos(this.spaceShipSin) * 0.01, this.containerScale + Math.sin(this.spaceShipSin) * 0.01)
            this.spaceShipInfoContainer.rotation = -this.container.rotation;
        }
    }
}