///<reference path='../local_typings/nanoajax.d.ts' />

import Growthbeat = require('./growthbeat/ts/growthbeat');
import GrowthbeatCore = require('./growthbeat-core/ts/growthbeat-core');
import GrowthbeatAnalytics = require('./growthanalytics/ts/index');

if (window) {
    window['Growthbeat'] = Growthbeat;
    window['GrowthbeatCore'] = GrowthbeatCore;
    window['GrowthbeatAnalytics'] = GrowthbeatAnalytics;
}
