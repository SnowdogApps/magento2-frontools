module.exports = function() {
  // Global variables
  var plugins = this.opts.plugins,
      config  = this.opts.configs;

  // Create a symlink from <project root>/tools to the root of this package
  const fs = require('fs');

  fs.symlink(fs.realpathSync('./'), config.projectPath + '/tools', 'dir', () => {
    plugins.util.log(
      plugins.util.colors.green('Symlink created. Now you can use Frontools from "tools" directory at root of your project.')
    );
  });
};
