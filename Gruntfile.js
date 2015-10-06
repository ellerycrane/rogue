'use strict';

module.exports = function (grunt) {

    //Configure Grunt
    grunt.initConfig({

        //Point to the package file
        pkg: grunt.file.readJSON('package.json'),

        //Configure Browserify build, no debug map and don't keep alive
        browserify: {
            default: {
                options: {
                    debug: false,
                    keepalive: false
                },
                files: {
                    'dist/rogue.js': ['js/app.js']
                    //'dist/debug.js': ['js/battle.js']
                }
            }
        },

        //Configure Watchify build used while developing, debug map and constant file watch
        watchify: {
            options: {
                debug: true,
                keepalive: true
            },
            default: {
                src: './js/app.js',
                dest: './dist/rogue.js'
            },
            debug: {
                src: './js/battle.js',
                dest: './dist/debug.js'
            }
        },

        //Configure Uglify that is executed when creating a new build
        uglify: {
            options: {
                banner: '<%= banner %>',
                compress: {
                    pure_funcs: ['console.log', 'log.trace', 'log.debug', 'log.info', 'log.warn', 'log.error', 'log.fatal']
                }
            },
            dist: {
                files: {
                    'dist/rogue.min.js': 'dist/rogue.js'
                }
            }

        },
        compass: {
            dist: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'dist/css',
                    config: 'compass-config.rb',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'dist/css',
                    config: 'compass-config.rb'
                }
            },
            watch: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'dist/css',
                    config: 'compass-config.rb',
                    watch: true
                }
            }
        },

        autoprefixer: {
            options: {
                // Task-specific options go here.
            },
            rogue: {
                options: {
                    map: true
                },
                src: 'dist/css/rogue.css',
                dest: 'dist/css/rogue.css'
            }
        },

        sass: {
            dist: {
                options: {
                    //require: 'sass-css-importer',
                    compass: true
                },

                files: {
                    'dist/css/rogue.css': 'scss/rogue.scss'
                }
            }
        },

        watch: {
            rogueCss: {
                files: 'scss/**/*.scss',
                tasks: ['sass:dist'],
                options: {
                    spawn: false
                }
            }
        },
        concurrent: {
            watchStyles: {
                tasks: ['watch:rogueCss'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

    //Load plug-ins
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-watchify');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('build', [
        'browserify',
        'uglify',
        'sass:dist',
        'autoprefixer:rogue'
    ]);

    grunt.registerTask('watch-js', [
        'watchify'
    ]);


    grunt.registerTask('watch-debug', [
        'watchify:debug'
    ]);


    grunt.registerTask('watch-styles', [
        'concurrent:watchStyles'
    ]);

    grunt.registerTask('default', ['build']);

};


