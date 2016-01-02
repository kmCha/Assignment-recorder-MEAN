$(document).ready(function(){
	var wow = new WOW({
    mobile: false
  });
  wow.init();
  // $(window).scroll( function() {
  //     /* ...do something... */
  //     var distanceTop = $('#signupGuide').offset().top;
  //     var distanceAni = $('#signupGuide').outerHeight(true)/1.2;
  //     var scrollDistance = $(document).scrollTop();
  //     if (distanceTop - distanceAni <= scrollDistance && distanceTop + distanceAni >= scrollDistance) {
  //         $('#signupGuideTitle').children('img').each(function(i) {
  //             $(this).addClass('signupGuide' + i);
  //         });
  //     }
  //     else {
  //         $('#signupGuideTitle').children('img').each(function(i) {
  //             $(this).removeClass('signupGuide' + i);
  //         });
  //     }
  //     // console.log($('#signupGuide').offset().top);
  //     // console.log($(document).scrollTop());
  //     // console.log($('#signupGuide').outerHeight(true));
  // });
  // var signupGuide = document.querySelector("#signupGuide");
  // var welcome = document.querySelector(".welcome");
  // console.log(signupGuide.style.paddingTop);
  // signupGuide.style.paddingTop = welcome.offsetHeight + "px";
  var resizeHandler = function(event) {
    var bgImg = document.querySelector(".mainBg"),
        welBox = document.querySelector(".welcome"),
        assContainer = document.querySelector(".assignmentContainer"),
        windowHeight = window.innerHeight,
        windowWidth = window.innerWidth,
        scheduledAnimationFrame = false;
    if(scheduledAnimationFrame) {
      return;
    }

    scheduledAnimationFrame = true;
    requestAnimationFrame(update);

    function update(){
      if(bgImg) {
        bgImg.height = windowHeight - 40;
        bgImg.width = windowWidth;
      }
      if(welBox) {
        welBox.style.height = (windowHeight - 50) + "px";
        //welBox.style.width = window.innerWidth + "px";
      }
      if(assContainer) {
        assContainer.style.height = (windowHeight - 50) + "px";
      }
    }
  };
  KM.EventUtil.addEventListener(window, "resize", resizeHandler);
});