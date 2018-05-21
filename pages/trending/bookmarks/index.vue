<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <title-card title="Trending Bookmarks"></title-card>
      </v-flex>
      <v-flex xs12 v-for="b in bookmarks" :key="b.id">
        <bookmark-card :bookmark="b" :showUser="true"></bookmark-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios'
import BookmarkCard from '@/components/BookmarkCard'
import TitleCard from '@/components/TitleCard'
export default {
  async asyncData (context) {
    let { data } = await axios.get('/api/trending/bookmarks')
    return { bookmarks: data }
  },
  components: {
    BookmarkCard,
    TitleCard
  }
}
</script>
