import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
import TweenLite from 'gsap';

export default class BackgroundEffects extends PIXI.Container{
	constructor(){

		super();
// 0x3B61A0, 0x313984
		window.SKYCOLOR = 
		{
			morning:{
				top:0xF8B5FF,
				bottom:0x979EFF,
				backBuildings:0x3065AD,
				frontBuildings:0x6C90FF,
				layer1:0x7193FF,
				layer2:0xD5ACFF,
				front:0x1B1923,
				shadow:0x000000,
				slot:0x000000,
			},
			night:{
				top:0x313984,
				bottom:0x3B61A0,
				backBuildings:0x2E3386,
				frontBuildings:0x3245AC,
				layer1:0x3245AC,
				layer2:0x3A6EFF,
				front:0x1B1923,
				shadow:0x000000,
				slot:0xFFFFFF,
			},
			day:{
				top:0xFFCA58,
				bottom:0xFF9258,
				backBuildings:0xB74745,
				frontBuildings:0xF87654,
				layer1:0xFE7B56,
				layer2:0xFFB658,
				front:0x1B1923,
				shadow:0x000000,
				slot:0xFFCC83,
			}
		}

		window.CURRENT_SKYCOLOR = null;

		this.background =  new PIXI.Graphics().beginFill(0).drawRect(0,0,config.width,config.height);
		this.addChild(this.background);

		this.topGradient  = new PIXI.Sprite(PIXI.Texture.from('env/sky-gradient.png'));
		this.topGradient.width = config.width + 50;
		this.topGradient.height = config.height + 50;
		this.topGradient.x = -25;
		this.topGradient.y = -25;
		this.addChild(this.topGradient);

		this.bottomGradient  = new PIXI.Sprite(PIXI.Texture.from('env/sky-gradient.png'));
		this.bottomGradient.scale.y = -1;
		this.bottomGradient.width = config.width + 50;
		this.bottomGradient.height = config.height + 50;
		this.bottomGradient.x = -25;
		this.bottomGradient.y = this.bottomGradient.height + 25;
		this.addChild(this.bottomGradient);

		this.buildLayer = new PIXI.Container();
		this.backBuildings  = new PIXI.Sprite(PIXI.Texture.from('env/back-build.png'));
		// this.buildLayer.addChild(this.backBuildings);
		this.frontBuildings  = new PIXI.Sprite(PIXI.Texture.from('env/front-build.png'));
		this.buildLayer.addChild(this.frontBuildings);
		// this.addChild(this.buildLayer);
		this.buildLayer.scale.set((config.width * 1.1) / this.buildLayer.width)
		this.buildLayer.x = -10;
		this.buildLayer.y = config.height - this.buildLayer.height - 30;
		this.particles = [];

		this.layer2Container = new PIXI.Container();
		this.layer2  = new PIXI.Sprite(PIXI.Texture.from('env/layer2.png'));
		this.layer2Container.addChild(this.layer2);		
		// this.addChild(this.layer2Container);
		this.layer2Container.scale.set((config.width) / this.layer2Container.width)
		this.layer2Container.x = 0;
		this.layer2Container.y = config.height - this.layer2Container.height - 60;

		this.layer1Container = new PIXI.Container();
		this.layer1  = new PIXI.Sprite(PIXI.Texture.from('env/layer1.png'));
		this.layer1Container.addChild(this.layer1);		
		// this.addChild(this.layer1Container);
		this.layer1Container.scale.set((config.width) / this.layer1Container.width)
		this.layer1Container.x = 0;
		this.layer1Container.y = config.height - this.layer1Container.height ;

		this.frontLayerContainer = new PIXI.Container();
		this.frontLayer  = new PIXI.Sprite(PIXI.Texture.from('env/front-shape.png'));
		this.frontLayerContainer.addChild(this.frontLayer);		
		this.addChild(this.frontLayerContainer);
		this.frontLayerContainer.scale.set((config.width) / this.frontLayerContainer.width)
		this.frontLayerContainer.x = 0;
		this.frontLayerContainer.y = config.height - this.frontLayerContainer.height + 30;

		this.shadowContainer = new PIXI.Container();
		this.shadow  = new PIXI.Sprite(PIXI.Texture.from('circle-shadow.png'));
		this.shadowContainer.addChild(this.shadow);		
		this.addChild(this.shadowContainer);
		this.shadowContainer.scale.set((config.width) / this.shadowContainer.width)
		this.shadow.anchor.y = 0.5;
		this.shadow.alpha = 0.3;
		this.shadowContainer.x = 0;
		this.shadowContainer.y = config.height// - this.shadowContainer.height;

		this.topGradient.tint = 0x000000;
		this.bottomGradient.tint = 0x000000;
		this.backBuildings.tint = 0x000000;
		this.frontBuildings.tint = 0x000000;
		this.layer1.tint = 0x000000;
		this.layer2.tint = 0x000000;
		this.frontLayer.tint = 0x000000;
		this.shadow.tint = 0x000000;


		if(window.location.hash){
        	var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
    	  	if(hash == 'd'){
				//this.changeColors('day');
    	  	}else{
				this.changeColors();
			}
  		}else{  			
			this.changeColors();
  		}
	}
	changeColors(type = 'morning'){

		CURRENT_SKYCOLOR = SKYCOLOR[type];
		utils.addColorTween(this.topGradient, this.topGradient.tint, SKYCOLOR[type].top);
		utils.addColorTween(this.bottomGradient, this.bottomGradient.tint, SKYCOLOR[type].bottom);
		utils.addColorTween(this.backBuildings, this.backBuildings.tint, SKYCOLOR[type].backBuildings);
		utils.addColorTween(this.frontBuildings, this.frontBuildings.tint, SKYCOLOR[type].frontBuildings);
		utils.addColorTween(this.layer1, this.layer1.tint, SKYCOLOR[type].layer1);
		utils.addColorTween(this.layer2, this.layer2.tint, SKYCOLOR[type].layer2);
		utils.addColorTween(this.frontLayer, this.frontLayer.tint, SKYCOLOR[type].front);
		utils.addColorTween(this.shadow, this.shadow.tint, SKYCOLOR[type].shadow);
		
		// console.log(this.toRGB(SKYCOLOR[type].layer2));
		// let rgb = this.toRGB(SKYCOLOR[type].layer2)
		// console.log(this.rgbToColor(rgb.r,rgb.g,rgb.b));
	}
	
}