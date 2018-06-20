<template>
  <v-container fill-height>
    <v-layout row wrap>
      <v-flex xs12>
        <v-jumbotron class="elevation-4">
          <v-container>
            <v-layout align-center>
              <v-flex>
                <h3 :class="{'display-1':$store.state.windowSize.smAndDown, 'display-3':$store.state.windowSize.mdAndUp}">Welcome to Tasty Bookmarks</h3>
                <span class="subheading">
                  If you liked Delicious bookmarks you will love Tasty Bookmarks, a modern approach to social bookmarking
                  <br><br>
                  Every bookmark you save here is public and anyone can see what you save; on the other hand, you can see what other people save
                  and take useful hints from them<br><br>
                  You can tag your links with up to 10 simple words that will make it easy to categorize and find them
                  <span v-if="$store.state.windowSize.lgAndUp">
                    <br><br>
                    Drag this <v-btn color="primary" href="javascript:(function(){var e=encodeURIComponent,d=document,f=d.createElement('iframe'),s=f.style,w=600,h=600,mm=Math.max,l=mm(0,innerWidth/2-(w/2)),t=mm(0,innerHeight/2-(h/2)),zi=100000;f.src='https://tastymarks.com/add-or-edit/bookmark?title='+e(d.title)+'&url='+e(location.href);d.body.appendChild(f);s.position='fixed';s.height=h+'px';s.width=w+'px';s.left=l+'px';s.top=t+'px';s['z-index']=zi;s.border='1px solid #aaa';s.opacity='0';s.transition='all 1s ease';var x=d.createElement('div');d.body.appendChild(x);x.style.left=(l+w-24-24)+'px';x.style.top=(t+12)+'px';x.style.position='fixed';x.style.width=x.style.height='24px';x.style['background-color']='#fff';x.style['background-image']='url(https://tastymarks.com/images/icons/close-24.png)';x.style.border=x.style.opacity=0;x.style['border-radius']='24px';x.style['z-index']=zi+1;x.style.cursor='pointer';f.onload=function(){f.style.opacity=x.style.opacity=0.96};x.onclick=function(){d.body.removeChild(f);d.body.removeChild(x)}})()">Add to TastyMarks</v-btn> button to your browser bookmarks toolbar to add bookmarks with one click directly from sites you like
                  </span>
                  <span v-if="!$store.state.user">
                    <br><br>
                    Login with your <a @click="$auth.loginWith('google')">Google account</a> to start saving your bookmarks and enjoy your Tastymarks
                  </span>
                </span>
                <v-divider class="my-3"></v-divider>
                <!-- <div class="title mb-3">
                  <nuxt-link to="/trending/bookmarks">Take a look</nuxt-link> at what other users are saving
                  <span v-if="!$store.state.user">or <a @click.stop="$auth.loginWith('google')">login</a> and start saving yours</span>
                  <span v-if="$store.state.user">and drag our bookmarklet button on your browser bookmarks bar to easy saving your links</span>
                </div>
                <v-btn large color="primary" class="mx-0">Save on TastyMarks</v-btn>-->
                Public tag cloud <tag-cloud :tags="tags"></tag-cloud>
              </v-flex>
            </v-layout>
          </v-container>
        </v-jumbotron>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios'
import TagCloud from '@/components/TagCloud'

export default {
  async asyncData () {
    let tagsRes = await axios.get('/api/tag/cloud')
    return {
      tags: tagsRes.data
    }
  },
  components: {
    TagCloud
  }
}
</script>

<style scoped>
.jumbotron {
  background-color: rgba(50,50,50,.6);
  height: auto !important;
}
</style>
