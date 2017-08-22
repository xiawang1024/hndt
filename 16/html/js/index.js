$(function(){
    if(sessionStorage.getItem('oa_close_flag') == 'true'){
      $('#winWrap').css('display','none')
    }else{
      setTimeout(function(){
        $('#winWrap').fadeIn('fast')
      },1000)
    }

  //右侧新闻列表
    $.get('http://admin.hndt.com/api/page?template_id=153&rows=11',function(data){
      var dataList = [];
          dataList = data.list;
      var hotHtml = '<a target="_blank" href="' + dataList[0].link + '">' + dataList[0].title + '</a>'
      $('.hot').html(hotHtml);
      var lists = $(".toast-right .list-wrap .wrap")
      var listOneHtml = '',
          listTwoHtml = '';
      for(var i =1;i <=5; i++){
        listOneHtml += '<li class="list"><span class="dot"></span><a target="_blank" href="'+ dataList[i].link +'">' + dataList[i].title + '</a></li>'
      }
      for(var i =6;i <=10; i++){
        listTwoHtml += '<li class="list"><span class="dot"></span><a target="_blank" href="'+ dataList[i].link +'">' + dataList[i].title + '</a></li>'
      }
      lists.eq(0).html(listOneHtml)
      lists.eq(1).html(listTwoHtml)
    })

  //左侧图文
    $.get('http://admin.hndt.com/api/page?template_id=154&rows=2', function(data){
      var dataList = [];
          dataList = data.list;
      var listHtml = '';
      for(var i=0;i<=1;i++){
        listHtml += '<div class="img-txt"><img src="' + dataList[i].src + '" alt="" class="img wx-grow-shadow"><p class="text"><a target="_blank" href="' + dataList[i].link + '">' + dataList[i].title + '</a></p></div>'
      }
      $('.img-text-wrap').html(listHtml)
    })
  //左侧图列表
  $.get('http://admin.hndt.com/api/page?template_id=155', function(data){
    var dataList = [];
        dataList = data;
    var listHtml = '';
    for(var i=0;i<=2;i++){
      listHtml += '<div class="item"><a target="_blank" href="' + dataList[i].link + '"><img src="' + dataList[i].icon + '" alt="" class="img wx-grow-shadow"></a></div>'
    }
    $('.img-list-wrap').html(listHtml)
  })
})
