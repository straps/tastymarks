<template>
  <v-flex xs12>
    <bookmark-card transition class="mb-3" v-for="b in bookmarks" :key="b.id" :bookmark="b" v-bind="{showUser, canDelete}"></bookmark-card>
  </v-flex>
</template>

<script>
import BookmarkCard from './BookmarkCard'
export default {
  props: {
    bookmarks: {
      type: Array,
      default: []
    },
    showUser: {
      default: true
    },
    canDelete: {
      default: false
    }
  },
  components: {
    BookmarkCard
  }
}
</script>

<style scoped>
</style>
