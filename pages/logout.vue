<template>
	<div class="cell is-scrollable is-fluid is-horizontal">
		<loading loadingText="正在登出..." v-if="loading"></loading>
	</div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
	head() {
		return {
			title: '登出 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '登出 | 明志科技大學選課小幫手' },
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
		if(localStorage['auth_key'] == undefined || localStorage['auth_key'] == '') {
			location.href = localStorage['last_path'] || '/';
		} else {
			let last_path = localStorage['last_path'];
			Object.keys(localStorage).forEach((key) => {
				if(!['theme', 'acceptTerms', 'clickInfo_' + process.env.REV].includes(key)) {
					localStorage.removeItem(key);
				}
			});
			indexedDB.deleteDatabase('mcut-course');
			
			this.$root.$emit('showProfileImage', null);
			this.setSavedCourse([]);
			location.href = last_path || '/';
		}
	},
	methods: {
		...mapMutations(['setSavedCourse']),
	}
}
</script>