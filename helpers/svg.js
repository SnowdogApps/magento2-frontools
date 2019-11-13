import { src } from 'gulp'
import path from 'path'
import gulpIf from 'gulp-if'
import multiDest from 'gulp-multi-dest'
import logger from 'gulp-logger'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import svgSprite from 'gulp-svg-sprite'

import configLoader from './config-loader'
import { env, tempPath, projectPath, themes, browserSyncInstances } from './config'

export default name => {
  const theme = themes[name]
  const srcBase = path.join(tempPath, theme.dest)
  const dest = []
  const svgConfig = configLoader('svg-sprite.yml')

  theme.locale.forEach(locale => {
    dest.push(path.join(projectPath, theme.dest, locale))
  })

  const gulpTask = src(srcBase + '/**/icons/**/*.svg')
    .pipe(
      gulpIf(
        !env.ci,
        plumber({
          errorHandler: notify.onError('Error: <%= error.message %>')
        })
      )
    )
    .pipe(svgSprite({
      shape: {
        id: {
          generator: file => path.basename(file, '.svg')
        }
      },
      mode: svgConfig
    }))
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
