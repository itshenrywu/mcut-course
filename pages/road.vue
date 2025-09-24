<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-road">
		<div class="ts-container is-very-narrow has-vertically-padded-large">
			<h1 class="ts-header is-huge has-vertically-padded">大學之道環境與行動路線查詢</h1>
			<div class="ts-text is-label has-bottom-padded-small">學號</div>
			<div class="ts-input is-fluid">
				<input type="text" v-model.trim="studentId" />
			</div>
			<br>
			<template v-if="studentId.length == 9 && studentId.toUpperCase().startsWith('U')">
				<div class="ts-box" v-if="filteredData.length > 0">
					<div v-for="(row, index) in filteredData" :key="row.學號" :class="{'has-top-spaced': index > 0}">
						<table class="ts-table is-definition is-fluid">
							<tbody>
								<tr>
									<td class="is-collapsed">系所</td>
									<td>{{ row.系所 }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">班級</td>
									<td>{{ row.班級 }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">姓名</td>
									<td>{{ row.姓名 }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">路線編號</td>
									<td>{{ row.路線編號 }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">上課時段<span>(前導課)</span></td>
									<td>{{ row['上課時段(前導課)'] }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">上課時段<span>(實作踏查)</span></td>
									<td style="white-space: pre-line;">{{ row['上課時段(實作踏查)'] }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">上課時段<span>(課後討論)</span></td>
									<td>{{ row['上課時段(課後討論)'] }}</td>
								</tr>
							</tbody>
						</table>
						<div v-if="index < filteredData.length - 1" class="ts-divider"></div>
					</div>
				</div>
				<div v-else-if="data.length > 0" class="ts-box">
					<div class="ts-header is-icon is-center-aligned has-vertically-padded-large">
						<span class="ts-icon ts-icon is-circle-exclamation-icon"></span>
						找不到該學號的資料
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
<style>

</style>
<script>
import { mapState } from 'vuex'
export default {
	head() {
		return {
			title: '大學之道環境與行動路線查詢 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '大學之道環境與行動路線查詢 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	data() {
		return {
			data: [],
			studentId: '',
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
		filteredData() {
			if (!this.studentId) return [];
			return this.data.filter(row => 
				row.學號 && row.學號.includes(this.studentId.toUpperCase())
			);
		}
	},
	mounted() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.$axios.get('https://api.mcut-course.com/road.php').then(response => {
				this.data = response.data;
			});
		},
	}
};
</script>
<style>
#page-road span {
	color: var(--ts-gray-500);
}

@media (max-width: 768px) {
	#page-road span {
		display: block;
	}
}
</style>