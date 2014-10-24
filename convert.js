// Convert.js 1.0.0
// http://convertjs.com
// (c) 2014 - Mattias Hising, 80 Ridge Street Media AB
// ConvertJS may be freely distributed under the MIT license

(function () {

    var root = this;

    var _listeners = {};
    var _listenerQueue = {};

    var _scrollTimer = null;

    var _throttle = function (delay, callback) {
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();
            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    };

    var _merge = function (base, merge) {
        var merged = {};

        for (var key in base) {
            merged[key] = base[key];
        }

        for (var key in merge) {
            merged[key] = merge[key];
        }

        return merged;
    };

    var Convert = function (options) {

        var defaults = {
            'throttle': 500,
            'sensitivity': 100
        };

        var config = _merge(defaults, options);

        _scrollTimer = setInterval(function () {
            this.atBottom();
        }.bind(this), config.throttle);
    };

    var supportedEvents = [
        'exit',
        'new',
        'return',
        'firstview',
        'idle',
        'pagebottom'
    ];

    Convert.prototype.atBottom = function () {
        var docElement = document.documentElement;
        var winElement = window;

        if ((docElement.scrollHeight - winElement.innerHeight) == winElement.scrollY) {
            clearInterval(_scrollTimer);
            this.trigger({
                type: 'pagebottom'
            });
        }
        return false;
    };

    Convert.prototype.on = function (eventType, callback) {
        if (typeof _listeners[eventType] == 'undefined') {
            _listeners[eventType] = [];
        }
        _listeners[eventType].push(callback);
    };

    Convert.prototype.trigger = function (event) {
        if (!event.type) {
            throw new Error("Event missing 'type' property ");
        }

        if (typeof _listeners[event.type] != 'undefined') {
            var listeners = _listeners[event.type];

            for (var i = 0; i < listeners.length; i++) {
                listeners[i].call(this, event);
            }
        }

        if (typeof _listenerQueue[event.type] != 'undefined') {
            var listenerQueue = _listenerQueue[event.type];

            for (var i=0; i < listenerQueue.length; i++) {
                listenerQueue[i].call(this, event);
            }

            _listenerQueue[event.type] = [];
        }
    };

    Convert.prototype.off = function (eventType, callback) {

        if (typeof _listeners[eventType] != 'undefined') {
            var listeners = _listeners[eventType];
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i] === callback){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    };

    Convert.prototype.one = function (eventType, callback) {
        if (typeof _listenerQueue[eventType] == 'undefined') {
            _listenerQueue[eventType] = [];
        }
        _listenerQueue[eventType].push(callback);
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Convert;
        }
        exports.Convert = Convert;
    } else {
        root.Convert = Convert;
    }

}.call(this));