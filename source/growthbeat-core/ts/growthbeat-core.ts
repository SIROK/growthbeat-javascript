class GrowthbeatCore {
    private static _instance:GrowthbeatCore = null;

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
        console.log('initialized: GrowthbeatCore');
    }
}

export = GrowthbeatCore;