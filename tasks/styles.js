module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  // local vars
  var themeName = plugins.util.env.theme || false,
      themes = themeName ? [themeName] : Object.keys(config.themes);

  themes.forEach(name => {
    config.themes[name].locale.forEach(locale => {
      plugins.runSequence(config.themes[name].lang + ':' + name + ':' + locale);
    });
  });
};
