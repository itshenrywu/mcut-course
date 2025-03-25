<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-info">
		<div class="ts-container has-top-padded-large is-fitted">
			<div class="ts-grid is-middle-aligned">
				<div class="column is-12-wide mobile-fluid">
					<h1 class="ts-header is-huge has-vertically-padded mobile-padded">選課時間</h1>
				</div>
				<div class="column is-4-wide mobile-fluid mobile-padded">
					<a class="ts-button is-fluid" target="_blank" rel="nofollow" href="http://day.course.mcut.edu.tw/?openExternalBrowser=1">前往選課系統</a>
				</div>
			</div>
			<br>
			<div class="ts-box">
				<div class="ts-content">
					<span class="ts-badge has-bottom-spaced-small is-small is-dense">注意事項</span>
					<div class="ts-list is-ordered">
						<div class="item">四技部必修課程已由系統自動預選，選修課程（四技通識、專業課程）須自行選課。</div>
						<div class="item">選課確認時，「相同名稱但時段分開」的課程會分開顯示，計算累積學分時算一次即可。</div>
						<div class="item">
							若無登入過校園入口網，選課密碼預設為身分證字號（大寫）。若忘記密碼請洽電算中心
							<a href="tel:0229089899,2270">2908-9899#2270</a>。
						</div>
						<div class="item">
							選課問題請洽教務處課務組
							<a href="tel:0229089899,2207">2908-9899#2207</a>
							<a href="tel:0229089899,2208">#2208</a>
							<a href="tel:0229089899,2209">#2209</a>。
						</div>
					</div>
				</div>
			</div>
			<br>
			<div class="ts-box" id="info">
				<table class="ts-table is-definition">
					<thead>
						<tr>
							<th>學制/年級</th>
							<th>選課學期</th>
							<th>網路初選</th>
							<th>網路加退選</th>
							<th>選課下限</th>
							<th>選課上限</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="info in info" :key="info[0]">
							<td v-for="item in info" :class="{ 'is-empty': item === '' }">{{ item }}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<br>
			<div class="ts-box ad is-hollowed box-mobile-spaced" v-if="showAd">
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
			<br>
			<loading v-show="loading" />
		</div>
	</div>
</template>
<style>
@media (max-width: 767.98px) {
	#page-info table,
	#page-info tbody,
	#page-info tfoot,
	#page-info th,
	#page-info td,
	#page-info tr {
		display: block;
	}

	#page-info thead {
		display: none;
	}

	#page-info .ts-table tbody tr td {
		padding: .1rem 1rem
	}

	#page-info tbody td:nth-child(1),
	#page-info tbody td:nth-child(2) {
		font-size: 1rem;
		padding-bottom: 0 !important;
	}

	#page-info tbody td:nth-child(1),
	#page-info tbody td:nth-child(2),
	#page-info tbody td:nth-child(5),
	#page-info tbody td:nth-child(6) {
		width: 49%;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}

	#page-info .ts-table.is-definition tr td:first-child {
		background: transparent;
		font-weight: bold;
	}

	#page-info td:before {
		color: var(--ts-gray-500);
	}

	#page-info td:nth-child(2):before {
		content: "選課學期：";
	}

	#page-info td:nth-child(3):before {
		content: "初選：";
	}

	#page-info td:nth-child(4):before {
		content: "加退選：";
	}

	#page-info td:nth-child(5):before {
		content: "選課下限：";
	}

	#page-info td:nth-child(6):before {
		content: "選課上限：";
	}

	#page-info td.is-empty {
		display: none !important;
	}

	#page-info tr {
		padding: .5rem 0 !important;
	}

	#page-info .ts-grid .column.mobile-fluid {
		width: var(--16-wide);
		max-width: var(--16-wide);
	}
}
</style>
<script>
import { mapState } from 'vuex'
export default {
	async asyncData({ $axios, params, payload }) {
		const res = await $axios.get('https://api.mcut-course.com/get_info.php?v2');
		return { info: res.data, loading: false };
	},
	head() {
		return {
			title: '選課時間 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '選課時間 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	data() {
		return {
			info: [],
			loading: true
		}
	},
	mounted() {
		localStorage['clickInfo_20241224'] = 'true';
		this.$root.$emit('checkRedDot');
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
	}
}
</script>