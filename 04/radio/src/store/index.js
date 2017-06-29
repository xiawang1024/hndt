import Vue from 'vue'
import Vuex from 'Vuex'
import mutations from './mutations.js'
import actions from './action.js'

Vue.use(Vuex)

const state = {
  itemInfo:null,//live节目
  channelInfo:null,//频率信息
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
