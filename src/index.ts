///<reference path='../local_typings/nanoajax.d.ts' />
///<reference path='../local_typings/component-emitter.d.ts' />
///<reference path='../local_typings/t.d.ts' />

import Growthbeat = require('./growthbeat/index');
import GrowthAnalytics = require('./growthanalytics/index');
import GrowthMessage = require('./growthmessage/index');

declare var global:any;

global.Growthbeat = Growthbeat;
global.GrowthAnalytics = GrowthAnalytics;
global.GrowthMessage = GrowthMessage;
