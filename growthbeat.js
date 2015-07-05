(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        //GrowthbeatCore.getInstance().initialize(applicationId, credentialId);
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

},{"./model/client-event":2,"./model/client-tag":3}],2:[function(require,module,exports){
var nanoajax = require('nanoajax');
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
        nanoajax.ajax({
            url: 'https://api.analytics.growthbeat.com/1/clients/',
            method: 'POST',
            body: 'clientId=' + clientId + '&eventId=' + eventId + '&properties=' + properties + '&credentialId=' + credentialId
        }, function (code, responseText) {
            if (code !== 200)
                failure('failure');
            success(new ClientEvent(JSON.parse(responseText)));
        });
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

},{"nanoajax":11}],3:[function(require,module,exports){
var nanoajax = require('nanoajax');
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
        nanoajax.ajax({
            url: 'https://api.analytics.growthbeat.com/1/clients/',
            method: 'POST',
            body: 'clientId=' + clientId + '&tagId=' + tagId + '&value=' + value + '&credentialId=' + credentialId
        }, function (code, responseText) {
            if (code !== 200)
                failure('failure');
            success(new ClientTag(JSON.parse(responseText)));
        });
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

},{"nanoajax":11}],4:[function(require,module,exports){
var nanoajax = require('nanoajax');
var GrowthbeatHttpClient = (function () {
    function GrowthbeatHttpClient(baseUrl, timeout) {
        if (timeout === void 0) { timeout = 0; }
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }
    GrowthbeatHttpClient.prototype.get = function (api, options, success, error) {
        return this._request('GET', api, options, success, error);
    };
    GrowthbeatHttpClient.prototype.post = function (api, options, success, error) {
        return this._request('POST', api, options, success, error);
    };
    GrowthbeatHttpClient.prototype.put = function (api, options, success, error) {
        return this._request('PUT', api, options, success, error);
    };
    GrowthbeatHttpClient.prototype.delete = function (api, options, success, error) {
        return this._request('DELETE', api, options, success, error);
    };
    GrowthbeatHttpClient.prototype._request = function (method, api, options, success, error) {
        if (options.dataType === 'jsonp') {
            this._requestByJsonp('GET', api, options, success, error);
        }
        else {
            this._requestByXhr(method, api, options, success, error);
        }
    };
    GrowthbeatHttpClient.prototype._requestByJsonp = function (method, api, options, success, error) {
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
    GrowthbeatHttpClient.prototype._requestByXhr = function (method, api, options, success, error) {
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
    GrowthbeatHttpClient.prototype._makeParamsArray = function (obj) {
        var paramsObj = (obj == null) ? {} : obj;
        var params = Object.keys(paramsObj).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(paramsObj[key]);
        });
        return params;
    };
    return GrowthbeatHttpClient;
})();
module.exports = GrowthbeatHttpClient;

},{"nanoajax":11}],5:[function(require,module,exports){
var GrowthbeatHttpClient = require('./http/growthbeat-http-client');
var Client = require('./model/client');
var HTTP_CLIENT_BASE_URL = 'https://api.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;
var GrowthbeatCore = (function () {
    function GrowthbeatCore() {
        this._initialized = false;
        this.httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
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
    GrowthbeatCore.prototype.initialize = function (applicationId, credentialId, callback) {
        if (this._initialized) {
            callback();
            return;
        }
        // TODO: authentication
        var client = Client.create();
        client.on('created', function () {
            console.log('created');
        });
        client.on('error', function () {
            console.log('error');
        });
        var opt = {
            params: {
                applicationId: applicationId,
                credentialId: credentialId
            },
            dataType: 'jsonp'
        };
        this.httpClient.get('1/clients', opt, function (data, code) {
            console.log(data, code);
            client.emit('created');
        }, function (err, code) {
            client.emit('error');
        });
        console.log('initialized: GrowthbeatCore');
        this._initialized = true;
        callback();
    };
    GrowthbeatCore.prototype.getHttpClient = function () {
        return this.httpClient;
    };
    GrowthbeatCore._instance = null;
    return GrowthbeatCore;
})();
module.exports = GrowthbeatCore;

},{"./http/growthbeat-http-client":4,"./model/client":6}],6:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Emitter = require('component-emitter');
var Client = (function (_super) {
    __extends(Client, _super);
    function Client() {
        _super.call(this);
    }
    Client.load = function () {
        return new Client();
    };
    Client.create = function () {
        var client = new Client();
        return client;
    };
    Client.findById = function () {
    };
    return Client;
})(Emitter);
module.exports = Client;

},{"component-emitter":10}],7:[function(require,module,exports){
var GrowthbeatCore = require('../growthbeat-core/index');
var GrowthbeatAnalytics = require('../growthanalytics/index');
var GrowthbeatMessage = require('../growthmessage/index');
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
    Growthbeat.prototype.initialize = function (applicationId, credentialId, callback) {
        var _this = this;
        if (this._initialized)
            return;
        GrowthbeatCore.getInstance().initialize(applicationId, credentialId, function () {
            console.log('initialized: Growthbeat');
            _this._initialized = true;
            GrowthbeatAnalytics.getInstance().initialize(applicationId, credentialId);
            GrowthbeatMessage.getInstance().initialize(applicationId, credentialId);
            callback();
        });
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

},{"../growthanalytics/index":1,"../growthbeat-core/index":5,"../growthmessage/index":8}],8:[function(require,module,exports){
var GrowthMessage = (function () {
    function GrowthMessage() {
        this._initialized = false;
        if (GrowthMessage._instance) {
            throw new Error('must use the getInstance');
        }
        GrowthMessage._instance = this;
    }
    GrowthMessage.getInstance = function () {
        if (GrowthMessage._instance === null) {
            GrowthMessage._instance = new GrowthMessage();
        }
        return GrowthMessage._instance;
    };
    GrowthMessage.prototype.initialize = function (applicationId, credentialId) {
        if (this._initialized)
            return;
        console.log('initialized: GrowthMessage');
        this._initialized = true;
    };
    GrowthMessage._instance = null;
    return GrowthMessage;
})();
module.exports = GrowthMessage;

},{}],9:[function(require,module,exports){
///<reference path='../local_typings/nanoajax.d.ts' />
///<reference path='../local_typings/component-emitter.d.ts' />
var Growthbeat = require('./growthbeat/index');
var GrowthbeatCore = require('./growthbeat-core/index');
var GrowthbeatAnalytics = require('./growthanalytics/index');
var GrowthbeatMessage = require('./growthmessage/index');
if (window) {
    window['Growthbeat'] = Growthbeat;
    window['GrowthbeatCore'] = GrowthbeatCore;
    window['GrowthbeatAnalytics'] = GrowthbeatAnalytics;
    window['GrowthbeatMessage'] = GrowthbeatMessage;
}

},{"./growthanalytics/index":1,"./growthbeat-core/index":5,"./growthbeat/index":7,"./growthmessage/index":8}],10:[function(require,module,exports){

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

},{}],11:[function(require,module,exports){
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
},{}]},{},[9]);
