import * as PIXI from 'pixi.js';
import config from '../../config';
export default class ShatterParticle extends PIXI.Container {
    constructor(size) {
        super();

        let listParticles = ['particles/p1.png']
        let p = listParticles[Math.floor(Math.random() * listParticles.length)];
        // console.log(p);
        this.graphics = new PIXI.Sprite(PIXI.Texture.from(p)); // new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0,0,size,size);
        this.graphics.anchor.set(0.5);
        this.particleWidth = this.graphics.width
        this.graphics.scale.set(size / this.particleWidth)
        // this.graphics.rotation = Math.PI / 4;
        this.blendMode = PIXI.BLEND_MODES.ADD;
        this.addChild(this.graphics);
        this.velocity = {
            x: 0,
            y: 0
        }

        this.gravity = 0.15

        this.alphaDecress = -0.03
    }
    reset(size) {
        this.graphics.scale.set(1)
        this.graphics.scale.set(size / this.particleWidth)
        this.alpha = 1;
        this.dead = false;
    }
    update(delta) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.velocity.y += this.gravity;

        this.alpha += this.alphaDecress

        if(this.alpha <= 0){
            this.dead = true;
        }
        return

        if (this.x > config.width * 1.2) {
            this.x = -Math.random() * config.width * 0.15;
        } else if (this.x < -config.width * 0.2) {
            this.x = config.width + Math.random() * config.width * 0.15;
        }

        if (this.y > config.height * 1.2) {
            this.y = -Math.random() * config.height * 0.05;
        } else if (this.y < -config.height * 0.2) {
            this.y = config.height + Math.random() * config.height * 0.05;
        }

    }
}