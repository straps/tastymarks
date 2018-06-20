<template>
  <v-card class="main-container" light>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex lg9 xs12 column>
          <div class="bookmark-info">
            <div class="headline" v-text="bookmark.title"></div>
            <div><a class="url-link" target="_blank" :href="bookmark.url">{{bookmark.url}}</a></div>
            <div>Created on {{bookmark.created | datetime}}
              <span v-if="showUser"> by <nuxt-link :to="'/user/'+bookmark.userid+'/bookmarks'">{{bookmark.username}}</nuxt-link></span>
            </div>
            <!-- <div>{{b.notes}}</div> -->
            <v-spacer></v-spacer>
            <div class="tags-container">
              Tag list:
              <v-chip v-for="tag in bookmark.tags" :key="tag" class="tag-chip red" small light>
                <nuxt-link class="white--text" :to="`/tag/${tag}`" v-text="tag"></nuxt-link>
              </v-chip>

            </div>
          </div>
        </v-flex>
        <v-flex lg3 class="hidden-sm-and-down">
          <v-card-media class="elevation-2" :src="'/api/urlimg?url='+encodeURIComponent(bookmark.url)" height="150px" contain></v-card-media>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="red">
      <v-btn depressed :fab="$store.state.windowSize.smAndDown" small color="white red--text" :href="bookmark.url" target="_blank">
        <v-icon>open_in_new</v-icon>
        <span class="hidden-sm-and-down">&nbsp; Open</span>
      </v-btn>
      <v-btn depressed :fab="$store.state.windowSize.smAndDown" small color="white red--text" v-if="myBookmark(bookmark)" :to="'/add-or-edit/bookmark/'+bookmark.id">
        <v-icon>edit</v-icon>
        <span class="hidden-sm-and-down">&nbsp; Edit</span>
      </v-btn>
      <v-btn depressed :fab="$store.state.windowSize.smAndDown" small color="white red--text" v-if="canDelete && myBookmark(bookmark)" @click="del(bookmark)">
        <v-icon>delete</v-icon>
        <span class="hidden-sm-and-down">&nbsp; Delete</span>
      </v-btn>
      <v-btn depressed :fab="$store.state.windowSize.smAndDown" small color="white red--text" v-if="loggedIn() && !myBookmark(bookmark)" :to="'/add-or-edit/bookmark?copyof='+bookmark.id+'&title='+encodeURIComponent(bookmark.title)+'&url='+encodeURIComponent(bookmark.url)+'&tags='+bookmark.tags.join('|')">
        <v-icon>content_copy</v-icon>
        <span class="hidden-sm-and-down">&nbsp; Copy</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    bookmark: {},
    showUser: {
      default: true
    },
    canDelete: { default: false }
  },
  filters: {
    datetime: (v, fmt) => moment(v).format(fmt || 'DD/MM/YYYY [at] HH:mm')
  },
  methods: {
    loggedIn () {
      return !!this.$store.state.user
    },
    myBookmark (bookmark) {
      return this.loggedIn() && bookmark.userid === this.$store.state.user.id
    },
    del (bookmark) {
      this.$root.$emit('delete-request', bookmark)
    }
  }
}
</script>

<style scoped>
.main-container {
  background-image: url(/images/patterns/crossword.png);
  background-repeat: repeat;
}
.bookmark-info {
  display:flex;
  flex-direction: column;
  height:100%;
}
.tag-chip:first-child {
  margin-left:0;
}
.url-link {
  word-wrap: break-word;
}
</style>
