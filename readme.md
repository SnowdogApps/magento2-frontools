[![Travis branch](https://img.shields.io/travis/SnowdogApps/magento2-frontools/master.svg?maxAge=2592000)](https://travis-ci.org/SnowdogApps/magento2-frontools) [![Packagist](https://img.shields.io/packagist/v/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools) [![Packagist](https://img.shields.io/packagist/dt/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools)

# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

## Questions
If you have any questions about this project let's go to offical Magento forum - [Less to Sass Community Project](https://community.magento.com/t5/Less-to-Sass-Community-Project/bd-p/less-to-sass)

## Requirements
* `node >= 4.0.0` - heavily recommend using current LTS (v4 branch), not a latest version.  
Using [avn](https://github.com/wbyoung/avn) or [nvm](https://github.com/creationix/nvm)? Great! We've included a `.node-version` file for you.
* Gulp CLI global package - `npm install -g gulp-cli`
* Magento 2 project :smile:

## Installation
1. Run `composer require snowdog/frontools`
2. Go to package directory `/vendor/snowdog/frontools`
3. Run `npm install`
4. Decide where you want to keep your config files.
You can store them in frontools `config` dir or `/dev/tools/frontools/config`.
There is a `gulp setup` task to copy all sample config files from the `config` to `/dev/tools/frontools/config` and create a convenient symlink in project root.
If you want to keep config files inside frontools `config` dir, you have to handle this manually.
5. Define your themes in `themes.json`

## Optional steps
* Create [browserSync](https://www.browsersync.io/) configuration
* Create [eslint](https://github.com/adametry/gulp-eslint) configuration
* Create [sass-lint](https://github.com/sasstools/sass-lint) configuration
* Create [stylelint](https://github.com/stylelint/stylelint) configuration

## Tasks list
* `browser-sync` - run [browserSync](https://www.browsersync.io/)- do not run this task separately, it's just a part of `dev` task
* `clean` - Removes `/pub/static` folder
* `default` - type `gulp` to see this readme in console
* `deploy` - Resolve theme inheritance of static assets (i.e. fonts, images) symlinking them to `pub` dir. For default LESS themes it's just a wrapper of `bin/magento dev:source-theme:deploy`.
  * `--theme name` - Deploy single theme
  * `--prod` - Copy files instead of making symlinks
* `dev` - Runs `browser-sync` and `watch` tasks
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles
* `eslint` - Watch and run [eslint](https://github.com/adametry/gulp-eslint) on specified JS file
  * `--file fileName` - You have to specify what file you want to lint, fileName without .js
* `release` - Clean `pub/static`, deploy all necessary files and compiles everything with `--prod` flag. Makes code production ready.
* `setup` - Creates a convenient symlink from `/tools` to `/vendor/snowdog/frontools` and copies all sample files if no configuration exists
  * `--symlink name` - if you don't want to use `tools` as the symlink you can specify another name
* `styles` - Use this task to manually trigger styles processing pipeline
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles
* `watch` - Watch for style changes and run processing tasks
  * `--theme name` - Process single theme
  * `--maps` - Enable inline source maps generation
  * `--prod` - Production output - minifies styles
* `csslint` - Run [stylelint](https://github.com/stylelint/stylelint) based tests
  * `--theme name` - Process single theme
  * `--ci - Enable throwing errors, useful in CI/CD pipelines`
* `sasslint` - Run [sass-lint](https://github.com/sasstools/sass-lint) based tests
  * `--theme name` - Process single theme
  * `--ci - Enable throwing errors, useful in CI/CD pipelines`

## `config/themes.json` structure
First of all check `config/themes.json.sample`
- `src` - full path to theme
- `dest` - full path to `pub/static/[theme_area]/[theme_vendor]/[theme_name]`
- `parent` - name of parent theme - not available in themes with `default` flag
- `locale` - array of available locales
- `lang` - define styles lang want to use for processing, should be same as files extension. Out of the box Frontools supports `less` and `scss`
- `default` - (required for default Magento LESS themes) if your theme use default PHP based processing via `bin/magento dev:source-theme:deploy` set this param to `true`
- `area`, `vendor`, `name` - (required for default Magento LESS themes) self-descriptive
- `files` - (required for default Magento LESS themes) Array of LESS files to process
- `postcss` - (optional) PostCSS plugins config - have to be an array
