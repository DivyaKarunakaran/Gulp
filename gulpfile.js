// Load Modules/Plugins

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var connect = require('connect'); 
var serve = require('serve-static'); 
var browsersync = require('browser-sync'); 
var browserify = require('browserify'); 
var source = require('vinyl-source-stream'); 
var plumber = require('gulp-plumber');
var beeper = require('beeper'); // Added

function onError(err) {
    beeper();    
    console.log(err);
}


//style task
gulp.task('gulpstyletask', function () {
    return gulp.src('app/css/*.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(concat("all.css"))
        .pipe(sass())
        .pipe(gulp.dest('dist'));
    
    
   
});

//script task
gulp.task("gulpscripttask", function() {
    return gulp.src("app/js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(concat("all.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
        });

//image task
 gulp.task("gulpimagetask", function() {
     return gulp.src("app/img/*.")
       .pipe(imagemin())
       .pipe(gulp.dest("dist/img"));
     });

//watch task
gulp.task('gulpwatchtask', function() { 
    gulp.watch('app/css/*.scss', ['gulpstyletask']);  
    gulp.watch('app/js/*.js', ['gulpscripttask']); 
    gulp.watch('app/img/*', ['gulpimagetask']);
});

gulp.task('nodewatch', function() {  
    gulp.watch('app/css/*.css', gulp.series('gulpstyletask',browsersync.reload));      
    gulp.watch('app/js/*.js', gulp.series('gulpscripttask',browsersync.reload));       
    gulp.watch('app/img/*', gulp.series('gulpimagetask',browsersync.reload));
});

//default task
gulp.task('default', ['gulpstyletask', 'gulpscripttask', 'gulpimagetask', 'gulpwatchtask','nodeserver','nodebrowsersync','nodewatch','browserify']);


//server-task
gulp.task('nodeserver', function() {
    return connect().use(serve(__dirname))    
        .listen(8080)    
        .on('listening', function() { 
        console.log('Server Running: View at http://localhost:8080');
    });
});

//browser sync
gulp.task('nodebrowsersync', function(cb) {
    return browsersync({  
        server: {     
            baseDir:'./'   
        }    
    }, cb);
});

//browserify task

gulp.task('browserify', function() {
    return browserify('./app/js/main.js')  
        .bundle()    
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

