module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  // Load eslint config
  config.eslint = require('../helpers/config-loader')('eslint.json', plugins, config);

  // Gulp task body
  if (plugins.util.env.file) {
    plugins.util.log(
      plugins.util.colors.red.bold('Gulp is looking for files. Please wait...')
    );
    var files = plugins.globby.sync([
          config.projectPath + '/**/' + plugins.util.env.file + '.js',
          '!' + config.projectPath + '/**/node_modules/**'
        ]);
    if (files.length) {
      plugins.util.log(
        plugins.util.colors.green(files.length + ' files found. Watcher initialized.')
      );
      gulp.watch(files, function(event) {
        gulp.src(event.path)
          .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("ESLint found problems") }))
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
      + plugins.util.colors.green('gulp eslint --file category')
    );
  }
};
