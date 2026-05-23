<template>
	<div>
		<!-- 列表視圖 -->
		<table v-if="displayType === '1'" class="ts-table course-table">
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
				<template v-for="(course, index) in courses">
					<tr :key="course.id" @click="$emit('course-click', course)">
						<td class="c-class">{{ course.dept + ' ' + course.year + ' ' + course.class }}
							<span class="mobile-only" v-if="!course.id.includes('ALT_')">{{  course.teacher + ' 老師' }}</span>
						</td>
						<td class="c-name">
							{{ course.name }}
						</td>
						<td class="c-time">
							<span v-for="time in course.time" :key="time[0] + '_' + time[1]" class="time">
								<template v-if="time[1].split('~')[0] == time[1].split('~')[1]">{{
									week_text(time[0], course) + ' ' + time[1].split('~')[0] }}</template>
								<template v-else>{{ week_text(time[0], course) + ' ' + time[1] }}</template>
							</span>
							<span v-if="isConflicted(course)" class="is-conflict mobile-inline">
								<span class="ts-icon is-circle-alert-icon"></span>
								衝堂
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
							<span v-if="isConflicted(course)" class="is-conflict mobile-hidden">
								<span class="ts-icon is-circle-alert-icon"></span>
								衝堂
							</span>
							<span class="ts-icon absolute-right is-star-icon" v-if="savedCourse.includes(course.id)" @click.stop="$emit('action-click', course.id)"></span>
							<span class="ts-icon absolute-right is-star-o-icon" v-else @click.stop="$emit('action-click', course.id)"></span>
						</td>
					</tr>
				</template>
			</tbody>
		</table>

		<!-- 時間表視圖（進階課表） -->
		<table v-else-if="displayType === ''" class="ts-table is-dense is-celled is-definition timetable" :class="{
			'showSat': coursesByStartTime[6] && (currentClass || !enableAutoShowOnlyMonAndThu),
			'showOnlyMonAndThu': showOnlyMonAndThu
		}">
			<thead>
				<tr>
					<th class="time-header"></th>
					<th v-for="w in 6" :key="'header-' + w">{{ week_text(w).replace(/\(|\)/g,'') }}</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="time-column">
						<template v-for="section in timeSection">
							<div
								v-if="section <= maxEndSection"
								:key="section"
								class="time-slot">
								{{ section }}
							</div>
						</template>
					</td>
					<td v-for="w in 6" :key="'day-' + w" class="day-column">
						<div v-if="processedSchedule[w]?.tooManyOverlaps" class="overlap-warning">
							該天有過多重疊課程，<br>請改用列表檢視
						</div>
						<template v-else>
							<div
								v-for="course in (processedSchedule[w]?.courses || [])"
								:class="['course-block', course.className]"
								:style="course.style"
								@click="$emit('course-click', course)"
								>
								<div>
									{{ formatCourseName(course) }}
									<small v-if="!course?.teacher?.includes('分班')"><br />{{ course.teacher }}</small>
								</div>
							</div>
						</template>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
		};
	},
	mounted() {
		this._onResize = () => { this.windowWidth = window.innerWidth; };
		window.addEventListener('resize', this._onResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this._onResize);
	},
	props: {
		courses: {
			type: Array,
			required: true
		},
		allCourses: {
			type: Array,
			default: () => []
		},
		savedCourse: {
			type: Array,
			default: () => []
		},
		displayType: {
			type: String,
			default: ''
		},
		timeSection: {
			type: Array,
			default: () => ['0.5', '1', '2', '3', '4', '4.5', '5', '6', '7', '8', '8.5', '9', '10', '11', '12']
		},
		maxEndSection: {
			type: Number,
			default: 8
		},
		currentClass: {
			type: String,
			default: ''
		},
		currentDept: {
			type: String,
			default: ''
		},
		showOnlyMonAndThuProp: {
			type: Boolean,
			default: false
		},
		enableAutoShowOnlyMonAndThu: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		sectionIndexMapObj() {
			return this.timeSection.reduce((result, section, index) => {
				result[section] = index;
				return result;
			}, {});
		},
		coursesMap() {
			const result = new Map();
			this.allCourses.forEach(course => {
				result.set(course.id, course);
			});
			return result;
		},
		savedCourseTimeOccupancy() {
			const map = new Map();
			for (const courseId of this.savedCourse) {
				const c = this.coursesMap.get(courseId);
				if (!c?.time) continue;
				for (const [week, range] of c.time) {
					const [startStr, endStr] = range.split('~');
					const si = this.sectionIndexMapObj[startStr];
					const ei = this.sectionIndexMapObj[endStr];
					if (si === undefined || ei === undefined) continue;
					for (let i = si; i <= ei; i++) {
						const key = `${week}_${i}`;
						if (!map.has(key)) map.set(key, new Set());
						map.get(key).add(courseId);
					}
				}
			}
			return map;
		},
		coursesByStartTime() {
			let result = {};
			this.courses.forEach(course => {
				course.time.forEach(timeSlot => {
					const [weekday, timeRange] = timeSlot;
					const startTime = timeRange.split('~')[0];
					const endTime = timeRange.split('~')[1];

					if (!result[weekday]) {
						result[weekday] = {};
					}

					if (!result[weekday][startTime]) {
						result[weekday][startTime] = [];
					}

					result[weekday][startTime].push({
						...course,
						period: this.timeSection.indexOf(endTime) - this.timeSection.indexOf(startTime) + 1,
					});
				});
			});
			return result;
		},
		showOnlyMonAndThu() {
			if (this.showOnlyMonAndThuProp) return true;
			if (!this.enableAutoShowOnlyMonAndThu) return false;
			return this.currentDept.includes('通識') && !this.coursesByStartTime[2] && !this.coursesByStartTime[3] && !this.coursesByStartTime[5] && !this.coursesByStartTime[6];
		},
		showAdvancedTimetable() {
			return this.currentClass || (this.currentDept && this.currentDept.includes('通識'));
		},
		processedSchedule() {
			const schedule = {};
			const days = Object.keys(this.coursesByStartTime);

			for (const day of days) {
				if (!this.coursesByStartTime[day]) continue;

				const coursesForDay = [];
				const startSections = Object.keys(this.coursesByStartTime[day]);

				for (const startSection of startSections) {
					const courses = this.coursesByStartTime[day][startSection];
					for (const course of courses) {
						const startIndex = this.sectionIndexMapObj[startSection];
						if (startIndex === undefined) continue;

						coursesForDay.push({
							...course,
							startSection: startSection,
							startIndex: startIndex,
							endIndex: startIndex + course.period,
						});
					}
				}
				
				coursesForDay.sort((a, b) => a.startIndex - b.startIndex);

				let processedCourses = [];
				for (const course of coursesForDay) {
					let columnIndex = 0;
					let totalColumns = 1;

					const overlappingCourses = processedCourses.filter(p => 
						course.startIndex < p.endIndex && course.endIndex > p.startIndex
					);
					
					if (overlappingCourses.length > 0) {
						const occupiedColumns = new Set(overlappingCourses.map(c => c.columnIndex));
						while(occupiedColumns.has(columnIndex)) {
							columnIndex++;
						}
						
						totalColumns = Math.max(...overlappingCourses.map(c => c.totalColumns), columnIndex + 1);
						overlappingCourses.forEach(p => {
							p.totalColumns = totalColumns;
						});
					}
					
					course.columnIndex = columnIndex;
					course.totalColumns = totalColumns;
					processedCourses.push(course);
				}

				const maxOverlap = Math.max(0, ...processedCourses.map(c => c.totalColumns));
				let maxColumnsAllowed = 5;
				if (this.windowWidth < 414) {
					maxColumnsAllowed = 2;
				} else if (this.windowWidth < 768) {
					maxColumnsAllowed = 3;
				}
				if (this.showOnlyMonAndThu) maxColumnsAllowed += 3;

				if (maxOverlap > maxColumnsAllowed) {
					schedule[day] = {
						courses: [],
						tooManyOverlaps: true,
					};
				}
				else {
					schedule[day] = {
						courses: processedCourses.map(course => {
							const width = 100 / course.totalColumns;
							const left = course.columnIndex * width;
							return {
								...course,
								className: {
									"is-orange": course.type == "必修",
									"is-green": course.type == "選修",
									"is-gray": course.type == "重修",
								},
								style: {
									top: `${course.startIndex * 4 + 0.2}rem`,
									height: `${course.period * 4 - 0.4}rem`,
									width: `calc(${width}% - 4px)`,
									left: `${left}%`,
								},
							};
						}),
						tooManyOverlaps: false,
					};
				}
			}

			return schedule;
		}
	},
	methods: {
		week_text(day, course) {
			let _day = ['(其他)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)', '(其他)'][day];
			if(course?.comment?.includes('塊狀')) return '(其他)';
			return _day;
		},
		formatCourseName(course) {
			let name = course?.name || '';
			if(name.startsWith('體育(') && name.includes(')') && name.split(')')[1].length >= 1) {
				name = name.split(')')[1];
			}
			return name;
		},
		isConflicted(course) {
			if (!Array.isArray(this.savedCourse) || !this.savedCourse.length || !course?.time) return false;
			for (const [week, range] of course.time) {
				const [startStr, endStr] = range.split('~');
				const si = this.sectionIndexMapObj[startStr];
				const ei = this.sectionIndexMapObj[endStr];
				if (si === undefined || ei === undefined) continue;
				for (let i = si; i <= ei; i++) {
					const users = this.savedCourseTimeOccupancy.get(`${week}_${i}`);
					if (users && (users.size > 1 || !users.has(course.id))) return true;
				}
			}
			return false;
		}
	}
}
</script>

