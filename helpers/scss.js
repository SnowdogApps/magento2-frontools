module.exports = function(gulp, plugins, configs, name, locale, file) {
  return () => {
    // local vars
    var theme      = configs.themes[name],
        src        = file || theme.src + '/**/*.scss',
        dest       = theme.dest + '/' + locale,
        maps       = plugins.util.env.maps || false,
        production = plugins.util.env.prod || false,
        postcss    = theme.postcss || false;

    return gulp.src([src, '!/**/node_modules/**'], {base: theme.src + '/web'})
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
      .pipe(plugins.if(maps, plugins.sourcemaps.init()))
      .pipe(plugins.sass())
      .pipe(plugins.if(production, plugins.postcss([plugins.cssnano()])))
      .pipe(plugins.if(theme.postcss, plugins.postcss(theme.postcss || [])))
      .pipe(plugins.if(maps, plugins.sourcemaps.write()))
      .pipe(gulp.dest(dest))
      .pipe(plugins.logger({
        display: 'name',
        beforeEach: 'Theme: ' + name + ' Locale: ' + locale + ' ',
        afterEach: ' Compiled!'
      }))
      .pipe(plugins.browserSync.stream());
  }
}
