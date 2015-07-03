import nanoajax = require('nanoajax');

class GrowthbeatHttpClient {
    constructor(private baseUrl:string, private timeout:number = 0) {

    }

    get(api:string, params:any, success:Function, error:Function) {
        return this.request('GET', api, params, success, error);
    }

    post(api:string, params:any, success:Function, error:Function) {
        return this.request('POST', api, params, success, error);
    }

    put(api:string, params:any, success:Function, error:Function) {
        return this.request('PUT', api, params, success, error);
    }

    delete(api:string, params:any, success:Function, error:Function) {
        return this.request('DELETE', api, params, success, error);
    }

    request(method:string, api:string, params:any, success:Function, error:Function) {
        var body = Object.keys(params).map((key)=> {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');

        var ajaxParams:{method:string; url:string; body?:string;} = {
            method,
            url: this.baseUrl + api
        };

        if (method === 'GET') {
            ajaxParams.url = `${ajaxParams}?${body}`;
        } else {
            ajaxParams.body = body;
        }

        // TODO: handle timeout

        nanoajax.ajax(ajaxParams, (code:number, responseText:string)=> {
            if (code === 200) {
                var data = JSON.parse(responseText);
                success(data, code);
            } else {
                var err = {};
                error(err, code);
            }
        });
    }
}

export = GrowthbeatHttpClient;