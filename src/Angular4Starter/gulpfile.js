var gulp = require('gulp'),
    gp_clean = require('gulp-clean'),
    gp_concat = require('gulp-concat'),
    gp_sourcemaps = require('gulp-sourcemaps'),
    gp_typescript = require('gulp-typescript'),
    gp_uglify = require('gulp-uglify');

// Define caminhos
var srcPaths = {
    app: ['Scripts/app/main.ts', 'Scripts/app/**/*.ts'],
    js: ['Scripts/js/**/*.js',
         'node_modules/core-js/client/shim.min.js',
         'node_modules/zone.js/dist/zone.js',
         'node_modules/reflect-metadata/Reflect.js',
         'node_modules/systemjs/dist/system.src.js',
         'node_modules/typescript/lib/typescript.js'],
    js_angular: [
        'node_modules/@angular/**'
    ],

    js_rxjs: [
        'node_modules/rxjs/**'
    ]
};

var destPaths = {
    app: 'wwwroot/app/',
    js: 'wwwroot/js/',
    js_angular: 'wwwroot/js/@angular/',
    js_rxjs: 'wwwroot/js/rxjs/'
};

// Compila, minimiza e cria os sourcemaps de todos arquivos TS e coloca em wwwroot/app
gulp.task('app', ['app_clean'], function () {
    return gulp.src(srcPaths.app)
        .pipe(gp_sourcemaps.init())
        .pipe(gp_typescript(require('./tsconfig.json').compilerOptions))
        .pipe(gp_sourcemaps.write('/'))
        .pipe(gulp.dest(destPaths.app));
});

// Deleta o conteudo de wwwroot/app
gulp.task('app_clean', function () {
    return gulp.src(destPaths.app + "*", { read: false })
        .pipe(gp_clean({ force: true }));
});

// Copia todos arquivis JS de bibliotecas externas para wwwroot/js
gulp.task('js', function () {
    gulp.src(srcPaths.js_angular)
        .pipe(gulp.dest(destPaths.js_angular));

    gulp.src(srcPaths.js_rxjs)
        .pipe(gulp.dest(destPaths.js_rxjs));

    return gulp.src(srcPaths.js)
        // .pipe(gp_uglify({ mangle: false })) // disable uglify 
        // .pipe(gp_concat('all-js.min.js')) // disable concat 
        .pipe(gulp.dest(destPaths.js));
});

// Deleta o conteudo de wwwroot/js
gulp.task('js_clean', function () {
    return gulp.src(destPaths.js + '*', { read: false })
        .pipe(gp_clean({ force: true }));
});

// Observa arquivos especificos e define o que fazer quando houver mudanças
gulp.task('watch', function () {
    gulp.watch([srcPaths.app, srcPaths.js], ['app', 'js']);
});

// Limpeza geral
gulp.task('cleanup', ['app_clean', 'js_clean']);

// Define a tarefa padrão para lançar as outras
gulp.task('default', ['app', 'js', 'watch']);