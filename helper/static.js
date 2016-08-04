'use strict';

const path = require('path');

module.exports = function staticTask(gulp, plugins, config, name, locale) {
  return function copyFiles() {
    const theme = config.themes[name];
    const filetypes = [
      'css',
      'csv',
      'eot',
      'gif',
      'htc',
      'htm',
      'html',
      'ico',
      'jbf',
      'jpg',
      'js',
      'json',
      'less',
      'map',
      'md',
      'png',
      'scss',
      'svg',
      'swf',
      'ttf',
      'txt',
      'woff',
      'woff2',
    ];

    const src = filetypes.map(function getGlob (ext) {
      return '**/*.' + ext
    });

    const dest = path.join(
      config.projectPath,
      theme.dest,
      locale
    );

    return gulp
      .src(
        src,
        { cwd: path.join(config.projectPath, 'var/frontools', name, locale) }
      )
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError('Error: <%= error.message %>')
      }))
      .pipe(gulp.dest(dest));
  }
}
