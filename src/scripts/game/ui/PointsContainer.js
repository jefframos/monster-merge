import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class PointsContainer extends PIXI.Container
{
    constructor()
    {
        super();

        this.pointsContainer = new PIXI.Container();

        this.currentPointsSprite = new PIXI.Sprite.from('l0_spader_1_1');
        this.currentPointsSprite.scale.set(config.height / this.currentPointsSprite.height * 0.08)
        this.pointsContainer.addChild(this.currentPointsSprite);

        this.pointsLabelInfo = new PIXI.Text('YOUR SCORE',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '22px',
            fill: 0xff0000,
            align: 'center',
            fontWeight: '800'
        });
        this.pointsLabelInfo.pivot.x = this.pointsLabelInfo.width / 2;
        this.pointsLabelInfo.pivot.y = this.pointsLabelInfo.height;
        this.pointsLabelInfo.y = -this.pointsLabelInfo.height;
        this.currentPointsSprite.addChild(this.pointsLabelInfo);
        this.currentPointsSprite.y = 10

        this.currentPointsLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '60px',
            fill: 0xff0000,
            align: 'center',
            fontWeight: '800'
        });
        this.currentPointsLabel.pivot.x = this.currentPointsLabel.width / 2;
        this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;
        this.currentPointsLabel.y = 10;
        this.currentPointsSprite.anchor.set(0.5);
        this.currentPointsSprite.addChild(this.currentPointsLabel);


        this.currentHighscoreSprite = new PIXI.Sprite.from('l0_spader_1_1');
        this.currentHighscoreSprite.scale.set(config.height / this.currentHighscoreSprite.height * 0.08)
        this.pointsContainer.addChild(this.currentHighscoreSprite);

        this.higscoreLabelInfo = new PIXI.Text('ALL TIME BEST',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '22px',
            fill: 0xff0000,
            align: 'center',
            fontWeight: '800'
        });
        this.higscoreLabelInfo.pivot.x = this.higscoreLabelInfo.width / 2;
        this.higscoreLabelInfo.pivot.y = this.higscoreLabelInfo.height;
        this.higscoreLabelInfo.y = -this.higscoreLabelInfo.height;
        this.currentHighscoreSprite.addChild(this.higscoreLabelInfo);

        this.higscoreLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '60px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.higscoreLabel.pivot.x = this.higscoreLabel.width / 2;
        this.higscoreLabel.pivot.y = this.higscoreLabel.height / 2;
        this.higscoreLabel.y = 10;
        this.currentHighscoreSprite.anchor.set(0.5);
        this.currentHighscoreSprite.addChild(this.higscoreLabel);
        this.currentHighscoreSprite.y = this.currentPointsSprite.height + 10 + this.currentPointsSprite.y



        this.coinsContainer = new PIXI.Container();
        this.coinSprite = new PIXI.Sprite.from('l0_spader_1_1');
        this.coinsContainer.addChild(this.coinSprite);
        this.coinSprite.anchor.set(0, 0.5);

        this.moneyLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '48px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.moneyLabel.pivot.y = this.moneyLabel.height / 2;
        this.coinsContainer.addChild(this.moneyLabel);

        this.coinSprite.scale.set(this.currentPointsSprite.height / this.coinSprite.height * 0.5)
        this.moneyLabel.scale.set(this.currentPointsSprite.height / this.moneyLabel.height * 0.65)
        this.moneyLabel.x = this.coinSprite.width * 1.25
        this.pointsContainer.addChild(this.coinsContainer);
        // this.coinsContainer.pivot.x = this.coinsContainer.width / 2 - this.coinSprite.width * 0.5;
        this.coinsContainer.pivot.y = this.coinsContainer.height + 15;
        this.currentMoney = 0;
        this.currentPoints = 0;
        // this.coinsContainer.y = -this.coinSprite.height / 2
        this.coinsContainer.x = -this.coinsContainer.width / 2;

        this.addChild(this.pointsContainer);
    }
    erasePoints(delay = 0)
    {
        let moneyObj = {
                current: this.currentPoints
            }
            // let globalCoinPos = this.coinSprite.getGlobalPosition();
            // globalCoinPos.x += this.coinSprite.width / 2

            console.log(this.currentPoints, 'points');
        if(!this.currentPoints || this.currentPoints == 0){
            return
        }

        TweenLite.to(moneyObj, 1,
        {
            delay: delay,
            current: 0,
            onUpdateParams: [moneyObj],
            onUpdate: (moneyObj) =>
            {
                this.currentPointsLabel.pivot.x = this.currentPointsLabel.width / 2;
                this.currentPointsLabel.text = utils.formatPointsLabel(moneyObj.current / MAX_NUMBER);

                SOUND_MANAGER.play('pop')
            },
            onComplete: () =>
            {
                SOUND_MANAGER.play('star_01')
                this.currentPointsLabel.pivot.x = this.currentPointsLabel.width / 2;
                this.currentPointsLabel.text = '0'
            }
        })
    }
    updateMoney(money, force, delay = 0)
    {

        if (force || money == 0)
        {
            this.moneyLabel.text = utils.formatPointsLabel(money / MAX_NUMBER);
            this.coinsContainer.x = -this.coinsContainer.width / 2;
            this.currentMoney = money;
            return;
        }

        if (this.currentMoney == money)
        {
            return
        }

        let tempFormated = utils.formatPointsLabel(money / MAX_NUMBER);

        if (tempFormated == this.moneyLabel.text)
        {
            return
        }

        if (this.currentTween)
        {
            TweenLite.killTweensOf(this.currentTween);
        }
        let moneyObj = {
            current: this.currentMoney,
            target: money
        }

        this.coinSound = 0;
        this.currentMoney = money;
        this.currentTween = TweenLite.to(moneyObj, 0.5,
        {
            delay: delay,
            current: money,
            onUpdateParams: [moneyObj],
            onUpdate: (moneyObj) =>
            {
                this.moneyLabel.text = utils.formatPointsLabel(moneyObj.current / MAX_NUMBER);
                this.coinsContainer.x = -this.coinsContainer.width / 2;

                this.coinSound++;
                if (this.coinSound % 2 == 0)
                {
                    SOUND_MANAGER.play(getCoinSound(), 0.1)
                }
            },
            onComplete: () =>
            {

                this.coinsContainer.x = -this.coinsContainer.width / 2;
            }
        })
    }
    updatePoints(current, high, currentNumber)
    {
        // console.log(current, high);
        this.currentPointsLabel.text = current
        this.higscoreLabel.text = high

        this.currentPoints = currentNumber;

        this.currentPointsLabel.pivot.x = this.currentPointsLabel.width / 2;
        this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;

        this.higscoreLabel.pivot.x = this.higscoreLabel.width / 2;
        this.higscoreLabel.pivot.y = this.higscoreLabel.height / 2;

    }
}