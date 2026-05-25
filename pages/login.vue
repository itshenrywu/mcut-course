<template>
	<div class="cell is-scrollable is-fluid is-horizontal">
		<loading loadingText="登入中..." v-if="loading"></loading>
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
		const hash = new URLSearchParams(window.location.hash.slice(1))
		const token = hash.get('token')
		if (token) {
			localStorage['auth_key'] = token
			history.replaceState(null, '', window.location.pathname)
		}
		
		if(localStorage['auth_key'] == undefined || localStorage['auth_key'] == '') {
			let uri = 'https://mcut-course.com/login';
			if(window.location.hostname === 'localhost') uri = 'http://localhost:10000/auth/line/callback';

			window.location.href = 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1661015282&redirect_uri=' + encodeURIComponent(uri) + '&scope=profile&state=' + encodeURIComponent(window.location.origin)
		} else {
			localStorage['myCourseSync'] = '';
			localStorage['savedCourseSync'] = '';
			this.$router.push(localStorage['last_path'] || '/');
		}
	}
}
</script>