<template>
  <v-container fill-height justify-center>
    <v-btn color="primary" v-if="!$store.state.user" @click.stop="googleLogin">Login with Google</v-btn>
    <v-btn color="primary" v-if="$store.state.user" @click.stop="logout">Logout</v-btn>
  </v-container>
</template>

<script>
export default {
  methods: {
    googleLogin () {
      this.$auth.loginWith('google')
    },
    logout () {
      this.$auth.logout()
      this.$store.commit('logout')
    }
  }
}
</script>
