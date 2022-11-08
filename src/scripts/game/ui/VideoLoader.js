import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class VideoLoader extends PIXI.Container
{
    constructor()
    {
        super();
        this.onHide = new Signals();

        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.75;
        this.prizeDark.interactive = true;
        this.prizeDark.buttonMode = true;
        // this.prizeDark.on('mousedown', this.hideCallback.bind(this)).on('touchstart', this.hideCallback.bind(this));
        this.addChild(this.prizeDark);

        this.roundLoader = new PIXI.Sprite.from('loading_spinner');
        this.addChild(this.roundLoader);
        this.roundLoader.anchor.set(0.5);
        this.roundLoader.scale.set(config.width / this.roundLoader.width * 0.25)

        this.catLoader = new PIXI.Sprite.from('loading_cat');
        this.addChild(this.catLoader);
        this.catLoader.anchor.set(0.5);
        this.catLoaderScale = this.roundLoader.width / this.catLoader.width * 0.75
        this.catLoader.scale.set(this.catLoaderScale)

        this.roundLoader.x = config.width / 2;
        this.roundLoader.y = config.height / 2;

        this.catLoader.x = config.width / 2;
        this.catLoader.y = config.height / 2;

        this.catRotationSin = 0;
        this.visible = false;
    }
    update(delta)
    {
        if (this.visible)
        {
            this.roundLoader.rotation += 0.25
            this.catRotationSin += delta * 10;
            this.catLoader.rotation = Math.sin(this.catRotationSin) * 0.1
            this.catLoader.scale.set(Math.cos(this.catRotationSin) * 0.05 + this.catLoaderScale, Math.sin(this.catRotationSin) * 0.05 + this.catLoaderScale)
        }
    }
    hideCallback()
    {
        this.onHide.dispatch();
        this.hide();
    }
    hide()
    {
        TweenLite.to(this, 0.5, {alpha:0, onComplete:()=>{
            this.visible = false;
        }})
    }
    show()
    {
        this.visible = true;
        this.catRotationSin = 0;
        this.catLoader.rotation = Math.sin(this.catRotationSin) * 0.1

        this.alpha = 1;
        this.roundLoader.alpha = 0;
        this.catLoader.alpha = 0;
        this.prizeDark.alpha = 0;

        TweenLite.to(this.roundLoader, 0.25, {alpha:1})
        TweenLite.to(this.catLoader, 0.25, {alpha:1})
        TweenLite.to(this.prizeDark, 0.25, {alpha:0.75})

    }
}