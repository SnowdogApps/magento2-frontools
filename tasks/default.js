module.exports = function() {
  // Global variables
  var plugins = this.opts.plugins;

  // Display formatted readme.md
  const fs = require('fs');

  plugins.marked.setOptions({
    renderer: new plugins.markedTerminal()
  });

  console.log(plugins.marked(fs.readFileSync('./readme.md', 'UTF-8')));
};
