$(function(){
  //tab切换
  var tabs = $('.main .tabs .tab');
  var listsWraps = $('.tab-cont .lists-wrap')
  tabs.click(function(){
    $(this).addClass('isActive').siblings().removeClass('isActive')
    listsWraps.css('display','none');
    listsWraps.eq($(this).index()).css('display','block')
  })
})
