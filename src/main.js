import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
const axios = require('axios');
axios.defaults.baseURL = '/api'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
