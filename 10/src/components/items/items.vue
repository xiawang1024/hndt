<template>
	<div class="items">
		<div class="hd">
			<!-- <router-link to="/channel" tag='span' class="icon-back back"></router-link> -->
			<span class="icon-back back" @click="goToChannel"></span>
			<img src="./logo.png" alt="" class="img">
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
					<i class="icon-LIVE" v-show="isLivePlay"></i>
					<span class="playback" v-show="!isLivePlay">回听</span>
					{{isLivePlay ? itemsInfo.live : playBackTitle}}
				</p>
				<p class="live-time" v-show="isLivePlay">
					<span>{{itemsInfo.time}}</span>
				</p>
				<p class="live-time progress-wrap" v-show="!isLivePlay">
					<span class="time time-l">{{formatPlayTime(currentTime)}}</span>
					<span class="progress">
						<progress-bar
							:percent="percent"
							@percentChange="onProgressBarChange"
						></progress-bar>
					</span>
					<span class="tiem time-r">{{formatPlayTime(duration)}}</span>
				</p>
			</div>
		</div>
		<div class="itemsList" v-show="itemsList.length">
			<div class="title">节目列表</div>
			<keep-alive>
				<date-pick
					@clickItem="getDatePrograms"
				></date-pick>
			</keep-alive>
			<scroll
				class="list-wrap"
				:data="itemsList"
				ref="listview"
			>
				<div>
					<div class="list" v-for='(item, index) in itemsList' ref="list">
						<span class="item time">{{format(item.beginTime)}} - {{format(item.endTime)}}</span>
						<span class="item name">{{item.title}}</span>
						<span
							class="item isPlay"
							@click="playBackSrc(item,index)"
						>
							<i v-show="index === isPlayIndex && isToDay" class="icon-LIVE"></i>
							<span v-show="item.playUrl && item.playUrl.length > 0 && index !== isPlayIndex" class="playback">回听</span>
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
import Hls from 'hls'
import Scroll from '@/base/scroll'
import DatePick from '@/base/datePick'
import ProgressBar from '@/base/progress-bar'
import Load from '@/components/load/load'
import { getChannelItem, clickItem } from 'api/index'
import { addClass } from 'common/js/dom.js'
import { isPc } from 'common/js/isPc.js'
import BScroll from 'better-scroll'
export default {
	name:'items',
	components:{
		Scroll,
		Load,
		DatePick,
		ProgressBar
	},
	data() {
		return {
			itemsInfo:null,//频率信息
			itemsList:[], //频率programs
			isPlayIndex:null, //直播index
			playOrPause:true,//播放暂停按钮
			isToDay:true, //是否是今天 ，是true，否false
			isLivePlay:true,//是否是直播
			liveStream:null,//直播流
			playBackTitle:'',//回听栏目title
			percent:0, //播放百分比
			currentTime:0, //当前播放时间
			duration:0 //播放总时间
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
		this.watchPlayPercent()
	},
	methods:{
		_getChannelItem(cid) {
			let todayStamp = this._timeToStamp(this._getToDay());
			clickItem(cid, todayStamp).then((res) => {
				let data = res.data;
				this.itemsInfo = data;
				this.itemsList = data.programs;
				this.liveStream = data.streams[0];
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
		_scrollTop(){
			this.$refs.listview.scroll && this.$refs.listview.scroll.scrollTo(0,0,1000)
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
		formatPlayTime(interval) {
	        interval = interval | 0
	        const minute = this._pad(interval / 60 | 0)
	        const second = this._pad(interval % 60)
	        return `${minute}:${second}`
	    },
	    _pad(num, n = 2) {
	        let len = num.toString().length
	        while (len < n) {
	          num = '0' + num
	          len++
	        }
	        return num
	    },
	    //点播列表
	   	getDatePrograms(date){
	   		let cid = this.cid;
	   		let year = (new Date()).getFullYear();
	   		let month = this._pad(new Date().getMonth() + 1);
        let day = this._pad(new Date().getDate())
	   		let time = year + '-' + date.date + ' 00:00:00.0';
	   		let stamp = this._timeToStamp(time)
	   		let nowDate = month +'-'+ day;
	   		if(nowDate == date.date){// 如果点击的是今天，那么跳动到直播
	   			this.isToDay = true
	   		}else{
	   			this.isToDay = false
	   		}
	   		this._getItems(this.cid, stamp, !this.isToDay)
	   	},
	   	playBackSrc(item, index) {
	   		let playUrl = item.playUrl;
	   		if(index == this.isPlayIndex){// 如果相等，则是直播，否则是点播
	   			this.isLivePlay = true
	   			this._playSrc(this.liveStream)
	   		}else{
	   			this.isLivePlay = false
	   			if(!playUrl){
		   			return
		   		}else{
		   			if(playUrl.length == 0){
		   				return
		   			}else{
		   				//回听
		   				this.playBackTitle = item.title;
		   				this._playSrc(playUrl[0])
		   			}
		   		}
	   		}
	   	},
	   	_getToDay() {
	   		let year = (new Date()).getFullYear();
	   		let month = this._pad(new Date().getMonth() + 1);
        	let day = this._pad(new Date().getDate())
        	let today =`${year}-${month}-${day} 00:00:00.0`
        	return today
	   	},
	   	//时间转时间戳
	    _timeToStamp(date){
	        // var date = '2015-03-05 00:00:00.0';
	        date = date.substring(0,19);
	        date = date.replace(/-/g,'/');
	        var timestamp = new Date(date).getTime();
	        return timestamp/1000;
	    },
	    _getItems(cid,time,isScrollTop){
	    	clickItem(cid, time).then((res) => {
	    		let data = res.data;
	    		this.itemsList = data.programs
	    		if(isScrollTop){
	    			this._scrollTop()
	    		}else{
	    			this._scrollTo(this.isPlayIndex)
	    		}
	    	})
	    },
	    //监听播放信息
	    watchPlayPercent() {
	    	this.audio.addEventListener('timeupdate',(e) => {
	    		const currentTime = e.target.currentTime;
	    		const duration = e.target.duration
	    		this.currentTime = currentTime
	    		this.duration = duration
	    		this.percent = currentTime / duration
	    	})
	    },
	    onProgressBarChange(percent) {
	        const currentTime = this.audio.duration * percent
	        this.audio.currentTime = currentTime
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
		font-size 0
		.img
			vertical-align middle
			width 300px
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
					height 84px
					color #666
					no-wrap()
					max-width 440px //最大宽度450px
					.icon-LIVE
						font-size 84px
						vertical-align middle
					.playback
						vertical-align middle
						padding 6px 10px
						background #888
						color #fff
						font-size 24px
						border-radius 6px
				&.live-time
					font-size 36px
					color #999
				&.progress-wrap
					position: relative
					height 72px
					width 400px
					.time-l
						position: absolute
						left -12px
						top 24px
						font-size 24px
					.time-r
						position: absolute
						right -24px
						top 24px
						font-size 24px
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
		.list-wrap
			position: fixed
			top $items-list-wrap-top
			width 100%
			background #fff
			bottom 0
			width 100%
			overflow hidden
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
					.playback
						padding 6px 10px
						background #888
						color #fff
						font-size 26px
						border-radius 6px
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
