import GrowthbeatHttpClient = require('../growthbeat-core/http/growthbeat-http-client');
import GrowthAnalytics = require('../growthanalytics/index');

var HTTP_CLIENT_BASE_URL = 'https://api.message.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 10 * 1000;

class GrowthMessage {
    private httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

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

        GrowthAnalytics.getInstance().getEmitter().on('GrowthMessage', (eventId:string) => {
            this.recevieMessage(eventId);
        });

        console.log('initialized: GrowthMessage');
        this._initialized = true;
    }

    recevieMessage(eventId:string) {
        console.log('recevieMessage');
    }

    getHttpClient():GrowthbeatHttpClient {
        return this.httpClient;
    }
}

export = GrowthMessage;