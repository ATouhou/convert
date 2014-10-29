var Cookie = require('./Cookie');

var SplitTest = {};

SplitTest.init = function () {
    var splitTests = document.getElementsByClassName('split-test');
    for (var i = 0; i < splitTests.length; i++) {
        var splitTest = splitTests[i];
        var variations = splitTest.getElementsByClassName('variation');
        var splitTestName = splitTest.getAttribute('id');

        var cookieName = 'convertJsSplitTest-' + splitTestName;
        var elementId = Cookie.getCookie(cookieName);

        if (!elementId) {
            var index = Math.floor(Math.random()*variations.length);
            elementId = variations[index].getAttribute('id');
            Cookie.setCookie(cookieName, elementId, 90, "/");
        }

        var elm = document.getElementById(elementId);
        elm.style.display = 'block';

    }
};

SplitTest.trackSuccess = function (splitTestName) {

    var cookieName = 'convertJsSplitTest-' + splitTestName;
    var eventName = 'AB-Testing';
    var variationName = Cookie.getCookie(cookieName);

    if (window.ga !== 'undefined') {
        window.ga('send', 'event', eventName, splitTestName, variationName);
    } else if (window._gaq !== 'undefined') {
        window._gaq.push(['_trackEvent', eventName, splitTestName, variationName]);
    }

};

module.exports = SplitTest;