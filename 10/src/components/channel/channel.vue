<template>
	<div class="channel">
		<div class="logo-wrap">
			<div class="wave" @click="goToItems(isPlayIndex)">
				<wave></wave>
			</div>
			<img src="./logo.png" alt="" class="img">
			<load class="load"></load>
		</div>
		<tab-slider
			class="tab-slider-wrap"
			v-if="itemsData.length>0"
			ref="tabslider"
			:data="itemsData"
		>
			<scroll
				v-for="(group,index) in itemsData"
				:data="itemsData"
				:key="index"
			>
				<div class="scroll">
					<div
						v-for="item in group"
						class="items"
						@click="goToItems(item.cid,item.streams[0])"
						:class="item.cid == isPlayIndex ? 'isLivePlay' : ''"
					>
						<div class="icon item">
							<img :src="'http://program.hndt.com' + item.image" class="img">
						</div>
						<div class="live-info item">
							<p class="name">
								{{item.name}}
							</p>
							<p class="live-name">
								<i class="icon-LIVE" v-if="item.live"></i>{{item.live}}
							</p>
							<p class="live-time">
								{{item.time}}
							</p>
						</div>
						<div class="play-pause-btn item">
							<i class="icon-blue" v-if="item.cid == isPlayIndex"></i>
							<i class="icon-ddd" v-else></i>
						</div>
					</div>
				</div>
			</scroll>
		</tab-slider>
	</div>
</template>

<script>
import TabSlider from '@/base/tabSlider'
import Scroll from '@/base/scroll'
import Wave from '@/base/wave'
import Load from '@/components/load/load'
import {getClassItem} from "api/index"
import BScroll from 'better-scroll'

const TAB_ARR = ['河南台','网络台','市县台']
export default {
	name:'channel',
	components:{
		TabSlider,
		Scroll,
		Wave,
		Load
	},
	data() {
		return {
			itemsData:[],
			stream:null,
			isPlayIndex:null
		}
	},
	mounted(){
		setTimeout(() => {
			if (!this.$refs.wrapper) {
	          return
	        }
			new BScroll(this.$refs.wrapper, {
	          probeType: 1,
	          click: true
	        })
		},5000)
	},
	created() {
		this._getClassItem();
		this._parseQuery()
		this.itemsData = new Array(3)
	},
	mounted() {
		if(!document.getElementById('audio').getAttribute('src')){
			document.getElementById('audio').setAttribute('src','http://stream.hndt.com:1935/live/xinwen/playlist.m3u8')
		}
	},
	methods:{
		_getClassItem() {
			var promises = [1,2,3].map((cid) => {
				return getClassItem(cid).then((res) => {
					return res.data
				})
			})
			Promise.all(promises).then((res) => {
				this.itemsData = res
			})
		},
		goToItems(cid,stream) {
			if(stream){
				this.playSrc(cid,stream);
			}
			this.setPlayIndex(cid);
			this.$router.push({ path: '/items', query: { cid: cid }})
		},
		playSrc(cid,stream) {
			let audio = document.getElementById('audio')
			if(cid != this.isPlayIndex){
				audio.setAttribute('src',stream)
			}
		},
		setPlayIndex(index){
			this.isPlayIndex = index;
		},
		_parseQuery() {
			let query = this.$route.query
			let isPlayIndex = query.isPlayIndex;
			if(isPlayIndex){
				this.isPlayIndex = isPlayIndex
			}else{
				this.isPlayIndex = 1
			}
		}
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin.styl'
.channel
	width 100%
	background #fff
	.logo-wrap
		position: relative
		width 100%
		height $channel-hd-height
		line-height $channel-hd-height
		font-size 0
		text-align center
		overflow hidden
		border-1px($color)
		.img
			vertical-align middle
			width 300px
		.wave
			position: absolute
			left 10px
			top 0
		.load
			position: absolute
			right 30px
			top 30px
	.tab-slider-wrap
		position: fixed
		top $channel-hd-height
		bottom 0
		left 0
		right 0
		width 100%
		overflow hidden
		background #fff
		.items
			display flex
			height $channel-item-height
			align-items center
			border-1px($color)
			.item
				flex 1
				text-align center
				&.icon
					font-size 0
					.img
						width 180px
						height 180px
						border-radius 50%
						border 2px solid $color
				&.live-info
					font-size 34px
					text-align center
					.name,.live-name,.live-time
						line-height 200%
					.live-name,.live-time
						font-size 30px
						color #666
						no-wrap()
						max-width 250px
						margin 0 auto
						.icon-LIVE
							vertical-align middle
							font-size 80px
							color #000
				&.play-pause-btn
					font-size 80px
			&.isLivePlay
				.icon
					.img
						border 2px solid #1ba2ff

</style>
