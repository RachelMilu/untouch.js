/**
 Implement the simple event below without dependence on the zepto.js
 @event_name: tap, singleTap, longTap, doubleTap; swipeDown, swipeUp, swipeRight, swipeLeft.
 @author Gaoxiaoqian
 @version 0.0.3
 @how_to_use in js:

 if you import zepto or jquery :

 $('#kk').on('longTap',function(e){})

 otherwise you can use like below:

 document.getElementById('sw1').addEventListener('longTap',function(e){})

 **/
;

(function (win) {
    var doc = document;
    doc.onreadystatechange = function () {
        if (doc.readyState == 'interactive') {
            bindTaps(doc);
        }
    };

    function bindTaps(doc) {
        var singleTapTimeout, longTapTimeout, now, touchsDelta, inTouchDelta, swipeDirection
        var singleTapDelay = 300, longTapDelay = 750, tapOffset = 30
        var lastTouch = {}, curTouch = {}
        var isTap = false

        doc.addEventListener('touchstart', _ts, false)
        doc.addEventListener('touchmove', _tm, false)
        doc.addEventListener('touchend', _te, false)

        function _ts(e) {
            curTouch.startMs = Date.now()
            touchsDelta = curTouch.startMs - (lastTouch.endMs || curTouch.startMs)
            curTouch.startX = e.changedTouches[0].clientX
            curTouch.startY = e.changedTouches[0].clientY

            cancelSingleTap()

            longTapTimeout = setTimeout(function () {longTap(e)}, longTapDelay)
        }

        function _tm(e) {
            cancelLongTap()
        }

        function _te(e) {
            curTouch.endMs = Date.now()
            inTouchDelta = curTouch.endMs - curTouch.startMs
            curTouch.endX = e.changedTouches[0].clientX
            curTouch.endY = e.changedTouches[0].clientY
            curTouch.distanceX = curTouch.startX - curTouch.endX
            curTouch.distanceY = curTouch.startY - curTouch.endY

            isTap = Math.abs(curTouch.distanceX) < tapOffset && Math.abs(curTouch.distanceY) < tapOffset

            cancelLongTap()

            if (isTap) {//当前的touch是点按
                setLastTouch()
                checkTaps(e)
            } else {//当前的touch是拖动
                lastTouch = {}
                swipeDirection = Math.abs(curTouch.endY - curTouch.startY) > Math.abs(curTouch.endX - curTouch.startX) ?
                    (curTouch.endY - curTouch.startY > 0 ? "swipeDown" : "swipeUp") :
                    (curTouch.endX - curTouch.startX > 0 ? "swipeRight" : "swipeLeft")
                triggerSwipe(e, swipeDirection);
            }
        }

        function checkTaps(e) {
            triggerTap(e)

            if (inTouchDelta < longTapDelay) {
                if (touchsDelta > 0 && touchsDelta <= singleTapDelay) {//有前一个touch
                    if (inTouchDelta < singleTapDelay) {//双击
                        lastTouch.endMs = now
                        doubleTap(e)
                        cancelSingleTap()
                    } else {//双击但是第二点击的touchend与touchstart的时间差在300-700ms之间，这样不触发双击火车长按
                        lastTouch = {}
                    }
                } else if (touchsDelta > singleTapDelay) {//有前一个touch 且两个touch间隔>300 前一次为单击或者长按 理论上不会进这个条件
                    //console.log('两个touch间隔>300', touchsDelta)
                    lastTouch = {}
                } else { //无前一个touch
                    singleTapTimeout = setTimeout(function () {singleTap(e)}, singleTapDelay)//300ms之后触发单击
                }
            } else {//长按已被触发
                lastTouch = {}
            }
        }

        function setLastTouch() {
            lastTouch.distanceX = Math.abs(lastTouch.startX - curTouch.endX)
            lastTouch.distanceY = Math.abs(lastTouch.startY - curTouch.endY)
            for (var key in curTouch) {
                lastTouch[key] = curTouch[key]
            }
        }

        function cancelSingleTap() {
            if (singleTapTimeout) clearTimeout(singleTapTimeout)
            singleTapTimeout = null
        }

        function cancelLongTap() {
            if (longTapTimeout) clearTimeout(longTapTimeout)
            longTapTimeout = null
        }

        function triggerSwipe(e, name) {
            trigger(e.target, name, e)
        }

        function triggerTap(e) {
            trigger(e.target, "tap", e)
        }

        function longTap(e) {
            lastTouch = {}
            trigger(e.target, "longTap", e)
        }

        function singleTap(e) {
            trigger(e.target, "singleTap", e)
            lastTouch = {}
        }

        function doubleTap(e) {
            trigger(e.target, "doubleTap", e)
            lastTouch = {}
        }

        function trigger(element, name, data) {
            if (win.$) {
                $(element).trigger(name)
            } else {
                var evt = doc.createEvent('HTMLEvents')
                evt.initEvent(name, true, true)
                evt.result = data
                element.dispatchEvent(evt)
            }
        }
    }
})(window)

