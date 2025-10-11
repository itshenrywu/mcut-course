<template>
	<div class="cell is-scrollable is-fluid is-horizontal" id="page-rule">
		<div class="cell is-tertiary is-scrollable sidebar" :class="{ 'show': showMobileSidebar }">
			<div class="ts-content">
				<div class="ts-wrap is-vertical has-top-padded">
					<button class="ts-close is-large mobile-only close-sidebar" aria-label="關閉此彈出視窗"
						@click="showMobileSidebar = !showMobileSidebar"></button>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">入學學年度</div>
						<div class="ts-select is-fluid">
							<select v-model="currentYear" @change="chooseYear();" aria-label="入學學年度">
								<option v-for="year in years" :value="year">{{ year + ' (U' +
									(year.toString().substring(1, 4)) + ')' }}</option>
							</select>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">入學系所/學程/組別</div>
						<div class="ts-select is-fluid">
							<select v-model="currentDept" @change="chooseDept();" aria-label="入學系所/學程/組別">
								<optgroup v-for="(dept_group, group) of depts[currentYear]" :label="group">
									<option v-for="(dept, dept_id) of dept_group" :value="dept_id">{{ dept }}</option>
								</optgroup>
							</select>
						</div>
					</div>
					<div v-if="currentDept != ''">
						<div class="ts-text is-label has-bottom-padded-small">系所/學分學程總表</div>
						<div class="ts-select is-fluid">
							<select v-model="currentRule" @change="saveRuleInput();" aria-label="系所/學分學程總表">
								<option :value="`-1`" disabled>請選擇...</option>
								<option v-for="(rule, rule_id) of rules[currentYear]['_']" value="000"
									v-if="rule.name == currentDeptName">系所課程總表</option>
								<optgroup v-for="(rule_group, group) of rules[currentYear]" :label="group"
									v-if="group != '_'">
									<option v-for="[rule_id, rule] of sortRulesByDept(rule_group)" :value="rule_id" :disabled="rule.hide_for == currentDeptName">
										{{ rule.dept ? formatDeptName(rule.dept) + ' - ' : '' }}{{ rule.name }}
									</option>
								</optgroup>
							</select>
						</div>
					</div>
					<div v-if="currentRule != '-1'">
						<div class="ts-text is-label has-bottom-padded-small">欲選課學期</div>
						<div class="ts-select is-fluid">
							<select v-model="currentRuleTerm" @change="changeTerm();" aria-label="欲選課學期">
								<option v-for="term in terms" :value="term">{{ term.split('-')[0] + ' 學年第 ' + term.split('-')[1] + ' 學期' }}</option>
							</select>
						</div>
					</div>
					<div v-if="currentRule != '-1'">
						<div class="ts-text is-label has-bottom-padded-small">排序方式</div>
						<div class="ts-wrap is-vertical is-compact">
							<label class="ts-radio is-small">
								<input name="ring" type="radio" v-model="term_sort" value="year_term" @change="changeTermSort()">
								上 → 下學期，再依年級排序
							</label>
							<label class="ts-radio is-small">
								<input name="ring" type="radio" v-model="term_sort" value="term" @change="changeTermSort()">
								依年級、學期排序
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="cell is-secondary is-fluid is-scrollable" style="min-height:100%; display: flex; align-items: center;" v-if="notFound">
			<div class="ts-container" style="display: flex; flex-direction: column; align-items: center;">
				<div class="ts-header is-icon is-center-aligned is-big">
					<span class="ts-icon ts-icon is-circle-exclamation-icon"></span>
					找不到此課程總表
				</div>
				<div class="ts-text is-center-aligned has-top-padded">
					此連結可能已失效，請點擊上方選單中的其他連結，或選擇其他課程總表。
				</div>
				<button class="ts-button is-secondary is-end-labeled-icon mobile-only has-top-spaced" @click="showMobileSidebar = !showMobileSidebar">選擇課程總表
					<span class="ts-icon is-chevron-down-icon"></span>
				</button>
			</div>
			<div class="ts-mask" v-show="showMobileSidebar" @click="showMobileSidebar = !showMobileSidebar"></div>
		</div>
		<div class="cell is-secondary is-fluid is-scrollable" style="min-height:100%" v-else>
			<div class="ts-container has-top-padded-large is-fitted mobile-padded">
				<h1 class="ts-header is-huge has-top-padded has-bottom-padded-large">
					畢業學分門檻
					<div class="print-only" v-if="currentRule != '-1'" style="margin-left: 1rem;">
						<template v-if="currentRule == '000'">
							{{ currentYear }} 入學 /
							{{ currentDeptName }}
						</template>
						<template v-else>
							{{ currentYear }} 入學 /
							{{ currentRuleName }}
						</template>
					</div>
				</h1>
				<button class="ts-button is-fluid is-secondary is-end-labeled-icon mobile-only"
					@click="showMobileSidebar = !showMobileSidebar">
					<template v-if="currentRule == '-1'">選擇課程總表</template>
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
							<div class="item">請先選擇<b>入學學年度</b>及<b>入學系所/學程/組別</b>。</div>
							<div class="item">須修畢你的<b>系所學程總表</b><span
								v-if="currentDeptName && !(currentDeptName.includes('博士') || currentDeptName.includes('碩士') || currentDeptName.includes('在職專班') || currentDeptName.includes('國際學生專班') || currentDeptName.includes('菁英班') || currentDeptName.includes('學位學程') || currentDeptName.includes('能源電池科技專班'))">，並須<b>任選一個學分學程（跨領域或第二專長）</b></span>才能畢業。
							</div>
							<div class="item">點擊各分類即可展開該分類課程。</div>
							<div class="item">欲選課前切換<b>欲選課學期</b>，即可查看該學期是否有開課。</div>
							<div class="item">此頁面僅提供<b>畢業學分門檻</b>，其他畢業門檻（如路跑、英文等）請見學校規定。</div>
							<div class="item" v-if="Object.keys(rules[currentYear]?.['跨領域'] || {})?.includes(currentRule)"><span class="ts-badge is-small is-dense is-primary">外系</span> 標示表示<b>非您所選的入學系所</b>的課程。此標示僅供參考，實際依照開課為準。</div>
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
												<td>
													{{ rule_item.name }}
													<span class="ts-badge is-small is-dense is-start-spaced is-primary" v-if="Object.keys(rules[currentYear]?.['跨領域'] || {})?.includes(currentRule) && rule_item.id.startsWith('AA')">外校</span>
													<span class="ts-badge is-small is-dense is-start-spaced is-primary" v-else-if="Object.keys(rules[currentYear]?.['跨領域'] || {})?.includes(currentRule) && course_dept?.[rule_item.id]?.length > 0 && !course_dept?.[rule_item.id]?.includes(currentDept)">外系</span>
												</td>
												<td>{{ rule_item.term }}</td>
												<td>{{ rule_item.credit }} 學分</td>
												<td class="ts-text is-description">
													<template v-if="courses && findCourses(rule_item.id).length >= 1">
														{{ findCourses(rule_item.id).length }} 門相符課程
														<span class="ts-icon is-angle-right-icon"></span>
													</template>
												</td>
												<td class="r-remark">
													<span v-if="['永續發展與社會實踐', '經典教育與社會實踐'].includes(rule_item.name)" @click.stop="showInfo(rule_item.name)">
														課程說明 <span class="ts-icon is-circle-info-icon"></span>
													</span>
													<template v-else-if="rule_item.remark && rule_item.remark.trim() != ''">
														<span @click.stop="showInfo(rule_item.name, rule_item.remark)">
															{{ rule_item.remark }}
														</span>
													</template>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</transition>
						</template>
					</div>
					<div class="ts-box ad is-hollowed box-mobile-spaced" v-if="showAd">
						<div class="ts-content">
							<div class="ts-text is-description has-bottom-padded-small">贊助商</div>
							<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5900703871265800" crossorigin="anonymous" onerror="document.querySelector('.ad .ts-content').innerHTML='<div class=&quot;ts-text is-description has-bottom-padded-small&quot;>贊助商</div><div class=&quot;ts-text is-secondary is-center-aligned has-vertically-padded&quot;>太無情了吧，擋廣告 😭<br>加入白名單，救救開發者 🙏</div>';"></script>
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

					<div class="ts-box has-vertically-spaced-large" v-if="rule.guide" v-for="guide_type in rule.guide">
						<div class="ts-content is-tertiary is-dense">
							修課指引 - {{ guide_type.name }}
							<div class="ts-text is-description" v-if="guide_type.req.length >= 6">
								{{ guide_type.req }}
							</div>
							<div class="ts-text is-description" v-if="guide_type.remark.length >= 6">
								備註：{{ guide_type.remark }}
							</div>
						</div>
						<template v-for="guide_subtype in guide_type.data">
							<div class="ts-content is-secondary is-dense rule_subtype_name"
								@click="guide_subtype.show = !guide_subtype.show">
								・
								{{ guide_subtype.name?.replace(/\(.*?\)/g, "") }}
								<span class="ts-badge is-small is-dense is-start-spaced is-outlined" v-if="guide_subtype.name?.match(/\((.*?)\)/)">
									{{ [...guide_subtype.name.matchAll(/\((.*?)\)/g)].map(m => m[1]).join(', ').replace(/([\x00-\xFF]+)(?=[^\x00-\xff])/g, " $1 ") }}
								</span>
								<span class="ts-icon" :class="{ 'is-angle-down-icon': !guide_subtype.show, 'is-angle-up-icon': guide_subtype.show }"></span>
							</div>
							<transition name="slide" @before-enter="beforeSlide" @enter="slideIn" @leave="slideOut">
								<div v-show="guide_subtype.show" class="rule_subtype">
									<table class="ts-table">
										<tbody>
											<tr v-for="rule_item in guide_subtype.data" :class="{'is-not-clickable':findCourses(rule_item.id).length == 0}" @click="showFindCourse(rule_item.id)">
												<td>
													{{ rule_item.name }}
													<span class="ts-badge is-small is-dense is-start-spaced is-primary" v-if="Object.keys(rules[currentYear]?.['跨領域'] || {})?.includes(currentRule) && rule_item.id.startsWith('AA')">外校</span>
													<span class="ts-badge is-small is-dense is-start-spaced is-primary" v-else-if="Object.keys(rules[currentYear]?.['跨領域'] || {})?.includes(currentRule) && course_dept?.[rule_item.id]?.length > 0 && !course_dept?.[rule_item.id]?.includes(currentDept)">外系</span>
												</td>
												<td>{{ rule_item.term }}</td>
												<td>{{ rule_item.credit }} 學分</td>
												<td class="ts-text is-description">
													<template v-if="courses && findCourses(rule_item.id).length >= 1">
														{{ findCourses(rule_item.id).length }} 門相符課程
														<span class="ts-icon is-angle-right-icon"></span>
													</template>
												</td>
												<td class="r-remark">
													<span @click.stop="showInfo(rule_item.name, rule_item.remark)">
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

