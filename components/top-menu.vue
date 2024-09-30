<template>
	<div class="cell">
		<div class="print-only">明志科技大學選課小幫手</div>
		<div class="ts-container is-fitted navbar">
			<div class="ts-tab is-center-aligned">
				<NuxtLink
					v-for="item in menuItems"
					:key="item.path"
					:to="isActive(item.path) ? '' : item.path"
					:class="{ 'is-active': isActive(item.path) }"
					class="item"
				>
					<span class="ts-icon" :class="item.icon"></span>
					<div class="label">
						{{ item.label }}
						<span v-if="item.path === '/saved/' && savedCourse.length > 0" class="ts-badge is-small is-dense">
							{{ savedCourse.length }}
						</span>
					</div>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<style>
.navbar .ts-tab .item:hover {
	cursor: pointer;
}

.navbar .ts-tab .ts-badge {
	background-color: var(--ts-primary-600);
	color: var(--ts-static-gray-50);
	margin-top: -.25rem;
	padding: .125rem .35rem;
}

@media (max-width: 768px) {
	.navbar .ts-tab .item {
		flex-direction: column;
		align-items: center;
		gap: .3rem;
		padding: .3rem 0 .1rem;
		width: 25%;
		font-size: .9rem;
	}

	.navbar .ts-tab .item .ts-icon {
		font-size: 1.2rem;
		line-height: 1.2;
	}

	.navbar .ts-tab .item {
		position: relative;
	}

	.navbar .ts-badge {
		position: absolute;
		bottom: 45%;
		left: 55%;
		padding: .1rem .3rem;
		font-size: .7rem;
	}
}
</style>

<script>
export default {
	mounted() {
		this.savedCourse = JSON.parse(localStorage.getItem('savedCourse')) || [];
		this.$root.$on('updateSavedCourse', (savedCourse) => {
			this.savedCourse = savedCourse;
		});
		this.currentPath = this.$router.currentRoute.path;
		this.$router.afterEach((to) => {
			this.currentPath = to.path;
		});
	},
	data() {
		return {
			savedCourse: [],
			currentPath: '',
			menuItems: [
				{
					path: '/',
					label: '搜尋課程',
					icon: 'is-magnifying-glass-icon',
				},
				{
					path: '/saved/',
					label: '收藏的課程',
					icon: 'is-star-icon',
				},
				{
					path: '/rule/',
					label: '畢業學分門檻',
					icon: 'is-graduation-cap-icon',
				},
				{
					path: '/info/',
					label: '選課資訊',
					icon: 'is-circle-info-icon',
				},
			],
		};
	},
	methods: {
		isActive(path) {
			if (path === '/') return this.currentPath === '/';
			else return this.currentPath.includes(path);
		}
	},
};
</script>