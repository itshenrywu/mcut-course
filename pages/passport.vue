<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-passport">
		<div class="ts-container is-very-narrow has-vertically-padded-large">
			<h1 class="ts-header is-huge has-vertically-padded">英語學習護照點數查詢</h1>
			<div class="ts-text is-label has-bottom-padded-small">學號</div>
			<div class="ts-input is-fluid">
				<input type="text" v-model.trim="uid" placeholder="請輸入學號 ..." />
			</div>
			<br>
			<template v-if="uid.length == 9 && uid.toUpperCase().startsWith('U')">
				<loading v-if="isLoading" loading-text="載入中..." />
				<template v-else-if="data.length > 0">
					<div class="ts-text is-label has-bottom-padded-small">統計</div>
					<table class="ts-table is-fluid">
						<tbody>
							<tr v-for="row in summaryByType" :key="row.type">
								<td>{{ row.type }}</td>
								<td class="is-end-aligned">{{ row.totalPoints }}</td>
							</tr>
							<tr>
								<td><b>總計</b></td>
								<td class="is-end-aligned"><b>{{ totalPoints }}</b></td>
							</tr>
						</tbody>
					</table>
					<div class="ts-box ad is-hollowed has-vertically-spaced-large" v-if="showAd">
						<div class="ts-content">
							<div class="ts-text is-description has-bottom-padded-small">贊助商</div>
							<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5900703871265800" crossorigin="anonymous" onerror="document.querySelector('.ad .ts-content').innerHTML='<div class=&quot;ts-text is-description has-bottom-padded-small&quot;>贊助商</div><div class=&quot;ts-text is-secondary is-center-aligned has-vertically-padded&quot;>太無情了吧，擋廣告 😭<br>加入白名單，救救開發者 🙏</div>';"></script>
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
					<div class="ts-text is-label has-bottom-padded-small">紀錄</div>
					<div class="ts-box" >
						<table class="ts-table is-celled is-fluid passport-log">
							<thead>
								<tr>
									<th class="is-collapsed is-center-aligned">日期</th>
									<th>參加項目</th>
									<th class="is-collapsed is-center-aligned">參加次數</th>
									<th class="is-collapsed is-center-aligned">獲得點數</th>
									<th>語言中心核實</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(row, index) in data" :key="index">
									<td class="is-collapsed is-center-aligned">{{ row.date }}</td>
									<td>{{ row.type }}</td>
									<td class="is-collapsed is-center-aligned">{{ row.times ?? '-' }}</td>
									<td class="is-collapsed is-center-aligned">{{ row.point }}</td>
									<td>{{ row.note }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</template>
				<div v-else class="ts-box">
					<div class="ts-header is-icon is-center-aligned has-vertically-spaced-large">
						<br><br><br>
						<span class="ts-icon ts-icon is-circle-exclamation-icon"></span>
						目前沒有此學號的紀錄
						<br><br><br><br>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<style>
@media (max-width: 768px) {
	.passport-log thead {
		display: none;
	}

	.passport-log tr {
		display: block;
		padding: 0.5rem 0;
	}

	.passport-log tr:last-child {
		border-bottom: 0;
	}

	.ts-table.passport-log td {
		display: inline-block;
		vertical-align: top;
		text-align: left;
		border: 0!important;
		padding: 0 1rem;
		width: 50%;
		box-sizing: border-box;
	}

	.passport-log td:nth-child(1) { width: 3rem }
	.passport-log td:nth-child(2) { width: calc(100% - 4rem) }

	.passport-log td:nth-child(5) {
		display: block;
		width: 100%;
	}

	.passport-log td:nth-child(3)::before { content: "參加次數："  }
	.passport-log td:nth-child(4)::before { content: "獲得點數：" }
	.passport-log td:nth-child(5)::before { content: "語言中心核實："}
}
</style>

<script>
import { mapState } from 'vuex'
import Loading from '~/components/loading.vue'
export default {
	head() {
		return {
			title: '英語學習護照點數查詢 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '英語學習護照點數查詢 | 明志科技大學選課小幫手' },
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
			isLoading: false
		}
	},
	components: {
		Loading
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
		summaryByType() {
			const summaryMap = {};
			for (const row of this.data) {
				const normalizedType = ((row && row.type) ? String(row.type) : '').trim().replace(/\s+/g, ' ') || '未分類';
				if (!summaryMap[normalizedType]) {
					summaryMap[normalizedType] = { type: normalizedType, totalPoints: 0 };
				}
				summaryMap[normalizedType].totalPoints += Number(row.point) || 0;
			}
			return Object.values(summaryMap);
		},
		totalPoints() {
			return this.summaryByType.reduce((acc, cur) => acc + cur.totalPoints, 0);
		}
	},
	watch: {
		uid(newVal) {
			const uid = (newVal || '').trim().toUpperCase();
			const isValid = /^[A-Z0-9]{9}$/.test(uid) && uid.startsWith('U');
			if (isValid) {
				this.fetchData(uid);
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
			} else {
				this.data = [];
			}
		}
	},
	mounted() {
		if (localStorage['uid']) this.uid = localStorage['uid'];
		else if (window.location.hostname === 'localhost') this.uid = 'U13337050';
	},
	methods: {
		fetchData(uid) {
			this.isLoading = true;
			this.$axios.get('https://api.mcut-course.com/passport.php?uid=' + encodeURIComponent(uid)).then(response => {
				const payload = response.data && response.data.data ? response.data.data : [];
				this.data = payload;
			}).catch(() => {
				this.data = [];
			}).finally(() => {
				this.isLoading = false;
			});
		}
	}
};
</script>

<style>
</style>