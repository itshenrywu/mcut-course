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
	'is-file-export-icon',
	'is-gear-icon',
	'is-sun-icon',
	'is-moon-icon'
];

const filePath = path.join(__dirname, '../tocas/icons.css');

fs.readFile(filePath, 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading file:', err);
		return;
	}
	let char_code = [];
	let css = '';
	const lines = data.split('\n');
	let current_line = 0;
	while (current_line < lines.length) {
		for (let i = 0; i < icons.length; i++) {
			if (lines[current_line].includes(icons[i])) {
				css += lines[current_line] + '\n';
				while(!lines[current_line].includes('}')) {
					if (lines[current_line].includes('content:')) {
						char_code.push(lines[current_line].split('"')[1]);
					}

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

	console.log(char_code);

	const newFilePath = path.join(__dirname, '../tocas/icons_new.css');
	fs.writeFile(newFilePath, css, (err) => {
		if (err) {
			console.error('Error writing file:', err);
			return;
		}
		console.log('Icons css generated successfully');
	});

	const subsetFont = require('subset-font');
	// for each font file in icons/
	fs.readdir(path.join(__dirname, '../tocas/fonts/icons'), (err, files) => {
		if (err) {
			console.error('讀取字型檔錯誤：', err);
			return;
		}
		for (let i = 0; i < files.length; i++) {
			if (files[i].includes('new')) {
				fs.unlink(path.join(__dirname, '../tocas/fonts/icons/', files[i]), (err) => {
					if (err) {
						console.error('刪除字型檔錯誤：', err);
					} else {
						console.log(`✅ 已成功刪除字型檔：${files[i]}`);
					}
				});
				continue;
			}
			fs.readFile(path.join(__dirname, '../tocas/fonts/icons/', files[i]), (err, fontBuffer) => {
				if (err) {
					console.error('讀取字型檔錯誤：', err);
					return;
				}
				
				subsetFont(fontBuffer, char_code.join(''), {
					targetFormat: files[i].split('.')[1],
				})
				.then(subsetBuffer => {
					fs.writeFile(path.join(__dirname, '../tocas/fonts/icons/', files[i].replace('.', '_new.')), subsetBuffer, (err) => {
						if (err) {
							console.error('寫入子集字型檔錯誤：', err);
						} else {
							console.log(`✅ 已成功產生精簡字型檔：${files[i].replace('.', '_new.')}`);
						}
					});

					fs.copyFile(path.join(__dirname, '../tocas/fonts/icons/', files[i]), path.join(__dirname, '../../static/css/fonts/icons/', files[i].replace('.', '_new.')), (err) => {
						if (err) {
							console.error('複製字型檔錯誤：', err);
						} else {
							console.log(`✅ 已成功複製字型檔：${files[i]}`);
						}
					});
				})
				.catch(err => {
					console.error('子集化錯誤：', err);
				});
			});
		}
	});
});