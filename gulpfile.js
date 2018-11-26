const   gulp = require('gulp'),
        sass = require('gulp-sass'),
        browserSync = require('browser-sync').create(),
        minifyCSS = require('gulp-minify-css'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        cssnano = require('cssnano'),
        postcss = require('gulp-postcss'),
        rtlcss = require('gulp-rtlcss'),
        sourcemaps = require('gulp-sourcemaps'),
        babel = require('gulp-babel'),
        tinypng = require('gulp-tinypng-extended'),
        plumber = require('gulp-plumber'),
        deletefile = require('gulp-delete-file'),
        clean = require('gulp-clean'),
        htmlmin = require('gulp-htmlmin'),
        autoprefixer = require('gulp-autoprefixer'),
        sortCSSmq = require('sort-css-media-queries'),
        critical = require('critical').stream,
        runSequence = require('run-sequence'),
        mqpacker = require("css-mqpacker"),
        gap = require('gulp-append-prepend');

// Minifies & Concat JS
gulp.task('scriptJs', function(){
    return gulp.src([
        // 'src/assets/js/script/jquery-3.3.1.min.js',
        // 'src/assets/js/script/jquery.mCustomScrollbar.js',
        'src/assets/js/script/slick.js',
        // 'src/assets/js/script/jquery.panzoom.js',
        // 'src/assets/js/script/jquery.validate.js',
        // 'src/assets/js/script/aos.js',
        // 'src/assets/js/script/select2.full.js',
        'src/assets/js/script/main.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(babel({
        // presets: ['env']
        "presets": [ [ "env", { "modules": false } ] ]
    }))
    .pipe(concat('./src/assets/js/script.js'))
    .pipe(gulp.dest(''))
    .pipe(rename('script.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./src/assets/js'))
    .pipe(browserSync.stream());
});

gulp.task('critical', function () {
    return gulp.src('dist/**/*.html')
    .pipe(critical({
        base: 'dist/',
        inline: true,
        css: ['dist/assets/css/style.min.css'],
    }))
    .on('error', function(err) { log.error(err.message); })
    .pipe(gulp.dest('dist'));
});

// CSS to SASS
gulp.task('sassToCss', function() {
  return gulp.src("src/assets/sass/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ['./node_modules/'] }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 3 versions', 'ie >= 9', 'iOS >= 6', 'Android >= 4']
    }))
    .pipe(gulp.dest('src/assets/css'))
    .pipe(postcss([cssnano()]))
    .pipe(autoprefixer({
        browsers: ['last 3 versions', 'ie >= 9', 'iOS >= 6', 'Android >= 4']
    }))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('src/assets/css'))
    .pipe(browserSync.stream());
});

// CSS to RTL-CSS
gulp.task('rtlCss', function() {
  return gulp.src("src/assets/sass/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ['./node_modules/'] }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 3 versions', 'ie >= 9', 'iOS >= 6', 'Android >= 4']
    }))
    .pipe(rename('style-rtl.css'))
    .pipe(rtlcss())
    .pipe(gulp.dest('src/assets/css'))
    .pipe(postcss([cssnano()]))
    .pipe(autoprefixer({
        browsers: ['last 3 versions', 'ie >= 9', 'iOS >= 6', 'Android >= 4']
    }))
    .pipe(rename('style-rtl.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('src/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('include', function(){
    gulp.src('src/*.html')
    .pipe(gap.prependText('<!--END HEADER -->'))
    .pipe(gap.prependFile('src/partial/header.html'))
    .pipe(gap.prependText('<!-- HEADER -->'))
    .pipe(gap.appendText('<!-- FOOTER -->'))
    .pipe(gap.appendFile('src/partial/footer.html'))
    .pipe(gap.appendText('<!-- END FOOTER -->'))
    .pipe(gulp.dest('dist'));
});

gulp.task('createDist', function() {
    gulp.src(['src/**/*.*', '!src/*.html', '!src/partial/**', '!src/assets/js/script/**', '!src/assets/sass/**'])
        .pipe(gulp.dest('dist'))
});

gulp.task('copyImg', function() {
    gulp.src(['src/assets/img/**/*.*'])
        .pipe(gulp.dest('dist/assets/img/'))
});

// BrowserSync
gulp.task('run', function() {
  browserSync.init({
      server: "./src"
  });
  gulp.watch("src/assets/sass/**/*.scss", ['sassToCss']);
  gulp.watch("src/assets/js/script/*.js", ['scriptJs']);
  // gulp.watch("src/**/*.html", ['include']);
  gulp.watch("src/assets/img/**/*.*", ['copyImg']);
  gulp.watch("src/**/*.html").on('change', browserSync.reload);
});
gulp.task('server', ['createDist', 'sassToCss', 'scriptJs', 'run',]);
