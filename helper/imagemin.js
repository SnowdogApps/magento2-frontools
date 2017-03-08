'use strict';
module.exports = function(gulp, plugins, config, name) { // eslint-disable-line func-names
  // Return function that is executed inside of .pipe()
  return () => {
    const theme          = config.themes[name],
          srcBase        = config.projectPath + theme.src,

          // Look for any images in the web/images directory and minify them in place
          imageDir       = srcBase + '/web/images/**/*',
          minnedImageDir = srcBase + '/web/images/';

    let imageMinConfig;

    try {
        // Checks for project specific config in dev/tools/frontools/config
        imageMinConfig = require('../helper/config-loader')('imageMinConfig.json', plugins, config);
    } catch (e) {
        imageMinConfig = { "optimizationLevel": 3, "progressive": true, "interlaced": true };
    }

    return gulp.src(imageDir)
        .pipe(plugins.imagemin(imageMinConfig))
        .pipe(gulp.dest(minnedImageDir));
  }
};
Put imageMin config into external file

Adds a try-catch so that if the user doesn't have a config file set up
then they will get some default config options.