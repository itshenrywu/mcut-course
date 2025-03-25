<template>
	<div class="ts-box is-raised has-top-spaced-large" v-if="!profileImage && !profileName">
		<div class="ts-content is-secondary">
			<div class="ts-grid is-middle-aligned profile-form">
				<div class="column is-11-wide">
					登入後即可跨裝置同步收藏的課程與我的課表！
				</div>
				<div class="column is-5-wide" style="text-align: right;">
					<NuxtLink class="ts-button is-small is-dense is-start-icon is-circular" to="/login/">
						<span class="ts-icon is-arrow-right-to-bracket-icon"></span>
						登入
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
	<div class="ts-box is-raised has-top-spaced-large" v-else>
		<div class="ts-content is-secondary">
			<div class="ts-grid is-middle-aligned profile-form is-compact">
				<div class="column is-2-wide">
					<img v-if="profileImage" :src="'data:image/jpeg;base64,' + profileImage" class="profile-image is-fluid" style="vertical-align: middle;">
				</div>
				<div class="column is-9-wide">
					{{ profileName }}
					<span class="ts-badge is-small is-dense" v-if="!showAd">Pro</span>
				</div>
				<div class="column is-5-wide" style="text-align: right;">
					<button class="ts-button is-small is-dense is-end-icon is-circular" @click="logout()">
						登出
						<span class="ts-icon is-arrow-right-from-bracket-icon"></span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	props: {
		mobileOnly: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			profileImage: null,
			profileName: null,
		}
	},
	mounted() {
		this.profileImage = localStorage['profile_image'];
		this.profileName = localStorage['profile_name'];
		this.$root.$on('showProfileImage', (profileImage) => {
			this.profileImage = profileImage;
			this.profileName = localStorage['profile_name'];
		});
	},
	methods: {
		logout() {
			this.$swal.fire({
				title: '確定要登出嗎？',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: '登出',
				confirmButtonColor: 'var(--ts-negative-600)',
				cancelButtonText: '取消',
			}).then((result) => {
				if(result.isConfirmed) {
					this.$router.replace('/logout/');
				}
			});
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
	},
};
</script>