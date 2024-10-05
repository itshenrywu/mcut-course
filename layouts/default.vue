<template>
	<div class="ts-app-layout is-fullscreen is-vertical">
		<top-menu />
		<Nuxt />
		<div class="cell">
			<div class="footer">Powered by <a href="https://line.me/R/ti/p/%40ptq1966v" target="_blank">MCUT Bot</a> /
				<a href="https://henrywu.tw" target="_blank">Henry Wu</a> | 
				<NuxtLink to="/about">建議或問題回報</NuxtLink>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	head() {
		return {
			htmlAttrs: {
				lang: 'zh-TW',
			}
		}
	},
	mounted() {
		if(localStorage['acceptTerms'] == undefined) {
			this.$swal({
				title: '關於本站 & 免責聲明',
				html: '<div style="text-align:left">\
					本網站由明志科技大學 107 級工業工程與管理系畢業校友 <a target="_blank" href="https://henrywu.tw">Henry Wu</a> 開發製作，並非學校官方系統。若您對本網站有任何疑慮，請避免使用。<br><br>\
					本網站的資料來源於<a rel="nofollow" target="_blank" href="https://bit.ly/4eqiQKH">明志科技大學年度開課資料查詢系統</a>及<a rel="nofollow" target="_blank" href="https://bit.ly/3TKmBCq">入學課程總表查詢系統</a>，且會自動同步資料。由於資料可能因網路狀況而有所延遲或缺漏，內容僅供參考，實際資訊請以學校公告為準。如因資料錯誤導致任何損失，本站概不負責。\
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
	background-color: #FF914A;
	color: #FFF;
	text-shadow: 0 0 5px rgba(0, 0, 0, .2);
}

.is-green {
	background-color: #08CA81;
	color: #FFF;
	text-shadow: 0 0 5px rgba(0, 0, 0, .2);
}

.is-gray {
	background-color: #9E9E9E;
	color: #FFF;
	text-shadow: 0 0 5px rgba(0, 0, 0, .2);
}

.is-red {
	background-color: #EE7996;
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

@media screen and (max-width: 768px) {
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
}
</style>