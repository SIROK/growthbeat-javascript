#!/usr/bin/env sh
./node_modules/.bin/tsc source/index.ts --target es5 --module commonjs --outDir lib
./node_modules/.bin/browserify lib/index.js -o growthbeat.js