"use strict";

module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ";"
            },

            dist: {
                src: ['src/**/*.js'],
                dest: 'build/<%= pkg.name %>.js'
            }

        },

        watch: {
            grunt: {
                files: ["Gruntfile.js"]
            },

            js: {
                files: ['src/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        },

        jshint: {
            files: ['src/**/*.js', "Gruntfile.js"],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                node: true,
                globals: {
                    require: true,
                    define: true,
                    requirejs: true,
                    describe: true,
                    expect: true,
                    it: true,
                    module: true
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> uglified by Grunt.js <%= grunt.template.today("yyyy-dd-mm") %> */\n'
            },
            dist: {
                files: {
                    'build/<%= pkg.name %>.min.js': 'build/<%= pkg.name %>.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', 'watch');
};