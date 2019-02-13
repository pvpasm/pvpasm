<template>
  <b-container>
    <b-row>
      <b-col class="pt-5">
        <News />
      </b-col>
      <b-col class="pt-5" offset="1">
        <About />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import News from '@/components/News'
import About from '@/components/About'

export default {
  components: {
    News,
    About
  },
  async fetch({ store, $axios }) {
    const { data } = await $axios.get('/api/news')
    store.commit(
      'news/update',
      data.map(item => ({
        ...item,
        date: new Date(item.createdAt)
      }))
    )
  }
}
</script>
