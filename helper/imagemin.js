'use strict';
module.exports = function(gulp, plugins, config, name) { // eslint-disable-line func-names
  // Return function that is executed inside of .pipe()
  return () => {
    const theme          = config.themes[name],
          srcBase        = config.projectPath + theme.src,
          imageDir = srcBase + '/web/images/*',
          minnedDir = srcBase + '/web/images/',
        //   gulpiconConfig = require('../helper/config-loader')('gulpicon.json', plugins, config);
          imageMinConfig = { optimizationLevel: 3, progressive: true, interlaced: true };


    return gulp.src(imageDir)
        .pipe(plugins.imagemin(imageMinConfig))
        .pipe(gulp.dest(minnedDir));
  }
};
