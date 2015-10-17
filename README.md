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
- 压缩JS/HTML/CSS/图片
- 合并文件
- JS语法检测
- 添加后缀名
- 浏览器实时预览更新
- 清除文件


##目录结构及文件
- webstart
 - --build -- 开发目录
 - --dist -- 发布目录
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

# English

The most basic configuration, no modular loading (webpack,Browserify,requrejs,seajs ==),
On the basis of its own development
## on Environment
- v4.x node
- 2.7.x Python
(2.x browser-sync window Python)

## features
Compile SASS/SCSS - > CSS
- compressed JS/HTML/CSS/ image
- merge file
- JS syntax checking
- add the suffix name
- browser preview update
- clear file

## directory structure and file
- webstart
- --build - Development Directory
- --dist - publish directory
- Bower_components -- bower installed inventory discharge path (this path can .bowerrc modified)
- node_modules -- node install library save Directory;
- gulpfile.js - gulp configuration file
- package.json - node configuration file (in the directory, the project started update` `npm)
- bower.json -- library manager
- .Gitignore - GitHub submission ignored
- .Bowerrc - to change the environment file for the default installation path for bower
- .Changelog - log records for project file changes
- .Editorconfig - the basic configuration of the project