#page-rule table {
	table-layout: fixed;
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
	width: 10rem;
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
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 30%;
}

#page-rule tr:hover {
	background-color: var(--ts-gray-100);
	cursor: pointer;
}

#page-rule tr.is-not-clickable:hover {
	background-color: transparent;
	cursor: default;
}

#page-rule .ts-badge.is-primary {
	background-color: var(--ts-static-primary-600);
	color: #FFF;
}

@media screen and (max-width: 767.98px) {
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

	#page-rule td:nth-child(4),
	#page-rule td.r-remark {
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
	#page-rule {
		overflow-y: visible !important;
	}

	#page-rule .ts-content.is-tertiary {
		border-bottom: 1px solid var(--ts-gray-200);
	}

	#page-rule .ts-content.is-secondary {
		border-bottom: 1px solid var(--ts-gray-200);
	}

	#page-rule td:first-child {
		padding-left: 4rem;
	}

	#page-rule td.ts-text.is-description {
		display: none;
	}

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
import { mapState, mapMutations } from 'vuex'
export default {
	async asyncData({ $axios, params, payload }) {
		let depts = {};
		let rules = {};
		let years = [];
		let terms = [];
		let description = '明志科技大學選課小幫手，幫助您輕鬆查詢全校課表，快速進行課程預排與衝堂檢查，還可以查詢畢業學分門檻及選課時程！';
		let currentRuleName = '';

		if (payload) {
			depts = payload.depts;
			rules = payload.rules;
			terms = payload.terms;
			description = payload.description != '' ? payload.description : '明志科技大學選課小幫手，幫助您輕鬆查詢全校課表，快速進行課程預排與衝堂檢查，還可以查詢畢業學分門檻及選課時程！';
			currentRuleName = payload.name;
		} else {
			const res = await $axios.get('https://api.mcut-course.com/rule/list2.php');
			depts = res.data.depts;
			rules = res.data.rules;
			terms = res.data.terms;
			currentRuleName = '';
		}

		let currentYear = new Date().getFullYear() - 1911;
		if ((new Date().getMonth() + 1) <= 6) currentYear--;
		for (let year = currentYear; year >= 108; year--) {
			years.push(year);
		}
		return { depts, rules, years, terms, currentRuleName, description };
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
			guide: [],
			terms: [],
			years: [],
			allAourses: [],

			loading: true,
			notFound: false,

			showMobileSidebar: false,

			course_dept: {},

			term_sort_key: {
				year_term: ['一上', '二上', '三上', '四上', '一下', '二下', '三下', '四下'],
				term: ['一上', '一下', '二上', '二下', '三上', '三下', '四上', '四下'],
			},
			term_sort: 'year_term',
			
			dept_short_name: {
				'機械工程系': '機械系',
				'電子工程系': '電子系',
				'電機工程系': '電機系',
				'環境與安全衛生工程系': '環安衛系',
				'材料工程系': '材工系',
				'管理暨設計學院': '管設學院',
				'工業工程與管理系': '工管系',
				'經營管理系': '經管系',
				'工業設計系': '工設系',
				'視覺傳達設計系': '視傳系',
				'化學工程系': '化工系',
				'環資跨領域實務菁英班': '環實務',
				'半導體材料與製程學士學位學程': '半導體',
				'通識教育中心': '通識中心',
			},
		};
	},
	head() {
		var year_title = this.currentYear || this.$route.params.year;
		return {
			title: (year_title ? year_title + ' 學年度入學 - ' : '') + (this.currentRuleName || '') + '課程總表 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: (year_title ? year_title + ' 學年度入學 - ' : '') + (this.currentRuleName || '') + '課程總表 | 明志科技大學選課小幫手' },
				{ hid: 'twitter:title', name: 'twitter:title', content: (year_title ? year_title + ' 學年度入學 - ' : '') + (this.currentRuleName || '') + '課程總表 | 明志科技大學選課小幫手' },

				{ hid: 'description', name: 'description', content: this.description },
				{ hid: 'og:description', property: 'og:description', content: this.description },

				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com' + this.$router.currentRoute.path },
				{ hid: 'og:image', property: 'og:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME },
				{ hid: 'twitter:image', name: 'twitter:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME }
			],
			script: (year_title && this.currentRuleName) ? [{
				hid: 'schema-breadcrumb',
				type: 'application/ld+json',
				json: {
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					'itemListElement': [{
						'@type': 'ListItem',
						'position': 1,
						'name': year_title + ' 學年度入學',
						'item': 'https://mcut-course.com/rule/'
					},{
						'@type': 'ListItem',
						'position': 3,
						'name': this.currentRuleName + '課程總表'
					}]
				}
			}] : []
		};
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
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
		formatDeptName() {
			return (name) => {
				if(this.dept_short_name[name]) {
					return this.dept_short_name[name];
				}
				return name;
			}
		},
	},
	mounted() {
		this.$root.$on('showAd', () => { this.showAd = true; });
		this.init();
		if(!this.currentRuleName && this.$route.params.id) {
			this.notFound = true;
		}
	},
	methods: {
		...mapMutations(['setSavedCourse']),
		sortRulesByDept(ruleGroup) {
			const deptOrder = Object.keys(this.dept_short_name);
			return Object.entries(ruleGroup).sort(([, a], [, b]) => {
				if (a.dept && b.dept) {
					const aIndex = deptOrder.indexOf(a.dept);
					const bIndex = deptOrder.indexOf(b.dept);
					if (aIndex === -1 && bIndex === -1) return a.dept.localeCompare(b.dept);
					if (aIndex === -1) return 1;
					if (bIndex === -1) return -1;
					return aIndex - bIndex;
				}
				if (a.dept && !b.dept) return -1;
				if (!a.dept && b.dept) return 1;
				return a.name.localeCompare(b.name);
			});
		},
		async init() {
			this.$axios.get('https://api.mcut-course.com/rule/get_dept.php')
			.then(res => {
				this.course_dept = res.data;
			});
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
			if (localStorage['term_sort']) this.term_sort = localStorage['term_sort'];
			else this.term_sort = 'year_term';

			if (this.currentRuleTerm == '') this.currentRuleTerm = this.terms[0];

			this.loading = false;
			this.saveRuleInput();
		},
		saveRuleInput() {
			if (this.currentRule == undefined) {
				this.currentRule = '-1';
				return;
			}
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
			this.notFound = false;
			if(this.currentRule == '000') this.currentRuleName = this.currentDeptName;
			else this.currentRuleName = Object.values(this.rules[this.currentYear]).find(item => this.currentRule in item)?.[this.currentRule].name;
			this.$axios.get('https://api.mcut-course.com/rule/get.php?year=' + this.currentYear + '&dept=' + this.currentDept + '&rule=' + this.currentRule)
				.then(res => {
					this.rule = res.data;
					this.initializeShowProperty();
					this.loading = false;
					if(!this.rule.data || this.rule.data.length == 0) {
						this.notFound = true;
					}
				});
			this.changeTerm();
		},
		initializeShowProperty(set_show = true) {
			if(!this.rule || !this.rule.data) return;
			this.rule.data.forEach(rule_type => {
				rule_type.data.forEach(rule_subtype => {
					rule_subtype.data.sort((a, b) => {
						return this.term_sort_key[this.term_sort].indexOf(a.term) - this.term_sort_key[this.term_sort].indexOf(b.term);
					});
					if(set_show) this.$set(rule_subtype, 'show', false);
				});
			});
			if(!this.rule.guide) return;
			this.rule.guide.forEach(guide_type => {
				guide_type.data.forEach(guide_subtype => {
					if(set_show) this.$set(guide_subtype, 'show', false);
				});
			});
		},
		changeTermSort() {
			this.initializeShowProperty(0);
			localStorage['term_sort'] = this.term_sort;
		},
		formatRemark(remark) {
			remark = remark.replace(/外系/g, '<span style="color: var(--ts-static-primary-600);">外系</span>');

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
				return '<li class="' + row[0] + '" style="margin-left:' + list_styles_margin[row[0]] + 'px;list-style-type:' + row[2] + '">' +
					row[1].replace(/([^\x00-\x7F]+)([A-Za-z0-9]+)/g, '$1 $2').replace(/([A-Za-z0-9]+)([^\x00-\x7F]+)/g, '$1 $2') +
				'</li>';
			}).join('');
			output += '</ul>';
			return output;
		},
		changeTerm() {
			this.initializeShowProperty();
			localStorage['ruleTerm'] = this.currentRuleTerm;
			const storedData = localStorage['courseData_' + this.currentRuleTerm];
			const storedTime = localStorage['courseDataTime_' + this.currentRuleTerm];

			if (storedData && storedTime && process.env.GEN_TIME == storedTime) {
				this.courses = JSON.parse(storedData).course;
			} else {
				this.loading = true;
				this.$axios.get('https://api.mcut-course.com/list.php?term=' + this.currentRuleTerm).then((res) => {
					localStorage['courseData_' + this.currentRuleTerm] = JSON.stringify(res.data);
					localStorage['courseDataTime_' + this.currentRuleTerm] = process.env.GEN_TIME;
					this.courses = res.data.course;
					this.loading = false;
				});
			}
		},
		async showFindCourse(sid) {
			if(this.findCourses(sid).length == 0) return;
			this.$swal({
				title: '開設於 ' + this.currentRuleTerm.split('-')[0] + ' 學年第 ' + this.currentRuleTerm.split('-')[1] + ' 學期的相符課程 (' + this.findCourses(sid).length + ')',
				customClass: {
					container: 'similar-courses',
				},
				html: '<div class="ts-menu is-small is-dense is-separated alt_course_courses" style="max-height:75vh">' +
					(() => {
						return this.findCourses(sid).map(course => {
							return '<a target="_blank" class="item" href="/course/' + course.id.substring(0, 4) + '/' + course.id.substring(4, 8) + '/' + course.id.substring(8) + '/">\
								<div class="ts-header">' +
									course.name + '&nbsp;\
									<span class="ts-badge is-small is-dense '+({ '必修': 'is-orange', '選修': 'is-green', '重修': 'is-gray' })[course.type]+'">'+course.type+'</span>' +
								'</div>\
								<div class="ts-text is-description is-start-aligned" style="line-height:1.4;">' +
									course.dept + ' ' + course.year + ' ' + course.class + '・' +
									course.teacher + ' 老師' +
									(course.comment ? '<br>' + course.comment : '') +
								'</div>\
							</a>';
						}).join('');
					})() +
					'</div>',
				showConfirmButton: false,
				showCloseButton: true,
			});
		},
		showInfo(name, remark) {
			if(['永續發展與社會實踐', '經典教育與社會實踐'].includes(name)) {
				this.$swal({
					title: name + ' 開課方式',
					html: '<div style="text-align:left">\
					<div class="ts-header is-large">1. 與通識必選課結合 (X+1)</div>\
					<p>在大一、大二的必修（如國文、英文、體育）或通識選修開學時，由老師詢問同學修課意願（依任課老師意願，不是每堂課都會詢問），達 15 人以上即可開設。</p>\
					<div class="ts-header is-large">2. 由通識中心開設課程</div>\
					<p style="margin-bottom:0">課程會開設在大三及大四，類似通識選修，將於選課系統上供學生選課。</p>\
					</div>',
					showConfirmButton: false,
					showCloseButton: true
				})
				.then((res) => {
					if (res.isConfirmed) {
						this.showFindCourse('00700F');
					}
				});
			}
			else if (remark) {
				this.$swal({
					title: name,
					html: '<div style="text-align:left">' + remark + '</div>',
					showConfirmButton: false,
					showCloseButton: true
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