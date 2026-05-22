export const state = () => {
	let savedCourse = [];
	if (typeof localStorage !== 'undefined') {
		try { savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]'); } catch(e) {}
	}
	return {
		show_ad: false,
		savedCourse,
	};
}

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
		savedCourse = Array.from(new Set(savedCourse));
		localStorage['savedCourse'] = JSON.stringify(savedCourse || []);
		state.savedCourse = savedCourse;
	}
}

export const actions = {
	addSavedCourse(context, courseId) {
		let savedCourse = [];
		try { savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]'); } catch(e) {}
		if (!savedCourse.includes(courseId)) savedCourse.push(courseId);
		context.commit('setSavedCourse', [savedCourse]);
	},
	removeSavedCourse(context, courseId) {
		let savedCourse = [];
		try { savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]'); } catch(e) {}
		savedCourse = savedCourse.filter(id => id !== courseId);
		context.commit('setSavedCourse', [savedCourse]);
	},
	toggleSavedCourse(context, courseId) {
		let savedCourse = [];
		try { savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]'); } catch(e) {}
		if (savedCourse.includes(courseId)) {
			savedCourse = savedCourse.filter(id => id !== courseId);
		} else {
			savedCourse.push(courseId);
		}
		context.commit('setSavedCourse', [savedCourse]);
	},
	addMultipleSavedCourses(context, courseIds) {
		let savedCourse = [];
		try { savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]'); } catch(e) {}
		courseIds.forEach(id => { if (!savedCourse.includes(id)) savedCourse.push(id); });
		context.commit('setSavedCourse', [savedCourse]);
	},
	replaceSavedCourse(context, courses) {
		context.commit('setSavedCourse', [courses]);
	},
	clearSavedCourse(context) {
		context.commit('setSavedCourse', [[],  false]);
	},
	clearSavedCourseByTerm(context, term) {
		let savedCourse = [];
		try { savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]'); } catch(e) {}
		const prefix = term.split('-').join('');
		savedCourse = savedCourse.filter(id => !id.startsWith(prefix));
		context.commit('setSavedCourse', [savedCourse]);
	},
	clearSavedRemovedCourse(context, { term, availableIds }) {
		let savedCourse = [];
		try { savedCourse = JSON.parse(localStorage['savedCourse'] ?? '[]'); } catch(e) {}
		const prefix = term.split('-').join('');
		const availableSet = new Set(availableIds);
		savedCourse = savedCourse.filter(id => !id.startsWith(prefix) || availableSet.has(id));
		context.commit('setSavedCourse', [savedCourse]);
	},
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
						const toggleRow = (id, label) =>
							`<label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;cursor:pointer;font-weight:bold">` +
							`<input type="checkbox" id="${id}" checked style="width:16px;height:16px;flex-shrink:0">` +
							`<span>${label}</span></label>`;

						const courseRow = (courseId, cls) => {
							const termRaw = courseId.substring(0, 4);
							const term = termRaw.substring(0, 3) + '-' + termRaw.substring(3, 4);
							return `<label style="display:flex;align-items:center;gap:8px;margin:4px 0;cursor:pointer;padding-left:24px">` +
								`<input type="checkbox" value="${courseId}" class="${cls}" checked style="width:16px;height:16px;flex-shrink:0">` +
								`<span>${term} ${res.data.courseData[courseId].name}</span>` +
								`</label>`;
						};

						let html = '<div style="text-align:left">' +
							toggleRow('toggle-local', '登入前收藏的課程') +
							local.map(id => courseRow(id, 'conflict-local')).join('') +
							'<div style="margin-top:14px"></div>' +
							toggleRow('toggle-online', '儲存於帳號中的課程') +
							online.map(id => courseRow(id, 'conflict-online')).join('') +
							'</div>';

						const syncToggle = (toggleId, cls) => {
							const toggle = document.getElementById(toggleId);
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
							},
							preConfirm: () => {
								const checked = [...document.querySelectorAll('.conflict-local:checked, .conflict-online:checked')];
								return [...new Set(checked.map(el => el.value))];
							}
						});
						if (sres.isConfirmed) {
							savedCourse = sres.value;
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