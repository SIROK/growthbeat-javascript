import GrowthAnalytics = require('../growthanalytics/index');
import Emitter = require('component-emitter');
import MessageAction = require('./actions/message-action');
import MessageStore = require('./stores/message-store');
import MessageControllerView = require('./views/message-controller-view');

var _initialized = false;

var _messageAction:MessageAction = null;
var _messageStore:MessageStore = null;

var _render = () => {
    var view = new MessageControllerView(document.body, {
        context: {
            messageAction: _messageAction,
            messageStore: _messageStore
        }
    });
    view.render();
};

export function init(applicationId:string, credentialId:string) {
    if (_initialized) return;

    var emitter = new Emitter();
    _messageAction = new MessageAction(emitter);
    _messageStore = new MessageStore(emitter);

    GrowthAnalytics.getEmitter().on('GrowthMessage', (eventId:string) => {
        _messageAction.createMessage();
    });

    _render();

    console.log('initialized: GrowthMessage');
    _initialized = true;
}
