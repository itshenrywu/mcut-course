<template>
	<div class="cell is-scrollable is-fluid is-secondary" id="page-home">
		<section class="home-header">
			<div class="ts-container is-fitted">
				<div class="ts-grid is-relaxed">
					<div class="column is-4-wide mobile-fluid">
						<div class="ts-select is-huge is-relaxed is-solid is-fluid">
							<div class="content" data-dropdown="term-dropdown">{{ currentTerm != '' ? currentTerm.split('-')[0] + ' 學年第 ' + currentTerm.split('-')[1] + ' 學期' : '' }}</div>
							<div class="ts-dropdown" data-position="bottom-start" id="term-dropdown" style="height:60vh">
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
					<div class="column is-12-wide mobile-fluid">
						<div class="ts-input is-start-icon is-huge is-relaxed is-solid" @click="showDropdown()">
							<span class="ts-icon is-magnifying-glass-icon"></span>
							<input type="search" placeholder="搜尋課程名稱 / 老師 / 序號 ..." v-model.trim="searchQuery" @input="searchByQuery()" />
						</div>
						<div data-dropdown="query-dropdown"></div>
						<div class="ts-dropdown" data-position="bottom-start" id="query-dropdown">
							<template v-if="searchResult.course.length > 0">
								<div class="header">課程 ({{ searchResult.course.length }})</div>
								<button class="item is-indented" v-for="(course, index) of searchResult.course" v-if="index < 5" @click="showCourse(course)">
									{{ course.name }}
									<span class="description">{{
										course.dept + ' ' + course.year + ' ' + course.class + '・'+
										course.type + ' ' + course.credit + ' 學分・' +
										course.teacher + ' 老師'
									}}</span>
								</button>
								<button class="item more" v-if="searchResult.course.length > 5" @click="goDetailSearch('query', searchQuery)">
									顯示更多<span class="ts-icon is-arrow-right-icon"></span>
								</button>
							</template>
							<template v-if="Object.keys(searchResult.teacher).length > 0">
								<div class="header">授課老師 ({{ Object.keys(searchResult.teacher).length }})</div>
								<button class="item is-indented" v-for="(teacher, index) of Object.keys(searchResult.teacher)" v-if="index < 5" @click="goDetailSearch('query', teacher)">
									{{ teacher }}
									<span class="description">共 {{ searchResult.teacher[teacher].length }} 門課程</span>
								</button>
								<button class="item more" v-if="Object.keys(searchResult.teacher).length > 5" @click="goDetailSearch('query', searchQuery)">
									顯示所有教師名稱包含「{{ searchQuery }}」的課程<span class="ts-icon is-arrow-right-icon"></span>
								</button>
							</template>
							<template v-if="searchQuery == ''">
								<div class="header notice">請輸入關鍵字</div>
							</template>
							<template v-else-if="searchResult.course.length == 0 && Object.keys(searchResult.teacher).length == 0">
								<div class="header notice">查無相關課程或老師，請嘗試其他關鍵字</div>
							</template>
						</div>
					</div>
				</div>
			</div>
		</section>
		<div class="ts-container has-top-spaced-huge">
			<div class="ts-grid has-top-spaced-huge is-stretched">
				<div class="column is-13-wide mobile-fluid">
					<div class="ts-grid">
						<div class="column is-8-wide mobile-fluid">
							<div class="ts-box is-raised" @click="goDetailSearch('')">
								<div class="ts-content">
									<div class="ts-header">進階搜尋<span class="ts-badge is-start-spaced is-dense is-small is-negative">Hot!</span></div>
									<div class="ts-text is-small is-description">依系所、班級、修別搜尋</div>
								</div>
								<div class="symbol"><span class="ts-icon is-table-icon"></span></div>
							</div>
						</div>
						<div class="column is-4-wide mobile-half">
							<div class="ts-box" @click="goDetailSearch('體育')" :class="{'locked': isLocked('體育')}">
								<div class="ts-content">
									<div class="ts-header">體育自選</div>
									<div class="ts-text is-small is-description">大二至大四自選體育</div>
								</div>
								<div class="symbol"><span class="ts-icon is-child-reaching-icon"></span></div>
							</div>
						</div>
						<div class="column is-4-wide mobile-half">
							<div class="ts-box" @click="goDetailSearch('社會實踐')" :class="{'locked': isLocked('社會實踐')}">
								<div class="ts-content">
									<div class="ts-header">{{ currentTerm.split('-')[0] <= 112 ? '經典教育與社會實踐':'永續發展與社會實踐' }}</div>
									<div class="ts-text is-small is-description">通識中心 X+1 課程</div>
								</div>
								<div class="symbol"><span class="ts-icon is-x-icon"></span></div>
							</div>
						</div>
						<div class="column is-4-wide mobile-half">
							<div class="ts-box" @click="goDetailSearch('通識', '社會科學')" :class="{'locked': isLocked('通識', '社會科學')}">
								<div class="ts-content">
									<div class="ts-header">社會科學</div>
									<div class="ts-text is-small is-description">{{ currentTerm.split('-')[1] >= 3 ? '通識重修課程' : '通識選修課程' }}</div>
								</div>
								<div class="symbol"><span class="ts-icon is-users-icon"></span></div>
							</div>
						</div>
						<div class="column is-4-wide mobile-half">
							<div class="ts-box" @click="goDetailSearch('通識', '自然科學')" :class="{'locked': isLocked('通識', '自然科學')}">
								<div class="ts-content">
									<div class="ts-header">自然科學</div>
									<div class="ts-text is-small is-description">{{ currentTerm.split('-')[1] >= 3 ? '通識重修課程' : '通識選修課程' }}</div>
								</div>
								<div class="symbol"><span class="ts-icon is-seedling-icon"></span></div>
							</div>
						</div>
						<div class="column is-4-wide mobile-half">
							<div class="ts-box" @click="goDetailSearch('通識', '語言與全球化')" :class="{'locked': isLocked('通識', '語言與全球化')}">
								<div class="ts-content">
									<div class="ts-header">語言與全球化</div>
									<div class="ts-text is-small is-description">{{ currentTerm.split('-')[1] >= 3 ? '通識重修課程' : '通識選修課程' }}</div>
								</div>
								<div class="symbol"><span class="ts-icon is-earth-asia-icon"></span></div>
							</div>
						</div>
						<div class="column is-4-wide mobile-half">
							<div class="ts-box" @click="goDetailSearch('通識', '人文藝術')" :class="{'locked': isLocked('通識', '人文藝術')}">
								<div class="ts-content">
									<div class="ts-header">人文藝術</div>
									<div class="ts-text is-small is-description">{{ currentTerm.split('-')[1] >= 3 ? '通識重修課程' : '通識選修課程' }}</div>
								</div>
								<div class="symbol"><span class="ts-icon is-music-icon"></span></div>
							</div>
						</div>
					</div>
				</div>
				<div class="column is-3-wide mobile-fluid">
					<div class="ts-box is-raised saved" @click="goDetailSearch('saved')">
						<div class="ts-content">
							<div class="ts-header">收藏的課程<span class="ts-badge is-start-spaced is-dense is-small my">{{ savedCourse.length }}</span></div>
						</div>
						<div class="symbol"><span class="ts-icon is-star-icon"></span></div>
					</div>
				</div>
			</div>
			<h2 class="ts-header is-huge has-bottom-spaced has-top-spaced-huge">
				{{ currentTerm.split('-')[1] >= 3 ? '各系暑修' : '各系選修 / 各班必修' }}
			</h2>
			<template v-if="currentTerm.split('-')[1] >= 3">
				<div class="ts-grid has-top-spaced dept_class_list">
					<div class="column is-4-wide mobile-half" v-for="(classes, dept) in classList[currentTerm]">
						<div class="ts-box" @click="goDetailSearch('暑修', dept)">
							<div class="ts-content">
								<div class="ts-header">{{ dept }}</div>
								<div class="ts-text is-tiny is-description">暑修</div>
							</div>
						</div>
					</div>
				</div>
				<br>
			</template>
			<template v-else v-for="(classes, dept) in classList[currentTerm]">
				<div class="dept_name" @click="slideToggle(dept)">
					<div class="ts-header is-big">{{ dept }}</div>
					<span class="ts-icon" :class="{
						'is-angle-down-icon': !display.includes(dept),
						'is-angle-up-icon': display.includes(dept)
					}"></span>
				</div>
				<transition name="slide" @before-enter="beforeSlide" @enter="slideIn" @leave="slideOut">
				<div class="ts-grid has-top-spaced dept_class_list" v-show="display.includes(dept)">
					<div class="column is-2-wide mobile-half">
						<div class="ts-box" @click="goDetailSearch(dept)">
							<div class="ts-content">
								<div class="ts-text is-tiny is-description">{{ dept }}</div>
								<div class="ts-header">全年級選修</div>
							</div>
						</div>
					</div>
					<div class="column is-2-wide mobile-half" v-for="classInfo in classes">
						<div class="ts-box" @click="goDetailSearch(dept, classInfo)">
							<div class="ts-content">
								<div class="ts-text is-tiny is-description">{{ dept }}</div>
								<div class="ts-header">{{ classInfo }} 必修</div>
							</div>
						</div>
					</div>
				</div>
				</transition>
				<br>
			</template>
			<div class="ts-blankslate" v-if="!loading && (!classList[currentTerm] || classList[currentTerm].length == 0)">
				<span class="ts-icon is-circle-exclamation-icon"></span>
				<div class="header">目前還沒有本學期的課表</div>
				<div class="description">請切換學期或改天再試</div>
			</div>
		</div>
		<loading loadingText="課表下載中" v-show="loading" />
	</div>
