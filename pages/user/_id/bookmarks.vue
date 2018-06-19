<template>
  <std-page v-bind="{title, subject, bookmarks, userCanSubscribe, userIsSubscribed, askNewDataPath:dataPath, showBookmarkOwners:!curUser, canDeleteBookmarks:curUser}"></std-page>
</template>

<script>
import axios from '@/plugins/axios'
import StdPage from '@/components/StdPage'

export default {
  async asyncData ({app, route, params, store}) {
    let rv = {
      dataPath: `/api/bookmarks/${route.params.id}`
    }

    let res = await axios.get(rv.dataPath, { params: { limit: process.server ? 10 : 5, offset: 0, search: store.state.search } })
    rv.bookmarks = res.data

    res = await axios.get(`/api/userinfo/${route.params.id}`)
    rv.user = res.data.user

    return rv
  },
  components: {
    StdPage
  },
  computed: {
    loggedIn () { return !!this.$store.state.user },
    curUser () {
      return this.loggedIn && this.$store.state.user.id === this.user.id
    },
    title () {
      return this.curUser ? 'Your Bookmarks' : 'Last Bookmarks by '
    },
    subject () {
      return this.curUser ? '' : this.user.name
    },
    userCanSubscribe () {
      return this.loggedIn && !this.curUser
    },
    userIsSubscribed () {
      return this.loggedIn && this.$store.state.subscriptions.users.indexOf(this.user.id) > -1
    }
  }
}
</script>
