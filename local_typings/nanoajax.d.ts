declare module 'nanoajax' {
    export function ajax(params:any, callback:(code:number, responseText:string)=>void):any
}
