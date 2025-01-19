<template>
	<div class="cell is-scrollable is-fluid is-horizontal" id="page-my">
		<div class="cell is-tertiary is-scrollable sidebar" :class="{ 'show': showMobileSidebar }">
			<div class="ts-content">
				<div class="ts-wrap is-vertical has-top-padded is-relaxed">
					<button class="ts-close is-large mobile-only close-sidebar"
						@click="showMobileSidebar = !showMobileSidebar"></button>
					<div>
						<div class="ts-text is-label has-bottom-padded-small">我的課程</div>
						<div class="ts-wrap is-dense">
							<button class="ts-button is-outlined is-small is-fluid is-start-icon" @click="showImportDialog()">
								<span class="ts-icon is-file-import-icon"></span>
								從學校系統匯入
							</button>
							<button class="ts-button is-outlined is-small is-fluid is-start-icon" @click="importFromSaved()" v-show="savedCourses.length > 0">
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
					
					<div>
						<div class="ts-text is-label has-bottom-padded-small">顏色主題</div>
						<div class="ts-select is-fluid">
							<select v-model="myCoursesSetting.theme" @change="updateTimetable(false)">
								<option v-for="theme of themes" :value="theme.id">{{ theme.name }}</option>
							</select>
						</div>
					</div>

					<!--
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
								<input type="checkbox" v-model="myCoursesSetting.showRowLine" @change="updateTimetable(false)" />
								水平格線
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="myCoursesSetting.showColLine" @change="updateTimetable(false)" />
								垂直格線
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="myCoursesSetting.showRowTitle" @change="updateTimetable(false)" />
								節次
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="myCoursesSetting.showColTitle" @change="updateTimetable(false)" />
								星期
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="myCoursesSetting.showCourseClassroom" @change="updateTimetable(false)" />
								課程：上課地點
							</label>
							<label class="ts-checkbox">
								<input type="checkbox" v-model="myCoursesSetting.showCourseTime" @change="updateTimetable(false)" />
								課程：上課時間
							</label>
						</div>
					</div>

					<div>
						<div class="ts-text is-label has-bottom-padded-small">外框寬度 <small>({{ Math.round(myCoursesSetting.tableBorder/128*1000)/10 }}%)</small></div>
						<div class="ts-range">
							<input type="range" min="0" max="128" v-model="myCoursesSetting.tableBorder" @change="updateTimetable(false)" style="width:100%" />
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
							<div class="item">這裡是用來製作個人課表的，「收藏的課程」若有修改，這裡不會同步！</div>
							<div class="item">點擊空白處可新增課程</div>
							<div class="item">點擊課程可修改資訊</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="cell is-secondary is-fluid is-scrollable main" style="min-height:100%">
			<profile mobile-only="true"></profile>
			<div class="ts-container mobile-only">
				<div class="ts-box has-bottom-spaced has-top-spaced-large">
					<div class="ts-content">
						<div class="ts-text is-description">
							<span class="ts-badge has-bottom-spaced-small is-small is-dense">提示</span>
							<div class="ts-list is-small is-unordered">
								<div class="item">這裡是用來製作個人課表的，「收藏的課程」若有修改，這裡不會同步！</div>
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
			<div class="ts-container has-top-padded has-bottom-padded is-fitted">
				<div class="timetable-container" id="timetable-container">
					<div class="ts-box" :style="{backgroundColor: this.themes.filter(theme => theme.id === this.myCoursesSetting.theme)[0].backgroundColor}">
						<canvas id="timetableCanvas" v-show="!loading"></canvas>
					</div>
				</div>
				<div class="ts-box ad is-hollowed box-mobile-spaced has-top-spaced-large"
				v-if="!loading && showAd" style="border:4px dashed var(--ts-gray-300)!important"
				:style="{width: adWidth > 280 ? (adWidth+'px') : 'calc(100% - 2rem)'}"
				:class="{fixed: adWidth > 280}"
				>
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
			<div class="ts-mask" v-show="showMobileSidebar" @click="showMobileSidebar = !showMobileSidebar"></div>
		</div>
		<dialog class="ts-modal is-large" id="editCourseDialog">
			<div class="content">
				<div class="ts-content">
					<div class="ts-grid">
						<div class="column is-fluid">
							<div class="ts-header">{{ editingAction === 'new' ? '新增課程' : '修改課程' }}</div>
						</div>
						<div class="column">
							<button class="ts-close is-large is-secondary" @click="closeDialog()"></button>
						</div>
					</div>
				</div>
				<div class="ts-divider"></div>
				<div class="ts-content" v-if="editingCourse">
					<NuxtLink
					target="_blank"
					:to="`/course/${editingCourse.id.substring(0, 4)}/${editingCourse.id.substring(4, 8)}/${editingCourse.id.substring(8)}/`"
					class="ts-button is-fluid is-secondary is-start-icon has-bottom-spaced-large"
					v-if="editingCourse.id && editingCourse.id.length == 12 && editingCourse.originalName == editingCourse.name && !editingCourse.id.includes('ALT')">
						<span class="ts-icon is-list-check-icon"></span>
						查看課程詳細資料
					</NuxtLink>
					<div class="ts-box is-start-indicated has-bottom-spaced-large" v-if="message" :class="{'is-negative': message[0] === 'error'}">
						<div class="ts-content"><div class="ts-header">{{ message[1] }}</div></div>
						<div class="symbol"><span class="ts-icon is-circle-exclamation-icon"></span></div>
					</div>
					<div class="ts-text is-label has-bottom-padded-small is-required">上課時間</div>
					<div class="ts-grid is-middle-aligned">
						<div class="column is-5-wide">
							<div class="ts-select is-fluid">
								<select v-model="editingCourse.day">
									<option value="-1" disabled>請選擇星期...</option>
									<option v-for="(w, i) of ['一','二','三','四','五']" :value="i">星期{{ w }}</option>
								</select>
							</div>
						</div>
						<div class="column is-5-wide">
							<div class="ts-select is-fluid">
								<select v-model="editingCourse.start" @change="checkSection()">
									<option value="-1" disabled>請選擇起始節次</option>
									<option v-for="section of time_section_full" :value="section">第 {{ section }} 節</option>
								</select>
							</div>
						</div>
						<div class="column is-1-wide" style="text-align: center">
						~
						</div>
						<div class="column is-5-wide">
							<div class="ts-select is-fluid">
								<select v-model="editingCourse.end">
									<option value="-1" disabled>請選擇結束節次</option>
									<option v-for="section of time_section_full" :value="section" :disabled="parseFloat(section) < editingCourse.start">第 {{ section }} 節</option>
								</select>
							</div>
						</div>
					</div>
					<br>
					<div class="ts-text is-label has-bottom-padded-small is-required">課程名稱</div>
					<div class="ts-input is-fluid">
						<input type="text" v-model.trim="editingCourse.name">
					</div>
					<br>
					<div class="ts-text is-label has-bottom-padded-small">上課地點</div>
					<div class="ts-input is-fluid">
						<input type="text" v-model.trim="editingCourse.classroom">
					</div>
					<br>
					<button class="ts-button is-fluid" @click="editCourse()">{{ editingAction === 'new' ? '新增' : '修改' }}</button>
					<button class="ts-button is-negative is-outlined is-fluid has-top-spaced-small" @click="deleteCourse()" v-show="editingAction === 'edit'">刪除</button>
				</div>
			</div>
		</dialog>
		<dialog class="ts-modal is-big" id="widgetDialog">
			<div class="content">
				<div class="ts-content">
					<div class="ts-grid">
						<div class="column is-fluid">
							<div class="ts-header">安裝 iOS 小工具</div>
							<div class="ts-text is-description">可以讓你在桌面或鎖定畫面上看到下一堂是什麼課，點擊還可以查看課程詳細資料！</div>
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
					<h2 class="ts-header is-large">2. 挑選喜歡的顏色</h2>
					<div class="ts-grid">
						<div class="column is-8-wide">
							<div class="ts-text is-label has-bottom-spaced-small">背景顏色</div>
							<div class="ts-input">
								<input type="color" v-model="widgetBackgroundColor">
							</div>
						</div>
						<div class="column is-8-wide">
							<div class="ts-text is-label has-bottom-spaced-small">文字顏色</div>
							<div class="ts-input">
								<input type="color" v-model="widgetColor">
							</div>
						</div>
					</div>
					<h2 class="ts-header is-large" style="margin-bottom:0;">3. 複製以下程式碼</h2>
					<div class="ts-text is-description">
						課程每次修改後須重新更改一次程式碼<br>
						{{ message ? message[1] : '點選下方區塊即可複製' }}
					</div>
					<div class="ts-input is-solid">
						<div class="ts-box" id="code0" style="font-size:.8rem; height: 5rem; overflow-y: scroll; font-family: monospace;" @click="copyCode(0)"><div class="ts-content">{{ scriptableCode }}</div></div>
					</div>
					<br>
					<h2 class="ts-header is-large" style="display:inline;">4. 開啟 Scriptable，按&nbsp;<span class="ts-icon is-circle-plus-icon"></span>，貼上程式碼，按&nbsp;<span>Done</span></h2>
					<h2 class="ts-header is-large">5. 在桌面新增小工具，選擇 Scriptable</h2>
					<h2 class="ts-header is-large">6. 長按小工具 > 編輯小工具，Script 設定成你剛剛新增的專案</h2>
					<div class="ts-text is-description">
						還是看不懂的話就看一下<a href="https://www.youtube.com/watch?v=QUG2U66lzOM" target="_blank">影片</a>吧～
					</div>
				</div>
			</div>
		</dialog>
		<dialog class="ts-modal is-large" id="importDialog">
			<div class="content">
				<div class="ts-content">
					<div class="ts-grid">
						<div class="column is-fluid">
							<div class="ts-header">從學校系統匯入</div>
						</div>
						<div class="column">
							<button class="ts-close is-large is-secondary" @click="closeDialog()"></button>
						</div>
					</div>
				</div>
				<div class="ts-divider"></div>
				<div class="ts-content">
					<div class="ts-wrap is-vertical">
					<div>
							<h2 class="ts-header is-large" style="display:inline;">1. 請至<a href="https://portal.mcut.edu.tw/" target="_blank" rel="nofollow">校園入口網</a>，前往應用系統 > 學生資訊查詢系統</h2>
							<div class="ts-text is-description">請在手機或電腦的瀏覽器上執行，不要使用明志 App</div>
						</div>
						<div>
							<h2 class="ts-header is-large" style="display:inline;">2. 選擇課程查詢 > 課表查詢</h2>
						</div>
						<div>
							<h2 class="ts-header is-large" style="display:inline;">3. 看到自己的課表後，在瀏覽器網址列把所有網址刪掉後，貼上以下程式碼：</h2>
							<div class="ts-text is-description">
								{{ message ? message[1] : '點選下方區塊即可複製' }}
							</div>
							<div class="ts-input is-solid">
								<div class="ts-box" id="code1" style="font-size:.8rem; height: 5rem; overflow-y: scroll; font-family: monospace;" @click="copyCode(1)"><div class="ts-content">(()=>{let e=document.querySelectorAll('[role="row"]');if(!e||0===e.length){alert("沒有找到任何課程，請確認頁面是否正確！");return}let t=[];e.forEach(e=>{let l=[];e.querySelectorAll('[role="gridcell"]').forEach(e=>{l.push(e.textContent.trim()),e.querySelector("a")&&l.push(e.querySelector("a").href.split("cid=")[1].split("&")[0])}),l.length>0&&t.push(l)});let l=encodeURIComponent(JSON.stringify(t));window.open(`https://mcut-course.com/my?import=${l}`)})();</div></div>
							</div>
						</div>
						<div>
							<h2 class="ts-header is-large" style="display:inline;">4. <span class="ts-badge is-end-spaced is-negative">重要!</span>在最前面加上 <span class="ts-text is-code" style="font-family: monospace;">javascript:</span></h2>
							<div class="ts-text is-description">請自行輸入，用複製貼上的話可能會失敗</div>
						</div>
						<div>
							<h2 class="ts-header is-large" style="display:inline;">5. 按下 Enter/送出後，課表就會匯入了！</h2>
							<div class="ts-text is-description">
								如果看到 <span class="ts-icon is-magnifying-glass-icon"></span> 和 <span class="ts-icon is-earth-asia-icon"></span> 兩個選項，請選擇 <span class="ts-icon is-earth-asia-icon"></span> 那一個。如果只有 <span class="ts-icon is-magnifying-glass-icon"></span>，請重新檢查是否輸入正確！
							</div>
							<img src="https://i.imgur.com/ZKRQvC7.jpeg" style="width:100%;">
						</div>
					</div>
				</div>
			</div>
		</dialog>
		<loading v-show="loading || loading_get" />
	</div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400&display=swap');
