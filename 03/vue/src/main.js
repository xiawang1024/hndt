// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import "./filter.js"

Vue.config.productionTip = false
Vue.use(VueRouter)
const routes = [
	
]
const router = new VueRouter({
  routes
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
