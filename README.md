[![Travis branch](https://img.shields.io/travis/SnowdogApps/magento2-frontools/master.svg)](https://travis-ci.org/SnowdogApps/magento2-frontools) [![Packagist](https://img.shields.io/packagist/v/snowdog/frontools.svg)](https://packagist.org/packages/snowdog/frontools) [![Packagist](https://img.shields.io/packagist/dt/snowdog/frontools.svg)](https://packagist.org/packages/snowdog/frontools) [![Greenkeeper badge](https://badges.greenkeeper.io/SnowdogApps/magento2-frontools.svg)](https://greenkeeper.io/)

# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

## Questions
If you want to know more about this project, let's join [Magento Community Engineering Slack](https://tinyurl.com/engcom-slack) and ask questions on #magefront channel.

## Requirements
* Unix-like OS (please, do not ask about Windows support)
* Node.js [LTS version](https://nodejs.org/en/about/releases/). We recommend to use [avn](https://github.com/wbyoung/avn) to automate version switching. Required configuration is already added to repository as `.node-version` file.
* (optional) Gulp CLI installed globally - `yarn global add gulp-cli` or `npm install -g gulp-cli`
* Magento 2 project with SASS based theme for example [SASS version of "Blank"](https://github.com/SnowdogApps/magento2-theme-blank-sass) or [Alpaca Theme](https://github.com/SnowdogApps/magento2-alpaca-theme)

## Installation
1. Run `composer require snowdog/frontools`
2. Go to package directory `cd vendor/snowdog/frontools`
3. Run `yarn` or `npm install`
4. Decide where you want to keep your config files.
You can store them in Frontools `config` directory or in `dev/tools/frontools/config`.
There is a `setup` task to copy all sample config files from the `config` to `dev/tools/frontools/config` and create a convenient symlink `tools` in the project root.
If you want to keep config files inside frontools `config` dir, you have to handle this manually.
5. Define your themes in `themes.json`.

## `themes.json` structure
Check `config/themes.json.sample` to get samples.
- `src` - full path to theme
- `dest` - full path to `pub/static/[theme_area]/[theme_vendor]/[theme_name]`
- `locale` - array of available locales
- `parent` - name of parent theme
- `stylesDir` - (default `styles`) path to styles directory. For `theme-blank-sass` it's `styles`. By default Magento 2 use `web/css`.
- `disableSuffix` - disable adding `.min` suffix using `--prod` flag.
- `postcss` - (default `["autoprefixer({ overrideBrowserslist: browserslist })"]`) PostCSS plugins config. Have to be an array.
- `modules` - list of modules witch you want to map inside your theme
- `ignore` - array of ignore patterns

## `watcher.json` structure
Check `config/watcher.json.sample` to get samples.
- `usePolling` - set this to `true` to successfully watch files over a network (i.e. Docker or Vagrant) or when your watcher dosen't work well. Warning, enabling this option may lead to high CPU utilization! [chokidar docs](https://github.com/paulmillr/chokidar#performance)

## `sass-compiler.json` structure
You can choose Sass compiler between the default, but [already deprecated](https://github.com/sass/node-sass/issues/2952), `node-sass` or a newer and faster `dart-sass`.

Since the Dart Sass does not have the same set of features as Node Sass, for now we will keep the older version as default.

## Optional configurations for 3rd party plugins
You will find sample config files for theses plugins in `vendor/snowdog/frontools/config` directory.
* Create [browserSync](https://www.browsersync.io/) configuration
* Create [eslint](https://github.com/adametry/gulp-eslint) configuration
* Create [sass-lint](https://github.com/sasstools/sass-lint) configuration
* Create [stylelint](https://github.com/stylelint/stylelint) configuration
* Create [svg-sprite](https://github.com/jkphl/gulp-svg-sprite) configuration

## Tasks list
Please use `yarn [taskName]` or `npm run [taskName]` to avoid necessity of installing `gulp-cli` globally.
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
* `emailfix` - Fixes email stylesheet for Magento < 2.3.0. [Related issue](https://github.com/MyIntervals/emogrifier/issues/296)
  * `--prod` - Production output - minifies styles and add `.min` sufix.
* `eslint` - Run [eslint](https://github.com/adametry/gulp-eslint) against all JS files.
  * `--theme name` - Process single theme.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `inheritance` - Create necessary symlinks to resolve theme styles inheritance and make the base for styles processing. You have to run in before styles compilation and after adding new files.
* `magepackBundle` - Run [magepack](https://github.com/magesuite/magepack) `bundle` command.
  * `-c` or `--config` - (required) Path to previously generated Magepack config file.
  * `--theme name` - Process single theme.
* `magepackGenerate` - Run [magepack](https://github.com/magesuite/magepack) `generate` command.
  * `--cms-url` - (required) URL to one of CMS pages (e.g. homepage).
  * `--category-url` - (required) URL to one of category pages.
  * `--product-url` - (required) URL to one of product pages.
  * `-u` or `--auth-username` - Username for Basic Auth.
  * `-p` or `--auth-password` - Passoword for Basic Auth.
  * `-d` or `--debug` - Turn on debugging mode.
* `sasslint` - Run [sass-lint](https://github.com/sasstools/sass-lint) based tests.
  * `--theme name` - Process single theme.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `setup` - Creates a convenient symlink from `/tools` to `/vendor/snowdog/frontools` and copies all sample files if no configuration exists.
  * `--symlink name` - If you don't want to use `tools` as the symlink you can specify another name.
* `styles` - Use this task to manually trigger styles processing pipeline.
  * `--theme name` - Process single theme.
  * `--disableMaps` - Disable inline source maps generation.
  * `--prod` - Production output - minifies styles and add `.min` suffix.
  * `--ci` - Enable throwing errors. Useful in CI/CD pipelines.
* `svg` - Run [svg-sprite](https://github.com/jkphl/gulp-svg-sprite) to generate SVG sprite.
  * `--theme name` - Process single theme.
* `watch` - Watch for style changes and run processing tasks.
  * `--theme name` - Process single theme.
  * `--disableLinting` - Disable SASS and CSS linting.
  * `--disableMaps` - Disable inline source maps generation.
