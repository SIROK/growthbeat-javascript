import Growthbeat = require('./growthbeat/ts/growthbeat');
import GrowthbeatCore = require('./growthbeat-core/ts/growthbeat-core');

if (window) {
    window['Growthbeat'] = Growthbeat;
    window['GrowthbeatCore'] = GrowthbeatCore;
}
