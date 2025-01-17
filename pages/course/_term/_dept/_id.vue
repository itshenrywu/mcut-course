<template>
	<div class="cell is-secondary is-scrollable is-fluid is-horizontal" id="page-course">
		<div class="ts-container is-narrow has-top-padded-large">
			<div class="ts-grid is-compact is-middle-aligned">
				<div class="column is-10-wide mobile-fluid">
					<div class="ts-text is-description">
						{{ (course.id ? course.id.substring(0,3) + '-' + course.id.substring(3,4) + ' 學期・' : '' ) }}<span class="monospace">{{ course.id }}</span>
					</div>
					<h1 class="ts-header is-huge">{{ course.name }}</h1>
				</div>
				<div class="column is-6-wide mobile-fluid">
					<div class="ts-wrap is-end-aligned">
						<template v-if="courses && courses.length > 0">
							<button class="ts-button is-start-icon is-secondary is-negative is-disabled" v-if="isConflicted()">
								<span class="ts-icon is-triangle-exclamation-icon"></span>衝堂
							</button>
							<button class="ts-button is-start-icon" v-else-if="savedCourse.includes(course.id)" @click="saveCourse()">
								<span class="ts-icon is-star-icon"></span>已收藏
							</button>
							<button class="ts-button is-start-icon is-secondary" v-else @click="saveCourse()">
								<span class="ts-icon is-regular is-star-icon"></span>收藏
							</button>
						</template>
						<template v-else>
							<button class="ts-button is-start-icon is-secondary is-disabled">讀取中...</button>
						</template>

						<button class="ts-button is-start-icon is-secondary" @click="share()">
							<span class="ts-icon is-share-icon"></span>分享
						</button>
					</div>
				</div>
			</div>
			<div class="ts-grid is-stretched has-top-spaced" v-if="course.name">
				<div class="column is-8-wide mobile-fluid">
					<div class="ts-box">
						<div class="ts-content">
							<span class="statistic-title">開課單位/班級</span>
							<div class="ts-statistic">
								<div class="value">{{ course.dept + ' ' + course.year + ' ' + course.class }}</div>
							</div>
						</div>
						<div class="symbol">
							<span class="ts-icon is-users-icon"></span>
						</div>
					</div>
				</div>
				<div class="column"
					:class="{ 'is-6-wide mobile-3-by-4': course.otherinfo, 'is-4-wide mobile-half': !course.otherinfo }">
					<div class="ts-box">
						<div class="ts-content">
							<span class="statistic-title">修別 {{ course.otherinfo ? ' / 通識類別' : '' }}</span>
							<div class="ts-statistic">
								<div class="value">{{ course.type + (course.otherinfo ? ' ' + course.otherinfo : '') }}</div>
							</div>
						</div>
						<div class="symbol">
							<span class="ts-icon is-clipboard-check-icon"></span>
						</div>
					</div>
				</div>
				<div class="column mobile-half"
					:class="{ 'is-2-wide mobile-1-by-4': course.otherinfo, 'is-4-wide mobile-half': !course.otherinfo }">
					<div class="ts-box">
						<div class="ts-content">
							<span class="statistic-title">學分</span>
							<div class="ts-statistic">
								<div class="value">{{ course.credit }}</div>
							</div>
						</div>
						<div class="symbol">
							<span class="ts-icon is-list-check-icon"></span>
						</div>
					</div>
				</div>
				<div class="column mobile-fluid"
					:class="{ 'is-12-wide': course.time.length >= 3, 'is-8-wide': course.time.length < 3 }">
					<div class="ts-box">
						<div class="ts-content">
							<span class="statistic-title">上課時間</span>
							<div class="ts-statistic">
								<div class="value" id="course-time">
									<span v-for="time in course.time" class="time">
										<template v-if="time[1].split('~')[0] == time[1].split('~')[1]">{{ week_text[time[0]] + ' 第 ' + time[1].split('~')[0] + ' 節' }}</template>
										<template v-else>{{ week_text[time[0]] + ' ' + time[1] + ' 節' }}</template>
									</span>
								</div>
								<span class="ts-icon is-circle-info-icon" v-if="course.time.length >= 1" @click="showTimeInfo()"></span>
							</div>
						</div>
						<div class="symbol">
							<span class="ts-icon is-regular is-calendar-days-icon"></span>
						</div>
					</div>
				</div>
				<div class="column mobile-fluid"
					:class="{ 'is-4-wide': course.time.length >= 3, 'is-8-wide': course.time.length < 3 }">
					<div class="ts-box">
						<div class="ts-content">
							<span class="statistic-title">授課老師</span>
							<div class="ts-statistic">
								<div class="value">{{ course.teacher }}</div>
							</div>
						</div>
						<div class="symbol">
							<span class="ts-icon is-person-chalkboard-icon"></span>
						</div>
					</div>
				</div>
			</div>
			<table class="ts-table is-sticked has-top-spaced" v-if="course.name">
				<tbody>
					<tr>
						<td>人數限制</td>
						<td>{{ course.min }} ~ {{ course.max }}</td>
					</tr>
					<tr>
						<td>備註</td>
						<td>{{ course.comment }}</td>
					</tr>
					<tr v-if="loading">
						<td colspan="2" class="is-center-aligned">
							<div class="ts-header is-icon is-center-aligned has-vertically-padded-large">
								<span class="ts-icon is-spinning is-spinner-icon"></span>
								<div class="has-top-padded-small">讀取中...</div>
							</div>
						</td>
					</tr>
					<tr v-if="!loading && (!more || more.length == 0)">
						<td colspan="2">
							<div class="ts-text is-center-aligned is-disabled has-vertically-padded-large">授課老師未填寫詳細課程資訊
							</div>
						</td>
					</tr>
					<tr v-for="m in more">
						<td>{{ m[0] }}</td>
						<td v-if="m[0] == '教學方法' && m[1].trim()!=''">
							<div class="ts-wrap is-compact">
								<div class="ts-badge is-secondary is-dense" v-for="method in m[1].split(',')" v-html="method"></div>
							</div>
						</td>
						<td v-else v-html="m[1]" ></td>
					</tr>
					<tr v-if="office_time.length > 0">
						<td>Office Time</td>
						<td>
							<div class="ts-list is-unordered">
								<div class="item" v-for="o in office_time" v-html="o"></div>
							</div>
						</td>
					</tr>
					<tr class="ad" v-if="showAd">
						<td colspan="2">
							<div class="ts-box ad is-hollowed">
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
						</td>
					</tr>
					<tr v-if="schedule.length > 0">
						<td colspan="2">
							<b>教學進度表</b>
							<div class="ts-box has-top-spaced-small">
								<div class="ts-content">
									<table class="ts-table">
										<tbody>
											<tr v-for="s in schedule">
												<td>
													<span class="time">{{ (s[7] || s[0]) | formatDate }}</span>
													<span class="time">{{ s[1] | formatTime }}</span>
													<span class="time">{{ s[2] != '' ? s[2] + ' 老師' : '' }}</span>
												</td>
												<td>
													<b v-html="s[3]"></b>
													<div class="ts-text is-description" v-html="s[4]"></div>
													<div class="ts-text is-secondary" v-if="s[5]" v-html="'作業：' + s[5]">
													</div>
													<div class="ts-text is-secondary" v-if="s[6]" v-html="'備註：' + s[6]">
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<br>
		</div>
		<NuxtLink to="/saved/" class="button-fab">
			<span class="ts-icon is-star-icon"></span>
			<span class="ts-badge is-negative" v-if="savedCourse.length > 0">{{ savedCourse.length }}</span>
		</NuxtLink>
	</div>
