const fs = require('fs');
const path = require('path');
function generateSitemap(baseUrl, distPath = './dist') {
	try {
		const cleanBaseUrl = baseUrl.replace(/\/$/, '');
		function getAllFiles(dir, fileList = []) {
			const files = fs.readdirSync(dir);
			
			files.forEach(file => {
				const filePath = path.join(dir, file);
				const stat = fs.statSync(filePath);
				
				if (stat.isDirectory()) {
					getAllFiles(filePath, fileList);
				} else if (filePath.endsWith('index.html')) {
					fileList.push(filePath);
				}
			});
			
			return fileList;
		}
		
		function processFilePaths(files, pattern, baseUrl) {
			return files
				.map(file => file.replace(/^dist\//, ''))
				.filter(file => {
					return file.match(pattern);
				})
				.map(file => file.replace(/\/index\.html$/, '/'))
				.map(file => file.replace(/index\.html$/, ''))
				.map(file => `https://${baseUrl}/${file}`);
		}
		
		const allFiles = getAllFiles(distPath);
		
		let courseUrls = processFilePaths(allFiles, /^course\//, cleanBaseUrl);
		const max_course_year = Math.floor(Math.max(...courseUrls.map(url => url.split('/')[4])) / 10) * 10 - 10;
		courseUrls = courseUrls.filter(url => url.split('/')[4] >= max_course_year).sort((a, b) => b.split('/')[4] - a.split('/')[4]);

		let classUrls = processFilePaths(allFiles, /^class\//, cleanBaseUrl);
		const max_class_year = Math.floor(Math.max(...classUrls.map(url => url.split('/')[4])) / 10) * 10 - 10;
		classUrls = classUrls.filter(url => url.split('/')[4] >= max_class_year).sort((a, b) => b.split('/')[4] - a.split('/')[4]);
		
		const mainSitemapContent = [
			`https://${cleanBaseUrl}/`,
			`https://${cleanBaseUrl}/saved/`,
			`https://${cleanBaseUrl}/info/`,
			`https://${cleanBaseUrl}/my/`,
			`https://${cleanBaseUrl}/course/`,
			`https://${cleanBaseUrl}/rule/`,
			`https://${cleanBaseUrl}/passport/`,
			`https://${cleanBaseUrl}/road/`,
			`https://${cleanBaseUrl}/exam/`,
			...courseUrls,
			...classUrls,
		].join('\n');
		fs.writeFileSync(path.join(distPath, 'sitemap.txt'), mainSitemapContent);

		let ruleUrls = processFilePaths(allFiles, /^rule\//, cleanBaseUrl);
		const max_rule_year = Math.max(...ruleUrls.map(url => url.split('/')[4])) - 1;
		ruleUrls = ruleUrls.filter(url => url.split('/')[4] >= max_rule_year).sort((a, b) => b.split('/')[4] - a.split('/')[4]);
		
		const ruleSitemapContent = ruleUrls.join('\n');
		fs.writeFileSync(path.join(distPath, 'sitemap-rule.txt'), ruleSitemapContent);

		console.log('sitemap generated successfully');
	} catch (error) {
		console.error(error);
		throw error;
	}
}

if (require.main === module) {
	const baseUrl = process.env.BASE_URL || process.argv[2];

	if (!baseUrl) {
		console.error('error: please provide BASE_URL');
		process.exit(1);
	}

	generateSitemap(baseUrl);
}

module.exports = { generateSitemap };