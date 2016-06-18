module.exports = function() {
  // Global variables
  var plugins = this.opts.plugins,
      config  = this.opts.configs;

  // Create a relative symlink from <project root>/tools to the root of this package
  const fs = require('fs'),
        path = require('path');

  const relativeDirectory = path.relative(config.projectPath, fs.realpathSync('./'));
  fs.symlink(relativeDirectory, config.projectPath + '/tools', 'dir', () => {
    plugins.util.log(
      plugins.util.colors.green('Symlink created. Now you can use Frontools from "tools" directory at root of your project.')
    );
  });
};
