<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-passport">
		<div class="ts-container is-very-narrow has-vertically-padded-large">
			<h1 class="ts-header is-huge has-vertically-padded">英文段考時間與地點</h1>
			<div class="ts-selection is-dense">
				<label class="item" v-for="(type, idx) in course_type" :key="idx">
					<input type="radio" name="course_type" :value="idx" v-model="selectedCourseType">
					<div class="text">{{ type.name }}</div>
				</label>
			</div>
			<div class="ts-select is-solid is-dense" style="width: 10rem">
				<select v-model="selectedDept">
					<option value="">學院/系所</option>
					<option v-for="(dept, idx) in currentDepts" :key="idx" :value="idx">{{ dept }}</option>
				</select>
			</div>
			<div class="ts-select is-solid is-dense">
				<select v-model="selectedLevel">
					<option value="">班級</option>
					<option v-for="(lvl, idx) in course_level" :key="idx" :value="idx">{{ lvl }}</option>
				</select>
			</div>
			<div class="has-top-spaced">
				<loading v-if="loading" />
				<div v-else class="ts-box">
					<table class="ts-table is-striped">
						<thead>
							<tr>
								<th style="width: 11rem">班級</th>
								<th style="width: 6rem">授課老師</th>
								<th style="width: 10rem">地點</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="exam in filteredExams" :key="exam.join()">
								<td>{{ formatClassName(exam[0]) }}</td>
								<td>{{ exam[2] }}</td>
								<td>{{ formatLocation(exam[5]) }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	head() {
		return {
			title: '英文段考時間與地點 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '英文段考時間與地點 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },

				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com' + this.$router.currentRoute.path },
				{ hid: 'og:image', property: 'og:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME },
				{ hid: 'twitter:image', name: 'twitter:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME }
			]
		}
	},
	data() {
		return {
			course_type: [
				{ name: '大一', dept: [ '管設', '環資', '電機電子', '機械 AI' ], course_name: '生活與職場英文' },
				{ name: '大二', dept: [ '管設', '環資', '電機電子 AI', '機械' ], course_name: '英語聽講' }
			],
			course_level: [ '初級', '中級', '高級', '菁英' ],
			selectedCourseType: 0,
			selectedDept: '',
			selectedLevel: '',
			examData: [],
			loading: true
		}
	},
	mounted() {
		this.$axios.get('https://api.mcut-course.com/exam.php').then(response => {
			this.examData = response.data;
			this.loading = false;
		});
	},
	computed: {
		currentDepts() {
			return this.course_type[this.selectedCourseType].dept;
		},
		sortedData() {
			const prefixPriorityMap = {
				"管設": 1,
				"環資": 2,
				"電機": 3,
				"機械": 4,
			};

			const sortedArray = [...this.examData].sort((a, b) => {
				const strA = a[0];
				const strB = b[0];

				const prefixA = strA[0];
				const prefixB = strB[0];

				const priorityA1 = prefixPriorityMap[prefixA] || 99;
				const priorityB1 = prefixPriorityMap[prefixB] || 99;

				if (priorityA1 !== priorityB1) {
					return priorityA1 - priorityB1;
				}

				let priorityA2 = 99;
				if (strA.includes("初")) priorityA2 = 1;
				else if (strA.includes("中")) priorityA2 = 2;
				else if (strA.includes("高")) priorityA2 = 3;
				else if (strA.includes("菁英")) priorityA2 = 4;

				let priorityB2 = 99;
				if (strB.includes("初")) priorityB2 = 1;
				else if (strB.includes("中")) priorityB2 = 2;
				else if (strB.includes("高")) priorityB2 = 3;
				else if (strB.includes("菁英")) priorityB2 = 4;

				if (priorityA2 !== priorityB2) {
					return priorityA2 - priorityB2;
				}

				const suffixA = strA.slice(-1);
				const suffixB = strB.slice(-1);

				return suffixA.localeCompare(suffixB);
			});

			return sortedArray;
		},
		filteredExams() {
			return this.sortedData.filter(exam => {
				const className = exam[0];
				const courseName = exam[1];

				const currentCourseName = this.course_type[this.selectedCourseType].course_name;
				if (currentCourseName !== courseName) {
					return false;
				}
				
				if (this.selectedDept !== '') {
					const deptName = this.currentDepts[this.selectedDept].replace(/ /g, '');
					if (!className.includes(deptName)) {
						return false;
					}
				}
				
				if (this.selectedLevel !== '') {
					const levelName = this.course_level[this.selectedLevel].replace(/\級/g, '');
					if (!className.includes(levelName)) {
						return false;
					}
				}
				
				return true;
			});
		}
	},
	methods: {
		formatClassName(className) {
			return className.replace(/([^\x00-\x7F]+)([A-Za-z0-9]+)/g, '$1 $2').replace(/([A-Za-z0-9]+)([^\x00-\x7F]+)/g, '$1 $2');
		},
		formatLocation(location) {
			return location.replace('體育館 ', '體 ');
		}
	},
}
</script>