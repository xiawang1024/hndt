import Vue from 'vue'

//时间戳转换格式
Vue.filter('formdata',function(value){
  var val = parseInt(value) * 1000;
  var time = new Date(val);
  var hour = time.getHours();
  var min = time.getMinutes();
  if(hour < 10){
  	hour = '0' + hour;
  }
  if(min < 10){
  	min = '0' + min
  }
  return hour + ':' + min;
})
Vue.filter('formdate',function(value){
  var val = parseInt(value);
  var time = new Date(val);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  return year + '年' + month + '月' + day + '日';
})