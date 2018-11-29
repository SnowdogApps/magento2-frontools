'use strict';
module.exports = function(gulp, plugins, config, name) { // eslint-disable-line func-names
  const theme     = config.themes[name],
        srcBase   = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
        dest      = [],
        svgConfig = require('../helper/config-loader')('svg-sprite.yml', plugins, config);

  plugins.path = require('path');

  theme.locale.forEach(locale => {
    dest.push(config.projectPath + theme.dest + '/' + locale);
  });

  const gulpTask = gulp.src(srcBase + '/**/icons/**/*.svg') // eslint-disable-line one-var
    .pipe(
      plugins.if(
        !plugins.util.env.ci,
        plugins.plumber({
          errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        })
      )
    )
    .pipe(plugins.svgSprite({
      shape: {
        id: {
          generator: file => plugins.path.basename(file, '.svg')
        }
      },
      mode: svgConfig
    }))
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
