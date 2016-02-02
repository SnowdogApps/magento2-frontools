module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  plugins.util.env.prod = true;
  plugins.runSequence(['clean', 'deploy', 'styles']);
};
