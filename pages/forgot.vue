<template>
  <b-container class="py-5">
    <h3 class="pb-4">Recover your password</h3>

    <div v-if="!done">
      <b-form-group
      id="field-email"
      label="Email"
      label-for="input-email"
      :valid-feedback="validEmail"
      :invalid-feedback="invalidEmail"
      :state="emailState"
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
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.email).toLowerCase()) && this.email.length > 0
    },
    validEmail() {
      return ''
    },
    invalidEmail() {
      if (this.email.length > 0) return 'Invalid email'
      return ''
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
