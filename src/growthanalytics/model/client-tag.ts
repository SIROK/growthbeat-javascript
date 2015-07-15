import HttpClient = require('../../growthbeat-core/http/http-client');
import Emitter = require('component-emitter');

var HTTP_CLIENT_BASE_URL = 'https://analytics.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;

var httpClient = new HttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

interface Data {
    clientId:string;
    tagId:string;
    value:string;
}

class ClientTag extends Emitter {

    private clientId:string;
    private tagId:string;
    private value:string;

    constructor(data?:Data) {
        super();
        if (data != null) this.setData(data);
    }

    setData(data:Data) {
        this.clientId = data.clientId;
        this.tagId = data.tagId;
        this.value = data.value;
    }

    static load(tagId:string):ClientTag {
        if (!window.localStorage) {
            return null;
        }

        var clientTagData = window.localStorage.getItem(`growthanalytics:${tagId}`);
        if (clientTagData == null) {
            return null;
        }
        return new ClientTag(JSON.parse(clientTagData));
    }

    static save(data:ClientTag) {
        if (!data || !window.localStorage) return;
        var _data:Data = <Data>{
            clientId: data.clientId,
            tagId: data.tagId,
            value: data.value
        };
        window.localStorage.setItem(`growthanalytics:${data.getTagId()}`, JSON.stringify(_data));
    }

    static create(clientId:string, tagId:string, value:string, credentialId:string):ClientTag {
        var opt = {
            params: {
                clientId,
                tagId,
                value,
                credentialId
            },
            dataType: 'jsonp'
        };

        var clientTag = new ClientTag();

        // FIXME if value is null
        httpClient.get('1/client_tags/create', opt,
            (data, code) => {
                console.log(data, code);
                clientTag.setData(data);
                clientTag.emit('created');
            },
            (err, code) => {
                clientTag.emit('error');
            });

        return clientTag;
    }

    getClientId():string {
        return this.clientId;
    }

    setClientId(clientId:string) {
        this.clientId = clientId;
    }

    getTagId():string {
        return this.tagId;
    }

    setTagId(tagId:string) {
        this.tagId = tagId;
    }

    getValue():string {
        return this.value;
    }

    setValue(value:string) {
        this.value = value;
    }
}

export = ClientTag;

