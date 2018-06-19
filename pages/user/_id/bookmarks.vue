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
  },
  methods: {
    async onSubscriptionRequest () {
      const dispatch = this.userIsSubscribed ? 'unsubscribeFromUser' : 'subscribeToUser'
      await this.$store.dispatch(dispatch, this.user.id)
    },
    async onDeleteRequest (bookmark) {
      const confirm = await this.$refs.confirm.open('Delete confirmation', 'Are you sure you want to delete it?')
      if (confirm) {
        const { data } = await axios.post(`/api/bookmark/del/${bookmark.id}`)
        if (!data.err) {
          this.bookmarks.splice(this.bookmarks.indexOf(bookmark), 1)
        } else this.this.$refs.confirm.open('Operation failed', `Error returned from server: ${data.err}`)
      }
    }
  },
  mounted () {
    // event from TitleCard component
    this.$root.$on('subscription-request', this.onSubscriptionRequest)
    this.$root.$on('delete-request', this.onDeleteRequest)
  },
  beforeDestroy () {
    this.$root.$off('subscription-request')
    this.$root.$off('delete-request')
  }
}
</script>
