'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  // Return function that is executed inside of .pipe()
  return () => {
    const theme       = config.themes[name],
          srcBase     = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
          stylesDir   = theme.stylesDir ? '/' + theme.stylesDir : '/styles',
          disableMaps = plugins.util.env.disableMaps || false,
          production  = plugins.util.env.prod || false,
          postcss     = [];

    if (theme.postcss) {
      theme.postcss.forEach(el => {
        postcss.push(eval(el));
      });
    }
    else {
      postcss.push(plugins.autoprefixer());
    }

    if (!theme.localeOverwrites) {
      let dest = [];
      theme.locale.forEach(locale => {
        dest.push(config.projectPath + theme.dest + '/' + locale + '/css');
      });

      return gulp.src(
          file || srcBase + '/**/*.scss',
          { base: srcBase + stylesDir }
        )
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError('Error: <%= error.message %>') }))
        .pipe(plugins.if(!disableMaps, plugins.sourcemaps.init()))
        .pipe(plugins.sass())
        .pipe(plugins.if(production, plugins.postcss([plugins.cssnano()])))
        .pipe(plugins.if(postcss.length, plugins.postcss(postcss || [])))
        .pipe(plugins.if(!disableMaps, plugins.sourcemaps.write()))
        .pipe(plugins.if(production, plugins.rename({ suffix: '.min' })))
        .pipe(plugins.rename(path => {
          if (path.dirname !== '.') {
            path.dirname = path.dirname.replace(stylesDir, '');
          }
        }))
        .pipe(plugins.multiDest(dest))
        .pipe(plugins.logger({
          display   : 'name',
          beforeEach: 'Theme: ' + name + ' ',
          afterEach : ' Compiled!'
        }))
        .pipe(plugins.browserSync.stream());
    }
    else {
      theme.locale.forEach(locale => {
        return gulp.src(
            file || srcBase + '/' + locale + '/**/*.scss',
            { base: srcBase + '/' + locale + stylesDir }
          )
          .pipe(plugins.plumber({ errorHandler: plugins.notify.onError('Error: <%= error.message %>') }))
          .pipe(plugins.if(!disableMaps, plugins.sourcemaps.init()))
          .pipe(plugins.sass())
          .pipe(plugins.if(production, plugins.postcss([plugins.cssnano()])))
          .pipe(plugins.if(postcss.length, plugins.postcss(postcss || [])))
          .pipe(plugins.if(!disableMaps, plugins.sourcemaps.write()))
          .pipe(plugins.if(production, plugins.rename({ suffix: '.min' })))
          .pipe(plugins.rename(path => {
            if (path.dirname !== '.') {
              path.dirname = path.dirname.replace(stylesDir, '');
            }
          }))
          .pipe(gulp.dest(config.projectPath + theme.dest + '/' + locale + '/css'))
          .pipe(plugins.logger({
            display   : 'name',
            beforeEach: 'Theme: ' + name + ' Locale: ' + locale + ' ',
            afterEach : ' Compiled!'
          }))
          .pipe(plugins.browserSync.stream());
      });
    }
  }
};
