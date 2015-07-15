import GrowthbeatCore = require('../growthbeat-core/index');
import GrowthAnalytics = require('../growthanalytics/index');
//import GrowthMessage = require('../growthmessage/index');

interface Params {
    applicationId:string;
    credentialId:string;
}

var _initialized = false;

export function init(params:Params, callback:(err?:{})=>void) {
    if (_initialized) return;

    var applicationId = params.applicationId;
    var credentialId = params.credentialId;

    GrowthbeatCore.init(applicationId, credentialId, (err) => {
        if (err) {
            callback(err);
            return;
        }

        GrowthAnalytics.init(applicationId, credentialId);
        //GrowthMessage.init(applicationId, credentialId);
        GrowthAnalytics.setUuid();

        console.log('initialized: Growthbeat');
        _initialized = true;
        callback();
    });
}

export function start() {
    GrowthAnalytics.open();
}

export function stop() {
    GrowthAnalytics.close();
}