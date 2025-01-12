export const state = () => ({
	show_ad: false
})

export const mutations = {
	setShowAd(state, value) {
		state.show_ad = value;
	}
}