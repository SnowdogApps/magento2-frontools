import path from 'path'
import gulp from 'gulp'
import { globbySync } from 'globby'
import stylelint from 'stylelint'
import postcss from 'gulp-postcss'
import plumber from 'gulp-plumber'
import gulpIf from 'gulp-if'
import notify from 'gulp-notify'
import logger from 'gulp-logger'
import reporter from 'postcss-reporter'

import { env, themes, projectPath } from './config.mjs'
import configLoader from './config-loader.mjs'

export default (name, file) => {
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.dest)
  const stylelintConfig = configLoader('stylelint.yml')
  const files = globbySync(srcBase + '/**/*.css')

  return gulp.src(file ? file : files.length ? files : '.')
    .pipe(gulpIf(
      !env.ci,
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    ))
    .pipe(postcss([
      stylelint({
        config: stylelintConfig
      }),
      reporter({
        clearReportedMessages: true,
        throwError: env.ci || false
      })
    ]))
    .pipe(logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ' + 'File: ',
      afterEach : ' - CSS Lint finished.'
    }))
}
