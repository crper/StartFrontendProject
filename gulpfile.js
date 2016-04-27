/**
 * cnpm install gulp imagemin-svgo gulp-notify  gulp-babel babel-preset-es2015 gulp.spritesmith vinyl-buffer gulp-postcss autoprefixer gulp-amd-optimizer  gulp-plumber gulp-notify  gulp-sourcemaps gulp-jshint  gulp-uglify gulp-sass gulp-cssnano gulp-autoprefixer  gulp-ifnpm gulp-size gulp-concat gulp-rimraf gulp-rename gulp-postcss gulp-scss-lint gulp-imagemin browser-sync --save-dev
 */


'use strict';
var gulp = require('gulp'),                                                          //gulp
    sass         = require('gulp-sass'),                                             //sass编译
    concat       = require('gulp-concat'),                                           //合并JS
    uglify       = require('gulp-uglify'),                                           //压缩JS
    gulpif       = require('gulp-if'),                                               //增加判断
    sequence     = require('gulp-sequence'),                                         //队列
    cssnano      = require('gulp-cssnano'),                                          //压缩CSS
    imagemin     = require('gulp-imagemin'),                                         //压缩图片
    pngquant     = require('imagemin-pngquant'),                                     //深度压缩图片
    autoprefixer = require('gulp-autoprefixer'),                                     //自动补齐前缀
    rimraf       = require('gulp-rimraf'),                                           //清除文件
    rename       = require('gulp-rename'),                                           //重命名
    plumber      = require('gulp-plumber'),                                          //错误提示
    amdOptimize  = require('gulp-amd-optimizer'),                                    //requirejs 压缩
    sourcemaps   = require('gulp-sourcemaps'),                                       //sourcemaps
    spritesmith  = require('gulp.spritesmith'),                                      //雪碧图
    bf           = require('vinyl-buffer'),                                          //流缓存
    postcss      = require('gulp-postcss'),                                          //css处理
    merge        = require('merge-stream'),                                          //合并流
    babel        = require('gulp-babel'),                                            //es6转化为es5
    autoprefixer = require('autoprefixer'),                                          //添加浏览器前缀
    jshint       = require('gulp-jshint'),                                           //js语法检测
    bs           = require('browser-sync').create(),                                 //即时预览
    bs_reload    = bs.reload;                                                        //即时预览重载


/**
 * 路径变量( s => source , d => distribute , o => other project)
 */  
var current = false,                                                                 //变化路径的开关,true开启,false关闭
    o_dist = 'F://LQH/WORK/Anzipay-mall/oneyuan/',                                   //其他项目的根目录
    o_css = o_dist + 'dist/css/',                                                    //其他项目下的CSS
    o_js = o_dist + 'dist/js/',                                                      //其他项目下的JS
    o_img = o_dist + 'dist/img/',                                                    //其他项目下的IMG
    o_mod = o_dist + 'dist/mod/',                                                    //其他目录下的模块
    path = {     
        s_sass      : "webstart/build/scss/",                                              //待编译的源文件路径
        s_css       : "webstart/build/css/",
        s_js        : "webstart/build/js/",
        s_es        : "webstart/build/es6/",                                                 //待转换的ES6文件
        s_img       : "webstart/build/img/",                                                //待压缩的图片
        s_simg      : "webstart/build/img/sprite/",                                        //待合并成雪碧图的文件
        dist        : "webstart/dist/",
        d_css       : "webstart/dist/css/",                                                 //输出的文件
        d_img       : 'webstart/dist/img/',
        d_js        : 'webstart/dist/js/',
        server_root : ["webstart/static"],
        o_dist      : o_dist,
        o_css       : o_css,                                                                //其他项目输出文件
        o_js        : o_js,
        o_img       : o_img,
        o_mod       : o_mod,
        selectPath  : function (current) {                                             //开始替换路径
            if (current) {   
                path.d_css       = path.o_css;
                path.d_img       = path.o_img;
                path.d_js        = path.o_js;
                path.d_mod       = path.o_mod;
                path.server_root = path.o_dist;                                      //本地服务器启动根目录
            }
            }
    };
path.selectPath(current);



gulp.task('help',function(){ 
        
        console.log("scss_2_cs : SCSS文件编译为CSS文件到开发目录"); 
        console.log("cssmin    : 压缩CSS文件到生产目录"); 
        console.log("uglify    : 压缩JS文件到生产目录"); 
        console.log("imagemin  : 压缩png文件到生产目录"); 
        console.log("sprite    : 雪碧图生成到生成目录"); 
        console.log("es6_2_es5 : es6转为ES5"); 
        console.log("serve     : 本地静态服务器"); 
        console.log("rimraf    : 删除生成目录所有文件"); 
})


