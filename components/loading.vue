<template>
	<div class="ts-mask is-centered">
		<div class="ts-loading is-large"></div>
		<span>{{ loadingText }}</span>
	</div>
</template>
<script>
export default {
	props: {
		loadingText: {
			type: String,
			default: '讀取中...'
		}
	}
};
</script>
<style>
.ts-mask * {
	color: var(--ts-static-gray-100) !important;
}
</style>