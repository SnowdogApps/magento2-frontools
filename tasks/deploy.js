'use strict';
module.exports = function () {
  // Global variables
  const plugins  = this.opts.plugins,
        execSync = require('child_process').execSync,
        config   = this.opts.configs,
        themes   = plugins.getThemes(),
        prod     = plugins.util.env.prod || false;


  themes.forEach(name => {
    const theme = config.themes[name];
    if (theme.lang === 'scss') {
      const src       = config.projectPath + theme.src,
            dest      = config.projectPath + theme.dest,
            srcPaths  = plugins.globby.sync(src + '/**/web/**', { nodir: true, ignore: '/**/node_modules/**' }),
            destPaths = [];

      if (theme.parent) {
        const parentTheme     = config.themes[theme.parent],
              parentSrc       = config.projectPath + parentTheme.src,
              parentSrcPaths  = plugins.globby.sync(parentSrc + '/**/web/**', { nodir: true, ignore: '/**/node_modules/**' }),
              parentDestPaths = [];

        parentSrcPaths.forEach(srcPath => {
          plugins.fs.symlinkSync(srcPath, srcPath.replace('/web', '').replace(parentSrc, dest));
        });
      }

      srcPaths.forEach(srcPath => {
        const destPath = srcPath.replace('/web', '').replace(src, dest);
        plugins.fs.unlinkSync(destPath);
        plugins.fs.symlinkSync(srcPath, destPath);
      });
    }
    else if (theme.lang === 'less' && theme.default) {
      // Loop through locales, because you are required to specify a locale
      theme.locale.forEach(locale => {
        // if it's default theme, create symlinks to styles files via Magento CLI
        // porting "@magento-import" to node.js might be time consuming
        // and it's not so useful for front-end developers
        // execSync to keep process synchronous and wait till CLI do the job
        execSync(config.projectPath + 'bin/magento dev:source-theme:deploy'
        + ' --type=' + theme.lang
        + ' --locale=' + locale
        + ' --area=' + theme.area
        + ' --theme=' + theme.vendor + '/' + theme.name
        + ' ' + theme.files.join(' '));
      });
    }
  });
};
