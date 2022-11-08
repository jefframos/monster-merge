import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import ListScroller from './uiElements/ListScroller';
export default class GameOverCatsList extends ListScroller
{
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 4)
    {
        super(rect, itensPerPage);
        this.maskGraphic.height = this.rect.h - this.itemHeight / 2
        this.onItemShop = new Signals();
        // this.onShopItem = new Signals();
        this.container = new PIXI.Container();
        this.itens = [];

    }

    addItens(itens)
    {
        for (var i = 0; i < itens.length; i++)
        {
            let tempItem = itens[i];
            this.listContainer.addChild(tempItem)
            tempItem.y = this.itemHeight * this.itens.length - 1;
            if (tempItem.onConfirmShop)
            {
                tempItem.onConfirmShop.add(this.onShopItemCallback.bind(this));
            }
            this.itens.push(tempItem);

        }
        this.lastItemClicked = this.itens[0]
    }
    onShopItemCallback(itemData, realCost)
    {
        GAME_DATA.buyUpgrade(itemData, realCost);
        this.onItemShop.dispatch(itemData);
        this.updateItems();
    }
    updateItems()
    {
        for (var i = 0; i < this.itens.length; i++)
        {
            this.itens[i].updateData()
        }
    }
    dispose()
    {
        for (var i = 0; i < this.itens.length; i++)
        {
            if (this.itens[i].parent)
            {
                this.itens[i].parent.removeChild(this.itens[i])
            }
        }
        this.itens = [];
    }
    updateAllItens()
    {
        for (var i = 0; i < this.catsItemList.length; i++)
        {
            this.catsItemList[i].updateItem(GAME_DATA.catsData[i])
        }
    }

}