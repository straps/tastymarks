export const state = () => ({
  stateLoaded: false,
  works: false,
  notificationsDenied: false,
  pushEnabled: false,
  optedOut: false
})

export const mutations = {
  setNotificationsDenied (state, payload) { state.notificationsDenied = payload },
  setPushEnabled (state, payload) { state.pushEnabled = payload },
  setOptedOut (state, payload) { state.optedOut = payload },
  setWorks (state, payload) { state.works = payload },
  setStateLoaded (state, payload) { state.stateLoaded = payload }
}

export const actions = {
  async loadSubscriptionState ({ state, commit }) {
    if (!state.stateLoaded) {
      commit('setStateLoaded', true)
      const notificationPermission = await window.OneSignal.getNotificationPermission()
      commit('setNotificationsDenied', notificationPermission === 'denied')
      commit('setPushEnabled', await window.OneSignal.isPushNotificationsEnabled())
      commit('setPushEnabled', await window.OneSignal.isPushNotificationsEnabled())
      commit('setOptedOut', await window.OneSignal.isOptedOut())
      commit('setWorks', true)
    }
    return state
  }
}
