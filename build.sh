#!/usr/bin/env sh
./node_modules/.bin/tsc source/index.ts --target es5 --module commonjs
./node_modules/.bin/browserify source/index.js -o growthbeat.js