module GrowthAnalytics {

    export class ClientEvent {

        private clientId:string;
        private eventId:string;
        // FIXME data type
        private properties:any;
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

        public static create(clientId:string, eventId:string, properties:any, credentialId:string, success:(clientEvent:ClientEvent)=>void, failure:(error:any)=>void):void {

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
                if(code !== 200)
                    failure('failure');
                success(new ClientEvent(JSON.parse(responseText)));
            });

        }

        public getClientId():string {
            return this.clientId;
        }

        public setClientId(clientId:string):void {
            this.clientId = clientId;
        }

        public getEventId():string {
            return this.eventId;
        }

        public setEventId(eventId:string):void {
            this.eventId = eventId;
        }

        public getProperties():any {
            return this.properties;
        }

        public setProperties(properties:any):void {
            this.properties = properties;
        }

        public getCreated():Date {
            return this.created;
        }

        public setCreated(created:Date):void {
            this.created = created;
        }

    }

}