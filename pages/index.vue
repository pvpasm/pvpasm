<template>
  <b-container class="my-5">
    <b-row>
      <b-col>
        <About />
      </b-col>
      <b-col offset="1">
        <News />
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
