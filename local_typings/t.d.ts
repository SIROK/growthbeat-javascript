declare class t {
    constructor(template:string);

    render(params:{}):string;
}

declare module 't' {
    export = t;
}
