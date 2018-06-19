<template>
  <v-app dark v-resize="onResize">

    <v-navigation-drawer fixed clipped v-model="drawer" app>
      <v-list dense>

        <v-subheader class="mt-3 grey--text text--darken-1">ABOUT YOU</v-subheader>
        <v-list-tile v-if="!$store.state.user" @click="$auth.loginWith('google')">
          <v-list-tile-action>
            <v-icon>fingerprint</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Login via Google Auth
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <div v-if="$store.state.user">
          <v-list-tile avatar>
            <v-list-tile-avatar >
              <img :src="`/images/avatars/${$store.state.user.id}.jpg`">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-if="$store.state.user">
                {{$store.state.user.name}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :to="'/user/'+$store.state.user.id+'/bookmarks'">
            <v-list-tile-action>
              <v-icon>book</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Your Bookmarks
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="logout">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Logout
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>

        <v-subheader class="mt-3 grey--text text--darken-1">PUBLIC BOOKMARKS</v-subheader>
        <v-list-tile v-for="item in items" :key="item.text" :to="item.to">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-subheader class="mt-3 grey--text text--darken-1">MOST ACTIVE USERS</v-subheader>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12>
              <nuxt-link v-for="item in $store.state.mostActiveUsers" :key="item.userid" avatar :to="'/user/'+item.userid+'/bookmarks'">
                <v-tooltip top>
                  <v-avatar slot="activator" size="40px" class="mx-2 mb-2">
                    <img :src="`/images/avatars/${item.userid}.jpg`" class="elevation-2">
                  </v-avatar>
                  <span v-text="item.name"></span>
                </v-tooltip>
              </nuxt-link>
            </v-flex>
          </v-layout>
        </v-container>

      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="red" dense fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img class="logo" src="/images/logo/logo-grey-32.png">
      <v-toolbar-title class="mr-5 align-center">
        <nuxt-link v-if="$store.state.windowSize.mdAndUp || !searching" class="title white--text" to="/">
          Tasty Bookmarks
        </nuxt-link>
      </v-toolbar-title>

      <v-text-field clearable v-model="search" align-end :append-icon-cb="() => {}" placeholder="Search..." single-line append-icon="search" color="white" hide-details @focus="searching=true" @blur="searching=false" @input="onSearchChangedDeb"></v-text-field>
    </v-toolbar>

    <v-content class="main-content">
      <nuxt/>
    </v-content>

    <v-btn v-if="$store.state.showFloatingButton" color="red" dark small fixed bottom right fab to="/add-or-edit/bookmark">
      <v-icon>add</v-icon>
    </v-btn>

  </v-app>
</template>

<script>
import axios from '@/plugins/axios'
import { debounce } from 'lodash'

console.log(debounce)

const rv = {
  data: () => ({
    drawer: false,
    searching: false,
    items: [
      { icon: 'trending_up', text: 'Trending Bookmarks', to: '/trending/bookmarks' },
      // { icon: 'bookmark', text: 'Trending Tags', to: '/trending/tags' },
      { icon: 'history', text: 'Last Added Bookmarks', to: '/public/history' }
    ]
  }),
  props: {
    source: String
  },
  mounted () {
    this.drawer = this.$store.state.windowSize.mdAndUp
  },
  methods: {
    onResize () {
      this.$store.commit('setWindowSize', {w: window.innerWidth, h: window.innerHeight})
    },
    onSearchChanged (event) {
      this.$root.$emit('search-changed')
    },
    async logout () {
      this.$auth.logout()
      await axios.post('/api/logout')
      this.$store.commit('logout')
    },
    debounce
  },
  computed: {
    search: {
      get () {
        return this.$store.state.search
      },
      set (value) {
        this.$store.commit('setSearch', value)
      }
    }
  }
}

rv.methods.onSearchChangedDeb = debounce(rv.methods.onSearchChanged, 1000)

export default rv
</script>

<style scoped>
.main-content {
  background-image:url(/images/patterns/footer_lodyas.png);
  background-repeat: repeat;
  background-attachment: fixed;
}
.avatars-container {
  flex-wrap: wrap;
}
</style>
