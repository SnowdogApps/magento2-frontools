import path from 'path'
import { src } from 'gulp'
import globby from 'globby'
import plumber from 'gulp-plumber'
import gulpIf from 'gulp-if'
import notify from 'gulp-notify'
import logger from 'gulp-logger'
import sassLint from 'gulp-sass-lint'

import { env, themes, tempPath } from './config'
import configLoader from './config-loader'

export default (name, file) => {
  const theme = themes[name]
  const srcBase = path.join(tempPath, theme.dest)
  const sassLintConfig = configLoader('sass-lint.yml')
  const files = globby.sync(srcBase + '/**/*.scss')

  return src(file || files.length ? files : '.')
    .pipe(gulpIf(
      !env.ci,
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    ))
    .pipe(sassLint(sassLintConfig))
    .pipe(sassLint.format())
    .pipe(gulpIf(env.ci, sassLint.failOnError()))
    .pipe(logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ' + 'File: ',
      afterEach : ' - SASS Lint finished.'
    }))
}
