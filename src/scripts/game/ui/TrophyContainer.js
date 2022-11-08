import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class TrophyContainer extends PIXI.Container
{
    constructor()
    {
        super();


        this.container = new PIXI.Container();

        this.trophySin = 0;

        this.trophyBubble = new PIXI.Sprite.from('pickup_bubble');
        this.trophyBubble.anchor.set(0.5, 0.5);

        let trophyIcon = new PIXI.Sprite.from(GAME_DATA.trophyData.icon);
        trophyIcon.anchor.set(0.5, 0.5);
        trophyIcon.scale.set( this.trophyBubble.height / trophyIcon.height * 0.3);
        trophyIcon.y = -this.trophyBubble.height * 0.05;
        trophyIcon.x = -this.trophyBubble.height * 0.15;

        this.quantTrophy = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '54px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '800'
        });
        // trophyIcon.x = -this.trophyBubble.width * 0.15;
        this.quantTrophy.pivot.x = this.quantTrophy.width / 2;
        this.quantTrophy.pivot.y = this.quantTrophy.height / 2;
        this.quantTrophy.y = trophyIcon.y+5;
        this.quantTrophy.x = 15;
        // this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;

        let plusIcon = new PIXI.Sprite.from('results_arrow');
        plusIcon.anchor.set(0.5)
        plusIcon.y = this.trophyBubble.height * 0.2;
        plusIcon.x = -this.trophyBubble.width * 0.15 + plusIcon.width / 2;

        this.bonusTrophy = new PIXI.Text('0%',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.bonusTrophy.x = plusIcon.x + plusIcon.width
        this.bonusTrophy.y = plusIcon.y - this.bonusTrophy.height * 0.5

        this.container.addChild(plusIcon);
        this.container.addChild(trophyIcon);
        this.container.addChild(this.quantTrophy);
        this.container.addChild(this.bonusTrophy);
        this.container.addChild(this.trophyBubble);
        this.trophyContainerScale = config.width / this.container.width * 0.25
        this.container.scale.set(this.trophyContainerScale)
        this.addChild(this.container)

        // this.container.x = config.width * 0.2
        // this.container.y = config.height * 0.5


    }
    updateData(data)
    {
        // console.log(data.bonus);
        this.bonusTrophy.text = data.bonus;
        this.quantTrophy.text = data.quant;
        // this.quantTrophy.pivot.x = this.quantTrophy.width / 2;
    }
    update(delta)
    {
        this.trophySin += 0.05
        this.trophySin %= Math.PI * 2;
        this.container.rotation = Math.sin(this.trophySin) * 0.1 - 0.2
        this.container.scale.set(this.trophyContainerScale + Math.cos(this.trophySin) * 0.01, this.trophyContainerScale + Math.sin(this.trophySin) * 0.01)
    }
}