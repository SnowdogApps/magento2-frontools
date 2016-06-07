module.exports = function(gulp, plugins, config, name, locale, file) {
  return () => {
    // local vars
    var theme      = config.themes[name],
        src        = file || config.projectPath + theme.src + '/**/*.scss',
        dest       = config.projectPath + theme.dest + '/' + locale,
        maps       = plugins.util.env.maps || false,
        production = plugins.util.env.prod || false,
        postcss    = [],
        parentPath = require('./parent-theme-dir')(name, config);

    if (theme.postcss) {
      theme.postcss.forEach(el => {
        postcss.push(eval(el));
      });
    }

    return gulp.src([
        src, '!' + config.projectPath + theme.src + '/node_modules/**/*.scss'
      ], { base: config.projectPath + theme.src + '/web' })
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
      .pipe(plugins.if(maps, plugins.sourcemaps.init()))
      .pipe(plugins.sass({ includePaths: parentPath }))
      .pipe(plugins.if(production, plugins.postcss([plugins.cssnano()])))
      .pipe(plugins.if(postcss.length, plugins.postcss(postcss || [])))
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
