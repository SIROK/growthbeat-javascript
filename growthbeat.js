(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GrowthbeatCore = (function () {
    function GrowthbeatCore() {
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
        console.log('initialized: GrowthbeatCore');
    };
    GrowthbeatCore._instance = null;
    return GrowthbeatCore;
})();
module.exports = GrowthbeatCore;

},{}],2:[function(require,module,exports){
var GrowthbeatCore = require('../../growthbeat-core/ts/growthbeat-core');
var Growthbeat = (function () {
    function Growthbeat() {
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
        console.log('initialized: Growthbeat');
        // TODO: initialze GrowthbeatCore
        GrowthbeatCore.getInstance().initialize('applicationId', 'credentialId');
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

},{"../../growthbeat-core/ts/growthbeat-core":1}],3:[function(require,module,exports){
var Growthbeat = require('./growthbeat/ts/growthbeat');
var GrowthbeatCore = require('./growthbeat-core/ts/growthbeat-core');
if (window) {
    window['Growthbeat'] = Growthbeat;
    window['GrowthbeatCore'] = GrowthbeatCore;
}

},{"./growthbeat-core/ts/growthbeat-core":1,"./growthbeat/ts/growthbeat":2}]},{},[3]);
