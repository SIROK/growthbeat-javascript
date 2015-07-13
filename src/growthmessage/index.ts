import GrowthAnalytics = require('../growthanalytics/index');
import Emitter = require('component-emitter');
import MessageAction = require('./actions/message-action');
import MessageStore = require('./stores/message-store');
import MessageControllerView = require('./views/message-controller-view');

class GrowthMessage {
    messageAction:MessageAction;
    messageStore:MessageStore;

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

        var emitter = new Emitter();
        this.messageAction = new MessageAction(emitter);
        this.messageStore = new MessageStore(emitter);

        GrowthAnalytics.getInstance().getEmitter().on('GrowthMessage', (eventId:string) => {
            this.messageAction.createMessage();
        });

        this.render();

        console.log('initialized: GrowthMessage');
        this._initialized = true;
    }

    render() {
        var view = new MessageControllerView(document.body, {
            context: {
                messageAction: this.messageAction,
                messageStore: this.messageStore
            }
        });
        view.render();
    }

}

export = GrowthMessage;