 var bannerSwiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay:4000,
    speed:400,
    // 如果需要分页器
    pagination: '.swiper-pagination',

    // 如果需要前进后退按钮
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
})
var hostSwiper = new Swiper('.swiper-host', {
    loop: true,
    autoplay:5000,
    speed:400,
    slidesPerView : 3,
	spaceBetween : 30,
    // 如果需要前进后退按钮
    nextButton: '.host-button-next',
    prevButton: '.host-button-prev',
})
var programScroll = new IScroll('#list-wrap', { scrollX: false, scrollY: true, mouseWheel: true });
//播放暂停按钮
(function(){
    var elBtn = $('.play-pause');
    elBtn.click(function(){
        var isPaused = elBtn.hasClass('paused');
        if(!isPaused){
            elBtn.addClass('paused');
        }else{
            elBtn.removeClass('paused')
        }
    })   
})()