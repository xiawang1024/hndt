<template>
  <div id="app">
    <div class="g-hd"></div>
    <div class="live-wrap">
      <div class="live-img">
        <img class="img" src="http://program.hndt.com/files/images/2017/06/23/1498188224840943.png">
        <span class="play-btn"></span>
      </div>
      <div class="live-info">
        <span class="live-title">{{titleSrc}}</span>
        <span class="live-anchor">主播：徐燕</span>
      </div>
    </div>
    <div class="loadapp-btn">
      <a href="###">下载河南广播APP</a>
    </div>
    <div class="live-list">
      <div class="list-title">节目列表</div>
      <div class="list-wrap" @scroll="scroll($event)">
        <div class="listbox" >
            <div class="list-item" v-for="(item, index) of itemList" ref="listWrap" :class="{'active' : index == indexId ? true : false}">
              <span class="item-time">{{item.beginTime | formdata}}-{{item.endTime | formdata}}</span>
              <span class="item-name">{{item.title}}</span>
              <span class="item-play">
                <i v-if="index == indexId" class="icon-blue"></i>
                <i v-else class="icon-ddd"></i>
              </span>
            </div>
        </div>
      </div>
    </div>
    <div class="audio" style="position: absolute;z-index: -100">
        <audio width="640" height="320" controls autoplay id="audio">
            <source src="http://stream.hndt.com:1935/live/xinwen/playlist.m3u8" type="application/x-mpegURL">
       </audio>
    </div>
  </div>
</template>

<script>
import { getClassItem, getChannelItem } from "./api.js"
export default {
  name: 'app',
  data() {
    return {
        itemList:[],
        audioSrc:'',
        titleSrc:'',
        top:0,
        indexId:0
    }
  },
  created() {
    getChannelItem(1).then((res) => {
        let data = res.data;
        this.itemList = data.programs;
        this.$nextTick(() => {
            setTimeout(() => {
                this.isActive();
                $('.list-wrap').scrollTop(this.top)
            },0)
        })
    })
  },
  mounted() {
    var oHtml = document.querySelector('html');
    var audio = document.querySelector('#audio');
    oHtml.addEventListener('touchstart',function(){
        audio.play()
    })
  },
  methods:{
    isActive(){
        var time = (new Date()).getTime()/1000;
        // console.log(time)
        var data = this.itemList;
        let len = data.length;
        var index=0;
        var fontSize = $('html').css('font-size');
        console.log(fontSize)
        var height = 1.296 * parseInt(fontSize);
        for(let i =0 ;i < len ; i++){
            let item = data[i];
            if(item.beginTime < time && item.endTime > time){
                index = i;
                this.indexId = i;
                this.titleSrc = item.title;
                this.top = (index - 1) * height;
                return;
            }
        }
    },
    scroll(ev){
        // console.log(ev)
    }
  }
}
</script>

<style scoped lang="stylus">
@import "./common/index.styl"
@import "./index.styl"
</style>
