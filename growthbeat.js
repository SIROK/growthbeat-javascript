var GrowthAnalytics;
(function (GrowthAnalytics) {
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
                body: 'clientId=' + clientId
                    + '&eventId=' + eventId
                    + '&properties=' + properties
                    + '&credentialId=' + credentialId
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
    GrowthAnalytics.ClientEvent = ClientEvent;
})(GrowthAnalytics || (GrowthAnalytics = {}));
var GrowthAnalytics;
(function (GrowthAnalytics) {
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
                body: 'clientId=' + clientId
                    + '&tagId=' + tagId
                    + '&value=' + value
                    + '&credentialId=' + credentialId
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
    GrowthAnalytics.ClientTag = ClientTag;
})(GrowthAnalytics || (GrowthAnalytics = {}));
var GrowthAnalytics;
(function (GrowthAnalytics_1) {
    var GrowthAnalytics = (function () {
        function GrowthAnalytics() {
            this.applicationId = null;
            this.credentialId = null;
            this.initialized = false;
        }
        GrowthAnalytics.getInstance = function () {
            return this.instance;
        };
        GrowthAnalytics.prototype.initialize = function (applicationId, credentialId) {
            if (!this.initialized)
                return;
            this.initialized = true;
            this.applicationId = applicationId;
            this.credentialId = credentialId;
            // FIXME merge Growthbeat
            //Growthbeat.GrowthbeatCore.initialize(applicationId, credentialId);
            // TODO client if not exists.
            this.setBasicTags();
        };
        GrowthAnalytics.prototype.setBasicTags = function () {
            // TODO setBasicTags
        };
        GrowthAnalytics.prototype.track = function (trackParams) {
            if (trackParams.namespace == undefined)
                trackParams.namespace = GrowthAnalytics.CUSTOM_NAMESPACE;
            var eventId = this.generateEventId(trackParams.namespace, name);
            // FIXME ClientEvent.load
            if (trackParams.option == TrackOption.ONCE) {
            }
            if (trackParams.option == TrackOption.COUNTER) {
            }
            // FIXME merge GrowthbeatCore
            var clientId = 'xxxxx';
            GrowthAnalytics_1.ClientEvent.create(clientId, eventId, trackParams.properties, this.credentialId, function (clientEvent) {
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
            GrowthAnalytics_1.ClientTag.create(clientId, tagId, tagParams.value, this.credentialId, function (clientTag) {
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
        GrowthAnalytics.instance = new GrowthAnalytics();
        return GrowthAnalytics;
    })();
    GrowthAnalytics_1.GrowthAnalytics = GrowthAnalytics;
    (function (TrackOption) {
        TrackOption[TrackOption["ONCE"] = 0] = "ONCE";
        TrackOption[TrackOption["COUNTER"] = 1] = "COUNTER";
    })(GrowthAnalytics_1.TrackOption || (GrowthAnalytics_1.TrackOption = {}));
    var TrackOption = GrowthAnalytics_1.TrackOption;
})(GrowthAnalytics || (GrowthAnalytics = {}));
var Growthbeat;
(function (Growthbeat_1) {
    var Growthbeat = (function () {
        function Growthbeat() {
            console.log('Hello Growthbeat.');
        }
        return Growthbeat;
    })();
    Growthbeat_1.Growthbeat = Growthbeat;
})(Growthbeat || (Growthbeat = {}));
var GrowthMessage;
(function (GrowthMessage) {
    var Events = (function () {
        function Events() {
            this.events = {};
        }
        Events.prototype.on = function (eventName, callbackName, thisArg) {
            this.events[eventName] = {
                callbackName: callbackName,
                thisArg: thisArg
            };
        };
        Events.prototype.trigger = function (eventName, arg) {
            var event = this.events[eventName];
            if (!event)
                return;
            var thisArg = event.thisArg ? event.thisArg : this;
            thisArg[event.callbackName](arg);
        };
        return Events;
    })();
    GrowthMessage.Events = Events;
})(GrowthMessage || (GrowthMessage = {}));
/// <reference path="events.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GrowthMessage;
(function (GrowthMessage) {
    var App = (function (_super) {
        __extends(App, _super);
        function App(options) {
            _super.call(this);
            this.config = new GrowthMessage.Config();
            this.dialog = new GrowthMessage.Dialog();
            this.image = new GrowthMessage.Image();
            this.userAgent = new GrowthMessage.UserAgent();
            if (!this.userAgent.isViewable())
                return;
            this.id = options.id;
            this.render();
            this.setStyles();
            this.bindEvents();
            // For Debug
            window.onhashchange = function () {
                location.reload(false);
            };
            this.config.load('/sample/json/' + location.hash.slice(1) + '.json');
        }
        App.prototype.render = function () {
            var el = document.createElement('div');
            el.className = 'growthmessage';
            document.body.appendChild(el);
            this.el = document.body.getElementsByClassName(el.className)[0];
        };
        App.prototype.setStyles = function () {
            var styles = GrowthMessage.module.require('styles.css');
            var el = document.createElement('style');
            el.type = 'text/css';
            el.innerHTML = styles;
            document.getElementsByTagName('head')[0].appendChild(el);
        };
        App.prototype.bindEvents = function () {
            this.on('hook', 'open');
            this.config.on('set', 'loadImages', this);
            this.image.on('load', 'open', this);
        };
        App.prototype.loadImages = function () {
            this.image.load(this.config.get());
        };
        App.prototype.open = function () {
            this.dialog.open(this.config.get());
        };
        return App;
    })(GrowthMessage.Events);
    GrowthMessage.App = App;
})(GrowthMessage || (GrowthMessage = {}));
/// <reference path="vender/nanoajax.d.ts" />
/// <reference path="events.ts" />
var GrowthMessage;
(function (GrowthMessage) {
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config() {
            _super.call(this);
            this.on('load', 'set');
        }
        Config.prototype.load = function (url, params) {
            var _this = this;
            GrowthMessage.nanoajax.ajax({
                url: url,
                method: 'GET'
            }, function (code, responseText) {
                if (code !== 200) {
                    _this.trigger('error');
                    return;
                }
                _this.trigger('load', JSON.parse(responseText));
            });
        };
        Config.prototype.set = function (responseText) {
            this.data = responseText;
            this.trigger('set');
        };
        Config.prototype.get = function () {
            return this.data;
        };
        return Config;
    })(GrowthMessage.Events);
    GrowthMessage.Config = Config;
})(GrowthMessage || (GrowthMessage = {}));
/// <reference path="vender/t.d.ts" />
/// <reference path="events.ts" />
var GrowthMessage;
(function (GrowthMessage) {
    var Dialog = (function (_super) {
        __extends(Dialog, _super);
        function Dialog() {
            _super.call(this);
            this.templates = {
                'plain': 'dialog-text.html',
                'image': 'dialog-image.html'
            };
        }
        Dialog.prototype.open = function (data) {
            this.parentElement = document.body.getElementsByClassName('growthmessage')[0];
            this.render(data);
            this.setElement();
            this.fitOverlay();
            this.fitDialog();
            this.scaleDialog();
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
            var template = GrowthMessage.module.require(this.templates[data.type]);
            var html = new GrowthMessage.t(template).render(this.filter(data));
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
    })(GrowthMessage.Events);
    GrowthMessage.Dialog = Dialog;
})(GrowthMessage || (GrowthMessage = {}));
/// <reference path="events.ts" />
var GrowthMessage;
(function (GrowthMessage) {
    var Image = (function (_super) {
        __extends(Image, _super);
        function Image() {
            _super.call(this);
        }
        Image.prototype.load = function (config) {
            var _this = this;
            var urls = this.extractImageUrls(config, []);
            var unextracted = urls.length;
            if (!unextracted) {
                this.trigger('load');
                return;
            }
            urls.forEach(function (url) {
                var retriedTimes = 3;
                var img = document.createElement('img');
                img.onload = function () {
                    if (--unextracted)
                        return;
                    _this.trigger('load');
                };
                img.onerror = function () {
                    if (--retriedTimes) {
                        img.src = '';
                        img.src = url;
                    }
                };
                img.src = url;
            });
        };
        Image.prototype.extractImageUrls = function (input, output) {
            var _this = this;
            Object.keys(input).forEach(function (key) {
                if (key === 'picture') {
                    output.push(input[key].url);
                }
                else if (input[key] instanceof Object) {
                    output = _this.extractImageUrls(input[key], output);
                }
            });
            return output;
        };
        return Image;
    })(GrowthMessage.Events);
    GrowthMessage.Image = Image;
})(GrowthMessage || (GrowthMessage = {}));
var GrowthMessage;
(function (GrowthMessage) {
    var Module = (function () {
        function Module() {
        }
        Module.prototype.exports = function (name, src) {
            this[name] = src;
        };
        Module.prototype.require = function (name) {
            return this[name];
        };
        return Module;
    })();
    GrowthMessage.module = new Module();
})(GrowthMessage || (GrowthMessage = {}));
/// <reference path="events.ts" />
var GrowthMessage;
(function (GrowthMessage) {
    var UserAgent = (function (_super) {
        __extends(UserAgent, _super);
        function UserAgent() {
            _super.call(this);
            this.UA = window.navigator.userAgent.toLowerCase();
        }
        UserAgent.prototype.isViewable = function () {
            var _this = this;
            var is = function (text) {
                return _this.UA.indexOf(text) != -1;
            };
            return (is('iphone os 6_') ||
                is('iphone os 7_') ||
                is('iphone os 8_') ||
                is('iphone os 9_') ||
                is('iphone os 10_') ||
                (is('android 4.') && is('mobile safari')) ||
                (is('android 5.') && is('mobile safari')) ||
                (is('android 6.') && is('mobile safari')));
        };
        return UserAgent;
    })(GrowthMessage.Events);
    GrowthMessage.UserAgent = UserAgent;
})(GrowthMessage || (GrowthMessage = {}));
