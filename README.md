# ![rio.js](https://github.com/chaojihexiang/rio/blob/master/riojs.png?raw=true)
<p>riao.js 是一个用于开发webapp的响应式javascript框架,支持vanilla js和typescript。</p>

*注意该框架尚处于初级阶段，暂时不能用于生产*

***
### 功能简介
* 你可以轻易的构建响应式页面
* 你可以使用书写自定义组件，定义组件的输入输出
* 你可以使用自定义指令，从而操作dom
* 你可以轻易的动态添加新的html到界面，这些新添加的html依然是响应式的
* 你可以给应用和组件，指令添加命名空间，从而用于大规模开发时防止命名重复（实验当中）
* 合理的配置webpack从而支持高效率的多页面开发

### 开始使用
1. 安装
* 通过npm 安装
<code>npm install @yangyuhe/riojs --save</code>
* 或者直接编译源码，只要把项目拷贝到本地运行npm run build命令即可
2. 简单使用  
* 暂时不支持script标签引入方式 
* 使用typescript 请下载脚手架项目快速开始
<a href="https://github.com/yangyuhe/riojs-start">https://github.com/yangyuhe/riojs-start.git</a>
3. 装饰器介绍
    1. <code>@App</code>
    * 用于修饰应用程序启动类（该类继承自AppMvvm）
    * 接受一个选项对象，包括以下选项
        * el string 根元素选择器，如"#app"
    2. <code>@Component</code>
    * 用于修饰一个组件类（该类继承自ComponentMvvm）
    * 接受一个选项对象，包括以下选项
        * name? string 组件名称，当一个组件用作页面时name可以没有
        * template string 组件html内容
        * style string 组件的样式
        * events Event[] 组件可以发出的事件
    3. <code>@Directive</code>
    * 用于修饰一个指令类(该类继承自DirectiveMvvm)
    * 接受一个选项对象，包括以下选项
        * name string 指令名称
        * events Event[] 组件可以发出的事件
    4. <code>@Reactive</code>
    * 用于修饰响应式的属性
    5. <code>@Prop</code>
    * 用于修饰一个组件的属性（属性值由父组件传递）
    * 接受一组参数，如下:
        * name string 属性名
        * required bool 是否必须
        * type? "string"|"array"|"object"|"number"|"boolean" 属性类型
    6. <code>@Computed</code>
    * 用于修饰计算属性
    7. <code>@OnInit</code>
    * 用于修饰生命周期init阶段的回调函数
    8. <code>@OnMount</code>
    * 用于修饰生命周期mount阶段的回调函数
    9. <code>@Destroy</code>
    * 用于修饰生命周期destroy阶段的回调函数

4. 内置常用指令
    1. r-if 判断结构，使用示例
    ```html
    <span r-if="expression">hello</span>
    ```

    2. r-for 循环结构，使用示例
    ```html
    <span r-for="item in items">{{item}}</span>
    ```
    3. model 双向绑定，使用示例 
    ```html
    <input r-model="exp"/>
    ```
    4. {{}} 文字绑定
    5. 内置事件
        * r-click，元素点击事件,参数 $event 原始事件对象
    6. r-href html内容
    将一段html内容渲染到界面上，使用示例
    ```html
        <p r-html="{{htmltext}}"></p>
    ```
    7. r-class css类条件判断
    使用示例
    ```html
    <span r-class="{'color-red':isred,'border-blue':isblue}">hello</span>
    ```
    8. r-style style类条件判断
    使用示例
    ```html
    <span r-style="{'color':isred?'red':'blue','border':isborder?'1px solid blue':''}">hello</span>
    ```
    9. r-template 用于包裹一段元素，本身不会被渲染出来
5. 高级使用
    1. 路由
    2. 自定义组件
    3. 指令
    4. fragment
    用以解决动态表单等常见问题

(好累哦，还没写完...)











