module.exports = function() {
  // Global variables
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  // Remove all files under pub/static, except .htaccess
  return gulp.src([
      config.projectPath + 'pub/static/*',
      '!' + config.projectPath + 'pub/static/.htaccess'
    ], { read: false })
    .pipe(plugins.rimraf({ force: true }));
};
