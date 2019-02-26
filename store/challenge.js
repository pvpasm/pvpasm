export const state = () => ({
  history: [],
  puzzleStatus: [-1, -1, -1],
  numSolved: 0,
  result: {}
})

export const mutations = {
  reset(state, mutation) {
    state.puzzleStatus = [-1, -1, -1]
    state.numSolved = 0
  },
  updateHistory(state, history) {
    state.history = history
  },
  updatePuzzleStatus(state, mutation) {
    state.puzzleStatus[mutation.index] = mutation.status
    state.numSolved++
  },
  updateResult(state, result) {
    state.result = result
  }
}
