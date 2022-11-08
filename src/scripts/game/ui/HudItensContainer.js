import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import CircleCounter from './hudElements/CircleCounter';
export default class HUDItensContainer extends PIXI.Container {
    constructor(actionData) {
        super();
        this.actionData = actionData;
        this.onClickItem = new Signals();
        this.onFinishAction = new Signals();

        this.backButton = new PIXI.Sprite.from('powerup_background');
        this.backButton.anchor.set(0.5);



        this.sprite = new PIXI.Sprite.from('spaceship');
        this.sprite.anchor.set(0.5);
        this.backButton.addChild(this.sprite);

        this.backButton.interactive = true;
        this.backButton.buttonMode = true;
        this.backButton.on('mouseup', this.onClick.bind(this)).on('touchend', this.onClick.bind(this));

       
        this.addChild(this.backButton);
        this.timer = 0;
    }
    setTexture(texture) {
        this.sprite.texture = PIXI.Texture.from(texture);
        this.sprite.scale.set(this.backButton.height / this.sprite.height * 0.5);
    }
    reset() {
    }
    finishReset() {
    }
    onClick() {        
        this.onClickItem.dispatch(this.actionData);
    }
    updateCounter(value) {
        if (value >= 1) {
            this.finishAction();
        }else{
            this.counter.update(value)
        }
    }
    finishAction() {
        this.acting = false;
        this.finishReset();
        this.onFinishAction.dispatch(this.actionData);
    }
    update(delta) {
        if (!this.actionData) {
            return;
        }
        if (this.acting) {
            this.timer -= delta;
            this.updateCounter(1 - this.timer / this.actionData.time);
        }
    }
    hide() {
        // this.visible = false;
    }
    show() {
        // this.visible = true;
    }
}