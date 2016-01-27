var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern: ['*', '!gulp', '!gulp-load-plugins'],
  rename: {
    'browser-sync' : 'browserSync',
    'run-sequence' : 'runSequence'
  }
});
var configs = {
  'themes' : require('./configs/themes.json'),
  'eslint' : require('./configs/eslint.json'),
  'csslint': require('./configs/css-lint.json'),
  'postcss': [ plugins.autoprefixer() ]
};
var tasks   = require('gulp-task-loader')({dir: 'tasks', plugins: plugins, configs: configs});
