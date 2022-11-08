import * as PIXI from 'pixi.js';
import utils from './utils';

export default class Game {
    constructor(config, screenManager) {
        this.screenManager = screenManager;

        const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;

        this.desktopResolution = {
            width: config.width,
            height: config.height,
        };


        this.ratio = config.width / config.height;
        window.renderer = new PIXI.Application({
            width: config.width,
            height: config.height,
            resolution: Math.max(window.devicePixelRatio, 2),
            antialias: false,
        });
        document.body.appendChild(window.renderer.view);

        this.stage = new PIXI.Container();
        window.renderer.stage.addChild(this.stage)


        this.frameskip = 1;
        this.lastUpdate = Date.now();


        this.forceResizeTimer = 5;

        this.resize()
    }
    initialize(){
        PIXI.ticker.shared.add(this._onTickEvent, this);
        setTimeout(() => {
            this.resize()
        }, 10);
    }
    _onTickEvent(deltaTime) {
        this.dt = deltaTime / 60;
        this.update();

        if(this.forceResizeTimer > 0){
            this.forceResizeTimer -= this.dt;
            //this.resize()
        }
    }
    resize() {
        var w = window.innerHeight
        var h = window.innerWidth;
        if (window.innerWidth / window.innerHeight >= this.ratio) {
            var w = window.innerHeight * this.ratio;
        } else {
            var h = window.innerWidth / this.ratio;
        }

        const width = window.innerWidth || document.documentElement.clientWidth ||
            document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight ||
            document.body.clientHeight;

        var w = width;
        var h = height;
        //this.resolution = { width: window.outerWidth, height: window.outerHeight };
        this.resolution = { width: window.outerWidth, height: window.outerHeight };
        this.innerResolution = { width: w, height: h };

        window.renderer.view.style.position = 'absolute';

        window.renderer.view.style.width = `${this.innerResolution.width}px`;
        window.renderer.view.style.height = `${this.innerResolution.height}px`;




        let sclX = this.innerResolution.width / config.width
        let sclY = this.innerResolution.height / config.height


        let scl = Math.min(sclX, sclY)
        const newSize = {
            width: this.desktopResolution.width * scl,
            height: this.desktopResolution.height * scl,
        };

        window.renderer.view.style.width = `${this.innerResolution.width}px`;
        window.renderer.view.style.height = `${this.innerResolution.height}px`;

  
        window.renderer.view.style.left = '0px'//`${this.innerResolution.width / 2 - (newSize.width) / 2}px`;
        window.renderer.view.style.top = '0px'//`${this.innerResolution.height / 2 - (newSize.height) / 2}px`;
        // window.renderer.view.style.width = `${this.innerResolution.width}px`;
        // window.renderer.view.style.height = `${this.innerResolution.height}px`;
        //window.renderer.view.style.left = `${window.innerWidth / 2 - (this.innerResolution.width) / 2}px`;


        // let sclX = this.innerResolution.width /this.desktopResolution.width //* this.ratio
        // let sclY =  this.innerResolution.height /this.desktopResolution.height //* this.ratio


        // console.log(sclX, sclY)

        // utils.resizeToFitAR
        // let scaleMin = 1//Math.min(sclX, sclY) * this.ratio;
        // if(sclX < sclY){
        //     scaleMin = sclX* this.ratio
        // }else{

        //     scaleMin = sclY* this.ratio
        // }


        //element.scale.set(min)

        if (this.screenManager) {
            //  let sclX = (this.innerResolution.width)/(this.desktopResolution.width) ;
            //  let sclY = (this.innerResolution.height)/(this.desktopResolution.height) ;
            //  let min = Math.min(sclX, sclY);
            // this.screenManager.scale.set(min)
            let newScaleX = newSize.width/this.innerResolution.width
            this.screenManager.scale.x = newScaleX//this.ratio
            let newScaleY = newSize.height/this.innerResolution.height
            this.screenManager.scale.y = newScaleY//this.ratio

//console.log(newScaleX)
            // 	// this.screenManager.pivot.x = this.innerResolution.width / 2 // this.screenManager.scale.x
            this.screenManager.x = this.desktopResolution.width / 2- (this.desktopResolution.width / 2 *newScaleX)///- (this.innerResolution.width / 2 *newScaleX) // this.screenManager.scale.y
            this.screenManager.pivot.y = this.innerResolution.height / 2 - (this.innerResolution.height / 2 /newScaleY) // this.screenManager.scale.y

            // 	this.screenManager.x = 0//window.innerWidth/2 * sclX - this.desktopResolution.width/2* sclX//this.innerResolution.width / 2 // this.screenManager.scale.x
            // 	this.screenManager.y = 0// window.innerHeight/2 * sclY - this.desktopResolution.height/2* sclY // this.screenManager.scale.y

            // 	//console.log(window.appScale)

            this.screenManager.resize(this.resolution, this.innerResolution);
        }
    }


    /**
     * 
     *  let sclX = this.innerResolution.width / config.width
        let sclY = this.innerResolution.height / config.height


        let scl = Math.min(sclX, sclY)
        const newSize = {
            width: this.desktopResolution.width * scl,
            height: this.desktopResolution.height * scl,
        };

        window.renderer.view.style.width = `${newSize.width}px`;
        window.renderer.view.style.height = `${newSize.height}px`;

  
        window.renderer.view.style.left = `${this.innerResolution.width / 2 - (newSize.width) / 2}px`;
        window.renderer.view.style.top = `${this.innerResolution.height / 2 - (newSize.height) / 2}px`;
     * 
     * 
     * 
     */
    update() {
        this.screenManager.update(this.dt)
       // window.renderer.render(this.stage);
    }

    start() {
        //	this.animationLoop.start();
    }

    stop() {
        //	this.animationLoop.stop();
    }
}