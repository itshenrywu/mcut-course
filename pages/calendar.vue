<template>
	<div class="cell is-secondary is-fluid is-scrollable" id="page-calendar">
		<div class="calendar-header">
			<div class="ts-grid is-compact">
				<div class="column is-4-wide">
					<a class="item is-text" data-dropdown="dropdown-type">
						<span>{{ currentType }}</span>
						<span class="ts-icon is-angle-down-icon"></span>
					</a>
					<div class="ts-dropdown" id="dropdown-type" data-position="bottom-start">
						<button v-for="type in types" :key="type" class="item" :data-type="type" @click="changeType(type)">{{ type }}</button>
					</div>
				</div>
				<div class="column is-8-wide">
					<div class="item is-text">
						<div class="ts-wrap is-center-aligned">
							<a @click="switchMonth('today')" v-if="currentView == 'dayGridMonth'" :class="currentMonth == nowMonth ? 'ts-text is-disabled' : ''">
								<span class="ts-icon is-arrow-rotate-right-icon" v-if="currentMonth <= nowMonth"></span>
								<span class="ts-icon is-arrow-rotate-left-icon" v-else></span>
								回本月
							</a>
							<a @click="switchMonth('today')" v-else :class="Math.floor(currentMonth/100) == Math.floor(nowMonth/100) ? 'ts-text is-disabled' : ''">
								<span class="ts-icon is-arrow-rotate-right-icon" v-if="Math.floor(currentMonth/100) <= Math.floor(nowMonth/100)"></span>
								<span class="ts-icon is-arrow-rotate-left-icon" v-else></span>
								回今年
							</a>
							<a @click="switchMonth('export')" style="display:none;">
								<span class="ts-icon is-file-export-icon"></span> 匯出
							</a>
						</div>
					</div>
				</div>
				<div class="column is-4-wide" style="text-align: right;">
					<a class="item is-text" data-dropdown="dropdown-view">
						<span id="text-view">{{ currentView == 'dayGridMonth' ? '月曆檢視' : '清單檢視' }}</span>
						<span class="ts-icon is-angle-down-icon"></span>
					</a>
					<div class="ts-dropdown" id="dropdown-view" data-position="bottom-end">
						<button class="item" @click="changeView('dayGridMonth')">月曆檢視</button>
						<button class="item" @click="changeView('listYear')">清單檢視</button>
					</div>
				</div>
				<div class="column is-4-wide larger">
					<a class="item" @click="switchMonth('prev')" :class="currentMonth <= minMonth ? 'ts-text is-disabled' : ''">
						<span class="ts-icon is-chevron-left-icon"></span>
					</a>
				</div>
				<div class="column is-8-wide larger" style="text-align: center;">
					<div class="item is-text">{{ title }}</div>
				</div>
				<div class="column is-4-wide larger" style="text-align: right;">
					<a class="item" @click="switchMonth('next')" :class="currentMonth >= maxMonth ? 'ts-text is-disabled' : ''">
						<span class="ts-icon is-chevron-right-icon"></span>
					</a>
				</div>
			</div>
		</div>
		<FullCalendar
			ref="fullCalendar"
			:options="calendarOptions"
			class="calendar-container"
		/>
		<loading v-show="loading" />
	</div>
</template>

<style>
#page-calendar {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.calendar-header {
	padding: .5rem;
}

.calendar-header .larger {
	font-size: 1.2rem;
}

.calendar-header a:hover {
	cursor: pointer;
}

.calendar-container {
	flex: 1;
	min-height: 0;
	overflow: hidden;
}

.calendar-container .fc {
	height: 100% !important;
}

.fc-theme-standard .fc-scrollgrid {
	border: none;
}

.fc .fc-scrollgrid-section-sticky > * {
	background: transparent;
}

.fc-theme-standard td,
.fc-theme-standard th {
	background: transparent;
	border-color: var(--ts-gray-300);
}

.fc-theme-standard td:last-child,
.fc-theme-standard th:last-child {
	border-right: none;
}

