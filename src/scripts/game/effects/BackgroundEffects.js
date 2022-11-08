import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import StarParticle from './StarParticle';
import TweenLite from 'gsap';

export default class BackgroundEffects extends PIXI.Container {
    constructor() {

        super();
        // 0x3B61A0, 0x313984
        window.SKYCOLOR = {
            morning: {
                top: 0x313984,
                // top: 0x4e72c4,
                // bottom: 0x313984,
                bottom: 0xFF00FF,
                front1: 0x8985ff,
                blur: 0x00FF00,
                additiveSky: 0xFF00FF,
                slot: 0xFFFFFF,
            },
            night: {
                top: 0x9900ff,
                // top: 0x9900ff,
                // top: 0x313984,
                bottom: 0x3300FF, //0x313984,
                // bottom: 0x3B61A0,
                front1: 0x8985ff,
                blur: 0x00FF00,
                additiveSky: 0xFF00FF,
                slot: 0xFFFFFF,
            },
            day: {
                top: 0x003399,
                bottom: 0x663399,
                front1: 0x8985ff,
                blur: 0x00FF00,
                additiveSky: 0xFF00FF,
                slot: 0xFFFFFF,
            }
        }

        window.CURRENT_SKYCOLOR = null;

        this.background = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height);
        this.addChild(this.background);

        this.topGradient = new PIXI.Sprite(PIXI.Texture.from('env/sky-gradient.png'));
        this.topGradient.width = config.width + 50;
        this.topGradient.height = config.height + 50;
        this.topGradient.x = -25;
        this.topGradient.y = -25;
        this.addChild(this.topGradient);

        this.bottomGradient = new PIXI.Sprite(PIXI.Texture.from('env/sky-gradient.png'));
        this.bottomGradient.scale.y = -1;
        this.bottomGradient.width = config.width + 50;
        this.bottomGradient.height = config.height + 50;
        this.bottomGradient.x = -25;
        this.bottomGradient.y = this.bottomGradient.height + 25;
        this.addChild(this.bottomGradient);

        this.bigblur = new PIXI.Sprite(PIXI.Texture.from('bigblur.png'));
        this.bigblur.width = config.width + 50;
        this.bigblur.height = config.height + 50;
        this.bigblur.x = -25;
        this.bigblur.y = -25;
        this.bigblur.blendMode = PIXI.BLEND_MODES.ADD;
        this.bigblur.tint = 0
        this.bigblur.alpha = 0.5
        this.addChild(this.bigblur);

        // new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('./assets/images/glitch1.jpg', config.width, config.height))
        this.additiveSky = new PIXI.extras.TilingSprite(PIXI.Texture.from('testefx1.png'), 1080, 1800);
        this.additiveSky.width = config.width * 2;
        this.additiveSky.height = config.height * 2;
        this.additiveSky.blendMode = PIXI.BLEND_MODES.ADD;
        this.additiveSky.tint = 0
        this.additiveSky.alpha = 0.3
        this.additiveSky.scale.set(0.75, 0.5)
        this.addChild(this.additiveSky);

        this.starsContainer = new PIXI.Container();
        this.addChild(this.starsContainer);

        this.addStars();
        this.groundContainer = new PIXI.Container();
        // this.addChild(this.groundContainer);

        this.fogGradient = new PIXI.Sprite(PIXI.Texture.from('env/sky-gradient.png'));
        this.fogGradient.scale.y = -1;
        this.fogGradient.width = config.width + 50;
        this.fogGradient.height = config.height * 0.35;
        this.fogGradient.x = -25;
        this.fogGradient.y = config.height // - 200;
            // this.fogGradient.blendMode = PIXI.BLEND_MODES.ADD;
        this.fogGradient.tint = 0xfed7ff;
        this.groundContainer.addChild(this.fogGradient);


        // let front3Texture = PIXI.Texture.from('env/front3.png');
        // this.front3 = new PIXI.extras.TilingSprite(front3Texture, config.width, front3Texture.height);
        // this.front3.width = config.width * 3;
        // this.front3.anchor.set(0.5, 1);
        // this.front3.x = config.width / 2;
        // this.front3.y = config.height;
        // this.front3.tint = 0x000000;
        // this.groundContainer.addChild(this.front3);


        // let front2Texture = PIXI.Texture.from('env/front2.png');
        // this.front2 = new PIXI.extras.TilingSprite(front2Texture, config.width, front2Texture.height);
        // this.front2.width = config.width * 3;
        // this.front2.anchor.set(0.5, 1);
        // this.front2.x = config.width / 2;
        // this.front2.y = config.height;
        // this.front2.tint = 0x000000;
        // this.groundContainer.addChild(this.front2);


