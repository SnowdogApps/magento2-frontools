'use strict';
module.exports = function (gulp, plugins, config, name, file) { // eslint-disable-line func-names
    const theme = config.themes[name],
        srcBase = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
        stylesDir = theme.stylesDir ? theme.stylesDir : 'styles',
        disableMaps = plugins.util.env.disableMaps || false,
        production = plugins.util.env.prod || false,
        babelConfig = {presets: require('babel-preset-env')};

    function adjustDestinationDirectory(file) {
        file.dirname = file.dirname.replace('web/', '');
        return file;
    }

    function getModuleDir(file) {
        return file.replace(/view\/frontend\/web\/js\/(.*)\.entry\.js/, '');
    }

    function getJsDir(file) {
        return file.path.replace(/'(.*).entry.js'/, '');
    }

    var webpackStream = require('webpack-stream');
    var webpack = require('webpack');
    var vinylPaths = require('vinyl-paths');

    const dest = [];
    theme.locale.forEach(function (locale) {
        dest.push(config.projectPath + theme.dest + '/' + locale);
    });

    return gulp.src(
      [
        file || srcBase + '/**/*.entry.js', 
        '!' + srcBase + '/**/node_modules/**/*.js'
      ],
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
        .pipe(vinylPaths(function (path) {
            var moduleDir = getModuleDir(path);
            var webpackfile = moduleDir + 'webpack.config.js';

            return new Promise(function (resolve, reject) {
                webpackStream(require(webpackfile), webpack)
                    .pipe(gulp.dest(moduleDir + 'view/frontend/web/js/dist/'))
                    .on('end', resolve)
            });
        }))
        .pipe(plugins.rename(adjustDestinationDirectory))
        .pipe(plugins.multiDest(dest))
        .pipe(plugins.logger({
            display: 'name',
            beforeEach: 'Theme: ' + name + ' ',
            afterEach: ' Compiled!'
        }))
        .pipe(plugins.browserSync.stream());
};
