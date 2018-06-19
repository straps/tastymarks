<template>
  <std-page v-bind="{title, subject, bookmarks, userCanSubscribe, userIsSubscribed, askNewDataPath:dataPath, showBookmarkOwners, canDeleteBookmarks}"></std-page>
</template>

<script>
import axios from '@/plugins/axios'
import StdPage from '@/components/StdPage'

export default {
  async asyncData (context) {
    let rv = {
      dataPath: `/api/bookmarks`
    }

    let res = await axios.get(rv.dataPath, { params: { limit: process.server ? 10 : 5, offset: 0, search: context.store.state.search } })
    rv.bookmarks = res.data

    return rv
  },
  data () {
    return {
      title: 'Last saved bookmarks by ',
      subject: 'all Users',
      userCanSubscribe: false,
      userIsSubscribed: false,
      showBookmarkOwners: true,
      canDeleteBookmarks: false
    }
  },
  methods: {
  },
  components: {
    StdPage
  }
}
</script>
