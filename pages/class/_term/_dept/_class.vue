<template>
	<div class="cell is-scrollable is-fluid is-horizontal"></div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
	async asyncData({ payload }) {
		if (payload) {
			return {
				classData: payload.split(',')
			}
		}
	},
	mounted() {
		this.checkSameTerm();
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
				{ hid: 'og:image', property: 'og:image', content: 'https://mcut-course-og.henrywu.tw' + this.$router.currentRoute.path + '.jpg?t=' + Date.now() },
				{ hid: 'twitter:image', name: 'twitter:image', content: 'https://mcut-course-og.henrywu.tw' + this.$router.currentRoute.path + '.jpg?t=' + Date.now() }
			]
		}
	},
	methods: {
		...mapMutations(['setSavedCourse']),
		async checkSameTerm() {
			this.savedCourse = await this.$store.dispatch('getSavedCourse');
			if (this.savedCourse[0] && this.savedCourse[0].substring(0, 4) !== this.$route.params.term) {
				this.$swal({
					title: '無法查看跨學期的課程',
					icon: 'warning',
					html: '是否要清空目前已收藏的課程，並切換至 ' + this.term + ' 學期？',
					confirmButtonText: '清空並切換',
					cancelButtonText: '取消',
					showCancelButton: true,
				})
					.then((res) => {
						if (res.isConfirmed) {
							this.savedCourse = [];
							this.setSavedCourse([this.savedCourse]);
							this.redirect();
						} else {
							this.$router.replace('/course/');
						}
					});
			} else {
				this.redirect();
			}
		},
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