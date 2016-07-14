module.exports = function() {
  // Global variables
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  // Check if --theme <theme-name> is defined, if it is, we only watch that one
  var themeName = plugins.util.env.theme || false,
      themes    = themeName ? [themeName] : Object.keys(config.themes);

  // Watch files for changes and run appropriate compiler when they change
  themes.forEach(name => {
    var theme = config.themes[name];
    theme.locale.forEach(locale => {
      var themePath = theme.default ? theme.dest + '/' + locale : theme.src;
      if (theme.lang === 'less') {
        var files = plugins.globby.sync(
              [
                config.projectPath + themePath + '/**/*.' + theme.lang,
                '!' + config.projectPath + themePath + '/**/_*.' + theme.lang,
                '!' + config.projectPath + themePath + '/**/node_modules/**/*.' + theme.lang,
              ]
            ),
            dependencyTreeBuilder = require('../helpers/dependency-tree-builder');

        files.forEach(file => {
          var compiler = require('../helpers/' + theme.lang)(gulp, plugins, config, name, locale, file);
          gulp.watch(dependencyTreeBuilder(theme, file, plugins), () => {
            compiler();
          });
        });
      }
      else {
        var files = plugins.globby.sync(
              [
                config.projectPath + themePath + '/**/*.' + theme.lang,
                '!' + config.projectPath + themePath + '/**/node_modules/**/*.' + theme.lang,
              ]
            ),
            compiler = require('../helpers/' + theme.lang)(
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
