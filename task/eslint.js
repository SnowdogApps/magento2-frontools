'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs;

  // Load ESLint config
  config.eslint = require('../helper/config-loader')('eslint.json', plugins, config);

  // Check if --file <filename> is specified
  if (plugins.util.env.file) {
    plugins.util.log(
      plugins.util.colors.red.bold('Gulp is looking for files. Please wait...')
    );

    // Check if filename can be found inside of the project
    const files = plugins.globby.sync([
      config.projectPath + '/**/' + plugins.util.env.file + '.js',
      '!/**/node_modules/**'
    ]);

    if (files.length) {
      plugins.util.log(
        plugins.util.colors.green(files.length + ' files found. Watcher initialized.')
      );

      // Watch found files for changes. If they occur we rerun ESLint
      gulp.watch(files, event => {
        gulp.src(event.path)
          .pipe(plugins.plumber({ errorHandler: plugins.notify.onError('ESLint found problems') }))
          .pipe(plugins.logger({ display: 'name' }))
          .pipe(plugins.eslint(config.eslint))
          .pipe(plugins.eslint.format());
      });
    }
    else {
      plugins.util.log(
        plugins.util.colors.red.bold('ERROR: File not found.')
      );
      return false;
    }
  }
  else {
    plugins.util.log(
      plugins.util.colors.red.bold('ERROR: Specify file name, for example: ')
      + plugins.util.colors.green('gulp eslint --file fileName')
    );
  }
};
