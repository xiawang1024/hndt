<template>
<div id="home">
  <div class="g-hd">
    <a href="http://www.hndt.com/index.mb.html" class="icon-back"></a>
    <voice class="voice" @click.native="goToItem"></voice>
  </div>
  <div class="tabWrap">
    <div class="item">
      <span class="name" :class="curTabIndex == 0 ? 'isActive' : ''" @click="tabSlide(0)">河南台</span>
    </div>
    <div class="item">
      <span class="name" :class="curTabIndex == 1 ? 'isActive' : ''" @click="tabSlide(1)">网络台</span>
    </div>
    <div class="item">
      <span class="name" :class="curTabIndex == 2 ? 'isActive' : ''" @click="tabSlide(2)">市县台</span>
    </div>
  </div>
  <div class="tabContent">
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide>
        <div class="listWrap">
          <div class="item" v-for="item of classOneItem" @click="playerItem(item.cid)">
            <div class="imgWrap">
              <img class="img" :class="cid == item.cid ? 'active' : ''" v-if="item.image" :src="'http://program.hndt.com' + item.image">
            </div>
            <div class="txtWrap">
              <div class="name" v-html="item.name"></div>
              <div class="live" v-html="item.live"></div>
              <div class="time" v-html="item.time"></div>
            </div>
            <div class="playBtn" :class="cid == item.cid ? 'icon-blue' : 'icon-ddd'"></div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="listWrap">
          <div class="item" v-for="item of classTwoItem"  @click="playerItem(item.cid)">
            <div class="imgWrap">
              <img class="img" :class="cid == item.cid ? 'active' : ''" v-if="item.image" :src="'http://program.hndt.com' + item.image">
            </div>
            <div class="txtWrap">
              <div class="name" v-html="item.name"></div>
              <div class="live" v-html="item.live"></div>
              <div class="time" v-html="item.time"></div>
            </div>
            <div class="playBtn" :class="cid == item.cid ? 'icon-blue' : 'icon-ddd'"></div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="listWrap">
          <div class="item" v-for="item of classThrItem"  @click="playerItem(item.cid)">
            <div class="imgWrap">
              <img class="img" :class="cid == item.cid ? 'active' : ''" v-if="item.image" :src="'http://program.hndt.com' + item.image">
            </div>
            <div class="txtWrap">
              <div class="name" v-html="item.name"></div>
              <div class="live" v-html="item.live"></div>
              <div class="time" v-html="item.time"></div>
            </div>
            <div class="playBtn" :class="cid == item.cid ? 'icon-blue' : 'icon-ddd'"></div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</div>
</template>

<script>
import {
  getClassItem, getChannelItem
} from '../api.js'
import voice from './voice.vue'
export default {
  name: 'home',
  components:{
    voice
  },
  data() {
    return {
      swiperOption: {
        initialSlide:localStorage.getItem('hr_tabIndex') || 0,
        direction:'horizontal',
        autoHeight: true,
        onTransitionStart: (swiper) => {
          this.tabIndex = swiper.realIndex;
          this.$nextTick(function() {})
        },
      },
      tabIndex: 0, //tab索引
      cid:0,
      classOneItem: [], //省台
      classTwoItem: [], //网络台
      classThrItem: [] //市县台
    }
  },
  created() {
    
    getClassItem(1).then((res) => {
      let data = res.data;
      this.classOneItem = data;
    })
    getClassItem(2).then((res) => {
      let data = res.data;
      this.classTwoItem = data;
    })
    getClassItem(3).then((res) => {
      let data = res.data;
      this.classThrItem = data;
    })
    
  },
  mounted() {
    this.cid = localStorage.getItem('hr_cid') || 1;
    if(localStorage.getItem('hr_cid')){
      return 
    }else{
      getChannelItem(this.cid).then((res) => {
        let data = res.data;
        localStorage.setItem('hr_cid',this.cid);
        this.$store.dispatch('getItemInfo', data)
        this.$nextTick(() => {
          $('html').one('touchstart',function(){
            document.querySelector('#audio').play();
          }) 
        })
      })
    }

  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },
    curTabIndex() {
      return this.tabIndex
    }
  },
  methods: {
    tabSlide(index) {
      this.tabIndex = index;
      this.swiper.slideTo(index, 500, false)
    },
    playerItem(cid){
      if(this.cid == cid) {
        this.$router.push({ path: 'item', query: { cid: this.cid }})
        return 
      }else{
      	this.cid = cid;    
        localStorage.setItem('hr_cid',cid);
        localStorage.setItem('hr_tabIndex', this.curTabIndex);
        this.$router.push({ path: 'item', query: { cid: this.cid }})    
      	getChannelItem(this.cid).then((res) => {
      		let data = res.data;
      		this.$store.dispatch('getItemInfo', data)
      		this.$nextTick(function(){})
      	})
      }      
    },
    goToItem(){
      this.$router.push({ path: 'item', query: { cid: this.cid }})
    }
  }
}
</script>

<style scroped lang="stylus">
@import "../common/index.styl"
#home
  .g-hd
    position: relative
  .icon-back
    position: absolute
    display inline-block
    line-height 150px
    width 150px
    text-align center
    font-size 80px
  .voice
    position: absolute
    right 0px
    top 35px
    width 150px
    height 80px
#home
	.g-hd
		width 1080px
		height 150px
		border-1px(#ddd)
		background url('../imgs/logo.png') center center no-repeat
		background-size auto 0.85rem
		background-color #fff  
	.tabWrap
		display flex
		width 1080px
		height 150px
		line-height 150px
		background #fff
		border-1px(#d5d5d5)
		.item
			flex 1
			text-align center
			.name
				padding 14px 50px
				border-radius 50px
				font-size 36px
				&.isActive
					color #fff
					background orange
	.tabContent
		position: fixed
		top 300px
		bottom 0
		left 0
		right 0
		width 1080px
		overflow auto
		-webkit-overflow-scrolling: touch
		.listWrap
			width 1080px
			background #fff
			.item
				width 1080px
				height 300px
				display flex
				border-1px(#d5d5d5)
				overflow hidden
				.imgWrap
					width 240px
					height 240px
					margin-top 30px
					margin-left 60px
					.img
						width 100%
						height 100%
						border-radius 50%
						border 2px solid rgba(0,0,0,0.2)
						&.active
							border-color #1ba2ff
				.txtWrap
					flex 1
					margin-left 40px
					margin-top 40px
					line-height 200%
					.name
						font-weight 500
						font-size 42px
						overflow hidden
						white-space nowrap
						text-overflow ellipsis
					.live,.time
						font-size 36px
						color #999
				.playBtn
					width 180px
					line-height 300px
					font-size 100px

</style>
