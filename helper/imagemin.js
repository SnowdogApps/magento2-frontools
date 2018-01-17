'use strict';
const path = require('path');

module.exports = function(gulp, plugins, config, name) { // eslint-disable-line func-names
  // Return function that is executed inside of .pipe()
  return () => {
    const imageMinConfig = require('../helper/config-loader')('imagemin.json', plugins, config);

    if (plugins.util.env.dir) {
        // Requires an argument, if only `--dir` provided then this is just true
        if (plugins.util.env.dir !== true) {
            const minnedImageDir = path.join(config.projectPath, plugins.util.env.dir);
            const imageDir = path.join(minnedImageDir, '**/*');
            console.log('Minifying everything in: ' + minnedImageDir);

            return gulp.src(imageDir)
                .pipe(plugins.imagemin(imageMinConfig))
                .pipe(gulp.dest(minnedImageDir));
        } else {
            console.log('Must provide a directory as an argument');
        }
    } else {
        // No flag => go through theme image directory
        const theme = config.themes[name];
        const srcBase = config.projectPath + theme.src;
        // Look for any images in the web/images directory and minify them in place
        const imageDir = path.join(srcBase, '/web/images/**/*');
        const minnedImageDir = path.join(srcBase, '/web/images/');

        return gulp.src(imageDir)
            .pipe(plugins.imagemin(imageMinConfig))
            .pipe(gulp.dest(minnedImageDir))
            .pipe(plugins.logger({
              display   : 'name',
              beforeEach: 'Theme: ' + name + ', ' + 'File: ',
              afterEach : ' - Imagemin finished.'
            }));
    }
  }
};
