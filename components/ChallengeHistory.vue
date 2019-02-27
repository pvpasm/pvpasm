<template>
  <b-table striped hover :outlined="true" :items="challenges" :fields="fields">
    <template slot="result" slot-scope="data">
      <div>
        <fa 
          v-for="(score, index) in data.item.myScore"
          :key="index"
          :icon="getIcon(score)"
        />
        <strong>{{ data.item.myTime }}</strong>
        <fa icon="bolt" class="mx-3" />
        <fa
          v-for="(score, index) in data.item.oppScore"
          :key="index"
          :icon="getIcon(score)"
        />
        <strong>{{ data.item.oppTime }}</strong>
      </div>
    </template>

    <template slot="date" slot-scope="data">
      {{ `${data.value.getDate()}/${data.value.getMonth() + 1}/${data.value.getFullYear()}` }}
    </template>
  </b-table>
</template>

<script>
export default {
  name: 'ChallengeHistory',
  data() {
    return {
      fields: ['opponent', 'result', 'date']
    }
  },
  computed: {
    challenges() {
      return this.$store.state.challenge.history
    }
  },
  methods: {
    getIcon(score) {
      if (score === 1) return 'check'
      else if (score === 0) return 'times'
      else return 'question'
    }
  }
}
</script>
