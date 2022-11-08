import * as PIXI from 'pixi.js';
// import * as FILTERS from 'pixi-filters';
export default class StaticCat extends PIXI.Container
{
    constructor()
    {
        super();
        this.elementsList = [];
        this.animationContainer = new PIXI.Container();
        this.addChild(this.animationContainer)

        this.bodySin = 0;

        this.currentCatLabel = 'cat_orange_'
        this.zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 10);

        this.normalHead = new PIXI.Texture.from(this.currentCatLabel + 'head_01');
        // this.collectedHead = new PIXI.Texture.from(this.currentCatLabel + 'head_02');
        // this.deadHead = new PIXI.Texture.from(this.currentCatLabel + 'head_03');

        this.head = new PIXI.Sprite.from(this.currentCatLabel + 'head_01');
        this.head.anchor.set(0.5, 0.9)

        this.body = new PIXI.Sprite.from(this.currentCatLabel + 'body');
        this.body.anchor.set(0.5, 0.65)
        this.body.y = this.body.height * 0.5

        this.armsRot = 0 //Math.PI * 0.3


        this.rarm = new PIXI.Sprite.from(this.currentCatLabel + 'arm');
        this.rarm.anchor.set(0.95, 0)
        this.rarm.rotation = this.armsRot
        this.rarm.x = -this.body.width * this.body.anchor.x + this.rarm.width * 1.35;
        this.rarm.scale.set(-1, 1)

        this.larm = new PIXI.Sprite.from(this.currentCatLabel + 'arm');
        this.larm.anchor.set(0.95, 0)
        this.larm.rotation = -this.armsRot

        this.larm.x = this.body.width * this.body.anchor.x - this.larm.width * 1.35;


        this.rleg = new PIXI.Sprite.from(this.currentCatLabel + 'leg');
        this.rleg.anchor.set(0.5, 0.25)
        this.rleg.x = -this.body.width * this.body.anchor.x + this.rleg.width * this.rleg.anchor.x + this.rleg.width * 0.5;
        this.rleg.y = this.body.height * this.body.anchor.y //- this.lleg.height * this.lleg.anchor.y;


        this.lleg = new PIXI.Sprite.from(this.currentCatLabel + 'leg');
        this.lleg.anchor.set(0.5, 0.25)
        this.lleg.x = this.body.width * this.body.anchor.x - this.lleg.width * this.lleg.anchor.x - this.lleg.width * 0.5;
        this.lleg.y = this.body.height * this.body.anchor.y //- this.lleg.height * this.lleg.anchor.y;



        this.animationContainer.addChild(this.lleg);
        this.animationContainer.addChild(this.rleg);
        this.animationContainer.addChild(this.rarm);
        this.animationContainer.addChild(this.larm);
        this.animationContainer.addChild(this.body);
        this.animationContainer.addChild(this.head);
        // this.animationContainer.addChild(this.zero)

        this.animationContainer.y = -this.animationContainer.height * 0.5

        this.lockImage = null;

    }
    unlock()
    {
        this.lleg.tint = 0xFFFFFF;
        this.rleg.tint = 0xFFFFFF;
        this.larm.tint = 0xFFFFFF;
        this.rarm.tint = 0xFFFFFF;
        this.body.tint = 0xFFFFFF;
        this.head.tint = 0xFFFFFF;
        this.animationContainer.filters = null
    }
    lock()
    {
        if (!this.lockImage)
        {


            let whiteFilter = new PIXI.Filter(
                null,
                // fragment shader
                [
                    'precision highp float;',
                    'uniform sampler2D uSampler;',
                    'varying vec2 vTextureCoord;',
                    'uniform vec3 _color;',

                    'void main() {',

                    'vec4 original = texture2D(uSampler, vTextureCoord);',
                    'vec3 color = vec3(1.);',

                    // 'gl_FragColor = original;',
                    'gl_FragColor = vec4(_color, original.a);',
                    'gl_FragColor.rgb *=  original.a;',
                    '}'
                ].join('\n'),
                {
                    _color:
                    {
                        type: 'vec3',
                        value: [229 / 255, 81 / 255, 155 / 255]
                    }
                }
            );

            // whiteFilter.uniforms._color = [1.0, 0, 0]

            this.animationContainer.filters = [whiteFilter];
            // this.animationContainer.cacheAsBitmap = true;
            this.animationContainer.tint = 0xE5519B
            // this.lockImage = this.animationContainer
        }

        return this.animationContainer;
        // let colorMatrix = new PIXI.filters.ColorMatrixFilter();
        // colorMatrix.colorTone  (5,0,0xFFFFFF,0);

    }
    stamp(){
        this.animationContainer.cacheAsBitmap = true;
        return this.animationContainer;
    }
    happy()
    {

        // this.head.texture = this.collectedHead
    }
    sad()
    {

        // this.head.texture = this.deadHead
    }
    normal()
    {
        this.head.texture = this.normalHead
    }
    updateCatTextures(src)
    {
        this.currentCatLabel = src;
        this.lleg.texture = PIXI.Texture.from(this.currentCatLabel + 'leg');
        this.rleg.texture = PIXI.Texture.from(this.currentCatLabel + 'leg');
        this.larm.texture = PIXI.Texture.from(this.currentCatLabel + 'arm');
        this.rarm.texture = PIXI.Texture.from(this.currentCatLabel + 'arm');
        this.body.texture = PIXI.Texture.from(this.currentCatLabel + 'body');
        this.head.texture = PIXI.Texture.from(this.currentCatLabel + 'head_01');
        this.normalHead = PIXI.Texture.from(this.currentCatLabel + 'head_01');
        // this.collectedHead = PIXI.Texture.from(this.currentCatLabel + 'head_02');
        // this.deadHead = PIXI.Texture.from(this.currentCatLabel + 'head_03');
    }
}