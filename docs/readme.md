# How to use Gulp.js?
* You need node.js (with npm)
* Type `npm install` to install all modules and dependencies - you may need to use `sudo` at front
* Now you can use Gulp tasks

# How to update node modules after `package.json` changes?
* `cd` to `.tools`
* `rm -rf node_modules`
* `npm install`

# Avalivable tasks
- `gulp` - start watching all files, compile, refresh and run local BrowserSync server
- `gulp release` - compile all assets before commit / deployment
- `gulp sass` - compile v2 sass to css
- `gulp eslint --file fileName` - can be used to watch and lint specified JS file
- `gulp css-lint` - check and print any CSS error / issues / suggestions

# Avalivable flags
- `--maps` - can be used for `sass` related tasks. It adds source map to css files. Examples:
  - `gulp --maps`
  - `gulp sass --maps`
- `--full` - can be used with `css-lint` task, to enable full lining (not only errors)