.timetable-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.timetable-container > .ts-box {
	border-radius: var(--ts-border-radius-container);
}

#widgetDialog span {
	color: var(--ts-primary-500)
}

.compare-course {
	margin-top: .25rem;
	font-size: .8rem;
}

.compare .ts-box .ts-content.is-secondary {
	font-size: .6rem;
}

.compare .ts-box small {
	font-size: .7rem;
	opacity: .7;
}

#page-my .ad.fixed {
	position: fixed;
	width: 350px;
	height: 350px;
	right: 50px;
	top: calc(50% - 150px);
}

@media (max-width: 767.98px) {
}
</style>
<script>
import { mapState } from 'vuex'
export default {
	async asyncData({ $axios, params, payload }) {
		
	},
	head() {
		return {
			title: '我的課表 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '我的課表 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	data() {
		return {
			adWidth: null,
			profileName: null,
			profileImage: null,
			time_section_full: ['1', '2', '3', '4', '4.5', '5', '6', '7', '8', '8.5', '9', '10', '11', '12'],
			showMobileSidebar: false,
			loading: true,
			loading_get: false,
			
			maxEndSection: 8,
			savedCourses: [],
			myCourses: [],
			gridCells: [],

			editingCourse: null,
			editingAction: null,
			defaultCourse: {
				id: '',
				name: '',
				classroom: '',
				start: -1,
				end: -1,
				day: -1,
			},

			myCoursesSetting: {
				showColTitle: true,
				showRowTitle: true,
				showColLine: true,
				showRowLine: true,
				showCourseClassroom: true,
				showCourseTime: true,
				tableBorder: 32,
				theme: 1,
			},
			ctx: null,
			scriptableCodeFile: '',
			message: null,
			messageTimer: null,

			widgetBackgroundColor: '#34495e',
			widgetColor: '#ffffff',

			themes: [
				{
					id: 1,
					name: '彩色',
					backgroundColor: '#FFF',
					courseColor: ['#F8BBD0','#FFCDD2','#FFE0B2','#FFF9C4','#F0F4C3','#C8E6C9','#B2EBF2','#BBDEFB','#C5CAE9','#D1C4E9','#D7CCC8','#DDD'],
					titleColor: '#333',
					textColor: '#666',
					borderColor: '#DDD',
					colTitleColor: '#999'
				},
				{
					id: 2,
					name: '彩色（深色模式）',
					backgroundColor: '#333',
					courseColor: ['#C0392B','#E74C3C','#E67E22','#F9A825','#2ECC71','#27AE60','#1ABC9C','#3498DB','#2980B9','#8E44AD','#6D4C41','#444'],
					titleColor: '#FFF',
					textColor: '#F2F2F2',
					borderColor: '#555',
					colTitleColor: '#BBB'
				},
				{
					id: 3,
					name: '黑白',
					courseColor: ['#DDD'],
					backgroundColor: '#FFF',
					titleColor: '#333',
					textColor: '#666',
					borderColor: '#DDD',
					colTitleColor: '#999'
				},
				{
					id: 4,
					name: '黑白（深色模式）',
					courseColor: ['#444'],
					backgroundColor: '#333',
					titleColor: '#FFF',
					textColor: '#F2F2F2',
					borderColor: '#555',
					colTitleColor: '#BBB'
				},
			]
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
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
			time_section = time_section.filter((section, index) => time_section.indexOf(section) === index).map(section => parseFloat(section)).sort(function(a, b) {return a - b});
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
					p: course.time[1].replace('~','-'),
					i: (course.name == course.originalName && course.id.length == 12 && !course.id.includes('ALT')) ? course.id : '',
				});
			});
			return `const color=["${this.widgetBackgroundColor.replace('#','')}","${this.widgetColor.replace('#','')}"];` +
			this.scriptableCodeFile.replace('__DATA__', encodeURIComponent(JSON.stringify(courses || [])));
		},
	},
	methods: {
		async loadFonts() {
			await document.fonts.load('14px "Noto Sans TC"');
		},

		showWidget() {
			this.message = null;
			document.getElementById('widgetDialog').showModal();
		},

		copyCode(id) {
			const code = document.getElementById('code' + id);
			const range = document.createRange();
			range.selectNode(code);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
			this.message = [
				'success',
				'程式碼已複製！',
			];
			if(this.messageTimer) clearTimeout(this.messageTimer);
			this.messageTimer = setTimeout(() => {
				this.message = null;
			}, 3000);
		},

		checkSection() {
			if(parseFloat(this.editingCourse.start) > parseFloat(this.editingCourse.end)) {
				this.editingCourse.end = this.editingCourse.start;
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
					this.updateTimetable();
				}
			});
		},

		importFromUrl() {
			const json = JSON.parse(decodeURIComponent(this.$route.query.import));
			let data = [];
			json.forEach(course => {
				if(course[1].trim().length == 6) {
					if(course[2].trim().length != 1 || parseInt(course[2]) > 5) return;
					if(!course[3].includes('.') || !course[4].includes('.') || Number.isNaN(parseFloat(course[3])) || Number.isNaN(parseFloat(course[4]))) return;
					data.push({
						name: course[0],
						classroom: course[5],
						time: [course[2], course[3].replace('.0', '') + '~' + course[4].replace('.0', '')],
						id: ''
					});
				} else if (course[1].trim().length == 12) {
					if(course[3].trim().length != 1 || parseInt(course[3]) > 5) return;
					if(!course[4].includes('.') || !course[5].includes('.') || Number.isNaN(parseFloat(course[4])) || Number.isNaN(parseFloat(course[5])))  return;
					data.push({
						name: course[0],
						originalName: course[0],
						classroom: course[6],
						time: [course[3], course[4].replace('.0', '') + '~' + course[5].replace('.0', '')],
						id: course[1]
					});
				}
			});

			let success = 0, fail = 0;
			data.forEach(course => {
				let time = course.time;
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
						originalName: course.name.split('(')[0],
						classroom: course.classroom,
						id: course.id,
						time: time,
					});
					success++;
				} else {
					fail++;
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
				this.updateTimetable();
			}
			this.$router.replace({ query: {} });
		},

		async importFromSaved() {
			this.loading = true;
			const savedCourse = this.savedCourses;
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
								originalName: course.name.split('(')[0],
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
				this.updateTimetable();
			}
			this.loading = false;
		},

		setCanvasSize() {
			this.loading = false;
			const canvas = document.getElementById('timetableCanvas');
			this.ctx = canvas.getContext('2d');
			let width, height;
			if (window.innerHeight > window.innerWidth) {
				width = window.innerWidth - 28;
				height = width * 16 / 9;
			} else {
				height = window.innerHeight - 130;
				width = height * 9 / 16;
			}
			canvas.width = 1080;
			canvas.height = 1920;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			this.adWidth = (document.querySelector('.cell.main').clientWidth - width) / 2 - 100;
			this.updateTimetable(false);
		},

		updateTimetable(sync = true) {
			this.myCourses = this.myCourses.map(course => {
				delete course.editing;
				delete course.isSame;
				return course;
			});
			if(sync && localStorage.auth_key) {
				this.$axios.post('https://api.mcut-course.com/user/?action=update',
					'my=' + encodeURIComponent(JSON.stringify(this.myCourses)),
					{ headers: { 'Content-Type': 'application/x-www-form-urlencoded', authorization: localStorage['auth_key'] } }
				)
				.then(res => {
					localStorage['myCourseSync'] = res.data.updatedAt;
				})
				.catch((err) => {
					localStorage['auth_key'] = '';
					localStorage['profile_image'] = '';
					location.reload();
				});;
			}
			localStorage.myCourses = JSON.stringify(this.myCourses);
			localStorage.myCoursesSetting = JSON.stringify(this.myCoursesSetting);
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
			CanvasRenderingContext2D.prototype.wrapText = function (context, texts, x, y, maxWidth, lineHeight, theme) {
				let index = 0;
				const tableBorder = this.canvas._tableBorder;
				for (let text of texts) {
					if (index == 0) {
						ctx.font = (32 - tableBorder * 0.05) + 'px Noto Sans TC';
						ctx.fillStyle = theme.titleColor;
						ctx.textAlign = 'left';
						ctx.textBaseline = 'middle';
					} else {
						ctx.font = (24 - tableBorder * 0.05) + 'px Noto Sans TC';
						ctx.fillStyle = theme.textColor;
						ctx.textAlign = 'left';
						ctx.textBaseline = 'middle';
					}
					const words = (text || '').split('');
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

			let theme = this.themes.filter(theme => theme.id === this.myCoursesSetting.theme)[0];
			const rows = this.time_section.length;
			const cols = this.week_text.length;
			const ctx = this.ctx;
			
			ctx.canvas._tableBorder = this.myCoursesSetting.tableBorder || 32;

			const colTitleHeight = this.myCoursesSetting.showColTitle ? (ctx.canvas.height - this.myCoursesSetting.tableBorder * 2) * 0.035 : 0;
			const cellHeight = (this.myCoursesSetting.showColTitle ? 0.965 : 1) * (ctx.canvas.height - this.myCoursesSetting.tableBorder * 2) / rows;
			const rowTitleWidth = this.myCoursesSetting.showRowTitle ? (ctx.canvas.width - this.myCoursesSetting.tableBorder * 2) * 0.05 : 0;
			const cellWidth = (this.myCoursesSetting.showRowTitle ? 0.95 : 1) * (ctx.canvas.width - this.myCoursesSetting.tableBorder * 2) / cols;

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.fillStyle = theme.backgroundColor;
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			ctx.translate(this.myCoursesSetting.tableBorder, this.myCoursesSetting.tableBorder);

			ctx.strokeStyle = theme.borderColor;
			this.gridCells = [];

			for (let i = 0; i <= rows; i++) {
				if (this.myCoursesSetting.showRowLine && i < rows) {
					if(this.myCoursesSetting.showColTitle || i != 0) {
						ctx.lineWidth = 2;
						ctx.beginPath();
						ctx.moveTo(0, i * cellHeight + colTitleHeight);
						ctx.lineTo(ctx.canvas.width - this.myCoursesSetting.tableBorder * 2, i * cellHeight + colTitleHeight);
						ctx.stroke();
					}
				}
				if (this.myCoursesSetting.showRowTitle && i < rows) {
					ctx.font = (String(this.time_section[i]).includes('.5') ? 26 : 30) + 'px Noto Sans TC';
					ctx.fillStyle = theme.colTitleColor;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(this.time_section[i], rowTitleWidth / 2, i * cellHeight + cellHeight / 2 + colTitleHeight);
				}
			}

			for (let j = 0; j <= cols; j++) {
				if (this.myCoursesSetting.showColLine && j < cols) {
					if(this.myCoursesSetting.showRowTitle || j != 0) {
						ctx.lineWidth = 2;
						ctx.beginPath();
						ctx.moveTo(j * cellWidth + rowTitleWidth, 0);
						ctx.lineTo(j * cellWidth + rowTitleWidth, ctx.canvas.height - this.myCoursesSetting.tableBorder * 2);
						ctx.stroke();
					}
				}
				if (this.myCoursesSetting.showColTitle && j < cols) {
					ctx.font = '32px Noto Sans TC';
					ctx.fillStyle = theme.colTitleColor;
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
				ctx.fillStyle = theme.courseColor[courseNameList.indexOf(course.name) % theme.courseColor.length];
				ctx.drawRoundedRect(x + 8, y + 8, w - 16, h - 16, cellWidth / 20);
				let texts = [course.name];
				if (this.myCoursesSetting.showCourseTime) {
					texts.push(timeInfo[course.time[1].split('~')[0]][0] + ' ~ ' + timeInfo[course.time[1].split('~')[1]][1]);
				}
				if (this.myCoursesSetting.showCourseClassroom) {
					texts.push(course.classroom);
				}
				ctx.wrapText(ctx, texts, x + 20, y + 35, cellWidth - 35, 38, theme);
			});
			ctx.translate(-this.myCoursesSetting.tableBorder, -this.myCoursesSetting.tableBorder);
		},

		downloadImage() {
			const canvas = document.getElementById('timetableCanvas');
			if(window.innerWidth > 768) {
				canvas.toBlob((blob) => {
					const link = document.createElement('a');
					link.download = '課表.png';
					link.href = URL.createObjectURL(blob);
					link.click();
					URL.revokeObjectURL(link.href);
				}, 'image/png');
			} else {
				this.$swal({
					title: '長按圖片即可下載',
					html: '<img style="width: 80%;" src="' + canvas.toDataURL('image/png') + '" alt="課表"/>',
					showConfirmButton: false,
					showCloseButton: true,
				});
			}
		},

		getGridCellAtPosition(x, y) {
			const canvas = document.getElementById('timetableCanvas');
			const rect = canvas.getBoundingClientRect();
			const scaleX = canvas.width / rect.width;
			const scaleY = canvas.height / rect.height;
			x = x * scaleX - this.myCoursesSetting.tableBorder;
			y = y * scaleY - this.myCoursesSetting.tableBorder;
			return this.gridCells.find(cell => 
				x >= cell.x &&
				x <= cell.x + cell.width &&
				y >= cell.y &&
				y <= cell.y + cell.height
			); 
		},

		clickCell(col, row) {
			this.myCourses.forEach(course => {
				course.editing = false;
			});
			if(col == -1 && row == -1) {
				this.editingCourse = Object.freeze(this.defaultCourse);
				this.editingAction = 'new';
			}
			else if(!this.used_secion[col+1].includes(String(this.time_section[row]))) {
				this.editingCourse = {
					id: '',
					name: '',
					classroom: '',
					day: col,
					start: row+1,
					end: row+1,
				};
				this.editingAction = 'new';
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
					this.editingCourse = {
						id: courseInSection.id || '',
						name: courseInSection.name,
						originalName: courseInSection.originalName,
						classroom: courseInSection.classroom,
						day: parseInt(courseInSection.time[0])-1,
						start: courseInSection.time[1].split('~')[0],
						end: courseInSection.time[1].split('~')[1],
					};
					this.editingAction = 'edit';
				}
			}
			document.getElementById('editCourseDialog').showModal();
		},

		showImportDialog() {
			document.getElementById('importDialog').showModal();
		},

		closeDialog() {
			this.editingCourse = Object.freeze(this.defaultCourse);
			this.editingAction = null;
			document.getElementById('editCourseDialog').close();
			document.getElementById('widgetDialog').close();
			document.getElementById('importDialog').close();
		},

		editCourse() {
			if(!this.editingCourse.name) {
				this.message = [
					'error',
					'請輸入課程名稱',
				];
				return;
			}
			if(this.editingCourse.day === -1) {
				this.message = [
					'error',
					'請選擇星期',
				];
				return;
			}
			if(this.editingCourse.start === -1 || this.editingCourse.end === -1) {
				this.message = [
					'error',
					'請選擇節次',
				];
				return;
			}
			let editingCourse = this.myCourses.find(course => course.editing) || null;
			let sections = [];
			if(this.editingAction === 'edit' && editingCourse) {
				for(let s = this.time_section_full.indexOf(String(editingCourse.time[1].split('~')[0])); s <= this.time_section_full.indexOf(String(editingCourse.time[1].split('~')[1])); s++) {
					sections.push(this.time_section_full[s]);
				}
			}

			for(let s = this.time_section_full.indexOf(String(this.editingCourse.start)); s <= this.time_section_full.indexOf(String(this.editingCourse.end)); s++) {
				if(
					this.used_secion[this.editingCourse.day+1].includes(this.time_section_full[s]) &&
					!sections.includes(this.time_section_full[s])
				) {
					this.message = [
						'error',
						'這個時段已經有別的課程了！',
					];
					return;
				}
			}

			if(editingCourse) {
				editingCourse.name = this.editingCourse.name;
				editingCourse.classroom = this.editingCourse.classroom;
				editingCourse.time[0] = (this.editingCourse.day + 1).toString();
				editingCourse.time[1] = this.editingCourse.start + '~' + this.editingCourse.end;
			} else {
				this.myCourses.push({
					id: '',
					name: this.editingCourse.name,
					classroom: this.editingCourse.classroom,
					time: [
						(this.editingCourse.day + 1).toString(),
						this.editingCourse.start + '~' + this.editingCourse.end
					]
				});
			}
			this.message = null;
			this.sortCourse();
			this.updateTimetable();
			document.getElementById('editCourseDialog').close();
		},

		deleteCourse() {
			let editingCourse = this.myCourses.find(course => course.editing) || null;
			if(editingCourse) {
				this.myCourses = this.myCourses.filter(course => course !== editingCourse);
				this.updateTimetable();
				document.getElementById('editCourseDialog').close();
			}
		},

		sortCourse() {
			this.myCourses.sort((a, b) => {
				if (a.time[0] === b.time[0]) {
					return parseFloat(a.time[1].split('~')[0]) - parseFloat(b.time[1].split('~')[0]);
				}
				return parseFloat(a.time[0]) - parseFloat(b.time[0]);
			});
		},

		compareCourse(data) {
			let local = Object.freeze(this.myCourses);
			let online = Object.freeze(data.my);
			local.forEach(course => {
				online.forEach(onlineCourse => {
					if(course.id === onlineCourse.id && course.name === onlineCourse.name && course.classroom === onlineCourse.classroom && course.time[0] === onlineCourse.time[0] && course.time[1] === onlineCourse.time[1]) {
						course.isSame = true;
						onlineCourse.isSame = true;
					}
				});
			});

			return '<div class="ts-grid is-compact is-stretched compare" style="text-align:left">\
				<div class="column is-8-wide"><div class="ts-box"><div class="ts-content is-dense">\
					<span class="ts-badge is-small is-dense" style="background:var(--ts-static-gray-500);color:var(--ts-static-gray-50)">當前課表 ('+local.length+')</span>' +
					local.map(course => '<div class="compare-course '+(course.isSame?'':' has-diff')+'">' +
						course.name.split('(')[0] + ' ' +
						'<small>(' + this.week_text[course.time[0]-1] + ') ' + (course.time[1].split('~')[0] == course.time[1].split('~')[1] ? course.time[1].split('~')[0] : course.time[1]) +
						(course.classroom ? ' ' + course.classroom : '') + 
						'</small>' +
						'</div>'
					).join('') +
				'</div></div></div>\
				<div class="column is-8-wide"><div class="ts-box"><div class="ts-content is-dense">\
					<span class="ts-badge is-small is-dense" style="background:var(--ts-static-primary-600);color:var(--ts-static-gray-50)">儲存於帳號中的課表 ('+online.length+')</span>' +
					'<br><small>儲存於 ' + this.formatTime(data.updatedAt) + '</small><br>' +
					online.map(course => '<div class="compare-course '+(course.isSame?'':' has-diff')+'">' +
						course.name.split('(')[0] + ' ' +
						'<small>(' + this.week_text[course.time[0]-1] + ') ' + (course.time[1].split('~')[0] == course.time[1].split('~')[1] ? course.time[1].split('~')[0] : course.time[1]) +
						(course.classroom ? ' ' + course.classroom : '') + 
						'</small>' +
						'</div>'
					).join('') +
				'</div></div></div>\
			</div><br><div class="ts-text is-description is-start-aligned">\
				這可能是因為您先前有在別的裝置登入並修改課表，但跟目前登入前的課表不一致。紅色代表有差異的課程，請選擇一個同步方式。\
			</div>';
		},

		formatTime(time) {
			const date = new Date(time);
			return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0');
		},
	},
	mounted() {
		this.editingCourse = Object.freeze(this.defaultCourse);
		this.savedCourses = JSON.parse(localStorage.getItem('savedCourse') || '[]');
		this.$axios.get('/scriptable.min.js?v=1').then(res => {
			this.scriptableCodeFile = res.data;
		});
		try { this.myCourses = JSON.parse(localStorage.myCourses); } catch (e) { }
		if(localStorage.auth_key) {
			this.loading_get = true;
			this.$axios.get('https://api.mcut-course.com/user/?action=get&my', { headers: { authorization: localStorage['auth_key'] } })
			.then(res => {
				this.loading_get = false;
				if(!isNaN(new Date(localStorage['myCourseSync']).getTime()) && new Date(localStorage['myCourseSync']).getTime() < new Date(res.data.updatedAt).getTime()) {
					this.myCourses = res.data.my;
					localStorage['myCourseSync'] = res.data.updatedAt;
					this.updateTimetable(false);
				}
				else if(res.data.my.length === 0) {
					this.updateTimetable();
				}
				else if(this.myCourses.length === 0) {
					this.myCourses = res.data.my;
					localStorage['myCourseSync'] = res.data.updatedAt;
					this.updateTimetable(false);
				}
				else {
					let isDifferent = false;
					if(this.myCourses.length !== res.data.my.length) isDifferent = true;
					else {
						for(let i = 0; i < this.myCourses.length; i++) {
							if(
								this.myCourses[i].id !== res.data.my[i].id ||
								this.myCourses[i].name !== res.data.my[i].name||
								this.myCourses[i].classroom !== res.data.my[i].classroom ||
								this.myCourses[i].time[0] !== res.data.my[i].time[0] ||
								this.myCourses[i].time[1] !== res.data.my[i].time[1]
							) {
								isDifferent = true;
								break;
							}
						}
					}
					if(isDifferent) {
						this.$swal({
							icon: 'warning',
							title: '當前課表與儲存於帳號中的課表不一致',
							html: this.compareCourse(res.data),
							confirmButtonText: '清除當前課表，使用儲存於帳號中的課表',
							cancelButtonText: '清除儲存於帳號中的課表，使用當前課表',
							showCancelButton: true,
							allowOutsideClick: false,
							allowEscapeKey: false,
							focusConfirm: false,
							reverseButtons: true,
							didOpen() {
								document.querySelectorAll('.swal2-actions button')[0].blur();
							}
						})
						.then((sres) => {
							if (sres.isConfirmed) {
								this.myCourses = res.data.my;
								localStorage.myCourses = JSON.stringify(this.myCourses);
								this.updateTimetable(false);
							} else {
								this.updateTimetable();
							}
						});
					} else {
						localStorage['myCourseSync'] = res.data.updatedAt;
					}
				}
			});
		}
		this.myCourses.forEach(course => {
			course.editing = false;
		});
		try {
			this.myCoursesSetting = JSON.parse(localStorage.myCoursesSetting);
		} catch (e) {
			this.myCoursesSetting = {
				showColTitle: true,
				showRowTitle: true,
				showColLine: true,
				showRowLine: true,
				showCourseClassroom: true,
				showCourseTime: true,
				tableBorder: 32,
				theme: 1,
			};
		}
		this.loadFonts().then(() => {
			this.setCanvasSize();
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
			if(this.$route.query.import) {
				this.importFromUrl();
			}
		});
		document.getElementById('editCourseDialog').addEventListener('click', (e) => {
			if (e.target.tagName === 'DIALOG') {
				document.getElementById('editCourseDialog').close();
			}
		});
		document.getElementById('widgetDialog').addEventListener('click', (e) => {
			if (e.target.tagName === 'DIALOG') {
				document.getElementById('widgetDialog').close();
			}
		});
		document.getElementById('importDialog').addEventListener('click', (e) => {
			if (e.target.tagName === 'DIALOG') {
				document.getElementById('importDialog').close();
			}
		});
	},
}
</script>