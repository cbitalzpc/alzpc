$(window).load(function() {
    $('.header--section').height($('.header--section').height());    
    $('#navbar--main').affix({
          offset: {
            top: $('.header--section').height()
          }
    });    
});