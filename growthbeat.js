var Growthbeat;(function(global, exports){exports.ajax = function (params, callback) {
  if (typeof params == 'string') params = {url: params}
  var headers = params.headers || {}
    , body = params.body
    , method = params.method || (body ? 'POST' : 'GET')
    , withCredentials = params.withCredentials || false

  var req = getRequest()

  // has no effect in IE
  // has no effect for same-origin requests
  // has no effect in CORS if user has disabled 3rd party cookies

  req.onreadystatechange = function () {
    if (req.readyState == 4)
      callback(req.status, req.responseText, req)
  }

  if (body) {
    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
    setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
  }

  req.open(method, params.url, true)
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
Growthbeat.nanoajax=exports;}(window, Growthbeat || (Growthbeat = {})));
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
