<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-guide">
		<div class="ts-header is-icon is-center-aligned has-vertically-spaced-large" v-if="loading">
			<span class="ts-icon is-spinning is-spinner-icon"></span>
			<div class="has-top-padded-small">讀取中...</div>
		</div>
		<div class="ts-container is-very-narrow has-vertically-padded-large" v-else>
			<div v-html="html"></div>
			<div class="ts-box ad is-hollowed box-mobile-spaced" v-if="showAd">
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
			<div v-html="html2"></div>
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
			title: '選課指南 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '選課指南 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
	},
	data() {
		return {
			html: '',
			html2: '',
			loading: true
		};
	},
	mounted () {
		this.$axios.get('https://api.mcut-course.com/guide.php')
		.then(response => {
			let html = response.data;
			this.html = html.split('<!--more-->')[0];
			this.html2 = html.split('<!--more-->')[1] || '';
			this.loading = false;
		})
		.catch(error => {
			console.error('Error fetching guide:', error);
		});
	}
};
</script>