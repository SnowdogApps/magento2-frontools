'use strict';
module.exports = function(plugins, config, name, tree = true) { // eslint-disable-line func-names
  const path = require('path');

  function createSymlink(srcPath, destPath) {
    plugins.fs.removeSync(destPath);
    plugins.fs.ensureSymlinkSync(srcPath, destPath);
  }

  function generateSymlinks(src, dest, replacePattern, ignore = []) {
    plugins.globby.sync(
      [src + '/**'].concat(ignore.map(pattern => '!**/' + pattern)),
      { nodir: true }
    ).forEach(srcPath => {
      createSymlink(
        srcPath,
        path.join(dest, srcPath).replace(src + '/', replacePattern + '/')
      );
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

  return new Promise(resolve => {
    themeDependencyTree(name).forEach(themeName => {
      const theme = config.themes[themeName],
            themeSrc = config.projectPath + theme.src,
            themeDest = config.tempPath + theme.dest.replace(/(.*)(?=frontend|adminhtml)/, '/');

      // Clean destination dir before generating new symlinks
      plugins.fs.removeSync(themeDest);

      // Create symlinks for parent theme
      if (theme.parent) {
        const parentSrc = config.tempPath + config.themes[theme.parent].dest.replace(/(.*)(?=frontend|adminhtml)/, '/');
        generateSymlinks(parentSrc, themeDest, '', config.themes[theme.parent].ignore);
      }

      // Create symlinks for theme modules
      if (theme.modules) {
        Object.keys(theme.modules).forEach(name => {
          const moduleSrc = config.projectPath + theme.modules[name];
          generateSymlinks(
            moduleSrc,
            themeDest,
            '/' + name,
            theme.ignore
          );
        });
      }

      // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
      generateSymlinks(themeSrc, themeDest, '', theme.ignore);
    });

    resolve();
  });
};
