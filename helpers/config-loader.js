module.exports = function(file, plugins, config) {
  // Check if file exists inside of config directory
  if (plugins.globby.sync(config.projectPath + 'dev/tools/frontools/configs/' + file).length) {
    return require(config.projectPath + 'dev/tools/frontools/configs/' + file);
  }
  else if (plugins.globby.sync('./config/' + file).length) {
    return require('../config/' + file);
  }
  else {
    plugins.util.log(
      plugins.util.colors.red('\n========================================= \n')
      + plugins.util.colors.yellow('You have to create ')
      + plugins.util.colors.blue('config/' + file)
      + plugins.util.colors.red('\n=========================================')
    );
    throw new plugins.util.PluginError({
      plugin: 'config',
      message: 'You have to create dev/tools/frontools/configs/' + file + ' inside of your project root'
    });
  }
};
