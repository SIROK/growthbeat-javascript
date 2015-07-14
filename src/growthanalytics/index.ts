import GrowthbeatCore = require('../growthbeat-core/index');
import ClientEvent = require('./model/client-event');
import ClientTag = require('./model/client-tag');
import Emitter = require('component-emitter');

enum TrackOption {
    ONCE, COUNTER
}

enum Gender {
    MALE, FEMALE
}

class GenderUtils {

    public static valueOf(value:string):Gender {

        switch (value) {
            case 'male':
                return Gender.MALE;
            case 'female':
                return Gender.FEMALE;
            default:
                return undefined;
        }

    }

    public static toString(gender:Gender):string {

        switch (gender) {
            case Gender.MALE:
                return 'male';
            case Gender.FEMALE:
                return 'female';
            default:
                return undefined;
        }

    }

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
    private openDate:Date = null;
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

        console.log('initialized: GrowthAnalytics');
        this._initialized = true;
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

    open() {
        this.openDate = new Date();
        this.track({
            namespace: DEFAULT_NAMESPACE,
            name: 'Open',
            option:TrackOption.COUNTER
        });
        this.track({
            namespace: DEFAULT_NAMESPACE,
            name: 'Install',
            option:TrackOption.ONCE
        });
    }

    close() {
        if (!this.openDate)
            return;

        var time:number = (new Date().getTime() - this.openDate.getTime()) / 1000;
        this.openDate = null;
        var properties = {
            time: `${time}`
        };
        this.track({
            namespace: DEFAULT_NAMESPACE,
            name: 'Close',
            properties: properties
        });
    }

    purchase(price:number, category:string, product:string) {
        var properties = {
            price: `${price}`,
            category: category,
            product: product
        };
        this.track({
            namespace: DEFAULT_NAMESPACE,
            name: 'Purchase',
            properties: properties
        });
    }

    setUuid(uuid:string) {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'UUID',
            value: uuid
        });
    }

    setUserrId(userId:string) {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'UserID',
            value: userId
        });
    }

    setName(name:string) {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'Name',
            value: name
        });
    }

    setAge(age:number) {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'Age',
            value: `${age}`
        });
    }

    setGender(gender:Gender) {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'Gender',
            value: GenderUtils.toString(gender),
        });
    }

    setLevel(level:number) {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'Level',
            value: `${level}`
        });
    }

    setDevelopment(development:boolean) {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'Development',
            value: `${development}`
        });
    }

    setUserAgent() {
        if (!window.navigator.userAgent) return;
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'UserAgent',
            value: window.navigator.userAgent
        });
    }

    setLanguage() {
        if (!window.navigator.language) return;
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'Language',
            value: window.navigator.language
        });
    }

    setRandom() {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'Random',
            value: `${Math.random()}`
        });
    }

    setAdvertisingId(adverTisingId:string) {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'AdvertisingID',
            value: adverTisingId
        });
    }

    setTrackingEnabled(enabled:boolean) {
        this.tag({
            namespace: DEFAULT_NAMESPACE,
            name: 'TrackingEnabled',
            value: `${enabled}`
        });
    }

    setBasicTags() {
        this.setUserAgent();
        this.setLanguage();
    }

    getEmitter():Emitter {
        return this.emitter;
    }
}

export = GrowthAnalytics;