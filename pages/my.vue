<template>
	<div class="cell is-scrollable is-fluid is-horizontal" id="page-my">
		<div class="cell is-tertiary is-scrollable sidebar" :class="{ 'show': showMobileSidebar }">
			<div class="ts-content">
				<div class="ts-wrap is-vertical has-top-padded">
					<button class="ts-close is-large mobile-only close-sidebar"
						@click="showMobileSidebar = !showMobileSidebar"></button>
					<div class="mobile-hidden">
						<div class="ts-text is-label has-bottom-padded-small">新增課程</div>
						<button class="ts-button is-outlined is-small is-fluid is-start-icon">
							<span class="ts-icon is-plus-icon"></span>
							新增
						</button>
						<button class="ts-button is-outlined is-small is-fluid is-start-icon has-top-spaced-small" @click="importFromSaved()">
							<span class="ts-icon is-star-icon"></span>
							從「收藏的課程」匯入
						</button>
					</div>

					<!--
					<div>
						<div class="ts-text is-label has-bottom-padded-small">顏色主題</div>
						<div class="ts-box theme-selector rainbow">
							<span class="ts-icon is-chevron-down-icon"></span>
						</div>
					</div>

					<div>
						<div class="ts-text is-label has-bottom-padded-small">背景顏色 / 圖片</div>
						<div class="ts-box theme-selector">
							<span class="ts-icon is-chevron-down-icon"></span>
						</div>
						<button class="ts-button is-outlined is-small is-fluid is-start-icon has-top-spaced-small">
							<span class="ts-icon is-upload-icon"></span>
							上傳圖片
						</button>
					</div>
					-->

					<div>
						<div class="ts-text is-label has-bottom-padded-small">顯示設定</div>
						<div class="ts-wrap is-vertical is-compact">
							<label class="ts-checkbox">
								<input type="checkbox" v-model="showRowLine" @change="drawTimetable()" />
								水平格線
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="showColLine" @change="drawTimetable()" />
								垂直格線
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="showRowTitle" @change="drawTimetable()" />
								節次
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="showColTitle" @change="drawTimetable()" />
								星期
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="showCourseClassroom" @change="drawTimetable()" />
								課程：上課地點
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="showCourseTime" @change="drawTimetable()" />
								課程：上課時間
							</label>
						</div>
					</div>

					<div class="mobile-hidden">
						<button class="ts-button is-small is-fluid is-start-icon" @click="downloadImage()">
							<span class="ts-icon is-download-icon"></span>
							下載圖片
						</button>
					</div>

					<div class="ts-text is-description mobile-hidden">
						<span class="ts-badge has-bottom-spaced-small is-small is-dense">提示</span>
						<div class="ts-list is-small is-unordered">
							<div class="item">點擊空白處可新增課程</div>
							<div class="item">點擊課程可修改資訊</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="cell is-secondary is-fluid is-scrollable has-top-padded-large" style="min-height:100%">
			<div class="ts-container mobile-only">
				<div class="ts-box has-bottom-spaced">
					<div class="ts-content">
						<div class="ts-text is-description">
							<span class="ts-badge has-bottom-spaced-small is-small is-dense">提示</span>
							<div class="ts-list is-small is-unordered">
								<div class="item">點擊空白處可新增課程</div>
								<div class="item">點擊課程可修改資訊</div>
							</div>
						</div>
					</div>
				</div>
				<div class="ts-wrap">
					<button class="ts-button is-fluid is-outlined is-start-icon" @click="showMobileSidebar = !showMobileSidebar">
						<span class="ts-icon is-eye-icon"></span>
						課表設定
					</button>
					<button class="ts-button is-fluid is-outlined is-start-icon" @click="importFromSaved()">
						<span class="ts-icon is-star-icon"></span>
						從「收藏的課程」匯入
					</button>
					<button class="ts-button is-fluid is-start-icon" @click="downloadImage()">
						<span class="ts-icon is-download-icon"></span>
						下載圖片
					</button>
				</div>
			</div>
			<div class="ts-container has-top-padded is-fitted mobile-padded timetable-container">
				<canvas id="timetableCanvas"></canvas>
			</div>
			<br>
			<div class="ts-mask" v-show="showMobileSidebar" @click="showMobileSidebar = !showMobileSidebar"></div>
		</div>
	</div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400&display=swap');
.timetable-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.theme-selector {
	display: flex;
	justify-content: flex-end;
	padding: 0 .5rem;
}

.rainbow {
	background: linear-gradient(
		to right,
		#F8BBD0 0%, #F8BBD0 7.69%,
		#FFCDD2 7.69%, #FFCDD2 15.38%,
		#FFE0B2 15.38%, #FFE0B2 23.07%,
		#FFF9C4 23.07%, #FFF9C4 30.76%,
		#F0F4C3 30.76%, #F0F4C3 38.45%,
		#C8E6C9 38.45%, #C8E6C9 46.14%,
		#B2EBF2 46.14%, #B2EBF2 53.83%,
		#BBDEFB 53.83%, #BBDEFB 61.52%,
		#C5CAE9 61.52%, #C5CAE9 69.21%,
		#D1C4E9 69.21%, #D1C4E9 76.9%,
		#D7CCC8 76.9%, #D7CCC8 84.59%,
		#CCC 84.59%, #CCC 92.28%,
		#EEE 92.28%, #EEE 100%
	);
}

