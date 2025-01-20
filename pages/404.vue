<template>
	<div class="ts-app-center">
		<div>
			<div class="ts-header is-icon is-center-aligned is-big">
				<span class="ts-icon ts-icon is-circle-exclamation-icon"></span>
				找不到此頁面
			</div>
			<div class="ts-text is-center-aligned has-top-padded">
				此連結可能已失效，<br>
				請點擊上方選單中的其他連結。
			</div>
		</div>
	</div>
</template>
<script>
export default {
	head() {
		return {
			title: '404 找不到此頁面 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '404 找不到此頁面 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
};
</script>