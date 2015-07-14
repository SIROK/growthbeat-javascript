import GrowthbeatCore = require('../growthbeat-core/index');
import GrowthAnalytics = require('../growthanalytics/index');
import GrowthMessage = require('../growthmessage/index');

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

    initialize(applicationId:string, credentialId:string, callback:()=>void) {
        if (this._initialized) return;


        GrowthbeatCore.getInstance().initialize(applicationId, credentialId, () => {
            console.log('initialized: Growthbeat');
            this._initialized = true;

            GrowthAnalytics.getInstance().initialize(applicationId, credentialId);
            GrowthMessage.getInstance().initialize(applicationId, credentialId);
            callback();
        });
    }

    start() {
        // TODO: open GrowthAnalytics
    }

    stop() {
        // TODO: open GrowthMessage
    }
}

export = Growthbeat;