declare class MicroEvent {
    bind(event:string, listener:Function):any;
    unbind(event:string, listener:Function):any;
    trigger(event:string, ...args: any[]);
}

declare module 'microevent' {
    export = MicroEvent;
}
