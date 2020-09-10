import Vue from 'vue'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

import App from './App.vue'
import axios from './api.js'
import router from './router.js'
import qs from 'qs'

Vue.config.productionTip = false
document.title = '清青快租'

Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.use(ViewUI)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

const asyncLocalStorage = {
  setItem: async function (key, value) {
    await null;
    return localStorage.setItem(key, value);
  },
  getItem: async function (key) {
    await null;
  return localStorage.getItem(key);
  },
  clear: async function (){
    await null;
    return localStorage.clear();
  }
};
Vue.prototype.$asyncLocalStorage = asyncLocalStorage;

