<template>
  <div id="app">
    <div class="g-hd">
      <router-link to="/" class="icon-back" tag="i"></router-link>
      <span class="hd-title">河南广播网</span>
    </div>
    <div class="live-wrap">
      <div class="live-img">
        <img class="img" :class="isPlay ? 'isRotate' : '' " :src="'http://program.hndt.com' + logoSrc">
        <span class="play-btn" @click="playOrPause">
          <i v-if="isPlay" class="icon-play"></i>
          <i v-else class="icon-pause"></i>
        </span>
      </div>
      <div class="live-info">
        <span class="live-title">{{titleSrc}}</span>
        <span class="live-title">{{timeSrc}}</span>
        <!-- <span class="live-anchor">主播：徐燕</span> -->
      </div>
    </div>
    <div class="loadapp-btn">
      <a href="http://www.hndt.com/app/download/index.html" target="_bank">下载河南广播APP</a>
    </div>
    <div class="live-list">
      <div class="list-title">节目列表</div>
      <div v-if="itemList && itemList.length > 0" class="list-wrap" @scroll="scroll($event)">
        <div class="listbox" >
            <div class="list-item" v-for="(item, index) of itemList" ref="listWrap" :class="{'active' : index == indexId ? true : false}">
              <span class="item-time">{{item.beginTime | formdata}}-{{item.endTime | formdata}}</span>
              <span class="item-name">{{item.title}}</span>
              <!-- <span class="item-play"> -->
                <i v-if="index == indexId" class=" icon-voice"></i>
              <!-- </span> -->
            </div>
        </div>
      </div>
      <div v-else class="void">
        暂无节目列表
      </div>
    </div>
    <!-- <div class="audio" style="display: none">
        <audio width="640" height="320" controls autoplay id="audio">
            <source src="http://stream.hndt.com:1935/live/xinwen/playlist.m3u8" type="application/x-mpegURL">
       </audio>
    </div> -->
  </div>
</template>

<script>
import { getClassItem, getChannelItem } from "../api.js"
export default {
  name: 'app',
  data() {
    return {
        itemList:[],
        audioSrc:'',
        titleSrc:'',
        logoSrc:'',
        timeSrc:'',
        top:0,
        indexId:0, //节目索引
        isPlay: true,
        isReLoad:null //是否重新加载
    }
  },
  created() {
    let query = this.$route.query
    let cid = query.cid;
    var audioBtn = document.querySelector('#audio');
    getChannelItem(cid).then((res) => {
        let data = res.data;
        this.itemList = data.programs;
        this.logoSrc = data.image;
        this.timeSrc = data.time;        
        this.isActive();   
        this.$nextTick(() => { 
          $('.list-wrap').scrollTop(this.top)  
        })
        if(this.isReLoad){
          this.$store.dispatch('getItemInfo', data)
        }else{
          return 
        }     
    })
  },
  mounted() {
    $('html').one('touchstart',function(){
      document.querySelector('#audio').play();
    })
  },
  //判断是否是重新加载
  beforeRouteEnter(to, from, next){
    next(vm => {
      if(from.name == null){
        vm.isReLoad = true
      }else{
        vm.isReLoad = false
      }
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
        // console.log(fontSize)
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
    playOrPause() {
      var audioBtn = document.querySelector('#audio');
      if(this.isPlay){
        this.isPlay = false;
        localStorage.setItem('hr_isPlay', 0)
        audioBtn.pause();
      }else{
        this.isPlay = true;
        localStorage.setItem('hr_isPlay', 1)
        audioBtn.play();
      }
    },
    scroll(ev){
        // console.log(ev)
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../common/index.styl"
@import "../player.styl"
.icon-voice
  font-size 60px
</style>
