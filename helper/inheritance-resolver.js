'use strict';
module.exports = function(plugins, config, name) { // eslint-disable-line func-names
  function createSymlink(srcPath, destPath) {
    try {
      plugins.fs.ensureFileSync(destPath);
      plugins.fs.unlinkSync(destPath);
    }
    finally {
      plugins.fs.symlinkSync(srcPath, destPath);
    }
  }

  function generateSymlinks(src, dest, replacePattern, ignore = []) {
    plugins.globby.sync(
      [src + '/**/*.scss', '!/.test'].concat(ignore)
    ).forEach(srcPath => {
      let destPath = dest + srcPath;
      // Iterate through all replace patterns and apply them
      replacePattern.forEach(replace => {
        destPath = destPath.replace(replace, '')
      });

      createSymlink(srcPath, destPath);
    });
  }

  function themeDependencyTree(themeName, dependencyTree) {
    dependencyTree = dependencyTree ? dependencyTree : [];
    dependencyTree.push(themeName);
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
          themeDest = config.projectPath
            + 'var/view_preprocessed/frontools'
            + theme.dest.replace('pub/static', '');

    // Clean destination dir before generating new symlinks
    plugins.fs.removeSync(themeDest);

    // Create symlinks for themes without any per locale modifcations (default)
    if (!theme.localeOverwrites) {
      if (theme.parent) {
        const parentSrc = config.projectPath
          + 'var/view_preprocessed/frontools'
          + config.themes[theme.parent].dest.replace('pub/static', '');

        generateSymlinks(parentSrc, themeDest, [parentSrc]);
      }

      // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
      generateSymlinks(themeSrc, themeDest, [themeSrc]);
    }
    // Create symlinks for themes with per locale modifcations
    else {
      // We have to handle every locale independly, b/c of possible overwrites
      theme.locale.forEach(locale => {
        // If theme have parent, create symlinks to all avaliabe files and then overwitte only neccessary
        if (theme.parent) {
          const parentSrc = config.projectPath
            + 'var/view_preprocessed/frontools'
            + config.themes[theme.parent].dest.replace('pub/static', '');

          generateSymlinks(
            parentSrc,
            themeDest + '/' + locale,
            [parentSrc],
            ['!/**/i18n/**']
          );
        }

        // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
        generateSymlinks(
          themeSrc,
          themeDest + '/' + locale,
          [themeSrc],
          ['!/**/i18n/**']
        );

        // Overwritte parent/current theme symlinks with locale specific files
        generateSymlinks(
          themeSrc + '/**/i18n/' + locale,
          themeDest + '/' + locale,
          [themeSrc, '/i18n/' + locale]
        );
      });
    }
  });
};
