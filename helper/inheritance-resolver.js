'use strict';
module.exports = function(plugins, config, name) { // eslint-disable-line func-names
  const path        = require('path'),
        ignorePaths = config.themes[name].ignore || [];

  function generateSymlinks(src, dest, replacePattern, ignore = []) {
    src = path.normalize(src);
    dest = path.normalize(dest);

    if (Array.isArray(replacePattern)) {
      replacePattern = replacePattern.map(pattern => {
        pattern[0] = path.normalize(pattern[0]);
        if (pattern[1] !== '') {
          pattern[1] = path.normalize(pattern[1]);
        }
        return pattern;
      });
    }
    else {
      replacePattern = path.normalize(replacePattern);
    }

    plugins.globby.sync(
      [src + '/**']
        .concat(ignorePaths.map(pattern => '!/**/' + pattern))
        .concat(ignore.map(pattern => '!/**/' + pattern + '/**')),
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
      plugins.fs.ensureSymlinkSync(srcPath, destPath);
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
              ['i18n']
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
            ['i18n']
          );
        }

        // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
        generateSymlinks(
          themeSrc,
          themeDest + '/' + locale,
          themeSrc,
          ['i18n']
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
