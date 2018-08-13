'use strict';
module.exports = function(resolve) { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();

  config.watcher = require('../helper/config-loader')('watcher.json', plugins, config);

  plugins.path                 = require('path');
  plugins.helper               = {};
  plugins.helper.babel         = require('../helper/babel');
  plugins.helper.cssLint       = require('../helper/css-lint');
  plugins.helper.dependecyTree = require('../helper/dependency-tree-builder');
  plugins.helper.inheritance   = require('../helper/inheritance-resolver');
  plugins.helper.sass          = require('../helper/scss');
  plugins.helper.sassLint      = require('../helper/sass-lint');
  plugins.helper.svg           = require('../helper/svg');

  plugins.util.log(
    plugins.util.colors.yellow('Initializing watcher...')
  );

  themes.forEach(name => {
    const theme = config.themes[name],
          themeTempSrc = config.tempPath + theme.dest.replace('pub/static', ''),
          themeDest = config.projectPath + theme.dest,
          themeSrc = [config.projectPath + theme.src];

    // Add modules source directeoried to theme source paths array
    if (theme.modules) {
      Object.keys(theme.modules).forEach(module => {
        themeSrc.push(config.projectPath + theme.modules[module]);
      });
    }

    // Chokidar watcher config
    const watcherConfig = { // eslint-disable-line one-var
      ignoreInitial: true,
      usePolling: config.watcher.usePolling
    };

    // Initialize watchers
    const tempWatcher = plugins.chokidar.watch(themeTempSrc, watcherConfig), // eslint-disable-line one-var
          srcWatcher = plugins.chokidar.watch(themeSrc, watcherConfig),
          destWatcher = plugins.chokidar.watch(themeDest, watcherConfig);

    let reinitTimeout = false,
        reinitPaths = [],
        sassDependecyTree = {};

    function generateSassDependencyTree() {
      // Cleanup tree
      sassDependecyTree = {};

      // Find all main SASS files
      plugins.globby.sync([
        themeTempSrc + '/**/*.+(sass|scss)'
      ]).forEach(file => {
        // Generate array of main file dependecies
        
        sassDependecyTree[file] = plugins.helper.dependecyTree(plugins, file);

      });
    }

    generateSassDependencyTree();

    function reinitialize(path) {
      // Reset previously set timeout
      clearTimeout(reinitTimeout);
      reinitPaths.push(path);

      // Timeout to run only once while moving or renaming files
      reinitTimeout = setTimeout(() => {
        const paths = reinitPaths;
        reinitPaths = [];

        plugins.util.log(
          plugins.util.colors.yellow('Change detected.') + ' ' +
          plugins.util.colors.green('Theme:') + ' ' +
          plugins.util.colors.blue(name) + ' ' +
          plugins.util.colors.green(`${paths.length} file(s) changed`)
        );

        plugins.util.log(
          plugins.util.colors.yellow('Resolving inheritance.') + ' ' +
          plugins.util.colors.green('Theme:') + ' ' +
          plugins.util.colors.blue(name)
        );

        // Disable watcher to not fire tons of events while solving inheritance
        tempWatcher.unwatch(themeTempSrc);

        // Run inheritance resolver just for one theme without parent(s)
        plugins.helper.inheritance(plugins, config, name, false).then(() => {
          // Regenerate SASS Dependency Tree
          generateSassDependencyTree();

          // Add all files to watch again after solving inheritance
          tempWatcher.add(themeTempSrc);

          // Emit event on added / moved / renamed / deleted file to trigger regualr pipeline
          paths.forEach(path => {
            if (plugins.fs.existsSync(path)) {
              plugins.globby.sync(themeTempSrc + '/**/' + plugins.path.basename(path))
                .forEach(file => {
                  tempWatcher.emit('change', file);
                });
            }
          });
        });
      }, 100);
    }

    // Watch add / move / rename / delete events on source files
    srcWatcher
      .on('add', reinitialize)
      .on('addDir', reinitialize)
      .on('unlink', reinitialize)
      .on('unlinkDir', reinitialize);

    // print msg when temp dir watcher is initialized
    tempWatcher.on('ready', () => {
      plugins.util.log(
        plugins.util.colors.yellow('Watcher initialized!') + ' ' +
        plugins.util.colors.green('Theme:') + ' ' +
        plugins.util.colors.blue(name) + ' ' +
        plugins.util.colors.green('and dependencies...')
      );
    });

    // Events handling
    tempWatcher.on('change', path => {
      // Print message to know what's going on
      plugins.util.log(
        plugins.util.colors.yellow('Change detected.') + ' ' +
        plugins.util.colors.green('Theme:') + ' ' +
        plugins.util.colors.blue(name) + ' ' +
        plugins.util.colors.green('File:') + ' ' +
        plugins.util.colors.blue(plugins.path.relative(themeTempSrc, path))
      );

      // SASS Lint
      if (!plugins.util.env.disableLinting) {
        if (plugins.path.extname(path) === '.sass' || plugins.path.extname(path) === '.scss') {
          plugins.helper.sassLint(gulp, plugins, config, name, path);
        }
      }

      // SASS Compilation
      if (plugins.path.extname(path) === '.sass' || plugins.path.extname(path) === '.scss') {
        Object.keys(sassDependecyTree).forEach(file => {
          if (sassDependecyTree[file].includes(path)) {
            plugins.helper.sass(gulp, plugins, config, name, file);
          }
        });
      }

      // Babel
      if (plugins.path.basename(path).includes('.babel.js')) {
        plugins.helper.babel(gulp, plugins, config, name, path);
      }

      // SVG Sprite
      if (plugins.path.extname(path) === '.svg') {
        plugins.helper.svg(gulp, plugins, config, name);
      }

      // Files that require reload after save
      if (['.html', '.phtml', '.xml', '.csv', '.js', '.vue'].some(
        ext => plugins.path.extname(path) === ext
      )) {
        plugins.browserSync.reload();
      }
    });

    destWatcher.on('change', path => {
      // CSS Lint
      if (!plugins.util.env.disableLinting) {
        if (plugins.path.extname(path) === '.css') {
          plugins.helper.cssLint(gulp, plugins, config, name, path);
        }
      }
    });
  });

  resolve();
};
