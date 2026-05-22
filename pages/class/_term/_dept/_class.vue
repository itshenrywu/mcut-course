<template>
	<div class="cell is-scrollable is-fluid is-horizontal"></div>
</template>
<script>
export default {
	async asyncData({ payload }) {
		if (payload) {
			return {
				classData: payload.split(',')
			}
		}
	},
	mounted() {
		this.redirect();
	},
	data() {
		return {
			classData: [],
			className: '',
			term: this.$route.params.term.slice(0, 3) + '-' + this.$route.params.term.slice(3),
		}
	},
	head() {
		this.className = this.classData[0] + ' ' + this.classData[1] + ' 年' + this.classData[2] + '班';
		return {
			title: this.term + ' ' + this.className + '班級必修課表 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: this.term + ' ' + this.className + '班級必修課表 | 明志科技大學選課小幫手' },

				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com' + this.$router.currentRoute.path },
				{ hid: 'og:image', property: 'og:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME },
				{ hid: 'twitter:image', name: 'twitter:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME }
			]
		}
	},
	methods: {
		redirect() {
			localStorage['term'] = this.term;
			localStorage['dept'] = this.classData[0];
			localStorage['class'] = this.classData[1] + ' ' + this.classData[2];
			localStorage['type'] = '必修';
			localStorage['showConflict'] = 'true';
			localStorage['searchQuery'] = '';
			this.$router.replace('/course/');
		}
	}
}
</script>