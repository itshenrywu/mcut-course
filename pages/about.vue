<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-about">
		<div class="ts-container is-very-narrow has-vertically-padded-large">
			<h1 class="ts-header is-huge has-top-padded">關於本站</h1>
			<p>
				明志科技大學選課小幫手由 107 級工業工程與管理系畢業校友 <a target="_blank" href="https://henrywu.tw">Henry Wu</a> 開發製作，幫助您輕鬆查詢全校課表，快速進行課程預排與衝堂檢查，還可以查詢畢業學分門檻及選課時程！
			</p>
			<h1 class="ts-header is-huge has-top-padded-large">資料來源及免責聲明</h1>
			<p>
				本站資料擷取自<a rel="nofollow" target="_blank" href="https://pse.is/7qmpj8">明志科技大學年度開課資料查詢系統</a>及<a rel="nofollow" target="_blank" href="https://pse.is/7qmpsp">入學課程總表查詢系統</a>。
			</p>
			<p>
				學校每日 00:00 及 12:00 更新開課資料，因此本站課程查詢功能將於每日 00:30 及 12:30 前同步課程資料。<br>
				資料可能會因網路狀況而有所延遲或缺漏，內容僅供參考，實際請以學校公告為準。如因資料錯誤導致任何損失，本站概不負責。
			</p>
			<div class="ts-box ad is-hollowed has-top-spaced-large" v-if="showAd">
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
		</div>
	</div>
</template>
<style>
#page-about a {
	color: var(--ts-primary-600);
}

#page-about s {
	color: var(--ts-gray-500);
}
</style>
<script>
import { mapState } from 'vuex'
export default {
	head() {
		return {
			title: '關於本站 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '關於本站 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
	}
};
</script>