// -------------------------------------
//   Modules
// -------------------------------------
//
// gulp              : The streaming dist system
// gulp-autoprefixer : Prefix CSS
// gulp-sourcemaps   :Source map support for Gulp.js
// gulp-babel        : Turn ES6 code into vanilla ES5 with no runtime required
// gulp-concat       : Concatenate files
// gulp-eslint       : JavaScript code quality tool
// gulp-load-plugins : Automatically load Gulp plugins
// gulp-minify-css   : Minify CSS
// gulp-minify-html  : Minify html with minimize.
// gulp-rename       : Rename files
// gulp-sass         : Compile Sass
// gulp-if           : Conditionally run a task
// gulp-imagemin     : Minify PNG, JPEG, GIF and SVG images
// gulp-uglify       : Minify JavaScript with UglifyJS
// gulp-util         : Utility functions
// gulp-notify       : gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging
// gulp-watch        : Watch stream
// gulp-plumber      : Prevent pipe breaking caused by errors from gulp plugins
// gulp-rimraf       : rimraf plugin for gulp
// gulp-size         : Display the size of your project
// gulp-ruby-sass    : Compile Sass to CSS with Ruby Sass
// gulp-csscomb      : CSScomb is a coding style formatter for CSS.
// gulp-concat-css   : Concatenate css files, rebasing urls and inlining @import
// gulp-css-scss     : Gulp plugin for converting CSS to Scss.
// sprity            : Generates sprites and proper style files out of a directory of images.
// -------------------------------------

//导入插件模块(import module)
var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  bs = require('browser-sync')
  .create(),
  reload = bs.reload,
  $ = gulpLoadPlugins({ //plugins rename pin
    /*gulp-load-plugins options*/
    rename: {
      'gulp-debug': 'debugger',
      'gulp-minify-html': 'gmh',
      'gulp-minify-css': 'gmc',
      'gulp-rimraf': 'clean',
      'gulp-css-scss': 'c2s'
    } //a mapping of plugins to rename
  }),
  pngquant = require('imagemin-pngquant'),
  imageminJpegtran = require('imagemin-jpegtran'),
  sprity = require('sprity');


//目录路径(Directory Path)
var sourceDir = 'webstart/build/',
  imgSourceDir = sourceDir + 'img/',
  jsSourceDir = sourceDir + 'js/',
  cssSourceDir = sourceDir + 'css/',
  lessSourceDir = sourceDir + 'less/',
  scssSourceDir = sourceDir + 'scss/',
  coverScssSourceDir = sourceDir + 'covertSource/covert2scss/', //放进需要反编译的CSS文件
  coverLcssSourceDir = sourceDir + 'covertSource/covert2less/', //放进需要反编译的CSS文件
  coverEs6SourceDir = sourceDir + 'covertSource/covert2es6/', //放进需要反编译的es6写法的JS文件
  iconSource = sourceDir + 'combinePhoto/';
var distDir = 'webstart/dist/',
  imgDistDir = distDir + 'img/',
  jsDistDir = distDir + 'js/',
  cssDistDir = distDir + 'css/',
  serveRootDir = 'webstart/';


