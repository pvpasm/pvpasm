<template>
  <b-container class="content">
    <b-row class="h-100">
      <b-card 
        class="border-primary my-auto mx-auto w-50"
        title="Register"
      >
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
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      error: false,
      username: '',
      password: '',
      password2: ''
    }
  },
  computed: {
    usernameState() {
      return this.username.length > 0
    },
    passwordState() {
      return this.password === this.password2 && this.password.length > 0
    },
    valid() {
      return this.usernameState && this.passwordState
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
