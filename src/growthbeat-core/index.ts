import Client = require('./model/client');

class GrowthbeatCore {
    private client:Client = null;

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

    initialize(applicationId:string, credentialId:string, callback:() => void) {
        if (this._initialized) {
            callback();
            return;
        }

        var client = Client.load();
        if (client != null) {
            this.client = client;
            callback();
            return;
        }

        client = Client.create(applicationId, credentialId);
        client.on('created', () => {
            Client.save({});

            console.log('initialized: GrowthbeatCore');
            this._initialized = true;
            callback();
        });

        client.on('error', () => {
            callback(); // FIXME: create error
        });
    }

    getClient():Client {
        return this.client;
    }
}

export = GrowthbeatCore;