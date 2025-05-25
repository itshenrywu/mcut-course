const fs = require('fs');
const path = require('path');

let icons = [
	'is-angle-down-icon',
	'is-angle-right-icon',
	'is-angle-up-icon',
	'is-arrow-right-from-bracket-icon',
	'is-arrow-right-icon',
	'is-arrow-right-to-bracket-icon',
	'is-basketball-icon',
	'is-calendar-days-icon',
	'is-chevron-down-icon',
	'is-child-reaching-icon',
	'is-circle-exclamation-icon',
	'is-circle-info-icon',
	'is-circle-plus-icon',
	'is-circle-user-icon',
	'is-clipboard-check-icon',
	'is-clock-icon',
	'is-download-icon',
	'is-dumbbell-icon',
	'is-earth-asia-icon',
	'is-end-icon',
	'is-end-labeled-icon',
	'is-file-import-icon',
	'is-graduation-cap-icon',
	'is-image-icon',
	'is-list-check-icon',
	'is-magnifying-glass-icon',
	'is-mobile-screen-icon',
	'is-music-icon',
	'is-people-pulling-icon',
	'is-people-robbery-icon',
	'is-person-chalkboard-icon',
	'is-plus-icon',
	'is-school-icon',
	'is-seedling-icon',
	'is-share-icon',
	'is-spinner-icon',
	'is-star-icon',
	'is-start-icon',
	'is-table-cells-icon',
	'is-table-icon',
	'is-table-tennis-paddle-ball-icon',
	'is-trash-icon',
	'is-triangle-exclamation-icon',
	'is-users-icon',
	'is-volleyball-icon',
	'is-x-icon',
	'is-xmark-icon',
	'is-bars-staggered-icon',
	'is-file-lines-icon',
	'is-circle-question-icon',
	'is-wand-magic-sparkles-icon',
	'is-chevron-left-icon',
	'is-chevron-right-icon',
	'is-arrow-rotate-left-icon',
	'is-arrow-rotate-right-icon',
	'is-file-export-icon'
];

const filePath = path.join(__dirname, '../tocas/icons.css');

fs.readFile(filePath, 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading file:', err);
		return;
	}
	let css = '';
	const lines = data.split('\n');
	let current_line = 0;
	while (current_line < lines.length) {
		for (let i = 0; i < icons.length; i++) {
			if (lines[current_line].includes(icons[i])) {
				css += lines[current_line] + '\n';
				while(!lines[current_line].includes('}')) {
					current_line++;
					css += lines[current_line] + '\n';
				}
				break;
			}
		}
		current_line++;
	}
	
	for (let i = 0; i < icons.length; i++) {
		if (!css.includes(icons[i])) {
			console.log('Not found:', icons[i]);
		}
	}

	const newFilePath = path.join(__dirname, '../tocas/icons_new.css');
	fs.writeFile(newFilePath, css, (err) => {
		if (err) {
			console.error('Error writing file:', err);
			return;
		}
		console.log('Icons css generated successfully');
	});
});