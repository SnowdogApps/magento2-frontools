'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  const theme           = config.themes[name],
        srcBase         = config.projectPath + theme.dest,
        stylelintConfig = require('../helper/config-loader')('stylelint.yml', plugins, config);

  return gulp.src(file || plugins.globby.sync(srcBase + '/**/*.css'))
    .pipe(plugins.if(
      !plugins.util.env.ci,
      plugins.plumber({
        errorHandler: plugins.notify.onError('Error: <%= error.message %>')
      })
    ))
    .pipe(plugins.postcss([
      plugins.stylelint({
        config: stylelintConfig
      }),
      plugins.reporter({
        clearMessages: true,
        throwError: plugins.util.env.ci || false
      })
    ]))
    .pipe(plugins.logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ' + 'File: ',
      afterEach : ' - CSS Lint finished.'
    }));
};
