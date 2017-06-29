<template>
	<div id="audioWrap">
		<audio width="0" height="0" controls autoplay id="audio">
	        <source v-if="audioSrc" :src="audioSrc">
	   </audio>
	</div>
</template>

<script>
export default {
  	name: 'audio',
  	data() {
  		return {

  		}
  	},
  	created() {

  	},
  	mounted() {
  		let oHtml = document.querySelector('html');
	    let audio = document.querySelector('#audio');
	    oHtml.addEventListener('touchstart',function(){
	        audio.play()
	    })
  	},
  	computed:{
  		audioSrc() {
  			let src = null;
  			let info = this.$store.state.itemInfo
  			if(info && info.streams && info.streams.length > 0){
  				src = info.streams[0]
  			}
  			$('#audio').attr('src',src);
  			return src;
  		}
  	}
}	
</script>

<style scoped lang="stylus">
#audioWrap
	width 0
	height 0
	overflow hidden
	position: relative
	z-index -100
</style>