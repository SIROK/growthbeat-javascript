///<reference path='../local_typings/nanoajax.d.ts' />
///<reference path='../local_typings/component-emitter.d.ts' />
///<reference path='../local_typings/t.d.ts' />

import Growthbeat = require('./growthbeat/index');
import GrowthbeatCore = require('./growthbeat-core/index');
import GrowthbeatAnalytics = require('./growthanalytics/index');
import GrowthbeatMessage = require('./growthmessage/index');

declare var global:any;

global.Growthbeat = Growthbeat;
global.GrowthbeatCore = GrowthbeatCore;
global.GrowthbeatAnalytics = GrowthbeatAnalytics;
global.GrowthbeatMessage = GrowthbeatMessage;
