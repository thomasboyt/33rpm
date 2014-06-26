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
      options: {
        path: '<%= secret.path %>',
        host: '<%= secret.host %>',
        username: '<%= secret.username %>',
        password: '<%= secret.password %>',
        showProgress: true,
        srcBasePath: 'build/',
        createDirectories: true
      },

      game: {
        files: {
          './': ['build/**', '!build/data/**']
        }
      },

      data: {
        files: {
          './': ['build/data/**']
        }
      }
    }
  });

  grunt.registerTask('dist', ['clean:build', 'broccoli:dist:build']);

  grunt.registerTask('deploy', ['dist', 'sftp:game']);
  grunt.registerTask('deploy:all', ['dist', 'sftp']);
};
