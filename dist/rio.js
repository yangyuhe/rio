module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/const.ts":
/*!**********************!*\
  !*** ./src/const.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.DIR_MODEL = "model";
exports.DIR_EVENT_CLICK = "click";
exports.PRE = "r-";
/**花括号数据绑定表达式 */
exports.REG_SINGLE = /^\{\{([^\{\}]*)\}\}$/;
exports.REG_MULTI = /\{\{(.*?)\}\}/;
/**事件监听响应函数 */
exports.REG_EVENT = /^(\w+)\((.*)\)$/;
/**字符串 */
exports.REG_STR = /^(['"])(.*?)\1$/;
exports.REG_MID_STR = /(['"])(.*?)\1/;
/**输入属性 */
exports.REG_IN = /^\[(\w+)\]$/;
/**输出事件 */
exports.REG_OUT = /^\((\w+)\)$/;
/**正常属性 */
exports.REG_ATTR = /^[A-z_]\w*$/;
/**测试输出项 */
exports.REG_TEST_OUTPUT = /^((click))$/;
var VNodeStatus;
(function (VNodeStatus) {
    /**依然处于vnode树中 */
    VNodeStatus[VNodeStatus["ACTIVE"] = 0] = "ACTIVE";
    /**不在vnode树中但是有可能重新加回来 */
    VNodeStatus[VNodeStatus["INACTIVE"] = 1] = "INACTIVE";
    /**抛弃 */
    VNodeStatus[VNodeStatus["DEPRECATED"] = 2] = "DEPRECATED";
})(VNodeStatus = exports.VNodeStatus || (exports.VNodeStatus = {}));


/***/ }),

/***/ "./src/decorator/app.ts":
/*!******************************!*\
  !*** ./src/decorator/app.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var app_manager_1 = __webpack_require__(/*! ../manager/app-manager */ "./src/manager/app-manager.ts");
var vdom_1 = __webpack_require__(/*! ../vdom/vdom */ "./src/vdom/vdom.ts");
var property_1 = __webpack_require__(/*! ./property */ "./src/decorator/property.ts");
function App(option) {
    checkAppOption(option);
    var res = property_1.FetchProperty();
    return function (target) {
        var constructor = /** @class */ (function (_super) {
            __extends($AppMvvm, _super);
            function $AppMvvm() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.$InitFuncs = res.initFuncs;
                _this.$DestroyFuncs = res.destroyFuncs;
                return _this;
            }
            $AppMvvm.prototype.$initialize = function () {
                var _this = this;
                _super.prototype.$initialize.call(this);
                this.$InitFuncs.forEach(function (init) {
                    _this[init].call(_this);
                });
            };
            $AppMvvm.prototype.$OnDestroy = function () {
                var _this = this;
                _super.prototype.$OnDestroy.call(this);
                this.$DestroyFuncs.forEach(function (destroy) {
                    _this[destroy].call(_this);
                });
            };
            $AppMvvm.prototype.$InitTreeroot = function () {
                var dom = document.querySelector(option.el);
                if (dom == null) {
                    throw new Error("no specified element " + option.el);
                }
                var vdom = vdom_1.TraverseDom(dom);
                var vnode = vdom_1.NewVNode(vdom, this, null);
                return vnode;
            };
            $AppMvvm.prototype.$InitNamespace = function () {
                return option.namespace;
            };
            $AppMvvm.prototype.$InitDataItems = function () {
                var _this = this;
                var datas = [];
                res.datas.forEach(function (item) {
                    datas.push({ name: item, value: _this[item] });
                });
                return datas;
            };
            $AppMvvm.prototype.$InitComputeItems = function () {
                return res.computes;
            };
            $AppMvvm.prototype.$InitEl = function () {
                return option.el;
            };
            return $AppMvvm;
        }(target));
        app_manager_1.RegisterApp(constructor);
    };
}
exports.App = App;
function checkAppOption(option) {
    option.namespace = option.namespace ? option.namespace : "default";
}


/***/ }),

/***/ "./src/decorator/component.ts":
/*!************************************!*\
  !*** ./src/decorator/component.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var components_manager_1 = __webpack_require__(/*! ../manager/components-manager */ "./src/manager/components-manager.ts");
var property_1 = __webpack_require__(/*! ./property */ "./src/decorator/property.ts");
var vdom_1 = __webpack_require__(/*! ../vdom/vdom */ "./src/vdom/vdom.ts");
function Component(option) {
    checkComponentOption(option);
    var res = property_1.FetchProperty();
    return function (target) {
        var constructor = /** @class */ (function (_super) {
            __extends($ComponentMvvm, _super);
            function $ComponentMvvm() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.$InitFuncs = res.initFuncs;
                _this.$DestroyFuncs = res.destroyFuncs;
                return _this;
            }
            $ComponentMvvm.prototype.$initialize = function () {
                var _this = this;
                _super.prototype.$initialize.call(this);
                this.$InitFuncs.forEach(function (init) {
                    _this[init].call(_this);
                });
            };
            $ComponentMvvm.prototype.$OnDestroy = function () {
                var _this = this;
                _super.prototype.$OnDestroy.call(this);
                this.$DestroyFuncs.forEach(function (destroy) {
                    _this[destroy].call(_this);
                });
            };
            $ComponentMvvm.prototype.$InitTreeroot = function () {
                var domtree = components_manager_1.GetDomTree(this.$InitName(), this.$InitNamespace());
                if (domtree == null) {
                    throw new Error("not found template or templateUrl for component " + this.$InitName() + " in " + this.$InitNamespace());
                }
                var vnode = vdom_1.NewVNode(domtree, this, null);
                return vnode;
            };
            $ComponentMvvm.prototype.$InitNamespace = function () {
                return option.namespace;
            };
            $ComponentMvvm.prototype.$InitDataItems = function () {
                var _this = this;
                var datas = [];
                res.datas.forEach(function (item) {
                    datas.push({ name: item, value: _this[item] });
                });
                return datas;
            };
            $ComponentMvvm.prototype.$InitComputeItems = function () {
                return res.computes;
            };
            $ComponentMvvm.prototype.$InitName = function () {
                return option.name;
            };
            $ComponentMvvm.prototype.$InitIns = function () {
                return res.props;
            };
            $ComponentMvvm.prototype.$InitOuts = function () {
                //todo
                return [];
            };
            return $ComponentMvvm;
        }(target));
        components_manager_1.RegisterComponent(option.name, option.namespace, constructor, option);
    };
}
exports.Component = Component;
function checkComponentOption(option) {
    option.namespace = option.namespace ? option.namespace : "default";
    option.events = option.events ? option.events : [];
}


/***/ }),

/***/ "./src/decorator/directive.ts":
/*!************************************!*\
  !*** ./src/decorator/directive.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var property_1 = __webpack_require__(/*! ./property */ "./src/decorator/property.ts");
var directive_manager_1 = __webpack_require__(/*! ../manager/directive-manager */ "./src/manager/directive-manager.ts");
function Directive(option) {
    checkDirectiveOption(option);
    var res = property_1.FetchProperty();
    return function (target) {
        var constructor = /** @class */ (function (_super) {
            __extends($DirectiveMvvm, _super);
            function $DirectiveMvvm(directive, vnode) {
                var _this = _super.call(this, directive, vnode) || this;
                _this.$Name = option.name;
                _this.$Namespace = option.namespace;
                _this.$Ins = res.props;
                _this.$Out = option.events;
                _this.$InitFuncs = res.initFuncs;
                _this.$DestroyFuncs = res.destroyFuncs;
                return _this;
            }
            return $DirectiveMvvm;
        }(target));
        directive_manager_1.RegisterDirective(option.name, option.namespace, constructor);
    };
}
exports.Directive = Directive;
function checkDirectiveOption(option) {
    option.events = option.events ? option.events : [];
    option.namespace = option.namespace ? option.namespace : "default";
}


/***/ }),

/***/ "./src/decorator/property.ts":
/*!***********************************!*\
  !*** ./src/decorator/property.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var datas = [];
var computes = [];
var props = [];
var initFuncs = [];
var destroyFuncs = [];
function Data(target, key) {
    datas.push(key);
}
exports.Data = Data;
function Computed(target, key, descriptor) {
    computes.push({ name: key, get: descriptor.get });
}
exports.Computed = Computed;
function Prop(name, required, type) {
    props.push({
        name: name,
        required: required,
        type: type
    });
    return function (target, key) { };
}
exports.Prop = Prop;
function OnInit(target, key, descriptor) {
    initFuncs.push(key);
}
exports.OnInit = OnInit;
function OnDestroy(target, key, descriptor) {
    destroyFuncs.push(key);
}
exports.OnDestroy = OnDestroy;
function FetchProperty() {
    var res = {
        computes: computes,
        props: props,
        initFuncs: initFuncs,
        destroyFuncs: destroyFuncs,
        datas: datas
    };
    computes = [];
    props = [];
    initFuncs = [];
    destroyFuncs = [];
    datas = [];
    return res;
}
exports.FetchProperty = FetchProperty;


/***/ }),

/***/ "./src/directive/href.ts":
/*!*******************************!*\
  !*** ./src/directive/href.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
function Href(exp, vnode, isconst) {
    var href = "";
    if (vnode.Dom.nodeName.toLowerCase() == "a") {
        if (isconst) {
            var streval = util_1.StrToEvalstr(exp);
            if (streval.isconst)
                vnode.Dom.setAttribute(const_1.PRE + "href", streval.exp);
            else {
                vnode.mvvm.$Watch(vnode, streval.exp, function (newvalue) {
                    href = newvalue;
                    vnode.Dom.setAttribute(const_1.PRE + "href", newvalue);
                });
            }
        }
        else {
            vnode.mvvm.$Watch(vnode, exp, function (newvalue) {
                href = newvalue;
                vnode.Dom.setAttribute(const_1.PRE + "href", newvalue);
            });
        }
    }
    vnode.Dom.addEventListener("click", function () {
        vnode.NavigateTo(href);
    });
}
exports.Href = Href;


/***/ }),

/***/ "./src/directive/html.ts":
/*!*******************************!*\
  !*** ./src/directive/html.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
function Html(exp, vnode, noBracket) {
    if (noBracket) {
        var strEval = util_1.StrToEvalstr(exp);
        if (strEval.isconst)
            vnode.Dom.innerHTML = strEval.exp;
        else
            vnode.mvvm.$Watch(vnode, strEval.exp, function (newvalue) {
                vnode.Dom.innerHTML = newvalue;
            });
    }
    else {
        vnode.mvvm.$Watch(vnode, exp, function (newvalue) {
            vnode.Dom.innerHTML = newvalue;
        });
    }
}
exports.Html = Html;


/***/ }),

