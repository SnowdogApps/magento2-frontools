'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  const theme       = config.themes[name],
        srcBase     = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
        stylesDir   = theme.stylesDir ? theme.stylesDir : 'styles',
        disableMaps = plugins.util.env.disableMaps || false,
        production  = plugins.util.env.prod || false,
        babelConfig = {
          presets: require('babel-preset-env')
        };

  function adjustDestinationDirectory(file) {
    file.dirname = file.dirname.replace('web/', '');
    return file;
  }

  function getModuleDir(file) {
    var path = file.replace(/view\/frontend\/web\/js\/(.*)\.babel\.js/, '');
    return path;
  }

  function getJsDir(file) {
    var path = file.path.replace(/'(.*).babel.js'/, '');
    return path;
  }

    var webpack = require('webpack-stream');
    var vinylPaths = require('vinyl-paths');

    const dest = [];
    theme.locale.forEach(locale => {
      dest.push(config.projectPath + theme.dest + '/' + locale);
    });

    return gulp.src(
      file || srcBase + '/**/*.babel.js',
      { base: srcBase }
    )
    .pipe(
        plugins.if(
            !plugins.util.env.ci,
            plugins.plumber({
                errorHandler: plugins.notify.onError('Error: <%= error.message %>')
            })
        )
    )
    .pipe(vinylPaths(function(path) {
        var moduleDir = getModuleDir(path);
        var webpackfile = moduleDir + 'webpack.config.js';

        return new Promise(function(resolve, reject) {
            webpack(require(webpackfile))
                .pipe(gulp.dest(moduleDir + 'view/frontend/web/js/dist/'))
                .on('end', resolve)
        });
    }))
    .pipe(plugins.rename(adjustDestinationDirectory))
    .pipe(plugins.multiDest(dest))
    .pipe(plugins.logger({
        display   : 'name',
        beforeEach: 'Theme: ' + name + ' ',
        afterEach : ' Compiled!'
    }))
    .pipe(plugins.browserSync.stream());
};
