import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
import TopHUD  from './TopHUD';
export default class InGameHUD extends PIXI.Container{
	constructor(game){
		super();
		this.game = game;

		this.topHUD = new TopHUD(game);
		this.topHUD.y = DIMENSIONS.TOP_HUD_MARGIN/2
		this.addChild(this.topHUD);

		// this.topHUD.y = config.height * 0.02
		this.buildDebugUI();

		this.gameOverContainer = new PIXI.Container();
		this.addChild(this.gameOverContainer)
		 this.pointsLabel = new PIXI.Text(0, {
            fontFamily: 'blogger_sansregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'right'
        });

		 this.roundsLabel = new PIXI.Text(0, {
            fontFamily: 'blogger_sansregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'right'
        });

		 this.roundsLabel.y = 100
		 this.cardBg = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0,0,config.width * 0.8, config.height * 0.5, 0);
		 this.gameOverContainer.addChild(this.cardBg);
		 this.gameOverContainer.addChild(this.pointsLabel);
		 this.gameOverContainer.addChild(this.roundsLabel);

	}
	updateHUD(gameplayData){

		this.topHUD.updateHUD(gameplayData);

		 // reset(){
   //  	this.currentPoints = 0;
   //  	this.currentRound = 0;
   //  	this.maxMoves = 9999;	
   //  }
   //  getRoundsToDie(){
   //  	return this.maxMoves - this.currentRound;
   //  }

	}
	showGameOver(gameplayData, delay){
		this.pointsLabel.text = gameplayData.currentPoints
		this.roundsLabel.text = gameplayData.currentRound

		this.pointsLabel.pivot.x = this.pointsLabel.width / 2;
        this.pointsLabel.pivot.y = this.pointsLabel.height / 2;
        this.roundsLabel.pivot.x = this.roundsLabel.width / 2;
        this.roundsLabel.pivot.y = this.roundsLabel.height / 2;

        this.pointsLabel.x = this.contentW/2;
        this.pointsLabel.y = this.contentH/2 - 30;
        this.roundsLabel.x = this.contentW/2;
        this.roundsLabel.y = this.contentH/2 + 30;

        this.gameOverContainer.x = config.width * 0.5
		this.gameOverContainer.y = config.height * 0.5

		TweenLite.to(this.topHUD, 0.75, {delay:delay,y:-this.topHUD.height, ease:Back.easeIn});
		TweenLite.from(this.gameOverContainer.scale, 1, {delay:delay,x:0.8, y:0.8, ease:Back.easeOut});
		TweenLite.to(this.gameOverContainer, 0.75, {delay:delay,alpha:1});
	}
	resetRoundsCounter(gameplayData, time){
		this.topHUD.y = 0;
		this.topHUD.resetRoundsCounter(gameplayData, time);
	}
	build(levelData){
		this.topHUD.build(levelData);
		this.contentW = config.width * 0.5
		this.contentH = config.height * 0.5
		this.cardBg.clear().beginFill(0xFFFFFF).drawRoundedRect(0,0,this.contentW, this.contentH, CARD.width / 2);
		this.cardBg.alpha = 0.1;

		this.gameOverContainer.alpha = 0;

		this.pointsLabel.pivot.x = this.pointsLabel.width / 2;
        this.pointsLabel.pivot.y = this.pointsLabel.height / 2;
        this.roundsLabel.pivot.x = this.roundsLabel.width / 2;
        this.roundsLabel.pivot.y = this.roundsLabel.height / 2;

        this.pointsLabel.x = this.contentW/2;
        this.pointsLabel.y = this.contentH/2 - 30;
        this.roundsLabel.x = this.contentW/2;
        this.roundsLabel.y = this.contentH/2 + 30;

        this.gameOverContainer.pivot.x = this.gameOverContainer.width / 2;
        this.gameOverContainer.pivot.y = this.gameOverContainer.height / 2;
		
	}
	buildDebugUI(){
		this.debugButton1 = new PIXI.Sprite(PIXI.Texture.from('button0001.png'));
		this.debugButton1.interactive = true;
		this.debugButton1.buttonMode = true;
		this.debugButton1.scale.set(0.5);
		this.debugButton1.alpha = 0
		this.debugButton1.on('mouseup', this.game.levelWin.bind(this.game)).on('touchend', this.game.levelWin.bind(this.game));
		// this.debugButton1.on('mouseup', this.startNewLevel.bind(this.game)).on('touchend', this.startNewLevel.bind(this.game));
		this.addChild(this.debugButton1)


		// this.debugButton2 = new PIXI.Sprite(PIXI.Texture.from('button0001.png'));
		// this.debugButton2.interactive = true;
		// this.debugButton2.buttonMode = true;
		// this.debugButton2.scale.set(0.5);
		// this.debugButton2.alpha = 0
		// this.debugButton2.x = config.width - this.debugButton2.width
		// // this.debugButton2.on('mouseup', this.redirectToInit.bind(this.game)).on('touchend', this.redirectToInit.bind(this.game));
		// this.debugButton2.on('mouseup', this.game.levelWin.bind(this.game)).on('touchend', this.game.levelWin.bind(this.game));
		// this.addChild(this.debugButton2)

	}

}