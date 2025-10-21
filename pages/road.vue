<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-road">
		<div class="ts-container is-very-narrow has-vertically-padded-large">
			<h1 class="ts-header is-huge has-vertically-padded">大學之道環境與行動路線查詢</h1>
			<div class="ts-text is-label has-bottom-padded-small">學號</div>
			<div class="ts-input is-fluid">
				<input type="text" v-model.trim="uid" placeholder="請輸入學號 ..." />
			</div>
			<br>
			<template v-if="uid.length == 9 && uid.toUpperCase().startsWith('U') && detail.length > 0">
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
									<td>{{ nameFormat(row.姓名) }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">路線</td>
									<td>
										<span class="ts-text is-secondary">{{ '路線 ' + row.路線編號 + (filteredDetail.length > 1 ? ' - ' : '') }}</span>
										<span v-if="filteredDetail.length > 1" v-html="filteredDetail[3]"></span>
									</td>
								</tr>
								<tr v-if="filteredDetail.length > 1">
									<td class="is-collapsed">講師</td>
									<td>{{ filteredDetail[2] }}</td>
								</tr>
								<tr v-if="filteredDetail.length > 1">
									<td class="is-collapsed">路線簡介</td>
									<td>{{ filteredDetail[4] }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">前導課</td>
									<td>{{ row['上課時段(前導課)'] }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">實作踏查時間</td>
									<td>{{ row['上課時段(實作踏查)'] }}</td>
								</tr>
								<tr v-if="filteredDetail.length > 1">
									<td class="is-collapsed">交通方式</td>
									<td>{{ filteredDetail[6]?.replace(/ /g, '').replace(/\n/g,'') }}</td>
								</tr>
								<tr v-if="filteredDetail.length > 1">
									<td class="is-collapsed">集合地點</td>
									<td>{{ filteredDetail[5]?.replace(/ /g, '').replace(/\n/g,'') }}</td>
								</tr>
								<tr>
									<td class="is-collapsed">課後討論</td>
									<td>{{ row['上課時段(課後討論)'] }}</td>
								</tr>
							</tbody>
						</table>
						<div v-if="index < filteredData.length - 1" class="ts-divider"></div>
					</div>
				</div>
				<div v-else-if="data.length > 0" class="ts-box">
					<div class="ts-header is-icon is-center-aligned has-vertically-spaced-large">
						<br><br>
						<span class="ts-icon ts-icon is-circle-exclamation-icon"></span>
						找不到該學號的資料
						<br><br>
					</div>
				</div>
				<br>
				<div class="ts-text is-description">
					若報名截止後有任何路線上課時間等問題，請詢問各路線負責的人員：<br>
					路線 1 ~ 8：林庭婕小姐 <a href="tel:0229089899,2220">分機 2220</a><br>
					路線 9 ~ 16：洪若瑜小姐 <a href="tel:0229089899,2221">分機 2221</a><br>
					路線 17 ~ 24：劉明益先生 <a href="tel:0229089899,2248">分機 2248</a><br>
					路線 25 ~ 32：鄭雅雲小姐 <a href="tel:0229089899,2224">分機 2224</a><br>
					路線 33 ~ 40：謝佩芳小姐 <a href="tel:0229089899,2229">分機 2229</a>
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

				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com' + this.$router.currentRoute.path },
				{ hid: 'og:image', property: 'og:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME },
				{ hid: 'twitter:image', name: 'twitter:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME }
			]
		}
	},
	data() {
		return {
			data: [],
			uid: '',
			detail: []
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
		filteredData() {
			if (!this.uid) return [];
			return this.data.filter(row => 
				row.學號 && row.學號.includes(this.uid.toUpperCase())
			);
		},
		filteredDetail() {
			if (!this.uid) return [];
			return this.detail.find(row => 
				row[0] == this.filteredData[0].路線編號
			);
		}
	},
	watch: {
		uid(newVal) {
			const uid = (newVal || '').trim().toUpperCase();
			const isValid = /^[A-Z0-9]{9}$/.test(uid) && uid.startsWith('U');
			if (isValid) {
				if(localStorage.auth_key) {
					this.$axios.post('https://api.mcut-course.com/user/?action=update',
						'uid=' + uid,
						{ headers: { 'Content-Type': 'application/x-www-form-urlencoded', authorization: localStorage['auth_key'] } }
					)
					.then(res => {
						localStorage['uid'] = uid;
					})
					.catch((err) => {})
				}
				else {
					localStorage['uid'] = uid;
				}
			}
		}
	},
	mounted() {
		if (localStorage['uid']) this.uid = localStorage['uid'];
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.$axios.get('https://api.mcut-course.com/road.php').then(response => {
				this.data = response.data;
				if (window.location.hostname === 'localhost' && this.data.length > 0 && !localStorage['uid']) {
					this.uid = this.data[0].學號 || '';
				}
			});
			this.$axios.get('https://api.mcut-course.com/road_detail.php').then(response => {
				this.detail = response.data;
			});
		},
		nameFormat(name) {
			return name.substring(0, 1) + '〇' + name.substring(2);
		}
	}
};
</script>
<style>
</style>