<template>
	<div class="items">
		<div class="hd">
			<router-link to="/channel" tag='span' class="icon-back back"></router-link>
			<span class="title">
				河南广播网
			</span>
		</div>
		<div class="audio-wrap" >
			<div class="item-logo" v-if="itemsInfo">
				<img :src="'http://program.hndt.com' + itemsInfo.image" alt="" class="img">
				<span class="icon-play"></span>
			</div>
			<div class="item-info" v-if="itemsInfo">
				<p class="name" >{{itemsInfo.name}}</p>
				<p class="live-name">{{itemsInfo.live}}</p>
				<p class="live-time">{{itemsInfo.time}}</p>
			</div>
		</div>
		<div class="itemsList">
			<div class="title">节目列表</div>
			<scroll class="list-wrap" :data="itemsList" ref="listview" >
				<div>
					<div class="list" v-for='(item, index) in itemsList' ref="list">
						<span class="item time">{{format(item.beginTime)}} - {{format(item.endTime)}}</span>
						<span class="item name">{{item.title}}</span>
						<span class="item isPlay">
							<i v-if="index === isPlayIndex" class="icon-voice"></i>
						</span>
					</div>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
import Scroll from '@/base/scroll'
import { getChannelItem } from 'api/index'
import {addClass} from 'common/js/dom.js'
export default {
	name:'items',
	components:{
		Scroll
	},
	data() {
		return {
			itemsInfo:null,
			itemsList:[],
			isPlayIndex:null,
			cid:null
		}
	},
	created() {
		this.parseQuery()
	},
	mounted() {
		
	},
	watch:{
		cid(){
			console.log(this.cid)
		}
	},
	computed:{
		
	},
	methods:{
		_getChannelItem(cid) {
			getChannelItem(cid).then((res) => {
				let data = res.data;
				this.itemsInfo = data;
				this.itemsList = data.programs;
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
		parseQuery() {
			let query = this.$route.query
			let cid = query.cid;
			this.cid = cid;
			if(cid){
				this._getChannelItem(cid)
			}
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
.items
	width 100%
	background #fff
	.hd
		position: relative
		width 100%
		height 100px
		line-height 100px
		text-align center
		border-1px(#eee)
		.back
			position: absolute
			line-height 100px
			left 30px
			font-size 60px
		.title
			font-size 40px
	.audio-wrap
		width 100%
		height 300px
		display flex
		align-items center
		border-1px(#eee)
		.item-logo
			flex 2
			text-align center
			position: relative
			font-size 0
			.img
				width 200px
				height 200px 
				border-radius 50%
				border 2px solid #eee
			.icon-play
				position: absolute
				left 50%
				top 50%
				transform translate(-50%,-50%)
				font-size 80px
				color #1ba2ff
				opacity 0.8
		.item-info
			flex 3
			text-align left
			p
				line-height 2
				&.name
					font-size 30px
				&.live-name
					font-size 26px
					color #666
				&.live-time
					font-size 26px
					color #999
	.itemsList
		width 100%
		.title
			width 100%
			height 60px
			line-height 60px
			padding-left 30px
			font-size 30px
			font-weight 700
			border-1px(#eee)
			box-sizing border-box
		.list-wrap
			position: fixed
			top 460px
			width 100%
			background #fff
			.list 
				display flex
				height 80px
				line-height 80px
				border-1px(#eee)
				font-size 28px
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
</style>