/***/ "./src/directive/inner-dir.ts":
/*!************************************!*\
  !*** ./src/directive/inner-dir.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var href_1 = __webpack_require__(/*! ./href */ "./src/directive/href.ts");
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
var model_1 = __webpack_require__(/*! ./model */ "./src/directive/model.ts");
var onclick_1 = __webpack_require__(/*! ./onclick */ "./src/directive/onclick.ts");
var html_1 = __webpack_require__(/*! ./html */ "./src/directive/html.ts");
var innerDirs = {};
function RegisterInnerDir(name, comiple) {
    if (innerDirs[name] != null)
        throw new Error("inner directive " + name + " already exists");
    innerDirs[name] = comiple;
}
function GetInnerDir(name) {
    return innerDirs[name];
}
exports.GetInnerDir = GetInnerDir;
RegisterInnerDir(const_1.PRE + "href", href_1.Href);
RegisterInnerDir(const_1.PRE + "model", model_1.DirModel);
RegisterInnerDir(const_1.PRE + "click", onclick_1.OnClick);
RegisterInnerDir(const_1.PRE + "html", html_1.Html);


/***/ }),

/***/ "./src/directive/model.ts":
/*!********************************!*\
  !*** ./src/directive/model.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
function DirModel(exp, vnode, isconst) {
    var inputtype = vnode.Vdom.GetAttr("type");
    var input = vnode.Vdom.NodeName.toLowerCase();
    if (input == "input" && inputtype == "checkbox") {
        vnode.mvvm.$Watch(vnode, exp, function (newvalue) {
            setValue(vnode, newvalue);
        }, true);
    }
    else {
        vnode.mvvm.$Watch(vnode, exp, function (newvalue) {
            setValue(vnode, newvalue);
        });
    }
    vnode.Dom.addEventListener("input", function (event) {
        //select控件
        if (vnode.NodeName.toLowerCase() == "select") {
            vnode.mvvm.$SetValue(exp, event.target.value);
            return;
        }
        //text radio checkbox控件
        var inputType = vnode.Dom.getAttribute("type");
        if (inputType == null || inputType == "")
            inputType = "text";
        switch (inputType) {
            case "text":
            case "radio":
                vnode.mvvm.$SetValue(exp, event.target.value);
                break;
            case "checkbox":
                var cur = vnode.mvvm.$GetExpValue(exp);
                if (toString.call(cur) == "[object Array]") {
                    var oldarray = cur;
                    var index = oldarray.indexOf(event.target.value);
                    if (index == -1) {
                        oldarray.push(event.target.value);
                    }
                    else {
                        oldarray.splice(index, 1);
                    }
                }
                break;
        }
    });
}
exports.DirModel = DirModel;
function setValue(vnode, newvalue) {
    //select控件
    if (vnode.NodeName.toLowerCase() == "select") {
        vnode.Dom.value = newvalue;
        return;
    }
    //text radio checkbox控件
    var inputType = vnode.Dom.getAttribute("type");
    if (inputType == null || inputType == "")
        inputType = "text";
    switch (inputType) {
        case "text":
            vnode.Dom.value = newvalue;
            break;
        case "radio":
            if (vnode.Dom.value == newvalue) {
                vnode.Dom.checked = true;
            }
            else
                vnode.Dom.checked = false;
            break;
        case "checkbox":
            if (toString.call(newvalue) == "[object Array]") {
                if (newvalue.indexOf(vnode.Dom.value) == -1) {
                    vnode.Dom.checked = false;
                }
                else
                    vnode.Dom.checked = true;
            }
            break;
    }
}


/***/ }),

/***/ "./src/directive/onclick.ts":
/*!**********************************!*\
  !*** ./src/directive/onclick.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
function OnClick(exp, vnode, isconst) {
    if (const_1.REG_EVENT.test(exp)) {
        var methodStr_1 = RegExp.$1;
        var paramsStr = RegExp.$2;
        if (paramsStr.length > 0) {
            var ps_1 = paramsStr.split(",");
            vnode.Dom.addEventListener("click", function () {
                var params = [];
                ps_1.forEach(function (p) {
                    if (!const_1.REG_STR.test(p)) {
                        if (p === "true") {
                            params.push(true);
                            return;
                        }
                        if (p === "false") {
                            params.push(false);
                        }
                        var n = new Number(p).valueOf();
                        if (!isNaN(n)) {
                            params.push(n.valueOf());
                        }
                        else {
                            //肯定是本地变量
                            params.push(vnode.mvvm.$GetExpValue(p));
                        }
                    }
                    else {
                        params.push(RegExp.$2);
                    }
                });
                (_a = vnode.mvvm).$RevokeMethod.apply(_a, [methodStr_1].concat(params));
                var _a;
            });
        }
        else {
            vnode.Dom.addEventListener("click", function () {
                vnode.mvvm.$RevokeMethod(methodStr_1);
            });
        }
    }
}
exports.OnClick = OnClick;


/***/ }),

/***/ "./src/eval.js":
/*!*********************!*\
  !*** ./src/eval.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

var EvalExp=function(context,exp){
    var res
    try {
        with(context){
            res=eval(exp)
        }
        return res
    } catch (error) {
        console.error("eval "+exp+" failed")
        console.error(error)
    }
    return "" 
}
exports.EvalExp=EvalExp


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var start_1 = __webpack_require__(/*! ./manager/start */ "./src/manager/start.ts");
var component_1 = __webpack_require__(/*! ./decorator/component */ "./src/decorator/component.ts");
exports.Component = component_1.Component;
var app_1 = __webpack_require__(/*! ./decorator/app */ "./src/decorator/app.ts");
exports.App = app_1.App;
var property_1 = __webpack_require__(/*! ./decorator/property */ "./src/decorator/property.ts");
exports.Data = property_1.Data;
exports.Computed = property_1.Computed;
exports.Prop = property_1.Prop;
exports.OnInit = property_1.OnInit;
exports.OnDestroy = property_1.OnDestroy;
var directive_1 = __webpack_require__(/*! ./decorator/directive */ "./src/decorator/directive.ts");
exports.Directive = directive_1.Directive;
var component_mvvm_1 = __webpack_require__(/*! ./mvvm/component-mvvm */ "./src/mvvm/component-mvvm.ts");
exports.ComponentMvvm = component_mvvm_1.ComponentMvvm;
var app_mvvm_1 = __webpack_require__(/*! ./mvvm/app-mvvm */ "./src/mvvm/app-mvvm.ts");
exports.AppMvvm = app_mvvm_1.AppMvvm;
var directive_mvvm_1 = __webpack_require__(/*! ./mvvm/directive-mvvm */ "./src/mvvm/directive-mvvm.ts");
exports.DirectiveMVVM = directive_mvvm_1.DirectiveMVVM;
var router_manager_1 = __webpack_require__(/*! ./router/router-manager */ "./src/router/router-manager.ts");
exports.RegisterRouter = router_manager_1.RegisterRouter;
document.addEventListener("DOMContentLoaded", function () {
    start_1.Start();
});


/***/ }),

/***/ "./src/manager/app-manager.ts":
/*!************************************!*\
  !*** ./src/manager/app-manager.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var apps = [];
function RegisterApp(app) {
    apps.push(app);
}
exports.RegisterApp = RegisterApp;
function GetApp() {
    return apps;
}
exports.GetApp = GetApp;


/***/ }),

/***/ "./src/manager/components-manager.ts":
/*!*******************************************!*\
  !*** ./src/manager/components-manager.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
var vdom_1 = __webpack_require__(/*! ../vdom/vdom */ "./src/vdom/vdom.ts");
var repository = {};
function Id(namespace, name) {
    return namespace + "::" + name;
}
exports.Id = Id;
function RegisterComponent(name, namespace, constructor, option) {
    var factoryOption = {
        $constructor: constructor,
        $id: Id(namespace, name),
        $preProcess: false,
        $domtree: null,
        $origin: option
    };
    if (repository[factoryOption.$id] != null)
        throw new Error("component " + factoryOption.$id + " already exists");
    repository[factoryOption.$id] = factoryOption;
}
exports.RegisterComponent = RegisterComponent;
function RegisterComponentDirect(option) {
    if (repository[option.$id] != null)
        throw new Error("component " + option.$id + " has already exist");
    repository[option.$id] = option;
}
exports.RegisterComponentDirect = RegisterComponentDirect;
function InitComponent(name, namespace) {
    name = name.toLowerCase();
    namespace = namespace.toLowerCase();
    var factory = repository[Id(namespace, name)];
    if (factory && !factory.$preProcess) {
        preProcess(factory);
        factory.$preProcess = true;
    }
    if (factory) {
        return factory.$constructor;
    }
    else {
        throw new Error("component " + Id(namespace, name) + " not exists");
    }
}
exports.InitComponent = InitComponent;
function GetDomTree(name, namespace) {
    name = name.toLowerCase();
    namespace = namespace.toLowerCase();
    var factory = repository[Id(namespace, name)];
    if (factory == null)
        return null;
    return factory.$domtree;
}
exports.GetDomTree = GetDomTree;
function IsComponentRegistered(name, namespace) {
    name = name.toLowerCase();
    namespace = namespace.toLowerCase();
    if (repository[Id(namespace, name)])
        return true;
    else
        return false;
}
exports.IsComponentRegistered = IsComponentRegistered;
function preProcess(option) {
    //模版
    if (option.$origin.templateUrl != null) {
        option.$origin.template = util_1.HttpGet(option.$origin.templateUrl);
        if (option.$origin.template == null) {
            util_1.LogError("path " + option.$origin.templateUrl + " not found");
            return;
        }
    }
    var res = (new DOMParser()).parseFromString(option.$origin.template, "text/html").body;
    if (res.children.length > 1)
        throw new Error(option.$origin.name + "::" + option.$origin.namespace + " template should have only one root");
    if (res.children.length == 1)
        option.$domtree = vdom_1.TraverseDom(res.children[0]);
    else {
        if (res.childNodes.length == 1)
            option.$domtree = vdom_1.TraverseDom(res.childNodes[0]);
        else
            throw new Error("template should not be empty");
    }
    //样式
    if (option.$origin.styleUrl != null) {
        option.$origin.style = util_1.HttpGet(option.$origin.styleUrl);
    }
    if (option.$origin.style != null) {
        // let css = option.style.replace(/(?!\s)([^\{\}]+?)(?=\s*\{[^\{\}]*\})/g, function (str) {
        //     return str + "[" + option.$id + "]"
        // })
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = option.$origin.style;
        document.getElementsByTagName('head')[0].appendChild(style);
        addAttr(option.$domtree, option.$id);
    }
}
function addAttr(dom, attr) {
    dom.AddAttr(attr);
    if (dom.NodeType == 1) {
        dom.Children.forEach(function (child) {
            addAttr(child, attr);
        });
    }
}


/***/ }),

/***/ "./src/manager/directive-manager.ts":
/*!******************************************!*\
  !*** ./src/manager/directive-manager.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var components_manager_1 = __webpack_require__(/*! ./components-manager */ "./src/manager/components-manager.ts");
var repository = {};
function RegisterDirective(name, namespace, constructor) {
    if (repository[components_manager_1.Id(namespace, name)] != null)
        throw new Error("directive " + components_manager_1.Id(namespace, name) + " already exists");
    repository[components_manager_1.Id(namespace, name)] = constructor;
}
exports.RegisterDirective = RegisterDirective;
function GetDirectiveCon(name, namespace) {
    name = name.toLowerCase();
    namespace = namespace.toLowerCase();
    var constructor = repository[components_manager_1.Id(namespace, name)];
    return constructor;
}
exports.GetDirectiveCon = GetDirectiveCon;
function IsDirectiveRegistered(name, namespace) {
    name = name.toLowerCase();
    namespace = namespace.toLowerCase();
    if (repository[components_manager_1.Id(namespace, name)] != null)
        return true;
    else
        return false;
}
exports.IsDirectiveRegistered = IsDirectiveRegistered;


