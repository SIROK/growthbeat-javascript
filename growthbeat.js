(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GrowthbeatCore = require('../../growthbeat-core/ts/growthbeat-core');
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
    GrowthAnalytics.DEFAULT_BASE_URL = "https://analytics.growthbeat.com/";
    GrowthAnalytics.DEFAULT_NAMESPACE = 'Default';
    GrowthAnalytics.CUSTOM_NAMESPACE = 'Custom';
    GrowthAnalytics._instance = null;
    return GrowthAnalytics;
})();
module.exports = GrowthAnalytics;

},{"../../growthbeat-core/ts/growthbeat-core":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"../../growthanalytics/ts/index":1,"../../growthbeat-core/ts/growthbeat-core":2}],4:[function(require,module,exports){
var Growthbeat = require('./growthbeat/ts/growthbeat');
var GrowthbeatCore = require('./growthbeat-core/ts/growthbeat-core');
if (window) {
    window['Growthbeat'] = Growthbeat;
    window['GrowthbeatCore'] = GrowthbeatCore;
}

},{"./growthbeat-core/ts/growthbeat-core":2,"./growthbeat/ts/growthbeat":3}]},{},[4]);
