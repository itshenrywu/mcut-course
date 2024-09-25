<template>
	<div class="cell">
		<div class="print-only">明志科技大學選課小幫手</div>
		<div class="ts-container is-fitted navbar">
			<div class="ts-tab is-center-aligned">
				<a class="item" :class="{ 'is-active': isActive('/') }" @click="goPage('/')">
					<span class="ts-icon is-magnifying-glass-icon"></span>
					<div class="label">搜尋課程</div>
				</a>
				<a class="item" :class="{ 'is-active': isActive('/saved/') }" @click="goPage('/saved/')" id="menu_saved">
					<span class="ts-icon is-star-icon"></span>
					<div class="label">
						收藏的課程
						<span class="ts-badge is-small is-dense" v-if="savedCourse && savedCourse.length > 0">{{
							savedCourse.length }}</span>
					</div>
				</a>
				<a class="item" :class="{ 'is-active': isActive('/rule/') }" @click="goPage('/rule/')">
					<span class="ts-icon is-graduation-cap-icon"></span>
					<div class="label">畢業學分門檻</div>
				</a>
				<a class="item" :class="{ 'is-active': isActive('/info/') }" @click="goPage('/info/')">
					<span class="ts-icon is-circle-info-icon"></span>
					<div class="label">選課資訊</div>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	mounted() {
		this.savedCourse = JSON.parse(localStorage.getItem('savedCourse')) || [];
		this.$root.$on('updateSavedCourse', (savedCourse) => {
			this.savedCourse = savedCourse;
		});
		this.currentPath = this.$router.currentRoute.path;
		this.$router.afterEach((to, from) => {
			this.currentPath = to.path;
		});
	},
	data() {
		return {
			savedCourse: [],
			currentPath: '',
		};
	},
	methods: {
		isActive(path) {
			if (path == '/') return this.currentPath == '/';
			else return this.currentPath.includes(path);
		},
		goPage(path) {
			this.$router.push(path);
		},
	},
};
</script>
<style>
.navbar .ts-tab .item:hover {
	cursor: pointer;
}

#menu_saved .ts-badge {
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

	.ts-tab .item .ts-icon {
		font-size: 1.2rem;
		line-height: 1.2;
	}

	#menu_saved {
		position: relative;
	}

	#menu_saved .ts-badge {
		position: absolute;
		bottom: 45%;
		left: 55%;
		padding: .1rem .3rem;
		font-size: .7rem;
	}
}
</style>