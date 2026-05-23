export const state = () => ({
	show_ad: false,
	savedCourse: [],
})

export const mutations = {
	setShowAd(state, value) {
		state.show_ad = value;
	},
	setSavedCourse(state, savedCourse) {
		if (!Array.isArray(savedCourse)) savedCourse = [];
		savedCourse = Array.from(new Set(savedCourse.filter(id => typeof id === 'string')));
		localStorage['savedCourse'] = JSON.stringify(savedCourse);
		state.savedCourse = savedCourse;
	}
}

export const actions = {
	addSavedCourse(context, courseId) {
		const savedCourse = [...context.state.savedCourse];
		if (!savedCourse.includes(courseId)) savedCourse.push(courseId);
		context.commit('setSavedCourse', savedCourse);
		context.dispatch('syncSavedCourseToServer');
	},
	removeSavedCourse(context, courseId) {
		const savedCourse = context.state.savedCourse.filter(id => id !== courseId);
		context.commit('setSavedCourse', savedCourse);
		context.dispatch('syncSavedCourseToServer');
	},
	toggleSavedCourse(context, courseId) {
		let savedCourse = [...context.state.savedCourse];
		if (savedCourse.includes(courseId)) {
			savedCourse = savedCourse.filter(id => id !== courseId);
		} else {
			savedCourse.push(courseId);
		}
		context.commit('setSavedCourse', savedCourse);
		context.dispatch('syncSavedCourseToServer');
	},
	addMultipleSavedCourses(context, courseIds) {
		const savedCourse = [...context.state.savedCourse];
		courseIds.forEach(id => { if (!savedCourse.includes(id)) savedCourse.push(id); });
		context.commit('setSavedCourse', savedCourse);
		context.dispatch('syncSavedCourseToServer');
	},
	replaceSavedCourse(context, courses) {
		context.commit('setSavedCourse', courses);
		context.dispatch('syncSavedCourseToServer');
	},
	clearSavedCourse(context) {
		context.commit('setSavedCourse', []);
		context.dispatch('syncSavedCourseToServer');
	},
	clearSavedCourseByTerm(context, term) {
		const prefix = term.split('-').join('');
		const savedCourse = context.state.savedCourse.filter(id => !id.startsWith(prefix));
		context.commit('setSavedCourse', savedCourse);
		context.dispatch('syncSavedCourseToServer');
	},
	clearSavedRemovedCourse(context, { term, availableIds }) {
		const prefix = term.split('-').join('');
		const availableSet = new Set(availableIds);
		const savedCourse = context.state.savedCourse.filter(id => !id.startsWith(prefix) || availableSet.has(id));
		context.commit('setSavedCourse', savedCourse);
		context.dispatch('syncSavedCourseToServer');
	},
	async syncSavedCourseToServer(context) {
		if (!localStorage['auth_key']) return;
		try {
			const res = await this.$axios.post(
				'https://api.mcut-course.com/user/?action=update&saved',
				'saved=' + JSON.stringify(context.state.savedCourse),
				{ headers: { authorization: localStorage['auth_key'] } }
			);
			localStorage['savedCourseSync'] = res.data.updatedAt;
		} catch(e) {}
	},
	async getSavedCourse(context) {
		let savedCourse = [];
		try {
			savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]');
		} catch(e) {}

		context.commit('setSavedCourse', savedCourse);

		if(localStorage['auth_key'] != undefined && localStorage['auth_key'] != '') {
			await this.$axios.get('https://api.mcut-course.com/user/?action=get&saved&get_course=' + savedCourse.join(','), { headers: { authorization: localStorage['auth_key'] } })
			.then(async res => {
				let online = res.data.saved.filter(courseId => res.data.courseData[courseId] != undefined).sort();
				let local = savedCourse.filter(courseId => res.data.courseData[courseId] != undefined).sort();
				if(!isNaN(new Date(localStorage['savedCourseSync']).getTime()) && new Date(localStorage['savedCourseSync']).getTime() < new Date(res.data.updatedAt).getTime()) {
					savedCourse = online;
					context.commit('setSavedCourse', savedCourse);
				}
				else if(online.length == 0 && local.length == 0) {
					savedCourse = [];
					context.commit('setSavedCourse', savedCourse);
				}
				else if(online.length == 0 && local.length >= 1) {
					savedCourse = local;
					context.commit('setSavedCourse', savedCourse);
					context.dispatch('syncSavedCourseToServer');
				}
				else if(online.length >= 1 && local.length == 0) {
					savedCourse = online;
					context.commit('setSavedCourse', savedCourse);
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
						const onlineSet = new Set(online);
						const localSet = new Set(local);
						const localOnly = local.filter(id => !onlineSet.has(id));
						const onlineOnly = online.filter(id => !localSet.has(id));
						const common = local.filter(id => onlineSet.has(id));

						const escHtml = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

						const toggleRow = (id, label) =>
							`<label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;cursor:pointer;font-weight:bold">` +
							`<input type="checkbox" id="${escHtml(id)}" checked style="width:16px;height:16px;flex-shrink:0">` +
							`<span>${escHtml(label)}</span></label>`;

						const courseRow = (courseId, cls) => {
							const termRaw = courseId.substring(0, 4);
							const term = termRaw.substring(0, 3) + '-' + termRaw.substring(3, 4);
							return `<label style="display:flex;align-items:center;gap:8px;margin:4px 0;cursor:pointer;padding-left:24px">` +
								`<input type="checkbox" value="${escHtml(courseId)}" class="${escHtml(cls)}" checked style="width:16px;height:16px;flex-shrink:0">` +
								`<span>${escHtml(term)} ${escHtml(res.data.courseData[courseId].name)}</span>` +
								`</label>`;
						};

						let html = '<div style="text-align:left">';
						if (localOnly.length > 0) {
							html += toggleRow('toggle-local', '登入前收藏且不在帳號中的課程') +
								localOnly.map(id => courseRow(id, 'conflict-local')).join('') +
								'<div style="margin-top:14px"></div>';
						}
						if (onlineOnly.length > 0) {
							html += toggleRow('toggle-online', '僅收藏於帳號中的課程') +
								onlineOnly.map(id => courseRow(id, 'conflict-online')).join('') +
								'<div style="margin-top:14px"></div>';
						}
						if (common.length > 0) {
							html += toggleRow('toggle-common', '兩邊都有的課程') +
								common.map(id => courseRow(id, 'conflict-common')).join('');
						}
						html += '</div>';

						const syncToggle = (toggleId, cls) => {
							const toggle = document.getElementById(toggleId);
							if (!toggle) return;
							const boxes = [...document.querySelectorAll('.' + cls)];
							toggle.addEventListener('change', () => boxes.forEach(b => b.checked = toggle.checked));
							boxes.forEach(b => b.addEventListener('change', () => {
								const all = boxes.every(x => x.checked);
								const none = boxes.every(x => !x.checked);
								toggle.indeterminate = !all && !none;
								toggle.checked = all;
							}));
						};

						const sres = await this.$swal({
							icon: 'warning',
							title: '請選擇要保留的課程',
							html: html,
							confirmButtonText: '儲存',
							showCancelButton: false,
							allowOutsideClick: false,
							allowEscapeKey: false,
							didOpen: () => {
								syncToggle('toggle-local', 'conflict-local');
								syncToggle('toggle-online', 'conflict-online');
								syncToggle('toggle-common', 'conflict-common');
							},
							preConfirm: () => {
								const checked = [...document.querySelectorAll('.conflict-local:checked, .conflict-online:checked, .conflict-common:checked')];
								return [...new Set(checked.map(el => el.value))];
							}
						});
						if (sres.isConfirmed) {
							savedCourse = sres.value;
							context.commit('setSavedCourse', savedCourse);
							context.dispatch('syncSavedCourseToServer');
						}
					} else {
						context.commit('setSavedCourse', savedCourse);
						context.dispatch('syncSavedCourseToServer');
					}
				}
				localStorage['savedCourseSync'] = res.data.updatedAt;
			});
		}
		return savedCourse;
	}
}