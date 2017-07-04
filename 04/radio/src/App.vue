<template>
  <div id="app">
  	<transition name="router-fade">
  		<router-view></router-view>
  	</transition>    
    <player></player>
  </div>
</template>

<script>
import player from './pages/player.vue'
export default {
	components:{
		player
	},
  	name: 'app'
}
</script>

<style scoped lang="stylus">
.router-fade-enter-active, .router-fade-leave-active 
    transition: opacity .3s
.router-fade-enter, .router-fade-leave-active 
    opacity: 0 
</style>
