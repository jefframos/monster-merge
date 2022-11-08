import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import CircleCounter from './hudElements/CircleCounter';
export default class HUDActionContainer extends PIXI.Container {
    constructor(actionData) {
        super();
        this.actionData = actionData;
        this.actionDataStatic = GAME_DATA.actionsDataStatic[this.actionData.id];
        this.onClickItem = new Signals();
        this.onFinishAction = new Signals();

        this.backButton = new PIXI.Sprite.from('game_button_base');
        this.topButton = new PIXI.Sprite.from('powerup_background_on');
        // this.backButton.anchor.set(0.5);

        this.sprite = new PIXI.Sprite.from('spaceship');
        this.sprite.anchor.set(0.5);
        // this.sprite.x = this.backButton.width / 2;
        // this.sprite.y = this.backButton.height / 2;

        this.backButton.interactive = true;
        this.backButton.buttonMode = true;
        this.backButton.on('mouseup', this.onClick.bind(this)).on('touchend', this.onClick.bind(this));

        this.coolDownLabel = new PIXI.Text('00:00', {
            fontFamily: 'blogger_sansregular',
            fontSize: '48px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        // this.backButton.addChild(this.coolDownLabel);

        this.backButton.texture = PIXI.Texture.from('powerup_background');
        this.setTexture(this.actionDataStatic.icon)
        this.counter = new CircleCounter(60, 58);
        this.counter.build(0xefd9f2, 0xFFFFFF)
        this.addChild(this.counter);
        this.counter.update(0)
        this.counter.x = 55
        this.counter.y = 55
        
        this.topButton.mask = this.counter.circleMask;

        // this.counter.update(0.5)

        // this.tokenPrice.scale.set(110 / this.tokenPrice.height * 0.4)
        this.addChild(this.backButton);
        this.addChild(this.topButton);
        this.addChild(this.sprite);
        this.addChild(this.coolDownLabel);
        // this.addChild(this.tokenPrice);
        this.updateData(this.actionData)
        this.timer = 0;
        this.cooldown = 0;
    }
    hideTimer(){
        this.cooldown = 0;
        this.coolDownLabel.text = '';
    }
    setTexture(texture) {
        
        this.sprite.texture = new PIXI.Texture.from(texture);
        this.sprite.scale.set(this.backButton.height / this.sprite.height * 0.85);
        this.sprite.anchor.set(0.5);
        this.backButton.scale.set(110 / this.backButton.height)
        this.topButton.scale.set(110 / this.topButton.height)
        this.sprite.scale.set(this.topButton.height / this.sprite.height * 0.6)
        this.sprite.x = this.backButton.width / 2;
        this.sprite.y = this.backButton.height / 2;
        this.coolDownLabel.text = '00:00';
        this.coolDownLabel.pivot.x = this.coolDownLabel.width / 2;
        this.coolDownLabel.pivot.y = this.coolDownLabel.height / 2;
        this.coolDownLabel.x = this.backButton.width / 2;
        this.coolDownLabel.y = this.backButton.height / 2;

        this.coolDownLabel.scale.set(this.backButton.width / this.coolDownLabel.width * 0.6)

        this.topButton.alpha = 0;
        this.coolDownLabel.alpha = 0;
    }
    enable() {
        this.disabled = false;
        this.backButton.tint = 0xFFFFFF
        this.topButton.alpha = 0;
            // this.tokenPrice.texture = PIXI.Texture.from('token_price');
    }
    disable() {
        this.disabled = true;
        // this.ableToAct = false;
        this.backButton.tint = 0xAAAAAA
        // this.topButton.alpha = 0;
            // this.tokenPrice.texture = PIXI.Texture.from('token_grey');
    }
    reset() {
        // this.backButton.texture = PIXI.Texture.from('game_button_base_borderless');
        this.acting = false;
        this.backButton.tint = 0xFFFFFF
        this.coolDownLabel.text = '';
        this.sprite.tint = 0xFFFFFF;
        this.sprite.alpha = 1;
        this.cooldown = 0;
        this.counter.update(1, true);
        this.topButton.alpha = 0;
        // this.ableToAct = true;
    }
    updateData(actionData) {
        this.actionData = actionData;
        this.actionDataStatic = GAME_DATA.actionsDataStatic[this.actionData.id];
        this.leveldActionData = GAME_DATA.getActionStats(this.actionData);
        this.ableToAct = true;
        // this.setTexture(this.actionDataStatic.icon)
    }
    finishReset() {
            this.counter.update(0, true);
            this.counter.scale.set(0.75);
            TweenLite.to(this.counter.scale, 0.5, {
                x: 1,
                y: 1,
                ease: Back.easeOut
            })
            TweenLite.to(this.coolDownLabel, 0.5, {
                alpha: 1
            })
            this.sprite.alpha = 0.5;
            // this.sprite.tint = 0;
            this.cooldown = this.leveldActionData.cooldown;
            this.topButton.alpha = 0;
            this.ableToAct = false;
    }
    shake(force = 0.25, steps = 5, time = 0.4)
    {
        SOUND_MANAGER.play('boing');
        let timelinePosition = new TimelineLite();
        let positionForce = (force * -20);
        let spliterForce = (force * 20);
        let pos = [positionForce * 2, positionForce, positionForce * 2, positionForce, positionForce * 2, positionForce]
        let speed = time / pos.length;

        for (var i = pos.length; i >= 0; i--)
        {
            timelinePosition.append(TweenLite.to(this, speed,
            {
                rotation: i%2==0?0.1:-0.1,
                // x: this.container.width / 2 + pos[i], //- positionForce / 2,
                // y: 0, //Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this, speed,
        {
            rotation:0,
            // x: this.container.width / 2,
            // y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
    onClick() {
        if (!this.ableToAct) {
            this.shake();
            return;
        }
        SOUND_MANAGER.play('button_click')
        SOUND_MANAGER.play('teleport')
        this.coolDownLabel.alpha = 0;
        this.topButton.alpha = 1;
        // this.backButton.texture = PIXI.Texture.from('game_button_base_borderless_green');
        this.acting = true;
        this.ableToAct = false;
        this.onClickItem.dispatch(this.actionData);
        this.timer = this.leveldActionData.activeTime;
        this.counter.update(0, true);
    }
    updateCounter(value) {
        if (value >= 1) {
            this.finishAction();
        } else {
            this.counter.update(value)
        }
    }
    finishAction() {
        this.acting = false;
        // this.backButton.texture = PIXI.Texture.from('game_button_base_borderless');
        this.finishReset();
        // this.backButton.tint = 0xFFFFFF
        this.onFinishAction.dispatch(this.actionData);
    }
    update(delta) {
        if (this.acting) {
            this.timer -= delta;
            this.backButton.tint = 0xAAAAAA
            this.updateCounter(1 - this.timer / this.leveldActionData.activeTime);
        } else if (this.cooldown > 0) {
            let minutes = parseInt(this.cooldown / 60, 10)
            let seconds = parseInt(this.cooldown % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            this.coolDownLabel.text = minutes + ':' + seconds;

            this.cooldown -= delta;
            if (this.cooldown <= 0) {
                this.cooldown = 0;
                this.finishCooldown();
            }
        }
    }
    finishCooldown() {
        this.coolDownLabel.alpha = 0;
        this.coolDownLabel.text = '';
        this.ableToAct = true;
        this.sprite.tint = 0xFFFFFF;
        this.sprite.alpha = 1;
    }
    totallyDisabled() {
        this.ableToAct = false;
        this.sprite.alpha = 0.5;
        this.alpha = 0;
    }
    available() {
        this.ableToAct = true;
        this.sprite.alpha = 1;
        this.alpha = 1;
    }
    hide() {
        // this.visible = false;
    }
    show() {
        // this.visible = true;
    }
}