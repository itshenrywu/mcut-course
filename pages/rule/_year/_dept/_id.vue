<template>
	<div class="cell is-scrollable is-fluid is-horizontal" id="page-rule">
		<div class="cell is-tertiary is-scrollable sidebar" :class="{ 'show': showMobileSidebar }">
			<div class="ts-content">
				<div class="ts-wrap is-vertical has-top-padded">
					<button class="ts-close is-large mobile-only close-sidebar"
						@click="showMobileSidebar = !showMobileSidebar"></button>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">入學學年度</div>
						<div class="ts-select is-fluid">
							<select v-model="currentYear" @change="chooseYear();">
								<option v-for="year in years" :value="year">{{ year + ' (U' +
									(year.toString().substring(1, 4)) + ')' }}</option>
							</select>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">入學系所/學程/組別</div>
						<div class="ts-select is-fluid">
							<select v-model="currentDept" @change="chooseDept();">
								<optgroup v-for="(dept_group, group) of depts[currentYear]" :label="group">
									<option v-for="(dept, dept_id) of dept_group" :value="dept_id">{{ dept }}</option>
								</optgroup>
							</select>
						</div>
					</div>
					<div v-if="currentDept != ''">
						<div class="ts-text is-label has-bottom-padded-small">系所/學分學程總表</div>
						<div class="ts-select is-fluid">
							<select v-model="currentRule" @change="saveRuleInput();">
								<option value="-1" disabled>請選擇...</option>
								<option v-for="(rule, rule_id) of rules[currentYear]['_']" value="000"
									v-if="rule.name == currentDeptName">系所課程總表</option>
								<optgroup v-for="(rule_group, group) of rules[currentYear]" :label="group"
									v-if="group != '_'">
									<option v-for="(rule, rule_id) of rule_group" :value="rule_id"
										:disabled="rule.hide_for == currentDeptName">{{ rule.name }}</option>
								</optgroup>
							</select>
						</div>
					</div>
					<div v-if="currentRule != '-1'">
						<div class="ts-text is-label has-bottom-padded-small">欲選課學期</div>
						<div class="ts-select is-fluid">
							<select v-model="currentRuleTerm" @change="changeTerm();">
								<option v-for="term in terms">{{ term }}</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="cell is-secondary is-fluid is-scrollable">
			<div class="ts-container has-top-padded-large is-fitted mobile-padded">
				<h1 class="ts-header is-huge has-vertically-padded">畢業學分門檻</h1>
				<button class="ts-button is-fluid is-outlined is-end-icon mobile-only"
					@click="showMobileSidebar = !showMobileSidebar">
					<template v-if="currentRule == '-1'">選擇一個課程總表</template>
					<template v-else-if="currentRule == '000'">
						{{ currentYear }} 入學 /
						{{ currentDeptName }}
					</template>
					<template v-else>
						{{ currentYear }} 入學 /
						{{ currentRuleName }}
					</template>
					<span class="ts-icon is-chevron-down-icon"></span>
				</button>
			</div>
			<div class="ts-container has-top-padded is-fitted">
				<div class="ts-box has-vertically-spaced-large">
					<div class="ts-content">
						<span class="ts-badge has-bottom-spaced-small is-small is-dense">注意事項</span>
						<div class="ts-list is-ordered">
							<div class="item">請先選擇<b>「入學學年度」</b>及<b>「入學系所/學程/組別」</b>。</div>
							<div class="item">須修畢你的<b>「系所學程總表」</b><span
									v-if="currentDeptName && !(currentDeptName.includes('博士') || currentDeptName.includes('碩士') || currentDeptName.includes('在職專班') || currentDeptName.includes('國際學生專班') || currentDeptName.includes('菁英班') || currentDeptName.includes('學位學程'))">，並須<b>任選一個學分學程（跨領域或第二專長）</b></span>才能畢業。
							</div>
							<div class="item">點擊各分類即可展開該分類課程。</div>
							<div class="item">欲選課前切換<b>「欲選課學期」</b>，即可查看該學期是否有開課。</div>
							<div class="item">此頁面僅提供<b>「畢業學分門檻」</b>，其他畢業門檻（如路跑、英文等）請見學校規定。</div>
						</div>
					</div>
				</div>
				<div class="ts-header is-icon is-center-aligned has-vertically-padded-large" v-if="loading">
					<span class="ts-icon is-spinning is-spinner-icon"></span>
					<div class="has-top-padded-small">讀取中...</div>
				</div>
				<template v-if="!loading && currentRule != '-1'">
					<div class="ts-box has-vertically-spaced-large" v-if="rule.data"
						v-for="rule_type in rule.data">
						<div class="ts-content is-tertiary is-dense">
							{{ rule_type.name.split('（')[0] }}
							<span class="ts-badge is-small is-dense is-start-spaced">
								{{ rule_type.name.split('（')[1].split('）')[0].replace(/([\x00-\xFF]+)(?=[^\x00-\xff])/g, " $1 ") }}
							</span>
						</div>
						<template v-for="rule_subtype in rule_type.data">
							<div class="ts-content is-secondary is-dense rule_subtype_name"
								@click="rule_subtype.show = !rule_subtype.show">
								・
								{{ rule_subtype.name.split('（')[0] }}
								<span class="ts-badge is-small is-dense is-outlined is-start-spaced">
									{{ rule_subtype.name.split('（')[1].split('）')[0].replace(/([\x00-\xFF]+)(?=[^\x00-\xff])/g, " $1 ") }}
								</span>
								<span class="ts-icon"
									:class="{ 'is-angle-down-icon': !rule_subtype.show, 'is-angle-up-icon': rule_subtype.show }"></span>
							</div>
							<transition name="slide" @before-enter="beforeSlide" @enter="slideIn" @leave="slideOut">
								<div v-show="rule_subtype.show" class="rule_subtype">
									<table class="ts-table">
										<tbody>
											<tr v-for="rule_item in rule_subtype.data" :class="{'is-not-clickable':findCourses(rule_item.id).length == 0}" @click="showFindCourse(rule_item.id)">
												<td>{{ rule_item.name }}</td>
												<td>{{ rule_item.term }}</td>
												<td>{{ rule_item.credit }} 學分</td>
												<td>
													<template v-if="courses && findCourses(rule_item.id).length >= 1">
														{{ findCourses(rule_item.id).length }} 門相符課程
														<span class="ts-icon is-angle-right-icon"></span>
													</template>
												</td>
												<td class="r-remark">
													<span v-if="['永續發展與社會實踐', '經典教育與社會實踐'].includes(rule_item.name)" @click.stop="showInfo(rule_item.name)">
														通識中心 X+1 課程，詳細說明 <span class="ts-icon is-angle-right-icon"></span>
													</span>
													<span v-else-if="rule_item.remark">
														{{ rule_item.remark }}
													</span>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</transition>
						</template>
					</div>
					<div class="ts-box ad is-hollowed box-mobile-spaced">
						<div class="ts-content">
							<div class="ts-text is-description has-bottom-padded-small">贊助商</div>
							<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5900703871265800" crossorigin="anonymous"></script>
							<ins class="adsbygoogle"
								style="display:block; text-align:center;"
								data-ad-layout="in-article"
								data-ad-format="fluid"
								data-ad-client="ca-pub-5900703871265800"
								data-ad-slot="3164180037"></ins>
							<script>
								(adsbygoogle = window.adsbygoogle || []).push({});
							</script>
						</div>
					</div>
					<div class="ts-box has-vertically-spaced-large" v-if="rule.remark && rule.remark.length > 0">
						<div class="ts-content" id="remark">
							<span class="ts-badge has-bottom-spaced-small is-small is-dense">說明</span>
							<div v-for="remark in rule.remark" v-html="formatRemark(remark)"></div>
						</div>
					</div>
					<div class="ts-box has-vertically-spaced-large" v-if="rule.data && currentRule != '000'">
						<div class="ts-content">
							<span class="ts-badge has-bottom-spaced is-small is-dense">檔案下載</span>
							<div class="ts-wrap is-dense">
								<a v-if="Object.values(rules[currentYear]['跨領域']).find(r => r.name == currentRuleName)" class="ts-button is-small is-dense is-short is-secondary is-start-icon" href="https://info.mcut.edu.tw/update/data/A231020008.docx" target="_blank">
									<span class="ts-icon is-download-icon"></span>學分學程實施辦法
								</a>
								<a v-if="Object.values(rules[currentYear]['第二專長']).find(r => r.name == currentRuleName)" class="ts-button is-small is-dense is-short is-secondary is-start-icon" href="https://info.mcut.edu.tw/update/data/A231160002.pdf" target="_blank">
									<span class="ts-icon is-download-icon"></span>學生修讀第二專長實施辦法
								</a>
								<a v-if="rule.file && rule.file != ''" class="ts-button is-small is-dense is-short is-secondary is-start-icon" :href="'https://info.mcut.edu.tw/update/%e8%a6%8f%e7%ab%a0%e9%a1%9e%e6%96%87%e4%bb%b6%e4%b8%8b%e8%bc%89.aspx?id=' + rule.file" target="_blank">
									<span class="ts-icon is-download-icon"></span>本學分學程實施要點
								</a>
							</div>
						</div>
					</div>
					<div class="ts-box has-vertically-spaced-large" v-if="rule.contact">
						<div class="ts-content">
							<span class="ts-badge has-bottom-spaced-small is-small is-dense">承辦人</span><br>
							{{ rule.contact[0] + ' ' + rule.contact[1] }}<br>
							<a :href="'tel:0229089899,' + rule.contact[2]">(02) 2908-9899 #{{ rule.contact[2] }}</a>
						</div>
					</div>
				</template>
				<br>
			</div>
			<div class="ts-mask" v-show="showMobileSidebar" @click="showMobileSidebar = !showMobileSidebar"></div>
		</div>
	</div>
