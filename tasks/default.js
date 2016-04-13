module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // local plugins and configs
  const fs = require('fs');

  plugins.marked.setOptions({
    renderer: new plugins.markedTerminal()
  });

  console.log(plugins.marked(fs.readFileSync('./readme.md', 'UTF-8')));
}
