'use strict';
// Plugins / Functions / Modules
const plugins = require('gulp-load-plugins')({
        pattern: ['*', '!gulp', '!gulp-load-plugins'],
        rename : {
          'browser-sync'    : 'browserSync',
          'fs-extra'        : 'fs',
          'gulp-multi-dest' : 'multiDest',
          'js-yaml'         : 'yaml',
          'marked-terminal' : 'markedTerminal',
          'merge-stream'    : 'mergeStream',
          'postcss-reporter': 'reporter',
          'run-sequence'    : 'runSequence'
        }
      }),
      config = {};

config.projectPath = plugins.fs.realpathSync('../../../') + '/';
config.tempPath = config.projectPath + 'var/view_preprocessed/frontools';
config.themes = require('./helper/config-loader')('themes.json', plugins, config, false);

plugins.errorMessage = require('./helper/error-message')(plugins);
plugins.getThemes = require('./helper/get-themes')(plugins, config);

// Tasks loading
require('gulp-task-loader')({
  dir    : 'task',
  plugins: plugins,
  configs: config
});