/***/ }),

/***/ "./src/manager/start.ts":
/*!******************************!*\
  !*** ./src/manager/start.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var app_manager_1 = __webpack_require__(/*! ./app-manager */ "./src/manager/app-manager.ts");
function Start() {
    var apps = app_manager_1.GetApp();
    apps.forEach(function (App) {
        var mvvm = new App();
        mvvm.$initialize();
        mvvm.$SetRoot(true);
        var content = mvvm.$Render();
        var target = document.querySelector(mvvm.$InitEl());
        target.parentElement.replaceChild(content, target);
    });
}
exports.Start = Start;


/***/ }),

/***/ "./src/models.ts":
/*!***********************!*\
  !*** ./src/models.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
/**for语句 */
var ForExp = /** @class */ (function () {
    function ForExp(itemExp, arrayExp) {
        this.itemExp = itemExp;
        this.arrayExp = arrayExp;
    }
    return ForExp;
}());
exports.ForExp = ForExp;


/***/ }),

/***/ "./src/mvvm/app-mvvm.ts":
/*!******************************!*\
  !*** ./src/mvvm/app-mvvm.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var router_manager_1 = __webpack_require__(/*! ../router/router-manager */ "./src/router/router-manager.ts");
var mvvm_1 = __webpack_require__(/*! ./mvvm */ "./src/mvvm/mvvm.ts");
var AppMvvm = /** @class */ (function (_super) {
    __extends(AppMvvm, _super);
    function AppMvvm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.$el = "";
        return _this;
    }
    AppMvvm.prototype.$NavigateTo = function (url) {
        window.history.replaceState(null, null, url);
        router_manager_1.NotifyUrlChange();
    };
    AppMvvm.prototype.$Render = function () {
        this.$treeRoot.Render();
        return this.$treeRoot.Dom;
    };
    AppMvvm.prototype.$RevokeMethod = function (method) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (typeof this[method] == "function")
            this[method].apply(this, params);
    };
    AppMvvm.prototype.$InitNamespace = function () {
        throw new Error("Method not implemented.");
    };
    AppMvvm.prototype.$InitDataItems = function () {
        throw new Error("Method not implemented.");
    };
    AppMvvm.prototype.$InitComputeItems = function () {
        throw new Error("Method not implemented.");
    };
    AppMvvm.prototype.$InitTreeroot = function () {
        throw new Error("Method not implemented.");
    };
    AppMvvm.prototype.$InitEl = function () {
        throw new Error("Method not implemented.");
    };
    return AppMvvm;
}(mvvm_1.Mvvm));
exports.AppMvvm = AppMvvm;


/***/ }),

/***/ "./src/mvvm/component-mvvm.ts":
/*!************************************!*\
  !*** ./src/mvvm/component-mvvm.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mvvm_1 = __webpack_require__(/*! ./mvvm */ "./src/mvvm/mvvm.ts");
var revoke_event_1 = __webpack_require__(/*! ./revoke-event */ "./src/mvvm/revoke-event.ts");
var ComponentMvvm = /** @class */ (function (_super) {
    __extends(ComponentMvvm, _super);
    function ComponentMvvm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hirented = false;
        _this.$name = "";
        _this.$ins = [];
        return _this;
    }
    ComponentMvvm.prototype.$initialize = function () {
        _super.prototype.$initialize.call(this);
        this.$name = this.$InitName();
        this.$ins = this.$InitIns();
    };
    ComponentMvvm.prototype.$checkProp = function (prop, value) {
        var error = function (name, prop, type) {
            throw new Error("component \'" + name + "\' prop \'" + prop + "\' not receive " + type);
        };
        if (prop.type == "array" && toString.call(value) != "[object Array]") {
            error(this.$name, prop.name, prop.type);
        }
        if (prop.type == "object" && toString.call(value) != "[object Object]") {
            error(this.$name, prop.name, prop.type);
        }
        if (prop.type == "number" && toString.call(value) != "[object Number]") {
            error(this.$name, prop.name, prop.type);
        }
        if (prop.type == "boolean" && toString.call(value) != "[object Boolean]") {
            error(this.$name, prop.name, prop.type);
        }
        if (prop.type == "string" && toString.call(value) != "[object String]") {
            error(this.$name, prop.name, prop.type);
        }
    };
    ComponentMvvm.prototype.$SetHirented = function (hirentedFromParent) {
        this.hirented = hirentedFromParent;
    };
    ComponentMvvm.prototype.$Render = function () {
        var _this = this;
        if (this.hirented) {
            this.$dataItems.forEach(function (item) {
                _this.$fenceNode.mvvm.$Watch(_this.$fenceNode, item.name, function (newvalue, oldvalue) {
                    _this[item.name] = newvalue;
                });
            });
        }
        this.$ins.forEach(function (prop) {
            var inName = _this.$fenceNode.GetIn(prop.name);
            if (inName == null && prop.required) {
                throw new Error("component \'" + _this.$name + "\' need prop \'" + prop.name);
            }
            if (inName != null) {
                if (inName.const) {
                    _this[prop.name] = inName.value;
                }
                else {
                    _this.$fenceNode.mvvm.$Watch(_this.$fenceNode, inName.value, function (newvalue, oldvalue) {
                        _this.$checkProp(prop, newvalue);
                        _this[prop.name] = newvalue;
                    });
                    _this.$observe.ReactiveKey(_this, prop.name, true);
                }
            }
        });
        this.$treeRoot.Render();
        return this.$treeRoot.Dom;
    };
    ComponentMvvm.prototype.$Refresh = function () {
        this.$treeRoot.Refresh();
    };
    ComponentMvvm.prototype.$Update = function () {
        this.$treeRoot.Update();
    };
    ComponentMvvm.prototype.$SetStatus = function (status) {
        this.$treeRoot.SetStatus(status);
    };
    ComponentMvvm.prototype.$RevokeMethod = function (method) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (this.hirented) {
            (_a = this.$fenceNode.mvvm).$RevokeMethod.apply(_a, [method].concat(params));
        }
        else {
            if (typeof this[method] == "function")
                this[method].apply(this, params);
        }
        var _a;
    };
    ComponentMvvm.prototype.$Emit = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        if (this.$fenceNode != null && this.$fenceNode.mvvm != null) {
            var method = this.$fenceNode.GetOut(event);
            revoke_event_1.RevokeEvent(method, data, this.$fenceNode.mvvm);
        }
    };
    ;
    ComponentMvvm.prototype.$OnRouterChange = function () {
        this.$treeRoot.OnRouterChange();
    };
    ComponentMvvm.prototype.$GetFenceNode = function () {
        return this.$fenceNode;
    };
    ComponentMvvm.prototype.$SetFenceNode = function (node) {
        this.$fenceNode = node;
    };
    ComponentMvvm.prototype.$InitNamespace = function () {
        throw new Error("Method not implemented.");
    };
    ComponentMvvm.prototype.$InitDataItems = function () {
        throw new Error("Method not implemented.");
    };
    ComponentMvvm.prototype.$InitComputeItems = function () {
        throw new Error("Method not implemented.");
    };
    ComponentMvvm.prototype.$InitName = function () {
        throw new Error("Method not implemented.");
    };
    ComponentMvvm.prototype.$InitIns = function () {
        throw new Error("Method not implemented.");
    };
    ComponentMvvm.prototype.$InitOuts = function () {
        throw new Error("Method not implemented.");
    };
    ComponentMvvm.prototype.$InitTreeroot = function () {
        throw new Error("Method not implemented.");
    };
    ComponentMvvm.prototype.$GetIns = function () {
        return this.$ins;
    };
    return ComponentMvvm;
}(mvvm_1.Mvvm));
exports.ComponentMvvm = ComponentMvvm;


/***/ }),

/***/ "./src/mvvm/directive-mvvm.ts":
/*!************************************!*\
  !*** ./src/mvvm/directive-mvvm.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var DirectiveMVVM = /** @class */ (function () {
    function DirectiveMVVM($directive, $vnode) {
        this.$directive = $directive;
        this.$vnode = $vnode;
        this.$Ins = [];
        this.$Outs = [];
        this.$InitFuncs = [];
        this.$DestroyFuncs = [];
    }
    DirectiveMVVM.prototype.$OnDestroy = function () {
        var _this = this;
        this.$DestroyFuncs.forEach(function (destroy) {
            _this[destroy].call(_this);
        });
    };
    DirectiveMVVM.prototype.$Render = function () {
        var _this = this;
        this.$element = this.$vnode.Dom;
        this.$InitFuncs.forEach(function (init) {
            _this[init].call(_this);
        });
        this.$Ins.forEach(function (prop) {
            var inName = _this.$directive.GetIn(prop.name);
            if (inName == null && prop.required) {
                throw new Error("component \'" + _this.$Name + "\' need prop \'" + prop.name);
            }
            if (inName != null) {
                if (inName.const) {
                    _this[prop.name] = inName.value;
                }
                else {
                    _this.$vnode.mvvm.$Watch(_this.$vnode, inName.value, function (newvalue, oldvalue) {
                        _this.$checkProp(prop, newvalue);
                        _this[prop.name] = newvalue;
                    });
                }
            }
        });
    };
    DirectiveMVVM.prototype.$checkProp = function (prop, value) {
        var error = function (name, prop, type) {
            throw new Error("component \'" + name + "\' prop \'" + prop + "\' not receive " + type);
        };
        if (prop.type == "array" && toString.call(value) != "[object Array]") {
            error(this.$Name, prop.name, prop.type);
        }
        if (prop.type == "object" && toString.call(value) != "[object Object]") {
            error(this.$Name, prop.name, prop.type);
        }
        if (prop.type == "number" && toString.call(value) != "[object Number]") {
            error(this.$Name, prop.name, prop.type);
        }
        if (prop.type == "boolean" && toString.call(value) != "[object Boolean]") {
            error(this.$Name, prop.name, prop.type);
        }
        if (prop.type == "string" && toString.call(value) != "[object String]") {
            error(this.$Name, prop.name, prop.type);
        }
    };
    return DirectiveMVVM;
}());
exports.DirectiveMVVM = DirectiveMVVM;


/***/ }),

/***/ "./src/mvvm/mvvm.ts":
/*!**************************!*\
  !*** ./src/mvvm/mvvm.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var observe_1 = __webpack_require__(/*! ../observer/observe */ "./src/observer/observe.ts");
