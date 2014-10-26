// Convert.js 1.0.0
// http://convertjs.com
// (c) 2014 - Mattias Hising, 80 Ridge Street Media AB
// ConvertJS may be freely distributed under the MIT license

(function () {

    var root = this;
    var _listeners = {};
    var _listenerQueue = {};

    var _scrollTimer = null;

    function supportsNavigationTiming() {
        return !!(window.performance && window.performance.timing);
    }

    var _merge = function (base, merge) {
        var merged = {};

        for (var baseKey in base) {
            merged[baseKey] = base[baseKey];
        }

        for (var mergeKey in merge) {
            merged[mergeKey] = merge[mergeKey];
        }

        return merged;
    };

    var Utils = {
        capitalize: function (string) {
            return string.replace(/^./, function (match) {
                return match.toUpperCase();
            });
        }
    };

    var ABTest = function () {

    };

    var Storage = function () {

        this.setValue = function (key, value, expire) {

        };

        this.getValue = function (key) {

        };
    };

    var SessionStorage = function () {

    };

    var CookieStorage = function () {

    };

    var ServerStorage = function () {

    };

    var LocalStorageStorage = function () {

    };

    var supportedEvents = [
        'exit',
        'new',
        'return',
        'firstview',
        'idle',
        'pagebottom'
    ];

    var Convert = function (options) {

        var self = this;

        var defaults = {
            aggressive: false,
            sensitivity: 20,
            delay: 0,
            throttle: 200,
            storage: 'cookie'
        };

        var _timer = null;

        var config = _merge(defaults, options);

        var disableKeydown = false;

        this.doc = null;

        switch (config.storage) {
            case 'localstorage':
                this.storage = new LocalStorageStorage();
                break;
            case 'server':
                this.storage = new ServerStorage();
                break;
            default:
                this.storage = new CookieStorage();
                break;
        }

        _scrollTimer = setInterval(function () {
            this.atBottom();
        }.bind(this), config.throttle);

        this._handleMouseLeave = function (event) {
            if (event.clientY > config.sensitivity) { return; }
            _timer = setTimeout(function () {
            self.trigger({ type: 'exit' });
            }, config.delay);
        };

        this._handleMouseEnter = function (event) {
            if (_timer) {
            clearTimeout(_timer);
            _timer = null;
            }
        };

        this._handleKeyDown = function (event) {
            if (disableKeydown) { return; }
            disableKeydown = true;

            _timer = setTimeout(function () {
            self.trigger({ type: 'exit' });
            }, config.delay);
        };


        if (typeof document !== 'undefined') {
            this.doc = document.documentElement;
            this.doc.addEventListener('mouseleave', this._handleMouseLeave);
            this.doc.addEventListener('mouseenter', this._handleMouseEnter);
            this.doc.addEventListener('keydown', this._handleKeyDown);
        }

        if (supportsNavigationTiming()) {

        }
    };

    Convert.prototype.atBottom = function () {
        var docElement = document.documentElement;
        var winElement = window;

        if ((docElement.scrollHeight - winElement.innerHeight) === winElement.scrollY) {
            clearInterval(_scrollTimer);
            this.trigger({
                type: 'pagebottom'
            });
        }
        return false;
    };

    Convert.prototype.on = function (eventType, callback) {

	if(supportedEvents.indexOf(eventType) < 0) { return; }

        if (typeof _listeners[eventType] === 'undefined') {
            _listeners[eventType] = [];
        }
        _listeners[eventType].push(callback);
    };

    Convert.prototype.trigger = function (event) {
        if (!event.type) {
            throw new Error("Event missing 'type' property ");
        }

	    if(supportedEvents.indexOf(event.type) < 0) { return; }
        
        if (typeof _listeners[event.type] !== 'undefined') {
            var listeners = _listeners[event.type];

            for (var listenerKey = 0; listenerKey < listeners.length; listenerKey++) {
                listeners[listenerKey].call(this, event);
            }
        }

        if (typeof _listenerQueue[event.type] !== 'undefined') {
            var listenerQueue = _listenerQueue[event.type];

            for (var listenerQueueKey = 0; listenerQueueKey < listenerQueue.length; listenerQueueKey++) {
                listenerQueue[listenerQueueKey].call(this, event);
            }

            _listenerQueue[event.type] = [];
        }
    };

    Convert.prototype.off = function (eventType, callback) {

	if(supportedEvents.indexOf(event.type) < 0) { return; }

        if (typeof _listeners[eventType] !== 'undefined') {
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
        if (typeof _listenerQueue[eventType] === 'undefined') {
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