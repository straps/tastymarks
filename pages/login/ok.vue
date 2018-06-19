<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <title-card title="Thank you for logging-in, please wait a moment"></title-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios'
import TitleCard from '@/components/TitleCard'

export default {
  async mounted () {
    if (this.$auth && this.$auth.user) {
      let resuser = await axios.post('/api/user/1', {user: this.$auth.user})

      let { data } = await axios.get(`/api/userinfo/${resuser.data.id}`)

      this.$store.commit('login', data.user)

      let ressubs = await axios.get(`/api/user/${data.user.id}/subscriptions`)
      this.$store.commit('setSubscriptions', ressubs.data)

      this.$router.replace(`/user/${data.user.id}/bookmarks`)

      // Set cookie to let chrome extension do the job
      let expirationDate = new Date()
      let cookieString = ''
      expirationDate.setFullYear(expirationDate.getFullYear() + 10)
      cookieString = 'tasty_userid=' + data.user.id + '; path=/; expires=' + expirationDate.toUTCString()
      document.cookie = cookieString
    } else {
      this.$router.go(-2)
    }
  },
  data () {
    return {
      pushEnabled: false
    }
  },
  components: { TitleCard }
}
</script>
