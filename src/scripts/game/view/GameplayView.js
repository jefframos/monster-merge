import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';

import StandardBullet from '../entity/bullets/StandardBullet'
import StandardHero from '../entity/heroes/StandardHero'
import StandardMonster from '../entity/monsters/StandardMonster'
import StandardRangerMonster from '../entity/monsters/StandardRangerMonster'

export default class GameplayView extends PIXI.Container {
    constructor() {
        super();


        this.gameContainer = new PIXI.Container();
        this.addChild(this.gameContainer)
        this.environmentContainer = new PIXI.Container();
        this.entityContainer = new PIXI.Container();
        this.particlesContainer = new PIXI.Container();
        this.UIContainer = new PIXI.Container();


        this.heroesArea = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height * 0.45);
        this.heroesArea.y = config.height * 0.45;
        this.heroesArea.alpha = 0;
        this.heroesArea.interactive = true;

        this.monstersArea = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width, config.height * 0.3);
        this.monstersArea.y = config.height * 0.25;
        this.monstersArea.alpha = 0;

        this.backgroundContainer = new PIXI.Container();
        this.backgroundSprite = new PIXI.Sprite.from('bg-scene-2')
        this.backgroundContainer.addChild(this.backgroundSprite)

        this.backgroundSprite.scale.set(config.width / this.backgroundSprite.width * 1)
        this.backgroundSprite.anchor.set(0.5, 0.5)
        this.backgroundSprite.x = config.width / 2;
        this.backgroundSprite.y = config.height / 2;

        this.foregroundContainer = new PIXI.Container();
        this.foregroundSprite = new PIXI.Sprite.from('front-locker')
        this.foregroundSprite.scale.set(config.width / this.foregroundSprite.width * 1.05)
        this.foregroundSprite.anchor.set(0.5, 0.5)
        this.foregroundSprite.x = config.width / 2;
        // this.foregroundSprite.alpha = 0.3
        this.foregroundSprite.y = this.backgroundSprite.y + this.backgroundSprite.height / 2;
        this.foregroundContainer.addChild(this.foregroundSprite)


        this.shadowContainer = new PIXI.Container();
        this.bloodContainer = new PIXI.Container();


        this.gameContainer.addChild(this.backgroundContainer);
        this.gameContainer.addChild(this.environmentContainer);
        this.gameContainer.addChild(this.shadowContainer);
        this.gameContainer.addChild(this.bloodContainer);
        this.gameContainer.addChild(this.heroesArea);
        this.gameContainer.addChild(this.monstersArea);
        this.gameContainer.addChild(this.entityContainer);
        this.gameContainer.addChild(this.foregroundContainer);
        this.gameContainer.addChild(this.particlesContainer);

        this.entityRadius = config.width * 0.05;
        this.monsterRadius = config.width * 0.055;

        this.heroesGrid = {
            i: HEROES_GRID[0].length,
            j: HEROES_GRID.length
        }

        this.heroesMargin = {
            x: this.backgroundSprite.width * 0.2,
            y: this.monstersArea.height * 0.05
        }
        this.heroeSlotRect = {
            w: (config.width - this.heroesMargin.x * 2) / this.heroesGrid.i,
            h: (this.heroesArea.height - this.entityRadius * 2) / this.heroesGrid.j
        }


        this.monstersGrid = {
            i: MONSTERS_GRID[0].length,
            j: MONSTERS_GRID.length
        }
        this.monstersMargin = {
            x: this.backgroundSprite.width * 0.25,
            y: this.monstersArea.height * 0.05
        }
        this.monstersSlotRect = {
            w: ((config.width - this.monstersMargin.x * 2)) / this.monstersGrid.i,
            h: (this.monstersArea.height - this.monsterRadius * 2) / this.monstersGrid.j - 50
        }



        this.bloodColor = ['0x7F1B1B', '0xFF0000']
        this.bloodColorMonster = ['0x267613', '0x23920a']
        this.bloodList = [];
        this.shadowList = [];

    }
    update(delta) {
        this.entityContainer.children.sort(utils.depthCompare);

        for (var i = 0; i < this.shadowList.length; i++) {
            this.updateShadow(this.shadowList[i])
        }

    }
    reset(){
        for (var i = 0; i < this.bloodList.length; i++) {
            this.bloodList[i].alpha *= 0.2;
        }
    }
    destroyEntity(entity) {
        if (entity.parent) {
            entity.parent.removeChild(entity);
        }
        for (var i = this.shadowList.length - 1; i >= 0; i--) {
            if (this.shadowList[i].target == entity) {
                let shadow = this.shadowList[i].shadow
                if (shadow.parent) {
                    shadow.parent.removeChild(shadow);
                }

                this.shadowList.splice(i, 1);
                break
            }
        }
    }

    destroyBullet(entity) {
        if (entity.parent) {
            entity.parent.removeChild(entity);
            BULLET_POOL.push(entity);
        }
        for (var i = this.shadowList.length - 1; i >= 0; i--) {
            if (this.shadowList[i].target == entity) {
                let shadow = this.shadowList[i].shadow
                if (shadow.parent) {
                    shadow.parent.removeChild(shadow);
                }

                this.shadowList.splice(i, 1);
                break
            }
        }
    }
    addBullet(entity, bulletData) {
        
        let bullet = new CLASSES[bulletData.baseBullet]
        bullet.radius = entity.radius;
        bullet.x = entity.x;
        bullet.y = entity.y;
        bullet.reset(bulletData.texture)

        this.entityContainer.addChild(bullet)

        let shadowObj = this.addShadow(bullet)
        this.updateShadow(shadowObj);
        return bullet;
    }

    addMonster(i, j) {
        let monster = new StandardMonster(this.monsterRadius);
        // let monster = new StandardRangerMonster(this.monsterRadius);
        monster.reset();

        this.entityContainer.addChild(monster)
        monster.x = this.monstersMargin.x + ((this.monstersSlotRect.w) * i) + this.monstersSlotRect.w / 2 // + this.monsterRadius; //(config.width - this.monstersSlotRect.w * 2) / this.heroesGrid.i * i + this.monstersSlotRect.w;
        monster.y = this.monstersArea.y + this.monstersSlotRect.h * j + this.monsterRadius // - this.monstersArea.height
        monster.applyScale();
        this.updateShadow(this.addShadow(monster));
        return monster;
    }

    addHero(i, j, data) {

        // card = new CLASSES[data.baseClass](this.entityRadius)
        // console.log(data);
        let hero = new CLASSES[data.baseClass](this.entityRadius)//new StandardHero(this.entityRadius, data);
        // let hero = new StandardRangerHero(this.entityRadius);
        //hero.reset();

        this.entityContainer.addChild(hero)
        hero.x = this.heroesMargin.x + (this.heroeSlotRect.w * i) + this.heroeSlotRect.w / 2; //(config.width - this.heroeSlotRect.w * 2) / this.heroesGrid.i * i + this.heroeSlotRect.w;
        hero.y = this.heroesArea.y + this.heroeSlotRect.h * j + this.entityRadius;
        hero.applyScale();
        this.updateShadow(this.addShadow(hero));
        return hero;
    }

    updateShadow(shadowData) {
        shadowData.shadow.x = shadowData.target.x;
        shadowData.shadow.y = shadowData.target.y;
        if (shadowData.target.entitySprite.y >= 0) {
            shadowData.shadow.scale.x = shadowData.scale;
            shadowData.shadow.scale.y = shadowData.shadow.scale.x / 2;
            return
        }
        let highPercent = shadowData.target.radius / Math.abs(shadowData.target.entitySprite.y)
        shadowData.shadow.scale.x = shadowData.scale * Math.min(highPercent, 1);
        shadowData.shadow.scale.y = shadowData.shadow.scale.x / 2;
        // shadowData.shadow.scale
    }
    addShadow(target) {
        let shadow;
        if (BLOOD_POOL.length) {
            blood = BLOOD_POOL[0];
            BLOOD_POOL.shift();
        } else {
            shadow = PIXI.Sprite.from('shadow');
            shadow.anchor.set(0.5)
            shadow.scale.y = 0.5
            this.shadowContainer.addChild(shadow)
            shadow.alpha = 0.2
            shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY
        }
        shadow.x = target.x;
        shadow.y = target.y;
        let stdScale = target.radius / shadow.width * 1.1;
        shadow.scale.set(stdScale, stdScale / 2)
        let shadowData = {
            target: target,
            shadow: shadow,
            scale: stdScale
        }
        this.shadowList.push(shadowData);
        return shadowData;

    }
    addBlood(target, scl = 0.001) {
        let blood;
        if (BLOOD_POOL.length) {
            blood = BLOOD_POOL[0];
            BLOOD_POOL.shift();
        } else {
            if (this.bloodList.length > 120) {
                blood = this.bloodList[0];
                blood.blendMode = PIXI.BLEND_MODES.ADD;
            } else {
                blood = PIXI.Sprite.from('spark2');
                blood.anchor.set(0.5)
                if (target.isHero) {
                    blood.tint = this.bloodColor[Math.floor(Math.random() * this.bloodColor.length)]
                } else {
                    blood.tint = this.bloodColorMonster[Math.floor(Math.random() * this.bloodColorMonster.length)]
                }
            }
        }
        let tscl = config.width / (blood.width / blood.scale.x) * scl + Math.random() * (scl * 3)
        blood.scale.set(tscl, tscl / 2)
        blood.alpha = 1;
        blood.alphaSpeed = 60;
        this.bloodList.push(blood)
        this.bloodContainer.addChild(blood)
        let rad = target.radius * 1.5
        blood.x = target.x + (rad * Math.random()) - rad / 2
        blood.y = target.y + (rad / 2 * Math.random()) - rad / 4
    }

    findHero(mousePosition) {
        if (this.isGameOver) {
            return;
        }
        for (var i = 0; i < this.entityList.length; i++) {
            if (this.entityList[i].isHero) {
                let hero = this.entityList[i];
                if (hero.readyToAct && !hero.killed) {
                    if (utils.distance(mousePosition.x, mousePosition.y, hero.x, hero.y) < this.heroeSlotRect.w * 0.75) {

                        return hero


                    }
                }
            }
        }
        // console.log(this.mousePosition);
    }
}