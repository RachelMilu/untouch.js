# lib.untouch
移动点击库

## 介绍
简单实现了zepto的touch模块，但是不依赖zepto。

## 具体事件
* tap, singleTap, longTap, doubleTap;
* swipeDown, swipeUp, swipeRight, swipeLeft.

## 依赖库

无

## 使用方法
* 如果你导入了zepto 或者jquery :

````
$('#kk').on('longTap',function(e){})
````

* 否则：

````
document.getElementById('sw1').addEventListener('longTap',function(e){})
````


## 最新版本

**0.0.3**

## 用Grunt打包

运行 `npm install` or `cnpm install`，来安装所需的依赖模块。关于NPM的知识，请参见[nodejs](http://nodejs.org/);

运行 `grunt`，来对项目进行打包。关于Grunt的知识，请参见[gruntjs](http://gruntjs.com/);





# untouch.js
