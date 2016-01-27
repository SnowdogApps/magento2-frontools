module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // local plugins and configs
  var help             = require('show-help'),
      marked           = require('marked'),
      TerminalRenderer = require('marked-terminal');

  marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer()
  });

  // Gulp task body
  return help({
    filename: './readme.md',
    transform: marked
  });
}
