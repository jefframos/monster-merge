import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import EntityShop from './EntityShop';
import Signals from 'signals';

export default class MergeItemsShop extends EntityShop {
    constructor(mainSystem, size, border = 0) {
        super(mainSystem, size, border = 0)
        this.onAddEntity = new Signals();
    }

    confirmItemShop(item) {
        this.mainSystem.forEach(resourceSystem => {
            resourceSystem.findUpgrade(item)
        });

        COOKIE_MANAGER.addMergePieceUpgrade(item);

        this.onAddEntity.dispatch(item);

    }
    updateLocks(total){
        for (let index = this.currentItens.length-1; index >=0 ; index--) {
            const element = this.currentItens[index];

            if (total <= 0) {
                element.block();
            }else {
                element.unblock();
            }
            
        }
    }
    show() {
        this.visible = true;
        this.title.text = window.localizationManager.getLabel('spaceships')
        let currentResources = COOKIE_MANAGER.getBoard();
        let currentEntities = []
        for (const key in currentResources.entities) {
            const element = currentResources.entities[key];
            if (element && element.nameID) {
                currentEntities.push(element.nameID);
            }
        }

        let found = false;

        this.savedProgression = COOKIE_MANAGER.getBoard();
        this.boardProgression = this.savedProgression.boardLevel;

        for (let index = this.currentItens.length-1; index >=0 ; index--) {
            const element = this.currentItens[index];

            if (index < this.boardProgression.currentLevel) {
                element.unlockItem();
                found = true;
            }else {
                element.lockItem();
            }
            
        }
        this.currentItens[0].unlockItem();        
        this.posShow();
    }
}