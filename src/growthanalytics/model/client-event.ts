import HttpClient = require('../../growthbeat-core/http/http-client');
import Emitter = require('component-emitter');

var HTTP_CLIENT_BASE_URL = 'https://analytics.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;

var httpClient = new HttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

interface Properties {key?:string}

interface Data {
    clientId:string;
    eventId:string;
    properties:Properties;
}

class ClientEvent extends Emitter {

    private clientId:string;
    private eventId:string;
    private properties:Properties;

    constructor(data?:Data) {
        super();
        if (data != null) this.setData(data);
    }

    setData(data:Data) {
        this.clientId = data.clientId;
        this.eventId = data.eventId;
        this.properties = data.properties;
    }

    static load(eventId:string):ClientEvent {
        if (!window.localStorage) return null;
        var clientEventData = window.localStorage.getItem(`growthanalytics:${eventId}`);
        if (clientEventData == null) return null;
        return new ClientEvent(JSON.parse(clientEventData));
    }

    static save(data:ClientEvent) {
        if (!data || !window.localStorage) return;
        var _data:Data = <Data>{
            clientId: data.clientId,
            eventId: data.eventId,
            properties: data.properties
        };
        window.localStorage.setItem(`growthanalytics:${data.getEventId()}`, JSON.stringify(_data));
    }

    static create(clientId:string, eventId:string, properties:Properties, credentialId:string):ClientEvent {

        var opt = {
            params: {
                clientId,
                eventId,
                parameters: (properties) ? properties : {},
                credentialId
            },
            dataType: 'jsonp'
        };

        var clientEvent = new ClientEvent();

        httpClient.get('1/client_events/create', opt,
            (data, code) => {
                console.log(data, code);
                clientEvent.setData(data);
                clientEvent.emit('created');
            },
            (err, code) => {
                clientEvent.emit('error');
            });

        return clientEvent;
    }

    getClientId():string {
        return this.clientId;
    }

    setClientId(clientId:string) {
        this.clientId = clientId;
    }

    getEventId():string {
        return this.eventId;
    }

    setEventId(eventId:string) {
        this.eventId = eventId;
    }

    getProperties():Properties {
        return this.properties;
    }

    setProperties(properties:Properties) {
        this.properties = properties;
    }
}

export = ClientEvent;

