import GrowthbeatHttpClient = require('../../growthbeat-core/http/growthbeat-http-client');
import Emitter = require('component-emitter');

var HTTP_CLIENT_BASE_URL = 'https://analytics.growthbeat.com/';
var HTTP_CLIENT_TIMEOUT = 60 * 1000;

var httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

interface Properties {key?:string
}

class ClientEvent extends Emitter {

    private clientId:string;
    private eventId:string;
    private properties:Properties;
    private created:Date;

    constructor(data?:any) {
        super();
        if (data != null) this.setData(data);
    }

    setData(data:any) {
        this.clientId = data.clientId;
        this.eventId = data.eventId;
        this.properties = data.properties;
        this.created = new Date(data.created);
    }

    static load(eventId:string):ClientEvent {
        if (!window.localStorage) {
            return null;
        }

        var clientEventData = window.localStorage.getItem(`growthanalytics:${eventId}`);
        if (clientEventData == null) {
            return null;
        }
        return new ClientEvent(JSON.parse(clientEventData));
    }

    static save(data:ClientEvent) {
        if (!data || !window.localStorage) {
            return;
        }
        window.localStorage.setItem(`growthanalytics:${data.getEventId}`, JSON.stringify(data));
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

    public getCreated():Date {
        return this.created;
    }

    setCreated(created:Date) {
        this.created = created;
    }

}

export = ClientEvent;

