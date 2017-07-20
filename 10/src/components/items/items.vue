<template>
	<div class="items">
		<div class="hd">
			<!-- <router-link to="/channel" tag='span' class="icon-back back"></router-link> -->
			<span class="icon-back back" @click="goToChannel"></span>
			<span class="title">
				河南广播网
			</span>
			<load class="load"></load>
		</div>
		<div class="audio-wrap" >
			<div class="item-logo" v-if="itemsInfo">
				<img 
					:src="'http://program.hndt.com' + itemsInfo.image" 
					class="img"
					:class="playOrPause ? 'isPlay' : '' "
				>
				<span 
					:class=" playOrPause ? 'icon-play' : 'icon-pause'"
					@click="playSwitch"
				></span>
			</div>
			<div class="item-info" v-if="itemsInfo">
				<p class="name">{{itemsInfo.name}}</p>
				<p class="live-name">
					<i class="icon-LIVE"></i>{{itemsInfo.live}}
				</p>
				<p class="live-time">{{itemsInfo.time}}</p>
			</div>
		</div>
		<div class="itemsList" v-show="itemsList.length">
			<div class="title">节目列表</div>
			<div class="list-date" ref="dateList">
				<div style="width:100000px">
					<span v-for="n of 100">{{n}}</span>
				</div>
			</div>
			<scroll class="list-wrap" :data="itemsList" ref="listview" >
				<div>
					<div class="list" v-for='(item, index) in itemsList' ref="list">
						<span class="item time">{{format(item.beginTime)}} - {{format(item.endTime)}}</span>
						<span class="item name">{{item.title}}</span>
						<span class="item isPlay">
							<i v-if="index === isPlayIndex" class="icon-LIVE"></i>
						</span>
					</div>
				</div>
			</scroll>
		</div>
		<div class="netRadioDesc" v-show="itemsList.length==0">
			<div class="desc-wrap" v-if="itemsInfo">{{itemsInfo.description}}</div>
		</div>
	</div>
</template>

<script>
import Scroll from '@/base/scroll'
import Load from '@/components/load/load'
import { getChannelItem } from 'api/index'
import { addClass } from 'common/js/dom.js'
import BScroll from 'better-scroll'
export default {
	name:'items',
	components:{
		Scroll,
		Load
	},
	data() {
		return {
			itemsInfo:null,
			itemsList:[],
			isPlayIndex:null,
			playStream:'',
			playOrPause:true
		}
	},
	created() {
		this.parseQuery()
	},
	mounted() {
		this.audio = document.getElementById('audio')
		if(this.audio.readyState == 4){
			if(this.audio.paused){
				this.playOrPause = false
			}else{
				this.playOrPause = true
			}
		}
		setTimeout(() => {
			this.dateScroll = new BScroll(this.$refs.dateList,{
				scrollX:true,
				bounce:true
			})
		},20)		
	},
	watch:{
		playStream(oldVal, val) {
			if(val){
				// this._playSrc(val)
			}			
		}
	},
	methods:{
		_getChannelItem(cid) {
			getChannelItem(cid).then((res) => {
				let data = res.data;
				this.itemsInfo = data;
				this.itemsList = data.programs;
				this.playStream = data.streams[0];
				if(!this.audio.getAttribute('src')){
					this._playSrc(data.streams[0])
				}				
				setTimeout(() => {
					this._isPlay(data.programs)
				},20)	
			})
		},
		_isPlay(programs) {
			let currentTime = (new Date()).getTime()/1000 | 0;//当前时间时间戳
			for(let i =0 ;i<programs.length;i++){
				var item = programs[i];
				if(currentTime <= item.endTime && currentTime >= item.beginTime){
					this.isPlayIndex = i;
					this._scrollTo(this.isPlayIndex)
					return 
				}
			}
		},
		_scrollTo(index){
			let listHeight = this.$refs.list[0].clientHeight;
			let offsetY = parseInt(listHeight) * index 
			this.$refs.listview.scroll && this.$refs.listview.scroll.scrollTo(0,-offsetY,1000)
		},
		_playSrc(stream) {
			this.audio.setAttribute('src',stream)
		},
		playSwitch() {
			if(this.playOrPause){
				this.playOrPause = false
				this.audio.pause()
			}else{
				this.playOrPause = true
				this.audio.play()
			}
		},
		parseQuery() {
			let query = this.$route.query
			let cid = query.cid;
			this.cid = cid;
			if(cid){
				this._getChannelItem(cid)
			}
		},
		goToChannel() {
			this.$router.push({path:'/channel',query:{isPlayIndex:this.cid}})
		},
		format(interval){
			let val = parseInt(interval) * 1000;
			let time = new Date(val);
			const hour = this._pad(time.getHours());
			const min = this._pad(time.getMinutes());
			return `${hour}:${min}`
		},
	    _pad(num, n = 2) {
	        let len = num.toString().length
	        while (len < n) {
	          num = '0' + num
	          len++
	        }
	        return num
	    },
	}
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin.styl'
@keyframes rotate
    0%
        transform rotate(0deg)
    100%
        transform rotate(360deg)
.items
	width 100%
	background #fff
	.hd
		position: relative
		width 100%
		height $items-hd-height
		line-height $items-hd-height
		text-align center
		border-1px($color)
		.back
			display inline-block
			position: absolute
			line-height $items-hd-height
			left 0
			width 120px
			font-size 60px
		.title
			font-size 44px
		.load
			position: absolute
			top 30px
			right 30px
	.audio-wrap
		width 100%
		height $items-audio-height
		display flex
		align-items center
		border-1px($color)
		.item-logo
			flex 2
			text-align center
			position: relative
			font-size 0
			.img
				width 240px
				height 240px 
				border-radius 50%
				border 2px solid $color
				&.isPlay
					animation rotate 6s linear infinite
			.icon-play,.icon-pause
				position: absolute
				left 50%
				top 50%
				transform translate(-50%,-50%)
				font-size 120px
				color #1ba2ff
				opacity 0.8
		.item-info
			flex 3
			text-align left
			p
				line-height 2
				&.name
					font-size 40px
				&.live-name
					font-size 36px
					color #666
					no-wrap()
					max-width 440px //最大宽度450px
					.icon-LIVE
						font-size 84px
						vertical-align middle
				&.live-time
					font-size 36px
					color #999
	.itemsList
		width 100%
		.title
			width 100%
			height $items-items-title
			line-height $items-items-title
			padding-left 30px
			font-size 30px
			font-weight 700
			border-1px($color)
			box-sizing border-box
		.list-date
			position: fixed
			top $items-list-date-top
			left 0 
			right 0
			height $items-date-height
			line-height $items-date-height
			background #fff
			border-bottom 0.5px solid $color
			box-sizing border-box
			overflow-y auto
			span
				display inline-block
				width 100px
		.list-wrap
			position: fixed
			top $items-list-wrap-top
			width 100%
			background #fff
			.list 
				display flex
				height $items-item-list
				line-height $items-item-list
				border-1px($color)
				box-sizing border-box
				font-size 32px
				.time 
					flex 2
					text-align center
					color #333
				.name
					flex 3
					text-align center
					no-wrap()
				.isPlay
					flex 1
					text-align center
					.icon-LIVE
						font-size 100px
	.netRadioDesc
		width 100%
		position: fixed
		top $items-netRadioDesc-top
		bottom 0
		overflow auto
		-webkit-overflow-scrolling: touch
		background #fff
		.desc-wrap
			width 100%
			padding 60px 100px
			box-sizing border-box
			line-height 2
			letter-spacing: 2px
			font-size 34px
			text-align center
</style>