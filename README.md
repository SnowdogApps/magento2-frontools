[![Travis branch](https://img.shields.io/travis/SnowdogApps/magento2-frontools/master.svg?maxAge=2592000)](https://travis-ci.org/SnowdogApps/magento2-frontools) [![Packagist](https://img.shields.io/packagist/v/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools) [![Packagist](https://img.shields.io/packagist/dt/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools)

# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

## Questions
If you have any questions about this project let's go to offical Magento forum - [Less to Sass Community Project](https://community.magento.com/t5/Less-to-Sass-Community-Project/bd-p/less-to-sass)

## LESS themes support
LESS support was droped in version 1.0.0. Feel free to use older version (0.11.4 and lower) or create fork and customize newer versions to fit your needs.

## NPM and Yarn support
Up from version 1.0.0 we are supporting both Node.js packages managers. If you want to keep modules in safe versions all the time, use Yarn, `yarn.lock` is already added to repository.

## Requirements
* Node.js LTS version (v6 branch). We recommend to use [avn](https://github.com/wbyoung/avn) to automate version switching. Required configuration is already added to repository as `.node-version` file.
* Gulp CLI global package - `npm install -g gulp-cli` or `yarn global add gulp-cli`
* Magento 2 project with SASS based theme i.e. [SASS version of "Blank"](https://github.com/SnowdogApps/magento2-theme-blank-sass)

## Installation
1. Run `composer require snowdog/frontools`
2. Go to package directory `/vendor/snowdog/frontools`
3. Run `npm install` or `yarn`
4. Decide where you want to keep your config files.
You can store them in frontools `config` dir or `/dev/tools/frontools/config`.
There is a `gulp setup` task to copy all sample config files from the `config` to `/dev/tools/frontools/config` and create a convenient symlink in project root.
If you want to keep config files inside frontools `config` dir, you have to handle this manually.
5. Define your themes in `themes.json`

## `themes.json` structure
Check `config/themes.json.sample` to get samples
- `src` - full path to theme
- `dest` - full path to `pub/static/[theme_area]/[theme_vendor]/[theme_name]`
- `locale` - array of available locales
- `localeOverwrites` - (default `false`) set to `true` if you want to overwrite some styles for specifilc language. You can follow default Magento 2 docs or just rememer that path to overwriting file has to be same as base file after removing `/i18n/{lang_code}`.
- `parent` - name of parent theme
- `stylesDir` - (default `styles`) path to styles directory. For `theme-blank-sass` it's `styles`. By default Magento 2 use `web/css`.
- `postcss` - (deafult `["plugins.autoprefixer()"]`) PostCSS plugins config. Have to be an array.
- `modules` - list of modules with stylee files, both "root" files and partials (you can use selected partials from module as if they will be inside theme)
- `ignore` - array of ignore patterns

## Optional configurations for 3rd party plugins
* Create [browserSync](https://www.browsersync.io/) configuration
* Create [eslint](https://github.com/adametry/gulp-eslint) configuration
* Create [sass-lint](https://github.com/sasstools/sass-lint) configuration
* Create [stylelint](https://github.com/stylelint/stylelint) configuration

## Tasks list
* `browser-sync` - run [browserSync](https://www.browsersync.io/)- do not run this task separately, it's just a part of `dev` task
* `clean` - Removes `/pub/static` folder
* `csslint` - Run [stylelint](https://github.com/stylelint/stylelint) based tests
  * `--theme name` - Process single theme
  * `--ci - Enable throwing errors, useful in CI/CD pipelines`
* `default` - type `gulp` to see this readme in console
* `deploy` - Resolve theme inheritance of static assets (i.e. fonts, images) symlinking them to `pub` dir.
  * `--theme name` - Deploy single theme
  * `--prod` - Copy files instead of making symlinks
* `dev` - Runs `browser-sync`, `inheritance` and `watch`  tasks
  * `--theme name` - Process single theme
  * `--disableLinting` - Disable SASS and CSS linting
  * `--disableMaps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles and add `.min` sufix
* `eslint` - Watch and run [eslint](https://github.com/adametry/gulp-eslint) on specified JS file
  * `--file fileName` - You have to specify what file you want to lint, fileName without .js
* `inheritance` - Create necessary symlinks to resolve theme styles inheritance and make base for styles processing. You have to run in before sytles compilation and after adding new files.
* `release` - Clean `pub/static`, deploy all necessary files and compiles everything with `--prod` flag. Makes code production ready.
* `sasslint` - Run [sass-lint](https://github.com/sasstools/sass-lint) based tests
  * `--theme name` - Process single theme
  * `--ci - Enable throwing errors, useful in CI/CD pipelines`
* `setup` - Creates a convenient symlink from `/tools` to `/vendor/snowdog/frontools` and copies all sample files if no configuration exists
  * `--symlink name` - if you don't want to use `tools` as the symlink you can specify another name
* `styles` - Use this task to manually trigger styles processing pipeline
  * `--theme name` - Process single theme
  * `--disableMaps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles and add `.min` sufix
* `watch` - Watch for style changes and run processing tasks
  * `--theme name` - Process single theme
  * `--disableLinting` - Disable SASS and CSS linting
  * `--disableMaps` - Enable inline source maps generation
  * `--prod` - Production output - minifies styles and add `.min` sufix
