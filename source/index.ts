///<reference path='../local_typings/nanoajax.d.ts' />
///<reference path='../local_typings/microevent.d.ts' />

import Growthbeat = require('./growthbeat/ts/index');
import GrowthbeatCore = require('./growthbeat-core/ts/index');
import GrowthbeatAnalytics = require('./growthanalytics/ts/index');
import GrowthbeatMessage = require('./growthmessage/ts/index');

if (window) {
    window['Growthbeat'] = Growthbeat;
    window['GrowthbeatCore'] = GrowthbeatCore;
    window['GrowthbeatAnalytics'] = GrowthbeatAnalytics;
    window['GrowthbeatMessage'] = GrowthbeatMessage;
}
