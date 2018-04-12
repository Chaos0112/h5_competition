
function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return 'phone';
    }else
    {
        return 'pc';
    }
}
setRem();
window.addEventListener("orientationchange", setRem);
window.addEventListener("resize", setRem);
window.addEventListener("resize", setRem);
function setRem() {
    var html = document.querySelector("html");
    var width = html.getBoundingClientRect().width;
    if(browserRedirect()=="pc"){
        if(width>750){width=750; html.style.maxWidth = 750 + 'px';}
    }
    html.style.fontSize = 100*width /750 + "px";

}

var touchEvents = {
    touchstart: "touchstart",
    touchmove: "touchmove",
    touchend: "touchend",
    touchEvents: function () {
        if (navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/Windows/i)
        ) {
            this.touchstart = "mousedown";
            this.touchmove = "mousemove";
            this.touchend = "mouseup";
        }
    }
};
touchEvents.touchEvents();


