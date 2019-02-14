<template>
  <b-container class="h-100">
    <b-row class="h-100">
      <b-card class="mx-auto my-auto w-75" :class="getCardClass()">
        <b-row class="py-4 mx-auto">
          <code class="code">{{ puzzle }}</code>
        </b-row>

        <b-form-group
          id="field-code"
          label="Code"
          label-for="input-code"
        >
          <b-form-textarea 
            id="input-code"
            v-model="code"
            placeholder="Your code"
            :rows="3" 
            :disabled="status != -1"
          />
        </b-form-group>
        
        <b-button variant="secondary" :block="true" :disabled="status != -1 || !code" @click="submit">
          Submit
        </b-button>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Puzzle',
  props: {
    num: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      puzzle: '',
      status: -1,
      code: ''
    }
  },
  async created() {
    const { data } = await this.$axios.get(`/api/challenge/chall${this.num}`)
    this.puzzle = data.code
  },
  methods: {
    getCardClass() {
      return {
        'bg-primary text-white': this.status === -1,
        'bg-success text-white': this.status === 1,
        'bg-danger text-white': this.status === 0
      }
    },
    async submit() {
      // no time to validate with server
      const { data } = await this.$axios.post(
        `/api/challenge/chall${this.num}`,
        {
          code: this.code
        }
      )
      this.status = data.result

      this.$store.commit('challenge/updatePuzzleStatus', {
        index: this.num - 1,
        status: this.status
      })
    }
  }
}
</script>

<style>
textarea {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
}
</style>
