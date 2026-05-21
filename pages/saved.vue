<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-saved">
		<div class="ts-container has-top-padded-large is-fitted">
			<div class="ts-grid is-compact is-middle-aligned mobile-padded">
				<div class="column is-13-wide">
					<h1 class="ts-header is-huge has-vertically-padded">
						收藏的課程
						<div class="ts-select is-basic has-start-spaced" v-if="terms && terms.length">
							<div class="content" data-dropdown="term-dropdown">{{ currentTerm ? currentTerm.split('-')[0] + '-' + currentTerm.split('-')[1] : '' }}</div>
							<div class="ts-dropdown" data-position="bottom-start" id="term-dropdown" style="height:60vh">
								<template v-for="year_group of terms">
									<div class="header">{{ year_group.year }} 學年</div>
									<div class="item is-indented" v-for="term of year_group.term" :class="{ 'is-selected': year_group.year+'-'+term == currentTerm }"
										@click="chooseTerm(year_group.year+'-'+term)">
										第 {{ term }} 學期
										<span class="description">{{ savedCounts[year_group.year + '-' + term] || 0 }}</span>
									</div>
								</template>
							</div>
						</div>
						<div class="ts-badge is-start-spaced is-outlined" v-else-if="currentTerm && currentTerm!=''">{{ currentTerm }} 學期</div>
					</h1>
				</div>
				<div class="column is-3-wide">
					<div class="ts-wrap is-end-aligned">
						<button class="ts-button is-negative is-outlined mobile-hidden"
							v-if="savedCourseForCurrentTerm.length > 0"
							@click="clearSavedCurrentTerm()">
							<span class="ts-icon is-end-spaced is-trash-icon"></span> 清除
						</button>
						<!-- <button class="ts-button is-negative is-outlined mobile-hidden"
							v-if="savedCourse.length > 0"
							@click="clearSavedCourse()">
							<span class="ts-icon is-end-spaced is-trash-icon"></span> 清除全部
						</button> -->
						<button class="ts-button is-icon is-negative is-outlined mobile-only"
							v-if="savedCourse.length > 0"
							@click="clearSavedCourse()">
							<span class="ts-icon is-trash-icon"></span>
						</button>
						<!-- <button class="ts-button is-icon is-secondary is-outlined mobile-only"
							v-if="savedCourseForCurrentTerm.length > 0"
							@click="clearSavedCurrentTerm()">
							<span class="ts-icon is-trash-icon"></span>
						</button> -->
					</div>
				</div>
			</div>
			<div class="ts-box" v-if="savedCourseForCurrentTerm.length > 0 && filteredCourses.length < savedCourseForCurrentTerm.length">
				<div class="ts-content">
					<div class="ts-text is-description has-bottom-spaced-small">
						<span class="ts-badge is-small is-dense is-negative">提醒</span> 本學期收藏的課程中有 {{ savedCourseForCurrentTerm.length - filteredCourses.length }} 門課程已下架，請重新搜尋並收藏。
					</div>
					<button class="ts-button is-primary is-outlined" @click="clearSavedRemovedCourse()">清除本學期已下架的課程</button>
				</div>
			</div>
			<div class="ts-grid has-top-spaced mobile-padded" v-if="filteredCourses.length > 0">
				<div class="column is-8-wide mobile-half">
					<div class="ts-box">
						<div class="ts-content">
							<div class="ts-statistic">
								<div class="value">{{ filteredCourses.length || 0 }}</div>
								<div class="comparison">門課程</div>
							</div>
						</div>
						<div class="symbol">
							<span class="ts-icon is-sheet-icon"></span>
						</div>
					</div>
				</div>
				<div class="column is-8-wide mobile-half">
					<div class="ts-box">
						<div class="ts-content">
							<div class="ts-statistic">
								<div class="value">{{ filteredCourses.reduce((sum, course) => sum +
									Number(course.credit), 0) || 0 }}</div>
								<div class="comparison">學分</div>
								<span class="ts-icon is-circle-info-icon" v-if="filteredCourses.length >= 1" @click="showLimitInfo()"></span>
							</div>
						</div>
						<div class="symbol">
							<span class="ts-icon is-clipboard-list-icon"></span>
						</div>
					</div>
				</div>
			</div>
			<div class="ts-wrap has-top-padded-large is-center-aligned" v-if="filteredCourses.length > 0">
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
		</div>
		<div class="ts-container has-bottom-padded is-fitted" v-if="!loading">
			<div class="ts-box has-top-spaced-large" v-if="filteredCourses.length > 0">
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
					:enableAutoShowOnlyMonAndThu="false"
					@course-click="showCourse"
					@action-click="saveCourse"
				/>
			</div>
			<div class="ts-blankslate" v-else>
				<span class="ts-icon is-circle-alert-icon"></span>
				<div class="header">本學期還沒有收藏的課程</div>
				<div class="description">快到「全校課表」收藏有興趣的課程吧！</div>
			</div>
			<br>
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
		</div>
		<loading v-show="loading" />
	</div>
