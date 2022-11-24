export default class CookieManager {
	constructor() {
		this.defaultStats = {
			test: 0,
			tutorialStep:0
		}
		this.defaultEconomy = {
			resources: 0,
			lastChanged: 0
		}
		this.defaultResources = {
			version: '0.0.1',
			entities: {},
			dataProgression: {}
		}
		this.defaultProgression = {
			version: '0.0.1',
			currentEnemyLevel: 1,
			currentEnemyLife: 0,
		}
		this.defaultBoard = {
			version: '0.0.1',
			currentBoardLevel: 0,
			entities: {},
			dataProgression: {},
			boardLevel:{
				currentLevel:1,
				progress:0,
				percent:0,
			}
		}
		this.defaultModifyers = {
			version: '0.0.1',
			entities: {},
			drillSpeed: 1,
			resourcesMultiplier: 1,
			damageMultiplier: 1,
			attackSpeed: 1,
			attackSpeedValue: 1,
			autoMerge: 1,
			autoCollectResource: false,
			permanentBonusData: {
				damageBonus: 1,
				resourceBonus: 1,
				damageSpeed: 1,
				resourceSpeed: 1,
				shards: 0
			}
		}

		this.version = '0.0.12'
		this.cookieVersion = this.getCookie('cookieVersion')
		//alert(this.cookieVersion != this.version)
		if(!this.cookieVersion || this.cookieVersion != this.version){
			this.storeObject('cookieVersion', this.version)
			this.wipeData2();
		}
		this.fullData = this.getCookie('fullData')
		if(!this.fullData){
			this.fullData = {}
		}	
	
		this.storeObject('fullData', this.fullData)

	}
	sortCookie(id){
		if(!this.fullData[id]){

			this.fullData[id] = {}
			this.fullData[id]['board'] = this.sortCookieData('board', this.defaultBoard);
			this.fullData[id]['progression'] = this.sortCookieData('progression', this.defaultProgression);
			this.fullData[id]['economy'] = this.sortCookieData('economy', this.defaultEconomy);
		}

		this.storeObject('fullData', this.fullData)

	}
	generateCookieData(nameID, defaultData, force = false) {
		let cookie = this.getCookie(nameID);
		if (force) {
			cookie = null;
		}
		let target
		if (cookie) {
			target = cookie;

			for (const key in defaultData) {
				const element = defaultData[key];
				if (target[key] === undefined) {
					target[key] = element;
				}
			}
		} else {
			target = defaultData
		}

		return target
	}
	sortCookieData(nameID, defaultData, force = false) {
		let cookie = this.getCookie(nameID);
		if (force) {
			cookie = null;
		}
		let target
		if (cookie) {
			target = cookie;

			for (const key in defaultData) {
				const element = defaultData[key];
				if (target[key] === undefined) {
					target[key] = element;
					this.storeObject(nameID, target)
				}
			}
		} else {
			target = defaultData
			this.storeObject(nameID, target)
		}

		return target
	}
	updateResources(total, id) {
		this.fullData[id].economy.resources = total;
		this.fullData[id].economy.lastChanged = Date.now() / 1000 | 0
		//this.storeObject('economy', this.economy)
		this.storeObject('fullData', this.fullData)
	}
	resetAllCollects() {
		for (const key in this.resources) {
			if (Object.hasOwnProperty.call(this.resources, key)) {
				const element = this.resources[key];
				if (element.latestResourceCollect) {
					element.latestResourceCollect = Date.now() / 1000 | 0
					element.pendingResource = 0
				}
			}
		}
		this.storeObject('resources', this.resources)
	}
	pickResource(mergeData) {
		this.resources.entities[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		this.resources.entities[mergeData.rawData.nameID].latestResourceCollect = Date.now() / 1000 | 0
		this.resources.entities[mergeData.rawData.nameID].pendingResource = 0

		this.storeObject('resources', this.resources)

	}
	addResourceUpgrade(mergeData) {
		this.resources.entities[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		this.storeObject('resources', this.resources)
	}
	addPendingResource(mergeData, current) {
		this.resources.entities[mergeData.rawData.nameID].pendingResource = current
		this.resources.entities[mergeData.rawData.nameID].latestResourceAdd = Date.now() / 1000 | 0

		this.storeObject('resources', this.resources)
	}
	buyResource(mergeData) {
		this.resources.entities[mergeData.rawData.nameID] = {
			currentLevel: mergeData.currentLevel,
			latestResourceCollect: Date.now() / 1000 | 0,
			pendingResource: 0,
			latestResourceAdd: 0
		}
		this.storeObject('resources', this.resources)
	}

	addMergePiece(mergeData, i, j,id) {
		if (mergeData == null) {
			this.fullData[id].board.entities[i + ";" + j] = null
		} else {
			this.fullData[id].board.entities[i + ";" + j] = {
				nameID: mergeData.rawData.nameID
			}
		}
		this.storeObject('fullData', this.fullData)
	}
	addMergePieceUpgrade(mergeData, id) {

		if (this.fullData[id].board.dataProgression[mergeData.rawData.nameID] == null) {
			this.fullData[id].board.dataProgression[mergeData.rawData.nameID] = {
				currentLevel: mergeData.currentLevel
			}
		} else {
			this.fullData[id].board.dataProgression[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		}
		this.storeObject('fullData', this.fullData)
		//this.storeObject('board', this.board)
	}
	endTutorial(step){
		this.stats.tutorialStep = step;
		this.storeObject('stats', this.stats)
		
	}
	saveBoardLevel(level, id) {
		this.fullData[id].board.currentBoardLevel = level;
		this.storeObject('fullData', this.fullData)
		//this.storeObject('board', this.board)
		
	}
	saveBoardProgress(boardProgress, id) {
		this.fullData[id].board.boardLevel = boardProgress;
		this.storeObject('fullData', this.fullData)
		//this.storeObject('board', this.board)

	}

	updateModifyers(data) {
		this.modifyers = data;
		this.storeObject('modifyers', this.modifyers)
	}
	resetProgression() {
		this.sortCookieData('progression', this.defaultProgression, true)
		this.sortCookieData('modifyers', this.defaultModifyers, true)
		this.sortCookieData('resources', this.defaultResources, true)
		this.sortCookieData('economy', this.defaultEconomy, true)
	}
	getStats() {
		return this.getCookie('stats')
	}
	getModifyers() {
		return this.getCookie('modifyers')
	}
	getEconomy(id) {
		return this.fullData[id].economy
		return this.getCookie('economy')
	}
	getResources(id) {
		console.log(id,this.fullData[id].resources)

		return this.fullData[id].resources
		return this.getCookie('resources')
	}
	getProgression() {
		return this.getCookie('progression')
	}
	resetBoard() {
		this.sortCookieData('board', this.defaultBoard, true)
	}
	getBoard(id) {
		console.log('getBoard',id,this.fullData[id].board)
		return this.fullData[id].board//this.getCookie('board')
	}

	createCookie(name, value, days) {
		let sValue = JSON.stringify(value);
		try {
			window.localStorage.setItem(name, sValue)
		} catch (e) {
		}
	}
	getCookie(name) {
		try {
			return JSON.parse(window.localStorage.getItem(name))
		} catch (e) {
			return this[name]
		}
	}
	storeObject(name, value) {

		try {
			window.localStorage.setItem(name, JSON.stringify(value))
		} catch (e) {
		}
	}
	resetCookie() {
		try {
			for (var i in window.localStorage) {
				window.localStorage.removeItem(i);
			}
		} catch (e) {
		}
	}
	wipeData() {
		this.resetCookie();

		try {
			window.localStorage.clear();
			window.location.reload();
		} catch (e) {
		}
	}

	wipeData2() {
		this.resetCookie();

		try {
			window.localStorage.clear();
			this.storeObject('cookieVersion', this.version)
			window.location.reload();
		} catch (e) {
		}
	}
}