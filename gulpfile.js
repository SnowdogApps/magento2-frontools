'use strict';
// Plugins / Functions / Modules
const gulp    = require('gulp'),
      plugins = require('gulp-load-plugins')({
        pattern: ['*', '!gulp', '!gulp-load-plugins'],
        rename : {
          'browser-sync'    : 'browserSync',
          'fs-extra'        : 'fs',
          'gulp-multi-dest' : 'multiDest',
          'js-yaml'         : 'yaml',
          'marked-terminal' : 'markedTerminal',
          'postcss-reporter': 'reporter',
          'run-sequence'    : 'runSequence'
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

// Define task for each theme
// Gulp can't run same task in parallel, so we need different names
Object.keys(config.themes).forEach(name => {
  const theme = config.themes[name];
  gulp.task(
    theme.lang + ':' + name,
    require('./helper/' + theme.lang)(gulp, plugins, config, name)
  );
});