var router_state_1 = __webpack_require__(/*! ../router/router-state */ "./src/router/router-state.ts");
var Mvvm = /** @class */ (function () {
    function Mvvm() {
        this.$data = {};
        this.$dataItems = [];
        this.$computeItems = [];
        this.$isroot = false;
    }
    Object.defineProperty(Mvvm.prototype, "$router", {
        get: function () {
            return {
                active: router_state_1.GetActiveRouter(),
                cur: null
            };
        },
        enumerable: true,
        configurable: true
    });
    Mvvm.prototype.$initialize = function () {
        var _this = this;
        this.$observe = new observe_1.Observe(this);
        this.$dataItems = this.$InitDataItems();
        this.$computeItems = this.$InitComputeItems();
        this.$treeRoot = this.$InitTreeroot();
        this.$treeRoot.AttachDom();
        this.$dataItems.forEach(function (item) {
            _this.$data[item.name] = item.value;
            Object.defineProperty(_this, item.name, {
                get: function () {
                    return _this.$data[item.name];
                },
                set: function (value) {
                    _this.$data[item.name] = value;
                }
            });
        });
        this.$observe.ReactiveData(this.$data);
        this.$computeItems.forEach(function (item) {
            _this.$observe.WatchComputed(_this.$treeRoot, item.name, item.get);
        });
    };
    Mvvm.prototype.$GetExpValue = function (exp) {
        return this.$observe.GetValueWithExp(exp);
    };
    Mvvm.prototype.$SetValue = function (exp, value) {
        var keys = exp.split(".");
        var target = this.$data;
        var hasTraget = true;
        for (var i = 0; i < keys.length - 1; i++) {
            if (target != null)
                target = target[keys[i]];
            else {
                hasTraget = false;
                break;
            }
        }
        if (hasTraget && target != null)
            target[keys[keys.length - 1]] = value;
    };
    Mvvm.prototype.$Watch = function (vnode, exp, listener, arraydeep) {
        this.$observe.AddWatcher(vnode, exp, listener, arraydeep);
    };
    Mvvm.prototype.$OnDestroy = function () {
        this.$treeRoot.OnRemoved();
    };
    Mvvm.prototype.$SetRoot = function (isroot) {
        this.$isroot = isroot;
    };
    Mvvm.prototype.$IsRoot = function () {
        return this.$isroot;
    };
    Mvvm.prototype.$GetDataItems = function () {
        return this.$dataItems;
    };
    Mvvm.prototype.$GetComputedItems = function () {
        return this.$computeItems;
    };
    return Mvvm;
}());
exports.Mvvm = Mvvm;


/***/ }),

/***/ "./src/mvvm/revoke-event.ts":
/*!**********************************!*\
  !*** ./src/mvvm/revoke-event.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
function RevokeEvent(method, data, mvvm) {
    if (const_1.REG_EVENT.test(method)) {
        var methodStr = RegExp.$1;
        var paramsStr = RegExp.$2;
        if (paramsStr.length > 0) {
            var ps = paramsStr.split(",");
            var params_1 = [];
            ps.forEach(function (p) {
                if (!const_1.REG_STR.test(p)) {
                    if (p === "true") {
                        params_1.push(true);
                        return;
                    }
                    if (p === "false") {
                        params_1.push(false);
                        return;
                    }
                    if (p == "$event") {
                        params_1.push.apply(params_1, data);
                        return;
                    }
                    var n = new Number(p).valueOf();
                    if (!isNaN(n)) {
                        params_1.push(n.valueOf());
                    }
                    else {
                        //肯定是本地变量
                        params_1.push(mvvm.$GetExpValue(p));
                    }
                }
                else {
                    params_1.push(RegExp.$2);
                }
            });
            mvvm.$RevokeMethod.apply(mvvm, [methodStr].concat(params_1));
        }
        else {
            mvvm.$RevokeMethod(methodStr);
        }
    }
}
exports.RevokeEvent = RevokeEvent;


/***/ }),

/***/ "./src/observer/msg-queue.ts":
/*!***********************************!*\
  !*** ./src/observer/msg-queue.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var queue = [];
var settimeout = false;
function AddWatcher(watcher) {
    if (queue.indexOf(watcher) == -1)
        queue.push(watcher);
    if (!settimeout) {
        settimeout = true;
        setTimeout(function () {
            RevokeWatcher();
            settimeout = false;
        }, 0);
    }
}
exports.AddWatcher = AddWatcher;
function RevokeWatcher() {
    var temp = [];
    queue.forEach(function (q) { return temp.push(q); });
    queue = [];
    temp.forEach(function (watcher) { return watcher.Update(); });
    if (queue.length > 0) {
        RevokeWatcher();
    }
}
exports.RevokeWatcher = RevokeWatcher;


/***/ }),

/***/ "./src/observer/observe.ts":
/*!*********************************!*\
  !*** ./src/observer/observe.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var watcher_1 = __webpack_require__(/*! ./watcher */ "./src/observer/watcher.ts");
var msg_queue_1 = __webpack_require__(/*! ./msg-queue */ "./src/observer/msg-queue.ts");
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
var eval_1 = __webpack_require__(/*! ../eval */ "./src/eval.js");
var Observe = /** @class */ (function () {
    function Observe(data) {
        this.data = data;
    }
    Observe.prototype.GetValue = function (watcher) {
        Observe.target = watcher;
        var res;
        if (typeof watcher.ExpOrFunc == "string") {
            res = eval_1.EvalExp(this.data, watcher.ExpOrFunc);
        }
        if (typeof watcher.ExpOrFunc == "function") {
            res = watcher.ExpOrFunc.call(this.data);
        }
        Observe.target = null;
        return res;
    };
    Observe.prototype.GetValueWithExp = function (exp) {
        var res = eval_1.EvalExp(this.data, exp);
        return res;
    };
    Observe.prototype.AddWatcher = function (vnode, exp, listener, deep) {
        new watcher_1.Watcher(vnode, exp, listener, this, deep);
    };
    Observe.prototype.ReactiveData = function (data) {
        var _this = this;
        if (data != null && typeof data == "object") {
            Object.keys(data).forEach(function (key) {
                var depend = new Depender(key);
                _this.defineReactive(data, key, false, depend);
                _this.ReactiveData(data[key]);
            });
        }
    };
    Observe.prototype.ReactiveKey = function (data, key, shallow) {
        var depend = new Depender(key);
        this.defineReactive(data, key, shallow, depend);
    };
    Observe.prototype.reactiveArray = function (array, depend) {
        var _this = this;
        if (array.push != Array.prototype.push)
            return;
        Object.defineProperty(array, "push", {
            enumerable: false,
            configurable: true,
            value: function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                var old = array.length;
                var res = (_a = Array.prototype.push).call.apply(_a, [array].concat(params));
                for (var i = old; i < res; i++) {
                    _this.ReactiveKey(array, "" + i, false);
                }
                depend.Notify();
                return res;
                var _a;
            }
        });
        Object.defineProperty(array, "pop", {
            enumerable: false,
            configurable: true,
            value: function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                var res = (_a = Array.prototype.pop).call.apply(_a, [array].concat(params));
                depend.Notify();
                return res;
                var _a;
            }
        });
        Object.defineProperty(array, "splice", {
            enumerable: false,
            configurable: true,
            value: function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                var res = (_a = Array.prototype.splice).call.apply(_a, [array].concat(params));
                if (params.length > 2) {
                    var newitems = params.slice(2);
                    newitems.forEach(function (item) {
                        var index = array.indexOf(item);
                        _this.ReactiveKey(array, "" + index, false);
                    });
                }
                depend.Notify();
                return res;
                var _a;
            }
        });
        Object.defineProperty(array, "shift", {
            enumerable: false,
            configurable: true,
            value: function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                var res = (_a = Array.prototype.shift).call.apply(_a, [array].concat(params));
                depend.Notify();
                return res;
                var _a;
            }
        });
    };
    Observe.prototype.defineReactive = function (data, key, shallow, depend) {
        var _this = this;
        var value = data[key];
        if (toString.call(value) == "[object Array]") {
            this.reactiveArray(value, depend);
        }
        Object.defineProperty(data, key, {
            get: function () {
                if (Observe.target != null) {
                    depend.AddTarget(Observe.target);
                }
                return value;
            },
            set: function (newval) {
                if (newval != value) {
                    value = newval;
                    if (toString.call(value) == "[object Array]") {
                        _this.reactiveArray(value, depend);
                    }
                    if (!shallow)
                        _this.ReactiveData(newval);
                    depend.Notify();
                }
            },
            enumerable: true,
            configurable: true
        });
    };
    Observe.prototype.WatchComputed = function (vnode, key, func) {
        var _this = this;
        var depend = new Depender(key);
        var firstget = true;
        var value;
        Object.defineProperty(this.data, key, {
            get: function () {
                if (Observe.target != null) {
                    depend.AddTarget(Observe.target);
                }
                if (firstget) {
                    var old = Observe.target;
                    Observe.target = null;
                    new watcher_1.Watcher(vnode, func, function (newval) {
                        value = newval;
                        depend.Notify();
                    }, _this);
                    Observe.target = old;
                    firstget = false;
                }
                return value;
            },
            enumerable: true,
            configurable: true
        });
    };
    return Observe;
}());
exports.Observe = Observe;
var Depender = /** @class */ (function () {
    function Depender(key) {
        this.key = key;
        this.watches = [];
    }
    Depender.prototype.GetKey = function () {
        return this.key;
    };
    Depender.prototype.AddTarget = function (watcher) {
        if (this.watches.indexOf(watcher) == -1)
            this.watches.push(watcher);
    };
    Depender.prototype.Notify = function () {
        this.watches = this.watches.filter(function (watcher) {
            if (watcher.GetVNode().GetStatus() == const_1.VNodeStatus.ACTIVE) {
                msg_queue_1.AddWatcher(watcher);
                return true;
            }
            if (watcher.GetVNode().GetStatus() == const_1.VNodeStatus.INACTIVE)
                return true;
            if (watcher.GetVNode().GetStatus() == const_1.VNodeStatus.DEPRECATED)
                return false;
        });
    };
    return Depender;
}());
exports.Depender = Depender;


/***/ }),

/***/ "./src/observer/watcher.ts":
/*!*********************************!*\
  !*** ./src/observer/watcher.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
var Watcher = /** @class */ (function () {
    function Watcher(vnode, ExpOrFunc, cb, observer, deep) {
        this.vnode = vnode;
        this.ExpOrFunc = ExpOrFunc;
        this.cb = cb;
        this.observer = observer;
        this.deep = deep;
        this.deepRecord = [];
        this.value = this.observer.GetValue(this);
        if (this.deep && toString.call(this.value) == "[object Array]") {
            for (var i = 0; i < this.value.length; i++) {
                this.deepRecord[i] = this.value[i];
            }
        }
        this.cb(this.value, undefined);
    }
    Watcher.prototype.GetVNode = function () {
        return this.vnode;
    };
    Watcher.prototype.Update = function () {
        var newval = this.observer.GetValue(this);
        if (this.value != newval) {
            if (this.vnode.GetStatus() == const_1.VNodeStatus.ACTIVE)
                this.cb(newval, this.value);
            this.value = newval;
        }
        else {
            //判断数组元素是否有变化
            if (this.deep && toString.call(this.value) == "[object Array]") {
                var diff = false;
                for (var i = 0; i < newval.length; i++) {
                    if (newval[i] != this.deepRecord[i]) {
                        this.cb(newval, this.value);
                        diff = true;
                        break;
                    }
                }
                if (diff) {
                    this.deepRecord = [];
                    for (var i = 0; i < newval.length; i++) {
                        this.deepRecord[i] = newval[i];
                    }
                }
            }
        }
    };
    return Watcher;
}());
exports.Watcher = Watcher;


