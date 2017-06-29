import {
  ITEM_INFO,
  CHANNEL_INFO
} from "./mutation-types.js"

export default {
  getItemInfo({commit}, res) {
    commit(ITEM_INFO, res)
  },
  getChannelInfo({commit}, res) {
  	commit(CHANNEL_INFO, res)
  }
}
