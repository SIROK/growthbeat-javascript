import GrowthbeatHttpClient = require('./http/growthbeat-http-client');

var HTTP_CLIENT_BASE_URL = 'https://api.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;

class GrowthbeatCore {
    private static _instance:GrowthbeatCore = null;
    private _initialized:boolean = false;

    private httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

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

    initialize(applicationId:string, credentialId:string, callback:()=>void) {
        if (this._initialized) {
            callback();
            return;
        }

        // TODO: authentication

        console.log('initialized: GrowthbeatCore');
        this._initialized = true;
        callback();
    }

    getHttpClient():GrowthbeatHttpClient {
        return this.httpClient;
    }
}

export = GrowthbeatCore;