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