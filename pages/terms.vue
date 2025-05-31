<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-terms">
		<div class="ts-container is-narrow has-top-padded-large has-bottom-padded is-fitted">
			<h1 class="ts-header is-huge has-vertically-padded mobile-padded">四技日間部學期安排說明</h1>
			<div class="ts-box">
				<table class="ts-table is-celled">
					<thead>
						<tr>
							<th colspan="2"><span>9</span><span>月</span></th>
							<th v-for="month in [10,11,12,1,2,3,4,5,6,7,8]" colspan="4"><span>{{ month }}</span><span>月</span></th>
							<th colspan="2"><span>9</span><span>月</span></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="year in terms" :key="year[0].name">
							<td v-for="col in year" :colspan="col.colspan" :class="{ 'is-secondary' : col.important }" v-html="col.name"></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="ts-text is-description is-small has-top-padded mobile-padded">
				* 雖然時間是在暑假，但實際上是要上大三上學期的課程（跟一般上課一樣，會有期中考、期末考）
			</div>
		</div>
		<loading v-show="loading" />
	</div>
</template>

<style>
#page-terms .ts-table {
	table-layout: fixed;
}

#page-terms .ts-table td,
#page-terms .ts-table th {
	font-size: .9rem;
	padding: 1rem 0;
	text-align: center;
	vertical-align: middle;
}

#page-terms .ts-table th span {
	display: inline-block;
	margin-left: .125rem;
}

@media (max-width: 767.98px) {
	#page-terms .ts-table th span {
		font-size: .6rem;
		display: block;
		margin-left: 0;
		line-height: .8rem;
	}

	#page-terms .ts-table td {
		font-size: .75rem;
	}
}
</style>

<script>
import { mapState } from 'vuex'

export default {
	data() {
		return {
			loading: true,
			terms: [
				[
					{name: '大一上', colspan: 18, important: 1},
					{name: '&nbsp;', colspan: 2},
					{name: '大一下', colspan: 18, important: 1},
					{name: '<span class="ts-text is-secondary">唯一的</span>暑假', colspan: 10}
				],
				[
					{name: '大二上', colspan: 18, important: 1},
					{name: '&nbsp;', colspan: 2},
					{name: '大二下', colspan: 18, important: 1},
					{name: '大三上 <span class="ts-text is-description">*</span>', colspan: 10, important: 1}
				],
				[
					{name: '大三下<small>（實習、遠距選修課程）</small>', colspan: 48, important: 1}
				],
				[
					{name: '大四上', colspan: 18, important: 1},
					{name: '&nbsp;', colspan: 2},
					{name: '大四下', colspan: 18, important: 1},
					{name: '&nbsp;', colspan: 10}
				]
			]
		}
	},
	head() {
		return {
			title: '四技日間部學期安排說明 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '四技日間部學期安排說明 | 明志科技大學選課小幫手' },
				{ hid: 'og:url', property: 'og:url', content: 'https://mcut-course.com/' + this.$router.currentRoute.path },
			]
		}
	},
	computed: {
		...mapState({
			showAd: state => state.show_ad
		}),
	},
	methods: {
		
	},
	mounted() {
		this.loading = false;
	}
};
</script>