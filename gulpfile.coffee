browserify = require 'browserify'
gulp = require 'gulp'
gfi = require 'gulp-file-insert'
minifyCss = require 'gulp-minify-css'
minifyHTML = require 'gulp-minify-html'
plumber = require 'gulp-plumber'
rename = require 'gulp-rename'
sass = require 'gulp-ruby-sass'
shell = require 'gulp-shell'
streamify = require 'gulp-streamify'
stripDebug = require 'gulp-strip-debug'
uglify = require 'gulp-uglify'
webserver = require 'gulp-webserver'
source = require 'vinyl-source-stream'

gulp.task 'ts', shell.task [
  '$(npm bin)/tsc src/index.ts --target es5 --module commonjs --outDir lib'
]

gulp.task 'html', ->
  gulp.src('src/**/*.html')
  .pipe(minifyHTML({}))
  .pipe(gulp.dest('lib/'))

gulp.task 'css', ->
  sass('src/', {style: 'expanded'})
  .pipe(minifyCss())
  .pipe(gulp.dest('lib/'))

gulp.task 'gfi', ['html', 'css', 'ts'], ->
  gulp.src('lib/growthmessage/views/message-controller-view.js')
  .pipe(gfi({
      '/* STYLES */': 'lib/growthmessage/styles/styles.css'
    }))
  .pipe(gulp.dest('lib/growthmessage/views/'));

  gulp.src('lib/growthmessage/views/dialog-view.js')
  .pipe(gfi({
      '/* TEMPLATE_DIALOG_PLAIN */': 'lib/growthmessage/templates/dialog-text.html',
      '/* TEMPLATE_DIALOG_IMAGE */': 'lib/growthmessage/templates/dialog-image.html'
    }))
  .pipe(gulp.dest('lib/growthmessage/views/'));

gulp.task 'js', ['gfi'], ->
  browserify
    entries: ['./lib/index.js']
    extensions: ['.js']
  .bundle()
  .pipe(plumber())
  .pipe(source('growthbeat.js'))
  .pipe(gulp.dest('./'))
  .pipe(streamify(stripDebug()))
  .pipe(streamify(uglify()))
  .pipe(rename({extname: '.min.js'}))
  .pipe(gulp.dest('./'))

gulp.task 'clean', shell.task [
  'rm -rf lib/*'
]

gulp.task 'watch', ->
  gulp.watch 'src/**/*', ['build']

gulp.task 'webserver', ->
  gulp.src './'
  .pipe webserver
    livereload:
      enable: true
      filter: (path) -> /growthbeat\.js/.test path

gulp.task 'build', ['js']
gulp.task 'dev', ['watch', 'webserver']
gulp.task 'default', ['build']
