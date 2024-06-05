import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import sourcemaps from 'gulp-sourcemaps';
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
import eslint from 'gulp-eslint';
import stylelint from 'gulp-stylelint';
import svgSprite from 'gulp-svg-sprite';

const sass = gulpSass(dartSass);
const server = browserSync.create();

const paths = {
  styles: {
    src: 'assets/scss/**/*.scss',
    dest: 'assets/css',
  },
  acfBlocks: {
    src: 'template-parts/blocks/**/*.scss',
    dest: 'template-parts/blocks/',
  },
  scripts: {
    src: 'assets/js/**/*.js',
    dest: 'assets/js',
  },
  images: {
    src: 'assets/images/**/*.{jpg,jpeg,png,svg,gif}',
    dest: 'assets/images',
  },
  html: {
    src: './**/*.html',
  },
  svg: {
    src: 'assets/svg/**/*.svg',
    dest: 'assets/svg',
  },
};

// Compile and minify SCSS to CSS with source maps and cache busting
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

// Compile and minify SCSS for ACF blocks
function acfBlockStyles() {
  return gulp
    .src(paths.acfBlocks.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(file => file.base))
    .pipe(server.stream());
}

// Lint and minify JavaScript with source maps and cache busting
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.stream());
}

// Compress images
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}

// Minify HTML
function html() {
  return gulp
    .src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest((file) => file.base));
}

// Lint CSS
function lintStyles() {
  return gulp.src(paths.styles.src).pipe(
    stylelint({
      reporters: [{ formatter: 'string', console: true }],
    })
  );
}

// Generate SVG sprite
function svgSpriteTask() {
  return gulp
    .src(paths.svg.src)
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: 'sprite.svg',
          },
        },
      })
    )
    .pipe(gulp.dest(paths.svg.dest));
}

// Watch for changes
function watch() {
  server.init({
    proxy: 'http://customtheme.local/',
    // Change to match your local WordPress URL
  });
  gulp.watch(paths.styles.src, gulp.series(lintStyles, styles));
  gulp.watch(paths.acfBlocks.src, acfBlockStyles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.html.src, html).on('change', server.reload);
  gulp.watch(paths.svg.src, svgSpriteTask).on('change', server.reload);
}

// Define complex tasks
const build = gulp.series(
  gulp.parallel(styles, acfBlockStyles, scripts, images, html, svgSpriteTask)
);
const dev = gulp.series(build, watch);

// Export tasks
export { build, dev };
export default dev;
