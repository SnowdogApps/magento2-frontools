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
    theme.locale.forEach(locale => {
      const themePath = theme.default ? theme.dest + '/' + locale : theme.src;
      if (theme.lang === 'less') {
        let files = plugins.globby.sync([
              config.projectPath + themePath + '/**/*.' + theme.lang,
              '!' + config.projectPath + themePath + '/**/_*.' + theme.lang
            ], { ignore: '/**/node_modules/**' }),
            dependencyTreeBuilder = require('../helper/dependency-tree-builder');

        files.forEach(file => {
          let compiler = require('../helper/' + theme.lang)(gulp, plugins, config, name, locale, file);
          gulp.watch(dependencyTreeBuilder(theme, file, plugins), () => {
            compiler();
          });
        });
      }
      else {
        let files = plugins.globby.sync(
              config.projectPath + themePath + '/**/*.' + theme.lang,
              { ignore: '/**/node_modules/**' }
            ),
            compiler = require('../helper/' + theme.lang)(
              gulp, plugins, config, name, locale,
              config.projectPath + themePath + '/**/*.' + theme.lang
            );

        gulp.watch(files, () => {
          compiler();
        });
      }
    });
  });
};
