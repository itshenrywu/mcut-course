<template>
	<div class="ts-app-layout is-fullscreen is-vertical">
		<top-menu />
		<Nuxt />
		<div class="cell">
			<div class="footer">
				Made by <a href="https://henrywu.tw" target="_blank">Henry Wu</a>
			</div>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
	head() {
		return {
			htmlAttrs: {
				lang: 'zh-TW',
			}
		}
	},
	mounted() {
		const wrapper = document.querySelector('.ts-app-layout.is-fullscreen');
		if (!wrapper) return;
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (wrapper.style.height !== '') {
					wrapper.style.height = '';
				}
				if (wrapper.style.minHeight !== '') {
					wrapper.style.minHeight = '';
				}
			});
		});
		observer.observe(wrapper, {
			attributes: true,
			attributeFilter: ['style']
		});
		this.$once('hook:beforeDestroy', () => {
			observer.disconnect();
		});

		if(!['login', 'logout', 'c'].includes(this.$router.currentRoute.path.replace(/\//g, ''))) localStorage['last_path'] = this.$router.currentRoute.path;
		this.$watch('$route', () => {
			this.checkLogin();
			if(!['login', 'logout', 'c'].includes(this.$router.currentRoute.path.replace(/\//g, ''))) localStorage['last_path'] = this.$router.currentRoute.path;
		});
		if(
			!localStorage['acceptTerms'] &&
			!['login', 'logout', 'c'].includes(this.$router.currentRoute.path.replace(/\//g, '')) &&
			!this.$route.query.accept
		) {
			this.$swal({
				title: '關於本站 & 免責聲明',
				html: '<div style="text-align:left">\
					本網站由明志科技大學 107 級工業工程與管理系畢業校友 <a target="_blank" href="https://henrywu.tw">Henry Wu</a> 開發製作，並非學校官方系統。若您對本網站有任何疑慮，請避免使用。<br><br>\
					本網站的資料來源於<a rel="nofollow" target="_blank" href="https://pse.is/7qmpj8">明志科技大學年度開課資料查詢系統</a>及<a rel="nofollow" target="_blank" href="https://pse.is/7qmpsp">入學課程總表查詢系統</a>，且會自動同步資料。由於資料可能因網路狀況而有所延遲或缺漏，內容僅供參考，實際資訊請以學校公告為準。如因資料錯誤導致任何損失，本站概不負責。\
				</div>',
				confirmButtonText: '我同意，繼續使用',
				allowOutsideClick: false,
				allowEscapeKey: false
			}).then((res) => {
				if (res.isConfirmed) {
					localStorage['acceptTerms'] = '1';
				}
			});
		}
		this.checkLogin();
	},
	methods: {
		...mapMutations(['setShowAd']),
		checkLogin() {
			if(localStorage['auth_key'] != undefined && localStorage['auth_key'] != '') {
				this.$axios.get(
					'https://api.mcut-course.com/user/?action=check' + (localStorage['profile_image'] ? '' : '&image=1'),
					{ headers: { authorization: localStorage['auth_key'] } }
				).then((res) => {
					if(!res.data.success) {
						localStorage['auth_key'] = '';
						localStorage['profile_image'] = '';
						localStorage['profile_name'] = '';
						localStorage['uid'] = '';
						location.reload();
					}
					if(!res.data.hide_ad) {
						this.setShowAd(true);
					}
					else {
						this.setShowAd(false);
						localStorage['clickRemoveAd'] = true;
						this.$root.$emit('checkRedDot');
					}

					if(res.data.image) localStorage['profile_image'] = res.data.image;
					if(res.data.name) localStorage['profile_name'] = res.data.name;
					if(res.data.uid) localStorage['uid'] = res.data.uid;
					this.$root.$emit('showProfileImage', localStorage['profile_image']);
				})
				.catch((err) => {
					localStorage['auth_key'] = '';
					localStorage['profile_image'] = '';
					localStorage['profile_name'] = '';
					localStorage['uid'] = '';
					location.reload();
					this.$root.$emit('showProfileImage', '');
				});
			} else {
				localStorage['myCourseSync'] = '';
				localStorage['profile_name'] = '';
				localStorage['uid'] = '';
				this.setShowAd(true);
				this.$root.$emit('showProfileImage', '');
			}
		}
	}
};
</script>
<style>
html {
	font-size: 16px;
}

body {
	height: 100vh;
	height: 100dvh;
	font-family: sf pro tc,sf pro text,sf pro icons,pingfang tc,helvetica neue,helvetica,arial,microsoft jhenghei,wf_SegoeUI,segoe ui,Segoe,segoe wp,Tahoma,Verdana,Ubuntu,bitstream vera sans,dejavu sans,微軟正黑體,lihei pro,wenquanyi micro hei,droid sans fallback,ar pl uming tw,Roboto,hiragino maru gothic pron,メイリオ,ヒラギノ丸ゴ pron w4,Meiryo,droid sans,sans-serif;
}

.swal2-html-container a {
	color: var(--ts-primary-600);
}

.nuxt-progress {
	background-color: var(--ts-primary-600);
}

.ts-app-layout.is-fullscreen {
	height: 100vh;
	height: 100dvh;
	overflow: hidden;
}

::selection {
	background-color: rgba(64, 169, 255, .4);
}

h1 {
	margin-top: 0;
	margin-bottom: 0;
}

.footer {
	text-align: center;
	font-size: 80%;
	padding: 5px;
	font-size: .75rem;
}

.ts-statistic .value {
	font-size: 1.5rem;
}

.ts-box .symbol .ts-icon {
	font-size: 5rem;
}

.print-only {
	display: none;
}

.sidebar {
	width: 260px;
}

.mobile-only {
	display: none;
}

.close-sidebar {
	position: absolute;
	right: .5rem;
	top: .5rem;
}

.ts-badge.is-primary {
	background-color: var(--ts-primary-600);
	color: var(--ts-static-gray-50);
}

.course-table tr.is-not-clickable:hover {
	background-color: transparent;
	cursor: default;
}

.course-table td .time {
	display: block;
}

.course-table tr:hover {
	background-color: var(--ts-gray-100);
	cursor: pointer;
}

.ts-blankslate {
	height: 70vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.sport-icon {
	display: inline-block;
	color: var(--ts-gray-500);
	width: 1.4rem;
}

.sport-icon-badminton {
	width: 1.4rem;
	padding-left: 0.15rem;
	padding-right: 0.15rem;
	height: 1.4rem;
	margin-bottom: -0.3rem;
	fill: var(--ts-gray-500);
}

.swal2-modal .swal2-title {
	font-size: 1.5rem;
}

.is-orange {
	background-color: hsl(24, 100%, 62%);
	color: #FFF;
	text-shadow: 0 0 5px rgba(0, 0, 0, .2);
}

.is-green {
	background-color: hsl(157, 92%, 38%);
	color: #FFF;
	text-shadow: 0 0 5px rgba(0, 0, 0, .2);
}

.is-gray {
	background-color: hsl(0, 0%, 59%);
	color: #FFF;
	text-shadow: 0 0 5px rgba(0, 0, 0, .2);
}

.is-red {
	background-color: hsl(345, 77%, 67%);
	color: #FFF;
	text-shadow: 0 0 5px rgba(0, 0, 0, .2);
}

.is-t-red {
	color: #EE7996;
	opacity: .5;
}

.course-table td.c-action {
	text-align: right;
}

.course-table th:last-child {
	text-align: right;
}

.course-table td.c-remark {
	font-size: .8rem;
	color: var(--ts-gray-500);
}

.c-action .ts-icon.gray {
	color: var(--ts-gray-500);
}

.c-action .ts-icon {
	line-height: 1.2rem;
}

.ts-box.ad .ts-content {
	padding-top: .5rem;
}

.alt_course_courses .item {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: .25rem;
}

.button-fab {
	position: fixed;
	bottom: 1rem;
	right: 1rem;
	z-index: 800;
	background: var(--ts-primary-500);
	color: var(--ts-static-gray-50);
	border-radius: 50%;
	width: 4rem;
	height: 4rem;
	font-size: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.button-fab .ts-badge {
	position: absolute;
	top: -.2rem;
	left: -.2rem;
	font-size: .9rem;
	width: 1.5rem;
	height: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.ts-grid {
	--gap: 1rem;
	--4-by-5-wide: calc((100% / (5 / 4)) - var(--gap) + (var(--gap) / (5 / 4)));
	--1-by-5-wide: calc((100% / (5 / 1)) - var(--gap) + (var(--gap) / (5 / 1)));
}

.ts-grid .column.is-4-by-5-wide {
	width: var(--4-by-5-wide);
	max-width: var(--4-by-5-wide);
}

.ts-grid .column.is-1-by-5-wide {
	width: var(--1-by-5-wide);
	max-width: var(--1-by-5-wide);
}

.compare .has-diff {
	color: #EE7996;
}

.ts-statistic .ts-icon {
	margin-right: .25rem;
	font-size: .9rem;
	color: var(--ts-gray-500);
}

.ts-statistic .ts-icon:hover {
	cursor: pointer;
}

@media screen and (max-width: 1023px) {
	.ts-grid .column.tablet-fluid {
		width: var(--16-wide);
		max-width: var(--16-wide);
	}

	.ts-grid .column.tablet-half {
		width: var(--8-wide);
		max-width: var(--8-wide);
	}
}

@media screen and (max-width: 767.98px) {
	html {
		font-size: 14px;
	}

	.course-table tr:hover {
		background-color: transparent;
	}

	.mobile-hidden {
		display: none !important;
	}

	.mobile-only {
		display: block;
	}

	.ts-statistic .value {
		font-size: 1.2rem;
	}

	.ts-grid .column.mobile-fluid {
		width: var(--16-wide);
		max-width: var(--16-wide);
	}

	.ts-grid .column.mobile-half {
		width: var(--8-wide);
		max-width: var(--8-wide);
	}

	.ts-grid .column.mobile-1-by-4 {
		width: var(--4-wide);
		max-width: var(--4-wide);
	}

	.ts-grid .column.mobile-3-by-4 {
		width: var(--12-wide);
		max-width: var(--12-wide);
	}

	.is-fitted table,
	.is-fitted .ts-box {
		border-radius: 0;
		border-left: 0;
		border-right: 0;
	}

	.sidebar {
		display: block;
		position: fixed;
		height: 100vh;
		height: 100dvh;
		z-index: 1000;
		overflow-y: scroll;
		transition: .5s all;
		top: 0;
		opacity: 0;
		left: -300px;
	}

	.sidebar.show {
		opacity: 1;
		left: 0;
		transition: .5s all;
	}

	.course-table thead {
		display: none;
	}

	.course-table,
	.course-table tbody,
	.course-table tfoot,
	.course-table th,
	.course-table td,
	.course-table tr {
		display: flex;
		flex-direction: column;
	}

	.course-table tr td {
		padding: .05rem 1rem;
	}

	.course-table td.c-class,
	.course-table td.c-name,
	.course-table td.c-teacher {
		width: 100%;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.course-table tr {
		position: relative;
	}

	.course-table td.c-type-credit.mobile-only {
		right: 0;
		top: .7rem;
	}

	.absolute-right {
		display: inline-block;
		position: absolute;
		right: 1rem;
	}

	.course-table td.c-action .ts-badge {
		top: 2.55rem;
		padding: .225rem .5rem;
	}

	.course-table td.c-action .ts-icon {
		bottom: 0;
		color: var(--ts-gray-700);
		padding: .5rem 1rem;
		text-align: right;
		right: 0;
		box-sizing: content-box;
	}

	.course-table td.c-name {
		order: 1;
		font-weight: bold;
		padding-top: .5rem;
	}

	.course-table td.c-name:before,
	.course-table td.c-time:before,
	.course-table td.c-class:before,
	.course-table td.c-class span:before {
		font-family: icons;
		font-weight: 400;
		font-style: normal;
		display: inline-table;
		text-decoration: none;
		text-align: center;
		width: 1.4em;
		-webkit-font-smoothing: antialiased;
		backface-visibility: hidden;
		color: var(--ts-gray-500);
		overflow: hidden;
		margin-right: .5rem;
		font-size: .8rem;
		line-height: 1rem;
		opacity: .75;
	}

	.course-table td.c-name:before {
		content: "\f02d";
	}

	.course-table td.c-class:before {
		content: "\f0c0";
	}

	.course-table td.c-time::before {
		content: "\f073";
	}

	.course-table td.c-class {
		order: 2;
	}

	.course-table td.c-class span {
		display: inline-block;
	}

	.course-table td.c-class span:before {
		margin-left: .5rem;
		content: "\e53d";
	}

	.course-table td.c-time {
		order: 5;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.course-table td.c-remark {
		order: 6;
		padding-left: 2.7rem;
		padding-bottom: .5rem;
	}

	.course-table td .time {
		display: inline-block;
	}

	.course-table td .time:before {
		content: '、';
	}

	.course-table td .time:first-child:before {
		content: '';
	}

	.ts-blankslate {
		height: 60vh;
	}

	.ts-box.box-mobile-spaced {
		border-radius: var(--ts-border-radius-container);
		margin: 0 1rem;
		border-left: 4px dashed var(--ts-gray-300);
		border-right: 4px dashed var(--ts-gray-300);
	}

	.mobile-padded {
		padding: 0 1rem;
	}

	.mobile-padded .ts-box {
		border-radius: var(--ts-border-radius-container);
		border: 1px solid var(--ts-gray-300);
	}

	.button-auto-height {
		min-height: var(--height);
		height: auto;
		white-space: normal;
	}
}

@media print {
	html {
		font-size: 12px;
	}

	.ts-app-layout.is-fullscreen {
		height: auto;
		overflow: visible;
	}

	.ts-button {
		display: none;
	}

	.ts-app-layout.is-fullscreen .navbar {
		display: none;
	}

	.print-only {
		display: block;
		text-align: center;
		font-size: 1.2rem;
	}

	.course-table td.c-action,
	.ts-selection {
		display: none;
	}

	.ad {
		display: none;
	}

	.ts-statistic .ts-icon.is-circle-info-icon {
		display: none;
	}
}
</style>