module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                src: 'node_modules/bootstrap/dist/fonts/*',
                dest: 'public/fonts/',
                flatten: true,
                expand: true
            },
        },
        concat: {
            options: {
                separator: ';'
            },
            libraries: {
                src: [
                    'node_modules/angular/angular.min.js',
                    'lib/angular_1_router.min.js',
                    'node_modules/chart.js/dist/chart.min.js',
                    'node_modules/angular-chart.js/dist/angular-chart.min.js',
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                    'node_modules/angularjs-slider/dist/rzslider.min.js',
                    'lib/ui-bootstrap.min.js',
                    'node_modules/angular-animate/angular-animate.min.js',
                    'node_modules/angular-cookies/angular-cookies.min.js',
                    'node_modules/babel-polyfill/dist/polyfill.min.js'
                ],
                dest: 'public/libraries.js'
            },
            app: {
                src: [
                    'public/App/Common/*.js', //common modules/services outside our module
                    'public/App/module.js', //module definition
                    'public/App/boilerplate-root.component.js', 
                    'public/App/DashComponents/Common/*.js', //common ui components
                    'public/App/DashComponents/*.js'
                ],
                dest: 'build/app_es6.js'
            }
        },
        jshint: {
            options: {
                /*http://jshint.com/docs/options/*/
                asi: true
            },
            all: ['public/App/DashComponents/*.js', 'public/App/*.js', 'public/App/Common/*.js','public/App/DashComponents/Common/*.js']
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            dist: {
                files: {
                    'build/app_es5.js': 'build/app_es6.js' //target : src
                }
            }
        },        
        uglify: {
            options: {
                compress: true,
                mangle: false,
                sourceMap: false
            },
            target: {             
                src: ['build/app_es5.js'],
                dest: 'public/app.js'
            }
        },
        concat_css: {
            options: {},
            all: {
                src: ['node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/angularjs-slider/dist/rzslider.min.css',
                    'node_modules/angularjs-slider/dist/ui-bootstrap-csp.css'],
                dest: "public/libraries.css"
            },
            darkTheme: {
                src: [
                    'lib/slate.bootstrap.min.css',
                ],
                dest: "public/dark.css"
            },
        },
        //https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            folder: ['build/'],
          }        
        
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ["copy", "concat", "concat_css", "babel", "uglify", "clean"]);

};
