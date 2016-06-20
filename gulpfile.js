// Plugins / Functions / Modules
var gulp    = require('gulp'),
    fs      = require('fs'),
    plugins = require('gulp-load-plugins')({
      pattern: ['*', '!gulp', '!gulp-load-plugins'],
      rename: {
        'browser-sync'   : 'browserSync',
        'marked-terminal': 'markedTerminal',
        'run-sequence'   : 'runSequence'
      }
    });

// Global configuration
var config = {
  'projectPath': fs.realpathSync('../../../') + '/'
};

config.themes = require('./helpers/config-loader')('themes.json', plugins, config);

// Tasks loading
require('gulp-task-loader')({
  dir    : 'tasks',
  plugins: plugins,
  configs: config
});

// Define task for each theme, locale, lang, processing type etc.
// Gulp can't run same task in parallel, so we need different names
Object.keys(config.themes).forEach(name => {
  var theme = config.themes[name];
  theme.locale.forEach(locale => {
    gulp.task(
      theme.lang + ':' + name + ':' + locale,
      require('./helpers/' + theme.lang)(gulp, plugins, config, name, locale)
    );
  });
});
