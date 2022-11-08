import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class ChestContainer extends PIXI.Container
{
    constructor()
    {
        super();
        this.onConfirm = new Signals();
        this.container = new PIXI.Container();
        this.chestSin = 0;

        this.chestBubble = new PIXI.Sprite.from('results_newcat_rays_02');
        this.chestBubble.anchor.set(0.5, 0.5);
        this.chestBackSin = 0;
        let chestIcon = new PIXI.Sprite.from('treasure_chest');
        chestIcon.anchor.set(0.5, 0.5);
        chestIcon.scale.set(this.chestBubble.width / chestIcon.width * 0.75);

        this.quantchest = new PIXI.Text('Open a free\nchest!\n35:05',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        // chestIcon.x = -this.chestBubble.width * 0.15;

        this.quantchest.pivot.x = 0 //this.quantchest.width / 2;
        this.quantchest.pivot.y = 0 //this.quantchest.height / 2;

        this.container.addChild(this.chestBubble);
        this.container.addChild(chestIcon);
        this.container.addChild(this.quantchest);
        this.addChild(this.container)
        this.containerScale = config.width / this.container.width * 0.35
        this.container.scale.set(this.containerScale)

        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.on('mousedown', this.onChestClick.bind(this)).on('touchstart', this.onChestClick.bind(this));
        //this.actualTime = 
        // this.quantchest.pivot.x = this.quantchest.width / 2;
        // this.quantchest.pivot.y = this.quantchest.height / 2;
        // this.quantchest.scale.set((this.chestBubble.width /this.chestBubble.scale.x) / (this.quantchest.width / this.quantchest.scale.x) * 0.75)

        this.updateTimer();
        this.timerInterval = setInterval(() =>
        {
            this.now = new Date().getTime();
            this.updateTimer();
        }, 1000);

    }
    activeContainer()
    {
        this.quantchest.text = 'OPEN YOUR\nFREE CHEST'
        this.quantchest.scale.set((this.chestBubble.width / this.chestBubble.scale.x) / (this.quantchest.width / this.quantchest.scale.x) * 0.75)
            // this.quantchest.pivot.x = this.quantchest.width / 2;
        this.quantchest.pivot.y = this.quantchest.height / 2;
        this.quantchest.x = -this.quantchest.width / 2;
        this.quantchest.y = this.chestBubble.height / 2 //- this.quantchest.height / 4
        this.chestBubble.visible = true;
        this.isActive = true;

        // TweenLite.to(this.container.scale, 0.75, {x:this.containerScale, y:this.containerScale, ease:Elastic.easeOut})
    }
    updateTimer()
    {
        // 	let distance = this.countDownDate - this.now;
        this.container.scale.set(this.containerScale * 0.75)
        let now = new Date();

        let distance = GAME_DATA.chestData.chestTime - (now - GAME_DATA.chestData.lastChestTime)
            // console.log(GAME_DATA.chestData.chestTime, distance);
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // console.log(minutes, seconds);
        if (minutes <= 0 && seconds <= 0)
        {
            clearInterval(this.timerInterval);
            this.activeContainer();
            return
        }
        this.isActive = false;
        this.chestBubble.visible = false;
        if (seconds < 10)
        {
            seconds = '0' + seconds;
        }
        if (minutes < 10)
        {
            minutes = '0' + minutes;
        }
        this.quantchest.text = 'FREE CHEST IN\n' + minutes + ':' + seconds
        this.quantchest.scale.set((this.chestBubble.width / this.chestBubble.scale.x) / (this.quantchest.width / this.quantchest.scale.x) * 0.75)

        this.quantchest.pivot.y = this.quantchest.height / 2;
        this.quantchest.x = -this.quantchest.width / 2;
        this.quantchest.y = this.chestBubble.height / 2 + 5 //- this.quantchest.height / 4


        // this.quantchest.text = dist.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
        // this.quantchest.text = GAME_DATA.chestData.lastChestTime.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
    }
    onChestClick()
    {
        if (!this.isActive)
        {
            this.shake();
            return;
        }

        FBInstant.logEvent(
            'free_chest',
            1,
            {
                type: 'open',
            },
        );

        this.onConfirm.dispatch();

        GAME_DATA.chestData.lastChestTime = new Date();
        this.updateTimer();
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() =>
        {
            this.now = new Date().getTime();
            this.updateTimer();
        }, 1000);
    }
    update(delta)
    {
        if (this.isActive)
        {
            this.chestSin += 0.05
            this.chestSin %= Math.PI * 2;
            this.chestBackSin += 0.1;
            this.chestBackSin %= Math.PI;

            this.chestBubble.rotation = this.chestBackSin
        }
        // this.container.rotation = Math.sin(this.chestSin) * 0.1 + 0.2
        // this.quantchest.rotation = -this.container.rotation
        this.container.scale.set(this.containerScale + Math.sin(this.chestSin) * 0.03, this.containerScale + Math.cos(this.chestSin) * 0.03)
    }

    shake(force = 0.25, steps = 5, time = 0.4)
    {
        SOUND_MANAGER.play('boing');
        let timelinePosition = new TimelineLite();
        let positionForce = (force * -20);
        let spliterForce = (force * 20);
        let pos = [positionForce * 2, positionForce, positionForce * 2, positionForce, positionForce * 2, positionForce]
        let speed = time / pos.length;

        for (var i = pos.length; i >= 0; i--)
        {
            timelinePosition.append(TweenLite.to(this.container, speed,
            {
                rotation: i % 2 == 0 ? 0.1 : -0.1,
                // x: this.container.width / 2 + pos[i], //- positionForce / 2,
                // y: 0, //Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.container, speed,
        {
            rotation: 0,
            // x: this.container.width / 2,
            // y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}