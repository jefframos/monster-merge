import * as PIXI from 'pixi.js';
import Signals from 'signals';
import CircleCounter from '../../ui/hudElements/CircleCounter';
import ProgressBar from '../ProgressBar';
export default class MergeTile extends PIXI.Container {
    constructor(i, j, size, lockIcon) {
        super();

        this.id = {
            i: i,
            j: j
        }
        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.size = size;


        this.backSlot = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('party-slot'), 10, 10, 10, 10)
        this.backSlot.width = size
        this.backSlot.height = size

        this.container.addChild(this.backSlot)
        this.backSlot.alpha = 0


        let slotId = Math.ceil(Math.random() * 3)
        this.backShape = new PIXI.Sprite.fromFrame("gameSlot" + slotId)
        this.backShape.width = size
        this.backShape.height = size
        this.backShape.alpha = 0.8
        this.container.addChild(this.backShape)

        
        this.tileSprite = new PIXI.Sprite.from('');
        this.container.addChild(this.tileSprite)
        this.tileSprite.anchor.set(0.5, 1)
        this.tileSprite.visible = false;

        this.label = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.label)
        this.label.style.stroke = 0
        this.label.style.strokeThickness = 4
        this.label.style.fontSize = 18
        this.label.x = this.backSlot.width / 2 - this.label.width / 2;

        this.onShowParticles = new Signals();
        this.onClick = new Signals();
        this.onHold = new Signals();
        this.onUp = new Signals();
        this.onEndHold = new Signals();
        this.onOver = new Signals();
        this.onGenerateResource = new Signals();
        this.onGenerateDamage = new Signals();

        this.backSlot.buttonMode = true;
        this.backSlot.interactive = true;
        this.backSlot.on('mousedown', this.onMouseDown.bind(this)).on('touchstart', this.onMouseDown.bind(this));
        this.backSlot.on('mouseover', this.onMouseMove.bind(this)).on('pointerover', this.onMouseMove.bind(this));
        this.backSlot.on('mouseout', this.onMouseCancel.bind(this)).on('touchout', this.onMouseCancel.bind(this));
        this.backSlot.on('mouseup', this.onMouseUp.bind(this))
            .on('touchend', this.onMouseUp.bind(this))
            .on('mouseupoutside', this.onMouseUp.bind(this))
            .on('touchendoutside', this.onMouseUp.bind(this));
        this.holdTimeout = 0;

        this.dir = 1;
        this.entityScale = 1;
        this.animSprite = false;

        this.lockIcon = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(lockIcon), 10, 10, 10, 10)
        this.lockIcon.width = size
        this.lockIcon.height = size

        this.container.addChild(this.lockIcon)
        this.lockIcon.visible = false;


        this.isGenerator = false;

        this.reset();

        this.positionOffset = { x: 0, y: 0 }
        this.sin = Math.random();

        window.gameModifyers.onUpdateModifyers.add(this.updateModifyers.bind(this))


        this.damageTimerView = new ProgressBar({ width: 55, height: 12 }, 3, 3)
        this.damageTimerView.updateBackgroundColor(0x20516c)
        this.damageTimerView.x = 0
        this.damageTimerView.y = 98
        //this.damageTimerView = new CircleCounter(10,10)
        //this.container.addChild(this.damageTimerView)
        this.damageTimerView.rotation = -Math.PI * 0.5
        //this.damageTimerView.build()
        this.startTimer = Math.random() * 2
    }
    reset() {
        this.generateResource = 0;
        this.generateResourceTime = -1;
        this.generateResourceNormal = 0;


        this.generateDamage = 1000;
        this.generateDamageTime = -1;
        this.generateDamageNormal = 0;
    }

    updatePosition() {
        this.positionOffset.y = this.entityScale + Math.cos(this.sin) * 4

        this.tileSprite.x = this.backSlot.width / 2 + this.positionOffset.x;
        this.tileSprite.y = this.backSlot.height / 2 + this.positionOffset.y;
    }
    update(delta, dateTimeStamp, autoUpdateResources = true) {
        if (this.startTimer > 0) {
            this.startTimer -= delta
            return
        }
        if (this.animSprite) {
            this.sin += delta;
            this.sin %= Math.PI * 2;
            this.updatePosition();
        }
        this.damageTimerView.visible = false;
        //console.log(this, dateTimeStamp)
        if (false && autoUpdateResources) {
            this.updateResource(delta, dateTimeStamp)
        }
        if (this.tileData) {
            this.updateDamage(delta, dateTimeStamp)
        }
    }
    updateResource(delta, dateTimeStamp) {

        if (window.gameModifyers.bonusData.resourceSpeed != 1) {

            this.generateResourceTime = this.generateTimeDefault * window.gameModifyers.bonusData.resourceSpeed
        }
        if (this.generateResourceTime > 0) {
            if (this.updatedResourceTimestamp) {
                this.generateResource = dateTimeStamp - this.updatedResourceTimestamp + delta * window.gameModifyers.modifyersData.drillSpeed;
                if (this.generateResource >= this.generateResourceTime / window.TIME_SCALE) {
                    this.updatedResourceTimestamp = (Date.now() / 1000 | 0) / window.TIME_SCALE
                    this.generateResourceNormal = 1;
                    this.resourceReady();
                } else {
                    this.milisecTimeStamp = Date.now() / 1000
                    this.generateResourceNormal = (this.milisecTimeStamp - this.updatedResourceTimestamp) / (this.generateResourceTime / window.TIME_SCALE);
                    this.generateResourceNormal = Math.min(this.generateResourceNormal, 1)
                }
            }
        } else {
            this.generateResourceNormal = 0;
        }
    }
    updateDamage(delta, dateTimeStamp) {
        if (this.holding) {
            return;
        }
        this.generateDamageTime = this.generateDamageTimeRaw / gameModifyers.bonusData.damageBonus
        dateTimeStamp = Date.now();
        this.damageTimerView.visible = true

        if (this.generateDamageTime > 0) {
            if (this.updatedDamageTimestamp) {
                let targetColor = 0xff810a
                this.generateDamage = dateTimeStamp - this.updatedDamageTimestamp
                let calcTiime = (this.generateDamageTime / window.TIME_SCALE) * 1000
                //console.log(this.generateDamage,calcTiime)
                if (this.generateDamage > calcTiime) {
                    this.updatedDamageTimestamp = Date.now()//(Date.now() / 1000 | 0);
                    this.generateDamageNormal = 1;
                    //console.log(this.generateDamage,  this.generateDamageTime,  gameModifyers.getAttackSpeed())                    
                    this.resourceReady();
                } else {
                    if (this.generateDamageTime < 0.5) {
                        this.generateDamageNormal = 1
                        targetColor = 0x22ff88
                    } else {
                        this.milisecTimeStamp = Date.now()//Date.now() / 1000
                        this.generateDamageNormal = this.generateDamage / calcTiime
                        //console.log(this.generateDamageNormal)
                        this.generateDamageNormal = Math.min(this.generateDamageNormal, 1)
                    }

                }
                this.damageTimerView.visible = true
                this.damageTimerView.updateBackgroundFront(targetColor)
                this.damageTimerView.setProgressBar(this.generateDamageNormal, targetColor)
            }
        } else {
            this.generateDamageNormal = 0;
            this.damageTimerView.visible = false;
        }
    }
    lookAt(target) {
        if (!this.tileSprite || !this.tileSprite.visible || !this.tileData) {
            return;
        }
        //console.log(this.tileSprite.alpha)
        let enemyGlobal = target.getGlobalPosition();
        let thisGlobal = this.tileSprite.getGlobalPosition();
        let angle = Math.atan2(thisGlobal.y - enemyGlobal.y, thisGlobal.x - enemyGlobal.x) - 3.14 / 2
        this.tileSprite.rotation = angle
    }
    resourceReady() {
        this.onGenerateResource.dispatch(this, this.tileData);
    }
    damageReady() {
        this.onGenerateDamage.dispatch(this, this.tileData);
    }
    showSprite() {
        if (!this.tileData) {
            return;
        }
        this.tileSprite.alpha = 1;
        this.tileSprite.visible = true;
        return this.tileSprite.texture;
    }
    removeEntity() {
        this.tileData = null;
        this.tileSprite.visible = false;
        this.animSprite = false;
        this.updatedResourceTimestamp = null;
        this.updatedDamageTimestamp = null;
        this.generateResourceTimeStamp = null;
        this.generateDamageTimeStamp = null;
        this.label.text = ''
    }
    isEmpty() {
        if (!this.tileData) {
            return true;
        }
    }
    hideSprite() {
        if (!this.tileData) {
            return;
        }
        this.tileSprite.alpha = 0//.5
        this.tileSprite.visible = false;
        return this.tileSprite.texture;
    }
    updateData() {

    }
    updateModifyers() {
        if (!this.tileData) {
            return;
        }
        this.generateDamageTime = this.tileData.getGenerateDamageTime() || 0;

        //console.log(this.generateDamageTime)
        this.generateTimeDefault = this.tileData.getGenerateResourceTime() || 0;
        this.generateResourceTime = this.tileData.getGenerateResourceTime() || 0;
    }
    addEntity(tileData) {
        if (tileData == null) return;
        if (this.tileData) {
            return;
        } else {
            this.tileData = tileData;
        }
        this.reset();
        this.generateDamageTimeRaw = tileData.getGenerateDamageTime() || 0;
        this.generateDamageTime = tileData.getGenerateDamageTime() || 0;
        this.generateTimeDefault = tileData.getGenerateDamageTime() || 0;
        this.generateResourceTime = tileData.getGenerateResourceTime() || 0;
        this.generateDamageTimeStamp = Date.now()//(Date.now() / 1000 | 0);
        this.generateResourceTimeStamp = (Date.now() / 1000 | 0);
        this.updatedResourceTimestamp = (Date.now() / 1000 | 0);
        this.updatedDamageTimestamp = (Date.now() / 1000 | 0);
        this.tileSprite.texture = PIXI.Texture.from(this.tileData.getTexture());
        this.updatePosition()
        this.entityScale = 1//Math.abs(this.backSlot.width / this.tileData.graphicsData.baseWidth * 0.75)
        this.tileSprite.anchor.set(0.5)
        this.sin = Math.random();
        let v = this.tileData.getValue();
        if (v > 100000) {
            v = utils.formatPointsLabel(this.tileData.getValue())
        }
        this.label.text = v
        this.label.text = this.tileData.rawData.id + 1
        //this.label.text = this.tileData.getGenerateDamageTime() +' --'+  this.tileData.rawData.initialTime
        this.label.x = this.backSlot.width  - this.label.width - 10;
        this.label.y = this.backSlot.height  - this.label.height - 10;
        this.showSprite()
        this.enterAnimation()

        this.generateDamage = 1000


    }
    enterAnimation() {
        this.tileSprite.scale.set(0, 2);

        this.animSprite = true;
        TweenLite.to(this.tileSprite.scale, 0.5, {
            x: this.entityScale,
            y: this.entityScale,
            ease: Elastic.easeOut
        })
    }
    onMouseMove(e) {

        this.onOver.dispatch();
        this.isOver = true;
        if (this.holding) {
            return;
        }
        if (!this.mouseDown) {
            this.overState()
        }
    }

    onMouseCancel(e) {
        this.isOver = false;
        if (this.holding) {
            return;
        }
        this.outState()
        if (!this.mouseDown) {
            return;
        }
        clearTimeout(this.holdTimeout)
        this.cancel = true;
        this.endHold();
    }
    onMouseUp(e) {
        this.isOver = false;

        if (!this.mouseDown) {
            this.onUp.dispatch(this);
            return;
        }
        this.mouseDown = false;
        if (this.cancel) {
            this.cancel = false;
            this.holding = false;
            return;
        }
        if (this.holding) {

            this.endHold();
            // console.log('onEndHold');
        } else {
            clearTimeout(this.holdTimeout)
            this.onClick.dispatch(this);
        }
    }
    onMouseDown(e) {
        this.mouseDown = true;
        if (this.lockIcon.visible) {
            this.lockIcon.visible = false;
        } else {
            this.hold();
        }
        // this.holdTimeout = setTimeout(() => {
        // }, 200);
    }

    addLocker() {
        this.lockIcon.visible = true;
    }

    endHold() {
        this.holding = false;
        this.onEndHold.dispatch(this);
        this.outState()
        this.label.visible = true
    }

    hold() {
        if (!this.tileData) {
            return;
        }
        this.label.visible = false
        this.holding = true;
        this.onHold.dispatch(this);
        this.blockState()
    }

    getCenterPosition() {
        return this.tileSprite.getGlobalPosition()
    }
    overState() {
        this.backSlot.tint = 0x00FFFF
        this.backShape.tint = 0x00FFFF

    }
    outState() {
        this.backSlot.tint = 0xFFFFFF
        this.backShape.tint = 0xFFFFFF

    }
    blockState() {
        this.backSlot.tint = 0xFF0000
        this.backShape.tint = 0xFF0000

    }
}