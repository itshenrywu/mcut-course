export default ({ store }) => {
	window.addEventListener('storage', (e) => {
		if (e.key === 'savedCourse') {
			let savedCourse = [];
			if (e.newValue !== null) {
				try { savedCourse = JSON.parse(e.newValue); } catch {}
			}
			store.commit('setSavedCourse', savedCourse);
		}
	});
};
