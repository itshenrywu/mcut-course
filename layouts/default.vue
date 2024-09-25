<template>
	<div class="ts-app-layout is-fullscreen is-vertical">
		<top-menu />
		<Nuxt />
		<div class="cell">
			<div class="footer">Powered by <a href="https://line.me/R/ti/p/%40ptq1966v" target="_blank">MCUT Bot</a> /
				<a href="https://henrywu.tw" target="_blank">Henry Wu</a> | <a href="https://line.me/R/ti/p/%40221oslxd"
					target="_blank">問題回報</a></div>
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
	font-size: .8rem;
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

tr.is-not-clickable {
	pointer-events: none;
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

@media screen and (max-width: 768px) {
	.mobile-only {
		display: block;
	}

	html {
		font-size: 14px;
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
		display: none;
		transition: 1s all;
	}

	.sidebar.show {
		display: block;
		position: fixed;
		z-index: 1000;
		overflow-y: scroll;
		height: 100vh;
		height: 100dvh;
		top: 0;
		left: 0;
		transition: 1s all;
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
		display: block;
	}

	.course-table tr td {
		padding: 0 1rem;
	}

	.course-table tbody td.c-half,
	.course-table tbody td.c-class,
	.course-table tbody td.c-name,
	.course-table tbody td.c-type-credit,
	.course-table tbody td.c-teacher {
		width: 46%;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.course-table tbody td.c-name,
	.course-table tbody td.c-teacher {
		width: 52%;
	}

	.course-table td .time {
		display: inline-block;
	}

	.course-table td .time:after {
		content: '、';
	}

	.course-table td .time:last-child:after {
		content: '';
	}

	.course-table td.c-name {
		font-weight: bold;
	}

	.course-table td.c-type-credit:after {
		content: " 學分";
	}

	.course-table td.c-teacher:after {
		content: " 老師";
	}

	.course-table .is-not-clickable td.c-teacher:after {
		content: "";
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
}
</style>