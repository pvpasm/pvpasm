<template>
  <b-container class="py-4">
    <b-table v-if="hasData" :outlined="true" striped hover :items="leaderboard" />
    <h3 class="text-center mt-5" v-else>There are no users yet</h3>
  </b-container>
</template>

<script>
export default {
  name: 'Leaderboard',
  data() {
    return {}
  },
  computed: {
    hasData() {
      return this.leaderboard.length > 0
    }
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/leaderboard')
    return {
      leaderboard: data
    }
  }
}
</script>
