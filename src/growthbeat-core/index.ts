import Client = require('./model/client');
import Uuid = require('./model/uuid');

class GrowthbeatCore {
    private client:Client = null;
    private uuid:Uuid = null;

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

        var uuid:Uuid = Uuid.create(credentialId);
        uuid.on('created', ()=> {
            this.uuid = uuid;
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
            console.log('initialized: GrowthbeatCore');
            this._initialized = true;
            callback();
        });

        client.on('error', () => {
            callback({}); // FIXME: create error
        });

    }

    fetchClient(callback:(client:Client) => void) {
        var waitClient = setInterval(() => {
            if (this.client) {
                clearInterval(waitClient);
                callback(this.client);
            }
        }, 100);
    }

    fetchUuid(callback:(uuid:Uuid) => void) {
        var waitUuid = setInterval(() => {
            if (this.uuid) {
                clearInterval(waitUuid);
                callback(this.uuid);
            }
        }, 100);
    }

}

export = GrowthbeatCore;
