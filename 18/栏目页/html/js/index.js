$(function(){
  //音频信息
  var audio = $('#audio').get(0);
  var audioInfo = {
    currentTime:0,
    totalTime:0,
    percent:0
  }
  //工具函数
  function formatTime(interval){
    interval = interval | 0;
    var minute = pad(interval / 60 | 0),
        second = pad(interval % 60);
    // return `${minute}:${second}`
    return minute +':'+ second;
  }
  function pad(num){
    var len = num.toString().length;
    var n = 2;
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  }
  //进度条
  var setbacks = $('.audio-setbacks')
  var thisSetbacks = $('.audio-this-setbacks')
  setbacks.on('mousedown', function(e) {
    $(document).on('mousemove', function(e) {
      audioPause()
      setbacksMove(e);
    }).one('mouseup', function() {
      $(this).unbind('mousemove');
      audioPlay()
    });
  }).on('click', function(e) {
    setbacksMove(e);
  });

  var X,
    EndX = parseInt(setbacks.css('width')),
    goX,
    mouseTime,
    cuTime;
  function setbacksMove(e) {

    e = e || window.event;

    X = (e.clientX - setbacks.offset().left);
    X = (X > 0)
      ? (X > EndX)
        ? EndX
        : X
      : 0;

    goX = X / EndX;
    thisSetbacks.css({
      'width': goX*100 + "%"
    });
    audio.currentTime = audioInfo.totalTime * goX
  }
  //audio
  audio.addEventListener('timeupdate',function(e){
    var currentTime = e.target.currentTime,
        totalTime = e.target.duration;
    audioInfo.currentTime = currentTime;
    audioInfo.totalTime = totalTime;
    var percent = (currentTime / totalTime)*100 | 0
    audioInfo.percent = percent;
    timeShow(audioInfo)
    thisSetbacks.css({
      'width': percent + "%"
    });
  })
  var playBtn = $('#playOrPause');
  playBtn.click(function(){
    if(audio.paused){
      audioPlay()
    }else{
      audioPause()
    }
  })
  function audioPlay(){
    audio.play()
    playBtn.addClass('paused')
  }
  function audioPause(){
    audio.pause()
    playBtn.removeClass('paused')
  }
  function setAudioSrc(src, html){
    audio.setAttribute('src',src);
    audioPlay()
    $('.progress .name').html(html)
  }
  function timeShow(audioInfo){
    $('.current-time').html(formatTime(audioInfo.currentTime));
    $('.duration').html(formatTime(audioInfo.totalTime))
  }
  //专辑列表
  var lists = $('.album-list .list-wrap .list');
  lists.click(function(){
    var src = $(this).get(0).dataset.src;
    var html = $(this).find('.title').html()
    setAudioSrc(src, html)
    $(this).siblings().children('.left').removeClass('isPlay')
    $(this).children('.left').addClass('isPlay')

  })


})
