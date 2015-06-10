module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            site: {
                options: {
                    hostname: '*',
                    port: 9999,
                },
            },
        },
        typescript: {
            base: {
                src: ['./source/**/ts/**/*.ts'],
                dest: './growthbeat.js',
                options: {
                    sourceMap: false,
                    declaration: false,
                },
            },
        },
        tjs2GM: {
            src: './bower_components/t.js/t.min.js',
            dest: './growthbeat.js',
        },
        nanoajax2GM: {
            src: './bower_components/nanoajax/index.js',
            dest: './growthbeat.js',
        },
        text2GM: {
            src: [
                './source/css/styles.css',
                './source/html/dialog-image.html',
                './source/html/dialog-text.html',
            ],
            dest: './growthbeat.js',
        },
        uglify: {
            dist: {
                files: {
                    './growthbeat.min.js': ['./growthbeat.js']
                }
            }
        },
        watch: {
            all: {
                files: [
                    './source/**/ts/**/*.ts',
                ],
                tasks: ['typescript', 'nanoajax2GM', 'tjs2GM', 'text2GM', 'uglify'],
                options: {
                    livereload: true,
                    spawn: false,
                },
            },
        },
    });

    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('./tasks');

    grunt.registerTask('dev', ['connect', 'watch']);
    grunt.registerTask('default', ['typescript', 'nanoajax2GM', 'tjs2GM', 'text2GM', 'uglify']);
};
