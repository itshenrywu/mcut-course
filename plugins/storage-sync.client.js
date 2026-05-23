export default ({ store }) => {
	window.addEventListener('storage', (e) => {
		if (e.key === 'savedCourse' && e.newValue !== null) {
			let savedCourse = [];
			try { savedCourse = JSON.parse(e.newValue); } catch {}
			store.commit('setSavedCourse', savedCourse);
		}
	});
};
