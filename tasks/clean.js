module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  return gulp.src(['../pub/static/*/', '!../pub/static/.htaccess'], {read: false})
    .pipe(plugins.rimraf({force: true}));
};
