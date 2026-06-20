<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-changelog">
		<div class="ts-container is-very-narrow has-vertically-padded-large">
			<h1 class="ts-header is-huge has-top-padded">更新紀錄</h1>
			<div v-if="loading" class="ts-text is-secondary has-vertically-padded-large">載入中...</div>
			<div v-else class="ts-list is-unordered changelog-list" style="margin:0">
				<div v-for="item in changelog" :key="item.sha" class="item changelog-item">
					<div class="changelog-body">
						<span v-if="item.type" :class="['ts-badge', typeClass(item.type)]">{{ typeLabel(item.type) }}</span>
						<span class="changelog-desc">{{ item.desc }}</span>
					</div>
					<div class="ts-text is-secondary changelog-date">{{ formatDate(item.time) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
#page-changelog a {
	color: var(--ts-primary-600);
}

#page-changelog .changelog-list {
	list-style: none;
	padding-left: 0;
}

#page-changelog .changelog-item {
	display: flex;
	flex-direction: column;
	padding: 0.6rem 0;
	border-bottom: 1px solid var(--ts-gray-200);
	gap: 0.25rem;
}

#page-changelog .changelog-item:last-child {
	border-bottom: none;
}

#page-changelog .changelog-date {
	font-size: 0.85em;
}

#page-changelog .changelog-body {
	display: inline;
}

#page-changelog .changelog-item .ts-badge {
    margin-right: 0.25rem;
}
</style>
<script>
import { mapState } from 'vuex'

export default {
	head() {
		return {
			title: '更新紀錄 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '更新紀錄 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com' + this.$router.currentRoute.path },
				{ hid: 'og:image', property: 'og:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME },
				{ hid: 'twitter:image', name: 'twitter:image', content: 'https://og.mcut-course.com' + this.$router.currentRoute.path + '.jpg?t=' + process.env.GEN_TIME }
			]
		}
	},
	data() {
		return {
			changelog: [],
			loading: true
		}
	},
	async mounted() {
		try {
			const res = await fetch('/changelog.json?v=' + process.env.GEN_TIME)
			const raw = await res.json()
			this.changelog = raw.map(item => this.parseItem(item))
		} finally {
			this.loading = false
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
	},
	methods: {
		parseItem(item) {
			const msg = item['commit-message']
			const match = msg.match(/^(feat|fix|chore|refactor|style|docs|perf|test):\s*(.+)$/)
			if (match) {
				return { ...item, type: match[1], desc: match[2] }
			}
			return { ...item, type: null, desc: msg }
		},
		formatDate(time) {
			const d = new Date(time)
			return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
		},
		typeLabel(type) {
			if (type === 'feat') return '功能優化'
			if (type === 'fix') return '修正'
			return type
		},
		typeClass(type) {
			if (type === 'feat') return ''
			if (type === 'fix') return 'is-negative'
			return 'is-secondary'
		}
	}
}
</script>
