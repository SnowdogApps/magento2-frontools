module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  // local vars
  var themeName = plugins.util.env.theme || false,
      themes    = themeName ? [themeName] : Object.keys(config.themes);

  themes.forEach(name => {
    var theme = config.themes[name];
    theme.locale.forEach(locale => {
      var themePath = theme.default ? theme.dest + '/' + locale : theme.src,
          files = plugins.globby.sync(
            [
              config.projectPath + themePath + '/**/*.' + theme.lang,
              '!' + config.projectPath + themePath + '/**/_*.' + theme.lang
            ]
          );

      if (theme.lang === 'less') {
        var dependencyTreeBuilder = require('../helpers/dependency-tree-builder');
        files.forEach(file => {
          var compiler = require('../helpers/' + theme.lang)(gulp, plugins, config, name, locale, file);
          gulp.watch(dependencyTreeBuilder(theme, file), () => {
            compiler();
          });
        });
      }
      else {
        var compiler = require('../helpers/' + theme.lang)(
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
