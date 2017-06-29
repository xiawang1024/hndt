// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store/index.js"
import "./filter.js"
import VueAwesomeSwiper from 'vue-awesome-swiper'

import './common/index.styl'

Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false

//消除300ms延迟
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
//active点击效果
document.body.addEventListener('touchstart', function () { })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  mounted() {
  	localStorage.removeItem('hr_cid');
    localStorage.removeItem('hr_tabIndex');
  }
})
