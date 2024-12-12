<template>
	<div class="cell is-scrollable is-fluid is-horizontal" id="page-search">
		<div class="cell is-tertiary is-scrollable sidebar" :class="{ 'show': showMobileSidebar }">
			<div class="ts-content">
				<div class="ts-wrap is-vertical has-top-padded">
					<button class="ts-close is-large mobile-only close-sidebar"
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
										<span class="description" v-else-if="term == '2'">下學期 / 大三實習</span>
										<span class="description" v-else>暑修</span>
									</div>
								</template>
							</div>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">課程名稱 / 老師 / 序號</div>
						<div class="ts-input is-fluid">
							<input type="search" v-model.trim="searchQuery" @input="saveSearchInput()">
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">開課單位（系所）</div>
						<div class="ts-select is-fluid">
							<select v-model="currentDept" @change="chooseDept()">
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
							<select v-model="currentClass" @change="saveSearchInput()">
								<option selected="selected" value="">不限</option>
								<option v-for="grade_class in classes">{{ grade_class }}</option>
							</select>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">修別 <span
								v-show="currentDept && currentDept.includes('通識')">/ 通識類別</span></div>
						<div class="ts-select is-fluid">
							<select v-model="currentType" @change="saveSearchInput()">
								<option value="" selected="selected">不限</option>
								<option>必修</option>
								<option>選修</option>
								<option v-if="currentTerm.split('-')[1] >= '3'">重修</option>
								<template v-if="currentDept && currentDept.includes('通識')">
									<option v-for="type in generalCourseTypes">{{ type }}</option>
								</template>
								<option v-if="currentTerm.split('-')[1] <= '2'">重修</option>
							</select>
						</div>
					</div>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">衝堂的課程</div>
						<div class="ts-selection is-fluid">
							<label class="item">
								<input type="radio" name="showConflict" :value="1" v-model="showConflict"
									@change="saveSearchInput()" />
								<div class="text">顯示</div>
							</label>
							<label class="item">
								<input type="radio" name="showConflict" :value="2" v-model="showConflict"
									@change="saveSearchInput()" />
								<div class="text">置底</div>
							</label>
							<label class="item">
								<input type="radio" name="showConflict" :value="0" v-model="showConflict"
									@change="saveSearchInput()" />
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
		<div class="cell is-secondary is-fluid is-scrollable">
			<div class="ts-container has-top-padded-large is-fitted mobile-padded">
				<div class="ts-wrap is-middle-aligned">
					<h1 class="ts-header is-huge has-vertically-padded">搜尋課程</h1>
					<div class="ts-text is-description" v-if="filteredCourses.length > 0">{{ filteredCourses.length }}
						門符合條件的課程
					</div>
				</div>
				<button class="ts-button is-fluid is-outlined is-end-icon mobile-only" @click="showMobileSidebar = !showMobileSidebar">
					{{ filterInfo }}
					<span class="ts-icon is-chevron-down-icon"></span>
				</button>
				<div v-show="canShowSaveRequiredButton" @click="saveRequiredCourse()">
					<button class="ts-button is-fluid has-top-spaced is-secondary mobile-only is-start-icon">
						<span class="ts-icon is-star-icon"></span>
						收藏本班必修課
					</button>
				</div>
			</div>
			<div class="ts-container has-vertically-padded-large is-fitted" v-if="!loading">
				<div class="ts-box" v-if="filteredCourses.length > 0">
					<table class="ts-table course-table">
						<thead>
							<tr>
								<th>開課單位/班級</th>
								<th>課程名稱</th>
								<th>上課時間</th>
								<th>修別/學分</th>
								<th>授課老師</th>
								<th>備註</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="course in filteredCourses" :key="course.id" @click="showCourse(course)">
								<td class="c-class">{{ course.dept + ' ' + course.year + ' 年' + course.class + '班' }}
									<span class="mobile-only" v-if="!(course.id.includes('ALT_') && course.teacher.includes('分班'))">{{  course.teacher + ' 老師' }}</span>
								</td>
								<td class="c-name">
									<span class="ts-icon is-volleyball-icon sport-icon"
										v-if="course.name.includes('排球')"></span>
									<span class="ts-icon is-basketball-icon sport-icon"
										v-else-if="course.name.includes('籃球')"></span>
									<span class="ts-icon is-table-tennis-paddle-ball-icon sport-icon"
										v-else-if="course.name.includes('桌球')"></span>
									<span class="ts-icon is-dumbbell-icon sport-icon"
										v-else-if="course.name.includes('健身雕塑')"></span>
									<span class="ts-icon is-people-pulling-icon sport-icon"
										v-else-if="course.name.includes('防身術')"></span>
									<span class="ts-icon is-people-robbery-icon sport-icon"
										v-else-if="course.name.includes('特工武術') || course.name.includes('跆拳道')"></span>
									<span class="ts-icon is-child-reaching-icon sport-icon"
										v-else-if="course.name.includes('身體律動')"></span>
									<svg class="sport-icon-badminton" v-else-if="course.name.includes('羽球')" version="1.1"
										xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
										<path
											d="M22 10v-1.5c0-3.59-2.91-6.5-6.5-6.5s-6.5 2.91-6.5 6.5v1.5h13zM17.055 11h-3.111l-1.948 16.555-0.084 0.755 3.587 2.69 3.587-2.69-0.084-0.751-1.948-16.558zM10.883 28.529l-2.883 2.471-3-3 4-17h3.938l-1.934 16.442-0.121 1.088zM20.068 11h1.957l3.975 17-2.982 3-2.865-2.471-0.12-1.084-1.923-16.445h1.957z">
										</path>
									</svg>{{ course.name }}
								</td>
								<td class="c-time">
									<span v-for="time in course.time" class="time">
										<template v-if="time[1].split('~')[0] == time[1].split('~')[1]">{{
											week_text[time[0]] + ' 第 ' + time[1].split('~')[0] + ' 節' }}</template>
										<template v-else>{{ week_text[time[0]] + ' ' + time[1] + ' 節' }}</template>
									</span>
								</td>
								<td class="c-type-credit mobile-only absolute-right">
									<span class="ts-badge is-small has-dark"
										:class="({ '必修': 'is-orange', '選修': 'is-green', '重修': 'is-gray' })[course.type]">
										{{
											course.type +
											(course.otherinfo ? ' ' + course.otherinfo.substring(0, 2) : '') +
											' ' + course.credit
										}} 學分
									</span>
								</td>
								<td class="c-type-credit mobile-hidden">
									<span class="ts-badge is-small is-dense is-end-spaced has-dark"
										:class="({ '必修': 'is-orange', '選修': 'is-green', '重修': 'is-gray' })[course.type]">
										{{
											course.type +
											(course.otherinfo ? ' ' + course.otherinfo.substring(0, 2) : '')
										}}
									</span>{{ course.credit }}
								</td>
								<td class="c-teacher mobile-hidden">{{ course.teacher }}</td>
								<td class="c-remark">{{ course.comment }}</td>
								<td class="c-action">
									<span class="mobile-only absolute-right ts-badge is-small is-dense has-dark is-red" v-if="isConflicted(course)">衝堂</span>
									<span data-position="top" data-tooltip="衝堂" class="mobile-hidden ts-icon absolute-right is-circle-exclamation-icon is-t-red" v-if="isConflicted(course)" @click.stop=""></span>
									<span class="ts-icon absolute-right is-star-icon" v-else-if="savedCourse.includes(course.id)" @click.stop="saveCourse(course.id)"></span>
									<span class="ts-icon absolute-right is-star-icon is-regular" v-else @click.stop="saveCourse(course.id)"></span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="ts-blankslate" v-else-if="courses.length == 0">
					<span class="ts-icon is-circle-exclamation-icon"></span>
					<div class="header">目前無課程資料</div>
					<div class="description">請稍後再試</div>
				</div>
				<div class="ts-blankslate" v-else>
					<span class="ts-icon is-circle-exclamation-icon"></span>
					<div class="header">找不到符合條件的課程</div>
					<div class="description">請嘗試修改您的條件，或選擇其他學期</div>
				</div>
			</div>
			<div class="ts-mask" v-show="showMobileSidebar" @click="showMobileSidebar = !showMobileSidebar"></div>
		</div>
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

