module GrowthAnalytics {

    export class GrowthAnalytics {

        public static DEFAULT_BASE_URL:string = "https://analytics.growthbeat.com/";

        public static DEFAULT_NAMESPACE:string = 'Default';
        public static CUSTOM_NAMESPACE:string = 'Custom';

        private applicationId:string = null;
        private credentialId:string = null;

        private initialized:boolean = false;
        private static instance = new GrowthAnalytics();

        public static getInstance():GrowthAnalytics {
            return this.instance;
        }

        constructor() {
        }

        public initialize(applicationId:string, credentialId:string):void {

            if (!this.initialized)
                return;

            this.initialized = true;

            this.applicationId = applicationId;
            this.credentialId = credentialId;

            // FIXME merge Growthbeat
            //Growthbeat.GrowthbeatCore.initialize(applicationId, credentialId);
            // TODO client if not exists.

            this.setBasicTags();

        }

        public setBasicTags():void {
            // TODO setBasicTags
        }

        public track(name:string):void {
            this.track(GrowthAnalytics.CUSTOM_NAMESPACE, name, null, null);
        }

        public track(name:string, properties:any):void {
            this.track(GrowthAnalytics.CUSTOM_NAMESPACE, name, properties, null);
        }

        public track(name:string, option:TrackOption):void {
            this.track(GrowthAnalytics.CUSTOM_NAMESPACE, name, null, option);
        }

        public track(namespace:string, name:string, properties:any, option:TrackOption):void {

            var eventId:string = this.generateEventId(namespace, name);

            // FIXME ClientEvent.load
            if (option == TrackOption.ONCE) {
                // FIXME if clientEvent exists.
            }

            if (option == TrackOption.COUNTER) {
                // FIXME if clientEvents exists.
            }

            // FIXME merge GrowthbeatCore
            var clientId:string = 'xxxxx';
            ClientEvent.create(clientId, eventId, properties, this.credentialId, (clientEvent:ClientEvent) => {
                // FIXME clientEvent Save
            }, () => {
                // FIXME errorMessage.
               console.log('error');
            });

        }

        public tag(name:string):void {
            this.tag(GrowthAnalytics.CUSTOM_NAMESPACE, name, null);
        }

        public tag(name:string, value:string):void {
            this.tag(GrowthAnalytics.CUSTOM_NAMESPACE, name, value);
        }

        public tag(namespace:string, name:string, value:string):void {

            var tagId:string = this.generateTagId(namespace, name);

            // FIXME merge GrowthbeatCore
            var clientId:string = 'xxxxx';
            ClientTag.create(clientId, tagId, value, this.credentialId, (clientTag:ClientTag) => {
                // FIXME clientTag Save
            }, () => {
                // FIXME errorMessage.
                console.log('error');
            });

        }

        private generateEventId(namespace:string, name:string) {
            return 'Event:' + this.applicationId + ':' + namespace + ':' + name;
        }

        private generateTagId(namespace:string, name:string) {
            return 'Tag:' + this.applicationId + ':' + namespace + ':' + name;
        }

        public getApplicationId():string {
            return this.applicationId;
        }

        public getCredentialId():string {
            return this.credentialId;
        }

    }

    export enum TrackOption {
        ONCE, COUNTER
    }

}