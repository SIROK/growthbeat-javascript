module.exports = function(grunt) {

    grunt.registerTask('nanoajax2GM', function(){
        var config = grunt.config('nanoajax2GM');
        var src = grunt.file.read(config.src);
        var dest = grunt.file.read(config.dest);
        src = 'var Growthbeat;(function(global, exports){' +
            src
                .replace(/  req\.withCredentials = withCredentials\n/, '')
                .replace(/(req\.open\(.+?\))/, '$1\n  req.withCredentials = withCredentials') +
            'Growthbeat.nanoajax=exports;}(window, Growthbeat || (Growthbeat = {})));';
        grunt.file.write(config.dest, src + "\n" + dest);
    });

};
