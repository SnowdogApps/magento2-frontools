module.exports = function() {
  var execSync = require('child_process').execSync;

  return execSync('rm -rf ../pub/static');
};