</template>
<style>
#limit-info td,
#limit-info th {
	text-align: center;
	vertical-align: middle;
}
</style>
<script>
import { mapState, mapMutations } from 'vuex'
import CourseList from '~/components/CourseList.vue'
export default {
	components: {
		CourseList
	},
	async asyncData({ $axios }) {

		let _terms = {};
		const list = await $axios.get('https://api.mcut-course.com/list.php');
		list.data.term.forEach(term => {
			let _year = term.split('-')[0];
			let _term = term.split('-')[1];
			if (!_terms[_year]) _terms[_year] = [];
			_terms[_year].push(_term);
		});
		let terms = Object.entries(_terms)
		.sort((a, b) => Number(b[0]) - Number(a[0]))
		.map(([year, term]) => ({ year: year, term: term }));

		const default_term = list.data.course[0].id.substring(0, 3) + '-' + list.data.course[0].id.substring(3, 4);

		return { terms, default_term };
	},
	head() {
		return {
			title: '收藏的課程 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '收藏的課程 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },

				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com' + this.$router.currentRoute.path },
				{ hid: 'og:image', property: 'og:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME },
				{ hid: 'twitter:image', name: 'twitter:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME }
			]
		}
	},
	data() {
		return {
			terms: [],
			default_term: null,
			time_section: ['0.5', '1', '2', '3', '4', '4.5', '5', '6', '7', '8', '8.5', '9', '10', '11', '12'],
			info: [],
			loading: true,
			courses: [],
			displayType: '',
			maxEndSection: 8,
			currentTerm: undefined,
			savedCourse: [],
			currentClass: '',
			currentDept: ''
		}
	},
	async mounted() {
		this.savedCourse = await this.$store.dispatch('getSavedCourse');
		this.displayType = localStorage.displayType || '';
		if (this.$route.query.ids) {
			let importCourse = [];
			let importTerm = this.$route.query.ids.substring(0, 4);
			let importIds = this.$route.query.ids.substring(4).match(/.{1,8}/g) || [];
			importIds.forEach((id) => {
				importCourse.push(importTerm + id);
			});

			let savedCourse = await this.$store.dispatch('getSavedCourse');
			if (savedCourse.length >= 1) {
				this.$swal({
					icon: 'question',
					title: '匯入 ' + importCourse.length + ' 門課程？',
					text: '先前收藏的課程將會清空！',
					confirmButtonText: '清空並匯入',
					cancelButtonText: '取消',
					showCancelButton: true,
				})
					.then((res) => {
						if (res.isConfirmed) {
							localStorage['term'] = importTerm;
							this.savedCourse = importCourse;
							this.setSavedCourse([this.savedCourse]);
							this.$swal({
								title: '已匯入課程', icon: 'success', toast: true,
								timer: 3000, timerProgressBar: true,
								position: 'bottom-start', showConfirmButton: false,
							});
							this.$router.replace('/saved');
						}
					});
			} else {
				localStorage['term'] = importTerm;
				this.savedCourse = importCourse;
				this.setSavedCourse([this.savedCourse]);
				this.$swal({
					title: '已匯入課程', icon: 'success', toast: true,
					timer: 3000, timerProgressBar: true,
					position: 'bottom-start', showConfirmButton: false,
				});
				this.$router.replace('/saved');
			}
		}

		// 優先使用 localStorage 裡的學期設定
		if (localStorage['term']) {
			this.currentTerm = localStorage['term'];
		} else if (this.savedCourse.length > 0) {
			let term_id = this.savedCourse[0].substring(0, 4);
			this.currentTerm = term_id.substring(0, 3) + '-' + term_id.substring(3, 4);
			localStorage['term'] = this.currentTerm;
		} else {
			this.currentTerm = this.default_term || '';
		}
		if (this.currentTerm) this.fetchData();
		else this.loading = false;
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
		savedCourseForCurrentTerm() {
			if (!this.currentTerm) return [];
			const prefix = (this.currentTerm || '').split('-').join('');
			return this.savedCourse.filter(id => id.startsWith(prefix));
		},
		filteredCourses() {
			return this.courses.filter(course => this.savedCourseForCurrentTerm.includes(course.id));
		}
		,
		savedCounts() {
			const counts = {};
			(this.savedCourse || []).forEach(id => {
				if (!id || id.length < 4) return;
				const termNoHyphen = id.substring(0, 4); // e.g. '1121'
				const key = termNoHyphen.substring(0, 3) + '-' + termNoHyphen.substring(3, 4); // '112-1'
				counts[key] = (counts[key] || 0) + 1;
			});
			return counts;
		}
	},
	methods: {
		...mapMutations(['setSavedCourse']),
		chooseTerm(term) {
			if (this.currentTerm == term) return;
			this.loading = true;
			this.currentTerm = term;
			localStorage['term'] = term;
			this.fetchData();
		},
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
			this.courses = data.course;
			
			// 从已保存的课程中提取 currentClass 和 currentDept，用于进阶课表显示
			if (this.filteredCourses.length > 0) {
				const firstCourse = this.filteredCourses[0];
				// 如果所有课程都来自同一班级，则启用进阶课表
				const uniqueClasses = new Set(this.filteredCourses.map(c => c.year + ' ' + c.class));
				const uniqueDepts = new Set(this.filteredCourses.map(c => c.dept));
				
				if (uniqueClasses.size === 1) {
					this.currentClass = firstCourse.year + ' ' + firstCourse.class;
				}
				if (uniqueDepts.size === 1) {
					this.currentDept = firstCourse.dept;
				}
			}
			
			this.loading = false;
		},
		clearSavedCourse() {
			this.$swal({
				icon: 'question',
				title: '清除所有收藏的課程？',
				confirmButtonText: '清除',
				cancelButtonText: '取消',
				showCancelButton: true,
				confirmButtonColor: 'var(--ts-negative-600)',
			})
				.then((res) => {
					if (res.isConfirmed) {
						this.$swal({
							title: '已清除所有收藏的課程', icon: 'success', toast: true,
							timer: 3000, timerProgressBar: true,
							position: 'bottom-start', showConfirmButton: false,
						});
						this.savedCourse = [];
						this.setSavedCourse([this.savedCourse]);
						this.currentTerm = '';
					}
				});
		},
		clearSavedCurrentTerm() {
			this.$swal({
				icon: 'question',
				title: '清除本學期收藏的課程？',
				confirmButtonText: '清除',
				cancelButtonText: '取消',
				showCancelButton: true,
				confirmButtonColor: 'var(--ts-negative-600)',
			})
				.then((res) => {
					if (res.isConfirmed) {
						const prefix = (this.currentTerm || '').split('-').join('');
						this.savedCourse = this.savedCourse.filter(id => !id.startsWith(prefix));
						this.setSavedCourse([this.savedCourse]);
						this.$swal({
							title: '已移除目前學期的收藏', icon: 'success', toast: true,
							timer: 3000, timerProgressBar: true,
							position: 'bottom-start', showConfirmButton: false,
						});
					}
				});
		},
		clearSavedRemovedCourse() {
			const prefix = (this.currentTerm || '').split('-').join('');
			const currentTermCourseIds = new Set(this.filteredCourses.map(course => course.id));
			this.savedCourse = this.savedCourse.filter(id => !id.startsWith(prefix) || currentTermCourseIds.has(id));
			this.$swal({
				title: '已清除本學期已下架的課程', icon: 'success', toast: true,
				timer: 3000, timerProgressBar: true,
				position: 'bottom-start', showConfirmButton: false,
			});
			this.setSavedCourse([this.savedCourse]);
		},
		showCourse(course) {
			if (course.id.includes('ALT_')) {
				if(!course.courses || course.courses.length == 0) {
					this.$swal({
						title: course.name,
						text: '無課程資料',
						icon: 'error',
						showConfirmButton: false,
						showCloseButton: true,
					});
					return;
				}
				if(course.courses.length == 1) {
					this.showCourse(this.courses.find(_course => _course.id === course.courses[0]));
					return;
				}
				var html = '<div class="ts-menu is-small is-dense is-separated alt_course_courses" style="max-height:75vh">';
				var real_courses = this.courses.filter(_course => course.courses.map(courseId => courseId.toString()).includes(_course.id)) || [];
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
			let course = this.filteredCourses.find(c => c.id === course_id);
			this.$swal({
				icon: 'question',
				title: '移除收藏的課程「'+(course?.name || '')+'」？',
				confirmButtonText: '移除',
				cancelButtonText: '取消',
				showCancelButton: true,
				confirmButtonColor: 'var(--ts-negative-600)',
			})
				.then((res) => {
					if (res.isConfirmed) {
						if (this.savedCourse.includes(course_id)) {
							this.savedCourse = this.savedCourse.filter(id => id !== course_id);
						}
						this.setSavedCourse([this.savedCourse]);
						if(this.savedCourse.length == 0) this.currentTerm = '';
					}
				});
		},
		changeDisplayType() {
			localStorage['displayType'] = this.displayType ? '1' : '';
		},
		showLimitInfo() {
			this.$swal({
				title: '四技日間部選課學分上下限',
				html: `<table class="ts-table" id="limit-info">
					<thead>
						<tr>
							<th rowspan="2">年級</th><th colspan="2">上學期</th><th colspan="2">下學期</th>
						</tr>
						<tr>
							<th>下限</th><th>上限</th><th>下限</th><th>上限</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>一年級</td><td>16</td><td>27</td><td>16</td><td>27</td>
						</tr>
						<tr>
							<td>二年級</td><td>16</td><td>27</td><td>16</td><td>27</td>
						</tr>
						<tr>
							<td>三年級</td><td>9</td><td>27</td><td>9</td><td>32</td>
						</tr>
						<tr>
							<td>四年級</td><td>9</td><td>27</td><td>9</td><td>27</td>
						</tr>
					</tbody>
				</table>`,
				showCloseButton: true,
				showConfirmButton: false,
			});
		}
	}
}
</script>