</template>
<style>
#page-rule .ts-box .ts-icon.is-angle-up-icon,
#page-rule .ts-box .ts-icon.is-angle-down-icon {
	float: right;
}

#page-rule li {
	padding: 4px 0;
	line-height: 1.4rem;
}

#page-rule ol {
	padding-inline-start: 0;
}

#page-rule ol ::marker {
	color: var(--ts-gray-500);
}

#page-rule td:nth-child(1) {
	width: 40%;
}

#page-rule td:nth-child(2) {
	width: 4rem;
}

#page-rule td:nth-child(3) {
	width: 6rem;
}

#page-rule td:nth-child(4) {
	width: 9rem;
}

#page-rule .rule_subtype {
	overflow: hidden;
}

#page-rule .rule_subtype_name:hover {
	cursor: pointer;
}

#page-rule td.r-remark {
	font-size: .8rem;
	color: var(--ts-gray-500);
}

#page-rule tr:hover {
	background-color: var(--ts-gray-100);
	cursor: pointer;
}

#page-rule tr.is-not-clickable:hover {
	background-color: transparent;
	cursor: default;
}

@media screen and (max-width: 768px) {
	#page-rule .is-scrollable {
		overflow-y: unset;
	}

	#page-rule,
	#page-rule tbody,
	#page-rule tfoot,
	#page-rule th,
	#page-rule td,
	#page-rule tr {
		display: block;
	}

	#page-rule tr:hover {
		background-color: transparent;
	}

	#page-rule tr td {
		padding: .05rem 1rem;
	}

	#page-rule td:nth-child(1),
	#page-rule td:nth-child(2),
	#page-rule td:nth-child(3),
	#page-rule td:nth-child(4) {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	#page-rule td:nth-child(1) {
		width: calc(100% - 12rem);
	}

	#page-rule td:nth-child(2),
	#page-rule td:nth-child(3) {
		text-align: right;
		padding: 0;
	}

	#page-rule td:nth-child(4) {
		width: 100%;
	}

	#page-rule td:empty {
		display: none;
	}

	#page-rule td:first-child {
		padding-top: .4rem;
	}

	#page-rule td:last-child {
		padding-bottom: .4rem;
	}
}

