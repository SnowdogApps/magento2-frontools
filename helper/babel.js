'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  const theme       = config.themes[name],
        srcBase     = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
        dest        = [],
        disableMaps = plugins.util.env.disableMaps || false,
        production  = plugins.util.env.prod || false,
        babelConfig = {
          presets: require('babel-preset-env')
        };

  function adjustDestinationDirectory(file) {
    file.dirname = file.dirname.replace('web/', '');
    return file;
  }

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
    .pipe(plugins.if(!disableMaps && !production, plugins.sourcemaps.init()))
    .pipe(plugins.babel(babelConfig))
    .pipe(plugins.if(production, plugins.uglify()))
    .pipe(plugins.if(!disableMaps && !production, plugins.sourcemaps.write()))
    .pipe(plugins.if(production, plugins.rename({ suffix: '.min' })))
    .pipe(plugins.rename(adjustDestinationDirectory))
    .pipe(plugins.multiDest(dest, { overwrite: true }))
    .pipe(plugins.logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach : ' Compiled!'
    }))
    .pipe(plugins.browserSync.stream());
};
