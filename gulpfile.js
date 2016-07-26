'use strict';
// Plugins / Functions / Modules
const gulp    = require('gulp'),
      plugins = require('gulp-load-plugins')({
        pattern: ['*', '!gulp', '!gulp-load-plugins'],
        rename : {
          'browser-sync'   : 'browserSync',
          'fs-extra'       : 'fs',
          'marked-terminal': 'markedTerminal',
          'run-sequence'   : 'runSequence'
        }
      });

plugins.errorMessage = require('./helper/error-message')(plugins);

// Global configuration
const config = {
  'projectPath': plugins.fs.realpathSync('../../../') + '/'
};

config.themes = require('./helper/config-loader')('themes.json', plugins, config, false);
plugins.getThemes = require('./helper/get-themes')(plugins, config);

// Tasks loading
require('gulp-task-loader')({
  dir    : 'task',
  plugins: plugins,
  configs: config
});

// Define task for each theme, locale, lang, processing type etc.
// Gulp can't run same task in parallel, so we need different names
Object.keys(config.themes).forEach(name => {
  const theme = config.themes[name];
  theme.locale.forEach(locale => {
    gulp.task(
      theme.lang + ':' + name + ':' + locale,
      require('./helper/' + theme.lang)(gulp, plugins, config, name, locale)
    );
  });
});
