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

  // Cleanup existing files from pub to remove symlinks
  plugins.globby.sync(file || srcBase + '/**/*.babel.js')
    .forEach(file => {
      theme.locale.forEach(locale => {
        plugins.fs.removeSync(
          file
            .replace(
              srcBase,
              config.projectPath + theme.dest + '/' + locale
            )
            .replace(
              new RegExp('web/([^_]*)$'),
              '$1'
            )
        );
      });
    });

  const gulpTask = gulp.src( // eslint-disable-line one-var
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
    .pipe(plugins.multiDest(dest))
    .pipe(plugins.logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach : ' Compiled!'
    }));

  if (plugins.browserSyncInstances) {
    Object.keys(plugins.browserSyncInstances).map((instanceKey) => {
      const instance = plugins.browserSyncInstances[instanceKey];

      gulpTask.pipe(instance.stream());
    });
  }

  return gulpTask;
};
