export default {
	width: 750 * 0.8,
	height: 1334 * 0.8,
	webgl: true,
	effectsLayer: null,
	colors: {
		background: 0x000000,
	},
	rendererOptions: {
		//pixi rendererOptions
		resolution: 2,//window.devicePixelRatio,
		antialias: true,
		backgroundColor: 0x000000
	},
	levels: [],
	assets: {
		button: {
			primarySquare: 'CGB02-green_M_btn',
			secondarySquare: 'CGB02-blue_M_btn',
			tertiarySquare: 'CGB02-purple_M_btn',
			warningSquare: 'CGB02-red_M_btn',
			extraSquare: 'CGB02-yellow_M_btn',
			greySquare: 'CGB02-grey_M_btn',

			squarePadding: [35, 35, 35, 35],

			primaryLong: 'CGB02-green_L_btn',
			secondaryLong: 'CGB02-blue_L_btn',
			tertiaryLong: 'CGB02-purple_L_btn',
			warningLong: 'CGB02-red_L_btn',
			extraLong: 'CGB02-yellow_L_btn',
			greyLong: 'CGB02-grey_L_btn',

			longPadding: [35, 35, 35, 35],
		},
		box: {
			square: 'CGB02-grey_S_btn',
			squareExtra: 'CGB02-yellow_S_btn',
			padding: [20, 20, 20, 20],
			squareSmall: 'CGB02-grey_B_btn',
			paddingSmall: [35/2, 35/2, 35/2, 35/2],
		},
		bars: {
			background: 'CGB02-grey_B_btn',
			backgroundPadding: [35/2, 35/2, 35/2, 35/2],
			primary: 'CGB02-green_B_btn',
			secondary: 'CGB02-blue_B_btn',
			tertiary: 'CGB02-purple_B_btn',
			extra: 'CGB02-yellow_B_btn',

			barPadding: [35/2, 0, 35/2, 0],

		},
		panel: {
			primary: 'CGB02-green_M_btn',
			secondary: 'CGB02-blue_M_btn',
			tertiary: 'CGB02-purple_M_btn',
			grey: 'CGB02-grey_M_btn',
			padding: [35, 35, 35, 35],

		},
		popup: {
			primary: 'CGB02-green_M_btn',
			secondary: 'CGB02-blue_M_btn',
			tertiary: 'CGB02-purple_M_btn',
			extra: 'CGB02-yellow_M_btn',
			warning: 'CGB02-red_M_btn',
			padding: [35, 35, 35, 35],

		}
	},
	addPaddingSquareButton: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.button.squarePadding)
	},
	addPaddingLongButton: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.button.longPadding)
	},
	addPaddingPopup: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.popup.padding)
	},
	addPaddingPanel: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.panel.padding)
	},
	addPaddingBackBar: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.bars.backgroundPadding)
	},
	addPaddingBar: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.bars.barPadding)
	},
	addPaddingBoxSmall: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.box.paddingSmall)
	},
	addPaddingBox: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.box.padding)
	},
	addPadding: function (nineSlice, padding) {
		let order = ['leftWidth', 'topHeight', 'rightWidth', 'bottomHeight']

		for (let index = 0; index < order.length; index++) {
			const element = order[index];
			nineSlice[element] = padding[index]
		}
	}

}