<style scoped>
.ts-table tr.is-indicated {
	box-shadow: 2px 0 0 var(--ts-primary-400) inset !important;
}

.ts-table tr.is-indicated.is-negative {
	box-shadow: 2px 0 0 var(--ts-negative-600) inset !important;
}

.timetable {
	width: 100%;
	border-collapse: collapse;
	table-layout: fixed;
}

.timetable th,
.timetable td {
	border: 1px solid var(--ts-gray-50);
	text-align: center;
	vertical-align: top;
}

.timetable th {
	padding: 0.8rem 0.5rem;
	font-weight: bold;
}

.timetable th,
.timetable td {
	text-align: center;
	vertical-align: middle;
	width: 20%;
}

.timetable th:first-child,
.timetable td:first-child {
	width: 2rem !important;
}

.timetable th:nth-child(7),
.timetable td:nth-child(7) {
	display: none !important;
}

.timetable.showSat th,
.timetable.showSat td {
	width: 16.666%;
}

.timetable.showSat th:nth-child(7),
.timetable.showSat td:nth-child(7) {
	display: table-cell !important;
}

.timetable.showOnlyMonAndThu th,
.timetable.showOnlyMonAndThu td {
	display: none;
	width: 50%;
}

.timetable.showOnlyMonAndThu th:nth-child(1),
.timetable.showOnlyMonAndThu td:nth-child(1),
.timetable.showOnlyMonAndThu th:nth-child(2),
.timetable.showOnlyMonAndThu td:nth-child(2),
.timetable.showOnlyMonAndThu th:nth-child(5),
.timetable.showOnlyMonAndThu td:nth-child(5) {
	display: table-cell !important;
}

.time-column {
	padding: 0;
}

.time-slot {
	height: 3.9rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.9rem;
	color: #666;
	border-bottom: 1px solid var(--ts-gray-200);
}

.time-slot:last-child {
	border-bottom: none;
}

.day-column {
	position: relative;
	padding: 0 .25rem !important;
}

.day-column::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: repeating-linear-gradient(
		to bottom,
		transparent 0,
		transparent calc(4rem - 1px),
		var(--ts-gray-200) calc(4rem - 1px),
		var(--ts-gray-200) 4rem
	);
	pointer-events: none;
}

.course-block {
	position: absolute;
	box-sizing: border-box;
	padding: 0.1rem;
	border-radius: 4px;
	color: white;
	font-size: 0.8rem;
	cursor: pointer;
	overflow: hidden;
	margin: 0 2px;
	line-height: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.course-block small {
	opacity: 0.8;
}

.overlap-warning {
	font-size: .7rem;
	padding: 0.5rem;
	text-align: center;
	color: #666;
}

@media (max-width: 767.98px) {
	.timetable th,
	.time-slot {
		font-size: .8rem;
	}

	.course-block {
		font-size: .75rem;
	}

	.overlap-warning {
		font-size: .7rem;
	}
}
</style>
