import HttpClient = require('../../growthbeat-core/http/http-client');

//var HTTP_CLIENT_BASE_URL = 'https://api.message.growthbeat.com/';
var HTTP_CLIENT_BASE_URL = 'http://localhost:8000/';
var HTTP_CLIENT_TIMEOUT = 10 * 1000;

var httpClient = new HttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

var deepExtract = (input:{}, name:string, output = []):string[] => {
    Object.keys(input).forEach((key)=> {
        if (key === name) {
            output.push(input[key].url);
        } else if (input[key] instanceof Object) {
            output = deepExtract(input[key], name, output);
        }
    });
    return output;
};

var loadImages = (urls, callback) => {
    var count = 0;

    if (0 >= urls.length) {
        callback();
    }

    urls.forEach((url)=> {
        var img:HTMLImageElement = document.createElement('img');
        img.onload = ()=> {
            if (++count === urls.length) {
                callback();
            }
        };
        img.onerror = ()=> {
            if (++count === urls.length) {
                callback();
            }
        };
        img.src = url;
    });
};


class MessageAction {
    private dispatch:Function;

    constructor(emitter) {
        this.dispatch = emitter.emit.bind(emitter);
    }

    createMessage() {
        httpClient.get('sample/json/image-2buttons.json', {},
            (data, code) => {
                console.log(data, code);
                var urls = deepExtract(data, 'picture');

                loadImages(urls, () => {
                    this.dispatch('createMessage', {
                        data: data
                    });
                });
            },
            (err, code) => {
                console.log(err, code);
            });
    }

    closeMessage() {
        this.dispatch('closeMessage', {});
    }
}

export = MessageAction;