#page-search .ts-selection .item:last-child input:checked+.text {
	background: var(--ts-static-gray-600);
	border-color: var(--ts-static-gray-600);
	color: var(--ts-static-gray-50);
}

@media (max-width: 768px) {
	
}
</style>
<script>
export default {
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
			week_text: ['', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)', ''],
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

			loading: true,

			searchQuery: '',
			currentTerm: '',
			currentDept: '',
			currentClass: '',
			currentType: '',
			showConflict: undefined,

			savedCourse: [],

			showMobileSidebar: false
		}
	},
	mounted() {
		if (localStorage['searchQuery']) this.searchQuery = localStorage['searchQuery'];
		if(['0','1','2'].includes(localStorage['showConflict'])) this.showConflict = localStorage['showConflict'];
		else this.showConflict = 1;
		if (localStorage['savedCourse'] && JSON.parse(localStorage['savedCourse']) && JSON.parse(localStorage['savedCourse']).length > 0) {
			this.savedCourse = JSON.parse(localStorage['savedCourse']);
			let term_id = this.savedCourse[0].substring(0, 4);
			this.currentTerm = term_id.substring(0, 3) + '-' + term_id.substring(3, 4);
			localStorage['term'] = this.currentTerm;
		}
		else this.currentTerm = localStorage['term'] || '';
		this.fetchData();
	},
	computed: {
		filterInfo() {
			let info = [];
			if(this.currentTerm) info.push(this.currentTerm.split('-')[0] + '-' + this.currentTerm.split('-')[1] + ' 學期');
			if(this.currentDept) info.push(this.currentDept + (this.currentClass ? ' ' + this.currentClass : '全年級'));
			if(this.currentType) info.push(this.currentType.includes('-') ? this.currentType.split('- ')[1] : this.currentType);
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
			if (this.currentClass !== '') {
				filtered = filtered.filter(course => (course.year + ' ' + course.class) === this.currentClass || course.alt_for);
			}
			if(this.currentType == undefined && this.currentDept.includes('通識')) this.currentType = '選修';
			if (this.currentType !== '') {
				filtered = filtered.filter(course => course.type === this.currentType || course.otherinfo === this.currentType.split('- ')[1]);
			}
			if (this.showConflict == 0) {
				filtered = filtered.filter(course => !this.isConflicted(course));
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
				if (this.savedCourse.includes(_course.id)) return false;
				if (!_course.time) return false;
				return _course.time.some(time => {
					let week = time[0];
					let section = time[1].split('~').map(section => this.time_section.indexOf(section));
					return Array.from({ length: section[1] - section[0] + 1 }, (_, i) => week + '_' + this.time_section[section[0] + i]).some(t => {
						if (this.hasCoursedTime.includes(t)) return true;
					});
				});
			}
		},
		hasCoursedTime() {
			return this.savedCourse.map(course_id => {
				let course = this.courses.find(course => course.id === course_id);
				if (!course) return false;
				return course.time.map(time => {
					let week = time[0];
					let section = time[1].split('~').map(section => this.time_section.indexOf(section));
					return Array.from({ length: section[1] - section[0] + 1 }, (_, i) => week + '_' + this.time_section[section[0] + i]);
				}).flat();
			}).flat();
		}
	},
	methods: {
		fetchData() {
			const now = new Date().getTime();
			const storedData = localStorage['courseData_' + this.currentTerm];
			const storedTime = localStorage['courseDataTime_' + this.currentTerm];

			if (storedData && storedTime && (now - storedTime < 30 * 60 * 1000)) {
				const res = JSON.parse(storedData);
				this.processData(res);
			} else {
				this.$axios.get('https://api.mcut-course.com/list.php?term=' + this.currentTerm).then((res) => {
					localStorage['courseData_' + this.currentTerm] = JSON.stringify(res.data);
					localStorage['courseDataTime_' + this.currentTerm] = now;
					this.processData(res.data);
				});
			}
		},
		processData(data) {
			data.course.forEach((course, index) => {
				course.sortOrder = index;
			});
			this.courses = data.course;
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
					['人工智慧學程', '環實務', '半導體學程', '行銷設計學程', '四技行設專班'].includes(dept)
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

			this.loading = false;
		},
		chooseTerm(term) {
			if (this.currentTerm == term) return;
			if (this.savedCourse.length == 0) {
				this.loading = true;
				this.currentTerm = term;
				localStorage['term'] = term;
				this.fetchData();
				return;
			}
			this.$swal({
				icon: 'question',
				title: '切換至 ' + term + ' 學期？',
				html: '先前收藏的課程將會清空！',
				confirmButtonText: '確定',
				cancelButtonText: '取消',
				showCancelButton: true,
			})
				.then((res) => {
					if (res.isConfirmed) {
						this.$swal.close();
						this.savedCourse = [];
						localStorage['savedCourse'] = JSON.stringify(this.savedCourse);
						this.$root.$emit('updateSavedCourse', this.savedCourse);
						this.loading = true;
						this.currentTerm = term;
						localStorage['term'] = term;
						this.fetchData();
					}
				})
		},
		saveSearchInput() {
			if (this.showConflict == 1) {
				this.courses.sort((a, b) => a.sortOrder - b.sortOrder);
			}
			else if (this.showConflict == 2) {
				this.courses.sort((a, b) => {
					if (this.isConflicted(a) && !this.isConflicted(b)) return 1;
					if (!this.isConflicted(a) && this.isConflicted(b)) return -1;
					return a.sortOrder - b.sortOrder;
				});
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
			if(this.savedCourse.length == 0) {
				this.$swal({
					title: '已收藏本班必修課', icon: 'success', toast: true,
					timer: 3000, timerProgressBar: true,
					position: 'bottom-start', showConfirmButton: false,
				});
				this.savedCourse = this.filteredCourses
					.filter(course => course.type === '必修')
					.map(course => course.id);
				localStorage['savedCourse'] = JSON.stringify(this.savedCourse);
				this.$root.$emit('updateSavedCourse', this.savedCourse);
				return;
			}
			this.$swal({
				icon: 'question',
				title: '確定要收藏本班必修課？',
				html: '先前收藏的課程將會清空！',
				confirmButtonText: '確定',
				cancelButtonText: '取消',
				showCancelButton: true,
			})
				.then((res) => {
					if (res.isConfirmed) {
						this.$swal({
							title: '已收藏本班必修課', icon: 'success', toast: true,
							timer: 3000, timerProgressBar: true,
							position: 'bottom-start', showConfirmButton: false,
						});
						this.savedCourse = this.filteredCourses
							.filter(course => course.type === '必修')
							.map(course => course.id);
						localStorage['savedCourse'] = JSON.stringify(this.savedCourse);
						this.$root.$emit('updateSavedCourse', this.savedCourse);
					}
				});
		},
		showCourse(course) {
			if (course.id.includes('ALT_')) {
				var real_courses = this.courses.filter(_course => course.courses.map(courseId => courseId.toString()).includes(_course.id)) || [];
				if(!course.courses || real_courses.length == 0) {
					this.$swal({
						title: course.name,
						text: '無課程資料',
						icon: 'error',
						confirmButtonText: '確定',
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
				var html = '<div class="ts-menu is-small is-dense is-separated alt_course_courses" style="max-height:75vh">';
				real_courses.forEach(_course => {
					html += '<a class="item" href="/course/' + _course.id.substring(0, 4) + '/' + _course.id.substring(4, 8) + '/' + _course.id.substring(8) + '/">\
						<div class="ts-header">' + _course.name + '</div>\
						<div class="ts-text is-description is-start-aligned">' +
							_course.teacher + ' 老師' + (_course.comment!='' ? ' / ' + _course.comment : '') + '\
						</div>\
					</a>';
				});
				html += '</div>';
				this.$swal({
					title: '請選擇要查看的課程',
					html: html,
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
			localStorage['savedCourse'] = JSON.stringify(this.savedCourse);
			this.$root.$emit('updateSavedCourse', this.savedCourse);
		}
	}
}
</script>
