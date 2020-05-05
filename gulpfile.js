'use strict';
/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
const path = {
    build: {
        js: './build/assets/js/',
        css: './build/css',
        img: './build/assets/img/',
        fonts: './build/assets/fonts/',
        vendor: './build/assets/vendor/',
        html: './build/'
    },
    src: {
        js: './src/js/*.js',
        style: './src/scss/main.scss',
        img: './src/img/**/*.*',
        fonts: './src/fonts/**/*.*',
        vendorCss: './src/vendor/**/*.css',
        vendorJs: './src/vendor/**/*.js',
        html: './src/html/*.html'
    },
    watch: {
        js: './src/js/**/*.js',
        css: './src/scss/**/*.scss',
        img: './src/img/**/*.*',
        fonts: './src/fonts/**/*.*',
        html: './src/html/**/*.html'
    },
    clean: '.build/*'
};
/* настройки сервера */

/* подключаем gulp и плагины */
const gulp = require('gulp'), // подключаем Gulp
    browserSync = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg	
    rimraf = require('gulp-rimraf'), // плагин для удаления файлов и каталогов
    rename = require('gulp-rename'), // плагин для переименования файлов
    postCSS = require('gulp-postcss'), // постцсс плагин
    mqpacker = require('css-mqpacker'), // сортировка медиазпросов
    terser = require('gulp-terser'), // модуль для минимизации JavaScript ES6+ без babel
    sortCSSmq = require('sort-css-media-queries'); // правила сортировки медиазапросов

/* задачи */

// запуск сервера

// сбор стилей
gulp.task('css:build', (done) => {
    return gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(postCSS([
            mqpacker({
                sort: sortCSSmq
            })
        ]))
        .pipe(rename({
            basename: 'style'
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(browserSync.reload({
            stream: true
        })); // перезагрузим сервер
    done();
});

gulp.task('html:build', () => {
    return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(browserSync.reload({ stream: true })); // перезагрузка сервера
});

// сбор js
gulp.task('js:build', () => {
    return gulp.src(path.src.js) // получаем js файлы
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(gulp.dest(path.build.js))
        .pipe(terser({
            mangle: false,
            ecma: 5
          }))
        .pipe(rename( (path) => {
            path.extname = '.min.js'
        }))
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.build.js)) // положим готовый файл
        .pipe(browserSync.stream()); // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

// перенос и минимизирование css-vendor
gulp.task('vendor:buildCss', () => {
    return gulp.src(path.src.vendorCss)
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(postCSS([
            mqpacker({
                sort: sortCSSmq
            })
        ]))
        .pipe(gulp.dest(path.build.vendor))
        .pipe(rename( (path) => {
            path.extname = '.min.css';
          }))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.vendor)) // выгружаем в build
});

// перенос и минимизирование js-vendor
gulp.task('vendor:buildJs', () => {
    return gulp.src(path.src.vendorJs)
    .pipe(plumber()) // для отслеживания ошибок
    .pipe(gulp.dest(path.build.vendor))
    .pipe(terser({
        mangle: false,
        ecma: 5
      }))
    .pipe(rename( (path) => {
        path.extname = '.min.js'
    }))
    .pipe(sourcemaps.init()) //инициализируем sourcemap
    .pipe(sourcemaps.write('./')) //  записываем sourcemap
    .pipe(gulp.dest(path.build.vendor)) // положим готовый файл
});

// обработка картинок
gulp.task('image:build', () => {
    return gulp.src(path.src.img) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({
                interlaced: true
            }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            })
        ])))
        .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов
});

// удаление каталога build
gulp.task('clean:build', () => {
    return gulp.src(path.clean, {
            read: false
        })
        .pipe(rimraf());
});

// очистка кэша
gulp.task('cache:clear', () => {
    cache.clearAll();
});

// сборка
gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:build',
            'js:build',
            'fonts:build',
            'image:build',
            'vendor:buildCss',
            'vendor:buildJs'
        )
    )
);

// запуск задач при изменении файлов
gulp.task('watch', () => {

    browserSync.init({
        server: './build/'
    })

    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series('build', 'watch'));