/**
 * sass 语法检测及文件处理
 */
gulp.task('scss_2_css', function () {
    gulp.src(path.s_sass + '**/*.scss')
    .pipe(plumber())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(plumber.stop())
    .pipe(postcss([ autoprefixer({ browsers: ['last 3 versions'] }) ]))
    .pipe(gulp.dest(path.s_css));
});

//脚本检查
gulp.task('lint', function () {
    gulp.src(path.d_js + '**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
    
});


/**
 * 压缩css
 */
gulp.task('cssmin', function () { //执行完sass再执行cssmin
    return gulp.src(path.s_css + '**/*.css')
    .pipe(plumber())
    .pipe(sourcemaps.init()) //sourcemapr入口
    .pipe(rename({
        // dirname: "main/text/ciao",   //目录名
        // basename: "aloha",           //基本命名
        // prefix: "bonjour-",          //前缀
        suffix: ".min" //后缀
        // extname: ".md"               //拓展名
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.')) //保存到输出map
    .pipe(gulp.dest(path.d_css));
    
});


/**
 * 压缩js
 */
gulp.task('uglify', function () {
    return gulp.src(path.s_js + '**/*.js') //'!src/static/js/main/*js' 不压缩
    .pipe(plumber())
    .pipe(rename({
        // dirname: "main/text/ciao",   //目录名
        // basename: "aloha",           //基本命名
        // prefix: "bonjour-",          //前缀
        suffix: ".min" //后缀
        // extname: ".md"               //拓展名
    }))
    .pipe(uglify({
        mangle: true, //类型：Boolean 默认：true 是否修改变量名
        compress: true //类型：Boolean 默认：true 是否完全压缩
    }))
    .pipe(gulp.dest(path.d_js));
    
});




/**
 * 图片压缩
 */
gulp.task('imagemin', function () {
    return gulp.src(path.s_img + '*')
    .pipe(plumber())
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{
            removeViewBox: false
        }],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(path.d_img));
    
});

//雪碧图
gulp.task('sprite', function () {
    // Generate our spritesheet
    var spriteData = gulp.src(path.s_simg+'*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(bf())
    .pipe(imagemin())           //压缩合并的图片
    .pipe(gulp.dest(path.d_img));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
    .pipe(gulp.dest(path.d_css));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});

/**
 * 清空图片、样式、js
 */
gulp.task('rimraf', function () {
    return gulp.src([path.d_css + '**/*',path.d_js + '**/*'], {
        read: false
    }) // much faster
    .pipe(plumber())
    .pipe(rimraf({
        force: true
    }));
    
});

/**
 *AMD 模块压缩
 */
gulp.task('amdop', function () {
    return gulp.src(path.d_js + '**/*.js', {base: amdConfig.baseUrl})
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(amdOptimize(amdConfig))
    .pipe(concat('modules.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.d_js));
    
});
var amdConfig = {
    baseUrl: '',
    path: {
            //object
    },
    exclude: [
        'jQuery'
    ]
};


/**
 *本地服务器
 */
gulp.task('serve', function () {
    // 从这个项目的根目录启动服务器
    bs.init({
        server: {
            baseDir: [path.server_root+""] //本地服务器目录
        },
        port:8085
    });
    gulp.watch([path.server_root + '**/*.html', path.d_css + '**/*.css', path.s_img + '*', path.d_js + '**/*.js']).on("change", bs_reload);
});

/*队列管理*/
gulp.task('default-sequence',function(cb){
    sequence(['scss_2_css', 'cssmin'], ['es6_2_es5','uglify'], ['sprite','imagemin'], 'serve', cb);
})


/**
 * 默认任务 运行语句 gulp
 */
gulp.task('default',  function () {
    return gulp.start('default-sequence');
});

/**
 *  ES6 转化为ES5
 */
gulp.task('es6_2_es5', function() {
    return gulp.src(path.s_es+'**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    //.pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.d_js));
    
});

/**
 * 监听任务 运行语句 gulp watch
 */
gulp.task('watch', function () {

    // 监听sass
    gulp.watch(path.s_sass + '**/*.scss', ['scss_2_css']);

    // 监听css
    gulp.watch(path.s_css + '**/*.css', ['cssmin']);

    // 监听images
    gulp.watch(path.s_img + '*', ['imagemin']);

    //监听ES6 JS
    gulp.watch(path.s_es+'**/*.js',['es6_2_es5']);

    // 监听js
    gulp.watch(path.d_js + '**/*.js', ['uglify']);


});