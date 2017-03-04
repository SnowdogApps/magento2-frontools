'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  const theme       = config.themes[name],
        srcBase     = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
        stylesDir   = theme.stylesDir ? theme.stylesDir : 'styles',
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

  function adjustDestinationDirectory(file) {
    if (file.dirname.startsWith(stylesDir)) {
      file.dirname = file.dirname.replace(stylesDir, 'css');
    }
    else {
      file.dirname = file.dirname.replace('/' + stylesDir, '');
    }
    return file;
  }

  if (!theme.localeOverwrites) {
    let dest = [];
    theme.locale.forEach(locale => {
      dest.push(config.projectPath + theme.dest + '/' + locale);
    });

    return gulp.src(
      file || srcBase + '/**/*.scss',
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
      .pipe(plugins.if(!disableMaps, plugins.sourcemaps.init()))
      .pipe(
        plugins.sass()
          .on('error', plugins.sassError.gulpSassError(plugins.util.env.ci || false))
      )
      .pipe(plugins.if(production, plugins.postcss([plugins.cssnano()])))
      .pipe(plugins.if(postcss.length, plugins.postcss(postcss || [])))
      .pipe(plugins.if(!disableMaps, plugins.sourcemaps.write()))
      .pipe(plugins.if(production, plugins.rename({ suffix: '.min' })))
      .pipe(plugins.rename(adjustDestinationDirectory))
      .pipe(plugins.multiDest(dest))
      .pipe(plugins.logger({
        display   : 'name',
        beforeEach: 'Theme: ' + name + ' ',
        afterEach : ' Compiled!'
      }))
      .pipe(plugins.browserSync.stream());
  }
  else {
    const streams = plugins.mergeStream();
    theme.locale.forEach(locale => {
      streams.add(
        gulp.src(
          file || srcBase + '/' + locale + '/**/*.scss',
          { base: srcBase + '/' + locale }
        )
        .pipe(
            plugins.if(
              !plugins.util.env.ci,
              plugins.plumber({
                errorHandler: plugins.notify.onError('Error: <%= error.message %>')
              })
            )
          )
          .pipe(plugins.if(!disableMaps, plugins.sourcemaps.init()))
          .pipe(
            plugins.sass()
              .on('error', plugins.sassError.gulpSassError(plugins.util.env.ci || false))
          )
          .pipe(plugins.if(production, plugins.postcss([plugins.cssnano()])))
          .pipe(plugins.if(postcss.length, plugins.postcss(postcss || [])))
          .pipe(plugins.if(!disableMaps, plugins.sourcemaps.write()))
          .pipe(plugins.if(production, plugins.rename({ suffix: '.min' })))
          .pipe(plugins.rename(adjustDestinationDirectory))
          .pipe(gulp.dest(config.projectPath + theme.dest + '/' + locale))
          .pipe(plugins.logger({
            display   : 'name',
            beforeEach: 'Theme: ' + name + ' Locale: ' + locale + ' ',
            afterEach : ' Compiled!'
          }))
          .pipe(plugins.browserSync.stream())
      );
    });
    return streams;
  }
};
