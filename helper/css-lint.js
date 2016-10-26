'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  // Return function that is executed inside of .pipe()
  return () => {
    const theme           = config.themes[name],
          srcBase         = config.projectPath + theme.dest,
          stylelintConfig = require('../helper/config-loader')('stylelint.yml', plugins, config);

    return gulp.src(file || srcBase + '/**/*.css')
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError('Error: <%= error.message %>') }))
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
  }
};
