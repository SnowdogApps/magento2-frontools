'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();

  // Watch files for changes and run appropriate compiler when they change
  themes.forEach(name => {
    const theme = config.themes[name];

    // Style files watching
    theme.locale.forEach(locale => {
      const themePath = theme.default ? theme.dest + '/' + locale : theme.src,
            files = plugins.globby.sync([
              config.projectPath + themePath + '/**/*.' + theme.lang,
              '!' + config.projectPath + themePath + '/**/_*.' + theme.lang
            ], { nodir: true, ignore: ['**/node_modules/**'] }),
            dependencyTreeBuilder = require('../helper/dependency-tree-builder');

      files.forEach(file => {
        const compiler = require('../helper/' + theme.lang)(gulp, plugins, config, name, locale, file);
        plugins.util.log(
          plugins.util.colors.green('Watching') + ' '
          + plugins.util.colors.blue(file.replace(config.projectPath, '')) + ' '
          + plugins.util.colors.green('and dependencies...')
        );
        gulp.watch(
          Array.from(new Set(dependencyTreeBuilder(theme, file, plugins))),
          event => {
            plugins.util.log(
              plugins.util.colors.green('File') + ' '
              + plugins.util.colors.blue(event.path.replace(config.projectPath, '')) + ' '
              + plugins.util.colors.green('changed.')
            );
            compiler();
          }
        );
      });
    });

    // Watching files that require reload after save
    gulp.watch(
      // I'm usng globby manually, b/c it's a loooot faster
      plugins.globby.sync([
        config.projectPath + theme.src + '/**/*.{html,phtml,xml,csv,js}',
        '!' + config.projectPath + theme.src + '/**/node_modules/**'
      ]),
      event => {
        plugins.util.log(
          plugins.util.colors.green('File') + ' '
          + plugins.util.colors.blue(event.path.replace(config.projectPath, '')) + ' '
          + plugins.util.colors.green('changed.')
        );
        plugins.browserSync.reload();
      }
    );
  });
};
