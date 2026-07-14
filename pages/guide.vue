<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-guide">
		<div class="ts-header is-icon is-center-aligned has-vertically-spaced-large" v-if="loading">
			<span class="ts-icon is-spinning is-spinner-icon"></span>
			<div class="has-top-padded-small">讀取中...</div>
		</div>
		<div class="ts-container is-very-narrow has-vertically-padded-large" v-html="html">
			
		</div>
	</div>
</template>
<style>
</style>
<script>
import { mapState } from 'vuex'
export default {
	head() {
		return {
			title: '選課指南 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '選課指南 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
	},
	data() {
		return {
			html: '',
			loading: true
		};
	},
	mounted () {
		this.$axios.get('https://api.mcut-course.com/guide.php')
		.then(response => {
			this.html = response.data;
			this.loading = false;
		})
		.catch(error => {
			console.error('Error fetching guide:', error);
		});
	}
};
</script>