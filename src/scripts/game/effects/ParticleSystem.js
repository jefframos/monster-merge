import * as PIXI from 'pixi.js';

import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';

export default class ParticleSystem extends PIXI.Container {
    constructor() {
        super();

        window.LABEL_POOL = [];
        window.COINS_POOL = [];

        this.particles = [];

        this.maxParticles = 60;

        if (window.isMobile) {
            this.maxParticles = 30;
        }

    }

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end
    }
    killAll() {
        for (var i = this.particles.length - 1; i >= 0; i--) {
            let coin = this.particles[i];
            if (coin.parent) {
                coin.parent.removeChild(coin);
            }
            window.COINS_POOL.push(coin);
            this.particles.splice(i, 1)
        }
    }
    update(delta) {
        if (this.particles && this.particles.length) {
            for (var i = this.particles.length - 1; i >= 0; i--) {
                let coin = this.particles[i];
                if (coin.delay <= 0) {
                    coin.x += coin.velocity.x * delta;
                    coin.y += coin.velocity.y * delta;
                    coin.rotation += coin.angSpeed * delta;
                    coin.alpha -= 1 * delta * coin.alphaDecress;

                    if (coin.topLimit && coin.topLimit > coin.y) {
                        coin.alpha = 0;
                    }
                    if (coin.target) {
                        coin.timer -= delta;
                        if (coin.timer <= 0) {
                            let angle = Math.atan2(coin.target.y - coin.y, coin.target.x - coin.x);
                            let targetX = Math.cos(angle) * coin.speed
                            let targetY = Math.sin(angle) * coin.speed

                            if (coin.matchRotation) {
                                coin.rotation = angle
                            }
                            coin.velocity.x = this.lerp(coin.velocity.x, targetX, 0.05)
                            coin.velocity.y = this.lerp(coin.velocity.y, targetY, 0.05)
                            if (utils.distance(coin.x, coin.y, coin.target.x, coin.target.y) < Math.max(coin.height, coin.width) * window.TIME_SCALE) {
                                coin.alpha = 0;
                            }
                        }
                        else {
                            coin.velocity.y += coin.gravity * delta;
                        }

                    }
                    else {
                        coin.velocity.y += coin.gravity * delta;
                    }
                    if (coin.alpha <= 0) {
                        if (coin.parent) {
                            coin.parent.removeChild(coin);
                        }
                        if (coin.callback) {
                            coin.callback();
                        }
                        window.COINS_POOL.push(coin);
                        this.particles.splice(i, 1)
                    }
                } else {
                    coin.delay -= delta;
                }
            }
        }
    }
    kill() {
        if (this.particles && this.particles.length) {
            for (var i = this.particles.length - 1; i >= 0; i--) {
                let coin = this.particles[i];
                if (coin.parent) {
                    coin.parent.removeChild(coin);
                }
                window.COINS_POOL.push(coin);
            }
        }
        this.particles = []
    }

    popLabel(pos, label, delay = 0, dir = 1, scale = 1, style = {}, ease = Back.easeOut, time = 0.5) {
        let tempLabel = null;
        if (window.LABEL_POOL.length > 0) {
            tempLabel = window.LABEL_POOL[0];
            window.LABEL_POOL.shift();
        } else {
            tempLabel = new PIXI.Text(label);
        }
        tempLabel.style = style;
        tempLabel.text = label;

        this.addChild(tempLabel);
        tempLabel.x = pos.x;
        tempLabel.y = pos.y;
        tempLabel.pivot.x = tempLabel.width / 2;
        tempLabel.pivot.y = tempLabel.height / 2;
        tempLabel.alpha = 0;
        tempLabel.scale.set(0);

        scale = Math.min(scale, 3)
        TweenMax.to(tempLabel.scale, 0.5, { delay: delay, x: scale, y: scale, ease: ease })
        TweenMax.to(tempLabel, 1, {
            delay: delay, y: tempLabel.y - 50 * dir, onStartParams: [tempLabel], onStart: function (temp) {
                temp.alpha = 1;
                temp.parent.addChild(temp)
            }
        })
        TweenMax.to(tempLabel, time, {
            delay: time + delay, alpha: 0, onCompleteParams: [tempLabel], onComplete: function (temp) {
                temp.parent.removeChild(temp);
                window.LABEL_POOL.push(temp);
            }
        })
    }
    killAll() {

    }
    show(position, tot = 10, customData = {}) {

        this.totParticles = tot;
        for (var i = 0; i < this.totParticles; i++) {
            if (customData.callback == null && this.particles.length > this.maxParticles) {
                break;
            }
            let coin;
            if (window.COINS_POOL.length) {
                coin = window.COINS_POOL[0];
                window.COINS_POOL.shift();
            }
            if (!coin) {
                coin = new PIXI.Sprite();
            }
            coin.texture = PIXI.Texture.from(customData.texture || 'coin')
            coin.gravity = (customData.gravity != undefined ? customData.gravity : 900)
            coin.alpha = 1
            coin.tint = customData.tint || 0xFFFFFF
            coin.alphaDecress = (customData.alphaDecress != undefined ? customData.alphaDecress : 1)
            coin.x = position.x;
            coin.y = position.y;
            coin.topLimit = (customData.topLimit != undefined ? customData.topLimit : null)

            coin.callback = customData.callback;
            coin.angSpeed = customData.angSpeed || 0
            coin.rotation = 0;
            coin.anchor.set(0.5)
            coin.scale.set(1)
            coin.delay = (customData.delay != undefined ? customData.delay : 0)
            let scl = customData.scale || 0.03
            coin.timer = (customData.timer != undefined ? customData.timer : 0)
            coin.target = customData.target
            coin.matchRotation = false;
            if (coin.target) {
                coin.timer = coin.target.timer;
                coin.speed = coin.target.speed | 500;
                if (!customData.ignoreMatchRotation) {
                    coin.matchRotation = (coin.target.matchRotation != undefined ? coin.target.matchRotation : true);
                }
            }
            coin.scale.set(config.height / (coin.height * coin.scale.y) * (scl))
            let force = {
                x: (customData.forceX != undefined ? customData.forceX : 400),
                y: (customData.forceY != undefined ? customData.forceY : 500)
            }
            coin.velocity = {
                x: (Math.random() * 1 - 0.5) * force.x,
                y: (-Math.random() * 0.5 - 0.5) * force.y,
            }
            let parent = this;
            if (customData.customContainer) {
                parent = customData.customContainer;
            }
            parent.addChild(coin);
            this.particles.push(coin)
        }
    }
}