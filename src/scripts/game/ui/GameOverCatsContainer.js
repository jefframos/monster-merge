import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import GameOverItemContainer from './GameOverItemContainer';
import UIList from './uiElements/UIList';
import UIButton from './uiElements/UIButton';
import GameOverCatsList from './GameOverCatsList';
export default class GameOverCatsContainer extends UIList
{
    constructor()
    {
        super();
        this.onHide = new Signals();
        this.onCollectGift = new Signals();


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.75;
        this.interactive = true;
        this.buttonMode = true;
        // this.on('mouseup', this.collect.bind(this)).on('touchend', this.collect.bind(this));
        this.addChild(this.prizeDark);


        this.backgroundContainer = new PIXI.Container();
        let tiled = new PIXI.extras.TilingSprite(PIXI.Texture.from('pattern'), 132, 200);
        tiled.width = config.width;
        tiled.height = config.height;
        tiled.alpha = 0.05
        tiled.tileScale.set(0.5)


        let bgColor = new PIXI.Graphics().beginFill(0x12073f).drawRect(0, 0, config.width, config.height);
        this.backgroundContainer.addChild(bgColor)

        let bigBlur = new PIXI.Sprite(PIXI.Texture.from('bigblur'));
        this.backgroundContainer.addChild(bigBlur)
        bigBlur.width = this.width // 2;
        bigBlur.height = this.height // 2;
        bigBlur.alpha = 0.2
        bigBlur.anchor.set(0.5);

        this.backgroundContainer.addChild(tiled)

        this.backgroundContainer.alpha = 0.5
        this.addChild(this.backgroundContainer);

        this.listRect = {
            w: config.width * 0.3,
            h: config.height * 0.5
        }

        this.prizeFrame = new PIXI.Sprite(PIXI.Texture.from('info_panel'))
        this.prizeFrame.scale.set(this.listRect.h / this.prizeFrame.height)
        this.addChild(this.prizeFrame);

        this.prizesContainer = new PIXI.Container();
        this.addChild(this.prizesContainer);
        this.itensList = [];
        this.itensList1 = [];
        this.itensList2 = [];

        this.pageItens = 5

        this.gameOverCatList1 = new GameOverCatsList(this.listRect, this.pageItens);
        this.gameOverCatList2 = new GameOverCatsList(this.listRect, this.pageItens);

        this.w = config.width * 0.5
        this.h = config.height * 0.5


        this.prizesContainer.addChild(this.gameOverCatList1);
        this.prizesContainer.addChild(this.gameOverCatList2);
        this.gameOverCatList2.x = this.gameOverCatList1.x + this.listRect.w
        this.prizesContainer.x = config.width / 2 - this.w / 2;
        this.prizesContainer.y = config.height / 2 - this.h / 2;

        this.prizeFrame.x = config.width / 2 - this.prizeFrame.width / 2
        this.prizeFrame.y = this.prizesContainer.y - this.gameOverCatList1.itemHeight / 2 + 5

        let found = GAME_DATA.shopDataStatic.find(function(element)
        {
            return element.type == 'cat_multiplier';
        });
        this.shopStaticData = found;
        this.itensPool = [];

        this.currentList = this.gameOverCatList1;

        this.confirmButton = new UIButton('icon_back');
        this.confirmButtonScale = config.width / this.confirmButton.width * 0.15
        this.confirmButton.scale.set(this.confirmButtonScale)
        this.confirmButton.icon.scale.x = this.confirmButton.icon.scale.x * -1;
        this.confirmButton.interactive = true;
        this.confirmButton.buttonMode = true;
        this.confirmButton.on('mousedown', this.collect.bind(this)).on('touchstart', this.collect.bind(this));
        this.addChild(this.confirmButton)
        this.confirmButton.x = config.width - this.confirmButton.width //* 1.25;
        this.confirmButton.y = config.height - this.confirmButton.height //* 1.25;

        this.giftBox = new PIXI.Sprite(PIXI.Texture.from('results_newcat_rays_02')); //UIButton('icon_back');
        this.box = new PIXI.Sprite(PIXI.Texture.from('giftbox')); //UIButton('icon_back');
        this.box.anchor.set(0.5);
        this.box.scale.set(this.giftBox.width / this.box.width)
        this.giftBox.addChild(this.box);
        this.giftBox.anchor.set(0.5);
        this.giftBoxScale = config.width / this.giftBox.width * 0.25
        this.giftBox.scale.set(this.giftBoxScale)

        this.giftBox.interactive = true;
        this.giftBox.buttonMode = true;
        this.giftBox.on('mousedown', this.collectGift.bind(this)).on('touchstart', this.collectGift.bind(this));
        this.addChild(this.giftBox)
        this.giftBox.x = this.giftBox.width // * 1.25;
        this.giftBox.y = this.confirmButton.y
        this.giftBoxSin = 0;
        this.boxSin = 0;



        this.multiplierContainer = new PIXI.Sprite.from('powerup_background');
        this.multiplierContainer.anchor.set(0.5, 0.5);
        this.multiplierSprite = new PIXI.Sprite.from(this.shopStaticData.icon);
        this.multiplierSprite.anchor.set(0.5, 0.5);
        this.multiplierSprite.scale.set(this.multiplierContainer.width / this.multiplierSprite.width * 0.75)
        this.multiplierContainer.addChild(this.multiplierSprite);
        this.multiplierContainer.scale.set(this.confirmButton.width / this.multiplierSprite.width * 0.75)
        this.multiplierContainer.x = config.width - this.multiplierContainer.width //* 1.25;
        this.multiplierContainer.y = this.multiplierContainer.height //* 1.25;

        this.multiplierLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.multiplierLabel.y = this.multiplierContainer.height / this.multiplierContainer.scale.y * 0.5 //* 0.5
        this.multiplierLabel.pivot.x = this.multiplierLabel.width / 2;
        this.multiplierContainer.addChild(this.multiplierLabel);

        this.addChild(this.multiplierContainer)


        this.coinsContainer = new PIXI.Container();
        this.coinSprite = new PIXI.Sprite.from(GAME_DATA.moneyData.softIcon);
        this.coinsContainer.addChild(this.coinSprite);
        this.coinSprite.anchor.set(0, 0.5);

        this.moneyLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.moneyLabel.pivot.y = this.moneyLabel.height / 2;
        this.coinsContainer.addChild(this.moneyLabel);

        this.coinSprite.scale.set(config.height / this.coinSprite.height * 0.075)
        this.moneyLabel.scale.set(config.height / this.moneyLabel.height * 0.065)
        this.moneyLabel.x = this.coinSprite.width * 1.25;
        this.currentMoney = GAME_DATA.moneyData.currentCoins;
        this.coinsContainer.x = config.width / 2 - this.coinsContainer.width / 2
        this.coinsContainer.y = this.multiplierContainer.y
        this.addChild(this.coinsContainer)

    }
    update(delta)
    {
        if (this.visible)
        {
            if (this.giftBox.visible) // && this.giftBox.ableToRotate)
            {
                this.giftBox.rotation = Math.sin(this.giftBoxSin) * 0.2 // - 0.1
                this.box.rotation = Math.cos(this.giftBoxSin) * 0.2 // - 0.1
                if (this.giftBox.ableToRotate)
                {
                    this.giftBox.scale.x = this.giftBoxScale + Math.cos(this.giftBoxSin) * 0.2
                    this.giftBox.scale.y = this.giftBoxScale + Math.sin(this.giftBoxSin) * 0.2
                    this.giftBoxSin += 0.15
                    this.giftBoxSin %= Math.PI * 2;

                }

            }
            if (this.gameOverCatList1.dragging)
            {
                this.currentList = this.gameOverCatList1;
            }
            else if (this.gameOverCatList2.dragging)
            {
                this.currentList = this.gameOverCatList2;
            }
            this.gameOverCatList2.listContainer.y = this.currentList.listContainer.y;
            this.gameOverCatList1.listContainer.y = this.currentList.listContainer.y;
            //     this.starBackground.rotation += 0.05
        }
    }
    collectGift()
    {
        FBInstant.logEvent(
            'collect_game_over_gift',
            1,
            {},
        );
        this.onCollectGift.dispatch();
        SOUND_MANAGER.play('open_chest_01')
        this.giftBox.visible = false;
    }
    collect()
    {
        this.onHide.dispatch();
        this.hide();
    }
    addCatItem(id)
    {
        let staticCat = GAME_DATA.getStaticCatData(id);

        // console.log(staticCat, id);
        let item = null;
        // console.log('POOL', this.itensPool);
        if (this.itensPool.length > 0)
        {
            item = this.itensPool[0];
            this.itensPool.shift();
        }
        else
        {
            item = new GameOverItemContainer(this.w / 3, this.listRect.h / this.pageItens);
        }

        item.scaleContentMax = true;
        item.setCat(staticCat.catSrc);
        item.setValue();
        if (this.itensList.length % 2 == 0)
        {
            this.itensList1.push(item);
        }
        else
        {
            this.itensList2.push(item);
        }
        this.itensList.push(item);
        // this.elementsList.push(item);
        this.prizesContainer.addChild(item);

    }
    hide()
    {
        for (var i = 0; i < this.itensList.length; i++)
        {
            this.itensPool.push(this.itensList[i]);
        }
        this.itensList = [];
        this.itensList1 = [];
        this.itensList2 = [];
        this.gameOverCatList1.dispose();
        this.gameOverCatList2.dispose();
        this.visible = false;
    }
    show(catList, points = 66666)
    {
        this.gameOverCatList1.resetPosition();
        this.gameOverCatList2.resetPosition();
        this.giftBox.ableToRotate = false;
        this.showGiftBox();
        // console.log(catList);
        this.multValue = GAME_DATA.getActionStats(GAME_DATA.shopData[this.shopStaticData.id]).value;
        this.multiplierLabel.text = 'x' + utils.cleanString(this.multValue).toFixed(2);
        this.multiplierLabel.pivot.x = this.multiplierLabel.width / 2;
        this.currentMoney = 0;
        this.updateMoney(0, true)
        this.updateMoney(points, false, 0.75)
        let realPoints = [];
        let dynamicData = GAME_DATA.shopData[this.shopStaticData.id]
        if (dynamicData.level > 0)
        {
            this.leveledShopData = GAME_DATA.getActionStats(dynamicData);
        }
        for (var i = 0; i < catList.length; i++)
        {
            if (catList[i] > 0)
            {
                this.addCatItem(i);
                realPoints.push(catList[i]);

                if (this.leveledShopData)
                {
                    catList[i] *= this.leveledShopData.value;
                    catList[i] = Math.ceil(catList[i]);
                }
            }


        }

        this.gameOverCatList1.addItens(this.itensList1);
        this.gameOverCatList2.addItens(this.itensList2);

        let list = GAME_DATA.getChestPrize();

        for (var i = 0; i < this.itensList.length; i++)
        {
            this.itensList[i].forceHide();
        }
        // this.updateHorizontalList();
        let delay = 0;
        for (var i = 0; i < this.itensList.length; i++)
        {
            let item = list[i] //this.itensList[i];
            let itemC = this.itensList[i]
            delay = 0.1 * i + 0.1
            itemC.show(delay);
            itemC.setValue(realPoints[i])

            if (dynamicData.level > 0)
            {
                realPoints[i] *= this.leveledShopData.value;
                // console.log(this.leveledShopData.value);
                realPoints[i] = Math.ceil(realPoints[i]);
                itemC.updateQuant(realPoints[i], false, delay + 1, 'x' + utils.cleanString(this.multValue).toFixed(2));
            }

        }
        this.confirmButton.visible = false;
        setTimeout(() =>
        {
            this.showButton();
        }, Math.min(delay, 0.5) * 1000 + 1000);
        this.prizeDark.alpha = 0;


        TweenLite.to(this.prizeDark, 0.5,
        {
            alpha: 0.75
        });
        this.visible = true;

        return catList
    }
    showGiftBox()
    {
        this.giftBoxSin = 0;
        this.giftBox.rotation = Math.sin(this.giftBoxSin) * 0.2 - 0.1;
        this.giftBox.scale.set(0);
        TweenLite.to(this.giftBox.scale, 0.75,
        {
            onStart: () =>
            {
                this.giftBox.visible = true;
            },
            onComplete: () =>
            {
                this.giftBox.ableToRotate = true;
            },
            delay: 0.5,
            x: this.giftBoxScale + Math.cos(this.giftBoxSin) * 0.1,
            y: this.giftBoxScale + Math.sin(this.giftBoxSin) * 0.1,
            // rotation: Math.sin(this.giftBoxSin) * 0.2 - 0.1,
            ease: Elastic.easeOut
        })
    }
    showButton()
    {
        this.confirmButton.visible = true;
        this.confirmButton.scale.set(0);
        TweenLite.to(this.confirmButton.scale, 0.75,
        {
            x: this.confirmButtonScale,
            y: this.confirmButtonScale,
            ease: Elastic.easeOut
        })
    }
    updateMoney(money, force, delay = 0)
    {
        if (force)
        {
            this.moneyLabel.text = utils.formatPointsLabel(money / MAX_NUMBER);
            this.coinsContainer.x = config.width / 2 - this.coinsContainer.width / 2
            this.currentMoney = money;
            return;
        }
        if (this.currentTween)
        {
            TweenLite.killTweensOf(this.currentTween);
        }
        let moneyObj = {
            current: this.currentMoney,
            target: money
        }


        this.currentMoney = money;
        this.coinSound = 0;
        this.currentTween = TweenLite.to(moneyObj, 0.5,
        {
            delay: delay,
            current: money,
            onUpdateParams: [moneyObj],
            onUpdate: (moneyObj) =>
            {
                this.moneyLabel.text = utils.formatPointsLabel(moneyObj.current / MAX_NUMBER);
                this.coinsContainer.x = config.width / 2 - this.coinsContainer.width / 2
                let globalCoinPos = this.coinSprite.getGlobalPosition();
                globalCoinPos.x += this.coinSprite.width / 2;

                this.coinSound++;
                if (this.coinSound % 2 == 0)
                {
                    SOUND_MANAGER.play(getCoinSound(), 0.5)
                }

                window.screenManager.addCoinsParticles(globalCoinPos, 1,
                {
                    scale: 0.05
                });
            },
            onComplete: () =>
            {

                this.coinsContainer.x = config.width / 2 - this.coinsContainer.width / 2
            }
        })
    }
}