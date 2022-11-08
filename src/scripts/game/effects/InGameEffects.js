import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import * as PixiFilters from 'pixi-filters';
export default class InGameEffects
{
    constructor(game)
    {
        this.game = game;


        console.log(PixiFilters);

    }


    addBombAreaBean(cat)
    {
        return
        let angle = Math.PI / 4 //Math.atan2(cat.y - last.y, bomb.x - last.x) + Math.PI / 2;

        let graphicContainer = new PIXI.Container();
        graphicContainer.rotation = angle;
        let graphics = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, cat.width * 2, cat.width * 2);
        graphicContainer.addChild(graphics);
        cat.parent.addChild(graphicContainer);

        graphicContainer.position.set(cat.x, cat.y);
        graphics.pivot.x = graphics.width / 2;
        graphics.pivot.y = graphics.height / 2;
        graphics.scale.set(0, 0)
        graphics.alpha = 0.5;
        TweenLite.to(graphics.scale, 0.5,
        {
            x: 1,
            y: 1
        })
        TweenLite.to(graphicContainer, 0.75,
        {
            alpha: 0,
            onCompleteParams: [graphics],
            onComplete: function(toRemove)
            {
                if (toRemove && toRemove.parent)
                {
                    toRemove.parent.removeChild(toRemove);
                }
            }
        })

    }

    addBean(cat, last, delay = 0.25)
    {
        return
        let angle = -Math.atan2(cat.y - last.y, cat.x - last.x) + Math.PI / 2;

        let distance = utils.distance(cat.x, cat.y, last.x, last.y);
        let target = {
            x: 0,
            y: distance
        }
        let graphicContainer = new PIXI.Container();
        graphicContainer.rotation = angle;
        let graphics = new PIXI.Graphics().lineStyle(cat.width / 4, 0xFFFFFF).moveTo(0, 0).lineTo(0, target.y);
        graphicContainer.addChild(graphics);
        cat.parent.addChild(graphicContainer);
        graphics.alpha = 0.5;

        graphicContainer.position.set(cat.x, last.y);

        graphics.scale.set(2, 1)
        TweenLite.to(graphics.scale, 0.5,
        {
            delay: delay,
            x: 4,
            y: 0
        })
        TweenLite.to(graphics.scale, 0.25,
        {
            delay: 0.5 + delay,
            x: 0
        })
        TweenLite.to(graphicContainer, 0.75,
        {
            delay: delay,
            alpha: 0,
            onCompleteParams: [graphics],
            onComplete: function(toRemove)
            {
                if (toRemove && toRemove.parent)
                {
                    toRemove.parent.removeChild(toRemove);
                }
            }
        })

    }

    specialMode()
    {
        let specContainer = new PIXI.Container();
        let graphics = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, config.width, config.height * 0.1)
        specContainer.addChild(graphics);
        graphics.alpha = 0.5;


        let tempLabel = new PIXI.Sprite(PIXI.Texture.from('text_super_speed'))
        // = new PIXI.Text('MEOWWWWW',
        // {
        //     fontFamily: 'blogger_sansregular',
        //     fontSize: '64px',
        //     fill: 0x000000,
        //     align: 'center',
        //     fontWeight: '800'
        // });
        // tempLabel.pivot.x = tempLabel.width / 2;
        // tempLabel.pivot.y = tempLabel.height / 2;
        SOUND_MANAGER.play('game_gameover');
        tempLabel.scale.set(config.width / tempLabel.width * 0.45);
        tempLabel.anchor.set(0.5);
        tempLabel.x = config.width / 2;
        tempLabel.y = specContainer.height / 2;
        specContainer.addChild(tempLabel);

        this.game.UIContainer.addChild(specContainer);
        specContainer.y = config.height / 2 - specContainer.height / 2;
        this.shake(tempLabel);
        TweenLite.to(specContainer, 0.5,
        {
            delay: 1.2,
            alpha: 0,
            y: specContainer.y - 50,
            onComplete: () =>
            {
                if (specContainer && specContainer.parent)
                {
                    specContainer.parent.removeChild(specContainer);
                }
            }
        })
    }
    update(delta)
    {
        if (this.theGlitchIsBack)
        {

            this.glitchAcc++;

            if (this.glitchAcc % 5 == 0)
            {
                this.fastForward.alpha = this.fastForward.alpha ? 0 : 1
            }
            if (this.glitchAcc % 1 == 0)
            {
                this.glitch.slices = Math.ceil(Math.random() * 6) + 20 //delta * 10;
                this.noise.seed = Math.random();
            }

            this.noiseTexture.y += config.height * 0.4 * delta;

            if (this.noiseTexture.y > config.height)
            {
                this.noiseTexture.y = -this.noiseTexture.height;
            }

            // this.game.filters = [this.glitch]
        }
        if (this.doubleLabel && this.doubleLabel.visible)
        {
            this.doubleLabel.scale.x = this.doubleLabelScale + Math.cos(this.doubleLabelSin) * (this.doubleLabelScale * 0.05)
            this.doubleLabel.scale.y = this.doubleLabelScale + Math.sin(this.doubleLabelSin) * (this.doubleLabelScale * 0.05)
            this.doubleLabelSin += 1/60 * 25//10 * delta
            this.doubleLabelSin %= Math.PI * 2;
        }
    }
    addDoublePoints()
    {
        if (!this.doubleLabel)
        {
            this.doubleLabel = new PIXI.Sprite(PIXI.Texture.from('text_double_points'))
            this.game.UIContainer.addChild(this.doubleLabel);
            this.doubleLabelScale = config.width / this.doubleLabel.width * 0.35
            this.doubleLabel.scale.set(this.doubleLabelScale)
            this.doubleLabel.anchor.set(0.5, 0.5);
            this.doubleLabel.x = config.width * 0.5;
            this.doubleLabel.y = config.height * 0.065 + this.doubleLabel.height / 2;
        }
        this.doubleLabel.visible = true;
        this.doubleLabelSin = 0;
    }
    removeDoublePoints()
    {
        if (this.doubleLabel)
        {
            this.doubleLabel.visible = false;
        }
    }
    removeSpeedUpModeItem()
    {
        this.game.filters = []
        this.theGlitchIsBack = false;
        if (this.fastForward)
        {
            this.fastForward.visible = false;
        }
        if (this.noiseTexture && this.noiseTexture.parent)
        {
            this.noiseTexture.parent.removeChild(this.noiseTexture);
        }
    }
    speedUpModeItem()
    {
        if (!this.glitch)
        {
            this.glitch = new PixiFilters.GlitchFilter();
            this.fastForward = new PIXI.Sprite(PIXI.Texture.from('fast_forward_icon'))
            this.game.UIContainer.addChild(this.fastForward);
            this.fastForward.scale.set(config.width / this.fastForward.width * 0.2)
            this.fastForward.anchor.set(0.5);
            this.fastForward.x = this.fastForward.width * 0.75;
            this.fastForward.y = config.height - this.fastForward.height * 0.75;

            this.noise = new PIXI.filters.NoiseFilter();
            this.noise.noise = 0.1;

            this.rgpSplit = new PixiFilters.RGBSplitFilter();
            this.rgpSplit.red = new PIXI.Point(1.5, 1.5);
            this.rgpSplit.green = new PIXI.Point(-1.5, -1.5);
            this.rgpSplit.blue = new PIXI.Point(1.5, -1.5);

            this.noiseTexture = new PIXI.Sprite(PIXI.Texture.from('fast_forward_noise'))
            this.noiseTexture.scale.set(config.width / this.noiseTexture.width);
        }

        SOUND_MANAGER.play('fastforward')
        
        this.game.UIContainer.addChild(this.noiseTexture)
        this.noiseTexture.y = Math.random() * config.height - this.noiseTexture.height

        this.fastForward.visible = true;
        this.fastForward.alpha = 1;
        this.glitch.slices = 80
        this.glitch.fillMode = 3
        this.glitch.minSize = 1
        this.glitch.offset = 5
        this.glitch.sampleSize = 512
        this.glitch.seed = Math.random()
        this.game.filters = [this.rgpSplit, this.noise, this.glitch]
        this.theGlitchIsBack = true;
        this.glitchAcc = 0;
        // TweenLite.to(this.glitch, 30, {padding: 10000})
    }
    addAutocollectlModeItem()
    {
        if (!this.itemAutocollectContainer)
        {
            this.itemAutocollectContainer = new PIXI.Container();
            this.autocollectGraphic = new PIXI.Graphics().beginFill(0xFF00FF).drawRect(0, 0, config.width, config.height * 0.1)
            this.itemAutocollectContainer.addChild(this.autocollectGraphic);
            this.autocollectGraphic.alpha = 0.2;
            this.autoCollectSprite = new PIXI.Sprite(PIXI.Texture.from('text_auto_rescue'))
            this.itemAutocollectContainer.addChild(this.autoCollectSprite);
        }

        this.itemAutocollectContainer.alpha = 1;

        this.autoCollectSprite.scale.set(config.width / this.autoCollectSprite.width * 0.5);
        TweenLite.from(this.autoCollectSprite.scale, 0.75,
        {
            x: 0,
            y: 0,
            ease: Elastic.easeOut
        })
        this.autoCollectSprite.anchor.set(0.5)
        this.autoCollectSprite.x = config.width / 2;
        this.autoCollectSprite.y = this.autocollectGraphic.height / 2;
        this.itemAutocollectContainer.y = config.height / 2 - this.autocollectGraphic.height / 2;

        // target, force = 3, steps = 12, time = 1

        this.shake(this.autoCollectSprite, 0.5, 15, 3);
        this.game.UIContainer.addChild(this.itemAutocollectContainer);

        TweenLite.to(this.itemAutocollectContainer, 0.5,
        {
            delay: 5,
            alpha: 0,
            y: this.itemAutocollectContainer.y - 50,

        })

    }
    removeAutocollectlModeItem()
    {
        if (this.itemAutocollectContainer && this.itemAutocollectContainer.parent)
        {
            this.itemAutocollectContainer.parent.removeChild(this.itemAutocollectContainer);
        }
    }
    autocollectlMode()
    {
        let specContainer = new PIXI.Container();
        let graphics = new PIXI.Graphics().beginFill(0xFF00FF).drawRect(0, 0, config.width, config.height * 0.1)
        specContainer.addChild(graphics);
        graphics.alpha = 0.5;

        let tempLabel = new PIXI.Sprite(PIXI.Texture.from('text_auto_rescue'))
        tempLabel.anchor.set(0.5);
        tempLabel.scale.set(config.width / tempLabel.width * 0.5);
        tempLabel.x = config.width / 2;
        tempLabel.y = specContainer.height / 2;
        specContainer.addChild(tempLabel);

        this.game.UIContainer.addChild(specContainer);
        specContainer.y = config.height / 2 - specContainer.height / 2;
        this.shake(tempLabel, 0.5);
        TweenLite.to(specContainer, 0.5,
        {
            delay: 1.2,
            alpha: 0,
            y: specContainer.y - 50,
            onComplete: () =>
            {
                if (specContainer && specContainer.parent)
                {
                    specContainer.parent.removeChild(specContainer);
                }
            }
        })
    }

    shake(target, force = 3, steps = 12, time = 1)
    {
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        let startPos = {
            x: target.x,
            y: target.y
        }
        for (var i = steps; i >= 0; i--)
        {
            timelinePosition.append(TweenLite.to(target, speed,
            {
                x: startPos.x + Math.random() * positionForce - positionForce / 2,
                y: startPos.y + Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(target, speed,
        {
            x: startPos.x,
            y: startPos.y,
            ease: Elastic.easeOut
        }));
    }

    addCoinParticles(pos, quant = 1, custom = {}, playSound = true)
    {
        window.screenManager.addCoinsParticles(pos, quant, custom);
        if(playSound){
            SOUND_MANAGER.play(getCoinSound(), 0.3);
        }
    }

    popLabel(pos, label, delay = 0, dir = 1, scale = 1, randonRotation = true)
    {
        // return
        let tempLabel = null;
        if (LABEL_POOL.length)
        {
            tempLabel = LABEL_POOL[0];
            tempLabel.text = label;
            LABEL_POOL.shift();
        }
        else
        {
            tempLabel = new PIXI.Text(label,
            {
                fontFamily: 'blogger_sansregular',
                fontSize: '32px',
                fill: 0xFFFFFF,
                align: 'center',
                stroke: 0x9933CC,
                strokeThickness: 3,
                fontWeight: '800'
            });
        }
        this.game.UIContainer.addChild(tempLabel);
        tempLabel.x = pos.x;
        tempLabel.y = pos.y;
        tempLabel.pivot.x = tempLabel.width / 2;
        tempLabel.pivot.y = tempLabel.height / 2;
        tempLabel.alpha = 0;
        tempLabel.scale.set(0);
        tempLabel.rotation = randonRotation ? Math.random() - 0.5 : 0;
        TweenLite.to(tempLabel.scale, 0.3,
        {
            x: scale,
            y: scale,
            ease: Back.easeOut
        })
        TweenLite.to(tempLabel, 1,
        {
            delay: delay,
            y: tempLabel.y - 50 * dir,
            rotation: 0,
            onStartParams: [tempLabel],
            onStart: function(temp)
            {
                temp.alpha = 1;
            }
        })
        TweenLite.to(tempLabel, 0.5,
        {
            delay: 0.5 + delay,
            alpha: 0,
            onCompleteParams: [tempLabel],
            onComplete: function(temp)
            {
                temp.parent.removeChild(temp);
                LABEL_POOL.push(temp);
            }
        })
    }
}