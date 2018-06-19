<template>
  <v-container grid-list-lg>
    <v-layout column>
      <v-flex xs12>
        <title-card :title="title" :subject="subject" :canSubscribe="userCanSubscribe" :isSubscribed="userIsSubscribed"></title-card>
      </v-flex>

      <bookmark-card-list :bookmarks="mybookmarks" :showUser="showBookmarkOwners" :canDelete="canDeleteBookmarks"></bookmark-card-list>

      <v-flex xs12 v-if="!bookmarks.length && curUser">
        <v-card>
          <v-card-title>
            You have no bookmarks, <v-btn to="/add-or-edit/bookmark" color="primary">add one now</v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

    <infinite-loading v-if="infiniteLoadingEnabled" @infinite="infiniteHandler" ref="infinite">
      <span slot="no-results">No more Tasties to load</span>
      <span slot="no-more">No more Tasties to load</span>
    </infinite-loading>

    <div class="mb-5 text-xs-center grey--text"><span v-if="infiniteLoadingActive">Scroll to load more tasties</span></div>

    <confirm ref="confirm"></confirm>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios'
import BookmarkCardList from '@/components/BookmarkCardList'
import TitleCard from '@/components/TitleCard'
import Confirm from '@/components/Confirm'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  props: {
    title: { default: 'StdPage' },
    subject: { default: '' },
    bookmarks: { default: [] },
    showBookmarkOwners: { default: true },
    canDeleteBookmarks: { default: false },
    askNewDataPath: { default: '' },
    userCanSubscribe: { default: false },
    userIsSubscribed: { default: false }
  },
  data (c) {
    return {
      infiniteLoadingEnabled: false,
      infiniteLoadingActive: true,
      mybookmarks: this.bookmarks
    }
  },
  components: {
    BookmarkCardList,
    TitleCard,
    Confirm,
    InfiniteLoading
  },
  computed: {
    loggedIn () {
      return !!this.$store.state.user
    }
  },
  methods: {
    async askNewData (howmany) {
      const { data } = await axios.get(this.askNewDataPath, {
        params: {
          limit: howmany || 5,
          offset: this.mybookmarks.length,
          search: this.$store.state.search
        }
      })

      return data
    },
    async infiniteHandler ($state) {
      const newData = await this.askNewData(5)

      this.mybookmarks = this.mybookmarks.concat(newData)

      if (newData.length < 5) {
        $state.complete()
        this.infiniteLoadingActive = false
      } else {
        $state.loaded()
      }
    },
    async infiniteReset () {
      await this.$nextTick()
      this.$refs.infinite.$emit('$InfiniteLoading:reset')
    },
    async onSubscriptionRequest () {
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
    },
    async onSearchChanged () {
      await this.infiniteReset()
      this.mybookmarks = []
      await this.askNewData()
    }
  },
  mounted () {
    // event from TitleCard component
    this.$root.$on('subscription-request', this.onSubscriptionRequest)
    this.$root.$on('delete-request', this.onDeleteRequest)
    this.$root.$on('search-changed', this.onSearchChanged)
    this.infiniteLoadingEnabled = true
  },
  beforeDestroy () {
    this.$root.$off('subscription-request')
    this.$root.$off('delete-request')
    this.$root.$off('search-changed')
  }
}
</script>
