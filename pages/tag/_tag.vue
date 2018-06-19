<template>
  <std-page v-bind="{title, subject, bookmarks, userCanSubscribe, userIsSubscribed, askNewDataPath:dataPath, showBookmarkOwners, canDeleteBookmarks}"></std-page>
</template>

<script>
import axios from '@/plugins/axios'
import StdPage from '@/components/StdPage'

export default {
  async asyncData (context) {
    let rv = {
      dataPath: `/api/bookmarks/0/${context.route.params.tag}`
    }
    let res = await axios.get(rv.dataPath, { params: { limit: process.server ? 10 : 5, offset: 0, search: context.store.state.search } })

    rv.subject = context.route.params.tag
    rv.bookmarks = res.data

    return rv
  },
  data () {
    return {
      title: 'Bookmarks tagged as ',
      userCanSubscribe: false, // TODO gestire la sottoscrizione
      userIsSubscribed: false,
      showBookmarkOwners: true,
      canDeleteBookmarks: false
    }
  },
  components: {
    StdPage
  }
}
</script>
