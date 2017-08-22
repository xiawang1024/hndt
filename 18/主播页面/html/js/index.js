$(function(){
  var audio = $('#audio').get(0);
  var playBtns = $('.voice-wrap .list .play-pause');
  var playBtnsIndex = -1;
  
  playBtns.each(function(index, item){
    var playBtn = $(item)
    playBtn.click(function(e){      
      var src = $(this).get(0).dataset.src
      if($(this).hasClass('paused')){   
        playBtnsIndex = index;
        // console.log(playBtnsIndex)    
        audioPause($(this));        
      }else{          
        // console.log(playBtnsIndex == index)      
        if(playBtnsIndex == index){
          audioPlay($(this));
        }else{
          setAudioSrc(src);
          audioPlay($(this));  
          progress($(this))
        }
      }
    })
  })
  //进度条
  function progress (_this){
    var currentTime = 0,
        totalTime = 0,
        percent = 0;
    var setbacks = _this.next().find('.audio-setbacks')   
    var thisSetbacks = _this.next().find('.audio-this-setbacks')
    setbacks.on('mousedown', function(e) {
      $(document).on('mousemove', function(e) {
        setbacksMove(e);
      }).one('mouseup', function() {
        $(this).unbind('mousemove');
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
      audio.currentTime = totalTime * goX
    }
    //audio
    audio.addEventListener('timeupdate',function(e){
      currentTime = e.target.currentTime,
      totalTime = e.target.duration;      
      percent = (currentTime / totalTime)*100 | 0
      timeShow(_this)
      $('.audio-this-setbacks').css({'width':0})
      _this.next().find('.audio-this-setbacks').css({
        'width': percent + "%"
      });

    })
    function timeShow(_this){
      var parent =　_this.parent().prev();
      $('.currentTime').html('00:00');
      $('.totalTime').html('00:00');
      parent.find('.currentTime').html(formatTime(currentTime));
      parent.find('.totalTime').html(formatTime(totalTime))
    }
  }
  //
  function setAudioSrc(src){
    audio.setAttribute('src',src);
    audio.play()
  }
  function audioPlay(_this){
    audio.play()
    playBtns.removeClass('paused')
    _this.addClass('paused')
  }
  function audioPause(_this){
    audio.pause()
    _this.removeClass('paused')
  }
  
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
})
