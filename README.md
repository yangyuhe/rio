# ![rio.js](https://github.com/chaojihexiang/rio/blob/master/riojs.png?raw=true)
<p>riao.js 是一个用于开发webapp的响应式javascript框架,支持vanilla js和typescript。</p>

*注意该框架尚处于初级阶段，暂时不能用于生产*

***
### 功能简介
* 你可以使用if,for等常用的结构型指令构建页面
* 你可以使用model指令和经典的{{}}进行双向绑定
* 你可以使用Rio.component方法书写自定义组件，使用data,methods,computed等跟vue类似的选项初始化组件，使用props,events来定义组件的输入和输出，使用slot默认和命名插槽。
* 你可以使用Rio.directive书写自定义指令，从而操作dom
* 你可以使用Rio.namespace方法来给自己的组件，服务等添加命名空间从而用于大规模开发时防止命名重复
### 开始使用
1. 安装
* 通过npm 安装
<code>npm install @yangyuhe/riojs --save</code>
* 或者直接编译源码，只要把项目拷贝到本地运行gulp命令即可
2. 简单使用  
* 普通方式 
引入  
<code>&lt;script src="path/rio.umd.min.js"&gt;&lt;/script&gt;</code>
* typescript 请下载脚手架项目快速开始
<a href="https://github.com/yangyuhe/riojs-start">https://github.com/yangyuhe/riojs-start.git</a>
3. API
    1. <code>Rio.component(name,options)</code>

    * name 组件名称<br/>
    * options 组件定义包括一下选项<br/>
        * template/templateUrl 模版
        * style/styleUrl 样式
        * data 数据
        * methods 方法
        * computed 计算方法
        * events 组件的输出
        * props 组件接受的输入

    2. <code>Rio.directive(name,options)</code>

    * name 指令名称<br/>
    * options 指令定义包括一下选项<br/>
        * data 数据
        * methods 方法
        * events 指令的输出
        * props 指令接受的输入

4. 内置常用指令
    1. if 判断结构，使用示例
    ```html
    <span r-if="exp/func">hello</span>
    ```

    2. for 循环结构，使用示例
    ```html
    <span r-for="item in items">hello</span>
    ```
    3. model 双向绑定，使用示例 
    ```html
    <input r-model="exp"/>
    ```
    4. {{}} 文字绑定
    5. 内置事件
        * r-click，元素点击事件











