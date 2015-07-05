import nanoajax = require('nanoajax');

interface Options {
    params?:{key?: string;};
    dataType?:string;
    cors?:boolean;
}

class GrowthbeatHttpClient {
    constructor(private baseUrl:string, private timeout:number = 0) {

    }

    get(api:string, options:Options, success:Function, error:Function) {
        return this._request('GET', api, options, success, error);
    }

    post(api:string, options:Options, success:Function, error:Function) {
        return this._request('POST', api, options, success, error);
    }

    put(api:string, options:Options, success:Function, error:Function) {
        return this._request('PUT', api, options, success, error);
    }

    delete(api:string, options:Options, success:Function, error:Function) {
        return this._request('DELETE', api, options, success, error);
    }

    _request(method:string, api:string, options:Options, success:Function, error:Function) {
        if (options.dataType === 'jsonp') {
            this._requestByJsonp('GET', api, options, success, error);
        } else {
            this._requestByXhr(method, api, options, success, error);
        }
    }

    _requestByJsonp(method:string, api:string, options:Options, success:Function, error:Function) {
        var params = this._makeParamsArray(options.params);
        var jsonpCallbackName = 'jsonpCallback';

        params = params.concat('callback=' + jsonpCallbackName);

        var url = this.baseUrl + api + '?' + params.join('&');

        var script = document.createElement('script');
        script.async = true;
        script.src = url;

        window[jsonpCallbackName] = (data) => {
            delete window[jsonpCallbackName];
            success(data, 200);
        };

        script.onerror = (err) => {
            console.log('script error', err);
            error();
        };

        document.body.appendChild(script);
    }

    _requestByXhr(method:string, api:string, options:Options, success:Function, error:Function) {
        var params = this._makeParamsArray(options.params);

        var nanoParams:{method:string; url:string; body?:string; withCredentials?:boolean} = {
            method,
            url: this.baseUrl + api,
            withCredentials: (options.cors === true)
        };

        if (method === 'GET') {
            nanoParams.url = nanoParams.url + '?' + params.join('&');
        } else {
            nanoParams.body = params.join('&');
        }

        // TODO: handle timeout

        nanoajax.ajax(nanoParams, (code:number, responseText:string)=> {
            if (code === 200) {
                var data = JSON.parse(responseText);
                success(data, code);
            } else {
                var err = {};
                error(err, code);
            }
        });
    }

    _makeParamsArray(obj: {key?: string;}):string[] {
        var paramsObj = (obj == null) ? {} : obj;
        var params = Object.keys(paramsObj).map((key)=> {
            return encodeURIComponent(key) + '=' + encodeURIComponent(paramsObj[key]);
        });
        return params;
    }
}

export = GrowthbeatHttpClient;