        // let front1Texture = PIXI.Texture.from('env/front1.png');
        // this.front1 = new PIXI.extras.TilingSprite(front1Texture, config.width, front1Texture.height);
        // this.front1.width = config.width * 3;
        // this.front1.anchor.set(0.5, 1);
        // this.front1.x = config.width / 2;
        // this.front1.y = config.height;
        // this.front1.tint = 0x000000;
        // this.groundContainer.addChild(this.front1);


        // let manTexture = PIXI.Texture.from('env/man.png');
        // this.man = new PIXI.Sprite(manTexture);
        // this.man.anchor.set(0.2, 1);
        // this.man.x = config.width - this.man.width;
        // this.man.y = config.height - this.man.height * 0.3;
        // this.man.tint = 0x000000;
        // this.groundContainer.addChild(this.man);


        this.topGradient.tint = 0x000000;
        this.bottomGradient.tint = 0x000000;


        if (window.location.hash) {
            var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
            if (hash == 'd') {
                //this.changeColors('day');
            } else {
                this.changeColors();
            }
        } else {
            this.changeColors();
        }

        this.starsMoveTimer = 0;

        this.starsDeacc = 0.9;

        this.currentSpeed = {
            x: 0,
            y: 0
        }
    }
    changeStates(type = 'start') {
        return
        if (type == 'start') {
            TweenLite.to(this.groundContainer, 2, {
                y: 0
            });
            // this.groundContainer
        }
        if (type == 'load') {
            TweenLite.to(this.groundContainer, 2, {
                y: 400
            });
            // this.groundContainer
        }
    }
    update(delta) {
        // console.log(delta);
        // console.log(this.starsDeacc);
        // if (this.starsMoveTimer > 0) {

        this.additiveSky.tilePosition.y += this.currentSpeed.y * 300;
        // this.additiveSky.tilePosition.y %= this.additiveSky.tilePosition.height;
        for (var i = 0; i < this.stars.length; i++) {
            // this.stars[i].velocity.x *= this.starsDeacc;
            // this.stars[i].velocity.y *= this.starsDeacc;
            this.stars[i].update(delta);
        }
        // this.starsMoveTimer -= delta;
        // }
    }
    addStars() {
        let totalStars = 80;
        this.stars = [];
        for (var i = 0; i < totalStars; i++) {
            let dist = Math.random() * 2 + 1;
            let tempStar = new StarParticle(dist);
            tempStar.alpha = (dist / 3 * 0.6) + 0.2
            let toClose = true;
            let acc = 5;
            while (toClose || acc > 0) {
                acc--;
                let angle = Math.random() * Math.PI * 2;
                let radius = Math.random() * config.height * 0.5 + 20;
                tempStar.x = Math.cos(angle) * radius + config.width / 2;
                tempStar.y = Math.sin(angle) * radius + config.height / 2;
                toClose = false;
                for (var j = 0; j < this.stars.length; j++) {
                    let distance = utils.distance(this.stars[j].x, this.stars[j].y, tempStar.x, tempStar.y)
                    if (distance > 15) {} else {
                        toClose = true;
                        break
                    }
                }
            }
            this.starsContainer.addChild(tempStar);
            this.stars.push(tempStar)
        }
    }

    moveStars(side = 1) {
        // console.log('move', side);
        for (var i = 0; i < this.stars.length; i++) {

            this.stars[i].velocity.x = side * this.stars[i].alpha * 50;
        }
        this.starsMoveTimer = 1;
    }
    moveStarsVertical(speed = 1) {
        // console.log('moveStarsVertical', side);
        this.currentSpeed.y = speed;
        for (var i = 0; i < this.stars.length; i++) {

            this.stars[i].velocity.y = this.currentSpeed.y * this.stars[i].alpha * 550;
        }
        this.starsMoveTimer = 1;
    }
    changeColors(type = 'morning') {

        CURRENT_SKYCOLOR = SKYCOLOR[type];
        utils.addColorTween(this.topGradient, this.topGradient.tint, SKYCOLOR[type].top);
        utils.addColorTween(this.bottomGradient, this.bottomGradient.tint, SKYCOLOR[type].bottom);
        utils.addColorTween(this.bigblur, this.bigblur.tint, SKYCOLOR[type].blur);
        utils.addColorTween(this.additiveSky, this.additiveSky.tint, SKYCOLOR[type].additiveSky);
        // utils.addColorTween(this.front1, this.front1.tint, SKYCOLOR[type].front1);
        // utils.addColorTween(this.front2, this.front2.tint, SKYCOLOR[type].front2);
        // utils.addColorTween(this.front3, this.front3.tint, SKYCOLOR[type].front3);
        utils.addColorTween(this.fogGradient, this.fogGradient.tint, SKYCOLOR[type].fogGradient);
        // utils.addColorTween(this.man, this.man.tint, SKYCOLOR[type].man);
    }

}