// scss编译后的css将注入到浏览器里实现更新(scss compile and reload)
gulp.task('sass', function () {
  return gulp.src(scssSourceDir + '**/*.scss')
    .pipe($.plumber({
      errorHandler: $.notify.onError(
        'Error: <%= error.message %>')
    }))
    .pipe($.sass({
      style: 'expanded'
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.size({
      showFiles: true,
      pretty: true
    }))
    .pipe(gulp.dest(cssSourceDir))
    .pipe($.gmc({
      compatibility: 'ie8'
    }))
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe($.size())
    .pipe(gulp.dest(cssDistDir))
    .pipe(reload({
      stream: true
    }));

})

// 静态服务器 + 监听 scss/html 文件(static server + listen scss file on change)
gulp.task('serve', ['sass'], function () {
  var files = [distDir + '**/*.html']
  bs.init(files, {
    server: serveRootDir
  }); //静态服务器启动的目录(server start directory)


  // 提供一个回调来捕获所有事件的CSS
  // files - 然后筛选的'change'和重载所有
  // css文件在页面上
  bs.watch([serveRootDir + "*.html"], function (event, file) {
    if (event === "change") {
      reload("*.html");
    }
  });
  bs.watch([cssDistDir + "*.css"], function (event, file) {
    if (event === "change") {
      reload("*.css");
    }
  });
  bs.watch([scssSourceDir + "*.scss"], function (event, file) {
    if (event === "change") {
      reload("*.scss");
    }
  });
  bs.watch([jsDistDir + "*.css"], function (event, file) {
    if (event === "change") {
      reload("*.js");
    }
  });
});


//压缩css(minify css)
gulp.task('minifyCSS', function () {
  gulp.src(cssSourceDir + '*.css')
    .pipe($.plumber({
      errorHandler: $.notify.onError(
        'Error: <%= error.message %>')
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      remove: true
    }))
    .pipe($.csscomb())
    .pipe($.size({
      showFiles: true,
      pretty: true
    }))
    .pipe($.concat('all/all.css'))
    .pipe(gulp.dest(cssSourceDir))
    .pipe($.gmc({
      compatibility: 'ie8'
    }))
    .pipe($.plumber({
      errorHandler: $.notify.onError(
        'Error: <%= error.message %>')
    }))
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe($.size({
      showFiles: true,
      pretty: true
    }))
    .pipe(gulp.dest(cssDistDir))
})

//压缩HTML(minify html)
gulp.task('minifyHTML', function () {
  return gulp.src(distDir + 'index.html')
    .pipe($.size({
      showFiles: true,
      pretty: true
    }))
    .pipe($.gmh({
      conditionals: true,
      spare: true
    }))
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe($.size({
      showFiles: true,
      pretty: true
    }))
    .pipe(gulp.dest(distDir))

})

//压缩图片(minify photo)
gulp.task('minifyImg', function () {
  return gulp.src(imgSourceDir + '*')
    .pipe($.plumber({
      errorHandler: $.notify.onError(
        'Error: <%= error.message %>')
    }))
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe($.size({
      showFiles: true,
      pretty: true
    }))
    .pipe(gulp.dest(imgDistDir));
})

// 合并，压缩文件(concat file and minify),启用检测JS自行增加['eslint']
gulp.task('minifyJS', function () {
  return gulp.src(jsSourceDir + '**/*.js')
    .pipe($.concat('all/all.js'))
    .pipe($.size({
      showFiles: true,
      pretty: true
    }))
    .pipe(gulp.dest(jsSourceDir))
    .pipe($.uglify())
    // .pipe($.eslint())
    // .pipe($.eslint.format())
    .pipe($.rename('all.min.js'))
    .pipe($.size({
      showFiles: true,
      pretty: true
    }))
    .pipe(gulp.dest(jsDistDir))
})

//生成雪碧图 -- 可选任务
gulp.task('sprites', function () {
  return sprity.src({
      name: 'icons', //定义一个名称
      src: iconSource + '*.{png,jpg}',
      processor: 'css', // css生成处理
      //processor:'sass',  //SCSS生成处理
      style: cssDistDir + 'sprites.scss', //CSS输出路径
      //style: '_icon.scss',                //这是生成的样式文件
      format: 'png', //png格式的图片
      orientation: 'vertical' //雪碧图合并的方向，也可以设置成垂直或水平(vertical|horizontal|binary-tree)
        //cssPath: '#{$icon-sprite-path}',    //雪碧图的路径变量
        //template: './sprite-tpl.mustache',  //scss生成的模板

    })
    .pipe($.if('*.png', gulp.dest(imgDistDir), gulp.dest(cssDistDir)))
    //.pipe($.if('*.png', gulp.dest(imgDistDir), gulp.dest(scssSourceDir)))
});


//eslint
// gulp.task('eslint', function() {
// 	return gulp.src([''])
// 		.pipe($.eslint())
// 		.pipe($.eslint.format())
// });


//CSS反编译成SASS文件 -- 可选任务
gulp.task('css2scss', function () {
  return gulp.src(coverScssSourceDir + '*.css')
    .pipe($.c2s())
    .pipe(gulp.dest(scssSourceDir));
});

//ESL6写法的JS文件转化为ES5写法JS文件
gulp.task('es2js', function () {
  return gulp.src(coverEs6SourceDir + '*/**.js')
    .pipe($.plumber({
      errorHandler: $.notify.onError(
        'Error: <%= error.message %>')
    }))
    .pipe($.babel())
    .pipe(gulp.dest(jsSourceDir));
});

// 默认任务(default task)
gulp.task('default', ['serve'], function () {
  gulp.start('sass', 'minifyJS', 'minifyCSS', 'minifyHTML',
    'minifyImg')
  gulp.watch(scssSourceDir + "*.scss", ['sass']);

})