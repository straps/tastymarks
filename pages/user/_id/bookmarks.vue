<template>
  <v-container grid-list-lg>
    <v-layout column>

      <v-flex xs12>
        <title-card :title="title" :subject="titleSubject" :canSubscribe="userCanSubscribe" :isSubscribed="isSubscribed"></title-card>
      </v-flex>

      <v-flex xs12 class="bookmarks-container">
        <bookmark-card class="mb-3" v-for="b in bookmarks" :key="b.id" :bookmark="b" :showUser="false" :canDelete="true"></bookmark-card>
      </v-flex>

      <v-flex xs12 v-if="!bookmarks.length && curUser">
        <v-card>
          <v-card-title>
            You have no bookmarks, <v-btn to="/add-or-edit/bookmark" color="primary">add one now</v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Componente dinamico per essere attivato solo lato client -->
    <component :is="infinite" @infinite="infiniteHandler">
      <span slot="no-results">No more Tasties to load</span>
      <span slot="no-more">No more Tasties to load</span>
    </component>

    <div v-if="infiniteLoadingActive" class="mb-5 text-xs-center grey--text">Scroll to load other tasties</div>

    <confirm ref="confirm"></confirm>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios'
import BookmarkCard from '@/components/BookmarkCard'
import TitleCard from '@/components/TitleCard'
import Confirm from '@/components/Confirm'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  async asyncData ({ route }) {
    let res = await axios.get('/api/bookmarks/' + route.params.id, {
      params: { limit: 5, offset: 0 }
    })
    let rv = {
      bookmarks: res.data
    }
    res = await axios.get(`/api/userinfo/${route.params.id}`)
    rv.user = res.data.user
    rv.infinite = 'div'
    rv.infiniteLoadingActive = true

    return rv
  },
  components: {
    BookmarkCard,
    TitleCard,
    Confirm,
    InfiniteLoading
  },
  computed: {
    loggedIn () { return !!this.$store.state.user },
    curUser () {
      return this.loggedIn && this.$store.state.user.id === this.user.id
    },
    title () {
      return this.curUser ? 'Your Bookmarks' : 'Last Bookmarks by '
    },
    titleSubject () {
      return this.curUser ? '' : this.user.name
    },
    userCanSubscribe () {
      return this.loggedIn && !this.curUser
    },
    isSubscribed () {
      return this.loggedIn && this.$store.state.subscriptions.users.indexOf(this.user.id) > -1
    }
  },
  methods: {
    async askNewData (howmany) {
      const { data } = await axios.get('/api/bookmarks/' + this.user.id, {
        params: {
          limit: howmany,
          offset: this.bookmarks.length
        }
      })
      console.log('askNewData called, data=', data)

      return data
    },
    async infiniteHandler ($state) {
      const newData = await this.askNewData(5)

      this.bookmarks = this.bookmarks.concat(newData)

      if (newData.length < 5) {
        $state.complete()
        this.infiniteLoadingActive = false
      } else {
        $state.loaded()
      }
    },
    async onSubscriptionRequest () {
      // register subscription on database
      const dispatch = this.isSubscribed ? 'unsubscribeFromUser' : 'subscribeToUser'
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
    this.infinite = 'infinite-loading'
  },
  beforeDestroy () {
    this.$root.$off('subscription-request')
    this.$root.$off('delete-request')
  }
}
</script>

<style scoped>
.bookmark-info {
  display:flex;
  flex-direction: column;
  height:100%;
}
.tag-chip:first-child {
  margin-left:0;
}
</style>
