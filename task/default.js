'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins = this.opts.plugins;

  // Display formatted readme.md
  plugins.marked.setOptions({
    renderer: new plugins.markedTerminal()
  });

  // eslint-disable-next-line no-console
  console.log(plugins.marked(plugins.fs.readFileSync('./README.md', 'UTF-8')));
};
