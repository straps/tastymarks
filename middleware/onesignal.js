import secrets from '@/server/config/server-secrets'

export default async function ({app, store}) {
  if (!process.server && !store.state.debug) {
    if (store.state.user) {
      if (app.$onesignal && !app.$onesignal.tastyinit && app.$onesignal.init) {
        app.$onesignal.tastyinit = true

        try {
          await app.$onesignal.init({
            appId: secrets.onesignal.appId,
            autoRegister: true
          })

          const isEnabled = await app.$onesignal.isPushNotificationsEnabled()

          if (isEnabled) {
            await app.$onesignal.sendTags({
              tasty_userid: store.state.user.id
            })
          }

          app.$onesignal.on('subscriptionChange', async function (isSubscribed) {
            // Assign tags for easy notification deployment
            if (isSubscribed) {
              await app.$onesignal.sendTags({
                tasty_userid: store.state.user.id
              })
            } else {
              await app.$onesignal.deleteTag('tasty_userid')
            }
          })
        } catch (e) {
          console.log('onesignal exc ' + e)
        }
      }
    }
  }
}
