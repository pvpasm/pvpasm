<template>
  <div class="app">
    <Navbar />
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
.app {
  min-height: 100vh;
  position: relative;
  padding-bottom: 60px; /* height of your footer */
}

.footer {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
