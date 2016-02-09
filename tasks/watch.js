module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // local vars
  var globby    = require('globby');
      themeName = plugins.util.env.theme || false,
      themes    = themeName ? [themeName] : Object.keys(configs.themes);

  themes.forEach(name => {
    var theme = configs.themes[name];
    theme.locale.forEach(locale => {
      var themePath = theme.default ? theme.dest : theme.src,
          files = globby.sync(
            [
              themePath + '/**/*.' + theme.lang,
              '!' + themePath + '/**/_*.' + theme.lang
            ]
          );
      files.forEach(file => {
        var dependencyTree = require('../helpers/dependency-tree-builder')(theme, file);
        gulp.watch(dependencyTree, () => {
          configs.currentWatchFile = file;
          plugins.runSequence(theme.lang + ':' + name + ':' + locale);
        });
      });
    });
  });
};
