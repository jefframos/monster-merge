import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import StaticCat from '../ui/StaticCat';
export default class PrizeItemContainer extends PIXI.Container
{
    constructor(w, h)
    {
        super();
        this.onFinishShow = new Signals();
        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.topBg = new PIXI.Graphics().beginFill(0x00073f).drawRect(0, 0, w, h);
        this.container.addChild(this.topBg)
        this.topBg.alpha = 0;

        this.itemContainer = new PIXI.Container();
        this.addChild(this.itemContainer);

        this.backTexture = new PIXI.Sprite.from('results_newcat_rays_02');
        this.backTexture.scale.set(this.topBg.width / (this.backTexture.width / this.backTexture.scale.x))
        this.backTexture.anchor.set(0.5);
        this.itemContainer.addChild(this.backTexture)

        this.itemSprite = new PIXI.Sprite.from('results_newcat_rays_02');
        this.itemContainer.addChild(this.itemSprite)
        this.itemSprite.anchor.set(0.5);

        this.itemCat = new StaticCat;
        this.itemContainer.addChild(this.itemCat)
        
        // this.itemSprite.anchor.set(0.5);

        

        this.itemContainer.x = w / 2
        this.itemContainer.y = h / 2

        this.labelContainer = new PIXI.Container();
        this.addChild(this.labelContainer);
        this.labelContainer.y = h;

         this.quantLabel = new PIXI.Text('65',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '28px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
         this.labelContainer.addChild(this.quantLabel)
    }
    setCat(src){
    	this.itemSprite.visible = false;
    	this.itemCat.visible = true;
    	this.itemCat.updateCatTextures(src)
    	this.itemCatScale = this.topBg.width / (this.itemCat.width / this.itemCat.scale.x) * 0.65
    	this.itemCat.scale.set(this.itemCatScale)
    	this.itemCat.animationContainer.y = 0//this.itemCat.animationContainer.height / 2;
    }
    setTexture(texture)
    {
    	this.itemSprite.visible = true;
    	this.itemCat.visible = false;
        this.itemSprite.texture = PIXI.Texture.from(texture);
        this.itemSprite.scale.set(1)
        this.itemScale = this.backTexture.height / this.itemSprite.height * 0.75//this.topBg.width / (this.itemSprite.width / this.itemSprite.scale.x) * 0.75
        
        console.log(this.itemScale, this.backTexture.height, this.itemSprite.height);
        this.itemSprite.scale.set(this.itemScale)
        // console.log(this.topBg.width, this.itemScale, texture, this.itemSprite.width , this.itemSprite.scale.x, this.itemSprite);

    }
    setValue(value = 999){
    	this.quantLabel.text = value;
        this.quantLabel.x = this.topBg.width / 2 - this.quantLabel.width / 2;
    	// this.quantLabel.y = this.quantLabel.height / 3;
    }
    update(delta)
    {
        if (this.visible)
        {
            this.starBackground.rotation += 0.05
        }
    }
    forceHide()
    {
        this.alpha = 0;
    }
    show(delay = 0)
    {
        this.itemSprite.scale.set(0);
        TweenLite.to(this.itemSprite.scale, 0.5,
        {
            delay: delay + 0.1,
            x: this.itemScale,
            y: this.itemScale,
            ease: Back.easeOut,
            onStart:()=>{
                SOUND_MANAGER.play('star_0'+Math.ceil(Math.random() * 3));
            }
        });
        TweenLite.to(this, 0.5,
        {
            delay: delay+0.1,
            alpha: 1
        });
    }
}