module.exports = function() {
  // Global variables
  var plugins = this.opts.plugins;

  // Display formatted readme.md
  plugins.marked.setOptions({
    renderer: new plugins.markedTerminal()
  });

  console.log(plugins.marked(plugins.fs.readFileSync('./readme.md', 'UTF-8')));
};
