import axios from '@/plugins/axios'

export const state = () => ({
  user: null,
  subscriptions: null,
  mostActiveUsers: [],
  windowSize: {},
  debug: process.env.NODE_ENV !== 'production',
  showFloatingButton: false
})

export const mutations = {
  login (state, user) {
    if (user) {
      state.user = user
      state.showFloatingButton = true
    }
  },
  logout (state) {
    state.user = null
    state.subscriptions = null
    state.showFloatingButton = false
  },
  setFloatingButtonVisible (state, payload) {
    state.showFloatingButton = payload && !!state.user
  },
  setSubscriptions (state, payload) {
    state.subscriptions = payload
  },
  setMostActiveUsers (state, users) {
    state.mostActiveUsers = users
  },
  subscribeToUser (state, userid) {
    state.subscriptions.users.push(userid)
  },
  unsubscribeFromUser (state, userid) {
    state.subscriptions.users.splice(state.subscriptions.users.indexOf(userid), 1)
  },
  subscribeToTag (state, tag) {
    state.subscriptions.tags.push(tag)
  },
  unsubscribeFromTag (state, tag) {
    state.subscriptions.tags.splice(state.subscriptions.tags.indexOf(tag), 1)
  },
  setWindowSize (state, size) {
    state.windowSize = size
    // Material Design Viewport Breakpoints https://vuetifyjs.com/en/layout/display
    state.windowSize.smAndUp = size.w >= 600
    state.windowSize.mdAndUp = size.w >= 960
    state.windowSize.lgAndUp = size.w >= 1264
    state.windowSize.xlAndUp = size.w >= 1904
    state.windowSize.lgAndDown = size.w < 1904
    state.windowSize.mdAndDown = size.w < 1264
    state.windowSize.smAndDown = size.w < 960
    state.windowSize.xsAndDown = size.w < 600
  }
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch, state }, { req }) {
    if (req.session && req.session.authUser) {
      commit('login', req.session.authUser)
    } else if (state.auth.loggedIn) {
      let { data } = await axios.get('/api/userinfo', { params: { email: this.$auth.user.email } })
      commit('login', data.user)
    }

    let res
    if (state.user && state.user.id) {
      res = await axios.get(`/api/user/${state.user.id}/subscriptions`)
      commit('setSubscriptions', res.data)
    }

    res = await axios.get('/api/users/active')
    commit('setMostActiveUsers', res.data)
  },
  async subscribeToUser  ({ commit, state }, userid) {
    await axios.post(`/api/subscribe/${state.user.id}/to/user/${userid}`)
    commit('subscribeToUser', userid)
  },
  async unsubscribeFromUser ({ commit, state }, userid) {
    await axios.post(`/api/unsubscribe/${state.user.id}/from/user/${userid}`)
    commit('unsubscribeFromUser', userid)
  },
  async subscribeToTag ({ commit, state }, tag) {
    await axios.post(`/api/subscribe/${state.user.id}/to/tag/${tag}`)
    commit('subscribeToTag', tag)
  },
  async unsubscribeFromTag ({ commit, state }, tag) {
    await axios.post(`/api/unsubscribe/${state.user.id}/from/tag/${tag}`)
    commit('unsubscribeFromTag', tag)
  }
}
