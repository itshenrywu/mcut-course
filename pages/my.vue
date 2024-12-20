<template>
	<div class="cell is-scrollable is-fluid is-horizontal" id="page-my">
		<div class="cell is-tertiary is-scrollable sidebar" :class="{ 'show': showMobileSidebar }">
			<div class="ts-content">
				<div class="ts-wrap is-vertical has-top-padded is-relaxed">
					<button class="ts-close is-large mobile-only close-sidebar"
						@click="showMobileSidebar = !showMobileSidebar"></button>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">個人課表</div>
						<div class="ts-wrap is-dense">
							<button class="ts-button is-outlined is-small is-fluid is-start-icon" @click="importFromSaved()">
								<span class="ts-icon is-star-icon"></span>
								從「收藏的課程」匯入
							</button>
							<button class="ts-button is-outlined is-small is-fluid is-start-icon" @click="clickCell(-1, -1)">
								<span class="ts-icon is-plus-icon"></span>
								新增課程
							</button>
							<button class="ts-button is-negative is-outlined is-small is-fluid is-start-icon" @click="clearAll()">
								<span class="ts-icon is-trash-icon"></span>
								全部清除
							</button>
						</div>
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
							<div class="ts-range has-top-padded-small">
								<div class="ts-text is-label has-bottom-padded-small">外框寬度</div>
								<input type="range" min="0" max="64" v-model="tableBorder" @change="drawTimetable()" style="width:100%" />
							</div>
						</div>
					</div>

					<div class="ts-wrap is-dense mobile-hidden">
						<button class="ts-button is-small is-fluid is-start-icon" @click="downloadImage()">
							<span class="ts-icon is-download-icon"></span>
							下載圖片
						</button>
						<button class="ts-button is-small is-fluid is-start-icon" @click="showWidget()" v-show="isIos">
							<span class="ts-icon is-mobile-screen-icon"></span>
							安裝 iOS 小工具
						</button>
					</div>

					<div class="ts-text is-description mobile-hidden">
						<span class="ts-badge has-bottom-spaced-small is-small is-dense">提示</span>
						<div class="ts-list is-small is-unordered">
							<div class="item">這裡是用來製作課表圖片或使用小工具的，課表與「收藏的課程」不同步！</div>
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
								<div class="item">這裡是用來製作課表圖片或使用小工具的，課表與「收藏的課程」不同步！</div>
								<div class="item">點擊空白處可新增課程</div>
								<div class="item">點擊課程可修改資訊</div>
							</div>
						</div>
					</div>
				</div>
				<div class="ts-grid">
					<div class="column" :class="{'is-16-wide':isIos, 'is-8-wide': !isIos}">
						<button class="ts-button is-fluid is-secondary is-start-icon" @click="showMobileSidebar = !showMobileSidebar">
							<span class="ts-icon is-table-cells-icon"></span>
							課表設定
						</button>
					</div>
					<div class="column is-8-wide">
						<button class="ts-button is-fluid is-start-icon" @click="downloadImage()">
							<span class="ts-icon is-download-icon"></span>
							下載圖片
						</button>
					</div>
					<div class="column" :class="{'is-8-wide':isIos, 'mobile-hidden': !isIos}">
						<button class="ts-button is-fluid is-start-icon" @click="showWidget()">
							<span class="ts-icon is-mobile-screen-icon"></span>
							安裝 iOS 小工具
						</button>
					</div>
				</div>
			</div>
			<div class="ts-container has-top-padded is-fitted mobile-padded timetable-container">
				<div class="ts-box" style="background-color: #fff;">
					<canvas id="timetableCanvas"></canvas>
				</div>
			</div>
			<br>
			<div class="ts-mask" v-show="showMobileSidebar" @click="showMobileSidebar = !showMobileSidebar"></div>
		</div>
		<dialog class="ts-modal is-large" id="newCourseDialog">
			<div class="content">
				<div class="ts-content">
					<div class="ts-grid">
						<div class="column is-fluid">
							<div class="ts-header">{{ action === 'new' ? '新增課程' : '修改課程' }}</div>
						</div>
						<div class="column">
							<button class="ts-close is-large is-secondary" @click="closeDialog()"></button>
						</div>
					</div>
				</div>
				<div class="ts-divider"></div>
				<div class="ts-content">
					<div class="ts-text is-label has-bottom-padded-small">上課時間</div>
					<div class="ts-grid is-middle-aligned">
						<div class="column is-5-wide">
							<div class="ts-select is-fluid">
								<select v-model="newDay">
									<option value="-1" disabled>請選擇星期...</option>
									<option v-for="(w, i) of ['一','二','三','四','五']" :value="i">星期{{ w }}</option>
								</select>
							</div>
						</div>
						<div class="column is-5-wide">
							<div class="ts-select is-fluid">
								<select v-model="newStart" @change="checkSection()">
									<option value="-1" disabled>請選擇節次</option>
									<option v-for="section of time_section_full" :value="section">第 {{ section }} 節</option>
								</select>
							</div>
						</div>
						<div class="column is-1-wide" style="text-align: center">
						~
						</div>
						<div class="column is-5-wide">
							<div class="ts-select is-fluid">
								<select v-model="newEnd">
									<option value="-1" disabled>請選擇節次</option>
									<option v-for="section of time_section_full" :value="section" :disabled="parseInt(section) < newStart">第 {{ section }} 節</option>
								</select>
							</div>
						</div>
					</div>
					<br>
					<div class="ts-text is-label has-bottom-padded-small">課程名稱</div>
					<div class="ts-input is-fluid">
						<input type="text" v-model.trim="newName">
					</div>
					<br>
					<div class="ts-text is-label has-bottom-padded-small">上課地點</div>
					<div class="ts-input is-fluid">
						<input type="text" v-model.trim="newClassroom">
					</div>
					<br>
					<button class="ts-button is-fluid" @click="newCourse">{{ action === 'new' ? '新增' : '修改' }}</button>
				</div>
			</div>
		</dialog>
		<dialog class="ts-modal is-big" id="widgetDialog">
			<div class="content">
				<div class="ts-content">
					<div class="ts-grid">
						<div class="column is-fluid">
							<div class="ts-header">安裝 iOS 小工具</div>
						</div>
						<div class="column">
							<button class="ts-close is-large is-secondary" @click="closeDialog()"></button>
						</div>
					</div>
				</div>
				<div class="ts-divider"></div>
				<div class="ts-content">
					<h2 class="ts-header is-large">1. 安裝 Scriptable</h2>
					<a href="https://apps.apple.com/tw/app/scriptable/id1405459188"><img style="width: 150px" src="https://i.imgur.com/Tq43Fdb.png"></a>
					<h2 class="ts-header is-large" style="margin-bottom:0;">2. 複製以下程式碼<small>（點選即可複製）</small></h2>
					<div class="ts-text is-description">課程每次修改後須重新更改一次程式碼！</div>
					<div class="ts-input is-solid">
						<div class="ts-box" id="code" style="font-size:.8rem; height: 5rem; overflow-y: scroll; font-family: monospace;" @click="copyCode()"><div class="ts-content">{{ scriptableCode }}</div></div>
					</div>
					<br>
					<h2 class="ts-header is-large" style="display:inline;">3. 開啟 Scriptable，按&nbsp;<span class="ts-icon is-circle-plus-icon"></span>，貼上程式碼，按&nbsp;<span>Done</span></h2>
					<h2 class="ts-header is-large">4. 在桌面新增小工具，選擇 Scriptable</h2>
					<h2 class="ts-header is-large">5. 長按小工具 > 編輯小工具，Script 設定成你剛剛新增的專案</h2>
					還是看不懂的話就看一下<a href="https://www.youtube.com/watch?v=QUG2U66lzOM" target="_blank">影片</a>吧～
				</div>
			</div>
		</dialog>
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

