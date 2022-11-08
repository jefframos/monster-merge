import * as PIXI from 'pixi.js';

import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import config from '../../config';
import TextBox from '../ui/TextBox';
import UILabelButton1 from '../ui/UILabelButton1';

export default class StandardPop extends PIXI.Container
{
    constructor(label, screenManager)
    {
        super();
        this.screenManager = screenManager;
        this.label = label;
        this.onShow = new Signals();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onClose = new Signals();

        this.container = new PIXI.Container();

        this.w = config.width * 0.75;
        this.h = config.height * 0.35;

        this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width * 5, -config.height * 5,config.width*10, config.height * 10) 
        this.addChild(this.background)
        this.background.alpha = 0.5;

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
        this.background.visible = false

        this.popUp = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('small-no-pattern'), 15, 15, 15, 15)
		this.popUp.width = this.w
		this.popUp.height = this.h

        this.popUp.pivot.x = this.popUp.width / 2
        this.popUp.pivot.y = this.popUp.height / 2
            // this.popUp.scale.set((this.size / this.popUp.width));
        this.popUp.alpha = 1;
        this.popUp.tint = 0xFFFFFF;
        // this.popUp.blendMode = PIXI.BLEND_MODES.ADD;

        this.container.interactive = true;
        this.container.addChild(this.popUp)
        this.container.x = 0//-this.container.width / 2;
        this.container.y = 0//-this.container.height / 2;
        this.addChild(this.container)

            
        this.label1 = new PIXI.Text('!', LABELS.LABEL1);
        this.label2 = new PIXI.Text('!', LABELS.LABEL1);

        this.coin1 = new PIXI.Sprite.fromFrame('coin-large')
        this.coin2 = new PIXI.Sprite.fromFrame('plus-coins')
        this.coin1.anchor.set(0.5)
        this.coin2.anchor.set(0.5)
        this.container.addChild(this.coin1)
        this.container.addChild(this.coin2)


        this.coin1.addChild(this.label1)
        this.coin2.addChild(this.label2)
        this.label2.style.fontSize = 24

        this.readyLabel = new TextBox(40,'small-no-pattern-purple')
         this.readyLabel.label.style.fontSize = 32
        // this.readyLabel.style.fill = 0xffffff
        this.readyLabel.pivot.x = this.readyLabel.width / 2;
        this.readyLabel.pivot.y = this.readyLabel.height  / 2
        this.container.addChild(this.readyLabel)
        this.confirmButton = new UILabelButton1(150, 80, 'small-no-pattern-green')
        this.confirmButton.addCenterLabel(window.localizationManager.getLabel('collect')+' x2')
        this.confirmButton.addVideoIcon()
        this.confirmButton.pivot.x = 75
        this.confirmButton.pivot.y = 40
        this.container.addChild(this.confirmButton)
        this.confirmButton.x = 90
        this.confirmButton.y = this.h / 2 - 100
        this.confirmButton.onClick.add(()=>{
            if(this.confirmCallback){
                this.confirmCallback()
                this.confirm()
            }
        })
        this.cancelButton = new UILabelButton1(130, 70, 'small-no-pattern-grey')
        this.cancelButton.pivot.x = 130/2
        this.cancelButton.addCenterLabel(window.localizationManager.getLabel('collect'))

        this.cancelButton.pivot.y = 35
        this.container.addChild(this.cancelButton)
        this.cancelButton.x = -90
        this.cancelButton.y = this.h / 2 - 100

        this.cancelButton.onClick.add(()=>{
            if(this.cancelCallback){
                this.cancelCallback()
                //this.cancelButton()
                this.hide();

            }
        })

        this.coin1.x = this.cancelButton.x
        this.coin2.x = this.confirmButton.x


        this.coin1.y = this.cancelButton.y - 130
        this.coin2.y = this.coin1.y

        this.container.visible = false;

        this.readySin = 0;

    }
    update(delta){
        this.readySin += delta * 8
        this.confirmButton.scale.set(Math.sin(this.readySin) * 0.05 + 0.95)
    }
    show(param)
    {
        this.visible = true;

        this.isShowing = true;
        this.container.visible = true;
        this.background.visible = true;
        this.toRemove = false;
        this.onShow.dispatch(this);
        
        if(param){
            this.confirmCallback = param.onConfirm;
            this.cancelCallback = param.onCancel;            
        }else{
            this.confirmCallback = null;
            this.cancelCallback = null;
        }

        this.label1.text = param.value1
        this.label1.pivot.x = this.label1.width / 2
        this.label1.y = 40

        this.label2.text = param.value2
        this.label2.pivot.x = this.label2.width / 2
        this.label2.y = 40

        this.readyLabel.updateText(param?param.label:'')
        this.readyLabel.pivot.x = this.readyLabel.width / 2;
        this.readyLabel.pivot.y = this.readyLabel.height  / 2

        this.readyLabel.y = -this.h/2

    }
    afterHide(){

    }
    hide(dispatch = true, callback = null)
    {
        if(!this.isShowing){
            return;
        }
        this.isShowing = false;

        TweenLite.to(this.background, 0.25, {alpha:0});
        TweenLite.to(this.container, 0.25, {alpha:0});
        TweenLite.to(this.popUp.scale, 0.25,
        {
            x: 0,
            y: 1.5,
            ease: Back.easeIn,
            onComplete: () =>
            {
                if(dispatch){
        		  this.onHide.dispatch(this);
                }
                if(callback){
                    callback();
                }
                this.afterHide();
                this.toRemove = true

                this.visible = false;
            }
        })
    }
    confirm()
    {
        this.onConfirm.dispatch(this);
        this.hide();
    }
    close()
    {
        this.onClose.dispatch(this);
        this.hide();
    }
}