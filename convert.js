// Convert.js 1.0.0
// http://convertjs.com
// (c) 2014 - Mattias Hising, 80 Ridge Street Media AB
// ConvertJS may be freely distributed under the MIT license

(function () {

    var root = this;

    var _listeners = {};

    var Convert = function (options) {};

    var supportedEvents = [
        'exit',
        'new',
        'return',
        'firstview',
        'idle'
    ];

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

        var listeners = _listeners[event.type];

        for (var i=0; i < listeners.length; i++) {
            listeners[i].call(this, event);
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

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Convert;
        }
        exports.Convert = Convert;
    } else {
        root.Convert = Convert;
    }

}.call(this));