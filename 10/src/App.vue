<template>
  <div id="app">
    <keep-alive :include="['channel']">
        <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
  	return {
  		pathName:'channel'
  	}
  },
  watch:{
  	'$route' () {
  		// console.log(this.$route)
  		this.pathName = this.$route.name
  		console.log(this.pathName)
  	}
  }
}
</script>

<style scoped lang="stylus">


</style>
