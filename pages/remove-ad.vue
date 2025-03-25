<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-remove-ad">
		<div class="ts-container is-very-narrow has-vertically-padded-large">
			<h1 class="ts-header is-huge has-top-padded">移除廣告</h1>
			<p>
				想要移除廣告嗎？只要贊助 NTD $60，即可終生移除廣告！<br>
				本站由工管系畢業校友開發並自費維護，如果這個網站對你有幫助，請考慮支持我！
			</p>
			
			<div>
				<a class="ts-button is-fluid" href="https://www.jkopay.com/transfer?j=Transfer:904036296" target="_blank"  @click="viewing=0">街口支付</a>
			</div>
			<br>
			<div class="button-box" :class="{'viewing': viewing == 1}">
				<a class="ts-button is-fluid" @click="viewing=1">銀行轉帳</a>
				<div class="ts-box">
					<div class="ts-content">
						<div class="ts-grid is-middle-aligned">
							<div class="column is-8-wide mobile-fluid">
								銀行：396 街口電子支付股份有限公司<br>帳號：904036296<br><br>
								或使用網銀 App 讀取 QR Code
							</div>
							<div class="column is-8-wide mobile-fluid">
								<div class="ts-image is-fluid is-centered is-rounded">
									<img src="https://i.imgur.com/te59X7Wm.png">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<br>
			<div class="button-box" :class="{'viewing': viewing == 2}">
				<a class="ts-button is-fluid" @click="viewing=2">LINE Pay Money</a>
				<div class="ts-box">
					<div class="ts-content">
						<div class="ts-grid is-middle-aligned">
							<div class="column is-8-wide mobile-fluid">
								LINE 首頁 > 錢包 > LINE Pay > iPASS MONEY > 轉帳代碼 > 掃描 > 輸入代碼「23430462087」<br><br>
								或用 LINE 掃描以下 QR Code
							</div>
							<div class="column is-8-wide mobile-fluid">
								<div class="ts-image is-fluid is-centered is-rounded">
									<img src="https://i.imgur.com/rcfah3nm.png">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<br>
			<div class="ts-text is-description">
				<span class="ts-badge is-small is-dense">提醒事項</span>
				<div class="ts-list is-ordered">
					<div class="item">請於付款後至 <a href="https://line.me/R/ti/p/%40221oslxd" target="_blank">MCUT Bot 客服中心</a> 提供截圖證明及下方的代碼，以利後續作業。</div>
					<div class="ts-box has-bottom-spaced-small">
						<div class="ts-content is-dense">{{ uid }}</div>
					</div>
					<div class="item has-bottom-spaced-small">處理時間約為 1 ~ 3 個工作天，請耐心等候。</div>
					<div class="item has-bottom-spaced-small">若您過去有贊助過 MCUT Bot，亦可直接聯繫客服領取無廣告特權！</div>
				</div>
			</div>
		</div>
		<loading v-show="loading" />
	</div>
</template>
<style>
	.button-box > div {
		display: none;
	}

	.button-box.viewing > a {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	
	.button-box.viewing > div {
		display: block;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
</style>
<script>
import { mapState } from 'vuex'
export default {
	head() {
		return {
			title: '移除廣告 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '移除廣告 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	data() {
		return {
			loading: true,
			viewing: 0,
			uid: '-'
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
	},
	mounted() {
		if(!localStorage['auth_key']) {
			location.href = '/login/';
			this.loading = false;
		} else {
			this.profileImage = localStorage['profile_image'];
			this.profileName = localStorage['profile_name'];
			this.uid = localStorage['uid'];
			this.$root.$on('showProfileImage', (profileImage) => {
				this.profileImage = profileImage;
				this.profileName = localStorage['profile_name'];
				this.loading = false;
			});

			if(this.profileImage && this.profileName) {
				localStorage['clickRemoveAd'] = 'true';
				this.$root.$emit('checkRedDot');
			}
		}
	},
};
</script>