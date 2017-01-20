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

  function themeDependencyTree(themeName, dependencyTree) {
    dependencyTree = dependencyTree ? dependencyTree : [];
    dependencyTree.push(themeName);
    if (config.themes[themeName].parent) {
      return themeDependencyTree(config.themes[themeName].parent, dependencyTree);
    }
    else {
      return dependencyTree.reverse();
    }
  }

  themeDependencyTree(name).forEach(themeName => {
    const theme = config.themes[themeName],
          themeSrc = config.projectPath + theme.src,
          themeDest = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', '');

    // Clean destination dir before generating new symlinks
    plugins.fs.removeSync(themeDest);

    // Create symlinks for themes without any per locale modifcations (default)
    if (!theme.localeOverwrites) {
      if (theme.parent) {
        const parentSrc = config.projectPath + 'var/view_preprocessed/frontools' + config.themes[theme.parent].dest.replace('pub/static', '');
        plugins.globby.sync([
          parentSrc + '/**/*.' + theme.lang,
          '!/**/node_modules/**'
        ]).forEach(srcPath => {
          createSymlink(
            srcPath,
            themeDest + srcPath.replace(parentSrc, '')
          );
        });
      }

      // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
      plugins.globby.sync([
        themeSrc + '/**/*.' + theme.lang,
        '!/**/node_modules/**'
      ]).forEach(srcPath => {
        createSymlink(
          srcPath,
          themeDest + srcPath.replace(themeSrc, '')
        );
      });
    }
    // Create symlinks for themes with per locale modifcations
    else {
      // We have to handle every locale independly, b/c of possible overwrites
      theme.locale.forEach(locale => {
        // If theme have parent, create symlinks to all avaliabe files and then overwitte only neccessary
        if (theme.parent) {
          const parentSrc = config.projectPath + 'var/view_preprocessed/frontools' + config.themes[theme.parent].dest.replace('pub/static', '');
          plugins.globby.sync([
            parentSrc + '/**/*.' + theme.lang,
            '!/**/i18n/**',
            '!/**/node_modules/**'
          ]).forEach(srcPath => {
            createSymlink(
              srcPath,
              themeDest + '/' + locale + srcPath.replace(parentSrc, '')
            );
          });
        }

        // Create symlinks to all files in this theme. Will overwritte parent symlinks if exist.
        plugins.globby.sync([
          themeSrc + '/**/*.' + theme.lang,
          '!/**/i18n/**',
          '!/**/node_modules/**'
        ]).forEach(srcPath => {
          createSymlink(
            srcPath,
            themeDest + '/' + locale + srcPath.replace(themeSrc, '')
          );
        });

        // Overwritte parent/current theme symlinks with locale specific files
        plugins.globby.sync([
          themeSrc + '/**/i18n/' + locale + '/**/*.' + theme.lang,
          '!/**/node_modules/**'
        ]).forEach(srcPath => {
          createSymlink(
            srcPath,
            themeDest + '/' + locale + srcPath.replace(themeSrc, '').replace('/i18n/' + locale, '')
          );
        });
      });
    }
  });
};
