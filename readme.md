[![Travis branch](https://img.shields.io/travis/SnowdogApps/magento2-frontools/master.svg?maxAge=2592000)](https://travis-ci.org/SnowdogApps/magento2-frontools) [![Packagist](https://img.shields.io/packagist/v/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools) [![Packagist](https://img.shields.io/packagist/dt/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools)

# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

## Requirements
* `node >= 4.0.0` - heavily recommend using current LTS (v4 branch), not a latest version.  
Using [avn](https://github.com/wbyoung/avn)? Great! We've included a .node-version for you.
* Gulp CLI global package. To install: `npm install gulp-cli -g`
* Magento 2 project :smile:

## Installation
1. Run `composer require snowdog/frontools`
2. Go to package directory `<magento root>/vendor/snowdog/frontools`
3. Run `npm install`
4. Run `gulp setup` this creates a convenient symlink from `<magento root>/tools` to frontools.  
It also copies all sample config files from the `config` directory to `<magento root>/dev/tools/frontools/configs`
5. Add your own theme to `<magento root>/dev/tools/frontools/configs/themes.json`
6. Add your local development url to `<magento root>/dev/tools/frontools/configs/browser-sync.json`
7. Use one of the tasks listed below

## Tasks list
* `browser-sync` - Run [BrowserSync](https://www.browsersync.io/) - it's a better alternative to "[LiveReload](http://livereload.com/)"
* `clean` - Removes `/pub/static` folder
* `default` - type `gulp` to see this readme in console
* `deploy` - Wrapper for `bin/magento dev:source-theme:deploy` - only for default themes
  * `--theme name` - Deploy single theme
* `dev` - Runs `browser-sync` and `watch` tasks
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles
* `eslint` - Watch and run eslint on specified JS file
  * `--file fileName` - You have to specify what file you want to lint, fileName without .js
* `release` - Clean `pub/static`, deploy all necessary files and compiles everything with `--prod` flag. Makes code production ready.
* `setup` - Creates a convenient symlink from `<magento root>/tools` to `<magento root>/vendor/snowdog/frontools` and copies all sample files if no configuration exists
  * `--symlink name` - if you don't want to use `tools` as the symlink you can specify another name
* `styles` - Use this task to manually trigger styles processing pipeline
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles
* `watch` - Watch for style changes and run processing tasks
  * `--theme name` - Process single theme
  * `--maps` - Enable inline source maps generation
  * `--prod` - Production output - minifies styles

## `config/themes.json` structure
First of all check `config/themes.json.sample`
- `src` - full path to theme
- `dest` - full path to `pub/static/[theme]`
- `parent` - name of parent theme - not available in themes with `default` flag
- `locale` - array of available locales
- `lang` - define styles lang want to use for processing, should be same as files extension. Out of the box Frontools supports `less` and `scss`
- `default` - (required for default Magento LESS themes) if your theme use default PHP based processing via `bin/magento dev:source-theme:deploy` set this param to `true`
- `area`, `vendor`, `name` - (required for default Magento LESS themes) self-descriptive
- `files` - (required for default Magento LESS themes) Array of LESS files to process
- `postcss` - (optional) PostCSS plugins config - have to be an array

## Questions
If you have any questions about this project let's go to offical Magento forum - [Less to Sass Community Project](https://community.magento.com/t5/Less-to-Sass-Community-Project/bd-p/less-to-sass)
