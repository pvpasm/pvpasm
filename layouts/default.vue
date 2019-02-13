<template>
  <div class="h-100">
    <div class="h-100">
      <Navbar />
      
      <nuxt />
    </div>

    <div class="bg-primary text-white p-3">
      pvpasm 2019
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>
