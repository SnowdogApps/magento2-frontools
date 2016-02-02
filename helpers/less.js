module.exports = function(gulp, plugins, configs, name, locale) {
  return () => {
    // local vars
    var theme      = configs.themes[name],
        src        = theme.default ? theme.dest + '/' + locale : theme.src,
        dest       = theme.dest + '/' + locale + '/css',
        maps       = plugins.util.env.maps || false,
        production = plugins.util.env.prod || false,
        lessFiles  = [];

    // less compiler is dumb as f*ck
    // can't figure out what files to process when path is like "theme/**/*.less"
    theme.files.forEach(file => lessFiles.push(src + '/' + file + '.less'));

    return gulp.src(lessFiles)
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
      .pipe(plugins.if(maps, plugins.sourcemaps.init()))
      .pipe(plugins.less())
      .pipe(plugins.if(production, plugins.postcss([plugins.cssnano()])))
      .pipe(plugins.if(theme.postcss, plugins.postcss(theme.postcss || [])))
      .pipe(plugins.if(maps, plugins.sourcemaps.write()))
      .pipe(gulp.dest(dest))
      .pipe(plugins.browserSync.stream());
  }
}
