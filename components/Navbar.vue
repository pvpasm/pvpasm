<template>
  <b-navbar toggleable="md" type="dark" variant="primary">
    <b-navbar-toggle target="nav_collapse" />

    <b-navbar-brand to="/">
      pvpasm
    </b-navbar-brand>

    <b-collapse id="nav_collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item v-if="user" to="/challenge" :class="{ active: route === '/challenge' }">
          Challenge
        </b-nav-item>
        <b-nav-item to="/leaderboard" :class="{ active: route === '/leaderboard' }">
          Leaderboard
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-navbar-nav v-if="!user">
          <b-nav-item to="/login" :class="{ active: route === '/login' }">
            Login
          </b-nav-item>
          <b-nav-item to="/register" :class="{ active: route === '/register' }">
            Register
          </b-nav-item>
        </b-navbar-nav>

        <b-nav-item-dropdown v-if="user" right>
          <template slot="button-content">
            {{ user }}
          </template>
          <b-dropdown-item class="bg-white text-primary" href="#" @click="logout">
            Logout
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$cookies.get('username')
    },
    route() {
      return this.$route.path
    }
  },
  methods: {
    async logout() {
      await this.$axios.post(`/api/user/logout`, {})
      window.location.href = '/'
    }
  }
}
</script>
