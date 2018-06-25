'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		"npm-command": {
			all: {
				pwd: '.'
			}
		},
		ts: {
			all: {
				tsconfig: 'tsconfig.json'
			}
		},
		mocha_istanbul: {
			coverage: {
				src: ['test/**/*.spec.js']
			}
		},
		tslint: {
			options: {
				configuration: 'tslint.json',
				force: false,
				fix: false
			},
			files: {
				src: ['ts/**/*.ts']
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			test: {
				src: ['test/**/*.js']
			}
		},
		run: {
			main: {
				cmd: 'node',
				args: [
					'.'
				]
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'nodeunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'nodeunit']
			},
			ts: {
				files: '<%= tslint.files.src %>',
				tasks: ['newer:ts:all']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-run');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks("grunt-tslint");
	grunt.loadNpmTasks("grunt-npm-command");
	// Default task.
	grunt.registerTask('default', ['ts', 'run']);
	grunt.registerTask('build', ['npm-command', 'ts','tslint', 'mocha_istanbul']);
	grunt.registerTask('test', ['mocha_istanbul']);
	grunt.registerTask('lint', ['ts', 'tslint', 'jshint']);
	grunt.registerTask('compile', ['ts']);

};
