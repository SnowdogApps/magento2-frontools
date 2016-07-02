[![Travis branch](https://img.shields.io/travis/SnowdogApps/magento2-frontools/master.svg?maxAge=2592000)](https://github.com/SnowdogApps/magento2-frontools) [![Packagist](https://img.shields.io/packagist/v/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools) [![Packagist](https://img.shields.io/packagist/dt/snowdog/frontools.svg?maxAge=2592000)](https://packagist.org/packages/snowdog/frontools)

# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

## Requirements
* `node >= 4.0.0` - heavily recommend using current LTS (v4 branch), not a latest version.  
Using [avn](https://github.com/wbyoung/avn)? Great! We've included a .node-version for you.
* Gulp CLI global package. To install: `npm install gulp-cli -g`
* Magento 2 project :smile:

## How to start?
1. Run `composer require snowdog/frontools`
2. Go to package directory `<magento root>/vendor/snowdog/frontools`
3. Run `npm install`
4. If you are lazy... (I know you are :wink: ) Run `gulp symlink` this will create a symlink to this directory in the project root.
5. Go to `<magento root>/tools`
6. In the `config` folder there is a `themes.json.sample`, copy it to `<magento root>/dev/tools/frontools/configs/themes.json`
7. Add your own theme to `themes.json`
8. Use one of tasks listed below

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
* `styles` - Use this task to manually trigger styles processing pipeline
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles
* `symlink` - Creates a convenient symlink from `<magento root>/tools` to `<magento root>/vendor/snowdog/frontools`
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
