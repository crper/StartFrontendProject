# StartFrontendProject

#中文
最基础的配置,没有模块化加载的实现(webpack,Browserify,requrejs,seajs == ),
可以在这个基础上自行拓展

##依赖环境
- node v4.x+
- python 2.7.x 
 - (browser-sync 在window下依赖Python 2.x)
- visual studio 2013+ (编译一些插件需要依赖这个)/Linux和mac就不需要这个

##用法
**依赖环境必须先安装好,然后打开`terminal`,切换到该项目下**

1. 执行`npm install` --- 安装node里面的依赖模块
2. 执行`bower install` --- 安装bower里面的一些js库

##任务列表
- 编译SCSS -> CSS
- AMD文件优化
- 压缩JS/HTML/CSS/图片
- 合并文件
- JS语法检测
- 添加后缀名
- 浏览器实时预览更新
- 清除文件



##目录结构及文件
<pre>
└─webstart
    ├─build          ---> 开发目录
    │  ├─css
    │  │  ├─all
    │  │  └─common   -- 通用样式
    │  ├─img
    │  │  └─sprite   --待合并成雪碧图的图片文件
    │  ├─js
    │  │  └─all      -- 待合并
    │  ├─scss        -- 待编译的SCSS文件
    │  └─es6         -- es6语法的JS文件
    ├─dist           ---> 生成目录
    │  ├─img
    │  │  ├─img      -- 压缩过后的图片
    │  │  └─sprite   --合并完成的雪碧图
    │  ├─css
    │  │  └─common
    │  ├─js
    │  └─lib  -- bower安装的第三方库默认存放路径
    └─static  -- 静态HTML文件存放
</pre>


------------
