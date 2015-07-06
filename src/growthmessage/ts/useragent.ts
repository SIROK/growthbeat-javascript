/// <reference path="events.ts" />

module GrowthMessage {
    export class UserAgent extends GrowthMessage.Events {
        UA:string = window.navigator.userAgent.toLowerCase();

        constructor(){
            super();
        }
        isViewable():boolean {
            var is = (text:string):boolean=>{
                return this.UA.indexOf(text) != -1;
            };
            return (
                is('iphone os 6_') ||
                is('iphone os 7_') ||
                is('iphone os 8_') ||
                is('iphone os 9_') ||
                is('iphone os 10_') ||
                (is('android 4.') && is('mobile safari')) ||
                (is('android 5.') && is('mobile safari')) ||
                (is('android 6.') && is('mobile safari'))
            );
        }
    }
}