/***/ }),

/***/ "./src/router/router-manager.ts":
/*!**************************************!*\
  !*** ./src/router/router-manager.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var router_state_1 = __webpack_require__(/*! ./router-state */ "./src/router/router-state.ts");
var matchedRouter = [];
var appRouters = [];
var cursor = -1;
var firstVNode = null;
function RegisterRouter(routers) {
    checkRouter(routers);
    routers.forEach(function (router) {
        router.urls = router.urls.map(function (url) {
            if (url.indexOf("/") != 0)
                return "/" + url;
            else
                return url;
        });
    });
    routers.forEach(function (router) {
        appRouters.push(copyRouter(null, router));
    });
}
exports.RegisterRouter = RegisterRouter;
function checkRouter(routers) {
    routers.forEach(function (router) {
        router.children = router.children ? router.children : [];
        if (router.redirect != null) {
            router.component = "";
            router.url = "";
        }
        if (router.component == null && router.components == null) {
            throw new Error("must specify component or components in router");
        }
        if (router.url == null && router.urls == null) {
            throw new Error("must specify url or urls in router");
        }
        router.params = router.params ? router.params : [];
        router.urls = router.urls ? router.urls : [];
        if (router.url != null)
            router.urls.push(router.url);
        checkRouter(router.children);
    });
}
function copyRouter(parent, router) {
    var r = {
        urls: router.urls,
        component: router.component,
        components: router.components,
        children: [],
        parent: parent,
        fullUrls: [],
        params: router.params,
        redirect: router.redirect,
        marked: false
    };
    if (parent != null) {
        r.urls.forEach(function (url) {
            parent.fullUrls.forEach(function (fullurl) {
                if (url.indexOf("/") == 0) {
                    r.fullUrls.push(url);
                }
                else {
                    if (url == "")
                        r.fullUrls.push(fullurl);
                    else
                        r.fullUrls.push(fullurl + "/" + url);
                }
            });
        });
    }
    else {
        r.urls.forEach(function (url) { return r.fullUrls.push(url); });
    }
    for (var i = 0; i < router.children.length; i++) {
        r.children.push(copyRouter(r, router.children[i]));
    }
    return r;
}
function matchRouter(matchedRouter) {
    var vinallaUrl = location.pathname;
    while (vinallaUrl.endsWith("/")) {
        vinallaUrl = vinallaUrl.substr(0, vinallaUrl.length - 1);
    }
    var vinallaSlice = vinallaUrl.split("/");
    var _loop_1 = function (i) {
        var matchedUrl = matchedRouter.fullUrls[i];
        var matchedSlice = matchedUrl.split("/");
        if (vinallaSlice.length != matchedSlice.length)
            return "continue";
        var params = [];
        for (var j = 0; j < matchedSlice.length; j++) {
            if (/^\:(\w+)$/.test(matchedSlice[j])) {
                if (vinallaSlice[j] != "") {
                    var name_1 = RegExp.$1;
                    params.push({ name: name_1, value: vinallaSlice[j] });
                    continue;
                }
                else {
                    break;
                }
            }
            if (matchedSlice[j] == vinallaSlice[j]) {
                continue;
            }
            break;
        }
        if (j == matchedSlice.length) {
            var requireParams = matchedRouter.params;
            var searchParams = getSearchParams();
            params = params.concat(searchParams);
            requireParams.forEach(function (rp) {
                var exist = params.find(function (p) { return p.name == rp.name; });
                if (exist == null && rp.required) {
                    throw new Error("router match failed,no matched params:" + rp.name);
                }
            });
            return { value: params };
        }
    };
    for (var i = 0; i < matchedRouter.fullUrls.length; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return null;
}
function getSearchParams() {
    var searchSlice = location.search.split("?");
    var res = [];
    if (searchSlice.length == 2) {
        var params = searchSlice[1].split("&");
        params.forEach(function (p) {
            var name_value = p.split("=");
            if (name_value.length == 2) {
                res.push({ name: name_value[0], value: name_value[1] });
            }
        });
    }
    return res;
}
function getLeaf(router) {
    if (router.marked)
        return [];
    if (router.children.length == 0) {
        router.marked = true;
        return [router];
    }
    var res = [];
    router.children.forEach(function (child) {
        res = res.concat(getLeaf(child));
    });
    if (res.length == 0) {
        router.marked = true;
        return [router];
    }
    return res;
}
function clearMark(router) {
    router.children.forEach(function (child) {
        clearMark(child);
    });
    router.marked = false;
}
function matchUrl() {
    appRouters.forEach(function (r) { return clearMark(r); });
    var routers = [];
    var _loop_2 = function () {
        var res = [];
        appRouters.forEach(function (r) {
            res = res.concat(getLeaf(r));
        });
        if (res.length == 0) {
            return "break";
        }
        else {
            routers = routers.concat(res);
        }
    };
    while (true) {
        var state_2 = _loop_2();
        if (state_2 === "break")
            break;
    }
    var redirect = false;
    for (var i = 0; i < routers.length; i++) {
        var router = routers[i];
        if (router.redirect != null) {
            window.history.replaceState(null, "", router.redirect);
            redirect = true;
            break;
        }
        var params = matchRouter(router);
        if (params != null) {
            router_state_1.SetActiveRouter(location.pathname, params);
            matchedRouter = [router];
            var parent_1 = router.parent;
            while (parent_1 != null) {
                matchedRouter.unshift(parent_1);
                parent_1 = parent_1.parent;
            }
            break;
        }
    }
    if (redirect) {
        matchUrl();
    }
}
function NextRouter(vnode, name) {
    if (appRouters == null) {
        throw new Error("no router specified");
    }
    if (cursor == -1) {
        matchUrl();
        firstVNode = vnode;
        cursor = 0;
    }
    if (cursor < matchedRouter.length) {
        var component = name ? matchedRouter[cursor].components[name] : matchedRouter[cursor].component;
        cursor++;
        return component;
    }
    else {
        throw new Error("router match failed");
    }
}
exports.NextRouter = NextRouter;
function MoveBack() {
    cursor--;
}
exports.MoveBack = MoveBack;
function NotifyUrlChange() {
    matchUrl();
    firstVNode.OnRouterChange();
}
exports.NotifyUrlChange = NotifyUrlChange;


/***/ }),

/***/ "./src/router/router-state.ts":
/*!************************************!*\
  !*** ./src/router/router-state.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
var _RouterInfo = /** @class */ (function () {
    function _RouterInfo(path, params) {
        this.path = path;
        this.params = params;
    }
    _RouterInfo.prototype.getParam = function (name) {
        var p = this.params.find(function (p) { return p.name == name; });
        return p && p.value || null;
    };
    return _RouterInfo;
}());
var active = new _RouterInfo("", []);
var listeners = [];
function SetActiveRouter(path, params) {
    var old = new _RouterInfo(path, params);
    active.path = path;
    active.params = params;
    listeners = listeners.filter(function (listen) { return listen.vnode.GetStatus() != const_1.VNodeStatus.DEPRECATED; });
    listeners.forEach(function (listen) {
        if (listen.vnode.GetStatus() == const_1.VNodeStatus.ACTIVE)
            listen.cb(active, old);
    });
}
exports.SetActiveRouter = SetActiveRouter;
function GetActiveRouter() {
    return active;
}
exports.GetActiveRouter = GetActiveRouter;
function WatchRouterChange(vnode, listener) {
    listeners.push({ cb: listener, vnode: vnode });
}
exports.WatchRouterChange = WatchRouterChange;


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ./const */ "./src/const.ts");
function LogError(msg) {
    console.error(msg);
}
exports.LogError = LogError;
function LogInfo(msg) {
    console.log(msg);
}
exports.LogInfo = LogInfo;
function GetNS(str) {
    var res = str.split(":");
    if (res.length == 1)
        return { namespace: null, value: res[0] };
    return { namespace: res[0], value: res.slice(1).join(":") };
}
exports.GetNS = GetNS;
function HttpGet(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.readyState == 4 && xhr.status == 200)
        return xhr.responseText;
    else
        return null;
}
exports.HttpGet = HttpGet;
function IsStringEmpty(str) {
    if (str == null)
        return true;
    str = str.trim();
    if (str == "")
        return true;
    return false;
}
exports.IsStringEmpty = IsStringEmpty;
function Trim(str, char) {
    if (char.length > 1)
        throw new Error("only receve one character");
    var start = -1;
    while (str[start + 1] == char) {
        start++;
    }
    var end = str.length;
    while (str[end - 1] == char) {
        end--;
    }
    return str.substring(start + 1, end);
}
exports.Trim = Trim;
function StrToEvalstr(str) {
    if (const_1.REG_SINGLE.test(str)) {
        return { isconst: false, exp: RegExp.$1 };
    }
    else {
        if (const_1.REG_MULTI.test(str)) {
            var reg = /\{\{([^\{\}]*)\}\}/g;
            var res = reg.exec(str);
            var exp = "";
            var lastindex = 0;
            while (res) {
                if (res.index != lastindex) {
                    exp += "\'" + str.substring(lastindex, res.index) + "\'+";
                }
                lastindex = res.index + res[0].length;
                exp += "(" + RegExp.$1 + ")+";
                res = reg.exec(str);
            }
            if (exp.endsWith("+")) {
                exp = exp.substring(0, exp.length - 1);
            }
            return { isconst: false, exp: exp };
        }
        else {
            return { isconst: true, exp: str };
        }
    }
}
exports.StrToEvalstr = StrToEvalstr;


/***/ }),

