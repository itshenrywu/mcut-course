import axios from 'axios'
export default {
	target: 'static',
	head: {
		title: '明志科技大學選課小幫手',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover' },

			{ hid: 'og:title', property: 'og:title', content: '明志科技大學選課小幫手' },

			{ hid: 'description', name: 'description', content: '明志科技大學選課小幫手，幫助您輕鬆查詢全校課表，快速進行課程預排與衝堂檢查，還可以查詢畢業學分門檻及選課時程！' },
			{ hid: 'og:description', property: 'og:description', content: '明志科技大學選課小幫手，幫助您輕鬆查詢全校課表，快速進行課程預排與衝堂檢查，還可以查詢畢業學分門檻及選課時程！' },

			{ hid: 'og:image', property: 'og:image', content: 'https://og.mcut-course.com/default.jpg' },
			{ hid: 'twitter:image', name: 'twitter:image', content: 'https://og.mcut-course.com/default.jpg' },

			{ name: 'format-detection', content: 'telephone=no' },
			{ hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' }
		],
		link: [
			{ rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
			{ rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
			{ rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
			{ rel: "manifest", href: "/site.webmanifest" },
			{ rel: 'stylesheet', 'href': '/css/tocas.min.css?v=20250525' },
			{ rel: 'stylesheet', 'href': 'https://cdn.jsdelivr.net/npm/sweetalert2@11.14.1/dist/sweetalert2.min.css', media: "(prefers-color-scheme: light)"},
			{ rel: 'stylesheet', 'href': 'https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@5.0.18/dark.min.css', media: "(prefers-color-scheme: dark)"}
		],
		script: [
			{ src: 'https://cdnjs.cloudflare.com/ajax/libs/tocas/5.0.1/tocas.min.js' }
		]
	},
	components: true,
	modules: [
		'@nuxtjs/axios',
		'vue-sweetalert2/nuxt/no-css',
		'@nuxtjs/google-gtag'
	],
	sweetalert: {
		confirmButtonColor: 'var(--ts-primary-600)',
		cancelButtonColor: 'var(--ts-static-gray-500)'
	},
	axios: {
		baseURL: '/',
	},
	plugins: [
		'~/plugins/axios'
	],
	'google-gtag': {
		id: 'G-4WZWP0DJMR'
	},
	generate: {
		fallback: '404.html',
		async routes() {
			const mode = process.env.MODE || 'prod';
			const termsResponse = await axios.get('https://api.mcut-course.com/list.php?termlist');
			const terms = termsResponse.data.term;
			const courseIds = await Promise.all(
				terms.map(async (term) => {
					const coursesResponse = await axios.get(`https://api.mcut-course.com/list.php?term=${term}`);
					const courses = coursesResponse.data.course;
					return courses;
				})
			);
			const courseRoutes = courseIds.flat().filter(course => !course.id.includes('ALT_')).map(course => {
				return {
					route: '/course/' + course.id.substring(0, 4) + '/' + course.id.substring(4, 8) + '/' + course.id.substring(8),
					payload: course
				}
			});

			const ruleIdsResponse = await axios.get('https://api.mcut-course.com/rule/list2.php');
			const rules = ruleIdsResponse.data.rules;
			const depts = ruleIdsResponse.data.depts;
			let ruleRoutes = [{
				route: '/rule/',
				component: 'pages/rule/_year/_dept/_id.vue'
			}];
			let currentYear = new Date().getFullYear() - 1911;
			if (new Date().getMonth() < 8) currentYear--;
			for (let year = 107; year <= currentYear; year++) {
				Object.values(depts[year]).forEach(dept_group => {
					Object.keys(dept_group).forEach((dept_id) => {
						Object.keys(rules[year]).forEach(rule_group_name => {
							if (rule_group_name == '_') {
								ruleRoutes.push({
									route: '/rule/' + year + '/' + dept_id + '/000/',
									payload: {
										name: dept_group[dept_id],
										rules: ruleIdsResponse.data.rules,
										depts: ruleIdsResponse.data.depts,
										terms: ruleIdsResponse.data.terms
									}
								});
								return;
							}
							let rule_group = rules[year][rule_group_name];
							Object.keys(rule_group).forEach((rule_id) => {
								ruleRoutes.push({
									route: '/rule/' + year + '/' + dept_id + '/' + rule_id + '/',
									payload: {
										name: rule_group[rule_id].name,
										rules: ruleIdsResponse.data.rules,
										depts: ruleIdsResponse.data.depts,
										terms: ruleIdsResponse.data.terms
									}
								});
							});
						});
					});
				});
			}

			const classListResponse = await axios.get('https://api.mcut-course.com/class_list.php');
			const classList = classListResponse.data;
			let classRoutes = Object.keys(classList).map(class_id => {
				return {
					route: '/class/' + class_id + '/',
					payload: classList[class_id]
				}
			});

			if (mode != 'prod') {
				const _courseRoutes = courseRoutes.slice(0, 10);
				const _ruleRoutes = ruleRoutes.slice(0, 10);
				return [..._courseRoutes, ..._ruleRoutes];
			}

			return [...courseRoutes, ...classRoutes, ...ruleRoutes];
		}
	}
}
