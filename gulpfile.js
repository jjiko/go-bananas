'use strict';

let autoprefixer = require('autoprefixer'),
    browserify = require('gulp-browserify'),
    buffer = require('vinyl-buffer'),
    imagemin = require('gulp-imagemin'),
    gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc3'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    RevAll = require('gulp-rev-all'),
    sass = require('gulp-sass'),
    sassdoc = require('sassdoc'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

gulp.task('doc', function (cb) {
    /**
     * @see {@link http://sassdoc.com/gulp/|Sassdoc}
     */
    gulp.src(`${__dirname}/src/resources/assets/**/*.scss`)
        .pipe(sassdoc({dest: "./docs/scss"}));

    /**
     * @see {@link {@link http://usejsdoc.org/index.html|JSDoc}
     */
    gulp.src(['README.md', `${__dirname}/src/resources/assets/js/**/*.js`], {read: false})
        .pipe(jsdoc({"opts": {"destination": "./docs/js"}}, cb));
});

gulp.task('css', function () {
    gulp.src(`${__dirname}/src/resources/assets/sass/bananas.scss`)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({errLogToConsole: true}))
        .pipe(postcss([autoprefixer({browsers: ['last 2 version']})]))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${__dirname}/public/dist/css`))
        .pipe(gulp.dest(`${global.public_dist}/css`));
});
gulp.task('js', function () {
    gulp.src(`${__dirname}/src/resources/assets/js/bananas.js`)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        // Add transformation tasks to the pipeline here.
        .pipe(browserify({
            debug: true,
            insertGlobals: true,
        }))
        .pipe(rename(`${__dirname}/public/dist/js/app-bananas.js`))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${__dirname}/public/dist/js`))
        .pipe(gulp.dest(`${global.public_dist}/js`));

    // gulp.src(`${__dirname}/src/resources/assets/js/bananas.js`)
    //     .pipe(sourcemaps.init())
    //     .pipe(plumber())
    //     .pipe(uglify({preserveComments: 'license'}))
    //     .pipe(sourcemaps.write('./'))
    //     .pipe(rename(`${__dirname}/public/dist/js/app-bananas.js`))
    //     .pipe(gulp.dest(`${global.public_dist}/js`));
});
gulp.task('watch', function () {
    gulp.watch(`${__dirname}/src/resources/assets/sass/**/*.scss`, ['css']);
    gulp.watch(`${__dirname}/src/resources/assets/js/**/*.js`, ['js']);
    gulp.watch(`${__dirname}/src/resources/assets/img/**/**`, ['images']);
});

gulp.task('publish', function () {
    gulp.src(__dirname + '/public/dist/css/bananas.css')
        .pipe(gulp.dest(global.public_dist + '/css'))
        .pipe(RevAll.revision())
        .pipe(gulp.dest(global.public_dist + '/css'))
        .pipe(RevAll.manifestFile())
        .pipe(gulp.dest(global.build_assets));

    gulp.src(`${__dirname}/public/dist/js/app-bananas.js`)
        .pipe(gulp.dest(`${global.public_dist}/js`));
});

gulp.task('images', function () {
    return gulp.src('./src/resources/assets/img/**')
        .pipe(imagemin())
        .pipe(gulp.dest(`${__dirname}/public/dist/img`));
});

gulp.task('default', ['watch']);