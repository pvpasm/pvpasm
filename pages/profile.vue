<template>
  <b-container class="content">
    <b-row class="h-100">
      <b-card 
        class="border-primary my-auto mx-auto w-50"
        title="Profile"
      >
        <b-form-group
          id="field-username"
          label="Username"
          label-for="input-username"
        >
          <b-form-input
            id="input-username"
            v-model="username"
            disabled
          />
        </b-form-group>

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
          id="field-comment"
          label-for="input-comment"
          label="Comment"
        >
          <b-form-textarea 
            id="input-comment"
            v-model="comment"
            :rows="3"
          />
        </b-form-group>

        <b-form-group
          id="field-current-password"
          label="Current Password"
          label-for="input-current-password"
          :state="currentPasswordState"
          :valid-feedback="validCurrentPassword"
          :invalid-feedback="invalidCurrentPassword"
        >
          <b-form-input
            id="input-current-password"
            v-model="currentPassword"
            type="password"
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

        <b-button variant="primary" :disabled="!valid" @click="update">
          Update
        </b-button>

        <b-alert 
          class="mt-4"
          variant="danger"
          dismissible
          :show="error.length > 0"
        >
          {{ error }}
        </b-alert>

        <b-alert 
          class="mt-4"
          variant="success"
          dismissible
          :show="success"
        >
          Successfully updated profile!
        </b-alert>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      success: false,
      error: false,
      email: '',
      username: '',
      currentPassword: '',
      password: '',
      password2: '',
      comment: ''
    }
  },
  computed: {
    emailState() {
      return this.email.length > 0
    },
    usernameState() {
      return this.username.length > 0
    },
    currentPasswordState() {
      return this.currentPassword.length > 0
    },
    passwordState() {
      return this.password === this.password2
    },
    valid() {
      return (
        this.usernameState &&
        this.passwordState &&
        this.emailState &&
        this.currentPasswordState
      )
    },
    validCurrentPassword() {
      return ''
    },
    invalidCurrentPassword() {
      return 'Current password must not be empty to make changes'
    },
    validEmail() {
      return ''
    },
    invalidEmail() {
      return 'Invalid email'
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
    async update() {
      if (!this.valid) return

      this.error = ''
      this.success = false

      try {
        await this.$axios.post('/api/user/profile', {
          email: this.email,
          comment: this.comment,
          password: this.currentPassword,
          newPassword: this.password
        })
        this.success = true
      } catch (err) {
        this.error = err.response.data.error
      }
    }
  },
  async created() {
    const { data } = await this.$axios.get('api/user/profile')
    this.username = data.username
    this.comment = data.comment
    this.email = data.email
  }
}
</script>