.theme-selector:hover {
	cursor: pointer;
}

.theme-selector .ts-icon {
	color: var(--ts-gray-600);
}

@media (max-width: 768px) {
}
</style>
<script>
export default {
	/*
	To-do:
	節次要按照目前的課程決定
	修改課程
	新增課程
	theme
	iOS widget
	*/
	async asyncData({ $axios, params, payload }) {
		
	},
	head() {
		return {
			title: '我的課表 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '我的課表 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$route.params.id },
			]
		}
	},
	data() {
		return {
			showMobileSidebar: false,
			loading: true,
			
			maxEndSection: 8,
			savedCourses: [],
			myCourses: [],

			showColTitle: true,
			showRowTitle: true,
			showColLine: true,
			showRowLine: true,
			showCourseClassroom: true,
			showCourseTime: true,
			ctx: null,
		}
	},
	computed: {
		coursesByStartTime() {
			let result = {};
			return result;
		},
		time_section() {
			return ['1', '2', '3', '4', '5', '6', '7', '8'];
		},
		week_text() {
			return ['一', '二', '三', '四', '五'];
		},
	},
	methods: {
		async loadFonts() {
			await document.fonts.load('14px "Noto Sans TC"');
		},
		async importFromSaved() {
			const savedCourse = JSON.parse(localStorage.getItem('savedCourse') || '[]');
			if (savedCourse.length === 0) return;
			this.currentTerm = savedCourse[0].substring(0, 3) + '-' + savedCourse[0].substring(3, 4);
			const now = new Date().getTime();
			const storedData = localStorage['courseData_' + this.currentTerm];
			const storedTime = localStorage['courseDataTime_' + this.currentTerm];

			let data = [];
			if (storedData && storedTime && (now - storedTime < 30 * 60 * 1000)) {
				data = JSON.parse(storedData);
			} else {
				try {
					const res = await this.$axios.get('https://api.mcut-course.com/list.php?term=' + this.currentTerm);
					localStorage['courseData_' + this.currentTerm] = JSON.stringify(res.data);
					localStorage['courseDataTime_' + this.currentTerm] = now;
					data = res.data;
				} catch (e) {
					console.error(e);
				}
			}
			this.myCourses = [];
			data.course.forEach(course => {
				if(savedCourse.includes(course.id)) {
					course.time.forEach(time => {
						if(time[1].includes('0.5')) return; 
						this.myCourses.push({
							name: course.name,
							classroom: course.classroom,
							id: course.id,
							time: time,
						});
					});
				}
			});
			this.myCourses.sort((a, b) => {
				if (a.time[0] === b.time[0]) {
					return parseInt(a.time[1].split('~')[0], 10) - parseInt(b.time[1].split('~')[0], 10);
				}
				return parseInt(a.time[0], 10) - parseInt(b.time[0], 10);
			});
			this.drawTimetable();
		},

		setCanvasSize() {
			const canvas = document.getElementById('timetableCanvas');
			this.ctx = canvas.getContext('2d');
			const maxWidth = window.innerWidth * 0.9;
			const maxHeight = window.innerHeight * 0.9;
			let width = maxWidth;
			let height = maxWidth * 16 / 9;
			if (height > maxHeight) {
				height = maxHeight;
				width = maxHeight * 9 / 16;
			}
			canvas.width = width * 2;
			canvas.height = height * 2;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			this.drawTimetable();
		},
		drawTimetable() {
			if (!CanvasRenderingContext2D.prototype.drawRoundedRect) {
				CanvasRenderingContext2D.prototype.drawRoundedRect = function (x, y, width, height, radius) {
					radius = Math.min(radius, width / 2, height / 2);
					this.beginPath();
					this.moveTo(x + radius, y);
					this.lineTo(x + width - radius, y);
					this.arcTo(x + width, y, x + width, y + radius, radius);
					this.lineTo(x + width, y + height - radius);
					this.arcTo(x + width, y + height, x + width - radius, y + height, radius);
					this.lineTo(x + radius, y + height);
					this.arcTo(x, y + height, x, y + height - radius, radius);
					this.lineTo(x, y + radius);
					this.arcTo(x, y, x + radius, y, radius);
					this.closePath();
					this.fill();
				};
			}
			CanvasRenderingContext2D.prototype.wrapText = function (context, texts, x, y, maxWidth, lineHeight) {
				let index = 0;
				for (let text of texts) {
					if(index == 0) {
						ctx.font = (ctx.canvas.width / 40) + 'px Noto Sans TC';
						ctx.fillStyle = '#444';
						ctx.textAlign = 'left';
						ctx.textBaseline = 'middle';
					} else {
						ctx.font = (ctx.canvas.width / 50) + 'px Noto Sans TC';
						ctx.fillStyle = '#666';
						ctx.textAlign = 'left';
						ctx.textBaseline = 'middle';
						y += lineHeight * 0.1;
					}
					const words = text.split('');
					let line = '';
					for (let i = 0; i < words.length; i++) {
						const testLine = line + words[i];
						const metrics = context.measureText(testLine);
						const testWidth = metrics.width;
						if (testWidth > maxWidth && i > 0) {
							context.fillText(line, x, y);
							line = words[i];
							y += lineHeight;
						} else {
							line = testLine;
						}
					}
					context.fillText(line, x, y);
					y += lineHeight;
					index++;
				}
			}

			const rows = this.time_section.length;
			const cols = this.week_text.length;
			const ctx = this.ctx;

			const colTitleHeight = this.showColTitle ? ctx.canvas.height * 0.035 : 0;
			const cellHeight = (this.showColTitle ? 0.965 : 1) * ctx.canvas.height / rows;
			const rowTitleWidth = this.showRowTitle ? ctx.canvas.width * 0.05 : 0;
			const cellWidth = (this.showRowTitle ? 0.95 : 1) * ctx.canvas.width / cols;

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.fillStyle = '#FFF';
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			ctx.strokeStyle = '#DDD';
			for (let i = 0; i <= rows; i++) {
				if (this.showRowLine && i < rows) {
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(0, i * cellHeight + colTitleHeight);
					ctx.lineTo(ctx.canvas.width, i * cellHeight + colTitleHeight);
					ctx.stroke();
				}
				if (this.showRowTitle && i < rows) {
					ctx.font = (ctx.canvas.width / 30) + 'px Noto Sans TC';
					ctx.fillStyle = '#999';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(this.time_section[i], rowTitleWidth / 2, i * cellHeight + cellHeight / 2 + colTitleHeight);
				}
			}

			for (let j = 0; j <= cols; j++) {
				if (this.showColLine && j < cols) {
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(j * cellWidth + rowTitleWidth, 0);
					ctx.lineTo(j * cellWidth + rowTitleWidth, ctx.canvas.height);
					ctx.stroke();
				}
				if (this.showColTitle && j < cols) {
					ctx.font = (colTitleHeight / 2) + 'px Noto Sans TC';
					ctx.fillStyle = '#999';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(this.week_text[j], j * cellWidth + cellWidth / 2 + rowTitleWidth, colTitleHeight / 2);
				}
			}

			let timeInfo = {
				'0.5': ["07:00", "07:50"],
				'1': ["08:00", "08:50"],
				'2': ["09:00", "09:50"],
				'3': ["10:00", "10:50"],
				'4': ["11:00", "11:50"],
				'4.5': ["12:00", "12:50"],
				'5': ["13:00", "13:50"],
				'6': ["14:00", "14:50"],
				'7': ["15:00", "15:50"],
				'8': ["16:00", "16:50"],
				'8.5': ["17:00", "17:50"],
				'9': ["18:40", "19:25"],
				'10': ["19:30", "20:15"],
				'11': ["20:25", "21:10"],
				'12': ["21:15", "22:00"],
			};

			this.myCourses.forEach(course => {
				console.log(
					course.name,
					course.time[0],
					course.time[1].split('~')[0],
				)
				const start = parseInt(course.time[1].split('~')[0], 10);
				const end = parseInt(course.time[1].split('~')[1], 10);
				if (isNaN(start) || isNaN(end)) return;
				const day = parseInt(course.time[0], 10);
				if (isNaN(start) || isNaN(end) || isNaN(day)) return;

				const x = (day - 1) * cellWidth + rowTitleWidth;
				const y = (start - 1) * cellHeight + colTitleHeight;
				const w = cellWidth;
				const h = (end - start + 1) * cellHeight;

				let courseIdList = this.myCourses.map(course => course.id);
				courseIdList = courseIdList.filter((id, index) => courseIdList.indexOf(id) === index);
				ctx.fillStyle  = ['#F8BBD0','#FFCDD2','#FFE0B2','#FFF9C4','#F0F4C3','#C8E6C9','#B2EBF2','#BBDEFB','#C5CAE9','#D1C4E9','#D7CCC8'][courseIdList.indexOf(course.id) % 11];
				ctx.drawRoundedRect(x + 10, y + 10, w - 20, h - 20, cellWidth / 20);
				let texts = [course.name];
				if (this.showCourseClassroom) {
					texts.push(course.classroom);
				}
				if (this.showCourseTime) {
					texts.push(timeInfo[course.time[1].split('~')[0]][0] + ' ~ ' + timeInfo[course.time[1].split('~')[1]][1]);
				}
				ctx.wrapText(ctx, texts, x + 20, y + 30, cellWidth - 40, ctx.canvas.width / 35);
			});
		},
		downloadImage() {
			const canvas = document.getElementById('timetableCanvas');
			const link = document.createElement('a');
			link.download = '課表.png';
			link.href = canvas.toDataURL();
			link.click();
		},
	},
	mounted() {
		this.loadFonts().then(() => {
			this.setCanvasSize();
			window.addEventListener('resize', this.setCanvasSize());
		});
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.setCanvasSize());
	},
}
</script>