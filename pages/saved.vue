<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-saved">
		<profile></profile>
		<div class="ts-container has-top-padded-large is-fitted">
			<div class="ts-grid is-compact is-middle-aligned mobile-padded">
				<div class="column is-13-wide">
					<h1 class="ts-header is-huge has-vertically-padded">收藏的課程
						<div class="ts-badge is-start-spaced is-outlined" v-if="currentTerm && currentTerm!=''">{{ currentTerm }} 學期</div>
					</h1>
				</div>
				<div class="column is-3-wide">
					<div class="ts-wrap is-end-aligned">
						<button class="ts-button is-negative is-outlined mobile-hidden"
							v-if="savedCourse.length > 0"
							@click="clearSavedCourse()">
							<span class="ts-icon is-end-spaced is-trash-icon"></span> 清除
						</button>
						<button class="ts-button is-icon is-negative is-outlined mobile-only"
							v-if="savedCourse.length > 0"
							@click="clearSavedCourse()">
							<span class="ts-icon is-trash-icon"></span>
						</button>
					</div>
				</div>
			</div>
			<div class="ts-grid has-top-spaced mobile-padded" v-if="filteredCourses.length > 0">
				<div class="column is-8-wide mobile-half">
					<div class="ts-box">
						<div class="ts-content">
							<div class="ts-statistic">
								<div class="value">{{ filteredCourses.reduce((sum, course) => sum +
									Number(course.credit), 0) || 0 }}</div>
								<div class="comparison">學分</div>
							</div>
						</div>
						<div class="symbol">
							<span class="ts-icon is-list-check-icon"></span>
						</div>
					</div>
				</div>
				<div class="column is-8-wide mobile-half">
					<div class="ts-box">
						<div class="ts-content">
							<div class="ts-statistic">
								<div class="value">{{ filteredCourses.length || 0 }}</div>
								<div class="comparison">門課程</div>
							</div>
						</div>
						<div class="symbol">
							<span class="ts-icon is-table-cells-icon"></span>
						</div>
					</div>
				</div>
			</div>
			<div class="ts-wrap has-top-padded-large is-center-aligned" v-if="filteredCourses.length > 0">
				<div class="ts-selection">
					<label class="item">
						<input type="radio" name="displayType" v-model="displayType" value=""
							@change="changeDisplayType()">
						<div class="text">課表檢視</div>
					</label>
					<label class="item">
						<input type="radio" name="displayType" v-model="displayType" value="1"
							@change="changeDisplayType()">
						<div class="text">表格檢視</div>
					</label>
				</div>
			</div>
		</div>
		<div class="ts-container has-bottom-padded is-fitted" v-if="!loading">
			<div class="ts-box has-top-spaced-large" v-if="filteredCourses.length > 0">
				<table v-if="displayType == '1'" class="ts-table course-table">
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
							<td class="c-class">{{ course.dept + ' ' + course.year + ' ' + course.class }}
								<span class="mobile-only" v-if="!course.id.includes('ALT_')">{{  course.teacher + ' 老師' }}</span>
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
								<span class="ts-icon absolute-right is-star-icon" v-if="savedCourse.includes(course.id)" @click.stop="saveCourse(course)"></span>
								<span class="ts-icon absolute-right is-star-icon is-regular" v-else @click.stop="saveCourse(course)"></span>
							</td>
						</tr>
					</tbody>
				</table>
				<table v-else class="ts-table is-dense is-celled is-definition course-timetable"
					:class="{ 'showSat': coursesByStartTime[6] }">
					<thead>
						<tr>
							<th>&nbsp;</th>
							<th v-for="w in 6">{{ week_text[w].replace(/[()]/g, '') }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="section in time_section" v-if="section <= maxEndSection">
							<td>{{ section }}</td>
							<td v-for="w in 6">
								<div v-if="coursesByStartTime[w] && coursesByStartTime[w][section] && coursesByStartTime[w][section].length >= 1"
									:class="{
										'is-orange': coursesByStartTime[w][section][0].type == '必修',
										'is-green': coursesByStartTime[w][section][0].type == '選修',
										'is-gray': coursesByStartTime[w][section][0].type == '重修',
									}"
									@click="showCourse(coursesByStartTime[w][section][0])" :style="{'height': (coursesByStartTime[w][section][0].period * 2.8) - .7 + 'rem'}">
									<div>{{ coursesByStartTime[w][section][0].name }}</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="ts-blankslate" v-else>
				<span class="ts-icon is-circle-exclamation-icon"></span>
				<div class="header">目前還沒有收藏的課程</div>
				<div class="description">快到「全校課表」收藏有興趣的課程吧！</div>
			</div>
			<br>
			<div class="ts-box ad is-hollowed box-mobile-spaced" v-if="filteredCourses.length > 0 && showAd">
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
		</div>
		<loading v-show="loading" />
	</div>
</template>
<style>
.course-timetable th,
.course-timetable td {
	text-align: center;
	vertical-align: middle;
	width: 20%;
}

.course-timetable.showSat th,
.course-timetable.showSat td {
	width: 16.666%;
}

.course-timetable th:nth-child(7),
.course-timetable td:nth-child(7) {
	display: none !important;
}

