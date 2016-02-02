module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // Gulp task body
  if (plugins.util.env.file) {
    plugins.util.log(
      plugins.util.colors.red.bold('Gulp is looking for files. Please wait till "eslint" task end.')
    );
    
    gulp.watch('../**/' + plugins.util.env.file + '.js', function(event) {
      gulp.src(event.path)
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("ESLint found problems") }))
        .pipe(plugins.logger({ display: 'name' }))
        .pipe(plugins.eslint(configs.eslint))
        .pipe(plugins.eslint.format());
    });
  }
  else {
    plugins.util.log(
      plugins.util.colors.red.bold('ERROR: Specify file name, for example: ')
      + plugins.util.colors.green('gulp eslint --file category')
    );
  }
};
