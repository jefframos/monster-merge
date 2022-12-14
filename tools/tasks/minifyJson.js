const fs = require('fs-extra');
const jsonminify = require('jsonminify');
const paths = require('../paths');
const path = require('path');
const getFileSubdirectory = require('../utils/getFileSubdirectory')

module.exports = function (file, ignoreMin = false) {
	const json = fs.readFileSync(file, 'utf8');

	console.log(ignoreMin)
	const jsonmin = !ignoreMin ? jsonminify(json) : json;

	let fileName = path.basename(file);
	let sub = getFileSubdirectory(path.resolve(paths.source.json), path.resolve(file));
	const outputPath = path.resolve(`${paths.destination.json}${sub}${fileName}`);


	fs.outputFile(outputPath, jsonmin, function (err) {
		if (err) {
			console.log(err);
			return;
		}
		console.log(`Generated json minify ${outputPath}`);
	});
};
