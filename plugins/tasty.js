import axios from '@/plugins/axios'

export default (context, inject) => {
  // will be accessible as this.$tasty
  inject('tasty', {
    async loadTrendingBookmarks () {
      let { data } = await axios.get('/api/trending/bookmarks')
      return data
    }
  })
}
