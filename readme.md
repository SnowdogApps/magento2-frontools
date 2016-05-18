# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

---

## Requirements
* `node >= 4.0.0` - heavily recommend using current LTS (v4 branch), not a latest version.
* Gulp CLI global package - `npm install gulp-cli -g`
* Magento 2 project :smile:

## How to start?
* Run `composer require snowdog/frontools`
* Go to package directory (probably `vendor/snowdog/frontools`) and run `npm install`
* If you are lazy... (I know you are :wink: ) Run `gulp symlink` this will create symlink to this dir in project root.
* Go to project root and then `cd tools`
* Use one of tasks listed below

---

## Tasks list
* `browser-sync` - Run BrowserSync - it's much better and easier to use than "LiveReload"
* `clean` - Removes `/pub/static` folder
* `default` - type `gulp` to see this readme in console
* `deploy` - Wrapper for `bin/magento dev:source-theme:deploy` - only for default themes
  * `--theme name` - Deploy single theme
* `dev` - Runs `browser-sync` and `watch` tasks
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles
* `eslint` - Watch and run eslint on specified JS file
  * `--file fileName` - You have to specify what file you want to lint
* `release` - Clean `pub/static`, deploy all necessary files and compiles everything with `--prod` flag. Makes code production ready.
* `styles` - Use it to manually trigger styles processing pipeline
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles
* `symlink` - Create symlink to tools directory in project root
* `watch` - Watch for styles changes and run processing task
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles

---

## `config/themes.json` structure
First of all check `config/themes.json.sample`
- `src` - full path to theme
- `dest` - full path to `pub/static/[theme]`
- `locale` - array of available locales
- `lang` - define styles lang want to use for processing, should be same as files extension. Out of the box Frontools supports only `less` and `scss`.
- `default` - (required for LESS themes) if your theme use default PHP based processing via `bin/magento dev:source-theme:deploy` set this to `true`.
- `area`, `vendor`, `name` - (required for LESS themes) self-descriptive
- `files` - (required for LESS themes) Array of LESS files to process
- `postcss` - (optional) PostCSS plugins config. This have to be an array.
