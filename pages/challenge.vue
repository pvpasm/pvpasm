<template>
  <b-container>
    <b-row>
      <b-col class="pt-5">
        <ChallengeHistory />
      </b-col>

      <b-col class="pt-5" offset="1">
        <b-list-group>
          <b-list-group-item class="active">
            <h5 class="mb-1">
              Classic
            </h5>
            <div class="mb-1 pt-2">
              <ol>
                <li>
                  Find an opponent.
                </li>
                <li>
                  Complete 3 asm riddles of varying difficulty.
                </li>
                <li>
                  The one with the most riddles correct wins. Or if there is a tie, the fastest one wins.
                </li>
              </ol>
            </div>
          </b-list-group-item>
          
          <b-list-group-item class="disabled">
            <h5 class="mb-1">
              Friendly
            </h5>
            <div class="mb-1 pt-2">
              <p>Same rules as classic but compete against a friend.</p>
              <small>Not available yet</small>
            </div>
          </b-list-group-item>
        </b-list-group>

        <nuxt-link class="btn btn-primary btn-lg btn-block mt-4" to="/classic">
          Start Challenge
        </nuxt-link>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ChallengeHistory from '@/components/ChallengeHistory'

const getTimeText = time => {
  return `(${Math.floor(time / 60)}m ${time % 60}s)`
}

const getRowVariant = win => {
  if (win === 1) return 'success'
  else if (win === 0) return 'danger'
  else return 'info'
}

export default {
  name: 'Challenge',
  components: {
    ChallengeHistory
  },
  data() {
    return {}
  },
  async fetch({ store, $axios }) {
    const { data } = await $axios.get(`/api/challenge/history`)
    const challenges = data.map(item => ({
      ...item,
      myTime: getTimeText(item.myTime),
      oppTime: item.oppTime === 0 ? '' : getTimeText(item.oppTime),
      date: new Date(item.date),
      opponent: item.opponent ? item.opponent : '---',
      _rowVariant: getRowVariant(item.win)
    }))
    store.commit('challenge/updateHistory', challenges)
  }
}
</script>
