class GrowthbeatCore {
    private static _instance:GrowthbeatCore = null;
    private _initialized:boolean = false;

    constructor() {
        if (GrowthbeatCore._instance) {
            throw new Error('must use the getInstance');
        }
        GrowthbeatCore._instance = this;
    }

    static getInstance():GrowthbeatCore {
        if (GrowthbeatCore._instance === null) {
            GrowthbeatCore._instance = new GrowthbeatCore();
        }
        return GrowthbeatCore._instance;
    }

    initialize(applicationId:string, credentialId:string) {
        if (this._initialized) return;

        console.log('initialized: GrowthbeatCore');
        this._initialized = true;
    }
}

export = GrowthbeatCore;