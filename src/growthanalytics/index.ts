import GrowthbeatCore = require('../growthbeat-core/index');
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

class GrowthAnalytics {
    private applicationId:string = null;
    private credentialId:string = null;

    private emitter = new Emitter();

    private static _instance:GrowthAnalytics = null;
    private _initialized:boolean = false;

    constructor() {
        if (GrowthAnalytics._instance) {
            throw new Error('must use the getInstance');
        }
        GrowthAnalytics._instance = this;
    }

    static getInstance():GrowthAnalytics {
        if (GrowthAnalytics._instance === null) {
            GrowthAnalytics._instance = new GrowthAnalytics();
        }
        return GrowthAnalytics._instance;
    }

    initialize(applicationId:string, credentialId:string) {
        if (this._initialized) return;

        this.applicationId = applicationId;
        this.credentialId = credentialId;

        this.setBasicTags();

        console.log('initialized: GrowthAnalytics');
        this._initialized = true;
    }

    setBasicTags() {
        // TODO setBasicTags
        this.setLanguage();
    }

    track(trackParams:TrackParams) {
        if (trackParams.namespace == null) {
            trackParams.namespace = CUSTOM_NAMESPACE;
        }

        var eventId = this.generateEventId(trackParams.namespace, name);
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

        var clientId = GrowthbeatCore.getInstance().getClient().getId();
        var clientEvent:ClientEvent = ClientEvent.create(clientId, eventId, trackParams.properties, this.credentialId);
        clientEvent.on('created', () => {
            ClientEvent.save(clientEvent);
            console.log(`Tracking event success. (id: %s, eventId: ${eventId}, properties: ${processedProperties})`);
        });

        clientEvent.on('error', () => {
            // FIXME errorMessage.
            console.log(`Tracking event fail.`);
        });
    }

    tag(tagParams:TagParams) {
        if (tagParams.namespace == null) {
            tagParams.namespace = CUSTOM_NAMESPACE;
        }

        var tagId = this.generateTagId(tagParams.namespace, name);
        console.log(`Set tag... (tagId: ${tagId}, value: ${tagParams.value})`);

        var existingClientTag = ClientTag.load(tagId);
        if (existingClientTag != null) {
            if (existingClientTag.getValue() === tagParams.value) {
                console.log(`Tag exists with the same value. (tagId: ${tagId}, value: ${tagParams.value})`);
                return;
            }
            console.log(`Tag exists with the other value. (tagId: ${tagId}, value: ${tagParams.value})`);
        }

        var clientId = GrowthbeatCore.getInstance().getClient().getId();
        var clientTag:ClientTag = ClientTag.create(clientId, tagId, tagParams.value, this.credentialId);
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

    private generateEventId(namespace:string, name:string) {
        return `Event:${this.applicationId}:${namespace}:${name}`;
    }

    private generateTagId(namespace:string, name:string) {
        return `Tag:${this.applicationId}:${namespace}:${name}`;
    }

    setLanguage() {
        if (!window.navigator.language) return;
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'Language',
            value: window.navigator.language
        });
    }

    getEmitter():Emitter {
        return this.emitter;
    }
}

export = GrowthAnalytics;