</template>
<style>
.monospace {
	font-family: monospace;
}

#page-course tbody tr td:first-child {
	width: 7rem;
	font-weight: bold;
}

#page-course tbody tr td:last-child {
	font-weight: normal;
}

#page-course .time {
	display: block;
}

#course-time {
	display: inline;
}

#course-time .time {
	display: inline-block;
}

#course-time .time::after {
	content: '、';
}

#course-time .time:last-child::after {
	content: '';
}

.statistic-title {
	font-size: .9rem;
}

#page-course .ts-content {
	padding: .25rem .75rem;
}

.ts-statistic .ts-icon {
	margin-right: .25rem;
	font-size: .9rem;
	color: var(--ts-gray-500);
}

.ts-statistic .ts-icon:hover {
	cursor: pointer;
}

@media screen and (max-width: 767.98px) {
	#page-course .time {
		display: inline-block;
	}

	#page-course .time::after {
		content: '　';
	}

	#page-course .time:last-child::after {
		content: '';
	}

	#course-time .time::after {
		content: '、';
	}

	#page-course tbody tr td {
		display: block;
		width: 100%;
		padding: 0;
	}

	#page-course tbody tr td:first-child {
		width: 100%;
		padding-top: .4rem;
	}

	#page-course tbody tr td:last-child {
		padding-bottom: .4rem;
	}

	.statistic-title {
		font-size: .8rem;
	}

	#page-course .ts-grid .column.mobile-fluid .ts-wrap {
		justify-content: center;
	}

	#page-course .ts-grid .column.mobile-fluid .ts-button {
		width: calc(50% - .5rem);
	}

	#page-course .ts-content {
		padding: .25rem 1rem .5rem;
	}
}

