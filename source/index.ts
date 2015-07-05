///<reference path='../local_typings/nanoajax.d.ts' />
///<reference path='../local_typings/component-emitter.d.ts' />

import Growthbeat = require('./growthbeat/index');
import GrowthbeatCore = require('./growthbeat-core/index');
import GrowthbeatAnalytics = require('./growthanalytics/index');
import GrowthbeatMessage = require('./growthmessage/index');

if (window) {
    window['Growthbeat'] = Growthbeat;
    window['GrowthbeatCore'] = GrowthbeatCore;
    window['GrowthbeatAnalytics'] = GrowthbeatAnalytics;
    window['GrowthbeatMessage'] = GrowthbeatMessage;
}
