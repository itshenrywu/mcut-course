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
			<div class="ts-container has-top-padded-large">
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
			<div class="ts-container is-fitted">
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
				<div class="ts-box has-vertically-spaced-large" v-if="!loading && currentRule != '-1' && rule.data"
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
								<table class="ts-table course-table">
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
											<td class="ts-text is-description">{{ rule_item.remark.trim() }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</transition>
					</template>
				</div>
				<div class="ts-box has-vertically-spaced-large"
					v-if="!loading && currentRule != '-1' && rule.remark && rule.remark.length > 0">
					<div class="ts-content" id="remark">
						<span class="ts-badge has-bottom-spaced-small is-small is-dense">說明</span>
						<div v-for="remark in rule.remark" v-html="formatRemark(remark)"></div>
					</div>
				</div>
				<div class="ts-box has-vertically-spaced-large" v-if="!loading && currentRule != '-1' && rule.contact">
					<div class="ts-content">
						<span class="ts-badge has-bottom-spaced-small is-small is-dense">承辦人</span><br>
						{{ rule.contact[0] + ' ' + rule.contact[1] }}<br>
						<a :href="'tel:0229089899,' + rule.contact[2]">(02) 2908-9899 #{{ rule.contact[2] }}</a>
					</div>
				</div>
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

@media screen and (max-width: 768px) {

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
		width: calc(100% - 11rem);
	}

	#page-rule td:nth-child(2),
	#page-rule td:nth-child(3) {
		text-align: right;
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

		if (payload) {
			depts = payload.depts;
			rules = payload.rules;
			terms = payload.terms;
		} else {
			const res = await $axios.get('https://api.mcut-course.com/rule/list2.php');
			depts = res.data.depts;
			rules = res.data.rules;
			terms = res.data.terms;
		}

		let currentYear = new Date().getFullYear() - 1911;
		if (new Date().getMonth() < 8) currentYear--;
		for (let year = 107; year <= currentYear; year++) {
			years.push(year);
		}
		return { depts, rules, years, terms, payload };
	},
	data() {
		return {
			currentYear: '',
			currentDept: '',
			currentRule: '',
			currentRuleTerm: '',

			rule: {},
			terms: [],
			years: [],
			allAourses: [],

			loading: true,

			showMobileSidebar: false
		};
	},
	head() {
		return {
			title: '課程總表' + (this.currentRuleName ? ' - ' + this.currentRuleName : '') + ' | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '課程總表' + (this.currentRuleName ? ' - ' + this.currentRuleName : '') + ' | 明志科技大學選課小幫手' },
				{ hid: 'twitter:title', name: 'twitter:title', content: '課程總表' + (this.currentRuleName ? ' - ' + this.currentRuleName : '') + ' | 明志科技大學選課小幫手' },

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
		currentRuleName() {
			if (this.payload) return this.payload.name;
			if (!this.currentRule || this.currentRule == '000') return this.currentDeptName;
			return Object.values(this.rules[this.currentYear]).find(item => this.currentRule in item)?.[this.currentRule].name;
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
			if (this.$router.currentRoute.params.id && this.$router.currentRoute.params.id.length == 9) {
				localStorage['ruleYear'] = this.$router.currentRoute.params.id.substring(0, 3);
				localStorage['ruleDept'] = this.$router.currentRoute.params.id.substring(3, 6);
				localStorage['ruleRule'] = this.$router.currentRoute.params.id.substring(6, 9);
			}

			if (localStorage['ruleYear'] && this.years.includes(localStorage['ruleYear'])) this.currentYear = localStorage['ruleYear'];
			else this.currentYear = this.years[this.years.length - 1];

			if (localStorage['ruleDept']) this.currentDept = localStorage['ruleDept'];
			if (!this.currentDeptName) {
				this.currentDept = Object.keys(Object.values(this.depts[this.currentYear])[0])[0];
				refreshId = true;
			}

			if (localStorage['ruleRule']) this.currentRule = localStorage['ruleRule'];
			if (!this.currentRule) {
				this.currentRule = '-1';
				refreshId = true;
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
			history.replaceState([], '', '/rule/' + this.currentYear + '/' + this.currentDept + '/' + this.currentRule + '/');
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
			let savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]') || [];
			
			if(savedCourse.length >= 1 && savedCourse[0].substring(0,4) != this.currentRuleTerm.replace('-', '')) {
				this.$swal({
					icon: 'warning',
					title: '欲選課學期與收藏的課程學期不同',
					html: '是否要清空目前已收藏的課程，並切換至 ' + this.currentRuleTerm + ' 學期？',
					confirmButtonText: '確定',
					cancelButtonText: '取消',
					showCancelButton: true,
				})
				.then((res) => {
					if (res.isConfirmed) {
						localStorage['savedCourse'] = '[]';
						localStorage['term'] = this.currentRuleTerm;
						localStorage['searchQuery'] = this.currentRuleTerm.replace('-', '') + sid;
						localStorage['dept'] = '';
						localStorage['class'] = '';
						localStorage['type'] = '';
						this.$router.push('/');
					}
				});
				return;
			}
			localStorage['savedCourse'] = '[]';
			localStorage['term'] = this.currentRuleTerm;
			localStorage['searchQuery'] = this.currentRuleTerm.replace('-', '') + sid;
			localStorage['dept'] = '';
			localStorage['class'] = '';
			localStorage['type'] = '';
			this.$router.push('/');
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