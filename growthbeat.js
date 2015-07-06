(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ClientEvent = require('./model/client-event');
var ClientTag = require('./model/client-tag');
var Emitter = require('component-emitter');
var TrackOption;
(function (TrackOption) {
    TrackOption[TrackOption["ONCE"] = 0] = "ONCE";
    TrackOption[TrackOption["COUNTER"] = 1] = "COUNTER";
})(TrackOption || (TrackOption = {}));
var GrowthAnalytics = (function () {
    function GrowthAnalytics() {
        this.applicationId = null;
        this.credentialId = null;
        this.emmiter = new Emitter();
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
    GrowthAnalytics.prototype.getEmitter = function () {
        return this.emmiter;
    };
    GrowthAnalytics.DEFAULT_BASE_URL = "https://analytics.growthbeat.com/";
    GrowthAnalytics.DEFAULT_NAMESPACE = 'Default';
    GrowthAnalytics.CUSTOM_NAMESPACE = 'Custom';
    GrowthAnalytics._instance = null;
    return GrowthAnalytics;
})();
module.exports = GrowthAnalytics;

},{"./model/client-event":2,"./model/client-tag":3,"component-emitter":12}],2:[function(require,module,exports){
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

},{"nanoajax":13}],3:[function(require,module,exports){
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

},{"nanoajax":13}],4:[function(require,module,exports){
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

},{"nanoajax":13}],5:[function(require,module,exports){
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

},{"component-emitter":12}],7:[function(require,module,exports){
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
var GrowthbeatHttpClient = require('../growthbeat-core/http/growthbeat-http-client');
var GrowthAnalytics = require('../growthanalytics/index');
var MessageView = require('./view/message-view');
//var HTTP_CLIENT_BASE_URL = 'https://api.message.growthbeat.com/';
var HTTP_CLIENT_BASE_URL = 'http://localhost:8000/';
var HTTP_CLIENT_TIMEOUT = 10 * 1000;
var GrowthMessage = (function () {
    function GrowthMessage() {
        this.httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);
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
        GrowthAnalytics.getInstance().getEmitter().on('GrowthMessage', function (eventId) {
            _this.recevieMessage(eventId);
        });
        console.log('initialized: GrowthMessage');
        this._initialized = true;
    };
    GrowthMessage.prototype.recevieMessage = function (eventId) {
        var _this = this;
        console.log('recevieMessage');
        this.httpClient.get('sample/json/image-2buttons.json', {}, function (data, code) {
            console.log(data, code);
            _this.loadImages(data, function () {
                console.log('image loaded');
                _this.openMessage(data);
            });
        }, function (err, code) {
            console.log(err, code);
        });
    };
    GrowthMessage.prototype.loadImages = function (data, callback) {
        console.log('loadImages');
        var deepExtract = function (input, name, output) {
            if (output === void 0) { output = []; }
            Object.keys(input).forEach(function (key) {
                if (key === 'picture') {
                    output.push(input[key].url);
                }
                else if (input[key] instanceof Object) {
                    output = deepExtract(input[key], name, output);
                }
            });
            return output;
        };
        var urls = deepExtract(data, 'picture');
        if (0 >= urls.length) {
            callback();
            return;
        }
        var count = 0;
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
    GrowthMessage.prototype.openMessage = function (data) {
        var messageView = new MessageView();
        messageView.open(data);
    };
    GrowthMessage.prototype.getHttpClient = function () {
        return this.httpClient;
    };
    GrowthMessage._instance = null;
    return GrowthMessage;
})();
module.exports = GrowthMessage;

},{"../growthanalytics/index":1,"../growthbeat-core/http/growthbeat-http-client":4,"./view/message-view":10}],9:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Emitter = require('component-emitter');
var t = require('t');
var templates = {
    plain: '<div class=growthmessage-dialog><div class=growthmessage-dialog__inner><div class=growthmessage-dialog__margin-left></div><div class=growthmessage-dialog__contents><div class=growthmessage-dialog-text><div class=growthmessage-dialog-text__title>{{=caption}}</div><div class=growthmessage-dialog-text__body>{{=text}}</div><div class=growthmessage-dialog-text__buttons>{{@buttons}} {{_val._isUrlType}} <a href="{{=_val.intent.url}}" class="{{=_linkBtnClass}} growthmessage-dialog-text__button">{{=_val.label}}</a> {{:_val._isUrlType}}<div class="{{=_closeBtnClass}} growthmessage-dialog-text__button">{{=_val.label}}</div>{{/_val._isUrlType}} {{/@buttons}}</div></div></div><div class=growthmessage-dialog__margin-right></div></div></div>',
    image: '<div class="{{=_closeElClass}} growthmessage-dialog"><div class=growthmessage-dialog__inner><div class="{{=_closeElClass}} growthmessage-dialog__margin-left"></div><div class="{{=_closeElClass}} growthmessage-dialog__contents"><div class=growthmessage-dialog-image>{{_screenIsUrlType}} <a href="{{=_screen.intent.url}}" class=growthmessage-dialog-image__bg><img src="{{=picture.url}}" class="{{=_linkBtnClass}}"></a> {{:_screenIsUrlType}}<div class=growthmessage-dialog-image__bg><img src="{{=picture.url}}" class="{{_screen}}{{=_closeBtnClass}}{{/_screen}}"></div>{{/_screenIsUrlType}}<div class=growthmessage-dialog-image__buttons>{{@buttons}} {{_val._isUrlType}} <a href="{{=_val.intent.url}}" class=growthmessage-dialog-image__button><img src="{{=_val.picture.url}}" class="{{=_linkBtnClass}}"></a> {{:_val._isUrlType}}<div class=growthmessage-dialog-image__button><img src="{{=_val.picture.url}}" class="{{=_closeBtnClass}}"></div>{{/_val._isUrlType}} {{/@buttons}}</div>{{_close}} <img src="{{=_close.picture.url}}" class="{{=_closeBtnClass}} growthmessage-dialog__button-close"> {{/_close}}</div></div><div class="{{=_closeElClass}} growthmessage-dialog__margin-right"></div></div></div>'
};
var Dialog = (function (_super) {
    __extends(Dialog, _super);
    function Dialog() {
        _super.call(this);
    }
    Dialog.prototype.open = function (data) {
        this.parentElement = document.body.getElementsByClassName('growthmessage')[0];
        this.render(data);
        this.setElement();
        this.fitOverlay();
        this.fitDialog();
        //this.scaleDialog();
        this.bindEvents();
        this.animateForOpen(100);
    };
    Dialog.prototype.hide = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        setTimeout(function () {
            _this.parentElement.innerHTML = '';
        }, delay);
    };
    Dialog.prototype.render = function (data) {
        var html = new t(templates[data.type]).render(this.filter(data));
        this.parentElement.innerHTML = html;
    };
    Dialog.prototype.filter = function (data) {
        var newButtons = [];
        data.buttons.forEach(function (button, index) {
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
    Dialog.prototype.setElement = function () {
        this.el = document.body.getElementsByClassName('growthmessage-dialog')[0];
    };
    Dialog.prototype.animateForOpen = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        setTimeout(function () {
            var el = document.body.getElementsByClassName('growthmessage-dialog__contents')[0];
            el.style['transform'] = 'scale(1)';
            el.style['-webkit-transform'] = 'scale(1)';
            _this.el.style.opacity = 1;
        }, delay);
    };
    Dialog.prototype.animateForClose = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        setTimeout(function () {
            _this.el.style.opacity = 0;
        }, delay);
    };
    Dialog.prototype.fitOverlay = function () {
        var D = document;
        this.el.width = Math.max(D.body.offsetWidth, D.documentElement.offsetWidth, D.body.clientWidth, D.documentElement.clientWidth);
        this.el.style.width = this.el.width + 'px';
        this.el.height = Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
        this.el.style.height = this.el.height + 'px';
    };
    Dialog.prototype.fitDialog = function () {
        var D = document;
        var el = document.body.getElementsByClassName('growthmessage-dialog__inner')[0];
        el.width = Math.max(D.body.clientWidth, D.documentElement.clientWidth);
        el.style.width = el.style.width + 'px';
        el.height = Math.min(D.body.clientHeight, D.documentElement.clientHeight);
        el.style.height = el.height + 'px';
        el.top = Math.max(window.pageYOffset, D.documentElement.scrollTop);
        el.style.top = el.top + 'px';
    };
    Dialog.prototype.scaleDialog = function () {
        var el = document.body.getElementsByClassName('growthmessage-dialog__inner')[0];
        setTimeout(function () {
            var D = document;
            var height = Math.min(D.body.clientHeight, D.documentElement.clientHeight);
            if (el.offsetHeight <= height)
                return;
            el.style.transform = 'scale(' + (height / el.offsetHeight * 0.85) + ')';
            el.style.transformOrigin = 'center top';
            el.style.top = el.top + height * 0.075 + 'px';
        }, 100);
    };
    Dialog.prototype.bindEvents = function () {
        var _this = this;
        var eventName = ('ontouchstart' in window) ? 'touchend' : 'click';
        this.el.addEventListener(eventName, function (e) {
            var isElement = _this.hasClass(e.target, 'js__growthmessage-dialog__element-close');
            var isButton = _this.hasClass(e.target, 'js__growthmessage-dialog__button-close');
            var isLink = _this.hasClass(e.target, 'js__growthmessage-dialog__button-link');
            if (!isElement && !isButton && !isLink)
                return;
            _this.animateForClose(isLink ? 600 : 0);
            _this.hide(isLink ? 1000 : 300);
        });
    };
    Dialog.prototype.hasClass = function (el, name) {
        return (el.className.split(' ').indexOf(name) >= 0);
    };
    return Dialog;
})(Emitter);
module.exports = Dialog;

},{"component-emitter":12,"t":14}],10:[function(require,module,exports){
var Dialog = require('./dialog');
var styles = '.growthmessage-dialog{position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.5);opacity:0;font-family:sans-serif;-webkit-transition:all .2s;transition:all .2s}.growthmessage-dialog-image__button:hover,.growthmessage-dialog__button-close:hover{opacity:.8}.growthmessage-dialog__inner{position:absolute;top:0;left:0;width:100%;max-height:85%;display:table}.growthmessage-dialog__margin-left,.growthmessage-dialog__margin-right{display:table-cell;width:7.5%}.growthmessage-dialog__contents{display:table-cell;width:85%;vertical-align:middle;-webkit-transform:scale(1.1);transform:scale(1.1);-webkit-transition:all .3s;transition:all .3s}.growthmessage-dialog-text{display:table;table-layout:fixed;box-sizing:border-box;overflow:hidden;width:100%;background-color:#eaeaea;border-top:1px solid #fff;border-radius:7px}.growthmessage-dialog-text__title{margin:21px 14px 7px;text-align:center;word-wrap:break-word;line-height:24px;font-size:17px;font-weight:700}.growthmessage-dialog-text__body{margin:0 21px 21px;text-align:center;word-wrap:break-word;line-height:17px;font-size:13px}.growthmessage-dialog-text__buttons{display:table;table-layout:fixed;width:100%;border-top:1px solid #ccc}.growthmessage-dialog-text__button{display:table-cell;box-sizing:border-box;padding:14px 7px;border-right:1px solid #ccc;text-align:center;vertical-align:middle;word-wrap:break-word;text-decoration:none;font-size:17px;color:#1678e5;-webkit-tap-highlight-color:transparent}.growthmessage-dialog-text__button:hover{background:#efefef;font-weight:700}.growthmessage-dialog-text__button:last-child{border-right:none}.growthmessage-dialog-image{position:relative;display:table;table-layout:fixed;box-sizing:border-box;width:100%;font-size:0}.growthmessage-dialog-image__bg{display:table-cell;width:100%;-webkit-tap-highlight-color:transparent}.growthmessage-dialog-image__bg img{display:block;max-width:100%;margin:0 auto;padding:0}.growthmessage-dialog-image__buttons{display:table-cell;position:absolute;bottom:0;left:0;width:100%;text-align:center;vertical-align:bottom}.growthmessage-dialog-image__button{display:block;width:100%;-webkit-tap-highlight-color:transparent}.growthmessage-dialog-image__button img{display:block;max-width:100%;margin:0 auto;padding:0}.growthmessage-dialog__button-close{position:absolute;top:0;right:0;-webkit-transform:translate(50%,-50%) scale(.5);transform:translate(50%,-50%) scale(.5);font-size:0}';
var MessageView = (function () {
    function MessageView() {
        this.el = null;
        console.log('messageview');
        this.render();
        this.setStyles();
    }
    MessageView.prototype.render = function () {
        var el = document.createElement('div');
        el.className = 'growthmessage';
        document.body.appendChild(el);
        this.el = el;
    };
    MessageView.prototype.setStyles = function () {
        var el = document.createElement('style');
        el.type = 'text/css';
        el.innerHTML = styles;
        document.getElementsByTagName('head')[0].appendChild(el);
    };
    MessageView.prototype.handleEvents = function () {
    };
    MessageView.prototype.open = function (data) {
        var dialog = new Dialog();
        dialog.open(data);
    };
    return MessageView;
})();
module.exports = MessageView;

},{"./dialog":9}],11:[function(require,module,exports){
///<reference path='../local_typings/nanoajax.d.ts' />
///<reference path='../local_typings/component-emitter.d.ts' />
///<reference path='../local_typings/t.d.ts' />
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

},{"./growthanalytics/index":1,"./growthbeat-core/index":5,"./growthbeat/index":7,"./growthmessage/index":8}],12:[function(require,module,exports){

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

},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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

},{}]},{},[11]);
