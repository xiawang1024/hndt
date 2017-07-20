<template>
	<div class="channel">
		<div class="logo-wrap">
			<img src="./logo.png" alt="" class="img">
		</div>
		<tab-slider 
		class="tab-slider-wrap" 
		v-if="itemsData.length>0"
		ref="tabslider"
		:data="itemsData"
		>			
			<scroll v-for="(group,index) in itemsData" :data="itemsData" :key="index">
				<div class="scroll">										
					<div v-for="item in group" class="items" @click="goToItems(item.cid)">
						<div class="icon item">
							<img :src="'http://program.hndt.com' + item.image" class="img">
						</div>
						<div class="live-info item">
							<p class="name">
								{{item.name}}
							</p>
							<p class="live-name">
								{{item.live}}
							</p>
							<p class="live-time">
								{{item.time}}
							</p>
						</div>
						<div class="play-pause-btn item">
							<i class="icon-ddd"></i>
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
import {getClassItem} from "api/index"
import BScroll from 'better-scroll'

const TAB_ARR = ['河南台','网络台','市县台']
export default {
	name:'channel',
	components:{
		TabSlider,
		Scroll
	},
	data() {
		return {
			itemsData:[]
		}
	},
	computed:{
		
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
		this.itemsData = new Array(3)
		this._getClassItem();		
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
		goToItems(cid) {
			this.$router.push({ path: '/items', query: { cid: cid }})
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
		width 100%
		height 100px
		line-height 100px
		font-size 0
		text-align center
		overflow hidden
		border-1px(#eee)
		.img
			vertical-align middle
			width 200px
	.tab-slider-wrap
		position: fixed
		top 100px
		bottom 0
		left 0
		right 0
		width 100%
		overflow hidden
		background #fff
		.items
			display flex
			height 200px
			align-items center
			border-1px(#eee)
			.item
				flex 1
				text-align center
				&.icon
					font-size 0
					.img
						width 150px
						height 150px
						border-radius 50%
						border 2px solid #eee
				&.live-info
					font-size 28px
					.name,.live-name,.live-time
						line-height 200%
					.live-name,.live-time
						font-size 26px
						color #666
						no-wrap()
						max-width 250px
				&.play-pause-btn
					font-size 70px
				
</style>