<template>
	<div class="cell is-scrollable is-fluid is-horizontal is-secondary" id="page-home">
		<div class="ts-container has-top-spaced-huge">
			<div class="ts-grid is-relaxed has-top-spaced">
				<div class="column is-4-wide mobile-fluid">
					<div class="ts-select is-huge is-relaxed is-solid is-fluid">
						<div class="content" data-dropdown="term-dropdown">{{ currentTerm.split('-')[0] + ' 學年第 ' + currentTerm.split('-')[1] + ' 學期' }}</div>
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
				<div class="column is-12-wide mobile-fluid">
					<div class="ts-input is-start-icon is-huge is-relaxed is-solid">
						<span class="ts-icon is-magnifying-glass-icon"></span>
						<input type="text" placeholder="搜尋課程名稱 / 老師 / 序號 ..." />
					</div>
				</div>
			</div>
			<br><br>
			<h1 class="ts-header is-huge">常用搜尋</h1>
			<div class="ts-grid has-top-spaced">
				<div class="column is-8-wide mobile-half">
					<div class="ts-box is-raised" @click="goSearch()">
						<div class="ts-content">
							<div class="ts-header">進階搜尋<span class="ts-badge is-start-spaced is-dense is-small is-negative">Hot!</span></div>
							<div class="ts-text is-small is-description">依開課系所、班級、修別詳細搜尋</div>
						</div>
						<div class="symbol"><span class="ts-icon is-table-icon"></span></div>
					</div>
				</div>
				<div class="column is-8-wide mobile-half">
					<div class="ts-box" @click="goSearch('體育')" :class="{'locked': isLocked('體育')}">
						<div class="ts-content">
							<div class="ts-header">體育自選</div>
							<div class="ts-text is-small is-description">於大二至大四，採興趣選項教學</div>
						</div>
						<div class="symbol"><span class="ts-icon is-child-reaching-icon sport-icon"></span></div>
					</div>
				</div>
				<div class="column is-4-wide mobile-half">
					<div class="ts-box" @click="goSearch('通識', '社會科學')" :class="{'locked': isLocked('通識')}">
						<div class="ts-content">
							<div class="ts-header">社會科學</div>
							<div class="ts-text is-small is-description">通識選修課程</div>
						</div>
						<div class="symbol"><span class="ts-icon is-users-icon"></span></div>
					</div>
				</div>
				<div class="column is-4-wide mobile-half">
					<div class="ts-box" @click="goSearch('通識', '自然科學')" :class="{'locked': isLocked('通識')}">
						<div class="ts-content">
							<div class="ts-header">自然科學</div>
							<div class="ts-text is-small is-description">通識選修課程</div>
						</div>
						<div class="symbol"><span class="ts-icon is-seedling-icon"></span></div>
					</div>
				</div>
				<div class="column is-4-wide mobile-half">
					<div class="ts-box" @click="goSearch('通識', '語言與全球化')" :class="{'locked': isLocked('通識')}">
						<div class="ts-content">
							<div class="ts-header">語言與全球化</div>
							<div class="ts-text is-small is-description">通識選修課程</div>
						</div>
						<div class="symbol"><span class="ts-icon is-book-atlas-icon"></span></div>
					</div>
				</div>
				<div class="column is-4-wide mobile-half">
					<div class="ts-box" @click="goSearch('通識', '人文藝術')" :class="{'locked': isLocked('通識')}">
						<div class="ts-content">
							<div class="ts-header">人文藝術</div>
							<div class="ts-text is-small is-description">通識選修課程</div>
						</div>
						<div class="symbol"><span class="ts-icon is-palette-icon"></span></div>
					</div>
				</div>
			</div>
			<h2 class="ts-header is-huge has-bottom-spaced has-top-spaced-huge">班級必修課表</h2>
			<template v-for="(classes, dept) in classList[currentTerm]">
				<div class="ts-header is-big">{{ dept }}</div>
				<div class="ts-grid has-top-spaced">
					<div class="column is-2-wide mobile-quarter" v-for="classInfo in classes">
						<div class="ts-box" @click="goSearch(dept, classInfo)">
							<div class="ts-content">
								<div class="ts-header">{{ classInfo }}</div>
							</div>
						</div>
					</div>
				</div>
				<br>
			</template>
		</div>
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
		},
		goSearch(type, subtype) {
			if(this.isLocked(type)) {
				this.$swal({
					icon: 'error',
					title: '這個學期沒有開設此類課程',
					text: '請選擇其他學期使用其他功能'
				});
				return;
			}
			localStorage['searchQuery'] = '';
			if(type == '體育') {
				localStorage['dept'] = '體育組-四技(日)';
				localStorage['class'] = '2 甲';
				localStorage['type'] = '';
			}
			else if(type == '通識') {
				localStorage['dept'] = '通識中心四技';
				localStorage['class'] = '';
				localStorage['type'] = '- '+subtype;
			}
			else {
				localStorage['dept'] = type;
				localStorage['class'] = subtype;
				localStorage['type'] = '必修';
			}
			this.$router.push('/course/');
		},
		isLocked(type) {
			if(this.currentTerm.split('-')[1] >= 3) return true;
			if(type == '體育' && this.currentTerm.split('-')[0] <= 110) return true;

			return false;
		},
		chooseTerm(term) {
			if (this.currentTerm == term) return;
			if (this.savedCourse.length == 0) {
				this.loading = true;
				this.currentTerm = term;
				localStorage['term'] = term;
				return;
			}
			this.$swal({
				icon: 'question',
				title: '切換為「' + term + '」學期？',
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
					}
				})
		}
	}
}
</script>
<style>
#page-home .ts-box .ts-text {
	line-height: 1.2rem;
}

#page-home .ts-box:hover{
	cursor: pointer;
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

.ts-box.locked {
	opacity: 0.6;
	cursor: not-allowed!important;
}
</style>