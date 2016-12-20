'use strict';
module.exports = function(plugins, config, name) { // eslint-disable-line func-names
  const theme     = config.themes[name],
        themeSrc  = config.projectPath + theme.src,
        themeDest = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', '');

  // Clean destination dir before generating new symlinks
  plugins.fs.removeSync(themeDest);

  function createSymlink(srcPath, destPath) {
    try {
      plugins.fs.ensureFileSync(destPath);
      plugins.fs.unlinkSync(destPath);
    }
    finally {
      plugins.fs.symlinkSync(srcPath, destPath);
    }
  }

  // Create symlinks for themes without any per locale modifcations
  if (!theme.localeOverwrites) {
    // If theme have (multiple) parent(s), create symlinks to all avaliabe files and then overwite only neccessary
    if (theme.parent) {
      theme.parent.forEach(parent => {
	    const parentSrc = config.projectPath + config.themes[parent].src;
	    plugins.globby.sync([
	      parentSrc + '/**/*.' + theme.lang,
	      '!/**/node_modules/**'
	    ]).forEach(srcPath => {
	      createSymlink(
	        srcPath,
	        themeDest + srcPath.replace(parentSrc, '').replace('/web', '')
	      );
	    });
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
      // If theme have (multiple) parent(s), create symlinks to all avaliabe files and then overwitte only neccessary
      if (theme.parent) {
        theme.parent.forEach(parent => {
	      const parentSrc = config.projectPath + config.themes[parent].src;
	      plugins.globby.sync([
	        parentSrc + '/**/*.' + theme.lang,
	        '!/**/node_modules/**'
	      ]).forEach(srcPath => {
	        createSymlink(
	          srcPath,
	          themeDest + srcPath.replace(parentSrc, '').replace('/web', '')
	        );
	      });
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
};
