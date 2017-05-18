[![Travis branch](https://img.shields.io/travis/SnowdogApps/magento2-frontools/master.svg?maxAge=2592000)](https://travis-ci.org/SnowdogApps/magento2-frontools) [![Packagist](https://img.shields.io/packagist/v/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools) [![Packagist](https://img.shields.io/packagist/dt/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools) [![Greenkeeper badge](https://badges.greenkeeper.io/SnowdogApps/magento2-frontools.svg)](https://greenkeeper.io/)

# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

## Questions
If you have any questions about this project let's go to offical Magento forum - [Less to Sass Community Project](https://community.magento.com/t5/Less-to-Sass-Community-Project/bd-p/less-to-sass)

## LESS themes support
LESS support was dropped in version 1.0.0. Feel free to use an older version (0.11.4 and lower) or create a fork and customize newer versions to fit your needs.

## NPM and Yarn support
Up from version 1.0.0 we are supporting both Node.js packages managers. If you want to keep modules in safe versions all the time, use Yarn, `yarn.lock` is already added to the repository.

## Requirements
* Node.js LTS version (v6 branch). We recommend to use [avn](https://github.com/wbyoung/avn) to automate version switching. Required configuration is already added to repository as `.node-version` file.
* Gulp CLI global package - `npm install -g gulp-cli` or `yarn global add gulp-cli`
* Magento 2 project with SASS based theme i.e. [SASS version of "Blank"](https://github.com/SnowdogApps/magento2-theme-blank-sass)

## Installation
1. Run `composer require snowdog/frontools`
2. Go to package directory `cd vendor/snowdog/frontools`
3. Run `yarn` or `npm install`
4. Decide where you want to keep your config files.
You can store them in Frontools `config` directory or in `dev/tools/frontools/config`.
There is a `gulp setup` task to copy all sample config files from the `config` to `dev/tools/frontools/config` and create a convenient symlink `tools` in the project root.
If you want to keep config files inside frontools `config` dir, you have to handle this manually.
5. Define your themes in `themes.js`.

## `themes.js` structure
Check `config/themes.js.sample` to get samples.
- `src` - full path to theme
- `dest` - full path to `pub/static/[theme_area]/[theme_vendor]/[theme_name]`
- `locale` - array of available locales
- `localeOverwrites` - (default `false`) set to `true` if you want to overwrite some styles for specifilc language. Remember that path to overwriting file has to be same as base file after removing `/i18n/{lang_code}`.
- `parent` - name of parent theme
- `stylesDir` - (default `styles`) path to styles directory. For `theme-blank-sass` it's `styles`. By default Magento 2 use `web/css`.
- `postcss` - (default `plugins => [plugins.autoprefixer()]`) PostCSS plugins config.
    A callback that receives the `plugins` object as a parameter and returns an
    array of plugins.
    You can also inject plugins from a local package.json, e.g.:
    `plugins => [plugins.autoprefixer(), require('postcss-inline-svg')]`
- `modules` - list of modules witch you want to map inside your theme
- `ignore` - array of ignore patterns

## Optional configurations for 3rd party plugins
You will find sample config files for theses plugins in `vendor/snowdog/frontools/config` directory.
* Create [browserSync](https://www.browsersync.io/) configuration
* Create [eslint](https://github.com/adametry/gulp-eslint) configuration
* Create [sass-lint](https://github.com/sasstools/sass-lint) configuration
* Create [stylelint](https://github.com/stylelint/stylelint) configuration

## Tasks list
* `babel` - Run [Babel](https://babeljs.io/), a compiler for writing next generation JavaScript.
  * `--theme name` - Process single theme.
  * `--prod` - Production output - minifies and uglyfy code.
* `browser-sync` - Run [browserSync](https://www.browsersync.io/).
* `clean` - Removes `/pub/static` directory content.
* `csslint` - Run [stylelint](https://github.com/stylelint/stylelint) based tests.
  * `--theme name` - Process single theme.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `default` - type `gulp` to see this readme in console.
* `deploy` - Symlink or copy all static assets to `pub/static`. Runs `clean` and `inheritance` tasks.
  * `--theme name` - Specify theme to deploy.
  * `--prod` - Copy files instead of making symlinks.
* `dev` - Runs `browser-sync`, `inheritance` and `watch`  tasks.
  * `--theme name` - Process single theme.
  * `--disableLinting` - Disable SASS and CSS linting.
  * `--disableMaps` - Toggles source maps generation.
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
  * `--disableMaps` - Toggles source maps generation.
  * `--prod` - Production output - minifies styles and add `.min` sufix.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `watch` - Watch for style changes and run processing tasks.
  * `--theme name` - Process single theme.
  * `--disableLinting` - Disable SASS and CSS linting.
  * `--disableMaps` - Enable inline source maps generation.
