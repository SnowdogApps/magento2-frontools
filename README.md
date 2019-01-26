[![Travis branch](https://img.shields.io/travis/SnowdogApps/magento2-frontools/master.svg)](https://travis-ci.org/SnowdogApps/magento2-frontools) [![Packagist](https://img.shields.io/packagist/v/snowdog/frontools.svg)](https://packagist.org/packages/snowdog/frontools) [![Packagist](https://img.shields.io/packagist/dt/snowdog/frontools.svg)](https://packagist.org/packages/snowdog/frontools) [![Greenkeeper badge](https://badges.greenkeeper.io/SnowdogApps/magento2-frontools.svg)](https://greenkeeper.io/)

# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

## Questions
If you want to know more about this project, let's join [Magento Community Engineering Slack](https://tinyurl.com/engcom-slack) and ask questions on #magefront channel.

## Requirements
* Unix-like OS (please, do not ask about Windows support)
* Node.js LTS version (currently branch v6). We recommend to use [avn](https://github.com/wbyoung/avn) to automate version switching. Required configuration is already added to repository as `.node-version` file.
* Gulp CLI global package - `yarn global add gulp-cli` or `npm install -g gulp-cli`
* Magento 2 project with SASS based theme i.e. [SASS version of "Blank"](https://github.com/SnowdogApps/magento2-theme-blank-sass)

## Installation
1. Run `composer require snowdog/frontools`
2. Go to package directory `cd vendor/snowdog/frontools`
3. Run `yarn` or `npm install`
4. Decide where you want to keep your config files.
You can store them in Frontools `config` directory or in `dev/tools/frontools/config`.
There is a `gulp setup` task to copy all sample config files from the `config` to `dev/tools/frontools/config` and create a convenient symlink `tools` in the project root.
If you want to keep config files inside frontools `config` dir, you have to handle this manually.
5. Define your themes in `themes.json`.

## `themes.json` structure
Check `config/themes.json.sample` to get samples.
- `src` - full path to theme
- `dest` - full path to `pub/static/[theme_area]/[theme_vendor]/[theme_name]`
- `destReplace` - if desination is not `pub/static` change this. example `app/design`
- `locale` - array of available locales
- `parent` - name of parent theme
- `stylesDir` - (default `styles`) path to styles directory. For `theme-blank-sass` it's `styles`. By default Magento 2 use `web/css`.
- `disableSuffix` - disable adding `.min` suffix using `--prod` flag.
- `postcss` - (deafult `["plugins.autoprefixer()"]`) PostCSS plugins config. Have to be an array.
- `modules` - list of modules witch you want to map inside your theme
- `ignore` - array of ignore patterns

## `watcher.json` structure
Check `config/watcher.json.sample` to get samples.
- `usePolling` - set this to `true` to successfully watch files over a network (i.e. Docker or Vagrant) or when your watcher dosen't work well. Warining, enabling this option may lead to high CPU utilization! [chokidar docs](https://github.com/paulmillr/chokidar#performance)

## Optional configurations for 3rd party plugins
You will find sample config files for theses plugins in `vendor/snowdog/frontools/config` directory.
* Create [browserSync](https://www.browsersync.io/) configuration
* Create [eslint](https://github.com/adametry/gulp-eslint) configuration
* Create [sass-lint](https://github.com/sasstools/sass-lint) configuration
* Create [stylelint](https://github.com/stylelint/stylelint) configuration
* Create [svg-sprite](https://github.com/jkphl/gulp-svg-sprite) configuration

## Tasks list
* `babel` - Run [Babel](https://babeljs.io/), a compiler for writing next generation JavaScript.
  * `--theme name` - Process single theme.
  * `--prod` - Production output - minifies and uglyfy code.
* `clean` - Removes `/pub/static` directory content.
* `csslint` - Run [stylelint](https://github.com/stylelint/stylelint) based tests.
  * `--theme name` - Process single theme.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `default` - type `gulp` to see this readme in console.
* `dev` - Runs [browserSync](https://www.browsersync.io/) and `inheritance`, `babel`, `styles`, `watch` tasks.
  * `--theme name` - Process single theme.
  * `--disableLinting` - Disable SASS and CSS linting.
  * `--disableMaps` - Disable inline source maps generation.
* `email-fix` - Fixes email stylesheet for Magento < 2.3.0. [Related issue](https://github.com/MyIntervals/emogrifier/issues/296)
  * `--prod` - Production output - minifies styles and add `.min` sufix.
* `eslint` - Watch and run [eslint](https://github.com/adametry/gulp-eslint) on specified JS file.
  * `--file fileName` - You have to specify what file you want to lint, fileName without .js.
* `inheritance` - Create necessary symlinks to resolve theme styles inheritance and make the base for styles processing. You have to run in before styles compilation and after adding new files.
* `sasslint` - Run [sass-lint](https://github.com/sasstools/sass-lint) based tests.
  * `--theme name` - Process single theme.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `setup` - Creates a convenient symlink from `/tools` to `/vendor/snowdog/frontools` and copies all sample files if no configuration exists.
  * `--symlink name` - If you don't want to use `tools` as the symlink you can specify another name.
* `styles` - Use this task to manually trigger styles processing pipeline.
  * `--theme name` - Process single theme.
  * `--disableMaps` - Disable inline source maps generation.
  * `--prod` - Production output - minifies styles and add `.min` sufix.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `svg` - Run [svg-sprite](https://github.com/jkphl/gulp-svg-sprite) to generate SVG sprite.
  * `--theme name` - Process single theme.
* `watch` - Watch for style changes and run processing tasks.
  * `--theme name` - Process single theme.
  * `--disableLinting` - Disable SASS and CSS linting.
  * `--disableMaps` - Disable inline source maps generation.
