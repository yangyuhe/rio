# ![rio.js](https://github.com/chaojihexiang/rio/blob/master/riojs.png?raw=true)

<p>riao.js 是一个用于开发web app 的响应式javascript框架，语法参考了vue.js，部分概念参考了angular.js。</p>

*注意该框架尚处于初级阶段，不能用于生产*

***
### 功能简介
* 你可以使用if,for等常用的结构型指令构建页面
* 你可以使用model指令和经典的{{}}进行双向绑定
* 你可以使用Rio.component方法书写自定义组件，使用data,methods等跟vue类似的选项初始化组件，使用props,events来定义组件的输入和输出，使用slot默认和命名插槽。
* 你可以使用Rio.namespace方法来给自己的组件，服务等添加命名空间
### 开始使用
1. 安装
* 通过npm 安装
<code>npm install rio-js --save</code>
2. 简单使用  
首先使用script标签引入rio.js或者rio.min.js文件，然后使用Rio.component方法写组件，例如Rio.component("app",options)。之后可以在html里面任意地方加入<code>&lt;app&gt;&lt;/app&gt;</code>来引入该组件。
3. API









