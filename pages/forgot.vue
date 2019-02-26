<template>
  <b-container class="content">
    <b-row class="h-100">
      <b-card 
        class="border-primary mx-auto my-auto w-50"
        title="Forgot your password?"
      >
        <div v-if="!done">
          <b-form-group
          id="field-email"
          label="Email"
          label-for="input-email"
          >
          <b-form-input 
            id="input-email"
            type="email"
            v-model.trim="email" 
            @keyup.enter.native="forgot"
          />
          </b-form-group>

          <b-button variant="primary" :disabled="!valid" @click="forgot">
            Submit
          </b-button>

          <b-alert 
            class="mt-4" 
            variant="danger"
            dismissible
            :show="error.length > 0"
          >
            {{ error }}
          </b-alert>
        </div>

        <div v-if="done">
          <p>
            We have emailed a new password to {{ email }}.
          </p>
        </div>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Forgot',
  data() {
    return {
      error: '',
      email: '',
      done: false
    }
  },
  computed: {
    valid() {
      return this.emailState
    },
    emailState() {
      return this.email.length > 0
    }
  },
  methods: {
    async forgot() {
      if (!this.valid) return

      this.error = ''
      try {
        await this.$axios.post(`/api/user/forgot`, {
          email: this.email
        })
        this.done = true
      } catch (err) {
        this.error = err.response.data.error
      }
    }
  }
}
</script>
