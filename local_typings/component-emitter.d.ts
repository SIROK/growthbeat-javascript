declare class Emitter {
    constructor(obj?:any);

    on(event:string, fn:Function):Emitter;
    addEventListener(event:string, fn:Function):Emitter;
    once(event:string, fn:Function):Emitter;

    off(event:string, fn?:Function):Emitter;
    removeListener(event:string, fn?:Function):Emitter;
    removeAllListeners(event:string, fn?:Function):Emitter;
    removeEventListener(event:string, fn?:Function):Emitter;

    emit(event:string, ...args: any[]):Emitter;

    listeners(event:string):Function[];
    hasListeners(event:string):boolean;
}

declare module 'component-emitter' {
    export = Emitter;
}