/***/ "./src/vdom/vdom.ts":
/*!**************************!*\
  !*** ./src/vdom/vdom.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var components_manager_1 = __webpack_require__(/*! ../manager/components-manager */ "./src/manager/components-manager.ts");
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
var vinalla_node_1 = __webpack_require__(/*! ../vnode/vinalla-node */ "./src/vnode/vinalla-node.ts");
var VDom = /** @class */ (function () {
    function VDom() {
        this.Attrs = [];
        this.Children = [];
    }
    VDom.prototype.GetAttr = function (name) {
        for (var i = 0; i < this.Attrs.length; i++) {
            if (this.Attrs[i].Name == name)
                return this.Attrs[i].Value;
        }
        return null;
    };
    VDom.prototype.AddAttr = function (attr) {
        this.Attrs.push({ Name: attr, Value: "" });
    };
    return VDom;
}());
exports.VDom = VDom;
function TraverseDom(dom) {
    if (dom.nodeType == 3 && dom.nodeValue.trim() == "")
        return;
    var root = new VDom();
    root.NodeValue = dom.nodeValue;
    if (root.NodeValue != null) {
        root.NodeValue = root.NodeValue.replace(/\s+/g, "");
    }
    root.NodeName = dom.nodeName.toLowerCase();
    root.NodeType = dom.nodeType;
    if (dom.nodeType == 1) {
        var htmldom = dom;
        for (var i = 0; i < htmldom.attributes.length; i++) {
            root.Attrs.push({ Name: htmldom.attributes[i].name, Value: htmldom.attributes[i].value });
        }
        for (var i = 0; i < htmldom.childNodes.length; i++) {
            var child = TraverseDom(htmldom.childNodes[i]);
            child && root.Children.push(child);
        }
    }
    return root;
}
exports.TraverseDom = TraverseDom;
var Priority;
(function (Priority) {
    Priority[Priority["NORMAL"] = 0] = "NORMAL";
    Priority[Priority["IF"] = 1] = "IF";
    Priority[Priority["FOR"] = 2] = "FOR";
})(Priority = exports.Priority || (exports.Priority = {}));
function NewVNode(dom, mvvm, parent, priority) {
    if (priority === void 0) { priority = Priority.FOR; }
    if (dom.NodeName.toLowerCase() == "slot") {
        var SlotNode = __webpack_require__(/*! ../vnode/slot-node */ "./src/vnode/slot-node.ts").SlotNode;
        return new SlotNode(dom, mvvm, parent, dom.GetAttr("name"));
    }
    if (priority >= Priority.FOR && dom.GetAttr(const_1.PRE + "for") != null) {
        var ForNode = __webpack_require__(/*! ../vnode/for-node */ "./src/vnode/for-node.ts").ForNode;
        return new ForNode(dom, mvvm, parent, dom.GetAttr(const_1.PRE + "for"));
    }
    if (priority >= Priority.IF && dom.GetAttr(const_1.PRE + "if") != null) {
        var IfNode = __webpack_require__(/*! ../vnode/if-node */ "./src/vnode/if-node.ts").IfNode;
        return new IfNode(dom, mvvm, parent, dom.GetAttr(const_1.PRE + "if"));
    }
    if (dom.NodeName == "router-view") {
        var RouterNode = __webpack_require__(/*! ../vnode/router-node */ "./src/vnode/router-node.ts").RouterNode;
        return new RouterNode(dom, mvvm, parent);
    }
    var ns = util_1.GetNS(dom.NodeName);
    if (components_manager_1.IsComponentRegistered(ns.value, ns.namespace || "default")) {
        var construct = components_manager_1.InitComponent(ns.value, ns.namespace || "default");
        var selfmvvm = new construct();
        selfmvvm.$initialize();
        var CustomNode = __webpack_require__(/*! ../vnode/custom-node */ "./src/vnode/custom-node.ts").CustomNode;
        var cust = new CustomNode(dom, mvvm, parent, selfmvvm);
        selfmvvm.$SetFenceNode(cust);
        return cust;
    }
    return new vinalla_node_1.VinallaNode(dom, mvvm, parent);
}
exports.NewVNode = NewVNode;


/***/ }),

/***/ "./src/vnode/custom-node.ts":
/*!**********************************!*\
  !*** ./src/vnode/custom-node.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
var vdom_1 = __webpack_require__(/*! ../vdom/vdom */ "./src/vdom/vdom.ts");
var template_node_1 = __webpack_require__(/*! ./template-node */ "./src/vnode/template-node.ts");
var vnode_1 = __webpack_require__(/*! ./vnode */ "./src/vnode/vnode.ts");
var CustomNode = /** @class */ (function (_super) {
    __extends(CustomNode, _super);
    function CustomNode(Vdom, mvvm, Parent, SurroundMvvm) {
        var _this = _super.call(this, Vdom, mvvm, Parent) || this;
        _this.Vdom = Vdom;
        _this.mvvm = mvvm;
        _this.Parent = Parent;
        _this.SurroundMvvm = SurroundMvvm;
        //输入与输出值
        _this.ins_pure = {};
        _this.ins_exp = {};
        _this.outs = {};
        return _this;
    }
    CustomNode.prototype.AddIns = function (name, exp) {
        this.ins_exp[name] = exp;
    };
    /**获取跟slot匹配的模版内容 */
    CustomNode.prototype.GetTemplate = function (name) {
        for (var i = 0; i < this.Children.length; i++) {
            var template = this.Children[i];
            if (template.templatename == name)
                return template;
        }
        return null;
    };
    CustomNode.prototype.Render = function () {
        this.Dom = this.SurroundMvvm.$Render();
        if (this.Dom && this.Parent && this.Parent.Dom)
            this.Parent.Dom.appendChild(this.Dom);
    };
    /**override vnode */
    CustomNode.prototype.childSet = function () {
        //制造中间节点管理template
        var defaultTemplate = new template_node_1.TemplateNode(this.Vdom, this.mvvm ? this.mvvm : this.SurroundMvvm, this, "default");
        defaultTemplate.Parent = this;
        var templates = { "default": defaultTemplate };
        //解析子节点
        for (var i = 0; i < this.Vdom.Children.length; i++) {
            var childnode = this.Vdom.Children[i];
            var name_1 = this.Vdom.GetAttr("slot");
            if (name_1 == null || name_1 == "") {
                name_1 = "default";
            }
            if (templates[name_1] == null) {
                templates[name_1] = new template_node_1.TemplateNode(this.Vdom, this.mvvm ? this.mvvm : this.SurroundMvvm, this, name_1);
                templates[name_1].Parent = this;
            }
            var vchild = vdom_1.NewVNode(childnode, templates[name_1].mvvm, templates[name_1]);
            vchild.AttachDom();
            templates[name_1].Children.push(vchild);
        }
        for (var name_2 in templates) {
            this.Children.push(templates[name_2]);
        }
    };
    CustomNode.prototype.GetInValue = function (prop) {
        if (this.ins_pure[prop] != null)
            return this.ins_pure[prop];
        if (this.ins_exp[prop] != null)
            return this.mvvm.$GetExpValue(this.ins_exp[prop]);
        return null;
    };
    CustomNode.prototype.GetIn = function (prop) {
        if (this.ins_pure[prop] != null)
            return { value: this.ins_pure[prop], const: true };
        if (this.ins_exp[prop] != null)
            return { value: this.ins_exp[prop], const: false };
        return null;
    };
    CustomNode.prototype.GetOut = function (prop) {
        return this.outs[prop];
    };
    CustomNode.prototype.Refresh = function () {
        this.SurroundMvvm.$Refresh();
    };
    CustomNode.prototype.Update = function () {
        this.SurroundMvvm.$Update();
    };
    CustomNode.prototype.OnRemoved = function () {
        this.SurroundMvvm.$OnDestroy();
    };
    CustomNode.prototype.SetStatus = function (status) {
        this.status = status;
        this.SurroundMvvm.$SetStatus(status);
    };
    CustomNode.prototype.AddProperty = function (name, value) {
        //输入
        var ins = this.SurroundMvvm.$InitIns();
        for (var i = 0; i < ins.length; i++) {
            var prop = ins[i];
            if (const_1.REG_IN.test(name) && prop.name == RegExp.$1) {
                this.ins_exp[RegExp.$1] = value;
                return;
            }
            else {
                if (prop.name == name) {
                    this.ins_pure[name] = value;
                    return;
                }
            }
        }
        //输出
        var outs = this.SurroundMvvm.$InitOuts();
        for (var i = 0; i < outs.length; i++) {
            var event_1 = outs[i];
            if (const_1.REG_OUT.test(name) && event_1 == RegExp.$1) {
                this.outs[RegExp.$1] = value;
                return;
            }
        }
        _super.prototype.AddProperty.call(this, name, value);
    };
    return CustomNode;
}(vnode_1.VNode));
exports.CustomNode = CustomNode;


/***/ }),

/***/ "./src/vnode/directive-node.ts":
/*!*************************************!*\
  !*** ./src/vnode/directive-node.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
var DirectiveNode = /** @class */ (function () {
    function DirectiveNode(vdom) {
        var _this = this;
        this.vdom = vdom;
        //输入与输出值
        this.ins_pure = {};
        this.ins_exp = {};
        this.outs = {};
        this.vdom.Attrs.forEach(function (attr) {
            _this.addProperty(attr.Name, attr.Value);
        });
    }
    DirectiveNode.prototype.addProperty = function (name, value) {
        //输入
        if (const_1.REG_IN.test(name)) {
            this.ins_exp[RegExp.$1] = value;
            return;
        }
        //输出
        if (const_1.REG_OUT.test(name)) {
            this.outs[RegExp.$1] = value;
            return;
        }
        this.ins_pure[name] = value;
        return;
    };
    DirectiveNode.prototype.GetIn = function (prop) {
        if (this.ins_pure[prop] != null)
            return { value: this.ins_pure[prop], const: true };
        if (this.ins_exp[prop] != null)
            return { value: this.ins_exp[prop], const: false };
        return null;
    };
    DirectiveNode.prototype.GetOut = function (prop) {
        return this.outs[prop];
    };
    return DirectiveNode;
}());
exports.DirectiveNode = DirectiveNode;


/***/ }),

/***/ "./src/vnode/for-node.ts":
/*!*******************************!*\
  !*** ./src/vnode/for-node.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var component_mvvm_1 = __webpack_require__(/*! ./../mvvm/component-mvvm */ "./src/mvvm/component-mvvm.ts");
