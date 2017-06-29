import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'
import player from '@/pages/player'
import item from '@/pages/item'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path:'/',
  		name:'home',
  		component:home
  	},
    {
      path: '/player',
      name: 'player',
      component: player
    },
    {
      path: '/item',
      name: 'item',
      component: item
    }
  ]
})
