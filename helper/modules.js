const spawnSync = require('child_process').spawnSync

module.exports = function getEnabledMagentoModules(projectPath) {
  const process = spawnSync(
    'php',
    [projectPath + '/vendor/snowdog/frontools/php/get_modules.php']
  );

  return JSON.parse(process.stdout.toString());
};
