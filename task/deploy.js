'use strict';
module.exports = function () {
  // Global variables
  const plugins  = this.opts.plugins,
        config   = this.opts.configs,
        themes   = plugins.getThemes(),
        prod     = plugins.util.env.prod || false,
        execSync = require('child_process').execSync;

  themes.forEach(name => {
    const theme = config.themes[name];
    if (theme.default) {
      // Loop through locales, because you are required to specify a locale
      theme.locale.forEach(locale => {
        // if it's default theme, create symlinks to styles files via Magento CLI
        // porting "@magento-import" to node.js might be time consuming
        // and it's not so useful for front-end developers
        // execSync to keep process synchronous and wait till CLI do the job
        execSync(
          config.projectPath + 'bin/magento dev:source-theme:deploy'
          + ' --type=' + theme.lang
          + ' --locale=' + locale
          + ' --area=' + theme.area
          + ' --theme=' + theme.vendor + '/' + theme.name
          + ' ' + theme.files.join(' ')
        );
      });
    }
    else {
      theme.locale.forEach(locale => {
        const src       = config.projectPath + theme.src,
              dest      = config.projectPath + theme.dest + '/' + locale,
              srcPaths  = plugins.globby.sync(src + '/**/web/**', { nodir: true, ignore: '/**/node_modules/**' }),
              destPaths = [];

        if (theme.parent) {
          const parentTheme     = config.themes[theme.parent],
                parentSrc       = config.projectPath + parentTheme.src,
                parentSrcPaths  = plugins.globby.sync(parentSrc + '/**/web/**', { nodir: true, ignore: '/**/node_modules/**' }),
                parentDestPaths = [];

          parentSrcPaths.forEach(srcPath => {
            const destPath = srcPath.replace('/web', '').replace(parentSrc, dest);
            try {
              plugins.fs.ensureFileSync(destPath);
              plugins.fs.unlinkSync(destPath);
            }
            finally {
              prod ? plugins.fs.copySync(srcPath, destPath) : plugins.fs.symlinkSync(srcPath, destPath);
            }
          });
        }

        srcPaths.forEach(srcPath => {
          const destPath = srcPath.replace('/web', '').replace(src, dest);
          try {
            plugins.fs.ensureFileSync(destPath);
            plugins.fs.unlinkSync(destPath);
          }
          finally {
            prod ? plugins.fs.copySync(srcPath, destPath) : plugins.fs.symlinkSync(srcPath, destPath);
          }
        });
      });
    }
  });
};