</template>
<script>
export default {
	async asyncData({ $axios }) {
		let _terms = {};
		let term_res = await $axios.get('https://api.mcut-course.com/list.php');
		term_res = term_res.data.terms || ["113-2","113-1","112-4","112-3","112-2","112-1","111-4","111-3","111-2","111-1","110-4","110-3","110-2","110-1","109-4","109-3","109-2","109-1","108-4","108-3","108-2","108-1"];
		term_res.forEach(term => {
			let _year = term.split('-')[0];
			let _term = term.split('-')[1];
			if (!_terms[_year]) _terms[_year] = [];
			_terms[_year].push(_term);
		});
		let terms = Object.entries(_terms)
		.sort((a, b) => Number(b[0]) - Number(a[0]))
		.map(([year, term]) => ({ year: year, term: term }));

		let classList = await $axios.get('https://api.mcut-course.com/class_list.php?type=home');
		classList = classList.data || {};

		return { terms, classList };
	},
	data() {
		return {
			terms: [],
			currentTerm: '',
			savedCourse: [],
			classList: {},
			display: [],
			searchQuery: '',
			courses: [],
			searchResult: {
				course: [],
				teacher: []
			},
			loading: false
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			if (localStorage['savedCourse'] && JSON.parse(localStorage['savedCourse']) && JSON.parse(localStorage['savedCourse']).length > 0) {
				this.savedCourse = JSON.parse(localStorage['savedCourse']);
				let term_id = this.savedCourse[0].substring(0, 4);
				this.currentTerm = term_id.substring(0, 3) + '-' + term_id.substring(3, 4);
				localStorage['term'] = this.currentTerm;
			}
			else this.currentTerm = localStorage['term'] || this.terms[0].year + '-' + this.terms[0].term[0];
			this.fetchData();
		},
		fetchData() {
			const now = new Date().getTime();
			const storedData = localStorage['courseData_' + this.currentTerm];
			const storedTime = localStorage['courseDataTime_' + this.currentTerm];

			if (storedData && storedTime && (now - storedTime < 30 * 60 * 1000)) {
				const res = JSON.parse(storedData);
				this.courses = res.course;
				this.loading = false;
			} else {
				this.$axios.get('https://api.mcut-course.com/list.php?term=' + this.currentTerm).then((res) => {
					localStorage['courseData_' + this.currentTerm] = JSON.stringify(res.data);
					localStorage['courseDataTime_' + this.currentTerm] = now;
					this.courses = res.data.course;
					this.loading = false;
				});
			}
		},
		goDetailSearch(type, subtype) {
			if(type == 'saved') {
				this.$router.push('/saved/');
				return;
			}
			if(this.isLocked(type, subtype)) {
				this.$swal({
					icon: 'error',
					title: '這個學期還沒有開設此類課程',
					text: '請切換學期或改天再試'
				});
				return;
			}
			this.$gtag('event', 'button_click', {
				button_name: (type || 'default') + '.' + (subtype || 'default'),
				action: 'click',
				category: 'index-click-' + (type || 'default'),
			});
			if(type != '') {
				if(localStorage['showConflict'] == '0') localStorage['showConflict'] = '1';
				localStorage['searchQuery'] = '';
			}
			if(type == 'query') {
				localStorage['searchQuery'] = subtype;
				localStorage['dept'] = '';
				localStorage['class'] = '';
				localStorage['type'] = '';
			}
			else if(type == '體育') {
				localStorage['dept'] = '體育組-四技(日)';
				localStorage['class'] = '2 甲';
				localStorage['type'] = '';
			}
			else if(type == '通識') {
				localStorage['dept'] = '通識中心四技';
				localStorage['class'] = '';
				localStorage['type'] = '- '+subtype;
			}
			else if (type == '社會實踐') {
				localStorage['dept'] = '通識中心四技';
				localStorage['searchQuery'] = '00700F';
				localStorage['class'] = '';
				localStorage['type'] = '';
			}
			else if (type == '暑修') {
				localStorage['dept'] = subtype;
				localStorage['class'] = '';
				localStorage['type'] = '';
			}
			else if (type != '' && subtype == undefined) {
				localStorage['dept'] = type;
				localStorage['class'] = '';
				localStorage['type'] = '選修';
			}
			else if (type != '') {
				localStorage['dept'] = type;
				localStorage['class'] = subtype;
				localStorage['type'] = '必修';
			}
			this.$router.push('/course/');
		},
		isLocked(type, subtype) {
			if(this.currentTerm.split('-')[1] >= 3 && ['體育'].includes(type)) return true;
			if(type == '體育' && this.currentTerm.split('-')[0] <= 110) return true;

			if(type == '社會實踐' && this.courses.filter(course => course.dept == '通識中心四技' && course.id.includes('00700F')).length == 0) return true;
			if(type == '通識' && this.courses.filter(course => course.dept == '通識中心四技' && course.otherinfo && course.otherinfo.includes(subtype)).length == 0) return true;

			return false;
		},
		chooseTerm(term) {
			if (this.currentTerm == term) return;
			if (this.savedCourse.length == 0) {
				this.loading = true;
				this.currentTerm = term;
				localStorage['term'] = term;
				this.display = [];
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
						this.display = [];
						this.fetchData();
					}
				})
		},
		searchByQuery() {
			this.searchResult.course = [];
			this.searchResult.teacher = {};
			if(this.searchQuery.length == 0) return;
			this.courses.forEach(course => {
				if(course.id.includes('ALT')) return;
				if(
					(this.searchQuery.length >= 3 && course.id.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
					course.name.toLowerCase().includes(this.searchQuery.toLowerCase())
				) {
					this.searchResult.course.push(course);
				}
				if(course.teacher.toLowerCase().includes(this.searchQuery.toLowerCase())) {
					if(!this.searchResult.teacher[course.teacher]) this.searchResult.teacher[course.teacher] = [];
					if(!this.searchResult.teacher[course.teacher].includes(course.id)) this.searchResult.teacher[course.teacher].push(course.id);
				}
			});
		},
		showCourse(course) {
			this.$router.push('/course/' + course.id.substring(0, 4) + '/' + course.id.substring(4, 8) + '/' + course.id.substring(8) + '/');
		},
		showDropdown() {
			console.log(
				document.querySelector('#query-dropdown').classList.contains('is-visible'),
				document.querySelector('#query-dropdown').style.display
			);
			if(document.getElementById('query-dropdown').classList.contains('is-visible')) return;
			if(window.innerWidth <= 768) {
				document.querySelector('.ts-input').scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
			document.querySelector('[data-dropdown="query-dropdown"]').click();
			this.searchByQuery();
		},
		slideToggle(dept) {
			if (this.display.includes(dept)) this.display = this.display.filter(item => item != dept);
			else this.display.push(dept);
		},
		beforeSlide(el) {
			el.style.height = '0';
		},
		slideIn(el, done) {
			el.offsetHeight;
			el.style.transition = 'height .5s ease';
			el.style.height = (el.scrollHeight + 5) + 'px';
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
<style>
.home-header {
	background-color: var(--ts-gray-300);
	padding: 8rem 0;
}

#page-home .ts-box .ts-text {
	line-height: 1.2rem;
}

#page-home .ts-box:hover{
	cursor: pointer;
}

#page-home .ts-badge.my {
	background-color: var(--ts-primary-600);
	color: var(--ts-static-gray-50);
}

