import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import CatItem from './CatItem';
import UIList from './uiElements/UIList';
import UIButton from './uiElements/UIButton';
export default class CatItemList extends PIXI.Container
{
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 4)
    {
        super();
        this.onAutoCollect = new Signals();
        this.onActiveCat = new Signals();
        this.onInfoAutoCollect = new Signals();
        this.container = new PIXI.Container();
        this.catListContainer = new PIXI.Container();
        this.containerBackground = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, rect.w, rect.h);
        this.addChild(this.containerBackground)
        this.containerBackground.alpha = 0;
        this.maskGraphic = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, rect.w, rect.h);
        this.addChild(this.maskGraphic)
        this.catsItemList = [];
        this.rect = rect;
        this.itemsPerPage = itensPerPage;
        this.itemHeight = this.rect.h / this.itemsPerPage;
        for (var i = 0; i < GAME_DATA.catsData.length; i++)
        {
            let catItem = new CatItem(GAME_DATA.catsData[i],
            {
                w: this.rect.w,
                h: this.itemHeight
            });
            catItem.onAutoCollect.add(this.onAutoCollectCallback.bind(this));
            catItem.onActiveCat.add(this.onActiveCatCallback.bind(this));
            this.catListContainer.addChild(catItem)
            catItem.y = this.itemHeight * i;
            this.catsItemList.push(catItem);

        }
        this.lastItemClicked = this.catsItemList[0]
        this.container.addChild(this.catListContainer);
        this.container.addChild(this.containerBackground);
        this.addChild(this.container);
        this.container.mask = this.maskGraphic;
        this.container.interactive = true;


        this.upButton = new UIButton('icon_up');
        this.upButton.customAnchor(0.75, 0.75);
        this.upButton.scale.set(this.rect.h / this.upButton.height * 0.15);
        this.upButton.align = 1 - 0.65;
        this.upButton.interactive = true;
        this.upButton.buttonMode = true;
        this.upButton.x = this.rect.w / 2;
        this.upButton.y = -this.upButton.height / 2
        this.upButton.on('mousedown', this.onUpList.bind(this)).on('touchstart', this.onUpList.bind(this));
        this.addChild(this.upButton);

        this.downButton = new UIButton('icon_down');
        this.downButton.customAnchor(0.75,0.25);
        this.downButton.scale.set(this.rect.h / this.downButton.height * 0.15);
        this.downButton.align = 1 - 0.65;
        this.downButton.interactive = true;
        this.downButton.buttonMode = true;
        this.downButton.x = this.rect.w / 2;
        this.downButton.y = this.rect.h + this.downButton.height / 2;
        this.downButton.on('mousedown', this.onDownList.bind(this)).on('touchstart', this.onDownList.bind(this));
        this.addChild(this.downButton);


        this.container.on('mousemove', this.moveDrag.bind(this))
            .on('touchmove', this.moveDrag.bind(this))

        this.container.on('mousedown', this.startDrag.bind(this))
            .on('touchstart', this.startDrag.bind(this));

        this.container.on('mouseup', this.endDrag.bind(this))
            .on('touchend', this.endDrag.bind(this))
            .on('touchendoutside', this.endDrag.bind(this))
            .on('mouseupoutside', this.endDrag.bind(this));

        // this.addChild(this.container);
        this.updateAllItens();


        this.spaceShipInfoContainer = new PIXI.Container();
        let shipInfoSprite = new PIXI.Sprite.from('score_plinth');
        this.spaceShipInfoContainer.addChild(shipInfoSprite);

        this.uiList = new UIList();
        this.uiList.h = shipInfoSprite.height * 0.75;
        this.uiList.w = shipInfoSprite.width // * 0.8;
        shipInfoSprite.addChild(this.uiList);


        this.infoButton = new PIXI.Sprite.from('info');
        this.infoButton.anchor.set(0.5)
            // shipInfoSprite.addChild(this.infoButton);
        this.infoButton.scale.set(shipInfoSprite.width / this.infoButton.width * 0.15);
        this.infoButton.interactive = true;
        this.infoButton.buttonMode = true;
        this.infoButton.fitHeight = 0.5;
        this.infoButton.on('mousedown', this.onInfoCallback.bind(this)).on('touchstart', this.onInfoCallback.bind(this));
        shipInfoSprite.addChild(this.infoButton);
        this.infoButton.x = shipInfoSprite.width

        this.closeSpaceship = new UIButton('icon_close');
        this.closeSpaceship.zeroAnchor();
        this.closeSpaceship.scale.set(shipInfoSprite.height / this.closeSpaceship.height * 0.55);
        this.closeSpaceship.align = 1 - 0.65;
        this.closeSpaceship.interactive = true;
        this.closeSpaceship.buttonMode = true;
        this.closeSpaceship.on('mousedown', this.onHideAuto.bind(this)).on('touchstart', this.onHideAuto.bind(this));
        this.uiList.elementsList.push(this.closeSpaceship);
        this.uiList.addChild(this.closeSpaceship);


        let fishIcon = new PIXI.Sprite.from(GAME_DATA.trophyData.icon);
        fishIcon.align = 1;
        this.uiList.elementsList.push(fishIcon);
        this.uiList.addChild(fishIcon);
        fishIcon.scale.set(shipInfoSprite.height / fishIcon.height * 0.35);


        let sellCatsInfo = new PIXI.Text('Do you want automatize this cat?',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '20px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '800'
        });

        shipInfoSprite.addChild(sellCatsInfo);
        sellCatsInfo.x = shipInfoSprite.width / 2 - sellCatsInfo.width / 2
        sellCatsInfo.y = 12

        this.spaceShipInfoLabel = new PIXI.Text('x 582',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '48px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '800'
        });
        this.spaceShipInfoLabel.align = 0;
        this.uiList.elementsList.push(this.spaceShipInfoLabel);
        this.uiList.addChild(this.spaceShipInfoLabel);

        this.confirmSpaceship = new UIButton('icon_confirm');
        this.confirmSpaceship.zeroAnchor();
        this.confirmSpaceship.scale.set(shipInfoSprite.height / this.confirmSpaceship.height * 0.55);
        this.confirmSpaceship.align = 0.65;
        this.confirmSpaceship.interactive = true;
        this.confirmSpaceship.buttonMode = true;
        this.confirmSpaceship.on('mousedown', this.onConfirmAuto.bind(this)).on('touchstart', this.onConfirmAuto.bind(this));
        this.uiList.elementsList.push(this.confirmSpaceship);
        this.uiList.addChild(this.confirmSpaceship);

        shipInfoSprite.scale.set(rect.w / shipInfoSprite.width)
        this.blocker = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.blocker.alpha = 0.75;
        this.blocker.interactive = true;
        this.blocker.buttonMode = true;
        this.blocker.on('mousedown', this.onHideAuto.bind(this)).on('touchstart', this.onHideAuto.bind(this));


        this.addChild(this.spaceShipInfoContainer);

        this.spaceShipInfoContainer.visible = false;
        shipInfoSprite.x = rect.w / 2 - shipInfoSprite.width / 2;
        this.uiList.updateHorizontalList();
        this.uiList.y = shipInfoSprite.height / shipInfoSprite.scale.y - this.uiList.h;

    }
    onDownList()
    {
        let target = 0
        let targY = this.catListContainer.y

        targY -= this.itemHeight / 2;
        target = Math.floor(targY / this.itemHeight) * this.itemHeight

        let maxH = this.itemHeight * this.catsItemList.length;

        if (target + maxH < this.containerBackground.height)
        {
            TweenLite.to(this.catListContainer, 0.75,
            {
                y: this.containerBackground.height - maxH, // - this.catListContainer.height,
                ease: Back.easeOut
            })
            this.downButton.visible = false;
        }else{
            TweenLite.to(this.catListContainer, 0.75,
            {
                y: target,
                ease: Back.easeOut
            })
            this.downButton.visible = true;        
        }
        this.upButton.visible = true;
    }
    onUpList()
    {
        TweenLite.to(this.catListContainer, 0.5,
        {
            y: 0,
            ease: Back.easeOut
        })
        this.upButton.visible = false;
        this.downButton.visible = true;  
    }
    resetPosition()
    {
        this.catListContainer.y = 0;
        this.upButton.visible = false;
        this.downButton.visible = true;  
    }
    onHideAuto()
    {
        this.spaceShipInfoContainer.visible = false;
        this.container.alpha = 1;
        this.lastItemClicked.visible = true;
        TweenLite.to(this.blocker, 0.5,
        {
            alpha: 0,
            onComplete: () =>
            {
                this.blocker.visible = false;
            }
        })
    }
    onInfoCallback()
    {
        this.onInfoAutoCollect.dispatch();
    }
    onConfirmAuto()
    {
        this.onHideAuto();
        // this.spaceShipInfoContainer.visible = false;
        // this.container.alpha = 1;
        // this.lastItemClicked.visible = true;
        this.onAutoCollect.dispatch(this.lastItemClicked.catData);
        // this.updateAllItens()
    }
    onActiveCatCallback(cat)
    {
        this.enableDrag = false;
        this.dragging = false;
        this.goingDown = 0;
        this.onActiveCat.dispatch(cat);
    }
    onAutoCollectCallback(cat)
    {
        this.enableDrag = false;
        this.dragging = false;
        this.goingDown = 0;
        this.lastItemClicked = cat
        let staticData = GAME_DATA.getStaticCatData(cat.catData.catID);
        let globalPos = this.getGlobalPosition()
        this.blocker.x = -globalPos.x;
        this.blocker.y = -globalPos.y;
        if (!this.blocker.parent)
        {
            this.addChildAt(this.blocker, this.getChildIndex(this.spaceShipInfoContainer));
        }
        this.blocker.alpha = 0;
        this.blocker.visible = true;
        TweenLite.to(this.blocker, 0.5,
        {
            alpha: 0.5,
            onComplete: () =>
            {}
        })

        this.spaceShipInfoContainer.y = this.catListContainer.y + this.lastItemClicked.y;
        this.spaceShipInfoContainer.visible = true;
        this.spaceShipInfoLabel.text = utils.formatPointsLabel(staticData.autoCollectPrice / MAX_NUMBER);
        this.uiList.updateHorizontalList();
        this.spaceShipInfoContainer.alpha = 0;
        TweenLite.to(this.spaceShipInfoContainer, 0.5,
        {
            alpha: 1
        });
        this.lastItemClicked.visible = false;
    }
    updateItemActive(id)
    {
        console.log(id);
        this.catsItemList[id].updateItem(GAME_DATA.catsData[id])
    }
    update(delta)
    {
        if (this.spaceShipInfoContainer.visible && this.lastItemClicke)
        {
            this.spaceShipInfoContainer.y = this.lastItemClicked.y;
        }
        for (var i = 0; i < this.catsItemList.length; i++)
        {
            this.catsItemList[i].updateThumb(delta);
        }

    }
    updateAllItens()
    {
        for (var i = 0; i < this.catsItemList.length; i++)
        {
            this.catsItemList[i].updateItem(GAME_DATA.catsData[i])
        }
    }
    endDrag()
    {
        if (!this.enableDrag)
        {
            return;
        }
        this.dragging = false;
        this.containerBackground.interactive = false;

        let target = 0;
        let targY = this.catListContainer.y
        let maxH = this.itemHeight * this.catsItemList.length;
        if (this.goingDown == 1)
        {
            targY -= this.itemHeight / 2;
            target = Math.floor(targY / this.itemHeight) * this.itemHeight
        }
        else if (this.goingDown == -1)
        {

            targY += this.itemHeight / 2;
            target = Math.ceil(targY / this.itemHeight) * this.itemHeight
        }
        // console.log(target, this.catListContainer.y, 'TARGETTT');
        this.upButton.visible = true;
        if(this.catListContainer.y >= 0){
            this.upButton.visible = false;            
        }
        this.downButton.visible = true;
        if (target > 0)
        {
            TweenLite.to(this.catListContainer, 0.75,
            {
                y: 0,
                ease: Back.easeOut
            })
            this.upButton.visible = false;
        }
        else if (target + maxH < this.containerBackground.height)
        {
            TweenLite.to(this.catListContainer, 0.75,
            {
                y: this.containerBackground.height - maxH, // - this.catListContainer.height,
                ease: Back.easeOut
            })
            this.downButton.visible = false;
        }
        else if (target != 0)
        {
            TweenLite.to(this.catListContainer, 0.75,
            {
                y: target,
                ease: Back.easeOut
            })
        }
    }
    moveDrag(e)
    {
        if (!this.enableDrag)
        {
            this.goingDown = 0;
            return;
        }
        if (this.dragging)
        {

            this.spaceShipInfoContainer.visible = false;
            this.lastItemClicked.visible = true;
            this.container.alpha = 1;
            this.dragVelocity = {
                x: (e.data.global.x - this.currentMousePos.x),
                y: this.currentMousePos.y - e.data.global.y
            }
            this.currentMousePos = {
                x: e.data.global.x,
                y: e.data.global.y
            };

            this.catListContainer.y -= this.dragVelocity.y

            if (this.dragVelocity.y > 0)
            {
                this.containerBackground.interactive = true;
                this.goingDown = 1;
            }
            else if (this.dragVelocity.y < 0)
            {
                this.containerBackground.interactive = true;
                this.goingDown = -1;
            }
        }
    }
    startDrag(e)
    {
        this.enableDrag = true;
        this.goingDown = 0;
        TweenLite.killTweensOf(this.catListContainer);
        this.dragging = true;
        this.currentMousePos = {
            x: e.data.global.x,
            y: e.data.global.y
        };
    }
}