<template>
  <b-container class="py-4">
    <b-table :outlined="true" striped hover :items="leaderboard" />
  </b-container>
</template>

<script>
export default {
  name: 'Leaderboard',
  data() {
    return {}
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/leaderboard')
    return {
      leaderboard: data
    }
  }
}
</script>