.ts-select.is-huge {
	height: 4rem;
}

.ts-select.is-huge .content {
	font-size: 1.4rem;
}

.ts-input.is-huge input {
	font-size: 1.4rem;
	height: 4rem;
	padding-left: 3.2rem;
}

.ts-input.is-huge .ts-icon {
	font-size: 1.6rem;
}

.ts-select.is-huge::after {
	font-size: 1.3rem;
}

.ts-box.locked {
	opacity: 0.6;
	cursor: not-allowed!important;
}

#page-home .dept_name {
	cursor: pointer;
	display: flex;
    align-items: center;
}

#page-home .dept_name .ts-header {
	margin-right: .5rem;
}

#page-home .dept_class_list {
	overflow: hidden;
}

#page-home .ts-blankslate {
	height: 30vh;
}

[data-dropdown="query-dropdown"] {
	opacity: 0;
	width: 100%;
	height: 1px;
}

.ts-dropdown .header.notice {
	padding: 5rem 0;
	justify-content: center;
}

.ts-dropdown .item.more {
	justify-content: end;
}

@media (max-width: 767.98px) {
	#page-home .is-stretched {
		flex-direction: column-reverse;
	}

	.home-header {
		padding: 0;
	}

	.home-header .ts-grid {
		--gap: 0px;
	}

	#page-home input,
	#page-home .ts-select {
		border-radius: 0;
	}

	#query-dropdown {
		position: unset;
	}

	#query-dropdown .item.is-indented {
		flex-direction: column;
		align-items: flex-start;
		gap: .5rem;
	}

	#query-dropdown .item.is-indented .description {
		margin-left: 0;
	}

	.ts-box.saved .ts-content {
		padding: 1.5rem 1rem;
	}
}

@media print {
	#page-home .dept_class_list {
		display: flex!important;
	}
}
</style>