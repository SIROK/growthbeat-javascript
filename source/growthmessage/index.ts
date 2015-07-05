class GrowthMessage {
    private static _instance:GrowthMessage = null;
    private _initialized:boolean = false;

    constructor() {
        if (GrowthMessage._instance) {
            throw new Error('must use the getInstance');
        }
        GrowthMessage._instance = this;
    }

    static getInstance():GrowthMessage {
        if (GrowthMessage._instance === null) {
            GrowthMessage._instance = new GrowthMessage();
        }
        return GrowthMessage._instance;
    }

    initialize(applicationId:string, credentialId:string) {
        if (this._initialized) return;

        console.log('initialized: GrowthMessage');
        this._initialized = true;
    }
}

export = GrowthMessage;