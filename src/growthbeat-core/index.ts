import Client = require('./model/client');
import Uuid = require('./model/uuid');
import GrowthAnalytics = require('../growthanalytics/index');

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

    initialize(applicationId:string, credentialId:string, callback:(err?:{}) => void) {
        if (this._initialized) {
            callback();
            return;
        }

        var uuid:Uuid = Uuid.create();
        uuid.on('created', ()=> {
          Uuid.save(uuid);
          this.createClient(applicationId, credentialId, uuid.getUuid(), callback);
        });

        uuid.on('error', ()=> {
          callback({}); //FIXME: create error
        });

    }

    private createClient(applicationId:string, credentialId:string, uuid:string, callback:(err?:{})=> void) {

        var client = Client.load();
        if (client != null) {
            this.client = client;
            callback();
            return;
        }

        client = Client.create(applicationId, credentialId);
        client.on('created', () => {
            Client.save(client);

            GrowthAnalytics.getInstance().tag({
                name: 'UUID',
                value: uuid
            });

            console.log('initialized: GrowthbeatCore');
            this._initialized = true;
            callback();
        });

        client.on('error', () => {
            callback({}); // FIXME: create error
        });

    }

    getClient():Client {
        return this.client;
    }
}

export = GrowthbeatCore;
