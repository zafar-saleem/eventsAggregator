App.Core = {
    config: {
        eventsModuleContext: null,
        handler: null
    },

    eventDelegate: function (eventsObj) {
        var userEvents = eventsObj.events, key;
        if (!(this.isObject(userEvents))) {
            return;
        }

        this.config.eventsModuleContext = eventsObj;
        for (key in userEvents) {
            if (!userEvents.hasOwnProperty(key)) {
                return;
            }

            this.config.handler = eventsObj[userEvents[key]];

            if (!(this.isFunction(this.config.handler))) {
                this.log(2, 'FAILED: function "' + userEvents[key] + '" is not defined');
                return;
            }

            this.applyEvents(key);
        }
        return this;
    },


    applyEvents: function (key) {
        var multipleSelectors = this.retrieveSelectors(key.split(" ")),
            i, len;
        if (multipleSelectors.length > 1) {
            for (i = 0, len = multipleSelectors.length; i < len; i++) {
                this.bindEvents(key.split(" ")[0], multipleSelectors[i]);
            }
        } else {
            this.bindEvents(key.split(" ")[0], key.split(" ")[1]);
        }
    },

    bindEvents: function (evt, selector) {
        $(document).on(evt, selector, this.config.handler.bind(this.config.eventsModuleContext));
    },

    retrieveSelectors: function (arr) {
        return arr.filter(function (item, index) {
            return (index !== 0) || item;
        });
    },

    isFunction: function (fn) {
        return (fn && typeof fn === 'function');
    },

    isObject: function (obj) {
        return (obj && typeof obj === 'object');
    },

    log: function (severity, message) {
        console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
    },

    extend: function(obj) {
        this.eventDelegate(obj);
        return obj;
    }
};