var models_1 = __webpack_require__(/*! ../models */ "./src/models.ts");
var vdom_1 = __webpack_require__(/*! ../vdom/vdom */ "./src/vdom/vdom.ts");
var custom_node_1 = __webpack_require__(/*! ./custom-node */ "./src/vnode/custom-node.ts");
var vnode_1 = __webpack_require__(/*! ./vnode */ "./src/vnode/vnode.ts");
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
var ForNode = /** @class */ (function (_super) {
    __extends(ForNode, _super);
    function ForNode(Vdom, mvvm, Parent, originForExp) {
        var _this = _super.call(this, Vdom, mvvm, Parent) || this;
        _this.Vdom = Vdom;
        _this.mvvm = mvvm;
        _this.Parent = Parent;
        _this.originForExp = originForExp;
        _this.dynamicVNodes = [];
        _this.IsTemplate = true;
        var forSplit = _this.originForExp.trim().split(/\s+/);
        _this.ForExp = new models_1.ForExp(forSplit[0], forSplit[2]);
        return _this;
    }
    ForNode.prototype.newCopyNode = function (n) {
        var itemexp = this.ForExp.itemExp;
        var that = this;
        var mvvm = new (/** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.$InitTreeroot = function () {
                var vnode = vdom_1.NewVNode(that.Vdom, this, null, vdom_1.Priority.IF);
                return vnode;
            };
            class_1.prototype.$InitNamespace = function () {
                return that.mvvm.$InitNamespace();
            };
            class_1.prototype.$InitDataItems = function () {
                var datas = [];
                that.mvvm.$GetDataItems().forEach(function (item) {
                    datas.push({ name: item.name, value: that.mvvm[item.name] });
                });
                that.mvvm.$GetComputedItems().forEach(function (item) {
                    datas.push({ name: item.name, value: that.mvvm[item.name] });
                });
                if (that.mvvm instanceof component_mvvm_1.ComponentMvvm) {
                    var props = that.mvvm.$GetIns();
                    props.forEach(function (prop) {
                        datas.push({ name: prop.name, value: that.mvvm[prop.name] });
                    });
                }
                return datas;
            };
            class_1.prototype.$InitComputeItems = function () {
                return [];
            };
            class_1.prototype.$InitName = function () {
                return "";
            };
            class_1.prototype.$InitIns = function () {
                return [{ name: itemexp, required: true }];
            };
            class_1.prototype.$InitOuts = function () {
                return [];
            };
            class_1.prototype.$GetParams = function () {
                return [];
            };
            return class_1;
        }(component_mvvm_1.ComponentMvvm)));
        mvvm.$initialize();
        mvvm.$SetHirented(true);
        var fencenode = new custom_node_1.CustomNode(this.Vdom, this.mvvm, null, mvvm);
        mvvm.$SetFenceNode(fencenode);
        fencenode.IsCopy = true;
        fencenode.AddIns(itemexp, this.ForExp.arrayExp + "[" + n + "]");
        return fencenode;
    };
    ForNode.prototype.reImplementForExp = function (newcount) {
        var _this = this;
        if (newcount > this.dynamicVNodes.length) {
            var custnodes = [];
            var oldcount = this.dynamicVNodes.length;
            for (var i = this.dynamicVNodes.length; i < newcount; i++) {
                var custnode = this.newCopyNode(i);
                custnode.Source = this;
                custnodes.push(custnode);
            }
            custnodes.forEach(function (custnode) {
                _this.dynamicVNodes.push(custnode);
                custnode.Render();
            });
            this.Parent.AddChildren(this, custnodes, oldcount);
            this.Parent.Refresh();
            return;
        }
        if (newcount < this.dynamicVNodes.length) {
            var moved = this.dynamicVNodes.splice(newcount);
            moved.forEach(function (vnode) { return vnode.SetStatus(const_1.VNodeStatus.DEPRECATED); });
            this.Parent.RemoveChildren(moved);
            moved.forEach(function (item) {
                item.OnRemoved();
            });
            this.Parent.Refresh();
        }
    };
    ForNode.prototype.Update = function () {
        var items = this.mvvm.$GetExpValue(this.ForExp.arrayExp);
        if (toString.call(items) === "[object Array]") {
            this.reImplementForExp(items.length);
        }
    };
    ForNode.prototype.AttachDom = function () { };
    ForNode.prototype.Render = function () {
        this.mvvm.$Watch(this, this.ForExp.arrayExp + ".length", this.reImplementForExp.bind(this));
    };
    ForNode.prototype.OnRemoved = function () {
        this.dynamicVNodes.forEach(function (vnode) { return vnode.OnRemoved(); });
    };
    ForNode.prototype.SetStatus = function (status) {
        this.status = status;
        this.dynamicVNodes.forEach(function (vnode) { return vnode.SetStatus(status); });
    };
    return ForNode;
}(vnode_1.VNode));
exports.ForNode = ForNode;


/***/ }),

/***/ "./src/vnode/if-node.ts":
/*!******************************!*\
  !*** ./src/vnode/if-node.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = __webpack_require__(/*! ./vnode */ "./src/vnode/vnode.ts");
var vdom_1 = __webpack_require__(/*! ../vdom/vdom */ "./src/vdom/vdom.ts");
var const_1 = __webpack_require__(/*! ../const */ "./src/const.ts");
var IfNode = /** @class */ (function (_super) {
    __extends(IfNode, _super);
    function IfNode(Vdom, mvvm, Parent, ifExp) {
        var _this = _super.call(this, Vdom, mvvm, Parent) || this;
        _this.Vdom = Vdom;
        _this.mvvm = mvvm;
        _this.Parent = Parent;
        _this.ifExp = ifExp;
        _this.rendered = false;
        _this.IsTemplate = true;
        return _this;
    }
    IfNode.prototype.AttachDom = function () { };
    IfNode.prototype.Render = function () {
        var _this = this;
        this.mvvm.$Watch(this, this.ifExp, function (newvalue) { return _this.reImpletement(newvalue); });
    };
    IfNode.prototype.Update = function () {
        var attached = this.mvvm.$GetExpValue(this.ifExp);
        this.reImpletement(attached);
    };
    IfNode.prototype.reImpletement = function (newvalue) {
        if (!this.rendered) {
            this.rendered = true;
            if (newvalue) {
                this.instance();
                this.dynamicVNode.Render();
                this.Dom = this.dynamicVNode.Dom;
                if (this.Parent != null) {
                    this.Parent.AddChildren(this, [this.dynamicVNode], 0);
                    this.Parent.Refresh();
                }
            }
        }
        else {
            if (newvalue) {
                if (this.dynamicVNode == null) {
                    this.instance();
                    this.dynamicVNode.Render();
                    this.Dom = this.dynamicVNode.Dom;
                }
                else {
                    this.dynamicVNode.Update();
                }
                if (this.Parent != null) {
                    this.Parent.AddChildren(this, [this.dynamicVNode], 0);
                    this.Parent.Refresh();
                }
                else {
                    this.mvvm.$GetFenceNode().Dom = this.Dom;
                    this.mvvm.$GetFenceNode().Source.Parent.Refresh();
                }
                this.dynamicVNode.SetStatus(const_1.VNodeStatus.ACTIVE);
            }
            else {
                if (this.Parent != null) {
                    this.Parent.RemoveChildren([this.dynamicVNode]);
                    this.Parent.Refresh();
                }
                else {
                    this.mvvm.$GetFenceNode().Dom = null;
                    this.mvvm.$GetFenceNode().Source.Parent.Refresh();
                }
                this.dynamicVNode.SetStatus(const_1.VNodeStatus.INACTIVE);
            }
        }
    };
    IfNode.prototype.instance = function () {
        this.dynamicVNode = vdom_1.NewVNode(this.Vdom, this.mvvm, null, vdom_1.Priority.NORMAL);
        this.dynamicVNode.IsCopy = true;
        this.dynamicVNode.AttachDom();
    };
    IfNode.prototype.OnRemoved = function () {
        if (this.dynamicVNode != null)
            this.dynamicVNode.OnRemoved();
    };
    IfNode.prototype.SetStatus = function (status) {
        this.status = status;
        if (this.dynamicVNode != null)
            this.dynamicVNode.SetStatus(status);
    };
    return IfNode;
}(vnode_1.VNode));
exports.IfNode = IfNode;


/***/ }),

/***/ "./src/vnode/router-node.ts":
/*!**********************************!*\
  !*** ./src/vnode/router-node.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = __webpack_require__(/*! ./vnode */ "./src/vnode/vnode.ts");
var custom_node_1 = __webpack_require__(/*! ./custom-node */ "./src/vnode/custom-node.ts");
var components_manager_1 = __webpack_require__(/*! ../manager/components-manager */ "./src/manager/components-manager.ts");
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
var router_manager_1 = __webpack_require__(/*! ../router/router-manager */ "./src/router/router-manager.ts");
var RouterNode = /** @class */ (function (_super) {
    __extends(RouterNode, _super);
    function RouterNode(Vdom, mvvm, Parent) {
        var _this = _super.call(this, Vdom, mvvm, Parent) || this;
        _this.Vdom = Vdom;
        _this.mvvm = mvvm;
        _this.Parent = Parent;
        return _this;
    }
    RouterNode.prototype.Render = function () {
        var router = router_manager_1.NextRouter(this);
        if (router != null) {
            this.instance(router);
            this.dynamicVNode.Render();
            router_manager_1.MoveBack();
            this.Parent.AddChildren(this, [this.dynamicVNode], 0);
            this.Parent.Refresh();
        }
    };
    RouterNode.prototype.OnRouterChange = function () {
        var router = router_manager_1.NextRouter(this);
        if (router != null) {
            this.Parent.RemoveChildren([this.dynamicVNode]);
            this.instance(router);
            this.dynamicVNode.Render();
            router_manager_1.MoveBack();
            this.Parent.AddChildren(this, [this.dynamicVNode], 0);
            this.Parent.Refresh();
        }
        else {
            this.Parent.RemoveChildren([this.dynamicVNode]);
            this.Parent.Refresh();
        }
    };
    RouterNode.prototype.instance = function (componentStr) {
        var ns = util_1.GetNS(componentStr);
        if (ns.namespace == null)
            ns.namespace = "default";
        var construct = components_manager_1.InitComponent(ns.value, ns.namespace);
        if (construct == null) {
            throw new Error("router can not find component name:" + ns.value + ",namespace:" + ns.namespace);
        }
        var mvvm = new construct();
        mvvm.$initialize();
        var custnode = new custom_node_1.CustomNode(null, this.mvvm, null, mvvm);
        mvvm.$SetFenceNode(custnode);
        this.dynamicVNode = custnode;
    };
    return RouterNode;
}(vnode_1.VNode));
exports.RouterNode = RouterNode;


/***/ }),

/***/ "./src/vnode/slot-node.ts":
/*!********************************!*\
  !*** ./src/vnode/slot-node.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = __webpack_require__(/*! ./vnode */ "./src/vnode/vnode.ts");
var SlotNode = /** @class */ (function (_super) {
    __extends(SlotNode, _super);
    function SlotNode(vdom, mvvm, Parent, name) {
        var _this = _super.call(this, vdom, mvvm, Parent) || this;
        _this.vdom = vdom;
        _this.mvvm = mvvm;
        _this.Parent = Parent;
        _this.name = name;
        if (_this.name == null || _this.name == "")
            _this.name = "default";
        return _this;
    }
    SlotNode.prototype.Render = function () {
        var template = this.mvvm.$GetFenceNode().GetTemplate(this.name);
        if (template != null) {
            template.Render();
            this.Dom = template.Dom;
            while (this.Dom.firstChild != null) {
                this.Parent.Dom.appendChild(this.Dom.firstChild);
            }
        }
    };
    SlotNode.prototype.Update = function () {
        var template = this.mvvm.$GetFenceNode().GetTemplate(this.name);
        if (template != null) {
            template.Update();
        }
    };
    SlotNode.prototype.SetStatus = function (status) {
        this.status = status;
        var template = this.mvvm.$GetFenceNode().GetTemplate(this.name);
        template.SetStatus(status);
    };
    SlotNode.prototype.OnRemoved = function () {
        var template = this.mvvm.$GetFenceNode().GetTemplate(this.name);
        template.OnRemoved();
    };
    return SlotNode;
}(vnode_1.VNode));
exports.SlotNode = SlotNode;


/***/ }),

/***/ "./src/vnode/template-node.ts":
/*!************************************!*\
  !*** ./src/vnode/template-node.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = __webpack_require__(/*! ./vnode */ "./src/vnode/vnode.ts");
var TemplateNode = /** @class */ (function (_super) {
    __extends(TemplateNode, _super);
    function TemplateNode(vdom, mvvm, Parent, templatename) {
        var _this = _super.call(this, vdom, mvvm, Parent) || this;
        _this.vdom = vdom;
        _this.mvvm = mvvm;
        _this.Parent = Parent;
        _this.templatename = templatename;
        return _this;
    }
    TemplateNode.prototype.Render = function () {
        this.Dom = document.createElement("div");
        this.Children.forEach(function (child) {
            child.Render();
        });
    };
    TemplateNode.prototype.Update = function () {
        var children = [];
        this.Children.forEach(function (child) {
            children.push(child);
        });
        children.forEach(function (child) {
            child.Update();
        });
    };
    return TemplateNode;
}(vnode_1.VNode));
exports.TemplateNode = TemplateNode;


