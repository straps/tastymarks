<template>
  <v-card>
    <v-card-title>
      <h1>
        <span v-text="title"></span>
        <span v-text="subject" class="primary--text"></span>
      </h1>
      <v-spacer></v-spacer>
      <v-btn v-if="canSubscribe"  :color="subscriptionColor" fab small dark @click="onSubscriptionClick" :title="subButtonTitle">
        <v-icon v-text="subscriptionIcon"></v-icon>
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {},
    subject: {},
    canSubscribe: { default: false },
    isSubscribed: { default: false }
  },
  methods: {
    onSubscriptionClick (e) {
      this.$root.$emit('subscription-request')
    }
  },
  computed: {
    subscriptionIcon () {
      return this.isSubscribed ? 'notifications_active' : 'notifications_off'
    },
    subscriptionColor () {
      return this.isSubscribed ? 'green' : 'secondary'
    },
    subButtonTitle () {
      return this.isSubscribed ? 'Deactivate notifications' : 'Be notified in real-time about changes'
    }
  }
}
</script>
