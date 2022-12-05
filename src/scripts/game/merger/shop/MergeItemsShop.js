import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import EntityShop from './EntityShop';
import Signals from 'signals';
import ShopItem from './ShopItem';

export default class MergeItemsShop extends EntityShop {
    constructor(mainSystem, size, border = 0) {
        super(mainSystem, size, border = 0)
        this.onAddEntity = new Signals();
        this.systemID = 'monsters';

        this.giftItem = new ShopItem({ w: this.itemWidth, h: this.size.h * 0.8 / 6 })
        this.giftItem.backShapeGeneral.texture = PIXI.Texture.from(config.assets.panel.extra)
        //this.giftItem.itemIcon.texture = PIXI.Texture.from('Btn04')
        this.container.addChild(this.giftItem)
        this.giftItem.x = this.size.w * 0.1
        this.giftItem.y = 80
        this.giftItem.updateHorizontalList();
        this.giftItem.shopButton.updateCoast('Free Gift')
        this.giftItem.unblock()
        this.giftItem.shopButton.enable();
        this.giftItem.shopButton.onClickItem.removeAll()
        this.giftItem.shopButton.onClickItem.add(
            () => {
                this.onClaimGift.dispatch()
            });

        this.standardGiftTime = 5 * 60;

        this.shopList.addBaseGradient('base-gradient',this.itemWidth, 0x575B64)
    }
    setGiftIcon(icon) {
        this.giftItem.itemIcon.texture = PIXI.Texture.from(icon)
        this.giftItem.updateHorizontalList();
    }
    update(delta) {
        let latest = COOKIE_MANAGER.getLatestGiftClaim(this.systemID);

        if (latest > 0) {
            let diff = Date.now() - latest;

            let diffTime = this.standardGiftTime - diff / 1000
            this.giftItem.shopButton.updateCoast(utils.convertNumToTime(Math.ceil(diffTime)))
            this.giftItem.block(true)
            if (diffTime <= 0) {
                COOKIE_MANAGER.claimGift(this.systemID, -1);
            }

        } else if (!this.giftItem.isBlocked) {
            this.giftItem.shopButton.updateCoast('Free Gift')
            this.giftItem.shopButton.enable();
        }
        //console.log(latest);
    }
    confirmItemShop(item) {
        this.mainSystem.forEach(resourceSystem => {
            resourceSystem.findUpgrade(item)
        });

        COOKIE_MANAGER.addMergePieceUpgrade(item, this.systemID);

        this.onAddEntity.dispatch(item);

    }
    updateLocks(total) {
        for (let index = this.currentItens.length - 1; index >= 0; index--) {
            const element = this.currentItens[index];

            if (total <= 0) {
                element.block();
                this.giftItem.block()
            } else {
                element.unblock();
                this.giftItem.unblock()
                //this.giftItem.shopButton.enable();
            }

        }
    }
    show(id) {
        this.visible = true;
        this.title.text = window.localizationManager.getLabel('spaceships')
        let currentResources = COOKIE_MANAGER.getBoard(this.systemID);
        let currentEntities = []
        for (const key in currentResources.entities) {
            const element = currentResources.entities[key];
            if (element && element.nameID) {
                currentEntities.push(element.nameID);
            }
        }

        let found = false;
        this.savedProgression = COOKIE_MANAGER.getBoard(this.systemID);
        this.boardProgression = this.savedProgression.boardLevel;

        for (let index = this.currentItens.length - 1; index >= 0; index--) {
            const element = this.currentItens[index];

            if (index < this.boardProgression.currentLevel) {
                element.unlockItem();
                found = true;
            } else {
                element.lockItem();
            }

        }
        this.currentItens[0].unlockItem();
        this.posShow();



    }
}