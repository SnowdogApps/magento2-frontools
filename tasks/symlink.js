module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  // local plugins
  const fs = require('fs');

  fs.symlink(fs.realpathSync('./'), config.projectPath + '/tools', 'dir', () => {
    plugins.util.log(
      plugins.util.colors.green('Symlink created. Now you can use Frontools from "tools" directory at root of your project.')
    );
  });
};
