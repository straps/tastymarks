<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <title-card title="Last Saved Bookmarks by " subject="all Users"></title-card>
      </v-flex>
      <v-flex xs12 v-for="b in bookmarks" :key="b.id">
        <bookmark-card :bookmark="b"></bookmark-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios'
import BookmarkCard from '@/components/BookmarkCard'
import TitleCard from '@/components/TitleCard'
import moment from 'moment'
export default {
  async asyncData (context) {
    let { data } = await axios.get('/api/bookmarks')
    return { bookmarks: data }
  },
  methods: {
    fmtDate (datetime, fmt) {
      fmt = fmt || 'DD/MM/YY [at] HH:mm'
      return moment(datetime).format(fmt)
    }
  },
  components: {
    BookmarkCard,
    TitleCard
  }
}
</script>
