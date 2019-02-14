<template>
  <b-container class="h-100">
    <b-row class="h-100">
      <b-card 
        class="mx-auto my-auto text-white w-50"
        align-v="center"
        :bg-variant="getBgVariant(result.win)"
      >
        <h4 class="text-center">
          {{ verdict }}
        </h4>

        <b-row class="py-3">
          <b-col class="text-center" md="5">
            <h5>{{ username }}</h5>
            <div class="py-4">
              <fa 
                v-for="(score, index) in result.myScore"
                class="mx-1"
                :key="index"
                :icon="getIcon(score)"
              />
            </div>
            <div class="py-2">
              <h6>{{ getTimeText(result.myTime) }}</h6>
            </div>
          </b-col>

          <b-col md="2" class="text-center">
            <fa icon="bolt" class="fa-3x h-100" />
          </b-col>

          <b-col class="text-center" md="5">
            <div v-if="result.opponent">
              <h5>{{ result.opponent }}</h5>
              <div class="py-4">
                <fa
                  v-for="(score, index) in result.oppScore"
                  class="mx-1"
                  :key="index"
                  :icon="getIcon(score)"
                />
              </div>
              <div class="py-2">
                <h6>{{ getTimeText(result.oppTime) }}</h6>
              </div>
            </div>
            <div v-if="!result.opponent" class="d-flex h-100">
              <h5 class="align-self-center">Waiting for opponent...</h5>
            </div>
          </b-col>
        </b-row>

        <nuxt-link class="btn btn-primary btn-block" to="/challenge">
          Back
        </nuxt-link>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Result',
  data() {
    return {}
  },
  computed: {
    result() {
      return this.$store.state.challenge.result
    },
    username() {
      return this.$cookies.get('username')
    },
    verdict() {
      if (this.result.win === 0) return 'You lost...'
      else if (this.result.win === 1) return 'You win!'
      else return ''
    }
  },
  methods: {
    getIcon(score) {
      if (score === 1) return 'check'
      else if (score === 0) return 'times'
      else return 'question'
    },
    getTimeText(time) {
      if (time > 0) {
        const mm = Math.floor(time / 60 / 1000)
        const ss = Math.floor(time / 1000) % 60
        const ms = time % 1000
        return `(${mm}m ${ss}s ${ms})`
      } else {
        return ''
      }
    },
    getBgVariant(win) {
      if (win === 1) return 'success'
      else if (win === 0) return 'danger'
      else return 'info'
    }
  }
}
</script>
