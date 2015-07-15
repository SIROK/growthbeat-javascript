import HttpClient = require('../http/http-client');
import Emitter = require('component-emitter');

var HTTP_CLIENT_BASE_URL = 'http://gbt.io/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;

var httpClient = new HttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

class Uuid extends Emitter {
    private uuid:string;

    constructor(data?:any) {
        super();
        if (data)
            this.setData(data);
    }

    setData(data:any) {
        this.uuid = data.uuid;
    }

    static load():Uuid {
        if (!window.localStorage) {
            return null;
        }
        var uuidData = window.localStorage.getItem('growthbeat:uuid');
        if (uuidData == null) {
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

    static create(credentialId:string):Uuid {
        var opt = {
            params: {
                credentialId
            },
            dataType: 'jsonp'
        };

        var uuid = new Uuid();

        httpClient.get('1/uuid/create', opt,
            (data, code) => {
                console.log(data, code);
                uuid.setData(data);
                uuid.emit('created');
            },
            (err, code) => {
                uuid.emit('error');
            });

        return uuid;
    }

    getUuid():string {
        return this.uuid;
    }

}

export = Uuid;
