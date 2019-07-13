'use strict'
module.exports = function(gulp, plugins, config, name) { // eslint-disable-line func-names
  const theme = config.themes[name]
  const srcBase = plugins.path.join(config.tempPath, theme.dest)
  const dest = []
  const svgConfig = require('../helper/config-loader')('svg-sprite.yml', plugins, config)

  theme.locale.forEach(locale => {
    dest.push(plugins.path.join(config.projectPath, theme.dest, locale))
  })

  return gulp.src(srcBase + '/**/icons/**/*.svg')
    .pipe(
      plugins.if(
        !plugins.util.env.ci,
        plugins.plumber({
          errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        })
      )
    )
    .pipe(plugins.svgSprite({
      shape: {
        id: {
          generator: file => plugins.path.basename(file, '.svg')
        }
      },
      mode: svgConfig
    }))
    .pipe(plugins.multiDest(dest))
    .pipe(plugins.logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach : ' Compiled!'
    }))
    .pipe(plugins.browserSync.stream())
}
