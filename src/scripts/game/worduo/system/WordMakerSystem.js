import * as PIXI from 'pixi.js';

import LetterSlot from '../ui/LetterSlot';
import Signals from 'signals';
import UIButton1 from '../../ui/UIButton1';
import UIList from '../../ui/uiElements/UIList';
import config from '../../../config';
import utils from '../../../utils';

export default class WordMakerSystem {
    constructor(containers, scrabbleSystem, letters) {

        this.container = containers.mainContainer;
        this.bottomContainer = containers.bottomContainer;
        this.topContainer = containers.topContainer;
        this.wrapper = containers.wrapper;
        this.bottomWrapper = containers.bottomWrapper;
        this.topWrapper = containers.topWrapper;

        this.scrabbleSystem = scrabbleSystem;

        this.letters = letters;

        this.onGetResources = new Signals();
        this.onDealDamage = new Signals();
        this.onPopLabel = new Signals();
        this.onParticles = new Signals();

        this.currentLetterButtons = [];


        this.topHUDButtons = new UIList()
        this.topHUDButtons.w = this.bottomWrapper.width * 0.6
        this.topHUDButtons.h = 50
        this.topContainer.addChild(this.topHUDButtons);
        this.registerButton(this.topHUDButtons, 'icon_reset', 'resetAll', 'Restart')
        //this.topHUDButtons.updateHorizontalList()
        
		this.pointsLabel = new PIXI.Text('Points: ', { font: '24px', fill: 0, align: 'right', fontWeight: '300', fontFamily: MAIN_FONT });
        this.container.addChild(this.pointsLabel);


        this.actionButtons = new UIList()
        this.actionButtons.w = this.bottomWrapper.width * 0.6
        this.actionButtons.h = 50
        this.bottomContainer.addChild(this.actionButtons);

        this.registerButton(this.actionButtons, 'icon-close', 'erase')
        this.registerButton(this.actionButtons, 'results_arrow_left', 'arrowLeft')
        this.registerButton(this.actionButtons, 'results_arrow_right', 'arrowRight')
        this.registerButton(this.actionButtons, 'results_arrow', 'arrowUp')
        this.registerButton(this.actionButtons, 'results_arrow_down', 'arrowDown')

        this.actionButtons.updateHorizontalList()

        this.bottomLetterList = new UIList()
        this.bottomLetterList.w = this.bottomWrapper.width * 0.6
        this.bottomLetterList.h = 50

        this.topLetterList = new UIList()
        this.topLetterList.w = this.bottomWrapper.width * 0.6
        this.topLetterList.h = 50
        this.totalLetters = 10
        this.letterButtons = []
        for (let index = 0; index < this.totalLetters; index++) {
            let button = new UIButton1(0xFFFFFF, null, 0xFFFFFF)
            button.changePivot(0, 0)
            button.updateIconTexture(this.letters['A'])
            button.updateIconScale(0.7)
            button.onClick.add(this.onLetterClick.bind(this, button))
            button.align = 0
            if (index < this.totalLetters / 2) {
                this.topLetterList.addElement(button);
            } else {
                this.bottomLetterList.addElement(button);
            }
            this.letterButtons.push(button)
        }

        this.bottomContainer.addChild(this.bottomLetterList);
        this.bottomLetterList.updateHorizontalList()

        this.bottomContainer.addChild(this.topLetterList);
        this.topLetterList.updateHorizontalList()

        this.slotSize = { width: 60, height: 60, distance: 10, vertical:10 }

        this.maxSlotsPerRow = 5
        this.wordFormations = {
            three: this.buildFormation(3),
            four: this.buildFormation(4),
            four2: this.buildFormation(4),
            five: this.buildFormation(5),
            five2: this.buildFormation(5),
            // six: this.buildFormation(6)
        }



        this.wordFormationsList = new UIList();
        this.wordFormationsList.w = this.maxSlotsPerRow * (this.slotSize.width) + (this.maxSlotsPerRow-1) * this.slotSize.distance
        this.wordFormationsList.h = 6 * (this.slotSize.height + this.slotSize.vertical)

        this.markerList = new UIList();
        this.markerList.w = this.wordFormationsList.w
        this.markerList.h = this.wordFormationsList.h

        this.gameplayData = {
            currentVerticalPosition: 0,
            lists: [],
            positionMarkers: []
        }
        for (const key in this.wordFormations) {
            const element = this.wordFormations[key];
            element.list.updateHorizontalList()
            this.markerList.addElement(element.marker)
            this.wordFormationsList.addElement(element.list)

            this.gameplayData.positionMarkers.push(element.marker);

            this.gameplayData.lists.push({
                currentIDLetter: 0,
                slots: element.slots,
                checker:element.checker
            })

        }
        this.markerList.updateVerticalList();
        this.wordFormationsList.updateVerticalList();
        this.container.addChild(this.markerList)
        this.container.addChild(this.wordFormationsList)

        this.currentSelectedRow = {}
        this.updateCurrentGameState();
        this.startNewRound();


        this.currentPoints = 0;
    }
    arrowUp() {
        this.gameplayData.currentVerticalPosition--;
        if (this.gameplayData.currentVerticalPosition < 0) {
            this.gameplayData.currentVerticalPosition = this.gameplayData.lists.length - 1
        }
        this.currentSelectedRow = this.gameplayData.lists[this.gameplayData.currentVerticalPosition]

        this.updateCurrentGameState();
    }
    arrowDown() {
        this.gameplayData.currentVerticalPosition++;
        this.gameplayData.currentVerticalPosition %= this.gameplayData.lists.length
        this.currentSelectedRow = this.gameplayData.lists[this.gameplayData.currentVerticalPosition]


        this.updateCurrentGameState();
    }
    arrowLeft() {
        this.currentSelectedRow.currentIDLetter--
        if (this.currentSelectedRow.currentIDLetter < 0) {
            this.currentSelectedRow.currentIDLetter = this.currentSelectedRow.slots.length - 1
        }
        this.updateCurrentGameState();

    }
    arrowRight() {
        this.currentSelectedRow.currentIDLetter++
        this.currentSelectedRow.currentIDLetter %= this.currentSelectedRow.slots.length
        this.updateCurrentGameState();
        
    }
    resetAll(){
        this.gameplayData.currentVerticalPosition = 0;
        this.gameplayData.lists.forEach(element => {
            this.resetRow(element)
        });
        this.startNewRound()
        this.updateCurrentGameState();

    }
    erase() {        
        this.resetRow(this.currentSelectedRow)
        this.updateCurrentGameState();
    }
    resetRow(row){
        row.wordFound = '';
        row.currentIDLetter = 0;
        row.checker.addX()
        row.slots.forEach(element => {
            element.removeLetter();
        });
    }
    isAlreadyUsed(word){
        for (let index = 0; index < this.gameplayData.lists.length; index++) {
            const element = this.gameplayData.lists[index];
            if(element.wordFound == word){
                return true;
            }
        }
        return false;
    }
    getCurrentSelectedSlot() {
        return this.currentSelectedRow.slots[this.currentSelectedRow.currentIDLetter]
    }
    updateCurrentGameState() {
        this.gameplayData.positionMarkers.forEach(element => {
            element.visible = false;
        });

        this.gameplayData.lists.forEach(dataList => {
            dataList.slots.forEach(slot => {
                slot.normalState();
            });
        });
        this.currentPoints = 0

        this.gameplayData.lists.forEach(element => {
            if(element.wordFound && element.wordFound != ''){

                this.currentPoints +=  this.scrabbleSystem.countWord(element.wordFound)
            }
        });
        this.pointsLabel.text = 'POINTS: '+this.currentPoints
        // console.log(this.scrabbleSystem.letters)
        this.currentSelectedRow = this.gameplayData.lists[this.gameplayData.currentVerticalPosition]
        this.currentSelectedRow.slots[this.currentSelectedRow.currentIDLetter].highlight()
        this.gameplayData.positionMarkers[this.gameplayData.currentVerticalPosition].visible = true;
    }
    registerButton(list, texture, callback, label) {
        let button = new UIButton1(0xFFFFFF, texture, 0)
        button.changePivot(0, 0)
        if(label){
            button.addLabelLeft(label, 0)
        }
        button.updateIconScale(0.5)
        button.onClick.add(this[callback].bind(this, button))
        list.addElement(button)
    }
    buildFormation(total) {
        
        let letterSlots = [];
        let slotList = new UIList();

        let marker = new LetterSlot(this.wrapper.height, this.slotSize.height + this.slotSize.distance * 2, 0xefefef)
        slotList.w = (total+1) * (this.slotSize.width) + (total ) * this.slotSize.distance
        slotList.h = (this.slotSize.height);
        for (let index = 0; index < total; index++) {
            let slot = new LetterSlot(this.slotSize.width, this.slotSize.height)
            slot.align = 1
            slotList.addElement(slot);
            letterSlots.push(slot)
        }
        let slot = new LetterSlot(this.slotSize.width, this.slotSize.height)
        slot.align = 1
        slotList.addElement(slot);
        slot.addX()
        return { list: slotList, slots: letterSlots, marker: marker , checker:slot}
    }
    startNewRound() {
        this.currentPoints = 0;
        let letters = this.scrabbleSystem.getConsoantSets(4, 3)

        let vowels = this.scrabbleSystem.getVowelSets(2, 1)
        letters = vowels.concat(letters)


        for (let index = 0; index < letters.length; index++) {
            const element = letters[index];
            this.letterButtons[index].updateIconTexture(this.letters[element.key.toUpperCase()])
            this.letterButtons[index].letter = element;
        }
    }
    onLetterClick(data) {
        let slot = this.getCurrentSelectedSlot()
        slot.addLetter(data.letter.key, this.letters[data.letter.key.toUpperCase()])

        //console.log(this.currentSelectedRow)
        
        let word = this.testWord()

        
        if(word && !this.isAlreadyUsed(word)){
            this.currentSelectedRow.wordFound = word;
            this.currentSelectedRow.checker.addCheck()
            this.arrowDown();
        }else{
            this.currentSelectedRow.wordFound = '';
            this.currentSelectedRow.checker.addX()
            this.arrowRight()
        }
    }
    testWord() {
        let found = true;
        let testWord = ''
        this.currentSelectedRow.slots.forEach(element => {
            if (element.currentLetter == '') {
                found = false
            }else{
                testWord += element.currentLetter
            }
        });
        if(found){
            if(this.scrabbleSystem.isThisAWord(testWord)){
                return testWord
            }else{
                return false
            }
        }else{
            return false
        }
    }
    update(delta) {

    }
    resize(resolution) {
        this.bottomContainer.x = this.bottomWrapper.x
        this.bottomContainer.y = this.bottomWrapper.y

        this.topContainer.x = this.topWrapper.x
        this.topContainer.y = this.topWrapper.y

        this.container.x = this.wrapper.x
        this.container.y = this.wrapper.y

        this.wordFormationsList.x = this.wrapper.width / 2 - this.wordFormationsList.width / 2 - this.slotSize.distance + this.slotSize.width/2
        this.wordFormationsList.y = this.wrapper.height / 2 - this.wordFormationsList.height / 2


        this.pointsLabel.x = this.wrapper.width / 2 - this.pointsLabel.width / 2 
        this.pointsLabel.y = this.wordFormationsList.y - this.pointsLabel.height - 30

        this.markerList.x = this.wrapper.width / 2 - this.markerList.w / 2
        this.markerList.y = this.wordFormationsList.y

        this.bottomLetterList.x = this.bottomWrapper.width / 2 - this.bottomLetterList.width / 2
        this.bottomLetterList.y = this.bottomWrapper.height / 2 - this.bottomLetterList.height / 2

        this.topLetterList.x = this.bottomLetterList.x
        this.topLetterList.y = this.bottomLetterList.y - this.topLetterList.height - 20

        this.actionButtons.x = this.bottomWrapper.width / 2 - this.actionButtons.w / 2
        this.actionButtons.y = this.bottomLetterList.y + this.bottomLetterList.height + 20


        this.topHUDButtons.x = this.topWrapper.width - 80 //- this.topHUDButtons.width / 2
        this.topHUDButtons.y = this.topWrapper.height / 2 - this.topHUDButtons.height / 2
    }
}