.fc .fc-daygrid-day.fc-day-today {
	background-color: var(--ts-gray-200);
}

.fc .fc-list-day-cushion {
	background-color: var(--ts-gray-50);
}

.fc.fc-list {
	border: none;
}

.fc .fc-list-empty {
	background-color: transparent;
}

.fc .fc-list-empty-cushion {
	margin: 40vh 0;
}

.fc .fc-listYear-view {
	border: none!important
}

.fc .fc-listYear-view th {
	border: none
}

.fc .fc-listYear-view td {
	border-top: none;
}

.fc .fc-list-event:hover td {
	background-color: transparent
}

.fc-daygrid-day-top a {
	font-size: .8rem;
}

.fc-event {
	height: 1.5rem;
}

.fc-event-title {
	font-size: .8rem !important;
	line-height: 1.5rem;
	padding: 0;
}

.fc-list-event-title small {
	color: var(--ts-gray-600)
}

.fc-list-event-graphic {
	padding: 0!important;
}

.fc .fc-list-sticky .fc-list-day > th {
	background: transparent;
}

.fc .fc-daygrid-day-number {
	font-size: .8rem;
	padding-bottom: 0;
	line-height: .8rem;
}

.fc-theme-standard .fc-popover {
	border: none;
	border-radius: .25rem;
}

.fc-theme-standard .fc-popover-header {
	background: var(--ts-gray-300);
}

.fc-theme-standard .fc-popover-body {
	background: var(--ts-gray-400);
	padding: .25rem 0!important;
}

.fc-theme-standard .fc-popover-body .fc-daygrid-event-harness {
	margin: .125rem 0
}

.fc-col-header-cell.fc-day  .fc-scrollgrid-sync-inner {
	font-size: .8rem
}

.fc-day-sat,
.fc-day-sun {
	background-color: rgba(255, 0, 0, .02)!important;
}
</style>

<script>
import { mapState } from 'vuex'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

