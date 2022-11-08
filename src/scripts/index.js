import globals from './globals';
import plugins from './plugins';

import Game from './Game';
import LocalStorage from './game/data/LocalStorage';
import CookieManager from './game/CookieManager';

import SoundManager from './soundManager/SoundManager'
import SoundManagerCordova from './soundManager/SoundManagerCordova'
import jsonManifest from './manifests/manifest-json'
import imageManifest from './manifests/manifest-image'
import audioManifest from './manifests/manifest-audio'
import spritesheetManifest from './manifests/manifest'
import MergerScreenManager from './game/merger/screen/MergerScreenManager';
import signals from 'signals';
import LocalizationManager from './game/LocalizationManager';





window.onAdds = new signals.Signal();
window.onStopAdds = new signals.Signal();

window.STORAGE = new LocalStorage();

window.GAME_ID = 572860816402905

let audioToLoad = [] //['assets/audio/dream1.mp3', 'assets/audio/dream2.mp3']
window.SOUND_MANAGER = new SoundManager();


window.getCoinSound = function () {
    return 'coins_0' + Math.ceil(Math.random() * 4)
}


window.GAMEPLAY_STOP = function () {
    if (window.GAMEPLAY_IS_STOP) {
        return
    }
    window.GAMEPLAY_IS_STOP = true;
    PokiSDK.gameplayStop();
}
window.GAMEPLAY_START = function (force = false) {
    if (!window.GAMEPLAY_IS_STOP && !force) {
        return
    }
    window.GAMEPLAY_IS_STOP = false;
    PokiSDK.gameplayStart();
}
window.DO_COMMERCIAL = function (callback, params) {
    window.GAMEPLAY_STOP()

    if (window.isDebug) {
        window.GAMEPLAY_START()

        if (callback) callback(params)
        return
    }
    window.onAdds.dispatch();
    PokiSDK.commercialBreak().then(
        () => {
            console.log("Commercial break finished, proceeding to game");
            window.GAMEPLAY_START()
            window.onStopAdds.dispatch();

            if (callback) callback(params)
        }
    ).catch(
        () => {
            console.log("Initialized, but the user likely has adblock");
            window.GAMEPLAY_START()
            window.onStopAdds.dispatch();

            if (callback) callback(params)
        }
    );
}

window.DO_REWARD = function (callback, params) {
    window.GAMEPLAY_STOP()

    if (window.isDebug) {
        window.GAMEPLAY_START()

        if (callback) callback(params)
        return
    }

    window.onAdds.dispatch();
    PokiSDK.rewardedBreak().then(
        (success) => {
            if (success) {
                window.onStopAdds.dispatch();
                window.GAMEPLAY_START()
                if (callback) callback(params)
            } else {
                window.onStopAdds.dispatch();
                window.GAMEPLAY_START()
                if (callback) callback(params)
            }
        }

    )
}
// console.log(spritesheetManifest['default'][0]);
//startLoader();
const jsons = [];

PokiSDK.init().then(
    () => {
        console.log("Poki SDK successfully initialized");
        loadManifests();

    }
).catch(
    () => {
        loadManifests();
        console.log("Initialized, but the user likely has adblock");
        // fire your function to continue to game
    }
);

//loadManifests();

function loadManifests() {

    PokiSDK.gameLoadingStart();


    for (var i = spritesheetManifest['default'].length - 1; i >= 0; i--) {
        let dest = 'assets/' + spritesheetManifest['default'][i]

        jsons.push(dest);
        PIXI.loader.add(dest)
    }
    PIXI.loader.load(afterLoadManifests);
}
//PokiSDK.setDebug(true);

function afterLoadManifests(evt) {

    for (var key in PIXI.utils.TextureCache) {
        var copyKey = key;
        copyKey = copyKey.substr(0, copyKey.length - 4)
        copyKey = copyKey.split('/')
        copyKey = copyKey[copyKey.length - 1]
        var temp = PIXI.utils.TextureCache[key];
        delete PIXI.utils.TextureCache[key];
        PIXI.utils.TextureCache[copyKey] = temp;
    }

    startLoader();

}

function startLoader() {

    for (var i = 0; i < jsonManifest.length; i++) {
        jsonManifest[i].url = jsonManifest[i].url.replace(/\\/, "/")
        let url = jsonManifest[i].url//.substr(0, jsonManifest[i].url.length - 4);
        PIXI.loader.add(jsonManifest[i].id, url)
    }

    for (var i = 0; i < audioManifest.length; i++) {
        audioManifest[i].url = audioManifest[i].url.replace(/\\/, "/")
        let url = audioManifest[i].url.substr(0, audioManifest[i].url.length - 4);

        if (iOS) {
            url += '.mp3'
        } else {
            url += '.ogg'
        }

        PIXI.loader.add(audioManifest[i].id, url)
    }
    PIXI.loader
        .add('./assets/fonts/stylesheet.css')
        .load(configGame);

    // FbManager.connect().then(() =>
    //     {
    //         FbManager.trackLoader(PIXI.loader);

    //     })
    //     .catch(e =>
    //     {
    //         console.log(e);
    //     })
}

