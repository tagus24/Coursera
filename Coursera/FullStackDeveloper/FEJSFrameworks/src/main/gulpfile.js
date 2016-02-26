var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
	ngannotate = require('gulp-ng-annotate'),
    del = require('del');
	

	
	gulp.task('jshint', function() {
  return gulp.src('webapp/scripts/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
	});

	gulp.task('usemin',['jshint'], function () {
		  return gulp.src('./webapp/**/*.html')
			  .pipe(usemin({
				css:[minifycss(),rev()],
				js: [ngannotate(),uglify(),rev()]
			  }))
			  .pipe(gulp.dest('dist/'));
		});

// Images
gulp.task('imagemin', function() {
  return del(['dist/images']), gulp.src('webapp/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});


// Clean
gulp.task('clean', function() {
	return del(['dist']);
});

	
	// Watch
gulp.task('watch', ['browser-sync'], function() {
  // Watch .js files
  gulp.watch('{webapp/scripts/**/*.js,webapp/styles/**/*.css,webapp/**/*.html}', ['usemin']);
      // Watch image files
  gulp.watch('webapp/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function () {
   var files = [
      'webapp/**/*.html',
      'webapp/styles/**/*.css',
      'webapp/images/**/*.png',
      'webapp/scripts/**/*.js',
      'dist/**/*'
   ];

    browserSync.init(files, {
      server: {
         baseDir: "dist",
         index: "index.html",
		 port: 4000
      }
   });
        // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
    });

gulp.task('copyfonts', ['clean'], function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});

	// Default task
	gulp.task('default', ['clean'], function() {
		gulp.start('usemin', 'imagemin','copyfonts');
	});
	