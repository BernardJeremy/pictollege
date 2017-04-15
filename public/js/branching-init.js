$(document).ready(function () {
    $('#erase-me').css('display', 'none');
    $('#show-me').css('display', 'block');
    cacophony.init();
});

cacophony.callback.play = function () {
    $('#fade').hide();
}

cacophony.callback.loading = function (percent) {
    $('#percent').html(percent + '%');
}

cacophony.callback.ready = function () {
    $('#fade-loading').hide();
    $('#fade-play').show();
    $("#canvas-uuid-1").css('visibility', 'hidden');
}

cacophony.callback.browser_check = function (msg, compat) {
    $('#browser-check').html(msg);
    if (!compat) {
        $('#fade-loading').hide();
    }
}

var about_visible = false;

function fade_in() {
    $('#fade').fadeOut('slow', function () {
        cacophony.play();
    });
    return false;
}

function about() {
    if (about_visible) {
        return about_close();
    }

    cacophony.pause();
    $('#about-outer').fadeIn();
    about_visible = true;
    return false;
}

function about_close() {
    $('#about-outer').fadeOut(function () {
        about_visible = false;
        if (!cacophony.ended) {
            cacophony.play();
        }
    });
    return false;
}

$(document).keydown(function (evt) {
    if (!cacophony.input && evt.keyCode == 65) {
        about();
    }
});