'use strict';
module.exports = function() {
  // Open browser-sync session and start watchers
  this.opts.plugins.runSequence('browser-sync', 'watch');
};
