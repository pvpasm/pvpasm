<template>
  <b-container class="h-100">
    <b-row class="h-100">
      <b-card class="bg-primary mx-auto my-auto text-white w-50" align-v="center">
        <h4 class="text-center">
          {{ verdict }}
        </h4>

        <b-row class="py-3">
          <b-col class="text-center">
            <h5>{{ p_username }}</h5>
            <div class="py-4">
              <fa icon="check" class="fa-2x mx-1" />
              <fa icon="times" class="fa-2x mx-1" />
              <fa icon="check" class="fa-2x mx-1" />
            </div>
            <div class="py-2">
              <h6>{{ p_duration }}</h6>
            </div>
          </b-col>

          <b-col class="text-center">
            <h5>{{ o_username }}</h5>
            <div class="py-4">
              <fa icon="times" class="fa-2x mx-1" />
              <fa icon="check" class="fa-2x mx-1" />
              <fa icon="check" class="fa-2x mx-1" />
            </div>
            <div class="py-2">
              <h6>{{ o_duration }}</h6>
            </div>
          </b-col>
        </b-row>

        <nuxt-link class="btn btn-secondary btn-block" to="/challenge">
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
    return {
      verdict: 'You Win!',
      p_username: 'you',
      o_username: 'someone',
      p_duration: '10:12',
      o_duration: '8:33'
    }
  },
  methods: {}
}
</script>
