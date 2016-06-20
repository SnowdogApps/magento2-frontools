module.exports = function() {
  // Global variables
  var plugins = this.opts.plugins;

  // Open browser-sync session and start watchers
  plugins.runSequence('browser-sync', 'watch');
};
