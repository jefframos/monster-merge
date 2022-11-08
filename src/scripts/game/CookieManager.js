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
			dataProgression: {}
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
		this.economy = {}
		this.stats = {}
		this.resources = {}
		this.progression = {}
		this.board = {}
		this.modifyers = {}
		this.economy = this.sortCookieData('economy', this.defaultEconomy);
		this.stats = this.sortCookieData('stats', this.defaultStats);
		this.resources = this.sortCookieData('resources', this.defaultResources);
		this.progression = this.sortCookieData('progression', this.defaultProgression);
		this.board = this.sortCookieData('board', this.defaultBoard);
		this.modifyers = this.sortCookieData('modifyers', this.defaultModifyers);

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
	updateResources(total) {
		this.economy.resources = total;
		this.economy.lastChanged = Date.now() / 1000 | 0
		this.storeObject('economy', this.economy)
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

	addMergePiece(mergeData, i, j) {
		if (mergeData == null) {
			this.board.entities[i + ";" + j] = null
		} else {
			this.board.entities[i + ";" + j] = {
				nameID: mergeData.rawData.nameID
			}
		}
		this.storeObject('board', this.board)
	}
	addMergePieceUpgrade(mergeData) {

		if (this.board.dataProgression[mergeData.rawData.nameID] == null) {
			this.board.dataProgression[mergeData.rawData.nameID] = {
				currentLevel: mergeData.currentLevel
			}
		} else {
			this.board.dataProgression[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		}

		this.storeObject('board', this.board)
	}
	endTutorial(step){
		this.stats.tutorialStep = step;
		this.storeObject('stats', this.stats)

	}
	saveBoardLevel(level) {
		this.board.currentBoardLevel = level;
		this.storeObject('board', this.board)

	}
	saveEnemyLife(value) {
		this.progression.currentEnemyLife = value;
		this.storeObject('progression', this.progression)
	}
	saveEnemyLevel(level) {
		this.progression.currentEnemyLevel = level;
		this.storeObject('progression', this.progression)
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
	getEconomy() {
		return this.getCookie('economy')
	}
	getResources() {
		return this.getCookie('resources')
	}
	getProgression() {
		return this.getCookie('progression')
	}
	resetBoard() {
		this.sortCookieData('board', this.defaultBoard, true)
	}
	getBoard() {
		return this.getCookie('board')
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
}