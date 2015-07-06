module GrowthMessage {
    export class Events {
        events = {};

        on(eventName:string, callbackName:string, thisArg?:any){
            this.events[eventName] = {
                callbackName : callbackName,
                thisArg : thisArg
            };
        }
        trigger(eventName:string, arg?:any){
            var event = this.events[eventName];
            if(!event) return;
            var thisArg = event.thisArg ? event.thisArg : this;
            thisArg[event.callbackName](arg);
        }
    }
}
