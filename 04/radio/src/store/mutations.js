import {
  ITEM_INFO,
  CHANNEL_INFO
} from "./mutation-types.js"

export default {
  [ITEM_INFO](state, res){
    state.itemInfo = res
  },
  [CHANNEL_INFO](state, res){
    state.channelInfo = res
  }
}
