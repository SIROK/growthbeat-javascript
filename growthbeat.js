(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GrowthbeatCore = require('../growthbeat-core/index');
var ClientEvent = require('./model/client-event');
var ClientTag = require('./model/client-tag');
var Emitter = require('component-emitter');
var TrackOption;
(function (TrackOption) {
    TrackOption[TrackOption["ONCE"] = 0] = "ONCE";
    TrackOption[TrackOption["COUNTER"] = 1] = "COUNTER";
})(TrackOption || (TrackOption = {}));
var DEFAULT_NAMESPACE = 'Default';
var CUSTOM_NAMESPACE = 'Custom';
var _initialized = false;
var _applicationId = null;
var _credentialId = null;
var _emitter = new Emitter();
var _openDate = null;
exports.Gender = {
    MALE: 'male',
    FEMALE: 'female'
};
var _generateEventId = function (namespace, name) {
    return "Event:" + _applicationId + ":" + namespace + ":" + name;
};
var _generateTagId = function (namespace, name) {
    return "Tag:" + _applicationId + ":" + namespace + ":" + name;
};
function init(applicationId, credentialId) {
    if (_initialized)
        return;
    _applicationId = applicationId;
    _credentialId = credentialId;
    console.log('initialized: GrowthAnalytics');
    _initialized = true;
}
exports.init = init;
function track(trackParams) {
    if (trackParams.namespace == null) {
        trackParams.namespace = CUSTOM_NAMESPACE;
    }
    var eventId = _generateEventId(trackParams.namespace, trackParams.name);
    console.log("Track event... (eventId: " + eventId + ")");
    var existingClientEvent = ClientEvent.load(eventId);
    var processedProperties = trackParams.properties == null ? {} : trackParams.properties;
    if (trackParams.option === 0 /* ONCE */) {
        if (existingClientEvent != null) {
            console.log("Event already sent with once option. (eventId: " + eventId + ")");
            return;
        }
    }
    if (trackParams.option === 1 /* COUNTER */) {
        var counter = 0;
        if (existingClientEvent != null && existingClientEvent.getProperties() != null) {
            var existingProperties = existingClientEvent.getProperties();
            counter = parseInt(existingProperties['counter'], 10);
        }
        processedProperties['counter'] = counter++;
    }
    var client = GrowthbeatCore.getClient();
    var clientEvent = ClientEvent.create(client.getId(), eventId, trackParams.properties, _credentialId);
    clientEvent.on('created', function () {
        ClientEvent.save(clientEvent);
        console.log("Tracking event success. (eventId: " + eventId + ", properties: " + processedProperties + ")");
    });
    clientEvent.on('error', function () {
        // FIXME errorMessage.
        console.log("Tracking event fail.");
    });
}
exports.track = track;
function tag(tagParams) {
    if (tagParams.namespace == null) {
        tagParams.namespace = CUSTOM_NAMESPACE;
    }
    var tagId = _generateTagId(tagParams.namespace, tagParams.name);
    console.log("Set tag... (tagId: " + tagId + ", value: " + tagParams.value + ")");
    var existingClientTag = ClientTag.load(tagId);
    if (existingClientTag != null) {
        if (existingClientTag.getValue() === tagParams.value) {
            console.log("Tag exists with the same value. (tagId: " + tagId + ", value: " + tagParams.value + ")");
            return;
        }
        console.log("Tag exists with the other value. (tagId: " + tagId + ", value: " + tagParams.value + ")");
    }
    var client = GrowthbeatCore.getClient();
    var clientTag = ClientTag.create(client.getId(), tagId, tagParams.value, _credentialId);
    clientTag.on('created', function () {
        // FIXME clientTag Save
        ClientTag.save(clientTag);
        console.log("Setting tag success. (tagId: " + tagId + ")");
    });
    clientTag.on('error', function () {
        // FIXME errorMessage.
        console.log("Setting tag fail.");
    });
}
exports.tag = tag;
function open() {
    _openDate = new Date();
    track({
        namespace: DEFAULT_NAMESPACE,
        name: 'Open',
        option: 1 /* COUNTER */
    });
    track({
        namespace: DEFAULT_NAMESPACE,
        name: 'Install',
        option: 0 /* ONCE */
    });
}
exports.open = open;
function close() {
    if (!_openDate)
        return;
    var time = (new Date().getTime() - _openDate.getTime()) / 1000;
    _openDate = null;
    var properties = {
        time: "" + time
    };
    track({
        namespace: DEFAULT_NAMESPACE,
        name: 'Close',
        properties: properties
    });
}
exports.close = close;
function purchase(price, category, product) {
    var properties = {
        price: "" + price,
        category: category,
        product: product
    };
    track({
        namespace: DEFAULT_NAMESPACE,
        name: 'Purchase',
        properties: properties
    });
}
exports.purchase = purchase;
function setUuid() {
    var uuid = GrowthbeatCore.getCUuid();
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'UUID',
        value: uuid.getUuid()
    });
}
exports.setUuid = setUuid;
function setUserId(userId) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'UserID',
        value: userId
    });
}
exports.setUserId = setUserId;
function setName(name) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Name',
        value: name
    });
}
exports.setName = setName;
function setAge(age) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Age',
        value: "" + age
    });
}
exports.setAge = setAge;
function setGender(gender) {
    if (gender !== exports.Gender.MALE && gender !== exports.Gender.FEMALE)
        return;
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Gender',
        value: gender,
    });
}
exports.setGender = setGender;
function setLevel(level) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Level',
        value: "" + level
    });
}
exports.setLevel = setLevel;
function setDevelopment(development) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Development',
        value: "" + development
    });
}
exports.setDevelopment = setDevelopment;
function setUserAgent() {
    if (!window.navigator.userAgent)
        return;
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'UserAgent',
        value: window.navigator.userAgent
    });
}
exports.setUserAgent = setUserAgent;
function setLanguage() {
    if (!window.navigator.language)
        return;
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Language',
        value: window.navigator.language
    });
}
exports.setLanguage = setLanguage;
function setRandom() {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Random',
        value: "" + Math.random()
    });
}
exports.setRandom = setRandom;
function setAdvertisingId(adverTisingId) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'AdvertisingID',
        value: adverTisingId
    });
}
exports.setAdvertisingId = setAdvertisingId;
function setTrackingEnabled(enabled) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'TrackingEnabled',
        value: "" + enabled
    });
}
exports.setTrackingEnabled = setTrackingEnabled;
function setBasicTags() {
    setUserAgent();
    setLanguage();
}
exports.setBasicTags = setBasicTags;
function getEmitter() {
    return _emitter;
}
exports.getEmitter = getEmitter;

},{"../growthbeat-core/index":5,"./model/client-event":2,"./model/client-tag":3,"component-emitter":11}],2:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HttpClient = require('../../growthbeat-core/http/http-client');
var Emitter = require('component-emitter');
var HTTP_CLIENT_BASE_URL = 'https://analytics.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;
var httpClient = new HttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
var ClientEvent = (function (_super) {
    __extends(ClientEvent, _super);
    function ClientEvent(data) {
        _super.call(this);
        if (data != null)
            this.setData(data);
    }
    ClientEvent.prototype.setData = function (data) {
        this.clientId = data.clientId;
        this.eventId = data.eventId;
        this.properties = data.properties;
        this.created = new Date(data.created);
    };
    ClientEvent.load = function (eventId) {
        if (!window.localStorage) {
            return null;
        }
        var clientEventData = window.localStorage.getItem("growthanalytics:" + eventId);
        if (clientEventData == null) {
            return null;
        }
        return new ClientEvent(JSON.parse(clientEventData));
    };
    ClientEvent.save = function (data) {
        if (!data || !window.localStorage) {
            return;
        }
        window.localStorage.setItem("growthanalytics:" + data.getEventId(), JSON.stringify(data));
    };
    ClientEvent.create = function (clientId, eventId, properties, credentialId) {
        var opt = {
            params: {
                clientId: clientId,
                eventId: eventId,
                parameters: (properties) ? properties : {},
                credentialId: credentialId
            },
            dataType: 'jsonp'
        };
        var clientEvent = new ClientEvent();
        httpClient.get('1/client_events/create', opt, function (data, code) {
            console.log(data, code);
            clientEvent.setData(data);
            clientEvent.emit('created');
        }, function (err, code) {
            clientEvent.emit('error');
        });
        return clientEvent;
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
})(Emitter);
module.exports = ClientEvent;

},{"../../growthbeat-core/http/http-client":4,"component-emitter":11}],3:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HttpClient = require('../../growthbeat-core/http/http-client');
var Emitter = require('component-emitter');
var HTTP_CLIENT_BASE_URL = 'https://analytics.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;
var httpClient = new HttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
var ClientTag = (function (_super) {
    __extends(ClientTag, _super);
    function ClientTag(data) {
        _super.call(this);
        if (data != null)
            this.setData(data);
    }
    ClientTag.prototype.setData = function (data) {
        this.clientId = data.clientId;
        this.tagId = data.tagId;
        this.value = data.value;
        this.created = new Date(data.created);
    };
    ClientTag.load = function (tagId) {
        if (!window.localStorage) {
            return null;
        }
        var clientTagData = window.localStorage.getItem("growthanalytics:" + tagId);
        if (clientTagData == null) {
            return null;
        }
        return new ClientTag(JSON.parse(clientTagData));
    };
    ClientTag.save = function (data) {
        if (!data || !window.localStorage) {
            return;
        }
        window.localStorage.setItem("growthanalytics:" + data.getTagId(), JSON.stringify(data));
    };
    ClientTag.create = function (clientId, tagId, value, credentialId) {
        var opt = {
            params: {
                clientId: clientId,
                tagId: tagId,
                value: value,
                credentialId: credentialId
            },
            dataType: 'jsonp'
        };
        var clientTag = new ClientTag();
        // FIXME if value is null
        httpClient.get('1/client_tags/create', opt, function (data, code) {
            console.log(data, code);
            clientTag.setData(data);
            clientTag.emit('created');
        }, function (err, code) {
            clientTag.emit('error');
        });
        return clientTag;
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
})(Emitter);
module.exports = ClientTag;

},{"../../growthbeat-core/http/http-client":4,"component-emitter":11}],4:[function(require,module,exports){
var nanoajax = require('nanoajax');
var HttpClient = (function () {
    function HttpClient(baseUrl, timeout) {
        if (timeout === void 0) { timeout = 0; }
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }
    HttpClient.prototype.get = function (api, options, success, error) {
        return this._request('GET', api, options, success, error);
    };
    HttpClient.prototype.post = function (api, options, success, error) {
        return this._request('POST', api, options, success, error);
    };
    HttpClient.prototype.put = function (api, options, success, error) {
        return this._request('PUT', api, options, success, error);
    };
    HttpClient.prototype.delete = function (api, options, success, error) {
        return this._request('DELETE', api, options, success, error);
    };
    HttpClient.prototype._request = function (method, api, options, success, error) {
        if (options.dataType === 'jsonp') {
            this._requestByJsonp('GET', api, options, success, error);
        }
        else {
            this._requestByXhr(method, api, options, success, error);
        }
    };
    HttpClient.prototype._requestByJsonp = function (method, api, options, success, error) {
        var params = this._makeParamsArray(options.params);
        var jsonpCallbackName = 'growthbeat' + Math.random().toString(36).slice(-8);
        ;
        params = params.concat('callback=' + jsonpCallbackName);
        var url = this.baseUrl + api + '?' + params.join('&');
        var script = document.createElement('script');
        script.async = true;
        script.src = url;
        window[jsonpCallbackName] = function (data) {
            delete window[jsonpCallbackName];
            success(data, 200);
        };
        script.onerror = function (err) {
            console.log('script error', err);
            error();
        };
        document.body.appendChild(script);
    };
    HttpClient.prototype._requestByXhr = function (method, api, options, success, error) {
        var params = this._makeParamsArray(options.params);
        var nanoParams = {
            method: method,
            url: this.baseUrl + api,
            withCredentials: (options.cors === true)
        };
        if (method === 'GET') {
            nanoParams.url = nanoParams.url + '?' + params.join('&');
        }
        else {
            nanoParams.body = params.join('&');
        }
        // TODO: handle timeout
        nanoajax.ajax(nanoParams, function (code, responseText) {
            if (code === 200) {
                var data = JSON.parse(responseText);
                success(data, code);
            }
            else {
                var err = {};
                error(err, code);
            }
        });
    };
    HttpClient.prototype._makeParamsArray = function (obj) {
        var paramsObj = (obj == null) ? {} : obj;
        var params = Object.keys(paramsObj).map(function (key) {
            var val = '';
            if (typeof paramsObj[key] === 'object') {
                val = JSON.stringify(paramsObj[key]);
            }
            else {
                val = paramsObj[key];
            }
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        });
        return params;
    };
    return HttpClient;
})();
module.exports = HttpClient;

},{"nanoajax":12}],5:[function(require,module,exports){
var Client = require('./model/client');
var Uuid = require('./model/uuid');
var _initialized = false;
var _client = null;
var _uuid = null;
var _createClient = function (applicationId, credentialId, uuid, callback) {
    var client = Client.load();
    if (client != null && client.getApplication().getId() == applicationId) {
        _client = client;
        callback();
        return;
    }
    client = Client.create(applicationId, credentialId);
    client.on('created', function () {
        Client.save(client);
        console.log('initialized: GrowthbeatCore');
        _initialized = true;
        callback();
    });
    client.on('error', function () {
        callback({}); // FIXME: create error
    });
};
function init(applicationId, credentialId, callback) {
    if (_initialized) {
        callback();
        return;
    }
    var uuid = Uuid.create(credentialId);
    uuid.on('created', function () {
        _uuid = uuid;
        Uuid.save(uuid);
        _createClient(applicationId, credentialId, uuid.getUuid(), callback);
    });
    uuid.on('error', function () {
        callback({}); //FIXME: create error
    });
}
exports.init = init;
function getClient() {
    return _client;
}
exports.getClient = getClient;
function getCUuid() {
    return _uuid;
}
exports.getCUuid = getCUuid;

},{"./model/client":7,"./model/uuid":8}],6:[function(require,module,exports){
var Application = (function () {
    function Application(data) {
        if (data != null)
            this.setData(data);
    }
    Application.prototype.setData = function (data) {
        this.id = data.id;
        this.name = data.name;
        this.created = new Date(data.created);
    };
    Application.prototype.getId = function () {
        return this.id;
    };
    Application.prototype.getName = function () {
        return this.name;
    };
    Application.prototype.getCreated = function () {
        return this.created;
    };
    return Application;
})();
module.exports = Application;

},{}],7:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HttpClient = require('../http/http-client');
var Emitter = require('component-emitter');
var Application = require('./application');
var HTTP_CLIENT_BASE_URL = 'http://gbt.io/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;
var httpClient = new HttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
var Client = (function (_super) {
    __extends(Client, _super);
    function Client(data) {
        _super.call(this);
        if (data)
            this.setData(data);
    }
    Client.prototype.setData = function (data) {
        this.id = data.id;
        this.application = new Application(data.application);
    };
    Client.load = function () {
        if (!window.localStorage) {
            return null;
        }
        var clientData = window.localStorage.getItem('growthbeat:client');
        if (clientData == null) {
            return null;
        }
        return new Client(JSON.parse(clientData));
    };
    Client.save = function (data) {
        if (!data || !window.localStorage) {
            return;
        }
        console.log("save client " + JSON.stringify(data));
        window.localStorage.setItem('growthbeat:client', JSON.stringify(data));
    };
    Client.create = function (applicationId, credentialId) {
        var opt = {
            params: {
                applicationId: applicationId,
                credentialId: credentialId
            },
            dataType: 'jsonp'
        };
        var client = new Client();
        httpClient.get('1/clients/create', opt, function (data, code) {
            console.log(data, code);
            client.setData(data);
            client.emit('created');
        }, function (err, code) {
            client.emit('error');
        });
        return client;
    };
    Client.prototype.getId = function () {
        return this.id;
    };
    Client.prototype.getApplication = function () {
        return this.application;
    };
    return Client;
})(Emitter);
module.exports = Client;

},{"../http/http-client":4,"./application":6,"component-emitter":11}],8:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HttpClient = require('../http/http-client');
var Emitter = require('component-emitter');
var HTTP_CLIENT_BASE_URL = 'http://gbt.io/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;
var httpClient = new HttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
var Uuid = (function (_super) {
    __extends(Uuid, _super);
    function Uuid(data) {
        _super.call(this);
        if (data)
            this.setData(data);
    }
    Uuid.prototype.setData = function (data) {
        this.uuid = data.uuid;
    };
    Uuid.load = function () {
        if (!window.localStorage) {
            return null;
        }
        var uuidData = window.localStorage.getItem('growthbeat:uuid');
        if (uuidData == null) {
            return null;
        }
        return new Uuid(JSON.parse(uuidData));
    };
    Uuid.save = function (data) {
        if (!data || !window.localStorage) {
            return;
        }
        window.localStorage.setItem('growthbeat:uuid', JSON.stringify(data));
    };
    Uuid.create = function (credentialId) {
        var opt = {
            params: {
                credentialId: credentialId
            },
            dataType: 'jsonp'
        };
        var uuid = new Uuid();
        httpClient.get('1/uuid/create', opt, function (data, code) {
            console.log(data, code);
            uuid.setData(data);
            uuid.emit('created');
        }, function (err, code) {
            uuid.emit('error');
        });
        return uuid;
    };
    Uuid.prototype.getUuid = function () {
        return this.uuid;
    };
    return Uuid;
})(Emitter);
module.exports = Uuid;

},{"../http/http-client":4,"component-emitter":11}],9:[function(require,module,exports){
var GrowthbeatCore = require('../growthbeat-core/index');
var GrowthAnalytics = require('../growthanalytics/index');
var _initialized = false;
function init(params, callback) {
    if (_initialized)
        return;
    var applicationId = params.applicationId;
    var credentialId = params.credentialId;
    GrowthbeatCore.init(applicationId, credentialId, function (err) {
        if (err) {
            callback(err);
            return;
        }
        GrowthAnalytics.init(applicationId, credentialId);
        //GrowthMessage.init(applicationId, credentialId);
        GrowthAnalytics.setUuid();
        console.log('initialized: Growthbeat');
        _initialized = true;
        callback();
    });
}
exports.init = init;
function start() {
    GrowthAnalytics.open();
}
exports.start = start;
function stop() {
    GrowthAnalytics.close();
}
exports.stop = stop;

},{"../growthanalytics/index":1,"../growthbeat-core/index":5}],10:[function(require,module,exports){
(function (global){
///<reference path='../local_typings/nanoajax.d.ts' />
///<reference path='../local_typings/component-emitter.d.ts' />
///<reference path='../local_typings/t.d.ts' />
var Growthbeat = require('./growthbeat/index');
var GrowthAnalytics = require('./growthanalytics/index');
global.Growthbeat = Growthbeat;
global.GrowthAnalytics = GrowthAnalytics;
//global.GrowthMessage = GrowthMessage;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./growthanalytics/index":1,"./growthbeat/index":9}],11:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],12:[function(require,module,exports){
(function (global){
exports.ajax = function (params, callback) {
  if (typeof params == 'string') params = {url: params}
  var headers = params.headers || {}
    , body = params.body
    , method = params.method || (body ? 'POST' : 'GET')
    , withCredentials = params.withCredentials || false

  var req = getRequest()

  req.onreadystatechange = function () {
    if (req.readyState == 4)
      callback(req.status, req.responseText, req)
  }

  if (body) {
    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
    setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
  }

  req.open(method, params.url, true)

  // has no effect in IE
  // has no effect for same-origin requests
  // has no effect in CORS if user has disabled 3rd party cookies
  req.withCredentials = withCredentials

  for (var field in headers)
    req.setRequestHeader(field, headers[field])

  req.send(body)
}

function getRequest() {
  if (global.XMLHttpRequest)
    return new global.XMLHttpRequest;
  else
    try { return new global.ActiveXObject("MSXML2.XMLHTTP.3.0"); } catch(e) {}
  throw new Error('no xmlhttp request able to be created')
}

function setDefault(obj, key, value) {
  obj[key] = obj[key] || value
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[10]);
