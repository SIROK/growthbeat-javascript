import GrowthbeatCore = require('../growthbeat-core/index');
import Client = require('../growthbeat-core/model/client');
import Uuid = require('../growthbeat-core/model/uuid');
import ClientEvent = require('./model/client-event');
import ClientTag = require('./model/client-tag');
import Emitter = require('component-emitter');

enum TrackOption {
    ONCE, COUNTER
}

interface TrackParams {
    namespace?:string;
    name:string;
    properties?:{key?:string};
    option?:TrackOption;
}

interface TagParams {
    namespace?:string;
    name:string;
    value?:string;
}

var DEFAULT_NAMESPACE = 'Default';
var CUSTOM_NAMESPACE = 'Custom';

var _initialized:boolean = false;

var _applicationId:string = null;
var _credentialId:string = null;

var _emitter = new Emitter();

var _openDate:Date = null;

export var Gender = {
    MALE: 'male',
    FEMALE: 'female'
};

var _generateEventId = (namespace:string, name:string) => {
    return `Event:${_applicationId}:${namespace}:${name}`;
};

var _generateTagId = (namespace:string, name:string) => {
    return `Tag:${_applicationId}:${namespace}:${name}`;
};

export function init(applicationId:string, credentialId:string) {
    if (_initialized) return;

    _applicationId = applicationId;
    _credentialId = credentialId;

    console.log('initialized: GrowthAnalytics');
    _initialized = true;
}

export function track(trackParams:TrackParams) {
    if (trackParams.namespace == null) {
        trackParams.namespace = CUSTOM_NAMESPACE;
    }

    var eventId = _generateEventId(trackParams.namespace, trackParams.name);
    console.log(`Track event... (eventId: ${eventId})`);

    var existingClientEvent = ClientEvent.load(eventId);

    var processedProperties = trackParams.properties == null ? {} : trackParams.properties;

    if (trackParams.option === TrackOption.ONCE) {
        if (existingClientEvent != null) {
            console.log(`Event already sent with once option. (eventId: ${eventId})`);
            return;
        }
    }

    if (trackParams.option === TrackOption.COUNTER) {
        var counter = 0;
        if (existingClientEvent != null && existingClientEvent.getProperties() != null) {
            var existingProperties = existingClientEvent.getProperties();
            counter = parseInt(existingProperties['counter'], 10);
        }
        processedProperties['counter'] = counter++;
    }

    var client = GrowthbeatCore.getClient();
    var clientEvent = ClientEvent.create(client.getId(), eventId, trackParams.properties, _credentialId);
    clientEvent.on('created', () => {
        ClientEvent.save(clientEvent);
        console.log(`Tracking event success. (eventId: ${eventId}, properties: ${processedProperties})`);
    });

    clientEvent.on('error', () => {
        // FIXME errorMessage.
        console.log(`Tracking event fail.`);
    });
}

export function tag(tagParams:TagParams) {
    if (tagParams.namespace == null) {
        tagParams.namespace = CUSTOM_NAMESPACE;
    }

    var tagId = _generateTagId(tagParams.namespace, tagParams.name);
    console.log(`Set tag... (tagId: ${tagId}, value: ${tagParams.value})`);

    var existingClientTag = ClientTag.load(tagId);
    if (existingClientTag != null) {
        if (existingClientTag.getValue() === tagParams.value) {
            console.log(`Tag exists with the same value. (tagId: ${tagId}, value: ${tagParams.value})`);
            return;
        }
        console.log(`Tag exists with the other value. (tagId: ${tagId}, value: ${tagParams.value})`);
    }

    var client = GrowthbeatCore.getClient();
    var clientTag = ClientTag.create(client.getId(), tagId, tagParams.value, _credentialId);
    clientTag.on('created', () => {
        // FIXME clientTag Save
        ClientTag.save(clientTag);
        console.log(`Setting tag success. (tagId: ${tagId})`);
    });

    clientTag.on('error', () => {
        // FIXME errorMessage.
        console.log(`Setting tag fail.`);
    });
}

export function open() {
    _openDate = new Date();
    track({
        namespace: DEFAULT_NAMESPACE,
        name: 'Open',
        option: TrackOption.COUNTER
    });
    track({
        namespace: DEFAULT_NAMESPACE,
        name: 'Install',
        option: TrackOption.ONCE
    });
}

export function close() {
    if (!_openDate)
        return;

    var time:number = (new Date().getTime() - _openDate.getTime()) / 1000;
    _openDate = null;
    var properties = {
        time: `${time}`
    };
    track({
        namespace: DEFAULT_NAMESPACE,
        name: 'Close',
        properties: properties
    });
}

export function purchase(price:number, category:string, product:string) {
    var properties = {
        price: `${price}`,
        category: category,
        product: product
    };
    track({
        namespace: DEFAULT_NAMESPACE,
        name: 'Purchase',
        properties: properties
    });
}

export function setUuid() {
    var uuid = GrowthbeatCore.getCUuid();
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'UUID',
        value: uuid.getUuid()
    });
}

export function setUserId(userId:string) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'UserID',
        value: userId
    });
}

export function setName(name:string) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Name',
        value: name
    });
}

export function setAge(age:number) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Age',
        value: `${age}`
    });
}

export function setGender(gender:string) {
    if (gender !== Gender.MALE && gender !== Gender.FEMALE) return;
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Gender',
        value: gender,
    });
}

export function setLevel(level:number) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Level',
        value: `${level}`
    });
}

export function setDevelopment(development:boolean) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Development',
        value: `${development}`
    });
}

export function setUserAgent() {
    if (!window.navigator.userAgent) return;
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'UserAgent',
        value: window.navigator.userAgent
    });
}

export function setLanguage() {
    if (!window.navigator.language) return;
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Language',
        value: window.navigator.language
    });
}

export function setRandom() {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'Random',
        value: `${Math.random()}`
    });
}

export function setAdvertisingId(adverTisingId:string) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'AdvertisingID',
        value: adverTisingId
    });
}

export function setTrackingEnabled(enabled:boolean) {
    tag({
        namespace: DEFAULT_NAMESPACE,
        name: 'TrackingEnabled',
        value: `${enabled}`
    });
}

export function setBasicTags() {
    setUserAgent();
    setLanguage();
}

export function getEmitter():Emitter {
    return _emitter;
}