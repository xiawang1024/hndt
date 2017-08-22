$(function(){
  $('.qrLoginBtn').click(function(){
    $('.login-form').css('display','none');
    $('.loginBtn').css('display','none');
    $('.qr-login').css('display','block')
  })
  $('.accountLoginBtn').click(function(){
    $('.qr-login').css('display','none');
    $('.login-form').css('display','block');
    $('.loginBtn').css('display','block');
  })

  $('.list-wrap').click(function(e){
    var target = e.target;
    $('.selectedLanguage').html($(target).html())
    $(this).css('display','none')
  })
  $('.language').hover(function(){
    $('.list-wrap').css('display','block')
  },function(){
    $('.list-wrap').css('display','none')
  })
})
