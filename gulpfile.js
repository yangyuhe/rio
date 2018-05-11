var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var concat=require("gulp-concat")
var uglify=require("gulp-uglify")
var rename=require("gulp-rename")

var paths = {
    pages: ['src/*.html']
};

gulp.task("tscompile", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest("dist"));
});
gulp.task("compile",["tscompile"],function(){
    return gulp.src(["./dist/main.js","./src/eval.js"]).
    pipe(concat("rio.js")).
    pipe(gulp.dest("./dist"))
});
gulp.task("default",["compile"],function(){
    return gulp.src(["./dist/rio.js"]).
    pipe(rename({suffix:".min"})).
    pipe(uglify()).
    pipe(gulp.dest("./dist"))
});