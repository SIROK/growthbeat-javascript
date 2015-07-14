import GrowthbeatHttpClient = require('../http/growthbeat-http-client');
import Emitter = require('component-emitter');

var HTTP_CLIENT_BASE_URL = 'https://api.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;

var httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

class Client extends Emitter {
    private id:string;

    constructor(data?:any) {
        super();
    }

    static load():Client {
        if (!window.localStorage) {
            return null;
        }
        // TODO: load client from LocalStorage
        var clientData = window.localStorage.getItem('growthbeat_client'); // FIXME: rename key name
        if (clientData == null) {
            return null;
        }
        return new Client(JSON.parse(clientData));
    }

    static save(data:any) {
        if (!window.localStorage) {
            return;
        }
        // TODO: set client to LocalStorage
    }

    static create(applicationId:string, credentialId:string):Client {
        var opt = {
            params: {
                applicationId,
                credentialId
            },
            dataType: 'jsonp'
        };

        var client = new Client();

        // TODO: authentication request
        httpClient.get('1/clients', opt,
            (data, code) => {
                console.log(data, code);
                client.emit('created');
            },
            (err, code) => {
                client.emit('error');
            });

        return client;
    }

    getId():string {
        return this.id;
    }

}

export = Client;