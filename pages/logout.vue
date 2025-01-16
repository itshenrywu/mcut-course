<template>
	<div class="cell is-scrollable is-fluid is-horizontal">
        <loading loadingText="請稍候..." v-if="loading"></loading>
    </div>
</template>
<script>
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
			this.$router.push('/');
		} else {
			this.$swal({
				icon: 'warning',
				title: '您即將登出...',
				html: '要清除收藏的課程和我的課表嗎？',
				confirmButtonText: '登出並清除資料',
				showDenyButton: true,
				denyButtonText: '僅登出，不清除資料',
				denyButtonColor: 'var(--ts-primary-700)',
				showCancelButton: true,
				cancelButtonText: '回首頁',
                allowOutsideClick: false,
				allowEscapeKey: false,
			}).then((res) => {
				if(res.isConfirmed) {
                    localStorage.clear();
                    this.$root.$emit('showProfileImage', '');
                    console.log('ccc');
				}
                else if(res.isDenied) {
					localStorage['myCourseSync'] = '';
					localStorage['savedCourseSync'] = '';
					localStorage['auth_key'] = '';
					localStorage['profile_image'] = '';
					localStorage['next_path'] = '';
					this.$root.$emit('showProfileImage', '');
				}
                this.$router.push('/');
			});
		}
	}
}
</script>