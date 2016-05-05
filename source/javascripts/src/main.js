window.onload = function() {
  var wow = new WOW({
    mobile: false
  });
  wow.init();
  var scheduledAnimationFrame = false;
  var resizeHandler = function(event) {
    if (scheduledAnimationFrame) {
      console.log("aa");
      return;
    }
    var bgImg = document.querySelector(".mainBg"),
      welBox = document.querySelector(".welcome"),
      assContainer = document.querySelector(".assignmentContainer"),
      windowHeight = window.innerHeight,
      windowWidth = window.innerWidth;

    scheduledAnimationFrame = true;
    requestAnimationFrame(update);

    function update() {
      if (bgImg) {
        bgImg.height = windowHeight - 40;
        bgImg.width = windowWidth;
      }
      if (welBox) {
        welBox.style.height = (windowHeight - 50) + "px";
        //welBox.style.width = window.innerWidth + "px";
      }
      if (assContainer) {
        assContainer.style.height = (windowHeight - 50) + "px";
      }
      scheduledAnimationFrame = false;
    }
  };
  KM.EventUtil.addEventListener(window, "resize", resizeHandler);
};