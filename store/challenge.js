export const state = () => ({
  history: []
})

export const mutations = {
  updateHistory(state, history) {
    state.history = history
  }
}
