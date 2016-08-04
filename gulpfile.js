'use strict';
// Plugins / Functions / Modules
const gulp    = require('gulp'),
      plugins = require('gulp-load-plugins')({
        pattern: ['*', '!gulp', '!gulp-load-plugins'],
        rename : {
          'browser-sync'    : 'browserSync',
          'fs-extra'        : 'fs',
          'marked-terminal' : 'markedTerminal',
          'postcss-reporter': 'reporter',
          'run-sequence'    : 'runSequence',
          'js-yaml'         : 'yaml'
        }
      }),
      config = {
        'projectPath': plugins.fs.realpathSync('../../../') + '/'
      };

plugins.errorMessage = require('./helper/error-message')(plugins);
plugins.getThemes = require('./helper/get-themes')(plugins, config);
config.themes = require('./helper/config-loader')('themes.json', plugins, config, false);

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

    gulp.task(
      'flatten:' + name + ':' + locale,
      require('./helper/flatten').bind(null, gulp, plugins, config, name, locale)
    );
  });

});
