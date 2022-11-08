import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
import UIList from '../ui/uiElements/UIList';
import UIButton1 from '../ui/UIButton1';
export default class MainScreen extends Screen {
    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);

        this.mapContainer = new PIXI.Container();
        this.bottomUI = new UIList();
        this.topUI = new PIXI.Container();

        this.container.addChild(this.mapContainer)
        this.container.addChild(this.topUI)
        this.container.addChild(this.bottomUI)

        this.buildBottom();
    }

    buildBottom() {

        
		this.partyButton = new UIButton1(0, 'smallButton')
        this.partyButton.addLabelRight("PARTY")
        this.partyButton.onClick.add(()=>{
            this.onClickParty()
        })       
        this.partyButton.scale.set(config.height / this.partyButton.height * 0.1)

        
        this.bottomUI.addElement(this.partyButton)


        this.playButton = new UIButton1(0x001122, 'smallButton')
       
        this.playButton.addLabelLeft("PLAY")
        this.playButton.onClick.add(()=>{
            this.onClickPlay()
        })  

        this.playButton.scale.set(config.height / this.playButton.height * 0.1)

        // this.playButton.x = config.width - this.playButton.width * 1.5
        this.bottomUI.addElement(this.playButton)
        this.bottomUI.y = config.height - this.partyButton.height * 1.5
        this.bottomUI.w = config.width
        this.bottomUI.h = this.partyButton.height * 1.5

        this.bottomUI.updateHorizontalList();

    }
    onClickParty() {
    	this.screenManager.change('PartyScreen')
    }
    onClickPlay() {
    	this.screenManager.redirectToGame();
    }
    onAdded() {


    }
    build(param) {
        super.build();
        this.addEvents();
        this.playButton.visible = PARTY_DATA.hasParty()
    }
    update(delta) {

        
    }
    transitionOut(nextScreen) {
        this.removeEvents();
        this.nextScreen = nextScreen;
        setTimeout(function() {
            this.endTransitionOut();
        }.bind(this), 0);
    }
    transitionIn() {
        super.transitionIn();
    }
    destroy() {

    }
    removeEvents() {
        // this.gameplayView.interactive = false;
        // this.screenManager.topMenu.onBackClick.removeAll();
        // this.gameplayView.off('mousemove', this.onMouseMove.bind(this)).off('touchmove', this.onMouseMove.bind(this));
        // this.gameplayView.off('mousedown', this.onTapDown.bind(this)).off('touchstart', this.onTapDown.bind(this));
        // this.gameplayView.off('mouseup', this.onTapUp.bind(this)).off('touchend', this.onTapUp.bind(this)).off('mouseupoutside', this.onTapUp.bind(this));
    }
    addEvents() {
        // console.log(this);
        this.removeEvents();
        // this.screenManager.topMenu.onBackClick.add(this.redirectToInit.bind(this));
        // this.gameplayView.interactive = true;
        // this.gameplayView.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));
        // this.gameplayView.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
        // this.gameplayView.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this)).on('mouseupoutside', this.onTapUp.bind(this));

    }
}