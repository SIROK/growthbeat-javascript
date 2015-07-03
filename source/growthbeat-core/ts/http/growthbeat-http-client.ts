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

    request(method:string, api:string, option:any, success:Function, error:Function) {
        var paramsObj = (option.params == null) ? {} : option.params;
        var params = Object.keys(paramsObj).map((key)=> {
            return encodeURIComponent(key) + '=' + encodeURIComponent(paramsObj[key]);
        }).join('&');

        var ajaxParams:{method:string; url:string; body?:string; withCredentials?:boolean} = {
            method,
            url: this.baseUrl + api,
            withCredentials: true
        };

        if (method === 'GET') {
            ajaxParams.url = `${ajaxParams.url}?${params}`;
        } else {
            ajaxParams.body = params;
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

    jsonp(api:string, option:any, success:Function, error:Function) {
        var paramsObj = (option.params == null) ? {} : option.params;
        var params = Object.keys(paramsObj).map((key)=> {
            return encodeURIComponent(key) + '=' + encodeURIComponent(paramsObj[key]);
        });
        params.push('callback=jsonpCallback');
        params.join('&');

        var url = this.baseUrl + api + '?' + params;
        var script = document.createElement('script');
        script.async = true;
        script.src = url;
        document.body.appendChild(script);

        // TODO: handle timeout
    }
}

export = GrowthbeatHttpClient;