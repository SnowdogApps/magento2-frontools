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
    var themeIgnoreFiles = [];
    // Iterate through the config.themes to grab any ignored paths that
    // themers want to be excluded from the gulp.src() and sass compilation
    Object.keys(config.themes).forEach(name => {
      var ignored = config.themes[name].ignore ? config.themes[name].ignore : [];
      themeIgnoreFiles = themeIgnoreFiles.concat(ignored);
    });

    plugins.globby.sync(
      // Create an array of paths to symlink or ignore/exclude
      [src + '/**/*.scss', '!/.test'].concat(ignore).concat(themeIgnoreFiles)
    ).forEach(srcPath => {
      let destPath = dest + srcPath;
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

      // Create symlinks for theme modules
      if (theme.modules) {
        Object.keys(theme.modules).forEach(name => {
          const moduleSrc = config.projectPath + theme.modules[name];
          generateSymlinks(
            moduleSrc,
            themeDest,
            [
              [moduleSrc, '/' + name]
            ]
          );
        });
      }

      if (theme.parent) {
        const parentSrc = config.projectPath
          + 'var/view_preprocessed/frontools'
          + config.themes[theme.parent].dest.replace('pub/static', '');

        generateSymlinks(parentSrc, themeDest, parentSrc);
      }

      // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
      generateSymlinks(themeSrc, themeDest, themeSrc);
    }
    // Create symlinks for themes with per locale modifcations
    else {
      // We have to handle every locale independly, b/c of possible overwrites
      theme.locale.forEach(locale => {
        // Create symlinks for theme modules
        if (theme.modules) {
          Object.keys(theme.modules).forEach(name => {
            const moduleSrc = config.projectPath + theme.modules[name];
            generateSymlinks(
              moduleSrc,
              themeDest + '/' + locale,
              [
                [moduleSrc, '/' + name]
              ],
              ['!/**/i18n/**']
            );
          });
        }

        // If theme have parent, create symlinks to all avaliabe files and then overwitte only neccessary
        if (theme.parent) {
          const parentSrc = config.projectPath
            + 'var/view_preprocessed/frontools'
            + config.themes[theme.parent].dest.replace('pub/static', '');

          generateSymlinks(
            parentSrc,
            themeDest + '/' + locale,
            parentSrc,
            ['!/**/i18n/**']
          );
        }

        // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
        generateSymlinks(
          themeSrc,
          themeDest + '/' + locale,
          themeSrc,
          ['!/**/i18n/**']
        );

        // Overwritte parent/current modules symlinks with locale specific files
        if (theme.modules) {
          Object.keys(theme.modules).forEach(name => {
            const moduleSrc = config.projectPath + theme.modules[name];
            generateSymlinks(
              moduleSrc + '/**/i18n/' + locale,
              themeDest + '/' + locale,
              [
                [moduleSrc, '/' + name],
                ['/i18n/' + locale, '']
              ]
            );
          });
        }

        // Overwritte parent/current theme symlinks with locale specific files
        generateSymlinks(
          themeSrc + '/**/i18n/' + locale,
          themeDest + '/' + locale,
          [
            [themeSrc, ''],
            ['/i18n/' + locale, '']
          ]
        );
      });
    }
  });
};
