import gulp from 'gulp'
import path from 'path'
import fs from 'fs-extra'
import { globbySync } from 'globby'
import gulpIf from 'gulp-if'
import babel from 'gulp-babel'
import rename from 'gulp-rename'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'

import configLoader from './config-loader.mjs'
import { env, themes, tempPath, projectPath, browserSyncInstances } from './config.mjs'

export default (name, file) => {
  const theme = themes[name]
  const srcBase = path.join(tempPath, theme.dest)
  const dest = []
  const disableMaps = env.disableMaps || false
  const production = env.prod || false

  configLoader('.browserslistrc')

  function adjustDestinationDirectory(file) {
    file.dirname = file.dirname.replace('web/', '')
    return file
  }

  theme.locale.forEach(locale => {
    dest.push(path.join(projectPath, theme.dest, locale))
  })

  // Cleanup existing files from pub to remove symlinks
  globbySync(file || srcBase + '/**/*.babel.js')
    .forEach(file => {
      theme.locale.forEach(locale => {
        fs.removeSync(
          file
            .replace(
              srcBase,
              path.join(projectPath, theme.dest, locale)
            )
            .replace(
              new RegExp('web/([^_]*)$'),
              '$1'
            )
        )
      })
    })

  const gulpTask = gulp.src(
    file || srcBase + '/**/*.babel.js',
    { base: srcBase }
  )
    .pipe(
      gulpIf(
        !env.ci,
        plumber({
          errorHandler: notify.onError('Error: <%= error.message %>')
        })
      )
    )
    .pipe(gulpIf(!disableMaps, sourcemaps.init()))
    .pipe(babel(configLoader('babel.config.json')))
    .pipe(gulpIf(production, uglify()))
    .pipe(gulpIf(production, rename({ suffix: '.min' })))
    .pipe(gulpIf(!disableMaps, sourcemaps.write('.', { includeContent: true })))
    .pipe(rename(adjustDestinationDirectory))
    .pipe(multiDest(dest))
    .pipe(logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach : ' Compiled!'
    }))

  if (browserSyncInstances) {
    Object.keys(browserSyncInstances).forEach(instanceKey => {
      const instance = browserSyncInstances[instanceKey]

      gulpTask.pipe(instance.stream())
    })
  }

  return gulpTask
}
