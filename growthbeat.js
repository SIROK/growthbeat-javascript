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
var GrowthAnalytics = (function () {
    function GrowthAnalytics() {
        this.applicationId = null;
        this.credentialId = null;
        this.emitter = new Emitter();
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
        this.applicationId = applicationId;
        this.credentialId = credentialId;
        this.setBasicTags();
        console.log('initialized: GrowthAnalytics');
        this._initialized = true;
    };
    GrowthAnalytics.prototype.setBasicTags = function () {
        // TODO setBasicTags
        this.setLanguage();
    };
    GrowthAnalytics.prototype.track = function (trackParams) {
        if (trackParams.namespace == null) {
            trackParams.namespace = CUSTOM_NAMESPACE;
        }
        var eventId = this.generateEventId(trackParams.namespace, name);
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
        var clientId = GrowthbeatCore.getInstance().getClient().getId();
        var clientEvent = ClientEvent.create(clientId, eventId, trackParams.properties, this.credentialId);
        clientEvent.on('created', function () {
            ClientEvent.save({});
            console.log("Tracking event success. (id: %s, eventId: " + eventId + ", properties: " + processedProperties + ")");
        });
        clientEvent.on('error', function () {
            // FIXME errorMessage.
            console.log("Tracking event fail.");
        });
    };
    GrowthAnalytics.prototype.tag = function (tagParams) {
        if (tagParams.namespace == null) {
            tagParams.namespace = CUSTOM_NAMESPACE;
        }
        var tagId = this.generateTagId(tagParams.namespace, name);
        console.log("Set tag... (tagId: " + tagId + ", value: " + tagParams.value + ")");
        var existingClientTag = ClientTag.load(tagId);
        if (existingClientTag != null) {
            if (existingClientTag.getValue() === tagParams.value) {
                console.log("Tag exists with the same value. (tagId: " + tagId + ", value: " + tagParams.value + ")");
                return;
            }
            console.log("Tag exists with the other value. (tagId: " + tagId + ", value: " + tagParams.value + ")");
        }
        var clientId = GrowthbeatCore.getInstance().getClient().getId();
        var clientTag = ClientTag.create(clientId, tagId, tagParams.value, this.credentialId);
        clientTag.on('created', function () {
            // FIXME clientTag Save
            ClientTag.save({});
            console.log("Setting tag success. (tagId: " + tagId + ")");
        });
        clientTag.on('error', function () {
            // FIXME errorMessage.
            console.log("Setting tag fail.");
        });
    };
    GrowthAnalytics.prototype.generateEventId = function (namespace, name) {
        return "Event:" + this.applicationId + ":" + namespace + ":" + name;
    };
    GrowthAnalytics.prototype.generateTagId = function (namespace, name) {
        return "Tag:" + this.applicationId + ":" + namespace + ":" + name;
    };
    GrowthAnalytics.prototype.setLanguage = function () {
        if (!window.navigator.language)
            return;
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'Language',
            value: window.navigator.language
        });
    };
    GrowthAnalytics.prototype.getEmitter = function () {
        return this.emitter;
    };
    GrowthAnalytics._instance = null;
    return GrowthAnalytics;
})();
module.exports = GrowthAnalytics;

},{"../growthbeat-core/index":5,"./model/client-event":2,"./model/client-tag":3,"component-emitter":14}],2:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GrowthbeatHttpClient = require('../../growthbeat-core/http/growthbeat-http-client');
var Emitter = require('component-emitter');
var HTTP_CLIENT_BASE_URL = 'https://analytics.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;
var httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
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
        // FIXME DateUtils.foramt();
        this.created = data.created;
    };
    ClientEvent.load = function (eventId) {
        if (!window.localStorage) {
            return null;
        }
        var clientEventData = window.localStorage.getItem('growthbeat:' + eventId);
        if (clientEventData == null) {
            return null;
        }
        return new ClientEvent(JSON.parse(clientEventData));
    };
    ClientEvent.save = function (data) {
        if (!window.localStorage) {
            return;
        }
        // TODO: set ClientTag to LocalStorage
    };
    ClientEvent.create = function (clientId, eventId, properties, credentialId) {
        var opt = {
            params: {
                clientId: clientId,
                eventId: eventId,
                properties: properties,
                credentialId: credentialId
            },
            dataType: 'jsonp'
        };
        var clientEvent = new ClientEvent();
        // FIXME properties type
        httpClient.get('1/client_events', opt, function (data, code) {
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

},{"../../growthbeat-core/http/growthbeat-http-client":4,"component-emitter":14}],3:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GrowthbeatHttpClient = require('../../growthbeat-core/http/growthbeat-http-client');
var Emitter = require('component-emitter');
var HTTP_CLIENT_BASE_URL = 'https://analytics.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;
var httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
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
        // FIXME DateUtils.foramt();
        this.created = data.created;
    };
    ClientTag.load = function (tagId) {
        if (!window.localStorage) {
            return null;
        }
        var clientTagData = window.localStorage.getItem('growthbeat:' + tagId);
        if (clientTagData == null) {
            return null;
        }
        return new ClientTag(JSON.parse(clientTagData));
    };
    ClientTag.save = function (data) {
        if (!window.localStorage) {
            return;
        }
        // TODO: set ClientTag to LocalStorage
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
        httpClient.get('1/client_tags', opt, function (data, code) {
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

},{"../../growthbeat-core/http/growthbeat-http-client":4,"component-emitter":14}],4:[function(require,module,exports){
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

},{"nanoajax":15}],5:[function(require,module,exports){
var Client = require('./model/client');
var GrowthbeatCore = (function () {
    function GrowthbeatCore() {
        this.client = null;
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
    GrowthbeatCore.prototype.initialize = function (applicationId, credentialId, callback) {
        var _this = this;
        if (this._initialized) {
            callback();
            return;
        }
        var client = Client.load();
        if (client != null) {
            this.client = client;
            callback();
            return;
        }
        client = Client.create(applicationId, credentialId);
        client.on('created', function () {
            Client.save({});
            console.log('initialized: GrowthbeatCore');
            _this._initialized = true;
            callback();
        });
        client.on('error', function () {
            callback({}); // FIXME: create error
        });
    };
    GrowthbeatCore.prototype.getClient = function () {
        return this.client;
    };
    GrowthbeatCore._instance = null;
    return GrowthbeatCore;
})();
module.exports = GrowthbeatCore;

},{"./model/client":6}],6:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GrowthbeatHttpClient = require('../http/growthbeat-http-client');
var Emitter = require('component-emitter');
var HTTP_CLIENT_BASE_URL = 'https://api.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;
var httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
var Client = (function (_super) {
    __extends(Client, _super);
    function Client(data) {
        _super.call(this);
    }
    Client.load = function () {
        if (!window.localStorage) {
            return null;
        }
        // TODO: load client from LocalStorage
        var clientData = window.localStorage.getItem('growthbeat:client');
        if (clientData == null) {
            return null;
        }
        return new Client(JSON.parse(clientData));
    };
    Client.save = function (data) {
        if (!window.localStorage) {
            return;
        }
        // TODO: set client to LocalStorage
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
        // TODO: authentication request
        httpClient.get('1/clients', opt, function (data, code) {
            console.log(data, code);
            client.emit('created');
        }, function (err, code) {
            client.emit('error');
        });
        return client;
    };
    Client.prototype.getId = function () {
        return this.id;
    };
    return Client;
})(Emitter);
module.exports = Client;

},{"../http/growthbeat-http-client":4,"component-emitter":14}],7:[function(require,module,exports){
var GrowthbeatCore = require('../growthbeat-core/index');
var GrowthAnalytics = require('../growthanalytics/index');
var GrowthMessage = require('../growthmessage/index');
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
        GrowthbeatCore.getInstance().initialize(applicationId, credentialId, function (err) {
            if (err) {
                callback(err);
                return;
            }
            ;
            GrowthAnalytics.getInstance().initialize(applicationId, credentialId);
            GrowthMessage.getInstance().initialize(applicationId, credentialId);
            console.log('initialized: Growthbeat');
            _this._initialized = true;
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

},{"../growthanalytics/index":1,"../growthbeat-core/index":5,"../growthmessage/index":9}],8:[function(require,module,exports){
var GrowthbeatHttpClient = require('../../growthbeat-core/http/growthbeat-http-client');
//var HTTP_CLIENT_BASE_URL = 'https://api.message.growthbeat.com/';
var HTTP_CLIENT_BASE_URL = 'http://localhost:8000/';
var HTTP_CLIENT_TIMEOUT = 10 * 1000;
var httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
var deepExtract = function (input, name, output) {
    if (output === void 0) { output = []; }
    Object.keys(input).forEach(function (key) {
        if (key === name) {
            output.push(input[key].url);
        }
        else if (input[key] instanceof Object) {
            output = deepExtract(input[key], name, output);
        }
    });
    return output;
};
var loadImages = function (urls, callback) {
    var count = 0;
    if (0 >= urls.length) {
        callback();
    }
    urls.forEach(function (url) {
        var img = document.createElement('img');
        img.onload = function () {
            if (++count === urls.length) {
                callback();
            }
        };
        img.onerror = function () {
            if (++count === urls.length) {
                callback();
            }
        };
        img.src = url;
    });
};
var MessageAction = (function () {
    function MessageAction(emitter) {
        this.dispatch = emitter.emit.bind(emitter);
    }
    MessageAction.prototype.createMessage = function () {
        var _this = this;
        httpClient.get('sample/json/image-2buttons.json', {}, function (data, code) {
            console.log(data, code);
            var urls = deepExtract(data, 'picture');
            loadImages(urls, function () {
                _this.dispatch('createMessage', {
                    data: data
                });
            });
        }, function (err, code) {
            console.log(err, code);
        });
    };
    MessageAction.prototype.closeMessage = function () {
        this.dispatch('closeMessage', {});
    };
    return MessageAction;
})();
module.exports = MessageAction;

},{"../../growthbeat-core/http/growthbeat-http-client":4}],9:[function(require,module,exports){
var GrowthAnalytics = require('../growthanalytics/index');
var Emitter = require('component-emitter');
var MessageAction = require('./actions/message-action');
var MessageStore = require('./stores/message-store');
var MessageControllerView = require('./views/message-controller-view');
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
        var _this = this;
        if (this._initialized)
            return;
        var emitter = new Emitter();
        this.messageAction = new MessageAction(emitter);
        this.messageStore = new MessageStore(emitter);
        GrowthAnalytics.getInstance().getEmitter().on('GrowthMessage', function (eventId) {
            _this.messageAction.createMessage();
        });
        this.render();
        console.log('initialized: GrowthMessage');
        this._initialized = true;
    };
    GrowthMessage.prototype.render = function () {
        var view = new MessageControllerView(document.body, {
            context: {
                messageAction: this.messageAction,
                messageStore: this.messageStore
            }
        });
        view.render();
    };
    GrowthMessage._instance = null;
    return GrowthMessage;
})();
module.exports = GrowthMessage;

},{"../growthanalytics/index":1,"./actions/message-action":8,"./stores/message-store":10,"./views/message-controller-view":12,"component-emitter":14}],10:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Emitter = require('component-emitter');
var convert = function (data) {
    var newButtons = [];
    data.buttons.forEach(function (button) {
        if (button.type === 'screen') {
            data._screen = button;
            if (button.intent.type === 'url') {
                data._screenIsUrlType = true;
            }
        }
        else if (button.type === 'close') {
            data._close = button;
            data._closeElClass = 'js__growthmessage-dialog__element-close';
        }
        else {
            if (button.intent.type === 'url') {
                button._isUrlType = true;
            }
            newButtons.push(button);
        }
    });
    data.buttons = newButtons;
    data._linkBtnClass = 'js__growthmessage-dialog__button-link';
    data._closeBtnClass = 'js__growthmessage-dialog__button-close';
    return data;
};
var MessageStore = (function (_super) {
    __extends(MessageStore, _super);
    function MessageStore(emitter) {
        var _this = this;
        _super.call(this);
        this._message = null;
        this.register = emitter.on.bind(emitter);
        this.register('createMessage', function (action) {
            _this._message = convert(action.data);
            _this.emit('change');
        });
        this.register('closeMessage', function (action) {
            _this._message = null;
            _this.emit('change');
        });
    }
    MessageStore.prototype.getMessage = function () {
        return this._message;
    };
    return MessageStore;
})(Emitter);
module.exports = MessageStore;

},{"component-emitter":14}],11:[function(require,module,exports){
var t = require('t');
var templates = {
    plain: '<div class=growthmessage-dialog><div class=growthmessage-dialog__inner><div class=growthmessage-dialog__margin-left></div><div class=growthmessage-dialog__contents><div class=growthmessage-dialog-text><div class=growthmessage-dialog-text__title>{{=caption}}</div><div class=growthmessage-dialog-text__body>{{=text}}</div><div class=growthmessage-dialog-text__buttons>{{@buttons}} {{_val._isUrlType}} <a href="{{=_val.intent.url}}" class="{{=_linkBtnClass}} growthmessage-dialog-text__button">{{=_val.label}}</a> {{:_val._isUrlType}}<div class="{{=_closeBtnClass}} growthmessage-dialog-text__button">{{=_val.label}}</div>{{/_val._isUrlType}} {{/@buttons}}</div></div></div><div class=growthmessage-dialog__margin-right></div></div></div>',
    image: '<div class="{{=_closeElClass}} growthmessage-dialog"><div class=growthmessage-dialog__inner><div class="{{=_closeElClass}} growthmessage-dialog__margin-left"></div><div class="{{=_closeElClass}} growthmessage-dialog__contents"><div class=growthmessage-dialog-image>{{_screenIsUrlType}} <a href="{{=_screen.intent.url}}" class=growthmessage-dialog-image__bg><img src="{{=picture.url}}" class="{{=_linkBtnClass}}"></a> {{:_screenIsUrlType}}<div class=growthmessage-dialog-image__bg><img src="{{=picture.url}}" class="{{_screen}}{{=_closeBtnClass}}{{/_screen}}"></div>{{/_screenIsUrlType}}<div class=growthmessage-dialog-image__buttons>{{@buttons}} {{_val._isUrlType}} <a href="{{=_val.intent.url}}" class=growthmessage-dialog-image__button><img src="{{=_val.picture.url}}" class="{{=_linkBtnClass}}"></a> {{:_val._isUrlType}}<div class=growthmessage-dialog-image__button><img src="{{=_val.picture.url}}" class="{{=_closeBtnClass}}"></div>{{/_val._isUrlType}} {{/@buttons}}</div>{{_close}} <img src="{{=_close.picture.url}}" class="{{=_closeBtnClass}} growthmessage-dialog__button-close"> {{/_close}}</div></div><div class="{{=_closeElClass}} growthmessage-dialog__margin-right"></div></div></div>'
};
var DialogView = (function () {
    function DialogView(parent, props) {
        this.parent = null;
        this.props = null;
        this.parent = parent;
        this.props = props;
    }
    DialogView.prototype.render = function () {
        var _this = this;
        if (this.el == null) {
            var html = new t(templates[this.props.message.type]).render(this.props.message);
            var div = document.createElement('div');
            div.innerHTML = html;
            this.el = div.firstChild;
            this.fitOverlay();
            this.fitDialog();
            this.parent.appendChild(this.el);
        }
        this.animateForOpen(100, function () {
            _this.bindEvents();
        });
    };
    DialogView.prototype.dispose = function () {
        var _this = this;
        this.animateForClose(100, function () {
            _this.parent.removeChild(_this.el);
            _this.el = null;
        });
    };
    DialogView.prototype.animateForOpen = function (delay, callback) {
        var _this = this;
        setTimeout(function () {
            var el = _this.el.getElementsByClassName('growthmessage-dialog__contents')[0];
            el.style['transform'] = 'scale(1)';
            el.style['-webkit-transform'] = 'scale(1)';
            _this.el.style.opacity = 1;
            callback();
        }, delay);
    };
    DialogView.prototype.animateForClose = function (delay, callback) {
        var _this = this;
        setTimeout(function () {
            _this.el.style.opacity = 0;
            callback();
        }, delay);
    };
    DialogView.prototype.fitOverlay = function () {
        var D = document;
        this.el.width = Math.max(D.body.offsetWidth, D.documentElement.offsetWidth, D.body.clientWidth, D.documentElement.clientWidth);
        this.el.style.width = this.el.width + 'px';
        this.el.height = Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
        this.el.style.height = this.el.height + 'px';
    };
    DialogView.prototype.fitDialog = function () {
        var D = document;
        var w = window.innerWidth || D.documentElement.clientWidth || D.body.clientWidth;
        var h = window.innerHeight || D.documentElement.clientHeight || D.body.clientHeight;
        var t = Math.max(window.pageYOffset, D.documentElement.scrollTop);
        var el = this.el.getElementsByClassName('growthmessage-dialog__inner')[0];
        el.width = w;
        el.style.width = w + 'px';
        el.height = h;
        el.style.height = h + 'px';
        el.top = t;
        el.style.top = t + 'px';
    };
    DialogView.prototype.bindEvents = function () {
        var _this = this;
        var eventName = ('ontouchstart' in window) ? 'touchend' : 'click';
        this.el.addEventListener(eventName, function (e) {
            var isElement = _this.hasClass(e.target, 'js__growthmessage-dialog__element-close');
            var isButton = _this.hasClass(e.target, 'js__growthmessage-dialog__button-close');
            var isLink = _this.hasClass(e.target, 'js__growthmessage-dialog__button-link');
            if (!isElement && !isButton && !isLink)
                return;
            _this.props.context.messageAction.closeMessage();
        });
    };
    DialogView.prototype.hasClass = function (el, name) {
        return (el.className.split(' ').indexOf(name) >= 0);
    };
    return DialogView;
})();
module.exports = DialogView;

},{"t":16}],12:[function(require,module,exports){
var DialogView = require('./dialog-view');
var styles = '.growthmessage-dialog{position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.5);opacity:0;font-family:sans-serif;-webkit-transition:all .2s;transition:all .2s}.growthmessage-dialog-image__button:hover,.growthmessage-dialog__button-close:hover{opacity:.8}.growthmessage-dialog__inner{position:absolute;top:0;left:0;width:100%;max-height:85%;display:table}.growthmessage-dialog__margin-left,.growthmessage-dialog__margin-right{display:table-cell;width:7.5%}.growthmessage-dialog__contents{display:table-cell;width:85%;vertical-align:middle;-webkit-transform:scale(1.1);transform:scale(1.1);-webkit-transition:all .3s;transition:all .3s}.growthmessage-dialog-text{display:table;table-layout:fixed;box-sizing:border-box;overflow:hidden;width:100%;background-color:#eaeaea;border-top:1px solid #fff;border-radius:7px}.growthmessage-dialog-text__title{margin:21px 14px 7px;text-align:center;word-wrap:break-word;line-height:24px;font-size:17px;font-weight:700}.growthmessage-dialog-text__body{margin:0 21px 21px;text-align:center;word-wrap:break-word;line-height:17px;font-size:13px}.growthmessage-dialog-text__buttons{display:table;table-layout:fixed;width:100%;border-top:1px solid #ccc}.growthmessage-dialog-text__button{display:table-cell;box-sizing:border-box;padding:14px 7px;border-right:1px solid #ccc;text-align:center;vertical-align:middle;word-wrap:break-word;text-decoration:none;font-size:17px;color:#1678e5;-webkit-tap-highlight-color:transparent}.growthmessage-dialog-text__button:hover{background:#efefef;font-weight:700}.growthmessage-dialog-text__button:last-child{border-right:none}.growthmessage-dialog-image{position:relative;display:table;table-layout:fixed;box-sizing:border-box;width:100%;font-size:0}.growthmessage-dialog-image__bg{display:table-cell;width:100%;-webkit-tap-highlight-color:transparent}.growthmessage-dialog-image__bg img{display:block;max-width:100%;margin:0 auto;padding:0}.growthmessage-dialog-image__buttons{display:table-cell;position:absolute;bottom:0;left:0;width:100%;text-align:center;vertical-align:bottom}.growthmessage-dialog-image__button{display:block;width:100%;-webkit-tap-highlight-color:transparent}.growthmessage-dialog-image__button img{display:block;max-width:100%;margin:0 auto;padding:0}.growthmessage-dialog__button-close{position:absolute;top:0;right:0;-webkit-transform:translate(50%,-50%) scale(.5);transform:translate(50%,-50%) scale(.5);font-size:0}';
var el = document.createElement('style');
el.type = 'text/css';
el.innerHTML = styles;
document.getElementsByTagName('head')[0].appendChild(el);
var MessageControllerView = (function () {
    function MessageControllerView(parent, props) {
        this.el = null;
        this.parent = null;
        this.props = null;
        this.state = null;
        this.dialogView = null;
        this.parent = parent;
        this.props = props;
        this.state = {
            message: this.props.context.messageStore.getMessage()
        };
        this.props.context.messageStore.on('change', this._onChange.bind(this));
    }
    MessageControllerView.prototype.render = function () {
        if (this.el == null) {
            var el = document.createElement('div');
            el.className = 'growthmessage';
            this.el = el;
            this.parent.appendChild(this.el);
        }
        if (this.state.message == null) {
            if (this.dialogView != null) {
                this.dialogView.dispose();
                this.dialogView = null;
            }
        }
        else {
            this.dialogView = new DialogView(this.el, {
                context: this.props.context,
                message: this.state.message
            });
            this.dialogView.render();
        }
    };
    MessageControllerView.prototype._onChange = function () {
        console.log('_onChange');
        this.state = {
            message: this.props.context.messageStore.getMessage()
        };
        this.render();
    };
    return MessageControllerView;
})();
module.exports = MessageControllerView;

},{"./dialog-view":11}],13:[function(require,module,exports){
(function (global){
///<reference path='../local_typings/nanoajax.d.ts' />
///<reference path='../local_typings/component-emitter.d.ts' />
///<reference path='../local_typings/t.d.ts' />
var Growthbeat = require('./growthbeat/index');
var GrowthAnalytics = require('./growthanalytics/index');
var GrowthMessage = require('./growthmessage/index');
global.Growthbeat = Growthbeat;
global.GrowthAnalytics = GrowthAnalytics;
global.GrowthMessage = GrowthMessage;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./growthanalytics/index":1,"./growthbeat/index":7,"./growthmessage/index":9}],14:[function(require,module,exports){

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

},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
/*
		 _     _
		| |   (_)
		| |_   _ ___
		| __| | / __|
		| |_ _| \__ \
		 \__(_) |___/
		     _/ |
		    |__/

	t.js
	a micro-templating framework in ~400 bytes gzipped

	@author  Jason Mooberry <jasonmoo@me.com>
	@license MIT
	@version 0.1.0

*/
(function(global) {

	var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g,
		valregex = /\{\{([=%])(.+?)\}\}/g;

	function t(template) {
		this.t = template;
	}

	function scrub(val) {
		return new Option(val).innerHTML.replace(/"/g,"&quot;");
	}

	function get_value(vars, key) {
		var parts = key.split('.');
		while (parts.length) {
			if (!(parts[0] in vars)) {
				return false;
			}
			vars = vars[parts.shift()];
		}
		return vars;
	}

	function render(fragment, vars) {
		return fragment
			.replace(blockregex, function(_, __, meta, key, inner, if_true, has_else, if_false) {

				var val = get_value(vars,key), temp = "", i;

				if (!val) {

					// handle if not
					if (meta == '!') {
						return render(inner, vars);
					}
					// check for else
					if (has_else) {
						return render(if_false, vars);
					}

					return "";
				}

				// regular if
				if (!meta) {
					return render(if_true, vars);
				}

				// process array/obj iteration
				if (meta == '@') {
					// store any previous vars
					// reuse existing vars
					_ = vars._key;
					__ = vars._val;
					for (i in val) {
						if (val.hasOwnProperty(i)) {
							vars._key = i;
							vars._val = val[i];
							temp += render(inner, vars);
						}
					}
					vars._key = _;
					vars._val = __;
					return temp;
				}

			})
			.replace(valregex, function(_, meta, key) {
				var val = get_value(vars,key);

				if (val || val === 0) {
					return meta == '%' ? scrub(val) : val;
				}
				return "";
			});
	}

	t.prototype.render = function (vars) {
		return render(this.t, vars);
	};

	if (typeof define === 'function' && define.amd) {
		define(function() { return t; });
	} else if (typeof exports === 'object') {
		module.exports = t;
	} else {
		global.t = t;
	}
})(this);

},{}]},{},[13]);
