import GrowthbeatHttpClient = require('../growthbeat-core/http/growthbeat-http-client');
import GrowthAnalytics = require('../growthanalytics/index');
import MessageView = require('./view/message-view');

//var HTTP_CLIENT_BASE_URL = 'https://api.message.growthbeat.com/';
var HTTP_CLIENT_BASE_URL = 'http://localhost:8000/';
var HTTP_CLIENT_TIMEOUT = 10 * 1000;

class GrowthMessage {
    private httpClient = new GrowthbeatHttpClient(HTTP_CLIENT_BASE_URL, HTTP_CLIENT_TIMEOUT);

    private static _instance:GrowthMessage = null;
    private _initialized:boolean = false;

    constructor() {
        if (GrowthMessage._instance) {
            throw new Error('must use the getInstance');
        }
        GrowthMessage._instance = this;
    }

    static getInstance():GrowthMessage {
        if (GrowthMessage._instance === null) {
            GrowthMessage._instance = new GrowthMessage();
        }
        return GrowthMessage._instance;
    }

    initialize(applicationId:string, credentialId:string) {
        if (this._initialized) return;

        GrowthAnalytics.getInstance().getEmitter().on('GrowthMessage', (eventId:string) => {
            this.recevieMessage(eventId);
        });

        console.log('initialized: GrowthMessage');
        this._initialized = true;
    }

    recevieMessage(eventId:string) {
        console.log('recevieMessage');

        this.httpClient.get('sample/json/image-2buttons.json', {},
            (data, code) => {
                console.log(data, code);
                this.loadImages(data, () => {
                    console.log('image loaded');
                    this.openMessage(data);
                });
            },
            (err, code) => {
                console.log(err, code);
            });
    }

    loadImages(data, callback) {
        console.log('loadImages');
        var deepExtract = (input:{}, name:string, output = []):string[] => {
            Object.keys(input).forEach((key)=> {
                if (key === 'picture') {
                    output.push(input[key].url);
                } else if (input[key] instanceof Object) {
                    output = deepExtract(input[key], name, output);
                }
            });
            return output;
        };
        var urls = deepExtract(data, 'picture');

        if (0 >= urls.length) {
            callback();
            return
        }

        var count = 0;

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
    }

    openMessage(data) {
        var messageView = new MessageView();
        messageView.open(data);
    }

    getHttpClient():GrowthbeatHttpClient {
        return this.httpClient;
    }
}

export = GrowthMessage;