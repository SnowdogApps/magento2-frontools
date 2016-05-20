module.exports = function(gulp, plugins, config, name, locale, file) {
  return () => {
    // local vars
    var theme      = config.themes[name],
        src        = theme.default ? config.projectPath + theme.dest + '/' + locale : config.projectPath + theme.src,
        dest       = config.projectPath + theme.dest + '/' + locale + '/css',
        maps       = plugins.util.env.maps || false,
        production = plugins.util.env.prod || false,
        lessFiles  = file || [],
        parentPath = require('./parent-theme-dir')(name, config);

    // less compiler is dumb as f*ck
    // can't figure out what files to process when path is like "theme/**/*.less"
    if (!lessFiles.length) {
      var files = plugins.globby.sync([
            src + '/**/*.less',
            '!' + src + '/**/_*.less',
            '!' + src + '/node_modules/**/*.less'
          ]);

      files.forEach(file => lessFiles.push(file));
    }

    return gulp.src(lessFiles)
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
      .pipe(plugins.if(maps, plugins.sourcemaps.init()))
      .pipe(plugins.less({ paths: parentPath.concat('.') }))
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