#widgetDialog span {
	color: var(--ts-primary-500)
}

@media (max-width: 768px) {
}
</style>
<script>
export default {
	/*
	To-do:
	- Theme
	*/
	async asyncData({ $axios, params, payload }) {
		
	},
	head() {
		return {
			title: '個人課表 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '個人課表 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$route.params.id },
			]
		}
	},
	data() {
		return {
			time_section_full: ['1', '2', '3', '4', '4.5', '5', '6', '7', '8', '8.5', '9', '10', '11', '12'],
			showMobileSidebar: false,
			loading: true,
			
			maxEndSection: 8,
			savedCourses: [],
			myCourses: [],
			gridCells: [],

			newName: '',
			newClassroom: '',
			newDay: -1,
			newStart: -1,
			newEnd: -1,
			action: null,

			showColTitle: true,
			showRowTitle: true,
			showColLine: true,
			showRowLine: true,
			showCourseClassroom: true,
			showCourseTime: true,
			ctx: null,
			
			scriptableCodeFile: '',
			tableBorder: 0,
		}
	},
	computed: {
		time_section() {
			let time_section = ['1', '2', '3', '4', '5', '6', '7', '8'];
			this.myCourses.forEach(course => {
				if(course.time[0] > 5) return;
				let _section = course.time[1].split('~');
				time_section.push(_section[0]);
				if(_section[0] != _section[1]) {
					for(let s = this.time_section_full.indexOf(_section[0]); s <= this.time_section_full.indexOf(_section[1]); s++) {
						time_section.push(this.time_section_full[s]);
					}
				}
			});
			time_section = time_section.filter((section, index) => time_section.indexOf(section) === index).map(section => parseFloat(section)).sort(function(a, b) {return a - b})
			return time_section;
		},
		week_text() {
			return ['一', '二', '三', '四', '五'];
		},
		used_secion(){
			let used_secion = {1:[], 2:[], 3:[], 4:[], 5:[]};
			this.myCourses.forEach(course => {
				if(course.time[0] > 5) return;
				let _section = course.time[1].split('~');
				used_secion[course.time[0]].push(_section[0]);
				if(_section[0] != _section[1]) {
					for(let s = this.time_section_full.indexOf(_section[0]); s <= this.time_section_full.indexOf(_section[1]); s++) {
						used_secion[course.time[0]].push(this.time_section_full[s]);
					}
				}
			});
			return used_secion;
		},
		isIos() {
			if (typeof navigator !== "undefined") {
				return /iPhone|iPad|iPod/i.test(navigator.userAgent);
			}
			return false;
		},
		scriptableCode() {
			let courses = {1:[], 2:[], 3:[], 4:[], 5:[]};
			this.myCourses.forEach(course => {
				courses[course.time[0]].push({
					n: course.name,
					c: course.classroom,
					s: course.time[1].split('~')[0],
					p: course.time[1].replace('~','-')
				});
			});
			return this.scriptableCodeFile.replace('__DATA__', encodeURIComponent(JSON.stringify(courses || [])));
		},
	},
	methods: {
		async loadFonts() {
			await document.fonts.load('14px "Noto Sans TC"');
		},

		showWidget() {
			document.getElementById('widgetDialog').showModal();
		},

		copyCode() {
			const code = document.getElementById('code');
			const range = document.createRange();
			range.selectNode(code);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
			this.$swal({
				title: '已複製程式碼', icon: 'success', toast: true,
				timer: 3000, timerProgressBar: true,
				position: 'bottom-start', showConfirmButton: false,
			});
		},

		checkSection() {
			if(this.newStart > this.newEnd) {
				this.newEnd = this.newStart;
			}
		},

		clearAll() {
			this.$swal({
				icon: 'question',
				title: '確定要清除個人課表嗎？',
				confirmButtonText: '確定',
				cancelButtonText: '取消',
				showCancelButton: true,
			})
			.then((res) => {
				if (res.isConfirmed) {
					this.myCourses = [];
					this.drawTimetable();
				}
			});
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
				} catch (e) {}
			}
			let success = 0, fail = 0;
			data.course.forEach(course => {
				if(savedCourse.includes(course.id)) {
					course.time.forEach(time => {
						if(time[1].includes('0.5')) return;
						// 檢查是否衝堂
						let isConflict = false;	
						for(let s = this.time_section_full.indexOf(time[1].split('~')[0]); s <= this.time_section_full.indexOf(time[1].split('~')[1]); s++) {
							if(this.used_secion[time[0]].includes(this.time_section_full[s])) {
								isConflict = true;
								break;
							}
						}
						if(!isConflict) {
							this.myCourses.push({
								name: course.name.split('(')[0],
								classroom: course.classroom,
								id: course.id,
								time: time,
							});
							success++;
						} else {
							fail++;
						}
					});
				}
			});
			let alertText = [];
			if(success > 0) alertText.push(`已匯入 ${success} 門課程`);
			if(fail > 0) alertText.push(`有 ${fail} 門課程因衝堂無法匯入`);
			if(alertText.length > 0) {
				this.$swal({
					title: alertText.join('，'), icon: fail == 0 ? 'success' : 'warning', toast: true,
					timer: 3000, timerProgressBar: true,
					position: 'bottom-start', showConfirmButton: false,
				});
			}
			if(success > 0) {
				this.sortCourse();
				this.drawTimetable();
			}
		},

		setCanvasSize() {
			const canvas = document.getElementById('timetableCanvas');
			this.ctx = canvas.getContext('2d');
			const maxWidth = window.innerWidth - 45;
			const maxHeight = window.innerHeight - 170;
			let width = maxWidth;
			let height = maxWidth * 16 / 9;
			if (height > maxHeight) {
				height = maxHeight;
				width = maxHeight * 9 / 16;
			}
			canvas.width = 1080;
			canvas.height = 1920;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			this.drawTimetable();
		},

		drawTimetable() {
			localStorage.myCourses = JSON.stringify(this.myCourses);
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
				const tableBorder = this.canvas._tableBorder;
				for (let text of texts) {
					if (index == 0) {
						ctx.font = (32 - tableBorder * 0.05) + 'px Noto Sans TC';
						ctx.fillStyle = '#444';
						ctx.textAlign = 'left';
						ctx.textBaseline = 'middle';
					} else {
						ctx.font = (24 - tableBorder * 0.05) + 'px Noto Sans TC';
						ctx.fillStyle = '#666';
						ctx.textAlign = 'left';
						ctx.textBaseline = 'middle';
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
							y += lineHeight - tableBorder * 0.05;
						} else {
							line = testLine;
						}
					}
					context.fillText(line, x, y);
					y += lineHeight - tableBorder * 0.05;
					index++;
				}
			};

			const rows = this.time_section.length;
			const cols = this.week_text.length;
			const ctx = this.ctx;
			
			ctx.canvas._tableBorder = this.tableBorder;

			const colTitleHeight = this.showColTitle ? (ctx.canvas.height - this.tableBorder * 2) * 0.035 : 0;
			const cellHeight = (this.showColTitle ? 0.965 : 1) * (ctx.canvas.height - this.tableBorder * 2) / rows;
			const rowTitleWidth = this.showRowTitle ? (ctx.canvas.width - this.tableBorder * 2) * 0.05 : 0;
			const cellWidth = (this.showRowTitle ? 0.95 : 1) * (ctx.canvas.width - this.tableBorder * 2) / cols;

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.fillStyle = '#FFF';
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			ctx.translate(this.tableBorder, this.tableBorder);

			ctx.strokeStyle = '#DDD';
			this.gridCells = [];

			for (let i = 0; i <= rows; i++) {
				if (this.showRowLine && i < rows) {
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(0, i * cellHeight + colTitleHeight);
					ctx.lineTo(ctx.canvas.width - this.tableBorder * 2, i * cellHeight + colTitleHeight);
					ctx.stroke();
				}
				if (this.showRowTitle && i < rows) {
					ctx.font = (String(this.time_section[i]).includes('.5') ? 26 : 36) + 'px Noto Sans TC';
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
					ctx.lineTo(j * cellWidth + rowTitleWidth, ctx.canvas.height - this.tableBorder * 2);
					ctx.stroke();
				}
				if (this.showColTitle && j < cols) {
					ctx.font = '32px Noto Sans TC';
					ctx.fillStyle = '#999';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(this.week_text[j], j * cellWidth + cellWidth / 2 + rowTitleWidth, colTitleHeight / 2);
				}
			}

			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					const x = j * cellWidth + rowTitleWidth;
					const y = i * cellHeight + colTitleHeight;

					this.gridCells.push({
						row: i,
						col: j,
						x: x,
						y: y,
						width: cellWidth,
						height: cellHeight,
					});
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
				const start = this.time_section.indexOf(parseFloat(course.time[1].split('~')[0]))+1;
				const end = this.time_section.indexOf(parseFloat(course.time[1].split('~')[1]))+1;
				if (isNaN(start) || isNaN(end)) return;
				const day = parseFloat(course.time[0]);
				if (isNaN(start) || isNaN(end) || isNaN(day)) return;

				const x = (day - 1) * cellWidth + rowTitleWidth;
				const y = (start - 1) * cellHeight + colTitleHeight;
				const w = cellWidth;
				const h = (end - start + 1) * cellHeight;

				let courseNameList = this.myCourses.map(course => course.name);
				courseNameList = courseNameList.filter((name, index) => courseNameList.indexOf(name) === index);
				ctx.fillStyle  = ['#F8BBD0','#FFCDD2','#FFE0B2','#FFF9C4','#F0F4C3','#C8E6C9','#B2EBF2','#BBDEFB','#C5CAE9','#D1C4E9','#D7CCC8'][courseNameList.indexOf(course.name) % 11];
				ctx.drawRoundedRect(x + 8, y + 8, w - 16, h - 16, cellWidth / 20);
				let texts = [course.name];
				if (this.showCourseTime) {
					texts.push(timeInfo[course.time[1].split('~')[0]][0] + ' ~ ' + timeInfo[course.time[1].split('~')[1]][1]);
				}
				if (this.showCourseClassroom) {
					texts.push(course.classroom);
				}
				ctx.wrapText(ctx, texts, x + 20, y + 35, cellWidth - 35, 38);
			});
			ctx.translate(-this.tableBorder, -this.tableBorder);
		},

		downloadImage() {
			const canvas = document.getElementById('timetableCanvas');
			canvas.toBlob((blob) => {
				const link = document.createElement('a');
				link.download = '課表.png';
				link.href = URL.createObjectURL(blob);
				link.click();
				URL.revokeObjectURL(link.href);
			}, 'image/png');
		},

		getGridCellAtPosition(x, y) {
			const canvas = document.getElementById('timetableCanvas');
			const rect = canvas.getBoundingClientRect();
			const scaleX = canvas.width / rect.width;
			const scaleY = canvas.height / rect.height;
			x = x * scaleX - this.tableBorder;
			y = y * scaleY - this.tableBorder;
			return this.gridCells.find(cell => 
				x >= cell.x &&
				x <= cell.x + cell.width &&
				y >= cell.y &&
				y <= cell.y + cell.height
			); 
		},

		clickCell(col, row) {
			if(col == -1 && row == -1) {
				this.newName = '';
				this.newClassroom = '';
				this.newDay = -1;
				this.newStart = -1;
				this.newEnd = -1;
				this.action = 'new';
			}
			else if(!this.used_secion[col+1].includes(String(this.time_section[row]))) {
				this.newName = '';
				this.newClassroom = '';
				this.newDay = col;
				this.newStart = this.time_section[row];
				this.newEnd = this.time_section[row];
				this.action = 'new';
			}
			else {
				let courseInSection = null;
				this.myCourses.forEach(course => {
					course.editing = false;
				});
				this.myCourses.forEach(course => {
					if(courseInSection) return;
					if(course.time[0] === String(col+1)) {
						let _section = course.time[1].split('~');
						for(let s = this.time_section_full.indexOf(String(_section[0])); s <= this.time_section_full.indexOf(String(_section[1])); s++) {
							if(this.time_section_full[s] === String(this.time_section[row])) {
								courseInSection = course;
								course.editing = true;
								return;
							}
						}
					}
				});
				if(courseInSection) {
					this.newName = courseInSection.name;
					this.newClassroom = courseInSection.classroom;
					this.newDay = col;
					this.newStart = courseInSection.time[1].split('~')[0];
					this.newEnd = courseInSection.time[1].split('~')[1];
					this.action = 'edit';
				}
			}
			document.getElementById('newCourseDialog').showModal();
		},

		closeDialog() {
			this.newName = '';
			this.newClassroom = '';
			this.newDay = -1;
			this.newStart = -1;
			this.newEnd = -1;
			this.action = null;
			document.getElementById('newCourseDialog').close();
			document.getElementById('widgetDialog').close();
		},

		newCourse() {
			if(!this.newName) {
				this.$swal({
					title: '請輸入課程名稱', icon: 'error', toast: true,
					timer: 3000, timerProgressBar: true,
					position: 'bottom-start', showConfirmButton: false,
				});
				return;
			}
			if(this.newDay === -1) {
				this.$swal({
					title: '請選擇星期', icon: 'error', toast: true,
					timer: 3000, timerProgressBar: true,
					position: 'bottom-start', showConfirmButton: false,
				});
				return;
			}
			if(this.newStart === -1 || this.newEnd === -1) {
				this.$swal({
					title: '請選擇節次', icon: 'error', toast: true,
					timer: 3000, timerProgressBar: true,
					position: 'bottom-start', showConfirmButton: false,
				});
				return;
			}
			if(this.action === 'edit') {
				this.myCourses.forEach(course => {
					if(course.editing) {
						course.name = this.newName;
						course.classroom = this.newClassroom;
						course.time[0] = (this.newDay + 1).toString();
						course.time[1] = this.newStart + '~' + this.newEnd;
						this.sortCourse();
						this.drawTimetable();
						document.getElementById('newCourseDialog').close();
						return;
					}
				});
				return;
			}
			for(let s = this.time_section_full.indexOf(String(this.newStart)); s <= this.time_section_full.indexOf(String(this.newEnd)); s++) {
				if(this.used_secion[this.newDay+1].includes(this.time_section_full[s])) {
					this.$swal({
						title: '這個時段已經有別的課程了！', icon: 'error', toast: true,
						timer: 3000, timerProgressBar: true,
						position: 'bottom-start', showConfirmButton: false,
					});
					return;
				}
			}

			const newCourse = {
				name: this.newName,
				classroom: this.newClassroom,
				time: [
					(this.newDay + 1).toString(),
					this.newStart + '~' + this.newEnd
				]
			};
			this.myCourses.push(newCourse);
			this.sortCourse();
			this.drawTimetable();
			document.getElementById('newCourseDialog').close();
		},

		sortCourse() {
			this.myCourses.sort((a, b) => {
				if (a.time[0] === b.time[0]) {
					return parseFloat(a.time[1].split('~')[0], 10) - parseFloat(b.time[1].split('~')[0], 10);
				}
				return parseFloat(a.time[0], 10) - parseFloat(b.time[0], 10);
			});
		},
	},
	mounted() {
		this.$axios.get('/scriptable.js?_=' + new Date().getTime()).then(res => {
			this.scriptableCodeFile = res.data;
		});
		try {
			this.myCourses = JSON.parse(localStorage.myCourses);
		} catch (e) {

		}
		this.loadFonts().then(() => {
			this.setCanvasSize();
			window.addEventListener('resize', this.setCanvasSize());
			const canvas = document.getElementById('timetableCanvas');
			canvas.addEventListener('click', (e) => {
				const rect = canvas.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				const cell = this.getGridCellAtPosition(x, y);
				if (cell) {
					this.clickCell(cell.col, cell.row);
				}
			});
		});
		document.getElementById('newCourseDialog').addEventListener('click', (e) => {
			if (e.target.tagName === 'DIALOG') {
				document.getElementById('newCourseDialog').close();
			}
		});
		document.getElementById('widgetDialog').addEventListener('click', (e) => {
			if (e.target.tagName === 'DIALOG') {
				document.getElementById('widgetDialog').close();
			}
		});
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.setCanvasSize());
	},
}
</script>