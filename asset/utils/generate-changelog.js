const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function generateChangelog(outputPath = './static/changelog.json') {
	const raw = execSync('git log --format="%H|%ai|%s"', { encoding: 'utf-8' });

	const entries = raw
		.trim()
		.split('\n')
		.map(line => {
			const [sha, datetime, ...msgParts] = line.split('|');
			// Convert ISO datetime to "Y-m-d H:i:s" (strip timezone offset)
			const time = datetime.replace(/T/, ' ').replace(/ [+-]\d{4}$/, '').substring(0, 19);
			return {
				time,
				'commit-message': msgParts.join('|'),
				sha: sha.substring(0, 8),
			};
		});

	fs.writeFileSync(outputPath, JSON.stringify(entries, null, '\t'));
	console.log(`changelog written to ${outputPath} (${entries.length} commits)`);
}

if (require.main === module) {
	const outputPath = process.argv[2] || path.join(__dirname, '../../static/changelog.json');
	generateChangelog(outputPath);
}

module.exports = { generateChangelog };
