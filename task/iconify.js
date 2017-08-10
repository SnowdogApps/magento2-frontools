'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();

    gulp.task('iconClean', function (callback) {
        var allThemes = [];

        themes.forEach(name => {
            const theme = config.themes[name];

            allThemes.push('../' + theme.src + '/web/icons/png/*');
            allThemes.push('../' + theme.src + '/web/icons/scss/*');
            allThemes.push('../' + theme.src + '/web/icons/css/*');
        });

        plugins.del.sync(allThemes, {
            force: true
        });

        callback();
    });

    gulp.task('iconBuild', function () {
        themes.forEach(name => {
            const theme = config.themes[name];

            plugins.iconify(    {
                src: '../' + theme.src + '/web/icons/svg/*.svg',
                pngOutput: '../' + theme.src + '/web/icons/png',
                scssOutput: '../' + theme.src + '/web/icons/scss',
                cssOutput:  '../' + theme.src + '/web/icons/css',
                defaultWidth: '40px',
                defaultHeight: '40px',
                svgoOptions: {
                    enabled: true,
                    options: {
                        plugins: [
                            { removeUnknownsAndDefaults: false },
                            { mergePaths: false }
                        ]
                    }
                },
                svg2pngOptions: {
                    options: {
                        width: '40px',
                        height: '40px',
                    },
                    scaling: 1.0,
                    concurrency: null
                }
            });
        });
    });

    gulp.task('iconify', function() {
        gulp.start('iconClean', 'iconBuild');
    });
};
