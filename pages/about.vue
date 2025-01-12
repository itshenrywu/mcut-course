<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-about">
		<div class="ts-container is-very-narrow has-vertically-padded-large">
			<h1 class="ts-header is-huge has-top-padded">關於本站</h1>
			<p>
				明志科技大學選課小幫手由 107 級工業工程與管理系畢業校友 <a target="_blank" href="https://henrywu.tw">Henry Wu</a> 開發製作，幫助您輕鬆查詢全校課表，快速進行課程預排與衝堂檢查，還可以查詢畢業學分門檻及選課時程！
			</p>
			<p>
				MCUT Bot 亦提供許多校園資訊查詢功能，歡迎<a target="_blank" href="https://mcut-bot.henrywu.tw">加入好友</a>以取得更多服務。
			</p>
			<h1 class="ts-header is-huge has-top-padded-large">資料來源</h1>
			<p>
				本站資料擷取自<a rel="nofollow" target="_blank" href="https://bit.ly/4eqiQKH">明志科技大學年度開課資料查詢系統</a>及<a rel="nofollow" target="_blank" href="https://bit.ly/3TKmBCq">入學課程總表查詢系統</a>。
			</p>
			<p>
				學校每日 00:00 及 12:00 更新開課資料，因此本站課程查詢功能將於每日 00:30 及 12:30 前同步課程資料。<br>
				資料可能會因網路狀況而有所延遲或缺漏，內容僅供參考，實際請以學校公告為準。
			</p>
			<h1 class="ts-header is-huge has-top-padded-large">建議／問題回報</h1>
			<p>
				若您有任何想加入的功能、介面的調整改善或其他建議，或使用上遇到問題，歡迎透過 <a target="_blank" href="https://line.me/R/ti/p/%40221oslxd">MCUT Bot 客服</a>聯絡我們。
			</p>
			<p>
				本站前端的部分也有開源！有興趣的朋友可以到 <a target="_blank" href="https://github.com/itshenrywu/mcut-course/">GitHub</a> 查看原始碼<s>，雖然我  Code 寫得很醜</s>。
			</p>
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
};
</script>