@media print {
	#page-course tbody tr td:first-child {
		width: 12rem;
	}

	#page-course .ts-icon.is-circle-info-icon {
		display: none;
	}

	#page-course .time:first-child,
	#page-course .time:nth-child(2) {
		display: inline;
		padding-right: .5rem;
	}
}
</style>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
	async asyncData({ params, payload }) {
		if (payload) {
			return {
				course: payload
			}
		}
	},
	data() {
		return {
			time_section: ['0.5', '1', '2', '3', '4', '4.5', '5', '6', '7', '8', '8.5', '9', '10', '11', '12'],
			week_text: ['', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)', ''],
			course: {},
			courses: [],
			more: [],
			office_time: [],
			schedule: [],
			savedCourse: [],
			loading: true,
			start: Date.now()
		}
	},
	head() {
		return {
			title: (this.course.name ? this.course.id.substring(0,3) + '-' + this.course.id.substring(3,4) + ' ' + this.course.name + ' | ' : '') + '明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: (this.course.name ? this.course.id.substring(0,3) + '-' + this.course.id.substring(3,4) + ' ' + this.course.name + ' | ' : '') + '明志科技大學選課小幫手' },

				{ hid: 'description', name: 'description', content: this.course.dept + ' ' + this.course.year + ' ' + this.course.class + '・' + this.course.type + '・' + this.course.credit + ' 學分・' + this.course.teacher + ' 老師' },
				{ hid: 'og:description', name: 'og:description', content: this.course.dept + ' ' + this.course.year + ' ' + this.course.class + '・' + this.course.type + '・' + this.course.credit + ' 學分・' + this.course.teacher + ' 老師' },

				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com' + this.$router.currentRoute.path },
				{ hid: 'og:image', property: 'og:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + Date.now() },
				{ hid: 'twitter:image', name: 'twitter:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + Date.now() }
			]
		}
	},
	filters: {
		formatDate: function (date) {
			if (!date) return '';
			let _d = new Date(date);
			if (_d) {
				return (_d.getMonth() + 1) + '/' + _d.getDate() + ' ' + ['', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)', ''][_d.getDay()];
			} else {
				return date.replace(/^0/, '').replace(/\/0/, '/');
			}
		},
		formatTime: function (time) {
			if (!time) return;
			let _t = time.split('~');
			if (_t[0] == _t[1]) return '第 ' + _t[0] + ' 節';
			else return _t.join(' ~ ') + ' 節';
		}
	},
	async mounted() {
		if (!this.$route.params.id) {
			this.$router.push('/');
			return;
		}
		this.savedCourse = await this.$store.dispatch('getSavedCourse');
		this.fetchData();
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
		hasCoursedTime() {
			if (this.savedCourse.length == 0) return [];
			if (this.savedCourse[0].substring(0, 4) !== this.course.id.substring(0, 4)) return [];
			if (!this.courses) return [];
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
		...mapMutations(['setSavedCourse']),
		isConflicted() {
			if (this.savedCourse.length == 0) return false;
			if (this.savedCourse.includes(this.course.id)) return false;
			if (!this.course.time) return false;
			return this.course.time.some(time => {
				let week = time[0];
				let section = time[1].split('~').map(section => this.time_section.indexOf(section));
				return Array.from({ length: section[1] - section[0] + 1 }, (_, i) => week + '_' + this.time_section[section[0] + i]).some(t => {
					if (this.hasCoursedTime.includes(t)) {
						return true;
					}
				});
			});
		},
		fetchData() {
			this.currentTerm = localStorage['term'] ?? '';
			if (this.savedCourse && this.savedCourse.length > 0) {
				this.currentTerm = this.savedCourse[0].substring(0, 3) + '-' + this.savedCourse[0].substring(3, 4);
			}
			const now = new Date().getTime();
			const storedData = localStorage['courseData_' + this.currentTerm];
			const storedTime = localStorage['courseDataTime_' + this.currentTerm];
			if (storedData && storedTime && (now - storedTime < 30 * 60 * 1000)) {
				this.courses = JSON.parse(storedData).course;
			} else {
				this.$axios.get('https://api.mcut-course.com/list.php?term=' + this.currentTerm).then((res) => {
					localStorage['courseData_' + this.currentTerm] = JSON.stringify(res.data);
					localStorage['courseDataTime_' + this.currentTerm] = now;
					this.courses = res.data.course;
				});
			}
			this.$axios.get('https://api.mcut-course.com/detail.php?id=' + this.$router.currentRoute.path.replace(/course/g, '').replace(/\//g, '') + '&ver=full')
				.then(response => {
					this.course = response.data[3];
					this.more = response.data[0];
					this.office_time = response.data[1];
					this.schedule = response.data[2];
					this.loading = false;
				});
		},
		async saveCourse() {
			if (this.savedCourse.includes(this.course.id)) {
				this.savedCourse = this.savedCourse.filter(item => item !== this.course.id);
				this.$swal({
					title: '已取消收藏「' + this.course.name + '」', icon: 'success', toast: true,
					timer: 3000, timerProgressBar: true,
					position: 'bottom-start', showConfirmButton: false,
				})
			} else {
				if (this.savedCourse[0] && this.savedCourse[0].substring(0, 4) !== this.course.id.substring(0, 4)) {
					this.$swal({
						title: '無法收藏跨學期的課程',
						icon: 'warning',
						html: '是否要清空目前已收藏的課程，並切換至 ' + this.course.id.substring(0, 3) + '-' + this.course.id.substring(3, 4) + ' 學期？',
						confirmButtonText: '確定',
						cancelButtonText: '取消',
						showCancelButton: true,
					})
						.then((res) => {
							if (res.isConfirmed) {
								this.savedCourse = [this.course.id];
								localStorage['term'] = this.course.id.substring(0, 3) + '-' + this.course.id.substring(3, 4);
								this.setSavedCourse([this.savedCourse]);
								this.$root.$emit('updateSavedCourse', this.savedCourse);
								this.$swal({
									title: '「' + this.course.name + '」已收藏', icon: 'success', toast: true,
									timer: 3000, timerProgressBar: true,
									position: 'bottom-start', showConfirmButton: false,
								});
							} else {
								return;
							}
						});
					return;
				}
				this.savedCourse.push(this.course.id);
				this.$swal({
					title: '已收藏「' + this.course.name + '」', icon: 'success', toast: true,
					timer: 3000, timerProgressBar: true,
					position: 'bottom-start', showConfirmButton: false,
				});
			}
			this.setSavedCourse([this.savedCourse]);
			this.$root.$emit('updateSavedCourse', this.savedCourse);
		},
		share() {
			if (navigator.share && window.innerWidth < 768) {
				navigator.share({
					title: (this.course.name ? this.course.name + ' | ' : '') + '明志科技大學選課小幫手',
					url: document.location.href
				});
			} else {
				this.$swal({
					title: '分享這門課程',
					html: '<div class="ts-box"><div class="ts-content is-start-aligned is-dense">' + document.location.origin + document.location.pathname + '</div></div>',
					confirmButtonText: '複製網址',
					showCloseButton: true,
				}).then((result) => {
					if (result.isConfirmed) {
						const el = document.createElement('textarea');
						el.value = document.location.origin + document.location.pathname;
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
		},
		showTimeInfo() {
			let timeInfo = [
				["07:00", "07:50"], // 0.5
				["08:00", "08:50"], // 1
				["09:00", "09:50"], // 2
				["10:00", "10:50"], // 3
				["11:00", "11:50"], // 4
				["12:00", "12:50"], // 4.5
				["13:00", "13:50"], // 5
				["14:00", "14:50"], // 6
				["15:00", "15:50"], // 7
				["16:00", "16:50"], // 8
				["17:00", "17:50"], // 8.5
				["18:40", "19:25"], // 9
				["19:30", "20:15"], // 10
				["20:25", "21:10"], // 11
				["21:15", "22:00"], // 12
			];
			let timeInfoText = '';
			if ((
				this.course.time.every(time => time[1].includes('.5') && time[1].split('~')[0]==time[1].split('~')[1]) ||
				this.course.time.every(time => time[0] == 0 || time[0] == 7)
			) && (
				this.course.name.includes('勤勞教育') ||
				this.course.name.includes('大學之道') ||
				this.course.name.includes('實習前職場素養訓練') ||
				this.course.name.includes('專題') ||
				this.course.name.includes('工讀實務實習') ||
				this.course.name.includes('工讀自學英文') ||
				this.course.name.includes('設計思考')
			)) {
				timeInfoText = '「'+this.course.name+'」課程於系統上無表定上課時間，請參考備註或教學進度表，也可以詢問授課老師/班級導師。';
			} else {
				this.course.time.forEach(time => {
					let week = time[0];
					let section = time[1].split('~').map(section => this.time_section.indexOf(section));
					timeInfoText += '星期' + this.week_text[week].replace(/[\(\)]/g,'') + '　' + timeInfo[section[0]][0] + ' ~ ' + timeInfo[section[1]][1] + '<br>';
				});
			}
			this.$swal({
				title: '上課時間',
				html: '<div style="text-align:left">' + timeInfoText + '</div>',
				showConfirmButton: false,
				showCloseButton: true,
				width: timeInfoText.includes('無固定') ? '24rem' : '16rem',
			});
		}
	}
}
</script>