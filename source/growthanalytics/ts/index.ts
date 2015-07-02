import GrowthbeatCore = require('../../growthbeat-core/ts/growthbeat-core');

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
}

export = GrowthAnalytics;