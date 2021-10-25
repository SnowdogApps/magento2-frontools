import fs from 'fs-extra'
import globby from 'globby'
import path from 'path'

import { themes, projectPath, tempPath } from './config.mjs'

function createSymlink(srcPath, destPath) {
  fs.removeSync(destPath)
  fs.ensureSymlinkSync(srcPath, destPath)
}

function generateSymlinks(src, dest, replacePattern, ignore = []) {
  globby.sync(
    [src + '/**'].concat(ignore.map(pattern => '!**/' + pattern)),
    { nodir: true }
  ).forEach(srcPath => {
    createSymlink(
      srcPath,
      path.join(dest, srcPath).replace(src + '/', replacePattern + '/')
    )
  })
}

function themeDependencyTree(themeName, tree, dependencyTree) {
  dependencyTree = dependencyTree ? dependencyTree : []
  dependencyTree.push(themeName)

  if (!tree) {
    return dependencyTree
  }

  if (themes[themeName].parent) {
    return themeDependencyTree(
      themes[themeName].parent,
      tree,
      dependencyTree
    )
  }
  else {
    return dependencyTree.reverse()
  }
}

export default function(name, tree = true) {
  return new Promise(resolve => {
    themeDependencyTree(name, tree).forEach(themeName => {
      const theme = themes[themeName]
      const themeSrc = path.join(projectPath, theme.src)
      const themeDest = path.join(tempPath, theme.dest)

      // Clean destination dir before generating new symlinks
      fs.removeSync(themeDest)

      // Create symlinks for parent theme
      if (theme.parent) {
        const parentSrc = path.join(tempPath, themes[theme.parent].dest)
        generateSymlinks(parentSrc, themeDest, '', themes[theme.parent].ignore)
      }

      // Create symlinks for theme modules
      if (theme.modules) {
        Object.keys(theme.modules).forEach(name => {
          const moduleSrc = path.join(projectPath, theme.modules[name])
          generateSymlinks(
            moduleSrc,
            themeDest,
            '/' + name,
            theme.ignore
          )
        })
      }

      // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
      generateSymlinks(themeSrc, themeDest, '', theme.ignore)
    })

    resolve()
  })
}
