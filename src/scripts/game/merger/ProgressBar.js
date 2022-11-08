import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';

export default class ProgressBar extends PIXI.Container {
    constructor(size, border = 0, padding = 0) {
        super();

        this.barContainer = new PIXI.Container();

        this.addChild(this.barContainer);
        this.infoLabel = new PIXI.Text('COMPLETE', { font: '16px', fill: 0xFF0000});
        this.infoLabel.pivot.x = this.infoLabel.width / 2
        this.infoLabel.pivot.y = this.infoLabel.height / 2
        this.barContainer.addChild(this.infoLabel)

        this.infoLabel.x = 125
        this.infoLabel.y = 19

        this.border = border?border:size.height / 2
        this.padding = padding
        this.sizeHeight = size.height
        this.sizeWidth = size.width

        
        this.loadingBar = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('simple-bar'), 4,4,4,4)
        this.loadingBar.width = this.sizeWidth
        this.loadingBar.height = this.sizeHeight
        
        this.loadingBarFillBack = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('simple-bar'), 4,4,4,4)
        this.loadingBarFillBack.width = this.sizeWidth- this.border 
        this.loadingBarFillBack.height = this.sizeHeight- this.border 
        this.loadingBarFillBack.tint = 0;
        
        this.loadingBarFillBack.x = this.border / 2
        this.loadingBarFillBack.y = this.border / 2
        this.loadingBarFillBack.cacheAsBitmap = true;

        //this.loadingBarFill = new PIXI.Sprite.fromFrame('simple-bar')
        this.loadingBarFill = new PIXI.Sprite.fromFrame('simple-bar')
        // new PIXI.mesh.NineSlicePlane(
        //     PIXI.Texture.fromFrame('simple-bar'), 4,4,4,4)
        this.loadingBarFill.width = 0
        this.loadingBarFill.height = this.sizeHeight  - this.border - this.padding//- (this.border - padding  ) 
        this.loadingBarFill.tint = 0xFF0011;
        this.loadingBarFill.x = (this.border + padding) / 2
        this.loadingBarFill.y = (this.border + padding) / 2

        this.loadingBarFill.visible = false;
        //this.loadingBarFill.scale.x = 0;

        this.infoLabel.visible = false;

        this.barContainer.addChild(this.loadingBar)
        this.barContainer.addChild(this.loadingBarFillBack)
        this.barContainer.addChild(this.loadingBarFill)

        this.currentValue = 0;
        this.state = 0;


    }

    updateBackgroundColor(color, alpha = 1){
        this.loadingBarFillBack.tint = color;
        this.loadingBarFillBack.alpha = alpha;
    }
    updateBackgroundFront(color){
        this.currentColor = color;
        this.loadingBarFill.tint = color;
    }

    resizeBar(width, height = 30, hideBorder = false){
        if(width == this.sizeWidth){
            return;
        }
        this.sizeHeight = height;
        this.sizeWidth = width;
        this.loadingBar.width = this.sizeWidth
        this.loadingBar.height = this.sizeHeight

        let add = this.border / 2
        if(hideBorder){
            add = 0;
            this.loadingBarFillBack.position.set(0)
            this.loadingBarFill.position.set(0)
        }
        this.loadingBarFillBack.width = this.sizeWidth- add
        this.loadingBarFillBack.height = this.sizeHeight- add
        this.loadingBarFill.width = this.sizeWidth- add
        this.loadingBarFill.height = this.sizeHeight- add

        this.loadingBar.visible = !hideBorder
        this.setProgressBar(this.currentValue);
    }
  
    setProgressBar(value = 0, color = null) {
        if (value <= 0) {
            return;
        }
       
        this.loadingBarFill.visible = true;
        value = Math.max(value, 0);
        value = Math.min(value, 1);
        //this.loadingBarFill.visible = value > 0.075
        this.currentValue = value;
        this.loadingBarFill.tint = this.currentColor;
        this.loadingBarFill.width =  (this.sizeWidth - this.border * 2  - this.padding) * value + this.border ;

    }
}