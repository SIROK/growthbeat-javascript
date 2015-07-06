import GrowthbeatHttpClient = require('./http/growthbeat-http-client');
import Client = require('./model/client');

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
        var client = Client.create();
        client.on('created', () => {
            console.log('created');
        });

        client.on('error', () => {
            console.log('error');
        });

        var opt = {
            params: {
                applicationId,
                credentialId
            },
            dataType: 'jsonp'
            //cors: true
        };

        this.httpClient.get('1/clients', opt,
            (data, code) => {
                console.log(data, code);
                client.emit('created');
            },
            (err, code) => {
                client.emit('error');
            });

        console.log('initialized: GrowthbeatCore');
        this._initialized = true;
        callback();
    }

    getHttpClient():GrowthbeatHttpClient {
        return this.httpClient;
    }
}

export = GrowthbeatCore;