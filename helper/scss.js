'use strict';

const path = require('path');

module.exports = function(gulp, plugins, config, name, locale, file) { // eslint-disable-line func-names
  // Return function that is executed inside of .pipe()
  return function compileStylesheets() {
    const theme = config.themes[name];
    const src = path.join(
      config.projectPath,
      'var/frontools',
      name,
      locale,
      'styles/styles.scss'
    );
    const dest = path.join(
      config.projectPath,
      theme.dest,
      locale,
      'css'
    );
    const maps = plugins.util.env.maps || false;
    const production = plugins.util.env.prod || false;
    const postcss = [];

    if (theme.postcss) {
      theme.postcss.forEach(el => {
        postcss.push(eval(el));
      });
    }

    return gulp
      .src([src])
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError('Error: <%= error.message %>') }))
      .pipe(plugins.if(maps, plugins.sourcemaps.init()))
      .pipe(plugins.sass())
      .pipe(plugins.if(production, plugins.postcss([plugins.cssnano()])))
      .pipe(plugins.if(postcss.length, plugins.postcss(postcss || [])))
      .pipe(plugins.if(maps, plugins.sourcemaps.write()))
      .pipe(gulp.dest(dest))
      .pipe(plugins.logger({
        display   : 'name',
        beforeEach: 'Theme: ' + name + ' Locale: ' + locale + ' ',
        afterEach : ' Compiled!'
      }));
  };
};
