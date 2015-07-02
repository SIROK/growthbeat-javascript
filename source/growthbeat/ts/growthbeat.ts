class Growthbeat {
    private static _instance:Growthbeat = null;

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
        console.log('initialized');
        // TODO: initialze GrowthbeatCore
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