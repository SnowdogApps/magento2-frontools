'use strict'
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  const theme = config.themes[name]
  const srcBase = plugins.path.join(config.tempPath, theme.dest)
  const stylesDir = theme.stylesDir ? theme.stylesDir : 'styles'
  const dest = []
  const disableMaps = plugins.util.env.disableMaps || false
  const production = plugins.util.env.prod || false
  const postcss = []
  const disableSuffix = theme.disableSuffix || false
  const browserslist = require('../helper/config-loader')('browserslist.json', plugins, config)

  if (theme.postcss) {
    theme.postcss.forEach(el => {
      postcss.push(eval(el))
    })
  }
  else {
    postcss.push(plugins.autoprefixer({ browsers: browserslist }))
  }

  function adjustDestinationDirectory(file) {
    if (file.dirname.startsWith(stylesDir)) {
      file.dirname = file.dirname.replace(stylesDir, 'css')
    }
    else {
      file.dirname = file.dirname.replace('/' + stylesDir, '')
    }
    return file
  }

  theme.locale.forEach(locale => {
    dest.push(plugins.path.join(config.projectPath, theme.dest, locale))
  })

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
    .pipe(plugins.if(production && !disableSuffix, plugins.rename({ suffix: '.min' })))
    .pipe(plugins.if(!disableMaps, plugins.sourcemaps.write('.', { includeContent: true })))
    .pipe(plugins.rename(adjustDestinationDirectory))
    .pipe(plugins.multiDest(dest))
    .pipe(plugins.logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach : ' Compiled!'
    }))
    .pipe(plugins.browserSync.stream())
}
