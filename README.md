# StartFrontendProject

#中文
最基础的配置,没有模块化加载的实现(webpack,Browserify,requrejs,seajs == ),
可以在这个基础上自行拓展

##依赖环境
- node v4.x
- python 2.7.x / Python 3+
 - (browser-sync 在window下依赖Python 2.x)
- visual studio 2013+ (一些插件需要依赖这个)/Linux和mac就不需要这个


##特征
- 编译SASS/SCSS -> CSS
- CSS 逆转换为 less / scss
- 压缩JS/HTML/CSS/图片
- 合并文件
- JS语法检测
- 添加后缀名
- 浏览器实时预览更新
- 清除文件



##目录结构及文件
<pre>
└─webstart
    │  .bowerrc -- 更改bower默认安装路径的环境文件
    │  .editorconfig -- 项目规范全局配置
    │  .eslintrc -- JS语法检测配置
    │  .gitignore -- github提交忽略
    │  bower.json -- bower配置文件
    │  CHANGELOG.md -- 项目文件修改的日志记录
    │  gulpfile.js -- gulp配置文件
    │  index.html -- 启动页面
    │  LICENSE -- 项目协议
    │  package.json -- node配置文件(在该目录下,项目开始`npm install`)
    │  README.md
    │  bower_components -- bower安装的库存放路径(这个路径可以在.bowerrc修改)
    │  node_modules -- node安装的存放目录
    ├─build -- 开发目录
    │  ├─covertSource
    │  │  ├─covert2es6  -- es6待转换存放目录
    │  │  ├─covert2less -- less待转换存放目录
    │  │  └─covert2scss -- scss待转换存放目录
    │  ├─css
    │  │  └─all -- css合并文件存放目录(开发)
    │  ├─img
    │  ├─js
    │  │  └─all -- js合并文件存放目录(开发)
    │  ├─less
    │  └─scss
    │          
    │          
    │          
    └─dist -- 发布目录
        ├─css
        │  └─all
        ├─fonts
        ├─img
        └─js
</pre>


------------
