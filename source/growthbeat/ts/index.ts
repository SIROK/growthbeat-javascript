import GrowthbeatCore = require('../../growthbeat-core/ts/index');
import GrowthbeatAnalytics = require('../../growthanalytics/ts/index');
import GrowthbeatMessage = require('../../growthmessage/ts/index');

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

            GrowthbeatAnalytics.getInstance().initialize(applicationId, credentialId);
            GrowthbeatMessage.getInstance().initialize(applicationId, credentialId);
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