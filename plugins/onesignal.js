window.OneSignal = window.OneSignal || []
/* window.OneSignal.push(function () {
  window.OneSignal.init({
    appId: 'bdd7f259-7661-4d1e-be08-1df66c8f21e0',
    autoRegister: false
  })
}) */
/* window.OneSignal.push(['init', {
  appId: 'bdd7f259-7661-4d1e-be08-1df66c8f21e0',
  autoRegister: false
}]) */

export default (context, inject) => {
  // will be accessible as this.$onesignal
  inject('onesignal', window.OneSignal)
}
