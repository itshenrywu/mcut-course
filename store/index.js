export const state = () => ({
	show_ad: false
})

export const mutations = {
	setShowAd(state, value) {
		state.show_ad = value;
	},
	setSavedCourse(state, value) {
		let savedCourse = value[0], sync = value[1] !== false;
		if(sync && localStorage['auth_key'] != undefined && localStorage['auth_key'] != '') {
			this.$axios.post('https://api.mcut-course.com/user/?action=update&saved', 'saved=' + JSON.stringify(savedCourse), { headers: { authorization: localStorage['auth_key'] } })
			.then(res => {
				localStorage['savedCourseSync'] = res.data.updatedAt;
			});
		}
		localStorage['savedCourse'] = JSON.stringify(savedCourse || []);
		state.savedCourse = savedCourse;
	}
}

export const actions = {
	async getSavedCourse(context) {
		let savedCourse = [];
		try {
			savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]');
		} catch(e) {}

		if(localStorage['auth_key'] != undefined && localStorage['auth_key'] != '') {
			await this.$axios.get('https://api.mcut-course.com/user/?action=get&saved&get_course=' + savedCourse.join(','), { headers: { authorization: localStorage['auth_key'] } })
			.then(async res => {
				let online = res.data.saved.filter(courseId => res.data.courseData[courseId] != undefined).sort();
				let local = savedCourse.filter(courseId => res.data.courseData[courseId] != undefined).sort();
				if(!isNaN(new Date(localStorage['savedCourseSync']).getTime()) && new Date(localStorage['savedCourseSync']).getTime() < new Date(res.data.updatedAt).getTime()) {
					savedCourse = online;
					context.commit('setSavedCourse', [savedCourse, false]);
				}
				else if(online.length == 0 && local.length == 0) {
					savedCourse = [];
					context.commit('setSavedCourse', [savedCourse, false]);
				}
				else if(online.length == 0 && local.length >= 1) {
					savedCourse = local;
					context.commit('setSavedCourse', [savedCourse]);
				}
				else if(online.length >= 1 && local.length == 0) {
					savedCourse = online;
					context.commit('setSavedCourse', [savedCourse, false]);
				}
				else {
					let isDifferent = false;
					if(online.length !== local.length) isDifferent = true;
					else {
						for(let i = 0; i < online.length; i++) {
							if(online[i] !== local[i]) {
								isDifferent = true;
								break;
							}
						}
					}

					if(isDifferent) {
						let sameList = [];
						local.forEach(courseId => {
							online.forEach(onlineCourseId => {
								if(courseId == onlineCourseId) {
									sameList.push(courseId);
								}
							});
						});

						const date = new Date(res.data.updatedAt);
						let updatedAt = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0');

						let html = '<div class="ts-grid is-compact is-stretched compare" style="text-align:left">\
							<div class="column is-8-wide"><div class="ts-box"><div class="ts-content is-dense">\
								<span class="ts-badge is-small is-dense" style="background:var(--ts-static-gray-500);color:var(--ts-static-gray-50)">當前收藏的課程 ('+local.length+')</span>' +
								'<br><small>' + local[0].substring(0, 3) + '-' + local[0].substring(3, 4) + ' 學期</small><br>' +
								local.map(courseId => '<div class="compare-course '+(sameList.includes(courseId)?'':' has-diff')+'">' +
									res.data.courseData[courseId].name +
									'</div>'
								).join('') +
							'</div></div></div>\
							<div class="column is-8-wide"><div class="ts-box"><div class="ts-content is-dense">\
								<span class="ts-badge is-small is-dense" style="background:var(--ts-static-primary-600);color:var(--ts-static-gray-50)">收藏於帳號中的課程 ('+online.length+')</span>' +
								'<br><small>' + online[0].substring(0, 3) + '-' + online[0].substring(3, 4) + ' 學期 | 儲存於 ' + updatedAt + '</small><br>' +
								online.map(courseId => '<div class="compare-course '+(sameList.includes(courseId)?'':' has-diff')+'">' +
									res.data.courseData[courseId].name +
									'</div>'
								).join('') +
							'</div></div></div>\
						</div><br><div class="ts-text is-description is-start-aligned">\
							這可能是因為您先前有在別的裝置登入並收藏課程，但跟目前登入前的課程不一致。紅色代表有差異的課程，請選擇一個同步方式。\
						</div>';
						
						const sres = await this.$swal({
							icon: 'warning',
							title: '當前收藏的課程與收藏於帳號中的課程不一致',
							html: html,
							confirmButtonText: '清除當前收藏的課程，使用收藏於帳號中的課程',
							cancelButtonText: '清除收藏於帳號中的課程，使用當前收藏的課程',
							showCancelButton: true,
							allowOutsideClick: false,
							allowEscapeKey: false,
							focusConfirm: false,
							reverseButtons: true,
							didOpen() {
								document.querySelectorAll('.swal2-actions button')[0].blur();
							}
						});
						if (sres.isConfirmed) {
							savedCourse = online;
							context.commit('setSavedCourse', [savedCourse, false]);
						} else {
							savedCourse = local;
							context.commit('setSavedCourse', [savedCourse]);
						}
					} else {
						context.commit('setSavedCourse', [savedCourse]);
					}
				}
				localStorage['savedCourseSync'] = res.data.updatedAt;
			});
		}
		return savedCourse;
	}
}