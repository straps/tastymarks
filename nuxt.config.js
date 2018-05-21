module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Tasty Bookmarks, social bookmarking on steroids',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui' },
      { hid: 'description', name: 'description', content: 'Share and see people bookmarks' },
      { name: "msapplication-TileColor", content: "#ffffff" },
      { name: "msapplication-TileImage", content: "/images/logo/logo-144.png" },
      { name: "theme-color", content: "#ffffff" },
      { property: "og:title", content: "TastyMarks" },
      { property: "og:description", content: "Social bookmarking on steroids" },
      { property: "og:image", content: "https://tastymarks.com/images/logo/logo-192.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "192" },
      { property: "og:image:height", content: "192" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: "stylesheet", href:"https://use.fontawesome.com/releases/v5.0.10/css/all.css", integrity:"sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg", crossorigin:"anonymous" },
      { rel: "apple-touch-icon", sizes: "57x57", href: "/images/logo/logo-57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", href: "/images/logo/logo-60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", href: "/images/logo/logo-72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", href: "/images/logo/logo-76.png" },
      { rel: "apple-touch-icon", sizes: "114x114", href: "/images/logo/logo-114.png" },
      { rel: "apple-touch-icon", sizes: "120x120", href: "/images/logo/logo-120.png" },
      { rel: "apple-touch-icon", sizes: "144x144", href: "/images/logo/logo-144.png" },
      { rel: "apple-touch-icon", sizes: "152x152", href: "/images/logo/logo-152.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/images/logo/logo-180.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/images/logo/logo-192.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/images/logo/logo-32.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/images/logo/logo-96.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/images/logo/logo-16.png" },
      { rel: "manifest", href: "/manifest.json" }
    ],
    script: [
      { src: "https://cdn.onesignal.com/sdks/OneSignalSDK.js", async: "async"}
    ]
  },
  plugins:[
    '@/plugins/vuetify',
    '@/plugins/chartkick',
    { src: '~plugins/ga', ssr: false },
    { src: '~plugins/onesignal', ssr: false },
    { src: '~plugins/vue-swal', ssr: false }
  ],
  router: {
    middleware: [
      'onesignal'
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    //'@/assets/styl/app.styl',
    '~/assets/css/app.css',
    'vuetify/dist/vuetify.min.css'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  auth:{
    strategies: {
      google: {
        client_id: '921463797071-h590d6hvcvdaajne0najna0jui79fshu.apps.googleusercontent.com'
      }
    },
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/login/ok'
    },
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/',
        expires: 30
      }
    }
  },
  loading:{
    color: 'white',
    height: '3px'
  },
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios', 'babel-polyfill', 'vue-swal', 'vue-infinite-loading', 'lodash', 'chart.js'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      /* return Object.assign({}, config, {
        devtool: 'source-map'
      }) */
    }
  }
}
