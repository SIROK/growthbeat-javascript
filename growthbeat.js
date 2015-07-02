(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GrowthbeatCore = require('../../growthbeat-core/ts/growthbeat-core');
var ClientEvent = require('./model/client-event');
var ClientTag = require('./model/client-tag');
var TrackOption;
(function (TrackOption) {
    TrackOption[TrackOption["ONCE"] = 0] = "ONCE";
    TrackOption[TrackOption["COUNTER"] = 1] = "COUNTER";
})(TrackOption || (TrackOption = {}));
var GrowthAnalytics = (function () {
    function GrowthAnalytics() {
        this.applicationId = null;
        this.credentialId = null;
        this._initialized = false;
        if (GrowthAnalytics._instance) {
            throw new Error('must use the getInstance');
        }
        GrowthAnalytics._instance = this;
    }
    GrowthAnalytics.getInstance = function () {
        if (GrowthAnalytics._instance === null) {
            GrowthAnalytics._instance = new GrowthAnalytics();
        }
        return GrowthAnalytics._instance;
    };
    GrowthAnalytics.prototype.initialize = function (applicationId, credentialId) {
        if (this._initialized)
            return;
        console.log('initialized: GrowthAnalytics');
        this._initialized = true;
        GrowthbeatCore.getInstance().initialize(applicationId, credentialId);
        this.setBasicTags();
    };
    GrowthAnalytics.prototype.setBasicTags = function () {
        // TODO setBasicTags
    };
    GrowthAnalytics.prototype.track = function (trackParams) {
        if (trackParams.namespace === undefined)
            trackParams.namespace = GrowthAnalytics.CUSTOM_NAMESPACE;
        var eventId = this.generateEventId(trackParams.namespace, name);
        // FIXME ClientEvent.load
        if (trackParams.option == 0 /* ONCE */) {
        }
        if (trackParams.option == 1 /* COUNTER */) {
        }
        // FIXME merge GrowthbeatCore
        var clientId = 'xxxxx';
        ClientEvent.create(clientId, eventId, trackParams.properties, this.credentialId, function (clientEvent) {
            // FIXME clientEvent Save
        }, function () {
            // FIXME errorMessage.
            console.log('error');
        });
    };
    GrowthAnalytics.prototype.tag = function (tagParams) {
        if (tagParams.namespace == undefined)
            tagParams.namespace = GrowthAnalytics.CUSTOM_NAMESPACE;
        var tagId = this.generateTagId(tagParams.namespace, name);
        // FIXME merge GrowthbeatCore
        var clientId = 'xxxxx';
        ClientTag.create(clientId, tagId, tagParams.value, this.credentialId, function (clientTag) {
            // FIXME clientTag Save
        }, function () {
            // FIXME errorMessage.
            console.log('error');
        });
    };
    GrowthAnalytics.prototype.generateEventId = function (namespace, name) {
        return 'Event:' + this.applicationId + ':' + namespace + ':' + name;
    };
    GrowthAnalytics.prototype.generateTagId = function (namespace, name) {
        return 'Tag:' + this.applicationId + ':' + namespace + ':' + name;
    };
    GrowthAnalytics.prototype.getApplicationId = function () {
        return this.applicationId;
    };
    GrowthAnalytics.prototype.getCredentialId = function () {
        return this.credentialId;
    };
    GrowthAnalytics.DEFAULT_BASE_URL = "https://analytics.growthbeat.com/";
    GrowthAnalytics.DEFAULT_NAMESPACE = 'Default';
    GrowthAnalytics.CUSTOM_NAMESPACE = 'Custom';
    GrowthAnalytics._instance = null;
    return GrowthAnalytics;
})();
module.exports = GrowthAnalytics;

},{"../../growthbeat-core/ts/growthbeat-core":4,"./model/client-event":2,"./model/client-tag":3}],2:[function(require,module,exports){
var ClientEvent = (function () {
    function ClientEvent(data) {
        if (data == undefined)
            return;
        this.clientId = data.clientId;
        this.eventId = data.eventId;
        this.properties = data.properties;
        // FIXME DateUtils.foramt();
        this.created = data.created;
    }
    ClientEvent.create = function (clientId, eventId, properties, credentialId, success, failure) {
        // FIXME if value is null
        // FIXME merge GrowthbeatCore
        //nanoajax.ajax({
        //    url: 'https://api.analytics.growthbeat.com/1/clients/',
        //    method: 'POST',
        //    body: 'clientId=' + clientId
        //    + '&eventId=' + eventId
        //    + '&properties=' + properties
        //    + '&credentialId=' + credentialId
        //}, (code:number, responseText:string)=> {
        //    if (code !== 200)
        //        failure('failure');
        //    success(new ClientEvent(JSON.parse(responseText)));
        //});
    };
    ClientEvent.prototype.getClientId = function () {
        return this.clientId;
    };
    ClientEvent.prototype.setClientId = function (clientId) {
        this.clientId = clientId;
    };
    ClientEvent.prototype.getEventId = function () {
        return this.eventId;
    };
    ClientEvent.prototype.setEventId = function (eventId) {
        this.eventId = eventId;
    };
    ClientEvent.prototype.getProperties = function () {
        return this.properties;
    };
    ClientEvent.prototype.setProperties = function (properties) {
        this.properties = properties;
    };
    ClientEvent.prototype.getCreated = function () {
        return this.created;
    };
    ClientEvent.prototype.setCreated = function (created) {
        this.created = created;
    };
    return ClientEvent;
})();
module.exports = ClientEvent;

},{}],3:[function(require,module,exports){
var ClientTag = (function () {
    function ClientTag(data) {
        if (data == undefined)
            return;
        this.clientId = data.clientId;
        this.tagId = data.tagId;
        this.value = data.value;
        // FIXME DateUtils.foramt();
        this.created = data.created;
    }
    ClientTag.create = function (clientId, tagId, value, credentialId, success, failure) {
        // FIXME if value is null
        // FIXME merge GrowthbeatCore
        //nanoajax.ajax({
        //    url: 'https://api.analytics.growthbeat.com/1/clients/',
        //    method: 'POST',
        //    body: 'clientId=' + clientId
        //    + '&tagId=' + tagId
        //    + '&value=' + value
        //    + '&credentialId=' + credentialId
        //}, (code:number, responseText:string)=> {
        //    if (code !== 200)
        //        failure('failure');
        //    success(new ClientTag(JSON.parse(responseText)));
        //});
    };
    ClientTag.prototype.getClientId = function () {
        return this.clientId;
    };
    ClientTag.prototype.setClientId = function (clientId) {
        this.clientId = clientId;
    };
    ClientTag.prototype.getTagId = function () {
        return this.tagId;
    };
    ClientTag.prototype.setTagId = function (tagId) {
        this.tagId = tagId;
    };
    ClientTag.prototype.getValue = function () {
        return this.value;
    };
    ClientTag.prototype.setValue = function (value) {
        this.value = value;
    };
    ClientTag.prototype.getCreated = function () {
        return this.created;
    };
    ClientTag.prototype.setCreated = function (created) {
        this.created = created;
    };
    return ClientTag;
})();
module.exports = ClientTag;

},{}],4:[function(require,module,exports){
var GrowthbeatCore = (function () {
    function GrowthbeatCore() {
        this._initialized = false;
        if (GrowthbeatCore._instance) {
            throw new Error('must use the getInstance');
        }
        GrowthbeatCore._instance = this;
    }
    GrowthbeatCore.getInstance = function () {
        if (GrowthbeatCore._instance === null) {
            GrowthbeatCore._instance = new GrowthbeatCore();
        }
        return GrowthbeatCore._instance;
    };
    GrowthbeatCore.prototype.initialize = function (applicationId, credentialId) {
        if (this._initialized)
            return;
        console.log('initialized: GrowthbeatCore');
        this._initialized = true;
    };
    GrowthbeatCore._instance = null;
    return GrowthbeatCore;
})();
module.exports = GrowthbeatCore;

},{}],5:[function(require,module,exports){
var GrowthbeatCore = require('../../growthbeat-core/ts/growthbeat-core');
var GrowthbeatAnalytics = require('../../growthanalytics/ts/index');
var Growthbeat = (function () {
    function Growthbeat() {
        this._initialized = false;
        if (Growthbeat._instance) {
            throw new Error('must use the getInstance');
        }
        Growthbeat._instance = this;
    }
    Growthbeat.getInstance = function () {
        if (Growthbeat._instance === null) {
            Growthbeat._instance = new Growthbeat();
        }
        return Growthbeat._instance;
    };
    Growthbeat.prototype.initialize = function (applicationId, credentialId) {
        if (this._initialized)
            return;
        console.log('initialized: Growthbeat');
        this._initialized = true;
        GrowthbeatCore.getInstance().initialize('applicationId', 'credentialId');
        GrowthbeatAnalytics.getInstance().initialize('applicationId', 'credentialId');
        // TODO: initialze GrowthAnalytics
        // TODO: initialze GrowthMessage
    };
    Growthbeat.prototype.start = function () {
        // TODO: open GrowthAnalytics
    };
    Growthbeat.prototype.stop = function () {
        // TODO: open GrowthMessage
    };
    Growthbeat._instance = null;
    return Growthbeat;
})();
module.exports = Growthbeat;

},{"../../growthanalytics/ts/index":1,"../../growthbeat-core/ts/growthbeat-core":4}],6:[function(require,module,exports){
var Growthbeat = require('./growthbeat/ts/growthbeat');
var GrowthbeatCore = require('./growthbeat-core/ts/growthbeat-core');
if (window) {
    window['Growthbeat'] = Growthbeat;
    window['GrowthbeatCore'] = GrowthbeatCore;
}

},{"./growthbeat-core/ts/growthbeat-core":4,"./growthbeat/ts/growthbeat":5}]},{},[6]);
