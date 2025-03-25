<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-more">
		<div class="ts-container is-very-narrow has-vertically-padded">
			<profile v-if="!loading"></profile>
			<div class="ts-content has-top-spaced">
				<div class="ts-text is-description">更多功能</div>
			</div>
			<div class="ts-menu is-start-icon">
				<NuxtLink to="/info" class="item">
					<span class="ts-icon is-clock-icon"></span> 選課時間及說明
					<div class="ts-badge has-inverted is-small is-dense is-negative" v-if="showInfoRedDot"></div>
				</NuxtLink>
				<NuxtLink to="/remove-ad" class="item" v-if="profileImage && profileName && showAd">
					<span class="ts-icon is-wand-magic-sparkles-icon"></span> 移除廣告
					<div class="ts-badge has-inverted is-small is-dense is-negative" v-if="showRemoveAdRedDot"></div>
				</NuxtLink>
			</div>
			<div class="ts-content has-top-spaced">
				<div class="ts-text is-description">相關說明及支援</div>
			</div>
			<div class="ts-menu is-start-icon">
				<NuxtLink to="/about" class="item">
					<span class="ts-icon is-file-lines-icon"></span> 關於本站、資料來源及免責聲明
				</NuxtLink>
				<a href="https://line.me/R/ti/p/%40221oslxd" target="_blank" class="item">
					<span class="ts-icon is-circle-question-icon"></span> 建議及問題回報
				</a>
			</div>

			<div class="ts-box ad is-hollowed box-mobile-spaced has-top-spaced-large" v-if="showAd">
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
		</div>
		<loading v-show="loading" />
	</div>
</template>
<style>
#page-more .ts-menu .item .ts-badge{
	width: .5rem;
	height: .5rem;
	display: block;
	padding: 0;
	margin-left: 0
}
</style>
<script>
import { mapState } from 'vuex'
export default {
	data() {
		return {
			loading: true,
			profileImage: '',
			profileName: '',
			showInfoRedDot: false,
			showRemoveAdRedDot: false
		}
	},
	head() {
		return {
			title: '更多功能 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '更多功能 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
	},
	mounted() {
		if(!localStorage['auth_key']) {
			this.loading = false;
		}
		this.profileImage = localStorage['profile_image'];
		this.profileName = localStorage['profile_name'];
		this.$root.$on('showProfileImage', (profileImage) => {
			this.profileImage = profileImage;
			this.profileName = localStorage['profile_name'];
			this.loading = false;
		});

		this.$root.$on('checkRedDot', () => {
			this.showInfoRedDot = localStorage['clickInfo_20241224'] !== 'true';
			this.showRemoveAdRedDot = localStorage['clickRemoveAd'] !== 'true';
		});
		this.showInfoRedDot = localStorage['clickInfo_20241224'] !== 'true';
		this.showRemoveAdRedDot = localStorage['clickRemoveAd'] !== 'true';
	}
};
</script>