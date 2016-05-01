/**
 * cnpm install gulp imagemin-svgo gulp-notify  gulp-babel babel-preset-es2015 gulp.spritesmith vinyl-buffer gulp-postcss autoprefixer gulp-amd-optimizer  gulp-plumber gulp-notify  gulp-sourcemaps gulp-jshint  gulp-uglify gulp-sass gulp-cssnano gulp-autoprefixer  gulp-ifnpm gulp-size gulp-concat gulp-rimraf gulp-rename gulp-postcss gulp-scss-lint gulp-imagemin browser-sync --save-dev
 */


'use strict';

import gulp         from "gulp";                                    //gulp
import sass         from "gulp-sass";                               //sass编译
import concat       from "gulp-concat";                             //合并JS
import uglify       from "gulp-uglify";                             //压缩JS
import gulpif       from "gulp-if";                                 //增加判断
import sequence     from "gulp-sequence";                           //队列
import cssnano      from "gulp-cssnano";                            //压缩CSS
import imagemin     from "gulp-imagemin";                           //压缩图片
import pngquant     from "imagemin-pngquant";                       //深度压缩图片
import rimraf       from "gulp-rimraf";                             //清除文件
import rename       from "gulp-rename";                             //重命名
import plumber      from "gulp-plumber";                            //错误提示
import amdOptimize  from "gulp-amd-optimizer";                      //requirejs 压缩
import sourcemaps   from "gulp-sourcemaps";                         //sourcemaps
import spritesmith  from "gulp.spritesmith";                        //雪碧图
import bf           from "vinyl-buffer";                            //流缓存
import postcss      from "gulp-postcss";                            //css处理
import merge        from "merge-stream";                            //合并流
import babel        from "gulp-babel";                              //es6转化为es5
import autoprefixer from "autoprefixer";                            //添加浏览器前缀
import jshint       from "gulp-jshint";                             //js语法检测
import filter       from "gulp-filter";                             //过滤器
import bsc          from "browser-sync";

const bs = bsc.create(),    //即时预览
      bs_reload = bs.reload; //即时预览重载

                                                  


/**
 * 路径变量( s => source , d => distribute , o => other project)
 */  
var current = false,                                                                 //变化路径的开关,true开启,false关闭
o_dist      = 'F://LQH/WORK/Anzipay-mall/oneyuan/dist/',                             //其他项目的根目录
o_css       = o_dist + 'css/',                                                       //其他项目下的CSS
o_js        = o_dist + 'js/',                                                        //其他项目下的JS
o_img       = o_dist + 'img/',                                                       //其他项目下的IMG
o_mod       = o_dist + 'mod/',                                                       //其他目录下的模块
build       = "webstart/build/",                                                     //开发目录
dist        = "webstart/dist/",                                                      //输出目录           
path        = {

        s_sass      : build +"scss/",                                                //待编译的源文件路径
        s_css       : build +"css/",
        s_js        : build +"js/",
        s_es        : build +"es6/",                                                 //待转换的ES6文件
        s_img       : build +"img/",                                                 //待压缩的图片
        s_simg      : build +"img/sprite/",                                          //待合并成雪碧图的文件
        s_c_js      : build + "concat/js/",                                          //待合并的JS
        s_c_css     : build + "concat/css/",                                         //待合并的CSS
        d_css       : dist+"css/",                                                   //输出的文件
        d_img       : dist+'img/',
        d_js        : dist+'js/',
        server_root : ["webstart/static","webstart/static/SS/"],                     //静态服务器根目录,可以传入多个目录
        o_dist      : o_dist,
        o_css       : o_css,                                                         //其他项目输出文件
        o_js        : o_js,
        o_img       : o_img,
        o_mod       : o_mod,
        selectPath  : (current) =>  {                                                //开始替换路径
            if (current) {   
                path.d_css       = path.o_css;
                path.d_img       = path.o_img;
                path.d_js        = path.o_js;
                path.d_mod       = path.o_mod;
                path.server_root = path.o_dist;                                       //本地服务器启动根目录
            }
        }
    };