/***/ }),

/***/ "./src/vnode/vinalla-node.ts":
/*!***********************************!*\
  !*** ./src/vnode/vinalla-node.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var inner_dir_1 = __webpack_require__(/*! ../directive/inner-dir */ "./src/directive/inner-dir.ts");
var directive_manager_1 = __webpack_require__(/*! ../manager/directive-manager */ "./src/manager/directive-manager.ts");
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
var const_1 = __webpack_require__(/*! ./../const */ "./src/const.ts");
var directive_node_1 = __webpack_require__(/*! ./directive-node */ "./src/vnode/directive-node.ts");
var vnode_1 = __webpack_require__(/*! ./vnode */ "./src/vnode/vnode.ts");
var VinallaNode = /** @class */ (function (_super) {
    __extends(VinallaNode, _super);
    function VinallaNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.directives = [];
        _this.innerDirective = [];
        return _this;
    }
    VinallaNode.prototype.AddProperty = function (name, value) {
        if (const_1.REG_ATTR.test(name)) {
            this.Attrs.push({ name: name, value: value });
        }
    };
    VinallaNode.prototype.OnRemoved = function () {
        _super.prototype.OnRemoved.call(this);
        this.directives.forEach(function (dir) { return dir.$OnDestroy(); });
    };
    VinallaNode.prototype.directiveBind = function () {
        var _this = this;
        this.directives.forEach(function (dir) { return dir.$Render(); });
        this.innerDirective.forEach(function (item) {
            item.dir(item.exp, _this, item.isconst);
        });
    };
    /**解析基本信息 */
    VinallaNode.prototype.basicSet = function () {
        var _this = this;
        this.NodeValue = this.Vdom.NodeValue;
        this.NodeName = this.Vdom.NodeName;
        this.NodeType = this.Vdom.NodeType;
        //保存元素属性
        var vanillaAttrs = this.Vdom.Attrs;
        var _loop_1 = function (i) {
            var attr = this_1.Vdom.Attrs[i];
            var ns = util_1.GetNS(attr.Name);
            if (ns.namespace == null)
                ns.namespace = this_1.mvvm.$InitNamespace();
            if (directive_manager_1.IsDirectiveRegistered(ns.value, ns.namespace)) {
                var dirNode = new directive_node_1.DirectiveNode(this_1.Vdom);
                var dirCons = directive_manager_1.GetDirectiveCon(ns.value, ns.namespace);
                var dirMvvm_1 = new dirCons(dirNode, this_1);
                vanillaAttrs = vanillaAttrs.filter(function (attr) {
                    var name = attr.Name;
                    if (const_1.REG_IN.test(attr.Name) || const_1.REG_OUT.test(attr.Name))
                        name = RegExp.$1;
                    var isprop = dirMvvm_1.$Ins.some(function (prop) { return prop.name == name; });
                    var isevent = dirMvvm_1.$Outs.some(function (event) { return event == name; });
                    return !(isprop || isevent);
                });
                this_1.directives.push(dirMvvm_1);
                return { value: void 0 };
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.Vdom.Attrs.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        vanillaAttrs = vanillaAttrs.filter(function (attr) {
            if (const_1.REG_IN.test(attr.Name)) {
                var dir_1 = inner_dir_1.GetInnerDir(RegExp.$1);
                if (dir_1 != null) {
                    _this.innerDirective.push({ dir: dir_1, isconst: false, exp: attr.Value });
                    return false;
                }
            }
            var dir = inner_dir_1.GetInnerDir(attr.Name);
            if (dir != null) {
                _this.innerDirective.push({ dir: dir, isconst: true, exp: attr.Value });
                return false;
            }
            return true;
        });
        vanillaAttrs.forEach(function (attr) {
            _this.AddProperty(attr.Name, attr.Value);
        });
    };
    return VinallaNode;
}(vnode_1.VNode));
exports.VinallaNode = VinallaNode;


/***/ }),

/***/ "./src/vnode/vnode.ts":
/*!****************************!*\
  !*** ./src/vnode/vnode.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
var vdom_1 = __webpack_require__(/*! ../vdom/vdom */ "./src/vdom/vdom.ts");
var const_1 = __webpack_require__(/*! ./../const */ "./src/const.ts");
var VNode = /** @class */ (function () {
    function VNode(Vdom, mvvm, Parent) {
        this.Vdom = Vdom;
        this.mvvm = mvvm;
        this.Parent = Parent;
        /**普通属性 */
        this.Attrs = [];
        this.Children = [];
        this.IsTemplate = false;
        this.IsCopy = false;
        this.status = const_1.VNodeStatus.ACTIVE;
    }
    VNode.prototype.AddProperty = function (name, value) {
        if (const_1.REG_ATTR.test(name)) {
            this.Attrs.push({ name: name, value: value });
        }
    };
    VNode.prototype.directiveBind = function () { };
    /**生成虚拟节点代表的dom并把自己加入父亲dom中 */
    VNode.prototype.Render = function () {
        var _this = this;
        if (this.NodeType == 1) {
            var dom_1 = document.createElement(this.NodeName);
            this.Attrs.forEach(function (prop) {
                dom_1.setAttribute(prop.name, prop.value);
            });
            this.Dom = dom_1;
            var children_1 = [];
            this.Children.forEach(function (child) {
                if (!child.IsCopy)
                    children_1.push(child);
            });
            children_1.forEach(function (child) {
                child.Render();
            });
            this.directiveBind();
        }
        if (this.NodeType == 3) {
            this.Dom = document.createTextNode(this.NodeValue);
            var evalexp = util_1.StrToEvalstr(this.NodeValue);
            if (!evalexp.isconst) {
                this.mvvm.$Watch(this, evalexp.exp, function (newvalue, oldvalue) {
                    _this.Dom.textContent = newvalue;
                });
            }
            else {
                this.Dom.textContent = evalexp.exp;
            }
        }
        if (this.NodeType == 8) {
            this.Dom = document.createComment(this.NodeValue);
        }
        if (this.NodeType == 1 || this.NodeType == 3 || this.NodeType == 8)
            if (this.Parent && this.Parent.Dom)
                this.Parent.Dom.appendChild(this.Dom);
    };
    VNode.prototype.Update = function () {
        //todo 更新属性
        if (this.NodeType == 1) {
            var children_2 = [];
            this.Children.forEach(function (child) {
                children_2.push(child);
            });
            children_2.forEach(function (child) {
                child.Update();
            });
            //todo 设置属性
            return;
        }
        if (this.NodeType == 3) {
            var evalexp = util_1.StrToEvalstr(this.NodeValue);
            if (!evalexp.isconst) {
                this.Dom.textContent = this.mvvm.$GetExpValue(evalexp.exp);
            }
            else {
                this.Dom.textContent = evalexp.exp;
            }
        }
    };
    VNode.prototype.Refresh = function () {
        var _this = this;
        if (this.IsTemplate) {
            return;
        }
        var allnodes = this.Dom.childNodes;
        var allvnodes = [];
        this.Children.forEach(function (child) {
            if (!child.IsTemplate && child.Dom != null) {
                allvnodes = allvnodes.concat(child);
            }
        });
        var ruler = {
            old_j: -1,
            i: 0,
            j: 0
        };
        var opers = [];
        while (true) {
            if (ruler.i > allnodes.length - 1) {
                break;
            }
            if (ruler.j > allvnodes.length - 1) {
                opers.push({
                    type: "remove",
                    node: allnodes[ruler.i]
                });
                ruler.i++;
                ruler.j = ruler.old_j + 1;
                continue;
            }
            if (allnodes[ruler.i] != allvnodes[ruler.j].Dom) {
                ruler.j++;
                continue;
            }
            if (allnodes[ruler.i] == allvnodes[ruler.j].Dom) {
                if (ruler.i < ruler.j) {
                    var index = ruler.old_j + 1;
                    while (index < ruler.j) {
                        opers.push({
                            type: "add",
                            beforeNode: allnodes[ruler.i],
                            node: allvnodes[index].Dom
                        });
                        index++;
                    }
                }
                ruler.old_j = ruler.j;
                ruler.i++;
                ruler.j++;
                continue;
            }
        }
        while (ruler.j < allvnodes.length) {
            opers.push({
                type: "add",
                beforeNode: null,
                node: allvnodes[ruler.j].Dom
            });
            ruler.j++;
        }
        opers.forEach(function (oper) {
            if (oper.type == "add") {
                if (oper.beforeNode != null)
                    _this.Dom.insertBefore(oper.node, oper.beforeNode);
                else
                    _this.Dom.appendChild(oper.node);
            }
            if (oper.type == "remove")
                oper.node.remove();
        });
    };
    VNode.prototype.AddChildren = function (child, nodes, offset) {
        for (var i = 0; i < this.Children.length; i++) {
            if (this.Children[i] == child) {
                (_a = this.Children).splice.apply(_a, [i + 1 + offset, 0].concat(nodes));
                break;
            }
        }
        var _a;
    };
    VNode.prototype.RemoveChildren = function (nodes) {
        this.Children = this.Children.filter(function (child) {
            return nodes.indexOf(child) == -1;
        });
    };
    VNode.prototype.OnRemoved = function () {
        this.Children.forEach(function (child) {
            if (!child.IsCopy)
                child.OnRemoved();
        });
    };
    /**解析基本信息 */
    VNode.prototype.basicSet = function () {
        this.NodeValue = this.Vdom.NodeValue;
        this.NodeName = this.Vdom.NodeName;
        this.NodeType = this.Vdom.NodeType;
        //保存元素属性
        for (var i = 0; i < this.Vdom.Attrs.length; i++) {
            this.AddProperty(this.Vdom.Attrs[i].Name, this.Vdom.Attrs[i].Value);
        }
    };
    /**解析自节点信息 */
    VNode.prototype.childSet = function () {
        //解析子节点
        for (var i = 0; i < this.Vdom.Children.length; i++) {
            var childdom = this.Vdom.Children[i];
            var vchild = vdom_1.NewVNode(childdom, this.mvvm, this);
            if (vchild != null) {
                vchild.AttachDom();
                this.Children.push(vchild);
            }
        }
    };
    VNode.prototype.AttachDom = function () {
        this.basicSet();
        this.childSet();
    };
    VNode.prototype.SetStatus = function (status) {
        this.status = status;
        this.Children.forEach(function (child) {
            if (!child.IsCopy)
                child.SetStatus(status);
        });
    };
    VNode.prototype.GetStatus = function () {
        return this.status;
    };
    VNode.prototype.OnRouterChange = function () {
        this.Children.forEach(function (child) { return child.OnRouterChange(); });
    };
    VNode.prototype.NavigateTo = function (url) {
        if (this.mvvm.$IsRoot()) {
            this.mvvm.$NavigateTo(url);
        }
        else {
            if (this.Parent != null)
                this.Parent.NavigateTo(url);
            else {
                this.mvvm.$GetFenceNode().NavigateTo(url);
            }
        }
    };
    return VNode;
}());
exports.VNode = VNode;


/***/ })

/******/ });
//# sourceMappingURL=rio.js.map