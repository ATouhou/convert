(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Convert.js 1.0.0
// http://convertjs.com
// (c) 2014 - Mattias Hising, 80 Ridge Street Media AB
// ConvertJS may be freely distributed under the MIT license

(function () {

    var Utils = require('./Utils');
    var Viewport = require('./Viewport');
    var User = require('./User');
    var Event = require('./Event');

    var _scrollTimer = null;

    Event.prototype.supportedEvents = [
        'exit',
        'new',
        'return',
        'firstview',
        'idle',
        'pagebottom',
        'abovefold',
        'belowfold',
        '{nth}visit',
        '{nth}pageview',
        'blur',
        'focus'
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

        var config = Utils.merge(defaults, options);

        var disableKeydown = false;

        this.user = new User();

        //New user
        if (this.user.firstview && !this.user.returning) {
            this.trigger({
                type: 'new'
            });
        }

        //Returning user
        if (this.user.firstview && this.user.returning) {
            this.trigger({
                type: 'return'
            });
        }

        //First view in visit (new or returning)
        if (this.user.firstview) {
            this.trigger({
                type: 'firstview'
            });
        }

        this.trigger({
            type: Utils.getOrdinal(this.user.session.pageviews) + 'pageview'
        });


        //Sgment

        this.doc = null;


        /**
         * Used for checking if we have reached bottom of page
         * @type {number}
         * @private
         */
        _scrollTimer = setInterval(function () {
            this.checkPosition();
        }.bind(this), config.throttle);

        /**
         * Handles calculation of mouse from viewport to track users exit intent
         *
         * @param event
         * @private
         */
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

        if (Utils.supportsNavigationTiming()) {
            //Trigger events if
        }
    };

    Convert.prototype = Event.prototype;

    Convert.prototype.checkPosition = function () {

        if (Viewport.isAtBottom()) {
            this.trigger({ type: 'pagebottom' });
        }

        if (Viewport.isBelowTheFold()) {
            this.trigger({ type: 'belowfold' });
        }
    };


    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Convert;
        }
        exports.Convert = Convert;
    }

    if (window) {
        window.Convert = Convert;
    }

}.call(this));
},{"./Event":3,"./User":4,"./Utils":5,"./Viewport":6}],2:[function(require,module,exports){
var Cookie = {};

var getCookie = function ( name ) {
    var start = document.cookie.indexOf( name + "=" );
    var len = start + name.length + 1;

    if (!start && (name !== document.cookie.substring(0, name.length))) {
        return null;
    }

    if ( start === -1 ) {
        return null;
    }

    var end = document.cookie.indexOf( ';', len );

    if ( end === -1 ) {
        end = document.cookie.length;
    }

    return decodeURIComponent(document.cookie.substring(len, end));
};

var setCookie = function (name, value, expires, path, domain, secure) {

    var today = new Date();

    today.setTime(today.getTime());

    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }

    var expires_date = new Date( today.getTime() + (expires) );

    document.cookie = name + '=' + encodeURIComponent(value) +
    ((expires) ? ';expires='+expires_date.toGMTString() : '') +
    ((path) ? ';path=' + path : '' ) +
    ((domain) ? ';domain=' + domain : '' ) +
    ((secure) ? ';secure' : '' );
};

var deleteCookie = function ( name, path, domain ) {
    if (getCookie( name )) {
        document.cookie = name + '=' +
        ( ( path ) ? ';path=' + path : '') +
        ( ( domain ) ? ';domain=' + domain : '' ) +
        ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
    }
};

Cookie.getCookie = getCookie;
Cookie.setCookie = setCookie;
Cookie.deleteCookie = deleteCookie;

module.exports = Cookie;
},{}],3:[function(require,module,exports){
var _listeners = {};
var _listenerQueue = {};

var Event = function () {
    this.supportedEvents = [];
};


Event.prototype.on = function (eventType, callback) {

    if(this.supportedEvents.indexOf(eventType) < 0) { return; }

    if (typeof _listeners[eventType] === 'undefined') {
        _listeners[eventType] = [];
    }

    _listeners[eventType].push(callback);
};

Event.prototype.trigger = function (event) {


    if (!event.type) {
        throw new Error("Event missing 'type' property ");
    }

    if(this.supportedEvents.indexOf(event.type) < 0) { return; }

    if (typeof _listeners[event.type] !== 'undefined') {

        var listeners = _listeners[event.type];

        for (var x = 0; x < listeners.length; x++) {
            listeners[x].call(this, event);
        }
    }


    if (typeof _listenerQueue[event.type] !== 'undefined' && _listenerQueue[event.type].length > 0) {
        var listenerQueue = _listenerQueue[event.type];

        for (var y = 0; y < listenerQueue.length; y++) {
            listenerQueue[y].call(this, event);
        }

        _listenerQueue[event.type] = [];
    }
};

Event.prototype.off = function (eventType, callback) {

    if(this.supportedEvents.indexOf(event.type) < 0) { return; }

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

Event.prototype.one = function (eventType, callback) {
    if (typeof _listenerQueue[eventType] === 'undefined') {
        _listenerQueue[eventType] = [];
    }
    _listenerQueue[eventType].push(callback);
};

Event.prototype.once = Event.prototype.one;

Event.prototype.removeAllListeners = function () {
    _listeners = {};
    _listenerQueue = {};
};

module.exports = Event;
},{}],4:[function(require,module,exports){
var Cookie = require("./Cookie");

var User = function () {

    var userSession =  Cookie.getCookie('convertJSSession');
    this.firstview = true;
    this.session = {
        pageviews: 1
    };

    if (userSession) {
        this.session = JSON.parse(userSession);
        this.session.pageviews += 1;
        this.firstview = false;
    }

    Cookie.setCookie('convertJSSession', JSON.stringify(this.session));

    console.log(this);

};

module.exports = User;
},{"./Cookie":2}],5:[function(require,module,exports){
var Utils = {};

/**
 * Takes two js-objects and merges merge into base, merge overrides common
 * keys with base
 *
 * @param base
 * @param merge
 * @returns {{}}
 * @private
 */
Utils.merge = function (base, merge) {
    var merged = {};

    for (var baseKey in base) {
        merged[baseKey] = base[baseKey];
    }

    for (var mergeKey in merge) {
        merged[mergeKey] = merge[mergeKey];
    }

    return merged;
};


/**
 * Function for checking browser support for window perfomance timing API
 * @returns {boolean}
 */
Utils.supportsNavigationTiming = function () {
    return !!(window.performance && window.performance.timing);
};

Utils.getOrdinal = function (number) {
    var numStr = number.toString();
    var last = numStr.slice(-1);
    var ord = '';
    switch (last) {
        case '1':
            ord = numStr.slice(-2) === '11' ? 'th' : 'st';
            break;
        case '2':
            ord = numStr.slice(-2) === '12' ? 'th' : 'nd';
            break;
        case '3':
            ord = numStr.slice(-2) === '13' ? 'th' : 'rd';
            break;
        default:
            ord = 'th';
            break;
    }
    return number + ord;
};

module.exports = Utils;
},{}],6:[function(require,module,exports){
var Viewport = {
    isAtBottom: function () {
        if (!document && !window) { return; }
        var doc = document.documentElement;
        var win = window;

        return ((doc.scrollHeight - win.innerHeight) === win.scrollY);
    },

    isBelowTheFold: function () {
        if (!document && !window) { return; }
        var doc = document.documentElement;
        var win = window;

        var theFold = win.innerHeight;

        return (win.scrollY > theFold);
    }
};

module.exports = Viewport;
},{}]},{},[1,2,3,4,5,6]);
