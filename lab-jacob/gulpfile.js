'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

gulp.task('nodemon', function(){
  nodemon({
    script: 'server.js',
    ext: 'js'
  });
});

gulp.task('test', function(){
  return gulp.src('test/*.js')
    .pipe(mocha());
});

gulp.task('lint', function(){
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', function(){
  gulp.watch('**/*.js', ['test', 'lint']);
});

gulp.task('default', ['lint', 'test', 'watch']);
