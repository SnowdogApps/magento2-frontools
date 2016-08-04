'use strict';

const path = require('path');
const fs = require('fs');
const getModules = require('./modules');

function getThemePaths(themeName, themes) {
  const theme = themes[themeName];
  if (theme.parent) {
    return [theme.src].concat(getThemePaths(theme.parent, themes));
  }

  return [theme.src];
}

module.exports = function flattenThemeHierarchy(gulp, plugins, config, name, locale) {
  const themes = config.themes;
  const themePaths = getThemePaths(name, themes);

  const webPathMaps = [];
  webPathMaps.push([path.join(config.projectPath, 'lib/web'), '/']);

  const themeWebPaths = themePaths.map(function appendWebPath (themePath) {
    return path.join(
      config.projectPath,
      themePath,
      'web'
    );
  });

  themeWebPaths.forEach(function addThemeToPathMap (themePath) {
    webPathMaps.push([themePath, '/']);
  });

  const themeI18nWebPaths = themePaths.map(function appendI18NPath (themePath) {
    return path.join(
      config.projectPath,
      themePath,
      'web/i18n',
      locale
    );
  });

  themeI18nWebPaths.forEach(function addThemeToPathMap (themePath) {
    webPathMaps.push([themePath, '/']);
  });

  const modules = getModules(config.projectPath);

  Object.keys(modules).forEach(function addModuleToPathMap (moduleName) {
    webPathMaps.push([path.join(modules[moduleName], 'view/base/web'), moduleName]);
    webPathMaps.push([path.join(modules[moduleName], 'view', themes[name].area, 'web'), moduleName]);
    webPathMaps.push([path.join(modules[moduleName], 'view/base/web/i18n', locale), moduleName]);
    webPathMaps.push([path.join(modules[moduleName], 'view', themes[name].area, 'web/i18n', locale), moduleName]);

    themePaths.forEach(function addModuleThemeOverrides (themePath) {
      webPathMaps.push([path.join(
        config.projectPath,
        themePath,
        moduleName,
        'web'
      ), moduleName]);

      webPathMaps.push([path.join(
        config.projectPath,
        themePath,
        moduleName,
        'web/i18n',
        locale
      ), moduleName]);
    });
  });

  const staticFiles = {};

  webPathMaps.forEach(function globForStaticFiles (map) {
    const source = map[0];
    const destination = map[1];

    const results = plugins.globby.sync(
      '**/*',
      {
        cwd: source,
        nodir: true,
      }
    );

    results.forEach(function (result) {
      staticFiles[path.join(destination, result)] = path.join(source, result);
    });
  });

  Object.keys(staticFiles).forEach(function makeSymlinkForStaticFile(staticFile) {
    const source = staticFiles[staticFile];
    const location = path.join(
      config.projectPath,
      'var/frontools',
      name,
      locale,
      staticFile
    );

    plugins.mkdirp.sync(path.dirname(location));
    fs.symlinkSync(source, location);
  });

  // do stuff
  // Find all files in /lib/web/
  // Iterate through all themes' web/
  // Iterate through all themes' web/i18n/{locale}/
  // Iterate through all modules' view/base/web/
  // Iterate through all modules' view/{area}/web/
  // Iterate through all themes' Module_Name/web/
  // Iterate through all modules' view/base/web/i18n/{locale}/
  // Iterate through all modules' view/{area}/web/i18n/{locale}/
  // Iterate through all themes' Module_Name/web/i18n/{locale}
  //
  // Maintain the above as map of file location to accessible URL under pub/static/...
  //
  // Then loop through and write out and create all directories, then create all file symlinks.
  //
  // Then this task is done, and I need to change scss task to work on that directory.
  // Then write JS task.
};
