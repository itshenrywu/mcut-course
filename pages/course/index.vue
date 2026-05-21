<template>
	<div class="cell is-scrollable is-fluid is-horizontal" id="page-search">
		<div class="cell is-tertiary is-scrollable sidebar" :class="{ 'show': showMobileSidebar }">
			<div class="ts-content">
				<div class="ts-wrap is-vertical has-top-padded">
					<button class="ts-close is-large mobile-only close-sidebar" aria-label="關閉此彈出視窗"
						@click="showMobileSidebar = !showMobileSidebar"></button>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">學年/學期</div>
						<div class="ts-select is-fluid">
							<div class="content" data-dropdown="term-dropdown">{{ currentTerm != '' ? currentTerm.split('-')[0] + ' 學年第 ' + currentTerm.split('-')[1] + ' 學期' : '' }}</div>
							<div class="ts-dropdown is-dense" data-position="bottom-start" id="term-dropdown" style="height:60vh">
								<template v-for="year_group of terms">
									<div class="header">{{ year_group.year }} 學年</div>
									<div class="item is-indented" v-for="term of year_group.term" :class="{ 'is-selected': year_group.year+'-'+term == currentTerm }"
										@click="chooseTerm(year_group.year+'-'+term)">
										第 {{ term }} 學期
										<span class="description" v-if="term == '1'">上學期 / 二升三暑期</span>
										<span class="description" v-else-if="term == '2'">{{ getSecondTermText(year_group.year, term) }}</span>
										<span class="description" v-else>暑修</span>
									</div>
								</template>
							</div>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">課程名稱 / 老師 / 序號</div>
						<div class="ts-input is-fluid is-end-icon">
							<input type="text" aria-label="課程名稱 / 老師 / 序號" v-model.trim="searchQuery" @input="saveSearchInput();">
							<span class="ts-icon is-x-icon" @click="searchQuery = ''; saveSearchInput();" v-bind:style="{color: searchQuery=='' ? 'transparent' : 'var(--ts-gray-400)'}"></span>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">開課單位（系所）</div>
						<div class="ts-select is-fluid">
							<select v-model="currentDept" @change="chooseDept()" aria-label="開課單位（系所）">
								<option selected="selected" value="">不限</option>
								<optgroup v-for="(dept_group, group) of depts" :label="group">
									<option v-for="dept in dept_group">{{ dept }}</option>
								</optgroup>
							</select>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">開課班級</div>
						<div class="ts-select is-fluid">
							<select v-model="currentClass" @change="saveSearchInput();" aria-label="開課班級">
								<option selected="selected" value="">不限</option>
								<option v-for="grade_class in classes">{{ grade_class }}</option>
							</select>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">修別 <span
								v-show="currentDept && currentDept.includes('通識')">/ 通識類別</span></div>
						<div class="ts-select is-fluid">
							<select v-model="currentType" @change="saveSearchInput();" aria-label="修別">
								<option value="" selected="selected">不限</option>
								<option>必修</option>
								<option>選修</option>
								<option value="mixed" v-if="canShowClassMixedCourses">班級必修 + 年級選修</option>
								<option v-if="currentTerm.split('-')[1] >= '3'">重修</option>
								<template v-if="currentDept && currentDept.includes('通識')">
									<option v-for="type in generalCourseTypes">{{ type }}</option>
								</template>
								<option v-if="currentTerm.split('-')[1] <= '2'">重修</option>
							</select>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">
							衝堂的課程
							<span data-position="top" data-tooltip="此設定不影響已收藏的課程" class="ts-icon is-circle-info-icon"></span>
						</div>
						<div class="ts-selection is-fluid">
							<label class="item">
								<input type="radio" name="showConflict" :value="1" v-model="showConflict"
									@change="saveSearchInput();" />
								<div class="text">顯示</div>
							</label>
							<label class="item">
								<input type="radio" name="showConflict" :value="2" v-model="showConflict"
									@change="saveSearchInput();" />
								<div class="text">置底</div>
							</label>
							<label class="item">
								<input type="radio" name="showConflict" :value="0" v-model="showConflict"
									@change="saveSearchInput();" />
								<div class="text">隱藏</div>
							</label>
						</div>
					</div>
					<div class="ts-text is-description" v-if="showMobileSidebar">{{ filteredCourses.length }} 門符合條件的課程
					</div>
					<div v-show="canShowSaveRequiredButton" @click="saveRequiredCourse()">
						<button class="ts-button is-small is-fluid is-start-icon has-top-spaced">
							<span class="ts-icon is-star-icon"></span>
							收藏本班必修課
						</button>
					</div>
					<div class="ts-divider"></div>
					<div class="ts-text is-description">
						<span class="ts-badge has-bottom-spaced-small is-small is-dense">提示</span>
						<div class="ts-list is-small is-unordered">
							<div class="item">可先選擇自己的系所和班級，來儲存自己班級的必修課</div>
							<div class="item">點選課程名稱可查看詳細資訊</div>
							<div class="item">點擊星號即可收藏，僅能收藏沒有衝堂的課程</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="cell is-secondary is-fluid is-scrollable" id="main">
			<div class="ts-container has-top-padded-large is-fitted mobile-padded">
				<div class="ts-wrap is-middle-aligned">
					<h1 class="ts-header is-huge has-vertically-padded">進階搜尋</h1>
					<div class="ts-text is-description" v-if="filteredCourses.length > 0">{{ filteredCourses.length }}
						門符合條件的課程
					</div>
				</div>
				<button class="ts-button is-fluid is-secondary is-end-labeled-icon mobile-only button-auto-height" @click="showMobileSidebar = !showMobileSidebar">
					{{ filterInfo }}
					<span class="ts-icon is-chevron-down-icon"></span>
				</button>
				<div v-show="canShowSaveRequiredButton" @click="saveRequiredCourse()">
					<button class="ts-button is-fluid has-top-spaced is-outlined mobile-only is-start-icon">
						<span class="ts-icon is-star-icon"></span>
						收藏本班必修課
					</button>
				</div>
			</div>
			<div class="ts-container has-bottom-padded-large is-fitted" v-if="!loading">
				<template v-if="filteredCourses.length > 0">
					<div class="ts-wrap has-top-padded has-bottom-padded-large is-center-aligned">
						<div class="ts-selection">
							<label class="item">
								<input type="radio" name="displayType" v-model="displayType" value="1"
									@change="changeDisplayType()">
								<div class="text">列表檢視</div>
							</label>
							<label class="item">
								<input type="radio" name="displayType" v-model="displayType" value=""
									@change="changeDisplayType()">
								<div class="text">課表檢視</div>
							</label>
						</div>
					</div>
					<div class="ts-box has-bottom-spaced" v-if="displayType == '' && ((!currentClass && !currentDept.includes('通識')) || !currentDept)">
						<div class="ts-content">
							<span class="ts-text is-negative is-bold">課表檢視無法在此搜尋條件下使用</span><br>
							請先選擇開課單位及班級以使用課表檢視，或改用列表檢視。
						</div>
					</div>
					<div class="ts-box has-bottom-spaced">
						<CourseList
							:courses="filteredCourses"
							:allCourses="courses"
							:displayType="displayType"
							:timeSection="time_section"
							:maxEndSection="maxEndSection"
							:savedCourse="savedCourseForCurrentTerm"
							:isActive="(course) => savedCourseForCurrentTerm.includes(course.id)"
							:currentClass="currentClass"
							:currentDept="currentDept"
							@course-click="showCourse"
							@action-click="saveCourse"
						/>
					</div>
					<div class="ts-box ad is-hollowed box-mobile-spaced" v-if="filteredCourses.length > 0 && showAd">
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
				</template>
				<div class="ts-blankslate" v-else-if="courses.length == 0">
					<span class="ts-icon is-circle-alert-icon"></span>
					<div class="header">目前無課程資料</div>
					<div class="description">請稍後再試</div>
				</div>
				<div class="ts-blankslate" v-else>
					<span class="ts-icon is-circle-alert-icon"></span>
					<div class="header">找不到符合條件的課程</div>
					<div class="description">請嘗試修改您的條件，或選擇其他學期</div>
				</div>
			</div>
			<div class="ts-mask" v-show="showMobileSidebar" @click="showMobileSidebar = !showMobileSidebar"></div>
		</div>
		<NuxtLink to="/saved/" class="button-fab" aria-label="查看已儲存的課程">
			<span class="ts-icon is-star-icon"></span>
			<span class="ts-badge is-negative" v-if="savedCourseForCurrentTerm.length > 0">{{ savedCourseForCurrentTerm.length }}</span>
		</NuxtLink>
		<loading loadingText="課表下載中" v-show="loading" />
	</div>
