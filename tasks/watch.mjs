import fs from 'fs-extra'
import path from 'path'
import chokidar from 'chokidar'
import globby from 'globby'
import colors from 'ansi-colors'
import log from 'fancy-log'

import configLoader from '../helpers/config-loader.mjs'
import babel from '../helpers/babel.mjs'
import cssLint from '../helpers/css-lint.mjs'
import dependecyTree from '../helpers/dependency-tree-builder.mjs'
import inheritance from '../helpers/inheritance-resolver.mjs'
import sass from '../helpers/scss.mjs'
import sassLint from '../helpers/sass-lint.mjs'
import svg from '../helpers/svg.mjs'

import { env, themes, tempPath, projectPath, browserSyncInstances } from '../helpers/config.mjs'
import getThemes from '../helpers/get-themes.mjs'

export const watch = () => {
  log(colors.yellow('Initializing watcher...'))

  // Chokidar watcher config
  const watcherConfig = configLoader('watcher.json')
  watcherConfig.ignoreInitial = true

  getThemes().forEach(name => {
    const theme = themes[name]
    const themeTempSrc = path.join(tempPath, theme.dest)
    const themeDest = path.join(projectPath, theme.dest)
    const themeSrc = [path.join(projectPath, theme.src)]

    // Add modules source directeoried to theme source paths array
    if (theme.modules) {
      Object.keys(theme.modules).forEach(module => {
        themeSrc.push(path.join(projectPath, theme.modules[module]))
      })
    }

    // Initialize watchers
    const tempWatcher = chokidar.watch(themeTempSrc, watcherConfig)
    const srcWatcher = chokidar.watch(themeSrc, watcherConfig)
    const destWatcher = chokidar.watch(themeDest, watcherConfig)

    let reinitTimeout = false
    let reinitPaths = []
    let sassDependecyTree = {}

    function generateSassDependencyTree() {
      // Cleanup tree
      sassDependecyTree = {}

      // Find all main SASS files
      globby.sync([
        themeTempSrc + '/**/*.scss',
        '!/**/_*.scss'
      ]).forEach(file => {
        // Generate array of main file dependecies
        sassDependecyTree[file] = dependecyTree(file)
      })
    }

    generateSassDependencyTree()

    function reinitialize(filePath) {
      // Reset previously set timeout
      clearTimeout(reinitTimeout)
      reinitPaths.push(filePath)

      // Timeout to run only once while moving or renaming files
      reinitTimeout = setTimeout(() => {
        const paths = reinitPaths
        reinitPaths = []

        log(
          colors.yellow('Change detected.') + ' ' +
          colors.green('Theme:') + ' ' +
          colors.blue(name) + ' ' +
          colors.green(`${paths.length} file(s) changed`)
        )

        log(
          colors.yellow('Resolving inheritance.') + ' ' +
          colors.green('Theme:') + ' ' +
          colors.blue(name)
        )

        // Disable watcher to not fire tons of events while solving inheritance
        tempWatcher.unwatch(themeTempSrc)

        // Run inheritance resolver just for one theme without parent(s)
        inheritance(name, false).then(() => {
          // Regenerate SASS Dependency Tree
          generateSassDependencyTree()

          // Add all files to watch again after solving inheritance
          tempWatcher.add(themeTempSrc)

          // Emit event on added / moved / renamed / deleted file to trigger regualr pipeline
          paths.forEach(filePath => {
            if (fs.existsSync(filePath)) {
              globby.sync(themeTempSrc + '/**/' + path.basename(filePath))
                .forEach(file => {
                  tempWatcher.emit('change', file)
                })
            }
          })
        })
      }, 100)
    }

    // Watch add / move / rename / delete events on source files
    srcWatcher
      .on('add', reinitialize)
      .on('addDir', reinitialize)
      .on('unlink', reinitialize)
      .on('unlinkDir', reinitialize)

    // print msg when temp dir watcher is initialized
    tempWatcher.on('ready', () => {
      log(
        colors.yellow('Watcher initialized!') + ' ' +
        colors.green('Theme:') + ' ' +
        colors.blue(name) + ' ' +
        colors.green('and dependencies...')
      )
    })

    // Events handling
    tempWatcher.on('change', filePath => {
      // Print message to know what's going on
      log(
        colors.yellow('Change detected.') + ' ' +
        colors.green('Theme:') + ' ' +
        colors.blue(name) + ' ' +
        colors.green('File:') + ' ' +
        colors.blue(path.relative(themeTempSrc, filePath))
      )

      // SASS Lint
      if (!env.disableLinting) {
        if (path.extname(filePath) === '.scss') {
          sassLint(name, filePath)
        }
      }

      // SASS Compilation
      if (path.extname(filePath) === '.scss') {
        Object.keys(sassDependecyTree).forEach(file => {
          if (sassDependecyTree[file].includes(filePath)) {
            sass(name, file)
          }
        })
      }

      // Babel
      if (path.basename(filePath).includes('.babel.js')) {
        babel(name, filePath)
      }

      // SVG Sprite
      if (path.extname(filePath) === '.svg') {
        svg(name)
      }

      // Files that require reload after save
      if (['.html', '.phtml', '.xml', '.csv', '.js', '.vue'].some(
        ext => path.extname(filePath) === ext
      )) {
        if (browserSyncInstances) {
          Object.keys(browserSyncInstances).forEach((instanceKey) => {
            const instance = browserSyncInstances[instanceKey]
            instance.reload()
          })
        }
      }
    })

    destWatcher.on('change', filePath => {
      // CSS Lint
      if (!env.disableLinting) {
        if (path.extname(filePath) === '.css') {
          cssLint(name, filePath)
        }
      }
    })
  })
}
