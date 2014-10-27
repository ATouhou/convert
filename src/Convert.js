// Convert.js 1.0.0
// http://convertjs.com
// (c) 2014 - Mattias Hising, 80 Ridge Street Media AB
// ConvertJS may be freely distributed under the MIT license

(function () {

    var Utils = require('./Utils');
    var Viewport = require('./Viewport');
    var User = require('./User');
    var Event = require('./Event');
    var Idle = require('./Idle');

    var _scrollTimer = null;

    var Convert = function (options) {

        var self = this;

        var defaults = {
            aggressive: false,
            sensitivity: 20,
            delay: 0,
            throttle: 400,
            storage: 'cookie'
        };

        var _timer = null;

        var config = Utils.merge(defaults, options);

        var disableKeydown = false;

        this.user = new User();
        this.idle = new Idle();

        //Segment (direct, referral, search, social)

        /**
         * Used for checking if we have reached bottom of page
         * @type {number}
         * @private
         */
        _scrollTimer = setInterval(function () {
            this._checkPosition();
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

        this._checkPosition = function () {

            if (Viewport.isAtBottom()) {
                this.trigger({ type: 'pagebottom' });
            }

            if (Viewport.isBelowTheFold()) {
                this.trigger({ type: 'belowfold' });
            }
        };

        if (typeof document !== 'undefined') {
            var doc = document.documentElement;
            doc.addEventListener('mouseleave', this._handleMouseLeave);
            doc.addEventListener('mouseenter', this._handleMouseEnter);
            doc.addEventListener('keydown', this._handleKeyDown);
        }

        if (Utils.supportsNavigationTiming()) {
            //Trigger event if time between request and DOMReady is slow
        }

        var addEventTrigger = function () {

            //New user
            if (convert.user.firstview && !convert.user.returning) {
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
                type: Utils.getOrdinal(this.user.visit.pageviews) + 'pageview'
            });

            this.trigger({
                type: Utils.getOrdinal(this.user.visitor.visits) + 'visit'
            });

        }.bind(this);

        setTimeout(addEventTrigger, 0);

    };

    Convert.prototype = Event.prototype;
    Convert.prototype.atPageBottom = Viewport.isAtBottom;
    Convert.prototype.belowTheFold = Viewport.isBelowTheFold;

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