.course-timetable.showSat th:nth-child(7),
.course-timetable.showSat td:nth-child(7) {
	display: table-cell !important;
}

.course-timetable th:first-child,
.course-timetable td:first-child {
	width: 2rem;
}

.course-timetable td {
	font-size: 12px !important;
	line-height: 1rem;
	padding: 0;
	height: 2.7rem !important;
	position: relative;
}

.course-timetable td>div {
	position: absolute;
	left: 0;
	top: 0;
	width: 94%;
	border-radius: 5px;
	margin: 0.3rem 3%;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1;
}

.course-timetable td>div:hover {
	cursor: pointer;
}

.course-timetable td>div>div {
	max-height: 95%;
	overflow: hidden;
}

@media (max-width: 767.98px) {
	#page-saved .ts-grid .column.mobile-fluid .ts-button {
		width: calc(50% - .5rem);
	}

	.course-timetable th:first-child,
	.course-timetable td:first-child {
		width: 1rem;
		padding-left: .5rem;
		padding-right: .5rem;
	}

	.course-timetable td {
		font-size: 10px !important;
	}
}
</style>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
	async asyncData({ $axios, params, payload }) {

	},
	head() {
		return {
			title: '收藏的課程 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '收藏的課程 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	data() {
		return {
			time_section: ['0.5', '1', '2', '3', '4', '4.5', '5', '6', '7', '8', '8.5', '9', '10', '11', '12'],
			week_text: ['', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)', ''],
			info: [],
			loading: true,
			courses: [],
			displayType: '',
			maxEndSection: 8,
			currentTerm: undefined,
			savedCourse: []
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
					confirmButtonText: '確定',
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

		if (this.savedCourse.length > 0) {
			let term_id = this.savedCourse[0].substring(0, 4);
			this.currentTerm = term_id.substring(0, 3) + '-' + term_id.substring(3, 4);
			this.fetchData();
		} else {
			this.loading = false;
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
		filteredCourses() {
			return this.courses.filter(course => this.savedCourse.includes(course.id));
		},
		coursesByStartTime() {
			let result = {};
			this.filteredCourses.forEach(course => {
				course.time.forEach(timeSlot => {
					const [weekday, timeRange] = timeSlot;
					const startTime = timeRange.split('~')[0];
					const endTime = timeRange.split('~')[1];

					if (this.maxEndSection < parseFloat(endTime)) {
						this.maxEndSection = parseFloat(endTime);
					}

					if (!result[weekday]) {
						result[weekday] = {};
					}

					if (!result[weekday][startTime]) {
						result[weekday][startTime] = [];
					}

					let part_course = JSON.parse(JSON.stringify(course));
					part_course.period = this.time_section.indexOf(endTime) - this.time_section.indexOf(startTime) + 1;
					result[weekday][startTime].push(part_course);
				});
			});
			return result;
		}
	},
	methods: {
		...mapMutations(['setSavedCourse']),
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
			this.courses = data.course;
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
		showCourse(course) {
			if (course.id.includes('ALT_')) {
				if(!course.courses || course.courses.length == 0) {
					this.$swal({
						title: course.name,
						text: '無課程資料',
						icon: 'error',
						confirmButtonText: '確定',
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
		saveCourse(course) {
			this.$swal({
				icon: 'question',
				title: '移除收藏的課程「'+course.name+'」？',
				confirmButtonText: '移除',
				cancelButtonText: '取消',
				showCancelButton: true,
				confirmButtonColor: 'var(--ts-negative-600)',
			})
				.then((res) => {
					if (res.isConfirmed) {
						if (this.savedCourse.includes(course.id)) {
							this.savedCourse = this.savedCourse.filter(id => id !== course.id);
						}
						this.setSavedCourse([this.savedCourse]);
						if(this.savedCourse.length == 0) this.currentTerm = '';
					}
				});
		},
		changeDisplayType() {
			localStorage['displayType'] = this.displayType ? '1' : '';
		},
		exportSavedCourse() {
			let ids = '';
			this.filteredCourses.forEach((course, index) => {
				if (index == 0) ids += course.id;
				else ids += course.id.substring(4);
			});

			if (navigator.share && window.innerWidth < 768) {
				navigator.share({
					title: '收藏的課程 | 明志科技大學選課小幫手',
					url: document.location.origin + document.location.pathname + '?ids=' + ids
				});
			} else {
				this.$swal({
					title: '匯出收藏的課程',
					html: '將以下連結複製後，在其他裝置貼上即可匯入<br><div class="ts-box has-top-spaced"><div class="ts-content is-start-aligned is-dense">' + document.location.origin + document.location.pathname + '?ids=' + ids + '</div></div>',
					confirmButtonText: '複製網址',
					showCloseButton: true
				}).then((result) => {
					if (result.isConfirmed) {
						const el = document.createElement('textarea');
						el.value = document.location.origin + document.location.pathname + '?ids=' + ids;
						document.body.appendChild(el);
						el.select();
						document.execCommand('copy');
						document.body.removeChild(el);

						this.$swal({
							title: '已複製分享連結',
							icon: 'success',
							toast: true,
							timer: 3000,
							timerProgressBar: true,
							position: 'bottom-start',
							showConfirmButton: false,
						});
					}
				});
			}
		}
	}
}
</script>