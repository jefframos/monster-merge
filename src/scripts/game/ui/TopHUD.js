import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import CircleCounter from './hud/CircleCounter';
export default class TopHUD extends PIXI.Container {
    constructor(game) {

        super();


        this.background = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, window.DIMENSIONS.TOP_HUD)
        this.background.alpha = 0;
        this.addChild(this.background);
        this.w = config.width;
        this.h = window.DIMENSIONS.TOP_HUD;
        this.margin = {
            x: 40,
            y: window.DIMENSIONS.TOP_HUD
        }
        this.counterRadius = {
            inner:20,
            outer:22,
        }

        this.roundsCounter = new CircleCounter(this.counterRadius.outer, this.counterRadius.inner);
        this.addChild(this.roundsCounter);

        this.roundsCounter.x = this.margin.x//config.width - this.counterRadius.outer - this.margin.x;
        this.roundsCounter.y =  this.h/2//this.h / 2//this.counterRadius.outer/2 + this.h / 2;


        this.pointsLabel = new PIXI.Text(0, {
            fontFamily: 'blogger_sansregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'right'
        });
        this.addChild(this.pointsLabel)


        this.pointsIconBack = PIXI.Sprite.from('particles/p3.png');
        this.pointsIconBack.anchor.set(0.5);
        this.pointsIconBack.scale.set(this.pointsLabel.height / this.pointsIconBack.height * 1.5)
        this.pointsIconBack.y = this.h/2//this.h / 2;
        this.addChild(this.pointsIconBack)

        this.pointsIcon = PIXI.Sprite.from('new-piece.png');
        this.pointsIcon.anchor.set(0.5);
        this.pointsIcon.scale.set(this.pointsLabel.height / this.pointsIcon.height)
        this.pointsIcon.y = this.h/2//this.h / 2;
        this.pointsIcon.x = this.roundsCounter.x + this.pointsIcon.width / 2 + this.margin.x;
        this.pointsIconBack.x = this.pointsIcon.x;
        this.addChild(this.pointsIcon)


        this.roundsLabel = new PIXI.Text(0, {
            fontFamily: 'blogger_sansregular',
            fontSize: '14px',
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.roundsCounter.addChild(this.roundsLabel)

        this.levelName = new PIXI.Text(0, {
            fontFamily: 'blogger_sansregular',
            fontSize: '14px',
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.addChild(this.levelName)
        this.levelName.pivot.x = this.levelName.width / 2;
        this.levelName.x = this.w / 2;

        this.roundsLabel.pivot.x = this.roundsLabel.width / 2;
        this.roundsLabel.pivot.y = this.roundsLabel.height / 2;


        this.pointsLabel.pivot.y = this.pointsLabel.height / 2;
        this.pointsLabel.x = this.pointsIcon.x + 20;
        this.pointsLabel.y = this.pointsIcon.y;

        this.roundsCounter.build(0xFFFFFF,0x340157);
        // this.roundsCounter.build(0xFFFFFF, 0x313984);

    }
    resetRoundsCounter(gameplayData, time = 0.5) {
        this.roundsGoingZero = true;
        let self = this;
        TweenLite.to(gameplayData, time, {
            currentRound: gameplayData.maxMoves,
            onUpdate: function() {
                self.roundsLabel.text = Math.floor(gameplayData.getRoundsToDie());
                self.roundsCounter.update(gameplayData.getRoundsPercentage());
                self.roundsLabel.pivot.x = self.roundsLabel.width / 2;
                self.roundsLabel.pivot.y = self.roundsLabel.height / 2;
            }
        });
    }
    build(levelData) {
        this.roundsGoingZero = false;
        this.levelName.text = levelData.levelName.toUpperCase() + ' ' + levelData.levelPosition;
        this.levelName.pivot.x = this.levelName.width / 2;
        this.levelName.x = this.w / 2;
    }
    updateHUD(gameplayData) {
        this.pointsLabel.text = utils.formatPointsLabel(Math.ceil(gameplayData.currentPointsLabel));

        if (this.roundsGoingZero) {
            return;
        }
        this.roundsLabel.text = gameplayData.getRoundsToDie();
        this.roundsCounter.update(gameplayData.getRoundsPercentage());
        this.roundsLabel.pivot.x = this.roundsLabel.width / 2;
        this.roundsLabel.pivot.y = this.roundsLabel.height / 2;

    }
}