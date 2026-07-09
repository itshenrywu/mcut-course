<template>
	<div class="cell">
		<div class="print-only">明志科技大學選課小幫手 | mcut-course.com</div>
		<div v-if="showAnnouncement" style="position: relative; background-color: var(--ts-gray-800); padding: .5rem 0">
			<button v-if="showCloseBtn && announcementId" class="announcement-close" @click="closeAnnouncement">×</button>
			<div class="ts-container" style="text-align: center; color: var(--ts-gray-50); font-size: .9rem">
				<span class="ts-badge is-small is-dense" :class="announcement.type === 'normal' ? 'is-primary' : 'is-negative'">{{ announcement.badge }}</span>
				<span v-html="announcement.message"></span>
			</div>
		</div>
		<div class="ts-container is-fitted navbar">
			<div class="ts-tab is-center-aligned">
				<NuxtLink
					v-for="item in menuItems"
					:key="item.path"
					:to="isActive(item.path) ? '?' : item.path"
					:class="{ 'is-active': isActive(item.path) }"
					class="item"
				>
					<img v-if="item.path === '/more/' && profileImage" :src="'data:image/jpeg;base64,' + profileImage" class="profile-image">
					<span v-else class="ts-icon" :class="item.icon"></span>
					<div class="label">
						{{ item.label }}
						<span v-if="item.path === '/more/' && showRedDot" class="hint"></span>
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

.navbar .ts-tab .item {
	position: relative;
}

.navbar .ts-tab .hint {
	position: absolute;
	top: 25%;
	right: .55%;
	width: .5rem;
	height: .5rem;
	border-radius: 50%;
	background: var(--ts-negative-400);
}

.announcement-close {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: .5rem;
	background: transparent;
	border: none;
	color: var(--ts-gray-50);
	font-size: 1.1rem;
	line-height: 1;
	cursor: pointer;
	padding: .1rem .4rem;
	opacity: .9;
	z-index: 2;
}

/* ensure announcement text does not flow under the close button */
.announcement-close + .ts-container {
	padding-right: 2.2rem;
}

.profile-image {
	width: 1.4rem;
	height: 1.4rem;
	border-radius: 50%;
}

@media (max-width: 767.98px) {
	.navbar .ts-tab .item {
		flex-direction: column;
		align-items: center;
		gap: 0;
		padding: .3rem 0 .1rem;
		width: 25%;
		font-size: .9rem;
	}

	.navbar .ts-tab .item .ts-icon {
		font-size: 1.4rem;
		line-height: 1.4rem;
	}

	.navbar .ts-badge {
		position: absolute;
		bottom: 45%;
		left: 55%;
		padding: .1rem .3rem;
		font-size: .7rem;
	}

	.navbar .ts-tab .hint {
		top: 5%;
		right: 25%;
	}

	/* on small screens move close button to the left and add padding */
	.announcement-close {
		right: .5rem;
		left: auto;
		transform: translateY(-50%);
	}

	.announcement-close + .ts-container {
		padding-right: 2.6rem;
	}
}
</style>

<script>
export default {
	mounted() {
		try {
			const raw = localStorage.getItem('announcement_data');
			if (raw) {
				const obj = JSON.parse(raw);
				// accept either stored shape {badge,message} or API shape {id,title,content}
				if (obj) {
					if (obj.badge && obj.message) {
						this.announcement = obj;
						this.showAnnouncement = true;
					} else if (obj.title && obj.content) {
						this.announcement = { badge: obj.title, message: obj.content, type: obj.type || '' };
						this.announcementId = obj.id || null;
						this.showCloseBtn = obj.no_close ? false : true;
						if (this.announcementId && localStorage['announcement_closed_' + this.announcementId] === 'true') {
							this.showAnnouncement = false;
						} else {
							this.showAnnouncement = true;
						}
					}
				}
			}
		} catch (e) {}

		fetch('https://gh.mcut-course.com/announcement.json', { cache: 'no-store' })
			.then(async (res) => {
				if (!res.ok) throw new Error('bad-response');
				const data = await res.json();
				if (!data || !data.id || !data.title || !data.content) throw new Error('invalid-data');
				this.announcement = { badge: data.title, message: data.content, type: data.type || '' };
				this.announcementId = data.id;
				this.showCloseBtn = !data.no_close;
				const closed = localStorage['announcement_closed_' + data.id] === 'true';
				this.showAnnouncement = !closed;
				localStorage.setItem('announcement_data', JSON.stringify({ id: data.id, title: data.title, content: data.content, type: data.type, no_close: data.no_close }));
			})
			.catch(() => {
				this.showAnnouncement = false;
				localStorage.removeItem('announcement_data');
			});

		this.currentPath = this.$router.currentRoute.path;
		this.$router.afterEach((to) => {
			this.currentPath = to.path;
		});

		this.$root.$on('checkRedDot', () => {
			this.showRedDot = localStorage['clickInfo_' + process.env.REV] !== 'true';
		});
		this.showRedDot = localStorage['clickInfo_' + process.env.REV] !== 'true';

		if(localStorage['auth_key']) this.profileImage = localStorage['profile_image'];
		this.$root.$on('showProfileImage', (profileImage) => {
			if(localStorage['auth_key']) this.profileImage = profileImage;
			else this.profileImage = '';
		});
	},
	data() {
		return {
			currentPath: '',
			showRedDot: false,
			// announcement handling
			showAnnouncement: false,
			showCloseBtn: false,
			announcementId: null,
			announcement: {
				badge: '',
				message: '',
				type: '',
			},
			menuItems: [
				{
					path: '/',
					label: '全校課表',
					icon: 'is-school-icon',
				},
				{
					path: '/my/',
					label: '我的課表',
					icon: 'is-circle-user-round-icon',
				},
				{
					path: '/rule/',
					label: '畢業學分門檻',
					icon: 'is-graduation-cap-icon',
				},
				{
					path: '/more/',
					label: '更多功能',
					icon: 'is-align-left-icon',
				},
			],
			profileImage: '',
		};
	},
	methods: {
		closeAnnouncement() {
			if (this.announcementId) localStorage['announcement_closed_' + this.announcementId] = 'true';
			this.showAnnouncement = false;
		},
		isActive(path) {
			if (path === '/') return this.currentPath === '/' || this.currentPath === '/course/';
			else return this.currentPath.includes(path);
		},
	},
};
</script>