<template>
  <std-page v-bind="{title, bookmarks, userCanSubscribe, userIsSubscribed, askNewDataPath:dataPath, showBookmarkOwners: true, canDeleteBookmarks: false}"></std-page>
</template>

<script>
import axios from '@/plugins/axios'
import StdPage from '@/components/StdPage'

export default {
  async asyncData (context) {
    let rv = {
      dataPath: `/api/trending/bookmarks`
    }

    let res = await axios.get(rv.dataPath, { params: { limit: process.server ? 10 : 5, offset: 0, search: context.store.state.search } })
    rv.bookmarks = res.data

    return rv
  },
  data () {
    return {
      title: 'Trending Bookmarks',
      userCanSubscribe: false,
      userIsSubscribed: false
    }
  },
  components: {
    StdPage
  }
}
</script>
