import GrowthbeatHttpClient = require('../http/growthbeat-http-client');
import Emitter = require('component-emitter');

var HTTP_CLIENT_BASE_URL = 'http://gbt.io/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;

var httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

class Uuid extends Emitter {
    private uuid:string;

    constructor(data?:any) {
        super();
        this.uuid = data.uuid;
    }

    static load():Client {
        if (!window.localStorage) {
            return null;
        }
        var uuidData = window.localStorage.getItem('growthbeat:uuid');
        if (clientData == null) {
            return null;
        }
        return new Uuid(JSON.parse(uuidData));
    }

    static save(data:Uuid) {
        if (!data || !window.localStorage) {
            return;
        }
        window.localStorage.setItem('growthbeat:uuid', JSON.stringify(data));
    }

    static create(applicationId:string, credentialId:string):Client {
        var opt = {
            params: {},
            dataType: 'jsonp'
        };

        var uuid = new Uuid();

        httpClient.get('1/uuid/create', opt,
            (data, code) => {
                console.log(data, code);
                uuid.emit('created');
            },
            (err, code) => {
                client.emit('error');
            });

        return uuid;
    }

    getUuid():string {
        return this.uuid;
    }

}

export = Uuid;
