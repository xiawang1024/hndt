$(function() {
  var Btn = $('#descBtn');
  Btn.click(function() {
    if (parseInt($('.video-wrap').css('left')) != 0) {
      $('.video-wrap').animate({
        left: 0
      }, function() {
        $('.video-desc').hide()
        Btn.addClass('left')
      });
    } else {
      $('.video-wrap').animate({
        left: '-170px'
      }, function() {
        $('.video-desc').show()
        Btn.removeClass('left')
      })
    }
    var options = {
      techOrder: [
         'html5','flash'
      ],
      children: {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false,
        controlBar: {
          captionsButton: false,
          chaptersButton: false,
          subtitlesButton: false,
          liveDisplay: false,
          playbackRateMenuButton: false
        }
      }
    };

    var player = videojs('my-player', options, function onPlayerReady() {
      videojs.log('Your player is ready!');

      // In this context, `this` is the player that was created by Video.js.
      this.play();

      // How about an event listener?
      this.on('ended', function() {
        videojs.log('Awww...over so soon?!');
      });
    });
    // player.src({
    //   src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
    //   type: 'application/x-mpegURL',
    // })
  })
})
