<template>
	<div class="cell is-scrollable is-fluid is-horizontal">
		<loading loadingText="請稍候..." v-if="loading"></loading>
	</div>
</template>
<script>
export default {
	head() {
		return {
			title: '登入 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '登入 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	data() {
		return {
			loading: true,
		}
	},
	mounted() {
		if(this.$route.query.auth_key) localStorage['auth_key'] = this.$route.query.auth_key;
		
		if(localStorage['auth_key'] == undefined || localStorage['auth_key'] == '') {
			window.location.href = 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1661015282&redirect_uri=https%3A%2F%2Fapi.mcut-course.com%2Fuser%2F&scope=profile&state=1';
		} else {
			localStorage['myCourseSync'] = '';
			localStorage['savedCourseSync'] = '';
			this.$router.push(localStorage['next_path'] || '/');
		}
	}
}
</script>