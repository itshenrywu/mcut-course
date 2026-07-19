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
			<template v-for="section in menuSections">
				<div class="ts-content has-top-spaced is-vertically-fitted" :key="section.title" v-if="section.items.length">
					<div class="ts-text is-description">{{ section.title }}</div>
				</div>
				<div class="ts-menu is-start-icon is-dense" :key="section.title + '-menu'" v-if="section.items.length">
					<template v-for="item in section.items">
						<NuxtLink v-if="item.to" :to="item.to" class="item" :key="item.to">
							{{ item.text }}
							<div class="ts-badge has-inverted is-small is-dense is-negative red-dot" v-if="item.redDot"></div>
						</NuxtLink>
						<a v-else :href="item.href" target="_blank" class="item" :class="{ 'is-external': item.external }" :key="item.href">
							{{ item.text }}
						</a>
					</template>
				</div>
			</template>

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
			<div class="ts-content has-top-spaced is-vertically-fitted">
				<div class="ts-text is-secondary is-tiny has-top-spaced-small" style="font-family: 'Courier New', Courier, monospace;">
					{{ buildTime }}
					<a v-if="commitSha" style="text-decoration:none" :href="`https://github.com/itshenrywu/mcut-course/commit/${commitSha}`" target="_blank" rel="noopener noreferrer">{{ commitSha.slice(0, 8) }}</a>
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

#page-more .ts-menu .item.is-external::after {
	font-family: Icons;
	content: "\f401";
	transform: rotate(-45deg);
	color: var(--ts-gray-400);
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
					icon: 'settings',
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
		buildTime() {
			const d = new Date(parseInt(process.env.GEN_TIME));
			const p = (n) => String(n).padStart(2, '0');
			return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
		},
		commitSha() {
			return process.env.COMMIT_SHA || '';
		},
		// 選單清單：改這裡即可，不需另外的 config 檔
		// 有 to → NuxtLink（站內），有 href → <a>（外部），external: true 顯示外部連結圖示
		menuSections() {
			return [
				{
					title: '課程相關查詢',
					items: [
						// { to: '/road', text: '大學之道環境與行動路線查詢' },
						// { to: '/passport', text: '114 學年英語學習護照點數查詢' },
						// { to: '/exam', text: `${this.examDate ? this.examDate + ' ' : ''}英語段考考場查詢` },
					]
				},
				{
					title: '其他查詢',
					items: [
						{ to: '/calendar', text: '行事曆' },
						{ href: 'https://line.me/R/ti/p/@161acthp', text: '學餐菜單 LINE 機器人', external: true },
						{ href: 'https://mcut-run.henrywu.tw/', text: '歷年校園路跑成績', external: true },
					]
				},
				{
					title: '說明及支援',
					items: [
						{ to: '/guide', text: '選課指南' },
						{ to: '/info', text: '選課時間及說明', redDot: this.showInfoRedDot },
						{ to: '/about', text: '關於本站、資料來源及免責聲明' },
						{ to: '/changelog', text: '更新紀錄' },
						{ href: 'https://henrywu.tw/?openExternalBrowser=1', text: '建議及問題回報' },
					]
				},
			];
		},
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