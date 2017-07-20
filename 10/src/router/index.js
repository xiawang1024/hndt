import Vue from 'vue'
import Router from 'vue-router'
import Channel from '@/components/channel/channel'
import Items from '@/components/items/items'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name:'root',
      redirect: '/channel'
    },
    {
      path: '/channel',
      name: 'channel',
      component: Channel
    },
    {
      path: '/items',
      name: 'items',
      component: Items
    }
  ]
})