window.COOKIE_MANAGER = new CookieManager();
function configGame(evt) {

    window.localizationManager = new LocalizationManager('');

    SOUND_MANAGER.load(audioManifest);
    window.game = new Game(config);
    // FbManager.start()
    // console.log(CAT_LIST);
    let sotrageData = STORAGE.getObject('space-cats-game-data')
    // if (!sotrageData) {
    //     STORAGE.storeObject('space-cats-game-data', GAME_DATA.getObjectData());
    // } else {
    //     GAME_DATA.loadData(sotrageData);
    // }
    window.RESOURCES = evt.resources;

    window.TILE_ASSSETS_POOL = []

    let toGenerate = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '?', '!', 'X', 'v', '+', '<', '>', 't', 'MAX', 'Fight BOSS', '100']
    for (let index = 0; index < toGenerate.length; index++) {

        let container = new PIXI.Container()
        let text = new PIXI.Text(toGenerate[index], LABELS.LABEL2);
        text.style.fontSize = 64
        text.style.fill = 0xFFFFFF
        text.style.strokeThickness = 0
        container.addChild(text)

        let id = toGenerate[index].substring(0, 4)
        let tex = utils.generateTextureFromContainer('image-' + id, container, window.TILE_ASSSETS_POOL)

    }
    PokiSDK.gameLoadingFinished();



    if (!window.screenManager) {
        window.screenManager = new MergerScreenManager();
    }
    //window.screenManager = new HellScreenManager();
    game.screenManager = screenManager;

    game.initialize()
    // // screenManager.timeScale = 0;
    // //create screen manager
    // //add screens
    // let gameScreen = new GameScreen('GameScreen');
    game.stage.addChild(screenManager);
    // screenManager.addScreen(gameScreen);
    // screenManager.forceChange('GameScreen');
    game.start();
    window.GAMEPLAY_START(true)
    window.addEventListener("focus", myFocusFunction, true);
    window.addEventListener("blur", myBlurFunction, true);

}

window.onresize = function (event) {
    window.game.resize();
};
function myFocusFunction() {
    TweenLite.killTweensOf(screenManager);
    // TweenLite.to(screenManager, 0.5, {
    //     timeScale: 1
    // })
    // if (GAME_DATA.mute) {
    //     return
    // }
    // SOUND_MANAGER.unmute();
}

function myBlurFunction() {
    TweenLite.killTweensOf(screenManager);
    // TweenLite.to(screenManager, 0.5, {
    //     timeScale: 0
    // })

    // SOUND_MANAGER.mute();
}


window.onEscPressed = new signals();
window.onSpacePressed = new signals();

window.getKey = function (e) {
    if (window.GAMEPLAY_IS_STOP) return;
    if (e.key === "Escape") { // escape key maps to keycode `27`
        // <DO YOUR WORK HERE>
        window.onEscPressed.dispatch()
        // if(this.gameRunning){
        // 	this.inGameMenu.toggleState();
        // }
    }

    if (e.keyCode === 32) { // escape key maps to keycode `27`
        window.onSpacePressed.dispatch()
        // <DO YOUR WORK HERE>

    }
}

document.addEventListener('keydown', (event) => {
    window.getKey(event);
    event.preventDefault()
})
//tryStuff()

function tryStuff() {
    let d = {
        initialCost: 4,
        coefficient: 1.1,
        initialTime: 0.6,
        initialRevenue: 1,
        coefficientProductivity: 1.09,
        initialProductivity: 2
    }


    let enemies = {
        initialLife: 4,
        lifeCoefficient: 1.1,
        initialRevenue: 2,
        coefficientRevenue: 1.1,
    }
    let mult = 1

    let acc1 = 0
    let acc2 = 0
    for (let index = 0; index < 100; index += 10) {
        //console.log(d.initialCost * Math.pow(d.coefficient, index))// * Math.pow(i, d.coefficient))
        //console.log(d.initialProductivity * Math.pow(d.coefficientProductivity, index))// * Math.pow(i, d.coefficient))
        let sim = d.initialProductivity * Math.pow(d.coefficientProductivity, index)
        acc1 += sim
        let cost = d.initialCost * Math.pow(d.coefficient, index)
        acc2 += cost

        console.log(utils.formatPointsLabel(cost), utils.formatPointsLabel(sim))
        //console.log(d.initialProductivity * index * mult)
    }
}