@media print {
	.sidebar {
		width: 0;
		display: none;
	}

	.rule_subtype {
		display: block !important;
	}

	#page-rule td:nth-child(2) {
		width: 5rem;
	}

	#page-rule .ts-box .ts-icon.is-angle-up-icon,
	#page-rule .ts-box .ts-icon.is-angle-down-icon {
		display: none;
	}
}
</style>
<script>
export default {
	async asyncData({ $axios, params, payload }) {
		let depts = {};
		let rules = {};
		let years = [];
		let terms = [];
		let currentRuleName = '';

		if (payload) {
			depts = payload.depts;
			rules = payload.rules;
			terms = payload.terms;
			currentRuleName = payload.name;
		} else {
			const res = await $axios.get('https://api.mcut-course.com/rule/list2.php');
			depts = res.data.depts;
			rules = res.data.rules;
			terms = res.data.terms;
			currentRuleName = '';
		}

		let currentYear = new Date().getFullYear() - 1911;
		if (new Date().getMonth() < 8) currentYear--;
		for (let year = currentYear; year >= 108; year--) {
			years.push(year);
		}
		return { depts, rules, years, terms, currentRuleName };
	},
	data() {
		return {
			currentYear: '',
			currentDept: '',
			currentRule: '',
			currentRuleTerm: '',
			currentRuleName: '',

			rules: {},
			rule: {},
			terms: [],
			years: [],
			allAourses: [],

			loading: true,

			showMobileSidebar: false
		};
	},
	head() {
		var year_title = this.currentYear || this.$route.params.year;
		return {
			title: (year_title ? year_title + ' 學年度入學 - ' : '') + (this.currentRuleName || '') + '課程總表 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: (year_title ? year_title + ' 學年度入學 - ' : '') + (this.currentRuleName || '') + '課程總表 | 明志科技大學選課小幫手' },
				{ hid: 'twitter:title', name: 'twitter:title', content: (year_title ? year_title + ' 學年度入學 - ' : '') + (this.currentRuleName || '') + '課程總表 | 明志科技大學選課小幫手' },

				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com' + this.$router.currentRoute.path },
				{ hid: 'og:image', property: 'og:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + Date.now() },
				{ hid: 'twitter:image', name: 'twitter:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + Date.now() }
			]
		};
	},
	computed: {
		currentDeptName() {
			if (this.currentDept == '') return '';
			return Object.values(this.depts[this.currentYear]).find(item => this.currentDept in item)?.[this.currentDept];
		},
		findCourses() {
			return (sid) => {
				if (!this.courses) return [];
				return this.courses.filter(course => course.id.includes(this.currentRuleTerm.replace('-', '') + sid));
			}
		},
	},
	mounted() {
		this.init();
	},
	methods: {
		async init() {
			let refreshId = false;
			if (this.$route.params.id) {
				this.currentYear = this.$route.params.year;
				this.currentDept = this.$route.params.dept;
				this.currentRule = this.$route.params.id;
			} else {
				this.currentYear = localStorage['ruleYear'] || this.years[0];
				this.currentDept = localStorage['ruleDept'] || Object.keys(Object.values(this.depts[this.currentYear])[0])[0];
				this.currentRule = localStorage['ruleRule'] || '-1';
			}

			if (this.terms.includes(localStorage['ruleTerm'])) this.currentRuleTerm = localStorage['ruleTerm'];
			else if (this.terms.includes(localStorage['term'])) this.currentRuleTerm = localStorage['term'];

			if (this.currentRuleTerm == '') this.currentRuleTerm = this.terms[0];

			this.loading = false;
			this.saveRuleInput();
		},
		saveRuleInput() {
			if (this.currentRule == '-1') return;
			localStorage['ruleYear'] = this.currentYear;
			localStorage['ruleDept'] = this.currentDept;
			localStorage['ruleRule'] = this.currentRule;
			if(this.$route.path != '/rule/' + this.currentYear + '/' + this.currentDept + '/' + this.currentRule + '/') {
				history.replaceState([], '', '/rule/' + this.currentYear + '/' + this.currentDept + '/' + this.currentRule + '/');
			}
			this.getRule();
		},
		chooseYear() {
			if (!this.currentDeptName) this.currentDept = Object.keys(Object.values(this.depts[this.currentYear])[0])[0];
			this.currentRule = -1;
			history.replaceState([], '', '/rule/');
		},
		chooseDept() {
			this.currentRule = -1;
			history.replaceState([], '', '/rule/');
		},
		getRule() {
			this.loading = true;
			if(this.currentRule == '000') this.currentRuleName = this.currentDeptName;
			else this.currentRuleName = Object.values(this.rules[this.currentYear]).find(item => this.currentRule in item)?.[this.currentRule].name;
			this.$axios.get('https://api.mcut-course.com/rule/get.php?year=' + this.currentYear + '&dept=' + this.currentDept + '&rule=' + this.currentRule)
				.then(res => {
					this.rule = res.data;
					this.initializeShowProperty();
					this.loading = false;
				});
			this.changeTerm();
		},
		initializeShowProperty() {
			if(!this.rule || !this.rule.data) return;
			this.rule.data.forEach(rule_type => {
				rule_type.data.forEach(rule_subtype => {
					this.$set(rule_subtype, 'show', false);
				});
			});
			setTimeout(() => {
				if (document.querySelector('.adsbygoogle') && document.querySelector('.adsbygoogle').offsetHeight == 0) {
					document.querySelector('.ad .ts-content').innerHTML = '<div class="ts-text is-description has-bottom-padded-small">贊助商</div>\
					<div class="ts-text is-secondary is-center-aligned has-vertically-padded">太無情了吧擋廣告 :(</div>';
				}
			}, 500);
		},
		formatRemark(remark) {
			let list_styles = [];
			let rows = remark.split('\r\n');
			let _rows = [];
			rows.forEach(row => {
				if (row == '<br />') return;
				if (row.search(/\d{1,2}\s/) === 0) {
					_rows.push(['s', row.slice(row.split(' ')[0].length + 1), '\'' + row.split(' ')[0] + '. \'']);
					if (!list_styles.includes('s')) list_styles.push('s');
				}
				else if (row.search(/\d{1,2}\./) === 0) {
					_rows.push(['d', row.slice(row.split('.')[0].length + 1), '\'' + row.split('.')[0] + '. \'']);
					if (!list_styles.includes('d')) list_styles.push('d');
				}
				else if (row.search(/.{1,2}\、/) === 0) {
					_rows.push(['c', row.slice(row.split('、')[0].length + 1), '\'' + row.split('、')[0] + '、\'']);
					if (!list_styles.includes('c')) list_styles.push('c');
				}
				else if (row.search(/\*/) === 0) {
					_rows.push(['b', row.slice(1), '\' • \'']);
					if (!list_styles.includes('b')) list_styles.push('b');
				}
				else if (row.search(/\(\d{1,2}\)/) === 0) {
					_rows.push(['q', row.slice(row.split(')')[0].length + 1), '\'' + row.split(')')[0] + ') \'']);
					if (!list_styles.includes('q')) list_styles.push('q');
				}
				else {
					_rows.push(['n', row, 'none']);
					if (!list_styles.includes('n')) list_styles.push('n');
				}
			});
			let _m = 0;
			let list_styles_margin = {};
			list_styles.forEach(style => {
				if (style == 'n') _m += 0;
				else if (style == 'c') _m += 35;
				else _m += 20;
				list_styles_margin[style] = _m;
			});
			let output = '<ol>';
			output += _rows.map(row => {
				return '<li class="' + row[0] + '" style="margin-left:' + list_styles_margin[row[0]] + 'px;list-style-type:' + row[2] + '">' + row[1] + '</li>';
			}).join('');
			output += '</ul>';
			return output;
		},
		changeTerm() {
			this.initializeShowProperty();
			localStorage['ruleTerm'] = this.currentRuleTerm;
			const now = new Date().getTime();
			const storedData = localStorage['courseData_' + this.currentRuleTerm];
			const storedTime = localStorage['courseDataTime_' + this.currentRuleTerm];

			if (storedData && storedTime && (now - storedTime < 30 * 60 * 1000)) {
				this.courses = JSON.parse(storedData).course;
			} else {
				this.loading = true;
				this.$axios.get('https://api.mcut-course.com/list.php?term=' + this.currentRuleTerm).then((res) => {
					localStorage['courseData_' + this.currentRuleTerm] = JSON.stringify(res.data);
					localStorage['courseDataTime_' + this.currentRuleTerm] = now;
					this.courses = res.data.course;
					this.loading = false;
				});
			}
		},
		showFindCourse(sid) {
			if(this.findCourses(sid).length == 0) return;
			let savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]') || [];
			
			if(savedCourse.length >= 1 && savedCourse[0].substring(0,4) != this.currentRuleTerm.replace('-', '')) {
				this.$swal({
					icon: 'warning',
					title: '欲選課學期與收藏的課程學期不同',
					html: '目前收藏的課程為 '+savedCourse[0].substring(0,3)+'-'+savedCourse[0].substring(3,4)+' 學期，是否要清空並切換至 ' + this.currentRuleTerm + ' 學期以檢視相符的課程？',
					confirmButtonText: '切換並檢視',
					cancelButtonText: '取消',
					showCancelButton: true,
				})
				.then((res) => {
					if (res.isConfirmed) {
						localStorage['savedCourse'] = '[]';
						localStorage['term'] = this.currentRuleTerm;
						localStorage['searchQuery'] = sid;
						localStorage['dept'] = '';
						localStorage['class'] = '';
						localStorage['type'] = '';
						this.$router.push('/course/');
					}
				});
				return;
			}
			localStorage['term'] = this.currentRuleTerm;
			localStorage['searchQuery'] = sid;
			localStorage['dept'] = '';
			localStorage['class'] = '';
			localStorage['type'] = '';
			this.$router.push('/course/');
		},
		showInfo(name) {
			if(['永續發展與社會實踐', '經典教育與社會實踐'].includes(name)) {
				this.$swal({
					title: name + ' 開課方式',
					html: '<div style="text-align:left">\
					<div class="ts-header is-large">1. 與通識必選課結合 (X+1)</div>\
					<p>在大一、大二的必修（如國文、英文、體育）或通識選修開學時，由老師詢問同學修課意願（依任課老師意願，不是每堂課都會詢問），達 15 人以上即可開設。</p>\
					<div class="ts-header is-large">2. 由通識中心開設課程</div>\
					<p style="margin-bottom:0">課程會開設在大三及大四，類似通識選修，將於選課系統上供學生選課。</p>\
					</div>',
					showConfirmButton: this.findCourses('00700F'),
					confirmButtonText: '查看 '+this.currentRuleTerm+' 開課課程',
					showCloseButton: true
				})
				.then((res) => {
					if (res.isConfirmed) {
						this.showFindCourse('00700F');
					}
				});
			}
		},

		beforeSlide(el) {
			el.style.height = '0';
		},
		slideIn(el, done) {
			el.offsetHeight;
			el.style.transition = 'height .5s ease';
			el.style.height = el.scrollHeight + 'px';
			el.addEventListener('transitionend', done);
		},
		slideOut(el, done) {
			el.style.transition = 'height .5s ease';
			el.style.height = '0';
			el.addEventListener('transitionend', done);
		}
	}
}
</script>