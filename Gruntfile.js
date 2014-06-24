module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    secret: grunt.file.readJSON('secret.json'),

    clean: {
      build: ['build/']
    },

    broccoli: {
      dist: {
        config: 'Brocfile.js',
        dest: 'build',
        env: 'production'
      }
    },

    sftp: {
      dist: {
        files: {
          './': 'build/**',
        },
        options: {
          path: '<%= secret.path %>',
          host: '<%= secret.host %>',
          username: '<%= secret.username %>',
          password: '<%= secret.password %>',
          showProgress: true,
          srcBasePath: 'build/',
          createDirectories: true
        }
      }
    }
  });

  grunt.registerTask('build', ['clean:build', 'broccoli:dist:build']);
  grunt.registerTask('deploy', ['build', 'sftp:dist']);
};
