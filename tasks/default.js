module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // local plugins and configs
  var marked   = require('marked'),
      renderer = require('marked-terminal')
      fs       = require('fs');

  marked.setOptions({
    renderer: new renderer()
  });

  console.log(marked(fs.readFileSync('./readme.md', 'UTF-8')));
}
