import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
import PartySlot from '../ui/party/PartySlot';
import RecruitCharPanel from '../ui/party/RecruitCharPanel';
import CharacterSheetPanel from '../ui/party/CharacterSheetPanel';
import UIButton1 from '../ui/UIButton1';
export default class PartyScreen extends Screen {
    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);
        this.frontLayer = new PIXI.Container()
        this.addChild(this.frontLayer);

        this.backBlocker = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height);
        this.backBlocker.alpha = 0.5;
        this.backBlocker.interactive = true;
        this.backBlocker.buttonMode = true;
        this.backBlocker.visible = false;

        this.frontLayer.addChild(this.backBlocker);

        this.partyContainer = new PIXI.Container()
        this.container.addChild(this.partyContainer);

        let p = {
            w: 0.8,
            h: 0.4
        }
        this.partyContainerArea = new PIXI.Graphics()
            .beginFill(0)
            .drawRect(0, 0, config.width * p.w, config.height * p.h);
        this.partyContainerArea.x = config.width * (1 - p.w) / 2;
        this.partyContainerArea.alpha = 0.5
        this.partyContainer.addChild(this.partyContainerArea);

        this.slots = [];

        this.slotPadding = {
            x: config.width * 0.05,
            y: config.width * 0,
        }
        this.slotSize = {
            width: (this.partyContainerArea.width + this.slotPadding.x) / HEROES_GRID[0].length,
            height: (this.partyContainerArea.height + this.slotPadding.y) / HEROES_GRID.length
        }


        for (var i = 0; i < PARTY_DATA.currentParty.length; i++) {
            let temp = []
            for (var j = 0; j < PARTY_DATA.currentParty[i].length; j++) {
                temp.push(0)
            }
            this.slots.push(temp);
        }

        for (var i = 0; i < PARTY_DATA.currentParty.length; i++) {
            for (var j = 0; j < PARTY_DATA.currentParty[i].length; j++) {
                let slotID = PARTY_DATA.currentParty[i][j];
                this.addSlot(i, j, slotID);
            }
        }

        this.adjustSlotsPosition();

        this.partyContainer.y = config.height - this.partyContainerArea.height - config.height * 0.25;
        this.entityDragSprite = new PIXI.Sprite.from('');
        this.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));


        this.playButton = new UIButton1(0x5599ff, 'smallButton')
        //this.playButton2.addLabelRight("PARTY")
        this.playButton.onClick.add(() => {
            this.onClickPlay()
        })
        this.container.addChild(this.playButton)
        //this.playButton.scale.set(config.height / this.playButton.height * 0.1)

        this.playButton.x = config.width - this.playButton.width * 1.5
        this.playButton.y = config.height - this.playButton.height * 1.5

        this.playButton.visible = false;

        this.playButton2 = new UIButton1(0xaa99ff, 'smallButton')
        //this.playButton2.addLabelRight("PARTY")
        this.playButton2.onClick.add(() => {
            this.onClickPlay2()
        })

        this.container.addChild(this.playButton2)
        //this.playButton2.scale.set(config.height / this.playButton2.height * 0.1)
        this.playButton2.x = this.playButton.x - this.playButton2.width * 1.5
        this.playButton2.y = config.height - this.playButton2.height * 1.5
        this.playButton2.visible = true;

        this.resetDataButton = new UIButton1(0, 'icon-trash')
        this.resetDataButton.onClick.add(() => {
            this.onClickReset()
        })

        this.container.addChild(this.resetDataButton)
        //this.resetDataButton.scale.set(config.height / this.resetDataButton.height * 0.1)

        this.resetDataButton.x = this.resetDataButton.width * 0.5
        this.resetDataButton.y = this.resetDataButton.height * 0.5


        this.backButton = new UIButton1(0, 'icon-home')
        this.backButton.onClick.add(() => {
            this.onClickBack()
        })
        this.container.addChild(this.backButton)
        //this.backButton.scale.set(config.height / this.backButton.height * 0.1)

        this.backButton.x = this.backButton.width * 0.5
        this.backButton.y = config.height - this.backButton.height * 1.5

        this.verifyEntities();


        let panelSize = {
            w: config.width * 0.7,
            h: config.height * 0.6
        }
        this.recruitCharPanel = new RecruitCharPanel(panelSize);
        this.frontLayer.addChild(this.recruitCharPanel);

        this.recruitCharPanel.x = config.width / 2 - panelSize.w / 2;
        this.recruitCharPanel.y = config.height / 2 - panelSize.h / 2;
        this.recruitCharPanel.hide();
        this.recruitCharPanel.onItemSelect.add((itemData) => {
            this.addEntity(this.currentSelectedSlot, itemData);
        })
        this.recruitCharPanel.onShowInfo.add((itemData, t) => {
            this.showCharacterSheet(itemData);
        })

        this.characterSheetPanel = new CharacterSheetPanel(panelSize);
        this.frontLayer.addChild(this.characterSheetPanel);

        this.characterSheetPanel.x = config.width / 2 - panelSize.w / 2;
        this.characterSheetPanel.y = config.height / 2 - panelSize.h / 2;
        this.characterSheetPanel.hide();
        this.characterSheetPanel.onItemSelect.add((itemData) => {
            this.addEntity(this.currentSelectedSlot, itemData);
        })

        this.characterSheetPanel.onRemoveFromParty.add((slot)=>{
            this.removeEntity(slot)
        })

        //this.addTrashSlot();

        const urlParams = new URLSearchParams(window.location.search);
        let levelRedirectParameters = urlParams.get('opensheet')

        if (levelRedirectParameters) {
            this.tryToOpenFirstCharSheet();
        }

    }
    tryToOpenFirstCharSheet() {
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j].charData) {
                    this.openRecruitList(this.slots[i][j])
                }
            }
        }
    }
    adjustSlotsPosition() {
        let lastLine = this.slots[this.slots.length - 1][0]
        let diff = this.partyContainerArea.height - (lastLine.y + lastLine.backSlot.height / lastLine.backSlot.scale.y)
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                this.slots[i][j].y += diff * 0.5
            }
        }
    }
    verifyEntities() {
        this.playButton.visible = PARTY_DATA.hasParty();
    }
    hideBlocker() {
        this.backBlocker.visible = false;
    }
    showBlocker() {
        //this.backBlocker.visible = true;
    }
    onClickBlocker() {
        this.hideRecruitList();
        this.hideBlocker();
    }
    hideRecruitList() {
        //this.recruitCharPanel.hide();
        this.showBlocker();
        this.characterSheetPanel.hide();
    }
    showCharacterSheet(charData, slot = null){
        
        this.showBlocker();
        this.characterSheetPanel.show(charData, slot);
    }
    openRecruitList(slot) {
        if (slot.charData) {
            this.currentSelectedSlot = slot;
            this.showCharacterSheet(slot.charData, slot);
            console.log(slot.charData)
            return
        }
        this.showBlocker();
        this.currentSelectedSlot = slot;
        this.recruitCharPanel.show();
    }
    onClickReset(e) {
        PARTY_DATA.RESET();
    }
    onClickPlay(e) {
        this.screenManager.redirectToGame();
    }
    onClickPlay2(e) {
        this.screenManager.redirectToGame(true);
    }
    onClickBack(e) {
        this.screenManager.change('MainScreen');
    }
    
    addSlot(i, j, type) {
        let slot = new PartySlot(i, j, this.slotSize.width);
        this.slots[i][j] = slot;
        slot.scale.set((this.slotSize.width - this.slotPadding.x) / slot.width)
        slot.x = this.slotSize.width * j + this.partyContainerArea.x;
        slot.y = this.slotSize.height * i + this.partyContainerArea.y //+ slot.height / 2;

        slot.onClick.add((slot) => {
            this.openRecruitList(slot)
            // this.addEntity(slot)
        });
        slot.onHold.add((slot) => {
            this.startDrag(slot)

        });
        slot.onEndHold.add((slot) => {
            this.endDrag(slot)

        });
        slot.onUp.add((slot) => {
            this.releaseEntity(slot)
        });


        this.partyContainer.addChild(slot);

        if (type) {
            slot.addEntity(PARTY_DATA.getCharData(type.type));
        }
    }
    addEntity(slot, itemData) {
        console.log('add', itemData, slot.id);
        PARTY_DATA.addNewEntity(itemData.classType, slot.id, 0);
        slot.addEntity(PARTY_DATA.getCharData(itemData.classType));
        this.updatePartyData();
        this.verifyEntities();
        this.hideRecruitList();
        this.hideBlocker();
    }
    startDrag(slot) {
        this.draggingEntity = true;
        let tex = slot.hideSprite();
        this.currentDragSlot = slot;
        // console.log(tex);
        this.entityDragSprite.texture = tex;
        this.entityDragSprite.visible = true;
        this.entityDragSprite.scale.set(slot.scale.x);
        this.entityDragSprite.x = this.mousePosition.x;
        this.entityDragSprite.y = this.mousePosition.y;
        this.entityDragSprite.anchor.set(0.5, 1.5);
    }
    endDrag(slot) {
        this.draggingEntity = false;
        this.entityDragSprite.visible = false;
        slot.showSprite();
        // this.currentDragSlot = null;
    }
    removeEntity(slot) {
        if (this.currentDragSlot) {
            //return
            this.currentDragSlot.removeEntity();
            slot = this.currentDragSlot
        }else{
            slot.removeEntity();
        }

        PARTY_DATA.removeEntity(slot.id);
        this.updatePartyData();

        this.verifyEntities()

    }
    releaseEntity(slot) {
        if (!this.currentDragSlot) {
            return;
        }
        let copyData = PARTY_DATA.getStaticCharData(this.currentDragSlot.charData.classType);
        let copyDataTargetSlot = null;
        if (slot.charData) {
            copyDataTargetSlot = PARTY_DATA.getStaticCharData(slot.charData.classType);
        }

        slot.removeEntity();
        PARTY_DATA.removeEntity(slot.id);
        slot.addEntity(copyData);
        PARTY_DATA.addNewEntity(copyData.classType, slot.id, 0);

        this.currentDragSlot.removeEntity();
        PARTY_DATA.removeEntity(this.currentDragSlot.id);
        if (copyDataTargetSlot) {
            this.currentDragSlot.addEntity(copyDataTargetSlot);
            PARTY_DATA.addNewEntity(copyDataTargetSlot.classType, this.currentDragSlot.id, 0);
        } else {

        }

        this.draggingEntity = false;
        this.currentDragSlot = null;
        this.updatePartyData();

    }
    onMouseMove(e) {
        this.mousePosition = e.data.global;
        if (!this.draggingEntity) {
            return;
        }
        if (this.entityDragSprite.visible) {
            this.entityDragSprite.x = this.mousePosition.x;
            this.entityDragSprite.y = this.mousePosition.y;
        }
    }
    updatePartyData() {
        PARTY_DATA.updatePartyData(this.slots, 0)
    }
    onAdded() {


    }
    build(param) {
        super.build();
        this.addEvents();
    }
    update(delta) {

        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                this.slots[i][j].update(delta);
                this.slots[i][j].updateDir(this.mousePosition);
            }
        }


    }
    transitionOut(nextScreen) {
        this.removeEvents();
        this.nextScreen = nextScreen;
        setTimeout(function () {
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