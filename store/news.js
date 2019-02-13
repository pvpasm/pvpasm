export const state = () => ({
  newsList: []
})

export const mutations = {
  update(state, list) {
    state.newsList = list
  }
}
