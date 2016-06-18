module.exports = function() {
  // Global variables
  var plugins = this.opts.plugins,
      config  = this.opts.configs;

  // Check if --theme <theme-name> is defined, if it is, we only deploy that one
  var themeName = plugins.util.env.theme || false,
      themes = themeName ? [themeName] : Object.keys(config.themes);

  // Don't panic, !! is no magic voodoo, it just converts an object to a boolean (true if it exists, false if not)
  if (!!config.themes[themeName] && !config.themes[themeName].default) {
    plugins.util.log(
      plugins.util.colors.red.bold('[Warining] ')
      + plugins.util.colors.yellow('This tasks is designed only for LESS themes which use ')
      + plugins.util.colors.blue('@magento-import')
    );
  } else {
    const execSync = require('child_process').execSync;

    // Execute bin/magento dev:source:theme:deploy for every theme
    themes.forEach(name => {
      // Loop through locales, because you are required to specify a locale
      config.themes[name].locale.forEach(locale => {
        var theme = config.themes[name];

        // Only execute the command when this theme is a theme using @magento-import
        if (theme.default) {
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
    });
  }
};
