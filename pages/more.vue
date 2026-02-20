<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-more">
		<div class="ts-container is-very-narrow has-vertically-padded">
			<profile :loading="loading"></profile>
			<div class="ts-content has-top-spaced is-vertically-fitted">
				<div class="ts-text is-description">偏好設定</div>
			</div>
			<div class="ts-menu is-dense">
				<div class="item" data-dropdown="theme-dropdown">
					明暗色系
					<div class="ts-badge has-inverted">
						<span class="ts-icon" :class="[`is-${themes[currentTheme].icon}-icon`]" :style="{ color: themes[currentTheme].icon_color }"></span>
						{{ themes[currentTheme].name }}
					</div>
				</div>
				<div class="ts-dropdown" id="theme-dropdown">
					<button class="item" v-for="(theme, key) in themes" :key="key" @click="setTheme(key)">
						<span class="ts-icon" :class="[`is-${theme.icon}-icon`]" :style="{ color: theme.icon_color }"></span>
						{{ theme.name }}
					</button>
				</div>
			</div>
			<div class="ts-content has-top-spaced is-vertically-fitted">
				<div class="ts-text is-description">課程相關查詢</div>
			</div>
			<div class="ts-menu is-start-icon is-dense">
				<!-- <NuxtLink to="/road" class="item">
					<span class="ts-icon is-person-chalkboard-icon"></span> 大學之道環境與行動路線查詢
				</NuxtLink> -->
				<NuxtLink to="/passport" class="item">
					<span class="ts-icon is-passport-icon"></span> 英語學習護照點數查詢
				</NuxtLink>
				<NuxtLink to="/exam" class="item">
					<span class="ts-icon is-clipboard-check-icon"></span> {{ examDate ? examDate + ' ' : '' }}英語段考考場查詢
				</NuxtLink>
			</div>
			<div class="ts-content has-top-spaced is-vertically-fitted">
				<div class="ts-text is-description">選課相關說明 / 其他查詢</div>
			</div>
			<div class="ts-menu is-start-icon is-dense">
				<NuxtLink to="/info" class="item">
					<span class="ts-icon is-clock-icon"></span> 選課時間及說明
					<div class="ts-badge has-inverted is-small is-dense is-negative red-dot" v-if="showInfoRedDot"></div>
				</NuxtLink>
				<NuxtLink to="/terms" class="item">
					<span class="ts-icon is-list-check-icon"></span> 四技日間部學期安排說明
				</NuxtLink>
				<NuxtLink to="/calendar" class="item">
					<span class="ts-icon is-calendar-days-icon"></span> 行事曆
				</NuxtLink>
			</div>
			<div class="ts-content has-top-spaced is-vertically-fitted">
				<div class="ts-text is-description">說明及支援</div>
			</div>
			<div class="ts-menu is-start-icon is-dense">
				<NuxtLink to="/about" class="item">
					<span class="ts-icon is-file-lines-icon"></span> 關於本站、資料來源及免責聲明
				</NuxtLink>
				<a href="https://henrywu.tw/?openExternalBrowser=1" target="_blank" class="item">
					<span class="ts-icon is-circle-question-icon"></span> 建議及問題回報
				</a>
			</div>

			<div class="ts-box ad is-hollowed box-mobile-spaced has-top-spaced-large" v-if="showAd">
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
		<loading v-show="loading" />
	</div>
</template>
<style>
#page-more .ts-menu .item .ts-badge.red-dot {
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
	async asyncData({ $axios }) {
		try {
			const response = await $axios.get('https://api.mcut-course.com/exam.php');
			const examData = response.data || [];

			let examDate = '';
			if (examData.length > 0 && examData[0][3]) {
				examDate = examData[0][3];
			}
			
			return { examDate };
		} catch (error) {
			return { examDate: '' };
		}
	},
	data() {
		return {
			loading: true,
			profileImage: '',
			profileName: '',
			showInfoRedDot: false,
			showRemoveAdRedDot: false,
			examDate: '',
			themes: {
				system: {
					name: '根據裝置設定',
					icon: 'gear',
					icon_color: '#3498db',
				},
				light: {
					name: '淺色模式',
					icon: 'sun',
					icon_color: '#f1c40f',
				},
				dark: {
					name: '深色模式',
					icon: 'moon',
					icon_color: '#6c5ce7',
				}
			},
			currentTheme: 'system'
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
			this.showInfoRedDot = localStorage['clickInfo_' + process.env.REV] !== 'true';
			this.showRemoveAdRedDot = localStorage['clickRemoveAd'] !== 'true';
		});
		this.showInfoRedDot = localStorage['clickInfo_' + process.env.REV] !== 'true';
		this.showRemoveAdRedDot = localStorage['clickRemoveAd'] !== 'true';
		this.currentTheme = ['system', 'light', 'dark'].includes(localStorage['theme']) ? localStorage['theme'] : 'system';
	},
	methods: {
		setTheme(theme) {
			this.currentTheme = theme;
			localStorage['theme'] = theme;
			document.documentElement.classList.remove('is-light', 'is-dark');
			document.documentElement.classList.add(`is-${theme}`);
			if(theme == 'system') theme = 'auto';
			document.body.setAttribute('data-swal2-theme', theme);
		}
	}
};
</script>