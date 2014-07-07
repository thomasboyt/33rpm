/* jshint node: true */

var pickFiles = require('broccoli-static-compiler');
var uglify = require('broccoli-uglify-js');
var HBSPages = require('broccoli-pages').HBSPages;
var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');

var IS_PRODUCTION = require('broccoli-env').getEnv() === 'production';

var makeModules = require('broccoli-compile-modules');
var browserify = require('broccoli-browserify');

var modules = makeModules('app', {
  inputFiles: ['**/*.js'],
  output: '/',
  formatter: 'commonjs',
});

var appJs = browserify(modules, {
  entries: ['./main.js'],
  outputFile: 'app.js'
});

var libJs = pickFiles('lib', {
  srcDir: '/',
  files: ['**/*.js'],
  destDir: '/lib'
});

var js = mergeTrees([appJs, libJs]);

var index = pickFiles('app', {
  srcDir: '/',
  files: ['index.hbs'],
  destDir: '/'
});

index = HBSPages(index, {
  globals: {
    IS_PRODUCTION: IS_PRODUCTION
  },
  partials: null,
  helpers: 'app/helpers/'
});

var data = pickFiles('data/', {
  srcDir: '/',
  files: ['**/*'],
  destDir: '/data'
});

if ( IS_PRODUCTION ) {
  js = concat(js, {
    inputFiles: ['lib/**/*.js', 'app.js'],
    outputFile: '/app.min.js'
  });
  js = uglify(js);
}

module.exports = mergeTrees([js, index, data]);
