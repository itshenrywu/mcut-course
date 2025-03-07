<template>
	<div class="ts-app-center">
		<div v-if="error.statusCode === 404">
			<div class="ts-header is-icon is-center-aligned is-big">
				<span class="ts-icon ts-icon is-circle-exclamation-icon"></span>
				找不到此頁面
			</div>
			<div class="ts-text is-center-aligned has-top-padded">
				此連結可能已失效，<br>
				請點擊上方選單中的其他連結。
			</div>
		</div>
		<div v-else>
			<div class="ts-header is-icon is-center-aligned is-big">
				<span class="ts-icon ts-icon is-circle-exclamation-icon"></span>
				發生錯誤
			</div>
			<div class="ts-text is-center-aligned has-top-padded">請<a href="/c">清除本機資料後</a>再試。</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ['error'],
	head() {
		return {
			htmlAttrs: {
				lang: 'zh-TW'
			}
		}
	}
};
</script>