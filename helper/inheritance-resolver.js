'use strict';
module.exports = function(plugins, config, name, tree = true) { // eslint-disable-line func-names
  const path = require('path');

  function createSymlink(srcPath, destPath) {
    plugins.fs.removeSync(destPath);
    plugins.fs.ensureSymlinkSync(srcPath, destPath);
  }

  function generateSymlinks(src, dest, replacePattern, ignore = []) {
    plugins.globby.sync(
      [src + '/**'].concat(ignore.map(pattern => '!/**/' + pattern)),
      { nodir: true }
    ).forEach(srcPath => {
      let destPath = path.join(dest, srcPath);
      // Iterate through all replace patterns and apply them
      if (Array.isArray(replacePattern)) {
        replacePattern.forEach(replace => {
          destPath = destPath.replace(replace[0], replace[1]);
        });
      }
      else {
        destPath = destPath.replace(replacePattern, '');
      }
      createSymlink(srcPath, destPath);
    });
  }

  function themeDependencyTree(themeName, dependencyTree) {
    dependencyTree = dependencyTree ? dependencyTree : [];
    dependencyTree.push(themeName);

    if (!tree) {
      return dependencyTree;
    }

    if (config.themes[themeName].parent) {
      return themeDependencyTree(
        config.themes[themeName].parent,
        dependencyTree
      );
    }
    else {
      return dependencyTree.reverse();
    }
  }

  themeDependencyTree(name).forEach(themeName => {
    const theme = config.themes[themeName],
          themeSrc = config.projectPath + theme.src,
          themeDest = config.tempPath + theme.dest.replace('pub/static', '');

    // Clean destination dir before generating new symlinks
    plugins.fs.removeSync(themeDest);

    // Create symlinks for theme modules
    if (theme.modules) {
      Object.keys(theme.modules).forEach(name => {
        const moduleSrc = config.projectPath + theme.modules[name];
        generateSymlinks(
          moduleSrc,
          themeDest,
          [
            [moduleSrc, '/' + name]
          ],
          theme.ignore
        );
      });
    }

    if (theme.parent) {
      const parentSrc = config.tempPath + config.themes[theme.parent].dest.replace('pub/static', '');
      generateSymlinks(parentSrc, themeDest, parentSrc, config.themes[theme.parent].ignore);
    }

    // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
    generateSymlinks(themeSrc, themeDest, themeSrc, theme.ignore);
  });
};
