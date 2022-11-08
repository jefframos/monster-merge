import config from './config';
import utils from './utils';

window.alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
window.numberList = []
window.numberList.push({value:1000, abv:'k'})
window.numberList.push({value:1000000, abv:'Mi'})
window.numberList.push({value:1000000000, abv:'B'})
window.numberList.push({value:1000000000000, abv:'T'})
let accum = 0
for (let index = 15; index < 309; index+=3) {

    let abv = ''
    if(accum < alphabet.length){
        abv = alphabet[accum]+alphabet[accum]
    }else{
        let first = Math.floor(accum / alphabet.length) - 1     
        if(first == accum % alphabet.length)   {
            abv = alphabet[first]+alphabet[first]+alphabet[first]
        }else{
            abv = alphabet[first]+alphabet[accum % alphabet.length]
        }
    }
    accum ++
    window.numberList.push({value:Math.floor(Math.pow(10, index)), abv:abv})    
}

//console.log(window.numberList)

window.config = config;
window.utils = utils;

window.CATS_POOL = [];
window.LABEL_POOL = [];
window.COINS_POOL = [];
window.BLOOD_POOL = [];
window.SHADOW_POOL = [];
window.BULLET_POOL = [];

window.console.warn = function () { }
window.console.groupCollapsed = function (teste) {
    return teste
} //('hided warnings')

window.MAX_NUMBER = 1000000;

window.MAIN_FONT = 'retro_computerregular'



window.LABELS = {};
window.LABELS.LABEL1 = {
    fontFamily: 'retro_computerregular',
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    fontWeight: '800'
}
window.LABELS.LABEL_CHEST = {
    fontFamily: 'retro_computerregular',
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    fontWeight: '800',
    stroke:0xbb00bb,
    strokeThickness:4,
}
window.LABELS.LABEL_SPACESHIP = {
    fontFamily: 'retro_computerregular',
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    fontWeight: '800',
    stroke:0xFFFF00,
    strokeThickness:4,
}
window.LABELS.LABEL_STATS = {
    fontFamily: 'retro_computerregular',
    fontSize: '14px',
    fill: 0xFFFFFF,
    align: 'center',
    fontWeight: '800'
}

window.LABELS.LABEL2 = {
    fontFamily: 'retro_computerregular',
    fontSize: '24px',
    fill: 0x000000,
    align: 'center',
    fontWeight: '800'
}

window.LABELS.LABEL_DAMAGE= {
    fontFamily: 'retro_computerregular',
    fontSize: '14px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke:0,
    strokeThickness:4,
    fontWeight: '600'
}

window.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
window.isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);