'use strict'
module.exports = (gulp, plugins, config, name, file) => {
  const theme = config.themes[name]
  const srcBase = plugins.path.join(config.tempPath, theme.dest)
  const dest = []
  const disableMaps = plugins.util.env.disableMaps || false
  const production = plugins.util.env.prod || false
  const babelConfig = {
    presets: [
      require('@babel/preset-env')
    ]
  }

  function adjustDestinationDirectory(file) {
    file.dirname = file.dirname.replace('web/', '')
    return file
  }

  theme.locale.forEach(locale => {
    dest.push(plugins.path.join(config.projectPath, theme.dest, locale))
  })

  // Cleanup existing files from pub to remove symlinks
  plugins.globby.sync(file || srcBase + '/**/*.babel.js')
    .forEach(file => {
      theme.locale.forEach(locale => {
        plugins.fs.removeSync(
          file
            .replace(
              srcBase,
              plugins.path.join(config.projectPath, theme.dest, locale)
            )
            .replace(
              new RegExp('web/([^_]*)$'),
              '$1'
            )
        )
      })
    })

  return gulp.src(
    file || srcBase + '/**/*.babel.js',
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
    .pipe(plugins.babel(babelConfig))
    .pipe(plugins.if(production, plugins.uglify()))
    .pipe(plugins.if(production, plugins.rename({ suffix: '.min' })))
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
