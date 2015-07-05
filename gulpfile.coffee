#_ = require 'lodash'
gulp = require 'gulp'
sass = require 'gulp-ruby-sass'
shell = require 'gulp-shell'
#plumber = require 'gulp-plumber'
#concat = require 'gulp-concat'
#source = require 'vinyl-source-stream'
#react = require 'gulp-react'
#browserify = require 'browserify'
#watchify = require 'watchify'
#runSequence = require 'run-sequence'
#typescript = require 'gulp-typescript'
#cached = require 'gulp-cached'
#gutil = require 'gulp-util'


#gulp.task 'ts', ->
#  gulp.src ['./client/src/**/*.ts'], {base: './client'}
#  .pipe(plumber())
#  .pipe(cached('ts'))
#  .pipe typescript
##    target: 'ES5'
#    module: 'commonjs'
##    noExternalResolve: true
#  .js
#  .pipe gulp.dest './client'

gulp.task 'ts', shell.task [
  '$(npm bin)/tsc source/index.ts --target es5 --module commonjs --outDir lib'
]

gulp.task 'sass', ->
  sass('source/', {style: 'expanded'})
  .pipe(gulp.dest('lib/'))


# gulp.task 'js', ['ts', 'react'], ->
#   browserify
#     entries: ['./client/src/index.js']
#     extensions: ['.js']
#   .transform 'reactify'
#   .external(dependencies)
#   .bundle()
#   .pipe(plumber())
#   .pipe(source('build.js'))
#   .pipe(gulp.dest('./client/build'))


#gulp.task 'deploy', ->
#  gulp.src('client/build/**/*.js')
#  .pipe(gulp.dest('./public'))

#gulp.task 'watch', ['build'], ->
#  gulp.watch './client/src/**/*.ts', ['ts']
#  gulp.watch './client/src/**/*.jsx', ['react']
#  gulp.watch './client/build/**/*.js', ['deploy']

#gulp.task 'build', (callback) ->
#  runSequence ['vendor', 'js'], 'deploy', callback

gulp.task 'default', ['ts', 'sass']
