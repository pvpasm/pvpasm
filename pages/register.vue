<template>
  <b-container class="py-5">
    <h3 class="pb-4">Create an account</h3>

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
    />
    </b-form-group>
    <b-form-group
      id="field-username"
      label="Username"
      label-for="input-username"
    >
      <b-form-input
        id="input-username"
        v-model.trim="username"
        @keyup.enter.native="register"
      />
    </b-form-group>

    <b-form-group
      id="field-password"
      label="Password"
      label-for="input-password"
      :valid-feedback="validPassword"
      :invalid-feedback="invalidPassword"
      :state="passwordState"
    >
      <b-form-input
        id="input-password"
        v-model="password"
        type="password"
        @keyup.enter.native="register"
      />
    </b-form-group>

    <b-form-group
      id="field-password2"
      label="Confirm Password"
      label-for="input-password2"
      :valid-feedback="validPassword"
      :invalid-feedback="invalidPassword"
      :state="passwordState"
    >
      <b-form-input
        id="input-password2"
        v-model="password2"
        type="password"
        @keyup.enter.native="register"
      />
    </b-form-group>

    <b-button variant="primary" :disabled="!valid" @click="register">
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
  </b-container>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      error: false,
      email: '',
      username: '',
      password: '',
      password2: ''
    }
  },
  computed: {
    emailState() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.email).toLowerCase()) && this.email.length > 0
    },
    usernameState() {
      return this.username.length > 0
    },
    passwordState() {
      return this.password === this.password2 && this.password.length > 0
    },
    valid() {
      return this.usernameState && this.passwordState && this.emailState
    },
    validEmail() {
      return ''
    },
    invalidEmail() {
      if (this.email.length > 0) return 'Invalid email'
      return ''
    },
    invalidPassword() {
      if (this.passwordState) {
        return ''
      }
      if (this.password.length === 0) {
        return ''
      }
      return "Passwords don't match!"
    },
    validPassword() {
      return this.passwordState ? 'Passwords match' : ''
    }
  },
  methods: {
    async register() {
      if (!this.valid) return

      this.error = ''
      try {
        await this.$axios.post('/api/user/register', {
          email: this.email,
          username: this.username,
          password: this.password
        })
        window.location.href = '/'
      } catch (err) {
        this.error = err.response.data.error
      }
    }
  }
}
</script>
