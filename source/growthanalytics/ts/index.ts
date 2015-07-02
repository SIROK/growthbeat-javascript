import GrowthbeatCore = require('../../growthbeat-core/ts/index');
import ClientEvent = require('./model/client-event');
import ClientTag = require('./model/client-tag');

enum TrackOption {
    ONCE, COUNTER
}

interface TrackParams {
    namespace?:string;
    name:string;
    properties?:any;
    option?:TrackOption;
}

interface TagParams {
    namespace?:string;
    name:string;
    value?:string;
}

class GrowthAnalytics {
    static DEFAULT_BASE_URL:string = "https://analytics.growthbeat.com/";

    static DEFAULT_NAMESPACE:string = 'Default';
    static CUSTOM_NAMESPACE:string = 'Custom';

    private applicationId:string = null;
    private credentialId:string = null;

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

        console.log('initialized: GrowthAnalytics');
        this._initialized = true;

        GrowthbeatCore.getInstance().initialize(applicationId, credentialId);

        this.setBasicTags();
    }

    setBasicTags() {
        // TODO setBasicTags
    }

    track(trackParams:TrackParams):void {

        if (trackParams.namespace === undefined)
            trackParams.namespace = GrowthAnalytics.CUSTOM_NAMESPACE;

        var eventId:string = this.generateEventId(trackParams.namespace, name);

        // FIXME ClientEvent.load
        if (trackParams.option == TrackOption.ONCE) {
            // FIXME if clientEvent exists.
        }

        if (trackParams.option == TrackOption.COUNTER) {
            // FIXME if clientEvents exists.
        }

        // FIXME merge GrowthbeatCore
        var clientId:string = 'xxxxx';
        ClientEvent.create(clientId, eventId, trackParams.properties, this.credentialId, (clientEvent:ClientEvent) => {
            // FIXME clientEvent Save
        }, () => {
            // FIXME errorMessage.
            console.log('error');
        });

    }

    public tag(tagParams:TagParams):void {

        if (tagParams.namespace == undefined)
            tagParams.namespace = GrowthAnalytics.CUSTOM_NAMESPACE;

        var tagId:string = this.generateTagId(tagParams.namespace, name);

        // FIXME merge GrowthbeatCore
        var clientId:string = 'xxxxx';
        ClientTag.create(clientId, tagId, tagParams.value, this.credentialId, (clientTag:ClientTag) => {
            // FIXME clientTag Save
        }, () => {
            // FIXME errorMessage.
            console.log('error');
        });

    }

    private generateEventId(namespace:string, name:string) {
        return 'Event:' + this.applicationId + ':' + namespace + ':' + name;
    }

    private generateTagId(namespace:string, name:string) {
        return 'Tag:' + this.applicationId + ':' + namespace + ':' + name;
    }

    getApplicationId():string {
        return this.applicationId;
    }

    getCredentialId():string {
        return this.credentialId;
    }
}

export = GrowthAnalytics;