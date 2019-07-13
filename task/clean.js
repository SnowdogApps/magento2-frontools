'use strict'
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp
  const plugins = this.opts.plugins
  const config  = this.opts.configs

  // Remove all files under pub/static, except .htaccess
  return gulp.src([
    config.projectPath + 'pub/static/*',
    '!' + config.projectPath + 'pub/static/.htaccess'
  ], { read: false })
    .pipe(plugins.rimraf({ force: true }))
}
