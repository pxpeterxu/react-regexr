'use strict';

var gulp = require('gulp');
var cache = require('gulp-cached');

// Client includes
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var watchify = require('watchify');
var runSequence = require('run-sequence');

// Webpack
var production = (process.env.NODE_ENV === 'production');

/*
 * Start general helpers section
 */

function createCopyGulpTask(taskName, globs, destDir, watchGlobsVar) {
  if (watchGlobsVar) {
    watchGlobsVar[taskName] = globs;
  }

  gulp.task(taskName, function() {
    return gulp.src(globs)
      .pipe(cache(taskName))
      .pipe(gulp.dest(destDir));
  });
}

function createWatchTask(globs) {
  return function(cb) {
    for (var taskName in globs) {  // eslint-disable-line
      var glob = globs[taskName];
      gulp.watch(glob, [taskName]);
    }
    cb();
  };
}

var jsWatchEnabled = false;

/*
 * End general helpers section
 */

/*
 * Start client section
 */

var clientWatchGlobs = {};

var handleError = function(error) {
  var stack = error.stack;

  // Trim the parser junk that makes you have to scroll up a lot
  var firstParseIndex = stack.indexOf('Parser.pp.');
  if (firstParseIndex !== -1) {
    var trimmedStack = stack.substring(0, firstParseIndex);
    console.log(trimmedStack);
  } else {
    console.log(stack);
  }

  this.emit('end');
};

function buildJavascript(sourceFile, destFile, destDir) {
  destDir = destDir || 'dist';

  return function() {
    var b = browserify(sourceFile, { debug: true, cache: {}, packageCache: {} });
    if (jsWatchEnabled) {
      b.plugin(watchify);
    }

    b.transform(babelify, {
      presets: ['react'],
      plugins: ['transform-es2015-template-literals'],
      extensions: ['.js', '.jsx']
    });
    if (production) {
      b.plugin('minifyify', { map: !production });
    }

    var bundle = function(rebundle) {
      var stream = b.bundle()
        .on('error', handleError)
        .pipe(source(destFile))
        .pipe(buffer())
        .pipe(gulp.dest(destDir));

      if (rebundle) {
        stream.on('end', function() { console.log('Rebundled ' + destFile); });
      }

      return stream;
    };

    b.on('update', function() {
      bundle(true);
    });

    return bundle(false);
  };
}

gulp.task('build-web', buildJavascript('src/Init.js', 'web.js'));

/* eslint-disable dot-notation */
clientWatchGlobs['sass'] = 'client/assets/styles.scss';
gulp.task('sass', function() {
  var stream = gulp.src(clientWatchGlobs['sass']);

  if (!production) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream.pipe(sass().on('error', sass.logError));

  if (!production) {
    stream = stream.pipe(sourcemaps.write());
  }

  return stream
    .pipe(gulp.dest('client/dist/assets'))
    .pipe(gulp.dest('server/public/assets'));
});

gulp.task('build-client', ['sass', 'build-web']);

gulp.task('start-watching-client', createWatchTask(clientWatchGlobs));

gulp.task('watch-client', function(cb) {
  jsWatchEnabled = true;
  runSequence('build-client', 'start-watching-client', cb);
});

/*
 * End client section
 */

// Default development mode: use the live DB, but local server
gulp.task('default', function(cb) {
  runSequence('watch-client', cb);
});
