'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes(),
        prod    = plugins.util.env.prod || false;

  plugins.runSequence('inheritance', 'clean', () => {
    themes.forEach(name => {
      const theme = config.themes[name];
      if (!theme.localeOverwrites) {
        const src  = config.tempPath + theme.dest.replace('pub/static', ''),
              dest = config.projectPath + theme.dest;

        plugins.globby.sync(
          [
            src + '/**/web/**',
            // temporaily remove babel files from this task
            '!/**/*.babel.js'
          ],
          { nodir: true }
        ).forEach(srcPath => {
          theme.locale.forEach(locale => {
            const destPath = dest + '/' + locale + srcPath
              .replace(src, '')
              .replace('web/', '');

            prod ? plugins.fs.copySync(srcPath, destPath) : plugins.fs.ensureSymlinkSync(srcPath, destPath);
          });
        });
      }
      else {
        theme.locale.forEach(locale => {
          const src  = config.tempPath + theme.dest.replace('pub/static', '') + '/' + locale,
                dest = config.projectPath + theme.dest;

          plugins.globby.sync(
            [
              src + '/**/web/**',
              // temporaily remove babel files from this task
              '!/**/*.babel.js'
            ],
            { nodir: true }
          ).forEach(srcPath => {
            const destPath = dest + '/' + locale + srcPath
              .replace(src, '')
              .replace('web/', '');

            prod ? plugins.fs.copySync(srcPath, destPath) : plugins.fs.ensureSymlinkSync(srcPath, destPath);
          });
        });
      }
    });
  });
};
