import Client = require('./model/client');
import Uuid = require('./model/uuid');

var _initialized = false;
var _client:Client = null;
var _uuid:Uuid = null;

var _createClient = (applicationId:string, credentialId:string, uuid:string, callback:(err?:{})=> void) => {
    var client = Client.load();
    if (client != null && client.getApplication().id == applicationId) {
        _client = client;
        callback();
        return;
    }

    client = Client.create(applicationId, credentialId);
    client.on('created', () => {
        _client = client;
        Client.save(client);
        console.log('initialized: GrowthbeatCore');
        _initialized = true;
        callback();
    });

    client.on('error', () => {
        callback({}); // FIXME: create error
    });
};

export function init(applicationId:string, credentialId:string, callback:(err?:{}) => void) {
    if (_initialized) {
        callback();
        return;
    }

    var uuid:Uuid = Uuid.create(credentialId);
    uuid.on('created', ()=> {
        _uuid = uuid;
        Uuid.save(uuid);
        _createClient(applicationId, credentialId, uuid.getUuid(), callback);
    });

    uuid.on('error', ()=> {
        callback({}); //FIXME: create error
    });
}

export function getClient():Client {
    return _client;
}

export function getCUuid():Uuid {
    return _uuid;
}