export default {
	components: {
		FullCalendar
	},
	data() {
		return {
			loading: true,
			type: '大一',
			currentTitle: '',
			currentMonth: new Date().getFullYear()*100+new Date().getMonth()+1,
			nowMonth: new Date().getFullYear()*100+new Date().getMonth()+1,
			title: '',
			types: ['大一', '大二', '大三', '大四', '研究所', '課外組 - 社團活動', '體育室 - 場地借用'],
			currentType: '大一',
			currentView: 'dayGridMonth',
			eventList: [],
			loadedYear: [],
			minMonth: 202401,
			maxMonth: (new Date().getFullYear()+1)*100+12,
			calendarOptions: {
				plugins: [dayGridPlugin, listPlugin],
				initialView: 'dayGridMonth',
				headerToolbar: false,
				events: [],
				dayMaxEventRows: true,
				displayEventTime: false,
				locale: 'en',
				dayHeaderContent: function(arg) {
					if(arg.view.type == 'dayGridMonth') return ['日','一','二','三','四','五','六'][arg.date.getDay()];
					else if(arg.view.type == 'listYear') return (arg.date.getMonth()+1) + ' 月 '+arg.date.getDate()+' 日 (' + ['日','一','二','三','四','五','六'][arg.date.getDay()]+')';
				},
				views: {
					dayGridMonth: {
						titleFormat: function(d) {return d.date.year + ' 年 ' + (d.date.month+1) + ' 月'},
					},
					listYear: {
						titleFormat: function(d) {return d.date.year + ' 年'},
						noEventsContent: '目前還沒有資料！'
					}
				},
				loading: (isLoading) => {
					if(!isLoading) this.loading = false;
				},
				datesSet: (dateInfo) => {
					this.updateTitle(dateInfo);
				},
				eventDidMount: (info) => {
					if(info.view.type == 'listYear' && info.event.extendedProps.l) {
						const titleElement = info.el.querySelector('.fc-list-event-title');
						if (titleElement) {
							titleElement.innerHTML += `<br><small>${info.event.extendedProps.l}</small>`;
						}
					}
					
					const graphicElement = info.el.querySelector('.fc-list-event-graphic');
					if (graphicElement) {
						const backgroundColor = info.event.backgroundColor || '#34495e';
						graphicElement.style.background = backgroundColor;
					}
				},
				dayPopoverFormat: function(d) {return d.date.year + ' 年 '+ (d.date.month+1) + ' 月 ' + (d.date.day) + ' 日 (' + ['日','一','二','三','四','五','六'][new Date(d.date.marker).getDay()]+')'},
			}
		}
	},
	head() {
		return {
			title: '行事曆 | 明志科技大學選課小幫手',
			meta: [
				{ hid: 'og:title', property: 'og:title', content: '行事曆 | 明志科技大學選課小幫手' },
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
		updateTitle(dateInfo) {
			const calendarApi = this.$refs.fullCalendar.getApi();
			this.title = calendarApi.currentData.viewTitle;
		},
		switchMonth(action) {
			const calendarApi = this.$refs.fullCalendar.getApi();
			if(action == 'today') {
				calendarApi.today();
			} else if(action == 'prev') {
				calendarApi.prev();
			} else if(action == 'next') {
				calendarApi.next();
			}

			let now = new Date();
			let current = calendarApi.getDate();
			this.currentMonth = current.getFullYear()*100+current.getMonth()+1;
			this.nowMonth = now.getFullYear()*100+now.getMonth()+1;

			if(!this.loadedYear.includes(current.getFullYear())) {
				this.getEventList();
			}
		},
		changeView(view) {
			this.currentView = view;
			const calendarApi = this.$refs.fullCalendar.getApi();
			calendarApi.changeView(view);
			localStorage['calendar_view'] = view;
		},
		changeType(type) {
			this.currentType = type;
			this.eventList = [];
			this.loadedYear = [];
			this.getEventList();
			localStorage['calendar_type'] = type;
		},
		getEventList() {
			this.loading = true;
			let type = this.currentType;
			if(type.split(' - ').length == 2) type = type.split(' - ')[0];
			this.$axios.get(`https://api.mcut-course.com/calendar.php?type=${type}&date=${this.currentMonth}`).then(res => {
				let _year = Math.floor(this.currentMonth/100);
				if(!this.loadedYear.includes(_year)) {
					this.loadedYear.push(_year);
				}
				res.data.forEach(item => {
					if(item.title.includes('放假') || item.title.includes('連假')) item.color = '#e74c3c';
					else item.color = '#34495e';
					this.eventList.push(item);
				});
				this.calendarOptions.events = this.eventList;
				this.loading = false;
			});
		}
	},
	mounted() {
		this.calendarOptions.eventClick = (info) => {
			if(info.view.type == 'dayGridMonth') {
				this.$swal({
					title: info.event.title,
					html: '<div style="text-align:left">' + (info.event.extendedProps.g ? `<span class="ts-icon is-users-icon"></span> ` +
							(
								info.event.extendedProps.g.split(',').length != 5 ?
								info.event.extendedProps.g.split(',').map(n => ({'g1':'大一','g2':'大二','g3':'大三','g4':'大四','m':'研究所'})[n]).join('、') : '所有學生'
							)
						+ '<br>':'') +
						`<span class="ts-icon is-clock-icon"></span> ${info.event.extendedProps.d}` +
						(info.event.extendedProps.l ? `<br><span class="ts-icon is-location-dot-icon"></span> ${info.event.extendedProps.l}` : '') +
						(info.event.extendedProps.r ? `<br><br>${info.event.extendedProps.r}` : '') + '</div>',
					showConfirmButton: false,
					showCloseButton: true,
				});
			}
		};

		this.currentType = localStorage['calendar_type'] || '大一';
		if(localStorage['calendar_view'] == 'listYear') {
			this.changeView('listYear');
		}

		this.getEventList();
		
		const now = new Date();
		this.currentTitle = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月`;
	}
};
</script>