</template>
<style>
.ts-table tr.is-indicated {
	box-shadow: 2px 0 0 var(--ts-primary-400) inset !important;
}

.ts-table tr.is-indicated.is-negative {
	box-shadow: 2px 0 0 var(--ts-negative-600) inset !important;
}

#page-search .ts-selection.is-fluid {
	background: var(--ts-gray-50);
}

#page-search .sidebar .ts-selection .item:last-child input:checked+.text {
	background: var(--ts-static-gray-600);
	border-color: var(--ts-static-gray-600);
	color: var(--ts-static-gray-50);
}

#page-search tr.ad:hover {
	cursor: default;
	background: transparent;
}
</style>
<script>
import { mapMutations, mapState } from 'vuex';
import CourseList from '~/components/CourseList.vue';
export default {
	components: {
		CourseList
	},
	head() {
		return {
			title: '進階搜尋 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '進階搜尋 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/course/'  },
			]
		}
	},
	data() {
		return {
			time_section: ['0.5', '1', '2', '3', '4', '4.5', '5', '6', '7', '8', '8.5', '9', '10', '11', '12'],
			courses: [],
			terms: {},
			defaultDeptGroup: {
				'全校': [],
				'四技日間部': [],
				'學院': [],
				'碩士/碩專/博士/在職專班': [],
				'進修部': [],
			},
			generalCourseTypes: [],
			depts: {},
			classes: [],

            itemsPerPage: 25,

			loading: true,

			searchQuery: '',
			currentTerm: '',
			currentDept: '',
			currentClass: '',
			currentType: '',
			showConflict: undefined,

			savedCourse: [],

			showMobileSidebar: false,

			displayType: '',
			
			coursesMap: new Map(),
			sectionIndexMapObj: {},
			cachedCoursedTime: new Set(),
		}
	},
	async mounted() {
		const storedDisplayType = localStorage.getItem('displayType');
		if (storedDisplayType === null) {
			this.displayType = '1';
			localStorage.setItem('displayType', '1');
		} else {
			this.displayType = storedDisplayType;
		}
		if (localStorage['searchQuery']) this.searchQuery = localStorage['searchQuery'];
		if(['0','1','2'].includes(localStorage['showConflict'])) this.showConflict = localStorage['showConflict'];
		else this.showConflict = 1;
		let savedCourse = await this.$store.dispatch('getSavedCourse');
		if (savedCourse && savedCourse.length > 0) {
			this.savedCourse = savedCourse;
		}
		this.currentTerm = localStorage['term'] || '';
		this.fetchData();
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
		savedCourseForCurrentTerm() {
			if (!this.currentTerm) return [];
			const prefix = this.currentTerm.split('-').join('');
			return this.savedCourse.filter(id => id.startsWith(prefix));
		},
		week_text() {
			return (day, course) => {
				let _day = ['(其他)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)', '(其他)'][day];
				if(course?.comment.includes('塊狀')) return '(其他)';
				return _day;
			}
		},
		filterInfo() {
			let info = [];
			if(this.currentTerm) info.push(this.currentTerm.split('-')[0] + '-' + this.currentTerm.split('-')[1] + ' 學期');
			if(this.currentDept) info.push(this.currentDept + (this.currentClass ? ' ' + this.currentClass : '全年級'));
			if(this.currentType == 'mixed') info.push('班級必修 + 年級選修');
			else if(this.currentType) info.push(this.currentType.includes('-') ? this.currentType.split('- ')[1] : this.currentType);
			if(this.searchQuery) info.push('關鍵字：' + this.searchQuery);
			if(info.length == 0) return '修改篩選條件';
			if(info.length <= 1) info.push('全部課程');
			return info.join(' / ');
		},
		filteredCourses() {
			let filtered = this.courses;
			if (this.searchQuery !== '') {
				filtered = filtered.filter(course => 
					course.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
					course.teacher.includes(this.searchQuery) ||
					(course.id.toLowerCase().includes(this.searchQuery.toLowerCase()) && this.searchQuery.length >= 3)
				);
			}
			if (this.currentDept !== '') {
				filtered = filtered.filter(course => course.dept === this.currentDept || course.alt_for);
			}
			if (this.currentClass !== '' && this.currentType !== 'mixed') {
				filtered = filtered.filter(course => (course.year + ' ' + course.class) === this.currentClass || course.alt_for);
			}
			if(this.currentType == undefined && this.currentDept.includes('通識')) this.currentType = '選修';
			if (this.currentType !== '' && this.currentType !== 'mixed') {
				filtered = filtered.filter(course => {
					if(course.type === this.currentType) return true;
					else if(this.currentType.includes('-') && course.otherinfo) {
						if(
							(course.otherinfo.includes('社會研究與未來趨勢') || course.otherinfo.includes('社會科學')) &&
							(this.currentType.split('- ')[1] == '社會研究與未來趨勢' || this.currentType.split('- ')[1] == '社會科學')
						) return true;
						else if(
							(course.otherinfo.includes('自然科學與環境永續') || course.otherinfo.includes('自然科學')) &&
							(this.currentType.split('- ')[1] == '自然科學與環境永續' || this.currentType.split('- ')[1] == '自然科學')
						) return true;
						else if(course.otherinfo == this.currentType.split('- ')[1]) return true;
					}
					return false;
				});
			}
			if( this.currentType == 'mixed' && this.currentClass !== '') {
				filtered = filtered.filter(course => {
					let isRequired = (course.year + ' ' + course.class) === this.currentClass && course.type === '必修';
					let isElective = course.year === this.currentClass.split(' ')[0] && course.type === '選修';
					return isRequired || isElective || course.alt_for;
				});
			}
			if (this.showConflict == 0) {
				filtered = filtered.filter(course => !this.isConflicted(course) || this.savedCourseForCurrentTerm.includes(course.id));
			}
			if (this.currentDept.includes('社會組') || this.currentDept.includes('外文組')) {
				filtered = filtered.filter(course => !course.id.includes('ALT_'));
			}
			if (this.currentDept !== '' && this.currentClass !== '') {
				filtered = filtered.filter((course) => {
					return !course.alt_for || (course.alt_for && course.alt_for.includes((this.currentDept + this.currentClass).replace(/\s/, '')));
				});
			} else {
				filtered = filtered.filter(course => !course.alt_for);
			}
			return filtered;
		},
		canShowSaveRequiredButton() {
			return !this.loading &&
				this.searchQuery == '' &&
				(this.currentTerm.includes('-1') || this.currentTerm.includes('-2')) &&
				!this.currentClass.includes('暑') &&
				!this.currentClass.includes('重') &&
				this.currentClass != '' &&
				(this.currentType == '必修' || this.currentType == '') &&
				!['通識中心四技', '國文組-四技(日)', '外文組-四技(日)', '社會組-四技(日)', '體育組-四技(日)', '自然組-四技(日)', '自然組(二)-四技(日)', '工程學院', '環資學院', '管理暨設計學院', 'TAICA'].includes(this.currentDept)
		},
		isConflicted(_course) {
			return (_course) => {
				if (this.savedCourse.length == 0) return false;
				if (!_course.time) return false;


				const coursedTime = new Set();
				for (const courseId of this.savedCourseForCurrentTerm) {
					if (courseId === _course.id) continue; // 排除当前课程
					const course = this.coursesMap.get(courseId);
					if (!course?.time) continue;
					for (const [week, timeRange] of course.time) {
						const [startStr, endStr] = timeRange.split('~');
						const startIdx = this.sectionIndexMapObj[startStr];
						const endIdx = this.sectionIndexMapObj[endStr];
						if (startIdx === undefined || endIdx === undefined) continue;
						for (let i = startIdx; i <= endIdx; i++) {
							coursedTime.add(`${week}_${i}`);
						}
					}
				}

				// 检查当前课程是否与其他已收藏课程衝突
				for (const [week, timeRange] of _course.time) {
					const [startStr, endStr] = timeRange.split('~');
					const startIdx = this.sectionIndexMapObj[startStr];
					const endIdx = this.sectionIndexMapObj[endStr];
					if (startIdx === undefined || endIdx === undefined) continue;
					
					for (let i = startIdx; i <= endIdx; i++) {
						if (coursedTime.has(`${week}_${i}`)) return true;
					}
				}
				return false;
			}
		},
		hasCoursedTime() {
			return this.savedCourseForCurrentTerm.map(course_id => {
				let course = this.courses.find(course => course.id === course_id);
				if (!course) return false;
				return course.time.map(time => {
					let week = time[0];
					let section = time[1].split('~').map(section => this.time_section.indexOf(section));
					return Array.from({ length: section[1] - section[0] + 1 }, (_, i) => week + '_' + this.time_section[section[0] + i]);
				}).flat();
			}).flat();
		},
		canShowClassMixedCourses() {
			return ['四技機械系', '四技電機系', '四技電子系', '四技化工系', '四技材工系', '四技工管系', '四技經管系', '行銷設計學程'].includes(this.currentDept) &&
				this.classes.filter(c => c.split(' ')[0] == this.currentClass.split(' ')[0]).length >= 2 &&
				(this.currentClass.includes('甲') || this.currentClass.includes('乙') || (this.currentClass.includes('丙') && this.currentDept == '四技機械系'));
		},
		maxEndSection: function() {
			if(this.currentClass == '' && !this.currentDept.includes('通識')) return 8;
			let maxSection = 8;
			this.filteredCourses.forEach(course => {
				course.time.forEach(time => {
					let endSection = Number(time[1].split('~')[1]);
					if (endSection > maxSection) maxSection = endSection;
				});
			});
			return maxSection;
		}
	},
	methods: {
		...mapMutations(['setSavedCourse']),
		fetchData() {
			const storedData = localStorage['courseData_' + this.currentTerm];
			const storedTime = localStorage['courseDataTime_' + this.currentTerm];

			if (storedData && storedTime && process.env.GEN_TIME == storedTime) {
				const res = JSON.parse(storedData);
				this.processData(res);
			} else {
				this.$axios.get('https://api.mcut-course.com/list.php?term=' + this.currentTerm).then((res) => {
					localStorage['courseData_' + this.currentTerm] = JSON.stringify(res.data);
					localStorage['courseDataTime_' + this.currentTerm] = process.env.GEN_TIME;
					this.processData(res.data);
				});
			}
		},
		processData(data) {
			data.course.forEach((course, index) => {
				course.sortOrder = index;
			});
			this.courses = data.course;
			
			this.coursesMap.clear();
			data.course.forEach(course => {
				this.coursesMap.set(course.id, course);
			});
			
			this.sectionIndexMapObj = {};
			this.time_section.forEach((section, index) => {
				this.sectionIndexMapObj[section] = index;
			});
			var _terms = {};
			data.term.forEach(term => {
				let _year = term.split('-')[0];
				let _term = term.split('-')[1];
				if (!_terms[_year]) _terms[_year] = [];
				_terms[_year].push(_term);
			});
			this.terms = Object.entries(_terms)
			.sort((a, b) => Number(b[0]) - Number(a[0]))
			.map(([year, term]) => ({ year: year, term: term }));

			this.depts = JSON.parse(JSON.stringify(this.defaultDeptGroup));

			let depts = this.courses.map(course => course.dept).filter((value, index, self) => self.indexOf(value) === index);
			depts.forEach((dept) => {
				if (dept.includes('進修部')) this.depts['進修部'].push(dept);
				else if (dept.includes('學院')) this.depts['學院'].push(dept);
				else if (dept.includes('碩') || dept.includes('博') || dept.includes('在職專班')) this.depts['碩士/碩專/博士/在職專班'].push(dept);
				else if (
					(dept.includes('四技') && dept.includes('系')) ||
					['人工智慧學程', '環實務', '電池專班', '半導體學程', '行銷設計學程', '四技行設專班'].includes(dept)
				) this.depts['四技日間部'].push(dept);
				else this.depts['全校'].push(dept);
			});
			this.currentDept = localStorage['dept'];
			if (!depts.includes(this.currentDept)) {
				this.currentDept = '';
				localStorage['dept'] = '';
			}
			this.currentClass = localStorage['class'] || '';
			this.currentType = localStorage['type'] || '';
			if(this.currentType == undefined && this.currentDept.includes('通識')) this.currentType = '';
			this.generalCourseTypes = this.courses
				.filter(course => course.dept.includes('通識') && course.otherinfo)
				.map(course => '- ' + course.otherinfo)
				.filter((value, index, self) => self.indexOf(value) === index);
			this.chooseDept();

			let term_id = this.courses[0].id.substring(0, 4);
			this.currentTerm = term_id.substring(0, 3) + '-' + term_id.substring(3, 4);

			this.updateCachedCoursedTime();
			
			this.loading = false;
		},
		chooseTerm(term) {
			if (this.currentTerm == term) return;
			this.loading = true;
			this.currentTerm = term;
			localStorage['term'] = term;
			this.fetchData();
		},
		saveSearchInput() {
			if (this.showConflict == 1) {
				this.courses.sort((a, b) => a.sortOrder - b.sortOrder);
			}
			else if (this.showConflict == 2) {
					this.courses.sort((a, b) => {
					const aIsSaved = this.savedCourseForCurrentTerm.includes(a.id);
					const bIsSaved = this.savedCourseForCurrentTerm.includes(b.id);
					const aIsConflicted = this.isConflicted(a);
					const bIsConflicted = this.isConflicted(b);
					
					if (aIsConflicted && !bIsConflicted && !aIsSaved) return 1;
					if (!aIsConflicted && bIsConflicted && !bIsSaved) return -1;
					return a.sortOrder - b.sortOrder;
				});
			}

			if(this.currentType == 'mixed' && !this.canShowClassMixedCourses) {
				this.currentType = '';
			}

			localStorage['class'] = this.currentClass;
			localStorage['type'] = this.currentType;
			localStorage['showConflict'] = this.showConflict;
			localStorage['searchQuery'] = this.searchQuery;
		},
		chooseDept() {
			localStorage['dept'] = this.currentDept;
			const order = ['甲', '乙', '丙', '重'];
			this.classes = [...new Set(this.courses
				.filter(course => course.dept === this.currentDept)
				.map(course => course.year + ' ' + course.class))]
				.sort((a, b) => {
					const numA = parseInt(a.substring(0, 1));
					const numB = parseInt(b.substring(0, 1));
					const charA = a.substring(1).trim();
					const charB = b.substring(1).trim();
					if (numA === numB) {
						return order.indexOf(charA) - order.indexOf(charB);
					}
					return numA - numB;
				});

			if (!this.classes.includes(this.currentClass)) {
				this.currentClass = '';
			}
			
			if(!this.currentDept.includes('通識') && this.currentType.includes('-')) {
				this.currentType = '';
			}

			this.saveSearchInput();
		},
		saveRequiredCourse() {
			this.$swal({
				title: '已收藏本班必修課', icon: 'success', toast: true,
				timer: 3000, timerProgressBar: true,
				position: 'bottom-start', showConfirmButton: false,
			});
			const requiredIds = this.filteredCourses
				.filter(course => course.type === '必修')
				.map(course => course.id);
			for (const id of requiredIds) {
				if (!this.savedCourse.includes(id)) {
					this.savedCourse.push(id);
				}
			}
			this.updateCachedCoursedTime();
			if (this.showConflict == 2) this.saveSearchInput();
			this.setSavedCourse([this.savedCourse]);
			this.$root.$emit('updateSavedCourse', this.savedCourse);
		},
		showCourse(course) {
			if (course.id.includes('ALT_')) {
				var real_courses = this.courses.filter(_course => course.courses.map(courseId => courseId.toString()).includes(_course.id)) || [];
				if(!course.courses || real_courses.length == 0) {
					this.$swal({
						title: course.name,
						text: '無課程資料',
						icon: 'error',
						showConfirmButton: false,
						showCloseButton: true,
					});
					return;
				}
				if(real_courses.length == 1) {
					this.showCourse(real_courses[0]);
					return;
				}
				const levels = { "初": 1, "中": 2, "高": 3, '菁英': 4 };
				const classes = { "A": 1, "B": 2, "C": 3, "D": 4, "E": 5 };
				real_courses.sort((a, b) => {
					const matchA = a.comment.match(/(初|中|高|菁英)([A-E])/);
					const matchB = b.comment.match(/(初|中|高|菁英)([A-E])/);
					if (!matchA || !matchB) return 0;
					const [levelA, classA] = matchA.slice(1);
					const [levelB, classB] = matchB.slice(1);
					if (levels[levelA] !== levels[levelB]) return levels[levelA] - levels[levelB];
					else return classes[classA] - classes[classB];
				});
				this.$swal({
					title: '請選擇要查看的課程',
					html: '<div class="ts-menu is-small is-dense is-separated alt_course_courses" style="max-height:75vh">' + 
						real_courses.map(_course => 
						'<a class="item" href="/course/' + _course.id.substring(0, 4) + '/' + _course.id.substring(4, 8) + '/' + _course.id.substring(8) + '/">\
							<div class="ts-header">' + _course.name + '</div>\
							<div class="ts-text is-description is-start-aligned">' +
								_course.teacher + ' 老師' + (_course.comment!='' ? ' / ' + _course.comment : '') + '\
							</div>\
						</a>'
					).join('') + '</div>',
					showCloseButton: true,
					showConfirmButton: false,
				});
				return;
			}
			this.$router.push('/course/' + course.id.substring(0, 4) + '/' + course.id.substring(4, 8) + '/' + course.id.substring(8) + '/');
		},
		saveCourse(course_id) {
			if (this.savedCourse.includes(course_id)) {
				this.savedCourse = this.savedCourse.filter(id => id !== course_id);
			} else {
				this.savedCourse.push(course_id);
			}
			this.updateCachedCoursedTime();
			if(this.showConflict == 2) {
				this.saveSearchInput();
			}
			this.setSavedCourse([this.savedCourse]);
			this.$root.$emit('updateSavedCourse', this.savedCourse);
		},
		updateCachedCoursedTime() {
			this.cachedCoursedTime.clear();
			for (const courseId of this.savedCourseForCurrentTerm) {
				const course = this.coursesMap.get(courseId);
				if (!course?.time) continue;
				for (const [week, timeRange] of course.time) {
					const [startStr, endStr] = timeRange.split('~');
					const startIdx = this.sectionIndexMapObj[startStr];
					const endIdx = this.sectionIndexMapObj[endStr];
					if (startIdx === undefined || endIdx === undefined) continue;
					for (let i = startIdx; i <= endIdx; i++) {
						this.cachedCoursedTime.add(`${week}_${i}`);
					}
				}
			}
		},
		changeDisplayType() {
			localStorage.setItem('displayType', this.displayType === '1' ? '1' : '');
		},
		getSecondTermText(year, term) {
			if(year == this.terms[0].year && term == this.terms[0].term[0]) {
				if(this.courses.every(item => item.year.startsWith('3'))) return '大三實習';
			}
			return '下學期 / 大三實習';
		},
	}
}
</script>
