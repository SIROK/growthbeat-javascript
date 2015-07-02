import GrowthbeatCore = require('../../growthbeat-core/ts/growthbeat-core');
import GrowthbeatAnalytics = require('../../growthanalytics/ts/index');

class Growthbeat {
    private static _instance:Growthbeat = null;
    private _initialized:boolean = false;

    constructor() {
        if (Growthbeat._instance) {
            throw new Error('must use the getInstance');
        }
        Growthbeat._instance = this;
    }

    static getInstance():Growthbeat {
        if (Growthbeat._instance === null) {
            Growthbeat._instance = new Growthbeat();
        }
        return Growthbeat._instance;
    }

    initialize(applicationId:string, credentialId:string) {
        if (this._initialized) return;

        console.log('initialized: Growthbeat');
        this._initialized = true;

        GrowthbeatCore.getInstance().initialize('applicationId', 'credentialId');
        GrowthbeatAnalytics.getInstance().initialize('applicationId', 'credentialId');
        // TODO: initialze GrowthAnalytics
        // TODO: initialze GrowthMessage
    }

    start() {
        // TODO: open GrowthAnalytics
    }

    stop() {
        // TODO: open GrowthMessage
    }
}

export = Growthbeat;