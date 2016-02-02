module.exports = function(gulp, plugins, configs, name, locale) {
  return () => {
    // local vars
    var theme      = configs.themes[name],
        dest       = theme.dest + '/' + locale,
        maps       = plugins.util.env.maps || false,
        production = plugins.util.env.prod || false,
        postcss    = theme.postcss || false;

    return gulp.src(theme.src + '/**/*.scss')
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
      .pipe(plugins.if(maps, plugins.sourcemaps.init()))
      .pipe(plugins.sass())
      .pipe(plugins.if(production, plugins.postcss([plugins.cssnano()])))
      .pipe(plugins.if(theme.postcss, plugins.postcss(theme.postcss || [])))
      .pipe(plugins.if(maps, plugins.sourcemaps.write()))
      .pipe(gulp.dest(dest))
      .pipe(plugins.browserSync.stream());
  }
}
