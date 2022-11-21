export default class MergerData {
    constructor(rawData, index) {

        let tex = new PIXI.Texture.from(rawData.imageSrc)
        let pow = Math.pow(2, index + 1)
        rawData.id = index;
        rawData.value = pow;
        rawData.texture = tex;
        let scaling = index * 14 + (index * index * index * 0.11);
        scaling = Math.max(1, scaling)
        rawData.initialDamage = 2 * Math.pow(1.2, scaling)

        rawData.initialCost = this.calcSimplePrice(index)
        this.rawData = rawData;

        this.currentLevel = 1;
        this.resourceAccum = true;

        console.log(this.rawData)

    }
    calcSimplePrice(level) {
        let s = 50;
        for (let index = 0; index < level; index++) {
            s *= 2.5
        }
        s = Math.floor(s)
        return (s * 10)
    }
    calcSimpleCurrency(level) {
        return Math.pow(2, level)
    }
    reset() {
        this.currentLevel = 1;
    }
    shouldAccumulateResources() {
        return this.resourceAccum;
    }
    getID() {
        return this.rawData.id
    }
    getValue() {
        return this.rawData.value;
    }
    getCurrentTime() {
        return this.rawData.initialTime
    }
    getInitialAttackTime() {
        return this.rawData.initialTime
    }
    getRawDamage(simulate = 0) {
        return (this.rawData.initialDamage) * Math.pow(this.rawData.damageCoeficient, this.currentLevel + simulate)
    }
    getDamage(simulate = 0) {
        let mult = window.gameModifyers.getDamageMultiplier();
        return (this.rawData.initialDamage) * Math.pow(this.rawData.damageCoeficient, this.currentLevel + simulate) * mult;
    }
    getTexture() {
        return this.rawData.texture
    }
    getGenerateDamageTime(simulate = 0) {
        return this.getCurrentTime() / window.gameModifyers.getAttackSpeed() * window.gameModifyers.bonusData.damageBonus;
    }
    getGenerateResourceTime(simulate = 0) {
        return this.getCurrentTime() / window.gameModifyers.getDrillSpeed();
    }
    getRawResources(simulate = 0) {
        //return (this.rawData.initialRevenue / this.getGenerateResourceTime()) * Math.pow(this.rawData.coefficientProductivity, this.currentLevel + simulate)
        return (this.rawData.initialRevenue) * Math.pow(this.rawData.coefficientProductivity, this.currentLevel + simulate)
    }
    getResources(simulate = 0) {
        //OLD return (this.rawData.initialRevenue / this.getGenerateResourceTime()) * Math.pow(this.rawData.coefficientProductivity, this.currentLevel + simulate) * window.gameModifyers.getResourcesMultiplier()
        return (this.rawData.initialRevenue * this.getGenerateResourceTime()) * Math.pow(this.rawData.coefficientProductivity, this.currentLevel + simulate) * window.gameModifyers.getResourcesMultiplier()
    }
    getCoast() {
        return this.rawData.initialCost
    }
    getUpgradeCost2() {

        let s = (this.rawData.initialCost / 10);
        for (let index = 0; index < this.currentLevel - 1; index++) {
            s *= 1.2
        }
        s = Math.floor(s)

        //console.log(this.rawData.initialCost,s, this.currentLevel)
        return (s * 10)

    }
    getUpgradeCost(totalUpgrades) {
        return this.rawData.initialCost * Math.pow(this.rawData.costCoefficient, this.currentLevel + totalUpgrades)
    }
    getUpgradeRawCost(totalUpgrades) {
        return this.rawData.initialCost * Math.pow(this.rawData.costCoefficient, totalUpgrades)
    }
    upgrade(quant) {
        this.currentLevel += quant;
    }
    setLevel(next) {
        this.currentLevel = next;
    }
    getRPS(simulate = 0) {
        let res = this.getResources(simulate);
        let time = this.getGenerateResourceTime(simulate);

        return res / time;
    }
    getDPS(simulate = 0) {
        let res = this.getDamage(simulate);
        let time = this.getGenerateDamageTime(simulate)  // window.gameModifyers.getAttackSpeed();
        //console.log(time)
        return res / time;
    }
}