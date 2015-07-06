import GrowthbeatHttpClient = require('../growthbeat-core/http/growthbeat-http-client');
import GrowthAnalytics = require('../growthanalytics/index');
import MessageView = require('./view/message-view');

//var HTTP_CLIENT_BASE_URL = 'https://api.message.growthbeat.com/';
var HTTP_CLIENT_BASE_URL = 'http://localhost:8000/'
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

        this.httpClient.get('sample/json/image-0button.json', {},
            (data, code) => {
                console.log(data, code);
                this.loadImages(data, () => {
                    console.log('image loaded');
                });
            },
            (err, code) => {
                console.log(err, code);
            });
        this.openMessage();
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

        urls.forEach((url)=> {
            var img:HTMLImageElement = document.createElement('img');
            img.onload = ()=> {
                callback()
            };
            img.onerror = ()=> {
                callback()
            };
            img.src = url;
        });
    }

    openMessage() {
        new MessageView();
    }

    getHttpClient():GrowthbeatHttpClient {
        return this.httpClient;
    }
}

export = GrowthMessage;