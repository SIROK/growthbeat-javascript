import GrowthbeatHttpClient = require('../http/growthbeat-http-client');
import Emitter = require('component-emitter');
import Application = require('./application');

var HTTP_CLIENT_BASE_URL = 'http://gbt.io/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;

var httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

class Client extends Emitter {
    private id:string;
    private application:Application;

    constructor(data?:any) {
        super();
        if (data)
            this.setData(data);
    }

    setData(data:any) {
        this.id = data.id;
        this.application = new Application(data.application);
    }

    static load():Client {
        if (!window.localStorage) {
            return null;
        }
        var clientData = window.localStorage.getItem('growthbeat:client');
        if (clientData == null) {
            return null;
        }
        return new Client(JSON.parse(clientData));
    }

    static save(data:Client) {
        if (!data || !window.localStorage) {
            return;
        }
        console.log(`save client ${JSON.stringify(data)}`);
        window.localStorage.setItem('growthbeat:client', JSON.stringify(data));
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

        httpClient.get('1/clients/create', opt,
            (data, code) => {
                console.log(data, code);
                client.setData(data);
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

    getApplication():Application {
        return this.application;
    }

}

export = Client;
