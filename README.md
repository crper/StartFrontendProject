# StartFrontendProject

#中文
最基础的配置,没有模块化加载的实现(webpack,Browserify,requrejs,seajs == ),
可以在这个基础上自行拓展

##依赖环境
- node v4.x
- python 2.7.x
 - (browser-sync 在window下依赖Python 2.x)


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
- webstart
 - --build -- 开发目录
   - covertSource -- 待转换文件存放目录
     - covert2es6 -- es6文件存放处
     - covert2less -- less文件夹存放处
     - covert2scss -- scss文件夹存放处
   - css -- 开发目录下css文件存放处
   - img -- 开发目录下图片文件存放处(会调用图片压缩)
   - js -- 开发目录下js文件存放处  
 - --dist -- 发布目录
   - fonts -- 引用字体存放处
   - css -- 发布目录下css文件存放处
   - img -- 发布目录下图片文件存放处(会调用图片压缩)
   - js -- 发布目录下js文件存放处
- bower_components -- bower安装的库存放路径(这个路径可以在.bowerrc修改)
- node_modules -- node安装的存放目录
- gulpfile.js -- gulp配置文件
- package.json -- node配置文件(在该目录下,项目开始`npm update`)
- bower.json -- 库管理器
- .gitignore -- github提交忽略
- .bowerrc -- 更改bower默认安装路径的环境文件
- .changelog -- 项目文件修改的日志记录
- .editorconfig -- 项目基本配置

------------
