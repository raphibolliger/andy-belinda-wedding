/* Needed gulp config */
//var gulp = require('gulp');  
// var sass = require('gulp-sass');
// var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
// var notify = require('gulp-notify');
// var minifycss = require('gulp-minify-css');
// var concat = require('gulp-concat');
// var plumber = require('gulp-plumber');
// var browserSync = require('browser-sync');
// var reload = browserSync.reload;
// const sourcemaps = require('gulp-sourcemaps');

import gulp from 'gulp';
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import minifycss from 'gulp-minify-css';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';

var sass = gulpSass(dartSass);
var reload = browserSync.reload;

/* Setup scss path */
var paths = {
    scss: './sass/*.scss'
};

/* Scripts task */
gulp.task('scripts', async function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'js/vendor/jquery.min.js',
    'js/vendor/jquery.easing.1.3.js',
    'js/vendor/jquery.stellar.min.js',
    'js/vendor/jquery.flexslider-min.js',
    'js/vendor/bootstrap.min.js',
    'js/vendor/jquery.waypoints.min.js',
    'js/vendor/jquery.magnific-popup.min.js',
    'js/vendor/simplyCountdown.min.js',
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

gulp.task('minify-custom', async function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'js/custom.js'
    ])
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

/* Sass task */
gulp.task('sass', async function () {  
    gulp.src('scss/style.scss')
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,

      //outputStyle: 'compressed',
      // outputStyle: 'compact',
      // outputStyle: 'nested',
      outputStyle: 'expanded',
      precision: 10
    }))

    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        //browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('css'))

    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

gulp.task('merge-styles', async function () {

    return gulp.src([
        'css/vendor/bootstrap.min.css',
        'css/vendor/animate.css',
        'css/vendor/magnific-popup.css',
        'css/vendor/flexslider.css',
        'fonts/icomoon/style.css',
        ])
        // .pipe(sourcemaps.init())
        // .pipe(autoprefixer({
        //     browsers: ['last 2 versions'],
        //     cascade: false
        // }))
        .pipe(concat('styles-merged.css'))
        .pipe(gulp.dest('css'))
        // .pipe(rename({suffix: '.min'}))
        // .pipe(minifycss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}));
});

/* Reload task */
gulp.task('bs-reload', async function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', async function() {
    browserSync.init(['css/*.css', 'js/*.js'], {
        
        proxy: 'localhost/probootstrap/wedding'
        /* For a static server you would use this: */
        /*
        server: {
            baseDir: './'
        }
        */
    });
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', gulp.series('sass', 'scripts', 'minify-custom', 'browser-sync'), async function () {
    /* Watch scss, run the sass task on change. */
    //gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['sass'])
    /* Watch app.js file, run the scripts task on change. */
    //gulp.watch(['js/custom.js'], ['minify-custom'])
    /* Watch .html files, run the bs-reload task on change. */
    //gulp.watch(['*.html'], ['bs-reload']);
});