path.selectPath(current);



gulp.task('help',() => { 
        
        console.log("scss_2_cs : SCSS文件编译为CSS文件到开发目录"); 
        console.log("cssmin    : 压缩CSS文件到生产目录"); 
        console.log("uglify    : 压缩JS文件到生产目录"); 
        console.log("imagemin  : 压缩png文件到生产目录"); 
        console.log("sprite    : 雪碧图生成到生成目录"); 
        console.log("es6_2_es5 : es6转为ES5"); 
        console.log("serve     : 本地静态服务器"); 
        console.log("rimraf    : 删除生成目录所有文件"); 
});

/*合并文件*/
gulp.task('concat_js',() => {
    return gulp.src(path.s_c_js +'**/**/*.js')
    .pipe(concat('concat_js.js',{
        newLine:';'
    }))
    .pipe(gulp.dest(path.s_js));
});

gulp.task('concat_css',() => {
    return gulp.src(path.s_c_css +'**/**/*.css')
    .pipe(concat('concat_css.css'))
    .pipe(gulp.dest(path.s_css));
});




/**
 * sass 语法检测及文件处理
 */
gulp.task('scss_2_css', () => {
    return gulp.src(path.s_sass + '**/*.scss')
    .pipe(plumber())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(plumber.stop())
    .pipe(postcss([ autoprefixer({ browsers: ['last 3 versions'] }) ]))
    .pipe(gulp.dest(path.s_css));
});

//脚本检查
gulp.task('lint', () => {
    return gulp.src([path.d_js + '**/**/*.js',path.s_js + '**/**/*.js' , path.c_js + '**/**/*.js' ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
    
});


/**
 * 压缩css
 */
gulp.task('cssmin', () => { //执行完sass再执行cssmin
    return gulp.src(path.s_css + '**/**/*.css')
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
gulp.task('uglify', () => {
    return gulp.src(path.s_js + '**/**/*.js') //'!src/static/js/main/*js' 不压缩
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
gulp.task('imagemin', () => {
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
gulp.task('sprite', () => {
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
gulp.task('rimraf', () => {
    return gulp.src([path.d_css + '**/**/*',path.d_js + '**/*'], {
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
gulp.task('amdop', () => {
    return gulp.src(path.d_js + '**/**/*.js', {base: amdConfig.baseUrl})
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
gulp.task('serve', () => {
    // 从这个项目的根目录启动服务器
    bs.init({
        server: {
            baseDir: path.server_root //本地服务器目录
        },
        port:1234
    });
    gulp.watch([path.server_root + '**/**/*.html', 
                path.d_css + '**/**/*.css', 
                path.s_img + '*', 
                path.d_js + '**/**/*.js']).on("change", bs_reload);
});



/*队列管理*/
gulp.task('default-sequence',(cb) => {
    sequence(['concat_css','concat_js'],['scss_2_css', 'cssmin'], ['es6_2_es5','uglify'], ['sprite','imagemin'], 'serve', cb);
});




/**
 * 默认任务 运行语句 gulp
 */
gulp.task('default',  () => {
    return gulp.start('default-sequence');
});

/**
 *  ES6 转化为ES5
 */
gulp.task('es6_2_es5', () => {
    return gulp.src(path.s_es+'**/**/*.js')
    .pipe(plumber())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest(path.s_js));
    
});

/**
 * 监听任务 运行语句 gulp watch
 */
gulp.task('watch', () => {

    // 监听sass
    gulp.watch(path.s_sass + '**/*.scss', ['scss_2_css']);

    // 监听css
    gulp.watch(path.s_css + '**/**/*.css', ['cssmin']);

    // 监听images
    gulp.watch(path.s_img + '*', ['imagemin']);

    //监听ES6 JS
    gulp.watch(path.s_es+'**/**/*.js',['es6_2_es5']);

    // 监听js
    gulp.watch(path.d_js + '**/*.js', ['uglify']);


});