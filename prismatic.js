var INTERVAL_MS_CHECK_CURRRENT_TIME = 10;
var MARGIN_S_CHECK_MOVE_ACTION = (INTERVAL_MS_CHECK_CURRRENT_TIME / 1000) * 2;

var registeredAction = {
  'move': [],
  'click': [],
}

function isInZone(X, Y, zone) {
  return (X >= zone.leftX && X <= zone.rightX && Y >= zone.topY && Y <= zone.bottomY);
}

function isInTiming(from, to, current) {
  return (current >= from - MARGIN_S_CHECK_MOVE_ACTION && current <= to + MARGIN_S_CHECK_MOVE_ACTION);
}

function handleMoveAction(player) {
  var currentTimeValue = player.currentTime();
  $.each(registeredAction['move'], function (key, val) {
    if (currentTimeValue >= val.from - MARGIN_S_CHECK_MOVE_ACTION && currentTimeValue <= val.from + MARGIN_S_CHECK_MOVE_ACTION) {
      player.currentTime(val.to);
    }
  });
}

$(document).ready(function () {
  videojs('#my-video').ready(function () {
    var player = this;
    window._player = player; // Debug purpose
    $.getJSON('data.json', function (data) {

      $.each(data.events, function (key, val) {
        if (registeredAction[val.type]) {
          registeredAction[val.type].push(val);
        } else {
          console.error('Action type [' + val.type + '] doesn\'t exist !');
        }
      });

      console.log(registeredAction);

      ///////////////////////////////////
      // Handle move action
      ///////////////////////////////////
      setInterval(function () {
        handleMoveAction(player);
      }, INTERVAL_MS_CHECK_CURRRENT_TIME);

      ///////////////////////////////////
      // Handle click action
      ///////////////////////////////////
      var videoCanva = $('.video-js');
      videoCanva.click(function (e) {
        $.each(registeredAction['click'], function (key, val) {
          var actualZone = {
            "leftX": parseFloat(val.leftX) / parseFloat(data.baseData.baseWidth) * parseFloat(videoCanva.width()),
            "topY": val.topY / data.baseData.baseHeight * videoCanva.height(),
            "rightX": val.rightX / data.baseData.baseWidth * videoCanva.width(),
            "bottomY": parseFloat(val.bottomY) / parseFloat(data.baseData.baseHeight) * parseFloat(videoCanva.height()),
          };

          if (isInZone(e.clientX, e.clientY, actualZone) && isInTiming(val.starting, val.ending, player.currentTime())) {
            if (val.jumpTo) {
              console.log('Jump to  : ' + val.jumpTo);
              player.currentTime(val.jumpTo);
            }
          }
        });

      });
    });
  });
});
