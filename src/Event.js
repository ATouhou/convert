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