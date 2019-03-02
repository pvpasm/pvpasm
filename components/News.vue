<template>
  <div>
    <h4 class="mb-3">Updates</h4>

    <b-list-group>
      <b-list-group-item
        v-for="news in newsList"
        :key="news._id"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">
            {{ news.title }}
          </h5>
          <small>{{ `${news.date.getDate()}/${news.date.getMonth() + 1}/${news.date.getFullYear()}` }}</small>
        </div>
        <p class="mb-1">
          {{ news.desc }}
        </p>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'News',
  data() {
    return {}
  },
  computed: {
    newsList() {
      return this.$store.state.news.newsList
    }
  }
}
</script>
