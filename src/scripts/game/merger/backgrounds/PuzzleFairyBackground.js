import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import config from '../../../config';
import TweenLite from 'gsap';
import PuzzleBackgroundBase from './PuzzleBackgroundBase';

export default class PuzzleFairyBackground extends PuzzleBackgroundBase {
	constructor() {

		super();
	}
	build() {
	}
	resize(innerResolution, scale) {
		if (innerResolution && innerResolution.width && innerResolution.height) {

			this.innerResolution = innerResolution;

			if (window.isPortrait) {
				
			} else {

			}

		}

	}


}