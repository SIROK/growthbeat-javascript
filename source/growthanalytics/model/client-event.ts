import nanoajax = require('nanoajax');

interface Properties {
}

class ClientEvent {

    private clientId:string;
    private eventId:string;
    // FIXME data type
    private properties:Properties;
    private created:Date;

    constructor(data?:any) {

        if (data == undefined)
            return;

        this.clientId = data.clientId;
        this.eventId = data.eventId;
        this.properties = data.properties;
        // FIXME DateUtils.foramt();
        this.created = data.created;

    }

    static create(clientId:string, eventId:string, properties:any, credentialId:string, success:(clientEvent:ClientEvent)=>void, failure:(error:any)=>void):void {

        // FIXME if value is null
        // FIXME merge GrowthbeatCore
        nanoajax.ajax({
            url: 'https://api.analytics.growthbeat.com/1/clients/',
            method: 'POST',
            body: 'clientId=' + clientId
            + '&eventId=' + eventId
            + '&properties=' + properties
            + '&credentialId=' + credentialId
        }, (code:number, responseText:string)=> {
            if (code !== 200)
                failure('failure');
            success(new ClientEvent(JSON.parse(responseText)));
        });

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

    setProperties(properties:any) {
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

