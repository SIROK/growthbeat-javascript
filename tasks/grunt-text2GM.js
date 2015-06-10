module.exports = function(grunt) {

    grunt.registerTask('text2GM', function(){
        var config = grunt.config('text2GM');
        var modules = config.src.map(function(src){
            var text = JSON.stringify(grunt.file.read(src));
            var fileName = src.match(/\/([^\/]+?\.[^\.]+)$/)[1];
            text = "GrowthMessage.module.exports(\"" + fileName + "\", " + text + ");\n";
            return text;
        }).join('');
        var dest = grunt.file.read(config.dest);
        modules = 'if(GrowthMessage.module){\n' + modules + '}';
        grunt.file.write(config.dest, dest + "\n" + modules);
    });

};
