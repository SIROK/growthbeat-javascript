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
        nanoajax2GM: {
            src: './bower_components/nanoajax/index.js',
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
                tasks: ['typescript', 'nanoajax2GM', 'uglify'],
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
    grunt.registerTask('default', ['typescript', 'nanoajax2GM', 'uglify']);
};
