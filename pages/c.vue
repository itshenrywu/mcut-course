<template>
	<div class="cell is-scrollable is-fluid is-horizontal"></div>
</template>
<script>
export default {
	mounted() {
		localStorage.clear();
		location.href = '/';
	},
}
</script>