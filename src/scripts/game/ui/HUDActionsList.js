import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import UIList from './uiElements/UIList';
import HUDActionContainer from './HUDActionContainer';
export default class HUDActionsList extends UIList
{
    constructor(rect)
    {
        super();

        this.itensList = [];
        this.w = rect.w
        this.h = rect.h
        this.onStartAction = new Signals();
        this.onFinishAction = new Signals();

        this.containerBackground = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, rect.w, rect.h);
        this.addChild(this.containerBackground)
        this.containerBackground.alpha = 0;

        this.autoCollect = null;
        for (var i = 0; i < GAME_DATA.actionsData.length; i++)
        {
            let data = GAME_DATA.actionsData[i];
            let item = new HUDActionContainer(GAME_DATA.actionsData[data.id]);
            let tempContainer = new PIXI.Container();
            let tempStatic = GAME_DATA[data.staticData][data.id];

            if(tempStatic.type == 'auto_collect'){
                this.autoCollect = item;
            }
            tempContainer.addChild(item);
            this.addChild(tempContainer);
            tempContainer.align = 0;
            tempContainer.fitWidth = 1;
            item.onClickItem.add(this.onStartActionCallback.bind(this))
            item.onFinishAction.add(this.onFinishActionCallback.bind(this))
            this.itensList.push(item);
            this.elementsList.push(tempContainer);
            item.x = -item.width
        }
        this.updateData();
        this.updateVerticalList();
    }
    updateActionList()
    {
        console.log('UPDATE ACTIONSSS 222222222');
        this.updateData();
        for (var i = 0; i < this.itensList.length; i++)
        {
            console.log(GAME_DATA.actionsData[i].level);
            if (GAME_DATA.actionsData[i].level <= 0)
            {
                this.itensList[i].totallyDisabled();
            }
            else
            {
                console.log('showACTION', i);
                this.itensList[i].available();
                this.itensList[i].updateData(GAME_DATA.actionsData[i]);
            }
        }
    }
    updateData()
    {}

    disableAutoCollectAction(){
        this.autoCollect.ableToAct = false;
        console.log('disableAutoCollectAction');
    }
enableAutoCollectAction(){
this.autoCollect.ableToAct = true;
}

    killAllActions()
    {
        for (var i = this.itensList.length - 1; i >= 0; i--)
        {
            this.itensList[i].reset()
        }
    }

    onClick()
    {
        this.onClickItem.dispatch(this);
    }
    onStartActionCallback(action)
    {
        this.onStartAction.dispatch(GAME_DATA.actionsDataStatic[action.id]);
    }
    onFinishActionCallback(action)
    {
        this.onFinishAction.dispatch(GAME_DATA.actionsDataStatic[action.id]);
    }
    hide(force)
    {
        this.updateVerticalList();
        for (var i = 0; i < this.elementsList.length; i++)
        {
            TweenLite.to(this.elementsList[i], force ? 0 : 0.2,
            {
                delay: 0.1 * i,
                x: this.elementsList[i].x + this.elementsList[i].width + 20,
                ease: Back.easeIn
            });
        }
    }
    show()
    {
        this.visible = true;
        this.updateVerticalList();
        for (var i = 0; i < this.itensList.length; i++){

            this.itensList[i].hideTimer();
        }
        
        for (var i = 0; i < this.elementsList.length; i++)
        {
            TweenLite.from(this.elementsList[i], 0.3,
            {
                delay: 0.1 * i + 0.2,
                x: this.elementsList[i].x + this.elementsList[i].width + 20,
                ease: Back.easeOut
            });
        }
        this.updateActionList();
    }
    update(delta)
    {
        for (var i = this.itensList.length - 1; i >= 0; i--)
        {
            this.itensList[i].update(delta);
        }
    }
}