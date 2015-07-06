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
uglify = require 'gulp-uglify'
source = require 'vinyl-source-stream'

gulp.task 'ts', shell.task [
  '$(npm bin)/tsc src/index.ts --target es5 --module commonjs --outDir lib'
]

gulp.task 'html', ->
  gulp.src('src/**/*.html')
  .pipe(minifyHTML({}))
  .pipe(gulp.dest('lib'))

gulp.task 'css', ->
  sass('src/', {style: 'expanded'})
  .pipe(minifyCss())
  .pipe(gulp.dest('lib/'))

gulp.task 'gfi', ['html', 'css', 'ts'], ->
  gulp.src('lib/**/*.js')
  .pipe(gfi({
      '/* STYLES */': 'lib/growthmessage/styles/styles.css'
    }))
  .pipe(gulp.dest('lib/'));

gulp.task 'js', ['gfi'], ->
  browserify
    entries: ['./lib/index.js']
    extensions: ['.js']
  .bundle()
  .pipe(plumber())
  .pipe(source('growthbeat.js'))
  .pipe(gulp.dest('./'))
  .pipe(streamify(uglify()))
  .pipe(rename({extname: '.min.js'}))
  .pipe(gulp.dest('./'))

gulp.task 'clean', shell.task [
  'rm -rf lib/*'
]

gulp.task 'build', ['js']
gulp.task 'default', ['build']
