'use strict';

import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import pug from 'gulp-pug';
import browser_Sync from 'browser-sync';
import runSequence from 'run-sequence';

var browserSync = browser_Sync.create();

const paths = {
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/assets/js'
    },
    styles: {
        src: 'src/sass/**/*.scss',
        dest: 'dist/assets/css/'
    },
    pug: {
        index: 'src/index.pug',
        src: 'src/**/*.pug',
        dest: 'dist/'
    },
    images: {
        src: 'src/img/**/*.*',
        dest: 'dist/assets/img'
    },
    fonts: 'src/fonts/*'
};

gulp.task('clean:dist', () => {
    return del.sync('dist');
});

gulp.task('sass', () => {
    return gulp.src(paths.styles.src)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
});

gulp.task('pug', () => {
    return gulp.src(paths.pug.index)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(browserSync.stream());
});

gulp.task('copy', () => {

    gulp.src('bower_components/bootstrap/dist/css/*.min.css').pipe(gulp.dest('dist/assets/css'));
    gulp.src('bower_components/bootstrap/dist/fonts/*.*').pipe(gulp.dest('dist/assets/fonts'));
    gulp.src('bower_components/bootstrap/dist/js/*.js').pipe(gulp.dest('dist/assets/js'));

    gulp.src('bower_components/jquery/dist/*.js').pipe(gulp.dest('dist/assets/js'));

    gulp.src(paths.scripts.src).pipe(gulp.dest(paths.scripts.dest));

    gulp.src(paths.images.src, {dot: true})
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream());
});

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('watch', () => {
    gulp.watch(paths.styles.src, ['sass']);
    gulp.watch(paths.pug.src, ['pug']);
});

gulp.task('build', () => {
    runSequence(['clean:dist', 'sass', 'pug', 'copy']);
});

gulp.task('default', () => {
    runSequence(['build', 'serve', 'watch']);
});