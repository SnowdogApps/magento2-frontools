'use strict'
module.exports = (gulp, plugins, config, name) => {
  const production = plugins.util.env.prod || false
  const theme = config.themes[name]
  const srcBase = plugins.path.join(config.projectPath, theme.dest)
  const emailFilename = production ? 'email-inline.min.css' : 'email-inline.css'

  return gulp.src(srcBase + '/**/*/' + emailFilename, { base: './' })
    .pipe(plugins.if(
      !plugins.util.env.ci,
      plugins.plumber({
        errorHandler: plugins.notify.onError('Error: <%= error.message %>')
      })
    ))
    .pipe(plugins.logger({
      display : 'rel',
      beforeEach: 'Email styles from: ',
      afterEach: ' has been fixed!'
    }))
    .pipe(plugins.replace('@charset "UTF-8";', ''))
    .pipe(gulp.dest('./'))
}
