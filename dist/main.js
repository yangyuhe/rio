(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
function DirModel(exp, vnode) {
    var inputtype = vnode.Vdom.GetAttr("type");
    var input = vnode.Vdom.NodeName.toLowerCase();
    if (input == "input" && inputtype == "checkbox") {
        vnode.mvvm.$watch(vnode, exp, function (newvalue) {
            setValue(vnode, newvalue);
        }, true);
    }
    else {
        vnode.mvvm.$watch(vnode, exp, function (newvalue) {
            setValue(vnode, newvalue);
        });
    }
    vnode.Dom.addEventListener("input", function (event) {
        //select控件
        if (vnode.NodeName.toLowerCase() == "select") {
            vnode.mvvm.SetValue(exp, event.target.value);
            return;
        }
        //text radio checkbox控件
        var inputType = vnode.Dom.getAttribute("type");
        if (inputType == null || inputType == "")
            inputType = "text";
        switch (inputType) {
            case "text":
            case "radio":
                vnode.mvvm.SetValue(exp, event.target.value);
                break;
            case "checkbox":
                var cur = vnode.mvvm.GetExpValue(exp);
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

},{}],3:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../const");
function OnClick(dir, vnode) {
    if (const_1.REG_EVENT.test(dir)) {
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
                            params.push(vnode.mvvm.GetExpValue(p));
                        }
                    }
                    else {
                        params.push(RegExp.$2);
                    }
                });
                (_a = vnode.mvvm).RevokeMethod.apply(_a, [methodStr_1].concat(params));
                var _a;
            });
        }
        else {
            vnode.Dom.addEventListener("click", function () {
                vnode.mvvm.RevokeMethod(methodStr_1);
            });
        }
    }
}
exports.OnClick = OnClick;

},{"../const":1}],4:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var components_manager_1 = require("./manager/components-manager");
var directive_manager_1 = require("./manager/directive-manager");
window.Rio = {
    component: function (name, option, namespace) {
        option.$name = name;
        if (namespace != null)
            option.$namespace = namespace;
        else
            option.$namespace = "default";
        components_manager_1.RegisterComponent(option);
        return this;
    },
    directive: function (name, option, namespace) {
        option.$name = name;
        if (namespace != null)
            option.$namespace = namespace;
        else
            option.$namespace = "default";
        directive_manager_1.RegisterDirective(option);
        return this;
    },
    namespace: function (namespace) {
        return {
            component: function (name, option) {
                window.Rio.component(name, option, namespace);
                return this;
            },
            directive: function (name, option) {
                window.Rio.directive(name, option, namespace);
                return this;
            }
        };
    }
};
document.addEventListener("DOMContentLoaded", function () {
    components_manager_1.Start();
});

},{"./manager/components-manager":5,"./manager/directive-manager":6}],5:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var mvvm_1 = require("../mvvm/mvvm");
var custom_node_1 = require("../vnode/custom-node");
var vdom_1 = require("../vdom/vdom");
var util_1 = require("../util");
var roots = [];
var namespaces = {
    "default": {}
};
function Start() {
    firstRender(document.body);
    roots.forEach(function (root) {
        var domtree = vdom_1.TraverseDom(root.dom);
        var mountmvvm = new mvvm_1.MVVM(root.option);
        var custnode = new custom_node_1.CustomNode(domtree, null, null, mountmvvm);
        custnode.ParseTemplate();
        mountmvvm.$FenceNode = custnode;
        custnode.AttachDom();
        var content = mountmvvm.Render();
        root.dom.parentElement.replaceChild(content, root.dom);
    });
}
exports.Start = Start;
function firstRender(dom) {
    var ns = util_1.GetNS(dom.nodeName);
    if (IsComponentRegistered(ns.value, ns.namespace || "default")) {
        var component = GetComponent(ns.value, ns.namespace || "default");
        roots.push({ option: component, dom: dom });
    }
    else {
        for (var i = 0; i < dom.children.length; i++) {
            var child = dom.children[i];
            firstRender(child);
        }
    }
}
function RegisterComponent(option) {
    checkOption(option);
    option.data = option.data || {};
    option.events = option.events || [];
    option.methods = option.methods || {};
    option.props = option.props || [];
    option.$name = option.$name || "";
    option.computed = option.computed || {};
    if (namespaces[option.$namespace] == null)
        namespaces[option.$namespace] = {};
    var components = namespaces[option.$namespace];
    components[option.$name] = option;
}
exports.RegisterComponent = RegisterComponent;
function GetComponent(name, namespace) {
    name = name.toLowerCase();
    namespace = namespace.toLowerCase();
    var option = namespaces[namespace] && namespaces[namespace][name];
    if (option && option.$id == null)
        preTreatment(option);
    return option;
}
exports.GetComponent = GetComponent;
function IsComponentRegistered(name, namespace) {
    name = name.toLowerCase();
    namespace = namespace.toLowerCase();
    if (namespaces[namespace] && namespaces[namespace][name])
        return true;
    else
        return false;
}
exports.IsComponentRegistered = IsComponentRegistered;
function preTreatment(option) {
    //唯一标识
    option.$id = option.$namespace + "_" + option.$name;
    //模版
    if (option.templateUrl != null) {
        option.template = util_1.HttpGet(option.templateUrl);
        if (option.template == null) {
            util_1.LogError("path " + option.templateUrl + " not found");
            return;
        }
    }
    var dom = (new DOMParser()).parseFromString(option.template, "text/html").body.children[0];
    option.$domtree = vdom_1.TraverseDom(dom);
    //样式
    if (option.styleUrl != null) {
        option.style = util_1.HttpGet(option.styleUrl);
    }
    if (option.style != null) {
        var css = option.style.replace(/(?!\s)([^\{\}]+)(?=\{[^\{\}]*\})/g, function (str) {
            return str + "[" + option.$id + "]";
        });
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
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
function checkOption(option) {
    if (util_1.IsStringEmpty(option.$name))
        throw new Error("component name should not be null");
    if (util_1.IsStringEmpty(option.template) && util_1.IsStringEmpty(option.templateUrl))
        throw new Error("component template should not be null");
    if (namespaces[option.$namespace] && namespaces[option.$namespace][option.$name])
        throw new Error("component " + option.$name + " has already exist");
}

},{"../mvvm/mvvm":9,"../util":14,"../vdom/vdom":15,"../vnode/custom-node":16}],6:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var namespaces = {
    "default": {}
};
function RegisterDirective(option) {
    checkOption(option);
    option.data = option.data || {};
    option.events = option.events || [];
    option.methods = option.methods || {};
    option.props = option.props || [];
    if (namespaces[option.$namespace] == null)
        namespaces[option.$namespace] = {};
    var directives = namespaces[option.$namespace];
    directives[option.$name] = option;
}
exports.RegisterDirective = RegisterDirective;
function GetDirective(name, namespace) {
    name = name.toLowerCase();
    namespace = namespace.toLowerCase();
    var option = namespaces[namespace] && namespaces[namespace][name];
    return option;
}
exports.GetDirective = GetDirective;
function IsDirectiveRegistered(name, namespace) {
    name = name.toLowerCase();
    namespace = namespace.toLowerCase();
    if (namespaces[namespace] && namespaces[namespace][name])
        return true;
    else
        return false;
}
exports.IsDirectiveRegistered = IsDirectiveRegistered;
function checkOption(option) {
    if (util_1.IsStringEmpty(option.$name))
        throw new Error("directive name should not be null");
    if (namespaces[option.$namespace] && namespaces[option.$namespace][option.$name])
        throw new Error("directive " + option.$name + " has already exist");
}

},{"../util":14}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var observe_1 = require("./../observer/observe");
var DirectiveMVVM = /** @class */ (function () {
    function DirectiveMVVM(option, $directive, $vnode) {
        this.$directive = $directive;
        this.$vnode = $vnode;
        this.$methods = {};
        this.$Ins = [];
        this.$Outs = [];
        if (option.data != null)
            this.$data = JSON.parse(JSON.stringify(option.data));
        else
            this.$data = {};
        this.$methods = option.methods || {};
        this.$Ins = option.props || [];
        this.$Outs = option.events || [];
        this.proxyData();
        this.proxyMethod();
        this.$observe = new observe_1.Observe(this);
    }
    DirectiveMVVM.prototype.proxyData = function () {
        var _loop_1 = function (key) {
            Object.defineProperty(this_1, key, {
                get: function () {
                    return this.$data[key];
                },
                set: function (newval) {
                    this.$data[key] = newval;
                }
            });
        };
        var this_1 = this;
        for (var key in this.$data) {
            _loop_1(key);
        }
    };
    DirectiveMVVM.prototype.proxyMethod = function () {
        var _loop_2 = function (key) {
            Object.defineProperty(this_2, key, {
                get: function () {
                    return this.$methods[key];
                }
            });
        };
        var this_2 = this;
        for (var key in this.$methods) {
            _loop_2(key);
        }
    };
    DirectiveMVVM.prototype.$ondestroy = function () {
        if (this.$methods["$destroy"] != null) {
            this.$methods["$destroy"]();
        }
    };
    DirectiveMVVM.prototype.$watch = function (exp, cb) {
        this.$observe.AddWatcher(this.$vnode, exp, cb);
    };
    DirectiveMVVM.prototype.Render = function () {
        var _this = this;
        this.$element = this.$vnode.Dom;
        this.$Ins.forEach(function (prop) {
            var inName = _this.$directive.GetIn(prop.name);
            if (inName == null && prop.required) {
                throw new Error("component \'" + _this.$name + "\' need prop \'" + prop.name);
            }
            if (inName != null) {
                _this.$vnode.mvvm.$watch(_this.$vnode, inName, function (newvalue, oldvalue) {
                    _this.$checkProp(prop, newvalue);
                    _this[prop.name] = newvalue;
                });
                _this.$observe.ReactiveKey(_this, prop.name, true);
            }
        });
        if (this.$methods && this.$methods.$init) {
            this.$methods.$init.call(this);
        }
    };
    DirectiveMVVM.prototype.$checkProp = function (prop, value) {
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
    return DirectiveMVVM;
}());
exports.DirectiveMVVM = DirectiveMVVM;

},{"./../observer/observe":12}],9:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var revoke_event_1 = require("./revoke-event");
var observe_1 = require("../observer/observe");
var MVVM = /** @class */ (function () {
    function MVVM(option) {
        this.$methods = {};
        this.$computed = {};
        this.$Ins = [];
        this.$Outs = [];
        this.$name = "";
        this.hirented = false;
        this.$data = JSON.parse(JSON.stringify(option.data));
        this.$methods = option.methods;
        this.$name = option.$name;
        this.$computed = option.computed;
        this.$template = option.template;
        this.$Namespace = option.$namespace;
        this.$domtree = option.$domtree;
        if (option.methods && option.methods.$init) {
            option.methods.$init.call(this);
        }
        this.$Ins = option.props;
        this.$Outs = option.events;
        this.$observe = new observe_1.Observe(this);
        this.$observe.ReactiveData(this.$data);
        this.proxyData();
        this.proxyMethod();
    }
    MVVM.prototype.proxyData = function () {
        var _loop_1 = function (key) {
            Object.defineProperty(this_1, key, {
                get: function () {
                    return this.$data[key];
                },
                set: function (newval) {
                    this.$data[key] = newval;
                }
            });
        };
        var this_1 = this;
        for (var key in this.$data) {
            _loop_1(key);
        }
    };
    MVVM.prototype.proxyMethod = function () {
        var _loop_2 = function (key) {
            Object.defineProperty(this_2, key, {
                get: function () {
                    return this.$methods[key];
                }
            });
        };
        var this_2 = this;
        for (var key in this.$methods) {
            _loop_2(key);
        }
    };
    MVVM.prototype.proxyComputed = function () {
        for (var key in this.$computed) {
            this.$observe.WatchComputed(this.$FenceNode, key, this.$computed[key]);
        }
    };
    MVVM.prototype.SetHirented = function (hirentedFromParent) {
        this.hirented = hirentedFromParent;
    };
    MVVM.prototype.GetTemplate = function () {
        return this.$template;
    };
    MVVM.prototype.GetDomTree = function () {
        return this.$domtree;
    };
    MVVM.prototype.Render = function () {
        var _this = this;
        this.proxyComputed();
        if (this.hirented) {
            Object.keys(this.$FenceNode.mvvm.$data).forEach(function (key) {
                _this.$FenceNode.mvvm.$watch(_this.$FenceNode, key, function (newvalue, oldvalue) {
                    _this[key] = newvalue;
                });
                _this.$observe.ReactiveKey(_this, key, true);
            });
            Object.keys(this.$FenceNode.mvvm.$computed).forEach(function (key) {
                _this.$FenceNode.mvvm.$watch(_this.$FenceNode, key, function (newvalue, oldvalue) {
                    _this[key] = newvalue;
                });
                _this.$observe.ReactiveKey(_this, key, true);
            });
        }
        this.$Ins.forEach(function (prop) {
            var inName = _this.$FenceNode.GetIn(prop.name);
            if (inName == null && prop.required) {
                throw new Error("component \'" + _this.$name + "\' need prop \'" + prop.name);
            }
            if (inName != null) {
                _this.$FenceNode.mvvm.$watch(_this.$FenceNode, inName, function (newvalue, oldvalue) {
                    _this.$checkProp(prop, newvalue);
                    _this[prop.name] = newvalue;
                });
                _this.$observe.ReactiveKey(_this, prop.name, true);
            }
        });
        this.$TreeRoot.Render();
        return this.$TreeRoot.Dom;
    };
    MVVM.prototype.RevokeMethod = function (method) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (this.hirented) {
            (_a = this.$FenceNode.mvvm).RevokeMethod.apply(_a, [method].concat(params));
        }
        else {
            if (this.$methods[method] != null)
                this.$methods[method].apply(this, params);
        }
        var _a;
    };
    MVVM.prototype.GetExpValue = function (exp) {
        return this.$observe.GetValueWithExp(exp);
    };
    MVVM.prototype.SetValue = function (exp, value) {
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
    MVVM.prototype.$emit = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        if (this.$FenceNode != null && this.$FenceNode.mvvm != null) {
            var method = this.$FenceNode.GetOut(event);
            revoke_event_1.RevokeEvent(method, data, this.$FenceNode.mvvm);
        }
    };
    ;
    MVVM.prototype.$watch = function (vnode, exp, listener, arraydeep) {
        this.$observe.AddWatcher(vnode, exp, listener, arraydeep);
    };
    MVVM.prototype.$ondestroy = function () {
        if (this.$methods["$destroy"] != null) {
            this.$methods["$destroy"]();
        }
        this.$TreeRoot.OnRemoved();
    };
    MVVM.prototype.$checkProp = function (prop, value) {
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
    return MVVM;
}());
exports.MVVM = MVVM;

},{"../observer/observe":12,"./revoke-event":10}],10:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../const");
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
                        params_1.push(mvvm.GetExpValue(p));
                    }
                }
                else {
                    params_1.push(RegExp.$2);
                }
            });
            mvvm.RevokeMethod.apply(mvvm, [methodStr].concat(params_1));
        }
        else {
            mvvm.RevokeMethod(methodStr);
        }
    }
}
exports.RevokeEvent = RevokeEvent;

},{"../const":1}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var watcher_1 = require("./watcher");
var msg_queue_1 = require("./msg-queue");
var const_1 = require("../const");
var Observe = /** @class */ (function () {
    function Observe(data) {
        this.data = data;
    }
    Observe.prototype.GetValue = function (watcher) {
        Observe.target = watcher;
        var res;
        if (typeof watcher.ExpOrFunc == "string") {
            res = EvalExp(this.data, watcher.ExpOrFunc);
        }
        if (typeof watcher.ExpOrFunc == "function") {
            res = watcher.ExpOrFunc.call(this.data);
        }
        Observe.target = null;
        return res;
    };
    Observe.prototype.GetValueWithExp = function (exp) {
        var res = EvalExp(this.data, exp);
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

},{"../const":1,"./msg-queue":11,"./watcher":13}],13:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../const");
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

},{"../const":1}],14:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
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
    if (res.length == 2)
        return { namespace: res[0], value: res[1] };
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

},{}],15:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var components_manager_1 = require("../manager/components-manager");
var mvvm_1 = require("../mvvm/mvvm");
var util_1 = require("../util");
var const_1 = require("../const");
var vinalla_node_1 = require("../vnode/vinalla-node");
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
    root.NodeName = dom.nodeName;
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
        var SlotNode = require("../vnode/slot-node").SlotNode;
        return new SlotNode(dom, mvvm, parent, dom.GetAttr("name"));
    }
    if (priority >= Priority.FOR && dom.GetAttr(const_1.PRE + "for") != null) {
        var ForNode = require("../vnode/for-node").ForNode;
        return new ForNode(dom, mvvm, parent, dom.GetAttr(const_1.PRE + "for"));
    }
    if (priority >= Priority.IF && dom.GetAttr(const_1.PRE + "if") != null) {
        var IfNode = require("../vnode/if-node").IfNode;
        return new IfNode(dom, mvvm, parent, dom.GetAttr(const_1.PRE + "if"));
    }
    var ns = util_1.GetNS(dom.NodeName);
    if (components_manager_1.IsComponentRegistered(ns.value, ns.namespace || "default")) {
        var option = components_manager_1.GetComponent(ns.value, ns.namespace || "default");
        var selfmvvm = new mvvm_1.MVVM(option);
        var CustomNode = require("../vnode/custom-node").CustomNode;
        var cust = new CustomNode(dom, mvvm, parent, selfmvvm);
        selfmvvm.$FenceNode = cust;
        cust.ParseTemplate();
        return cust;
    }
    return new vinalla_node_1.VinallaNode(dom, mvvm, parent);
}
exports.NewVNode = NewVNode;

},{"../const":1,"../manager/components-manager":5,"../mvvm/mvvm":9,"../util":14,"../vnode/custom-node":16,"../vnode/for-node":18,"../vnode/if-node":19,"../vnode/slot-node":20,"../vnode/vinalla-node":22}],16:[function(require,module,exports){
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
var vinalla_node_1 = require("./vinalla-node");
var const_1 = require("../const");
var components_manager_1 = require("../manager/components-manager");
var mvvm_1 = require("../mvvm/mvvm");
var util_1 = require("../util");
var vdom_1 = require("../vdom/vdom");
var template_node_1 = require("./template-node");
var vnode_1 = require("./vnode");
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
        this.Dom = this.SurroundMvvm.Render();
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
    CustomNode.prototype.ParseTemplate = function () {
        var domtree = this.SurroundMvvm.GetDomTree();
        var ns = util_1.GetNS(domtree.NodeName);
        if (components_manager_1.IsComponentRegistered(ns.value, ns.namespace || this.SurroundMvvm.$Namespace)) {
            var option = components_manager_1.GetComponent(ns.value, ns.namespace || this.SurroundMvvm.$Namespace);
            var selfmvvm = new mvvm_1.MVVM(option);
            var child = new CustomNode(domtree, this.SurroundMvvm, null, selfmvvm);
            this.SurroundMvvm.$TreeRoot = child;
            selfmvvm.$FenceNode = this;
            child.ParseTemplate();
        }
        else {
            this.SurroundMvvm.$TreeRoot = new vinalla_node_1.VinallaNode(domtree, this.SurroundMvvm, null);
        }
        this.SurroundMvvm.$TreeRoot.AttachDom();
    };
    CustomNode.prototype.GetInValue = function (prop) {
        if (this.ins_pure[prop] != null)
            return this.ins_pure[prop];
        if (this.ins_exp[prop] != null)
            return this.mvvm.GetExpValue(this.ins_exp[prop]);
        return null;
    };
    CustomNode.prototype.GetIn = function (prop) {
        return this.ins_pure[prop] || this.ins_exp[prop];
    };
    CustomNode.prototype.GetOut = function (prop) {
        return this.outs[prop];
    };
    CustomNode.prototype.Refresh = function () {
        this.SurroundMvvm.$TreeRoot.Refresh();
    };
    CustomNode.prototype.Update = function () {
        this.SurroundMvvm.$TreeRoot.Update();
    };
    CustomNode.prototype.OnRemoved = function () {
        this.SurroundMvvm.$ondestroy();
    };
    CustomNode.prototype.SetStatus = function (status) {
        this.status = status;
        this.SurroundMvvm.$TreeRoot.SetStatus(status);
    };
    CustomNode.prototype.AddProperty = function (name, value) {
        //输入
        for (var i = 0; i < this.SurroundMvvm.$Ins.length; i++) {
            var prop = this.SurroundMvvm.$Ins[i];
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
        for (var i = 0; i < this.SurroundMvvm.$Outs.length; i++) {
            var event_1 = this.SurroundMvvm.$Outs[i];
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

},{"../const":1,"../manager/components-manager":5,"../mvvm/mvvm":9,"../util":14,"../vdom/vdom":15,"./template-node":21,"./vinalla-node":22,"./vnode":23}],17:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../const");
var Directive = /** @class */ (function () {
    function Directive(vdom, directiveOption) {
        var _this = this;
        this.vdom = vdom;
        this.directiveOption = directiveOption;
        //输入与输出值
        this.ins_pure = {};
        this.ins_exp = {};
        this.outs = {};
        this.vdom.Attrs.forEach(function (attr) {
            _this.addProperty(attr.Name, attr.Value);
        });
    }
    Directive.prototype.addProperty = function (name, value) {
        //输入
        for (var i = 0; i < this.directiveOption.props.length; i++) {
            var prop = this.directiveOption.props[i];
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
        for (var i = 0; i < this.directiveOption.events.length; i++) {
            var event_1 = this.directiveOption.events[i];
            if (const_1.REG_OUT.test(name) && event_1 == RegExp.$1) {
                this.outs[RegExp.$1] = value;
                return;
            }
        }
    };
    Directive.prototype.GetIn = function (prop) {
        return this.ins_pure[prop] || this.ins_exp[prop];
    };
    Directive.prototype.GetOut = function (prop) {
        return this.outs[prop];
    };
    return Directive;
}());
exports.Directive = Directive;

},{"../const":1}],18:[function(require,module,exports){
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
var models_1 = require("../models");
var mvvm_1 = require("../mvvm/mvvm");
var vdom_1 = require("../vdom/vdom");
var custom_node_1 = require("./custom-node");
var vnode_1 = require("./vnode");
var const_1 = require("../const");
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
        var mvvm = new mvvm_1.MVVM({ $name: "", data: {}, methods: {}, computed: {}, events: [], $namespace: this.mvvm.$Namespace, props: [{ name: itemexp, required: true }] });
        mvvm.SetHirented(true);
        var fencenode = new custom_node_1.CustomNode(this.Vdom, this.mvvm, null, mvvm);
        mvvm.$FenceNode = fencenode;
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
                var vnode = vdom_1.NewVNode(this.Vdom, custnode.SurroundMvvm, null, vdom_1.Priority.IF);
                vnode.AttachDom();
                custnode.SurroundMvvm.$TreeRoot = vnode;
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
        var items = this.mvvm.GetExpValue(this.ForExp.arrayExp);
        if (toString.call(items) === "[object Array]") {
            this.reImplementForExp(items.length);
        }
    };
    ForNode.prototype.AttachDom = function () { };
    ForNode.prototype.Render = function () {
        this.mvvm.$watch(this, this.ForExp.arrayExp + ".length", this.reImplementForExp.bind(this));
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

},{"../const":1,"../models":7,"../mvvm/mvvm":9,"../vdom/vdom":15,"./custom-node":16,"./vnode":23}],19:[function(require,module,exports){
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
var vnode_1 = require("./vnode");
var vdom_1 = require("../vdom/vdom");
var const_1 = require("../const");
var IfNode = /** @class */ (function (_super) {
    __extends(IfNode, _super);
    function IfNode(Vdom, mvvm, Parent, ifExp) {
        var _this = _super.call(this, Vdom, mvvm, Parent) || this;
        _this.Vdom = Vdom;
        _this.mvvm = mvvm;
        _this.Parent = Parent;
        _this.ifExp = ifExp;
        _this.IsTemplate = true;
        return _this;
    }
    IfNode.prototype.AttachDom = function () { };
    IfNode.prototype.Render = function () {
        var _this = this;
        this.mvvm.$watch(this, this.ifExp, function (newvalue) { return _this.reImpletement(newvalue); });
    };
    IfNode.prototype.Update = function () {
        var attached = this.mvvm.GetExpValue(this.ifExp);
        this.reImpletement(attached);
    };
    IfNode.prototype.reImpletement = function (newvalue) {
        if (newvalue) {
            if (this.dynamicVNode == null) {
                this.instance();
                this.dynamicVNode.Render();
            }
            else {
                this.dynamicVNode.Update();
            }
            if (this.Parent != null) {
                this.Parent.AddChildren(this, [this.dynamicVNode], 0);
                this.Parent.Refresh();
            }
            else {
                this.mvvm.$FenceNode.Dom = this.dynamicVNode.Dom;
                this.mvvm.$FenceNode.Parent.Refresh();
            }
            this.dynamicVNode.SetStatus(const_1.VNodeStatus.ACTIVE);
        }
        else {
            if (this.dynamicVNode != null) {
                if (this.Parent != null) {
                    this.Parent.RemoveChildren([this.dynamicVNode]);
                    this.Parent.Refresh();
                }
                else {
                    this.mvvm.$FenceNode.Dom = null;
                    this.mvvm.$FenceNode.Parent.Refresh();
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

},{"../const":1,"../vdom/vdom":15,"./vnode":23}],20:[function(require,module,exports){
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
var vnode_1 = require("./vnode");
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
        var template = this.mvvm.$FenceNode.GetTemplate(this.name);
        if (template != null) {
            template.Render();
            this.Dom = template.Dom;
            while (this.Dom.firstChild != null) {
                this.Parent.Dom.appendChild(this.Dom.firstChild);
            }
        }
        return null;
    };
    SlotNode.prototype.Update = function () {
        var template = this.mvvm.$FenceNode.GetTemplate(this.name);
        if (template != null) {
            template.Update();
        }
    };
    SlotNode.prototype.SetStatus = function (status) {
        this.status = status;
        var template = this.mvvm.$FenceNode.GetTemplate(this.name);
        template.SetStatus(status);
    };
    SlotNode.prototype.OnRemoved = function () {
        var template = this.mvvm.$FenceNode.GetTemplate(this.name);
        template.OnRemoved();
    };
    return SlotNode;
}(vnode_1.VNode));
exports.SlotNode = SlotNode;

},{"./vnode":23}],21:[function(require,module,exports){
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
var vnode_1 = require("./vnode");
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

},{"./vnode":23}],22:[function(require,module,exports){
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
var directive_manager_1 = require("../manager/directive-manager");
var directive_mvvm_1 = require("../mvvm/directive-mvvm");
var util_1 = require("../util");
var const_1 = require("./../const");
var directive_1 = require("./directive");
var vnode_1 = require("./vnode");
var model_1 = require("../directive/model");
var onclick_1 = require("../directive/onclick");
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
        this.directives.forEach(function (dir) { return dir.$ondestroy(); });
    };
    VinallaNode.prototype.directiveBind = function () {
        var _this = this;
        this.directives.forEach(function (dir) { return dir.Render(); });
        this.innerDirective.forEach(function (dir) {
            if (dir.name == const_1.PRE + "model") {
                model_1.DirModel(dir.value, _this);
            }
            if (dir.name == const_1.PRE + "click") {
                onclick_1.OnClick(dir.value, _this);
            }
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
                ns.namespace = this_1.mvvm.$Namespace;
            if (directive_manager_1.IsDirectiveRegistered(ns.value, ns.namespace)) {
                var directiveoption_1 = directive_manager_1.GetDirective(ns.value, ns.namespace);
                vanillaAttrs = vanillaAttrs.filter(function (attr) {
                    var name = attr.Name;
                    if (const_1.REG_IN.test(attr.Name) || const_1.REG_OUT.test(attr.Name))
                        name = RegExp.$1;
                    var isprop = directiveoption_1.props.some(function (prop) { return prop.name == name; });
                    var isevent = directiveoption_1.events.some(function (event) { return event == name; });
                    return !(isprop || isevent);
                });
                var directive = new directive_1.Directive(this_1.Vdom, directiveoption_1);
                var directivemvvm = new directive_mvvm_1.DirectiveMVVM(directiveoption_1, directive, this_1);
                this_1.directives.push(directivemvvm);
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
            if (attr.Name == const_1.PRE + "model") {
                _this.innerDirective.push({ name: attr.Name, value: attr.Value });
                return false;
            }
            if (attr.Name == const_1.PRE + "click") {
                _this.innerDirective.push({ name: attr.Name, value: attr.Value });
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

},{"../directive/model":2,"../directive/onclick":3,"../manager/directive-manager":6,"../mvvm/directive-mvvm":8,"../util":14,"./../const":1,"./directive":17,"./vnode":23}],23:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../const");
var vdom_1 = require("../vdom/vdom");
var const_2 = require("./../const");
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
        this.status = const_2.VNodeStatus.ACTIVE;
    }
    VNode.prototype.AddProperty = function (name, value) {
        if (const_2.REG_ATTR.test(name)) {
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
            if (const_1.REG_SINGLE.test(this.NodeValue)) {
                this.mvvm.$watch(this, RegExp.$1, function (newvalue, oldvalue) {
                    _this.Dom.textContent = newvalue;
                });
            }
            else {
                if (const_2.REG_MULTI.test(this.NodeValue)) {
                    var res = this.multiBindParse(this.NodeValue);
                    this.mvvm.$watch(this, res, function (newvalue, oldvalue) {
                        _this.Dom.textContent = newvalue;
                    });
                }
                else {
                    this.Dom.textContent = this.NodeValue;
                }
            }
        }
        if (this.Parent && this.Parent.Dom)
            this.Parent.Dom.appendChild(this.Dom);
    };
    VNode.prototype.multiBindParse = function (nodevalue) {
        var reg = /\{\{([^\{\}]*)\}\}/g;
        var res = reg.exec(nodevalue);
        var exp = "";
        var lastindex = 0;
        while (res) {
            if (res.index != lastindex) {
                exp += "\'" + nodevalue.substring(lastindex, res.index) + "\'+";
            }
            lastindex = res.index + res[0].length;
            exp += "(" + RegExp.$1 + ")+";
            res = reg.exec(nodevalue);
        }
        if (exp.lastIndexOf("+") == exp.length - 1) {
            exp = exp.substring(0, exp.length - 1);
        }
        return exp;
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
            if (const_1.REG_SINGLE.test(this.NodeValue)) {
                this.Dom.textContent = this.mvvm.GetExpValue(RegExp.$1);
            }
            else {
                if (const_2.REG_MULTI.test(this.NodeValue)) {
                    var res = this.multiBindParse(this.NodeValue);
                    this.Dom.textContent = this.mvvm.GetExpValue(res);
                }
                else {
                    this.Dom.textContent = this.NodeValue;
                }
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
    return VNode;
}());
exports.VNode = VNode;

},{"../const":1,"../vdom/vdom":15,"./../const":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3QudHMiLCJzcmMvZGlyZWN0aXZlL21vZGVsLnRzIiwic3JjL2RpcmVjdGl2ZS9vbmNsaWNrLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWFuYWdlci9jb21wb25lbnRzLW1hbmFnZXIudHMiLCJzcmMvbWFuYWdlci9kaXJlY3RpdmUtbWFuYWdlci50cyIsInNyYy9tb2RlbHMudHMiLCJzcmMvbXZ2bS9kaXJlY3RpdmUtbXZ2bS50cyIsInNyYy9tdnZtL212dm0udHMiLCJzcmMvbXZ2bS9yZXZva2UtZXZlbnQudHMiLCJzcmMvb2JzZXJ2ZXIvbXNnLXF1ZXVlLnRzIiwic3JjL29ic2VydmVyL29ic2VydmUudHMiLCJzcmMvb2JzZXJ2ZXIvd2F0Y2hlci50cyIsInNyYy91dGlsLnRzIiwic3JjL3Zkb20vdmRvbS50cyIsInNyYy92bm9kZS9jdXN0b20tbm9kZS50cyIsInNyYy92bm9kZS9kaXJlY3RpdmUudHMiLCJzcmMvdm5vZGUvZm9yLW5vZGUudHMiLCJzcmMvdm5vZGUvaWYtbm9kZS50cyIsInNyYy92bm9kZS9zbG90LW5vZGUudHMiLCJzcmMvdm5vZGUvdGVtcGxhdGUtbm9kZS50cyIsInNyYy92bm9kZS92aW5hbGxhLW5vZGUudHMiLCJzcmMvdm5vZGUvdm5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQWEsUUFBQSxTQUFTLEdBQUcsT0FBTyxDQUFBO0FBQ25CLFFBQUEsZUFBZSxHQUFHLE9BQU8sQ0FBQTtBQUN6QixRQUFBLEdBQUcsR0FBQyxJQUFJLENBQUE7QUFFckIsZ0JBQWdCO0FBQ0gsUUFBQSxVQUFVLEdBQUcsc0JBQXNCLENBQUE7QUFDbkMsUUFBQSxTQUFTLEdBQUcsZUFBZSxDQUFBO0FBQ3hDLGNBQWM7QUFDRCxRQUFBLFNBQVMsR0FBQyxpQkFBaUIsQ0FBQTtBQUN4QyxTQUFTO0FBQ0ksUUFBQSxPQUFPLEdBQUMsaUJBQWlC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Iiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgY29uc3QgRElSX01PREVMID0gXCJtb2RlbFwiXG5leHBvcnQgY29uc3QgRElSX0VWRU5UX0NMSUNLID0gXCJjbGlja1wiXG5leHBvcnQgY29uc3QgUFJFPVwici1cIlxuXG4vKiroirHmi6zlj7fmlbDmja7nu5Hlrprooajovr7lvI8gKi9cbmV4cG9ydCBjb25zdCBSRUdfU0lOR0xFID0gL15cXHtcXHsoW15cXHtcXH1dKilcXH1cXH0kL1xuZXhwb3J0IGNvbnN0IFJFR19NVUxUSSA9IC9cXHtcXHsoLio/KVxcfVxcfS9cbi8qKuS6i+S7tuebkeWQrOWTjeW6lOWHveaVsCAqL1xuZXhwb3J0IGNvbnN0IFJFR19FVkVOVD0vXihcXHcrKVxcKCguKilcXCkkL1xuLyoq5a2X56ym5LiyICovXG5leHBvcnQgY29uc3QgUkVHX1NUUj0vXihbJ1wiXSkoLio/KVxcMSQvXG5leHBvcnQgY29uc3QgUkVHX01JRF9TVFI9LyhbJ1wiXSkoLio/KVxcMS9cblxuLyoq6L6T5YWl5bGe5oCnICovXG5leHBvcnQgY29uc3QgUkVHX0lOPS9eXFxbKFxcdyspXFxdJC9cbi8qKui+k+WHuuS6i+S7tiAqL1xuZXhwb3J0IGNvbnN0IFJFR19PVVQ9L15cXCgoXFx3KylcXCkkL1xuLyoq5q2j5bi45bGe5oCnICovXG5leHBvcnQgY29uc3QgUkVHX0FUVFI9L15bQS16X11cXHcqJC9cblxuXG4vKirmtYvor5XovpPlh7rpobkgKi9cbmV4cG9ydCBjb25zdCBSRUdfVEVTVF9PVVRQVVQ9L14oKGNsaWNrKSkkL1xuXG5leHBvcnQgZW51bSBWTm9kZVN0YXR1c3tcbiAgICAvKirkvp3nhLblpITkuo52bm9kZeagkeS4rSAqL1xuICAgIEFDVElWRSxcbiAgICAvKirkuI3lnKh2bm9kZeagkeS4reS9huaYr+acieWPr+iDvemHjeaWsOWKoOWbnuadpSAqL1xuICAgIElOQUNUSVZFLFxuICAgIC8qKuaKm+W8gyAqL1xuICAgIERFUFJFQ0FURURcbn0iLCJpbXBvcnQgeyBWTm9kZSB9IGZyb20gXCIuLi92bm9kZS92bm9kZVwiXG5leHBvcnQgZnVuY3Rpb24gRGlyTW9kZWwoZXhwOiBzdHJpbmcsIHZub2RlOiBWTm9kZSkge1xuICAgIGxldCBpbnB1dHR5cGU9dm5vZGUuVmRvbS5HZXRBdHRyKFwidHlwZVwiKVxuICAgIGxldCBpbnB1dD12bm9kZS5WZG9tLk5vZGVOYW1lLnRvTG93ZXJDYXNlKClcbiAgICBpZihpbnB1dD09XCJpbnB1dFwiICYmIGlucHV0dHlwZT09XCJjaGVja2JveFwiKXtcbiAgICAgICAgdm5vZGUubXZ2bS4kd2F0Y2godm5vZGUsZXhwLCAobmV3dmFsdWUpID0+IHtcbiAgICAgICAgICAgIHNldFZhbHVlKHZub2RlLCBuZXd2YWx1ZSlcbiAgICAgICAgfSx0cnVlKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgdm5vZGUubXZ2bS4kd2F0Y2godm5vZGUsZXhwLCAobmV3dmFsdWUpID0+IHtcbiAgICAgICAgICAgIHNldFZhbHVlKHZub2RlLCBuZXd2YWx1ZSlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHZub2RlLkRvbS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgLy9zZWxlY3Tmjqfku7ZcbiAgICAgICAgaWYgKHZub2RlLk5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgdm5vZGUubXZ2bS5TZXRWYWx1ZShleHAsIGV2ZW50LnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIC8vdGV4dCByYWRpbyBjaGVja2JveOaOp+S7tlxuICAgICAgICBsZXQgaW5wdXRUeXBlID0gKHZub2RlLkRvbSBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwidHlwZVwiKVxuICAgICAgICBpZiAoaW5wdXRUeXBlID09IG51bGwgfHwgaW5wdXRUeXBlID09IFwiXCIpXG4gICAgICAgICAgICBpbnB1dFR5cGUgPSBcInRleHRcIlxuICAgICAgICBzd2l0Y2ggKGlucHV0VHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJyYWRpb1wiOlxuICAgICAgICAgICAgICAgIHZub2RlLm12dm0uU2V0VmFsdWUoZXhwLCBldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxuICAgICAgICAgICAgICAgIGxldCBjdXIgPSB2bm9kZS5tdnZtLkdldEV4cFZhbHVlKGV4cClcbiAgICAgICAgICAgICAgICBpZiAodG9TdHJpbmcuY2FsbChjdXIpID09IFwiW29iamVjdCBBcnJheV1cIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkYXJyYXkgPSBjdXIgYXMgQXJyYXk8YW55PjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gb2xkYXJyYXkuaW5kZXhPZihldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkYXJyYXkucHVzaChldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRhcnJheS5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIHNldFZhbHVlKHZub2RlOiBWTm9kZSwgbmV3dmFsdWU6IGFueSkge1xuICAgIC8vc2VsZWN05o6n5Lu2XG4gICAgaWYgKHZub2RlLk5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJzZWxlY3RcIikge1xuICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gbmV3dmFsdWVcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vdGV4dCByYWRpbyBjaGVja2JveOaOp+S7tlxuICAgIGxldCBpbnB1dFR5cGUgPSAodm5vZGUuRG9tIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpXG4gICAgaWYgKGlucHV0VHlwZSA9PSBudWxsIHx8IGlucHV0VHlwZSA9PSBcIlwiKVxuICAgICAgICBpbnB1dFR5cGUgPSBcInRleHRcIlxuICAgIHN3aXRjaCAoaW5wdXRUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gbmV3dmFsdWVcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJyYWRpb1wiOlxuICAgICAgICAgICAgaWYgKCh2bm9kZS5Eb20gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPT0gbmV3dmFsdWUpIHtcbiAgICAgICAgICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxuICAgICAgICAgICAgaWYgKHRvU3RyaW5nLmNhbGwobmV3dmFsdWUpID09IFwiW29iamVjdCBBcnJheV1cIikge1xuICAgICAgICAgICAgICAgIGlmIChuZXd2YWx1ZS5pbmRleE9mKCh2bm9kZS5Eb20gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICh2bm9kZS5Eb20gYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICh2bm9kZS5Eb20gYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxufSIsImltcG9ydCB7UkVHX0VWRU5ULCBSRUdfU1RSfSBmcm9tIFwiLi4vY29uc3RcIlxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi4vdm5vZGUvdm5vZGVcIjtcbmV4cG9ydCBmdW5jdGlvbiBPbkNsaWNrKGRpcjpzdHJpbmcsdm5vZGU6Vk5vZGUpe1xuICAgIGlmIChSRUdfRVZFTlQudGVzdChkaXIpKSB7XG4gICAgICAgIGxldCBtZXRob2RTdHIgPSBSZWdFeHAuJDFcbiAgICAgICAgbGV0IHBhcmFtc1N0ciA9IFJlZ0V4cC4kMlxuICAgICAgICBpZiAocGFyYW1zU3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwcyA9IHBhcmFtc1N0ci5zcGxpdChcIixcIilcbiAgICAgICAgICAgIHZub2RlLkRvbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwYXJhbXM6IGFueVtdID0gW11cbiAgICAgICAgICAgICAgICBwcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIVJFR19TVFIudGVzdChwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2godHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwID09PSBcImZhbHNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuID0gbmV3IE51bWJlcihwKS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4obikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChuLnZhbHVlT2YoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ogq/lrprmmK/mnKzlnLDlj5jph49cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaCh2bm9kZS5tdnZtLkdldEV4cFZhbHVlKHApKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goUmVnRXhwLiQyKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB2bm9kZS5tdnZtLlJldm9rZU1ldGhvZChtZXRob2RTdHIsIC4uLnBhcmFtcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdm5vZGUuRG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdm5vZGUubXZ2bS5SZXZva2VNZXRob2QobWV0aG9kU3RyKSAgXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IFJlZ2lzdGVyQ29tcG9uZW50LCBTdGFydCB9IGZyb20gXCIuL21hbmFnZXIvY29tcG9uZW50cy1tYW5hZ2VyXCI7XG5pbXBvcnQgeyBDb21wb25lbnRPcHRpb24sIERpcmVjdGl2ZU9wdGlvbiB9IGZyb20gXCIuL21vZGVsc1wiO1xuaW1wb3J0IHsgUmVnaXN0ZXJEaXJlY3RpdmUgfSBmcm9tIFwiLi9tYW5hZ2VyL2RpcmVjdGl2ZS1tYW5hZ2VyXCI7XG4oPGFueT53aW5kb3cpLlJpbz17XG4gICAgY29tcG9uZW50OmZ1bmN0aW9uKG5hbWU6c3RyaW5nLG9wdGlvbjpDb21wb25lbnRPcHRpb24sbmFtZXNwYWNlOnN0cmluZyl7XG4gICAgICAgIG9wdGlvbi4kbmFtZT1uYW1lXG4gICAgICAgIGlmKG5hbWVzcGFjZSE9bnVsbClcbiAgICAgICAgICAgIG9wdGlvbi4kbmFtZXNwYWNlPW5hbWVzcGFjZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBvcHRpb24uJG5hbWVzcGFjZT1cImRlZmF1bHRcIlxuICAgICAgICBSZWdpc3RlckNvbXBvbmVudChvcHRpb24pXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICBkaXJlY3RpdmU6ZnVuY3Rpb24obmFtZTpzdHJpbmcsb3B0aW9uOkRpcmVjdGl2ZU9wdGlvbixuYW1lc3BhY2U6c3RyaW5nKXtcbiAgICAgICAgb3B0aW9uLiRuYW1lPW5hbWVcbiAgICAgICAgaWYobmFtZXNwYWNlIT1udWxsKVxuICAgICAgICAgICAgb3B0aW9uLiRuYW1lc3BhY2U9bmFtZXNwYWNlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9wdGlvbi4kbmFtZXNwYWNlPVwiZGVmYXVsdFwiXG4gICAgICAgIFJlZ2lzdGVyRGlyZWN0aXZlKG9wdGlvbilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIG5hbWVzcGFjZTpmdW5jdGlvbihuYW1lc3BhY2U6c3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBvbmVudDpmdW5jdGlvbihuYW1lOnN0cmluZyxvcHRpb246Q29tcG9uZW50T3B0aW9uKXtcbiAgICAgICAgICAgICAgICAoPGFueT53aW5kb3cpLlJpby5jb21wb25lbnQobmFtZSxvcHRpb24sbmFtZXNwYWNlKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlyZWN0aXZlOmZ1bmN0aW9uKG5hbWU6c3RyaW5nLG9wdGlvbjpEaXJlY3RpdmVPcHRpb24pe1xuICAgICAgICAgICAgICAgICg8YW55PndpbmRvdykuUmlvLmRpcmVjdGl2ZShuYW1lLG9wdGlvbixuYW1lc3BhY2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24oKXtcbiAgICBTdGFydCgpXG59KSIsImltcG9ydCB7IFZEb20gfSBmcm9tICcuLy4uL3Zkb20vdmRvbSc7XG5pbXBvcnQgeyBDb21wb25lbnRPcHRpb24gfSBmcm9tIFwiLi4vbW9kZWxzXCI7XG5pbXBvcnQgeyBNVlZNIH0gZnJvbSBcIi4uL212dm0vbXZ2bVwiO1xuaW1wb3J0IHsgQ3VzdG9tTm9kZSB9IGZyb20gXCIuLi92bm9kZS9jdXN0b20tbm9kZVwiO1xuaW1wb3J0IHsgVHJhdmVyc2VEb20gfSBmcm9tIFwiLi4vdmRvbS92ZG9tXCI7XG5pbXBvcnQgeyBHZXROUywgSHR0cEdldCwgTG9nRXJyb3IsIElzU3RyaW5nRW1wdHkgfSBmcm9tIFwiLi4vdXRpbFwiO1xuXG5sZXQgcm9vdHM6e29wdGlvbjpDb21wb25lbnRPcHRpb24sZG9tOk5vZGV9W109W11cbmxldCBuYW1lc3BhY2VzOntbbmFtZXNwYWNlOnN0cmluZ106e1tjb21wb25lbnQ6c3RyaW5nXTpDb21wb25lbnRPcHRpb259fT17XG4gICAgXCJkZWZhdWx0XCI6e1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBTdGFydCgpe1xuICAgIGZpcnN0UmVuZGVyKGRvY3VtZW50LmJvZHkpXG4gICAgcm9vdHMuZm9yRWFjaChyb290PT57XG4gICAgICAgIGxldCBkb210cmVlPVRyYXZlcnNlRG9tKHJvb3QuZG9tKVxuXG4gICAgICAgIGxldCBtb3VudG12dm09bmV3IE1WVk0ocm9vdC5vcHRpb24pXG4gICAgICAgIGxldCBjdXN0bm9kZT1uZXcgQ3VzdG9tTm9kZShkb210cmVlLG51bGwsbnVsbCxtb3VudG12dm0pXG4gICAgICAgIGN1c3Rub2RlLlBhcnNlVGVtcGxhdGUoKVxuICAgICAgICBtb3VudG12dm0uJEZlbmNlTm9kZT1jdXN0bm9kZVxuICAgICAgICBjdXN0bm9kZS5BdHRhY2hEb20oKVxuICAgICAgICBsZXQgY29udGVudD1tb3VudG12dm0uUmVuZGVyKClcbiAgICAgICAgcm9vdC5kb20ucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQoY29udGVudCxyb290LmRvbSlcbiAgICB9KVxufVxuZnVuY3Rpb24gZmlyc3RSZW5kZXIoZG9tOkhUTUxFbGVtZW50KXtcbiAgICBsZXQgbnM9R2V0TlMoZG9tLm5vZGVOYW1lKVxuICAgIGlmKElzQ29tcG9uZW50UmVnaXN0ZXJlZChucy52YWx1ZSxucy5uYW1lc3BhY2V8fFwiZGVmYXVsdFwiKSl7XG4gICAgICAgIGxldCBjb21wb25lbnQ9R2V0Q29tcG9uZW50KG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8XCJkZWZhdWx0XCIpXG4gICAgICAgIHJvb3RzLnB1c2goe29wdGlvbjpjb21wb25lbnQsZG9tOmRvbX0pXG4gICAgfWVsc2V7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZG9tLmNoaWxkcmVuLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbGV0IGNoaWxkPWRvbS5jaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudFxuICAgICAgICAgICAgZmlyc3RSZW5kZXIoY2hpbGQpXG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gUmVnaXN0ZXJDb21wb25lbnQob3B0aW9uOkNvbXBvbmVudE9wdGlvbil7XG4gICAgY2hlY2tPcHRpb24ob3B0aW9uKVxuICAgIG9wdGlvbi5kYXRhPW9wdGlvbi5kYXRhfHx7fVxuICAgIG9wdGlvbi5ldmVudHM9b3B0aW9uLmV2ZW50c3x8W11cbiAgICBvcHRpb24ubWV0aG9kcz1vcHRpb24ubWV0aG9kc3x8e31cbiAgICBvcHRpb24ucHJvcHM9b3B0aW9uLnByb3BzfHxbXVxuICAgIG9wdGlvbi4kbmFtZT1vcHRpb24uJG5hbWV8fFwiXCJcbiAgICBvcHRpb24uY29tcHV0ZWQ9b3B0aW9uLmNvbXB1dGVkfHx7fVxuICAgIGlmKG5hbWVzcGFjZXNbb3B0aW9uLiRuYW1lc3BhY2VdPT1udWxsKVxuICAgICAgICBuYW1lc3BhY2VzW29wdGlvbi4kbmFtZXNwYWNlXT17fVxuICAgIGxldCBjb21wb25lbnRzPW5hbWVzcGFjZXNbb3B0aW9uLiRuYW1lc3BhY2VdXG4gICAgY29tcG9uZW50c1tvcHRpb24uJG5hbWVdPW9wdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gR2V0Q29tcG9uZW50KG5hbWU6c3RyaW5nLG5hbWVzcGFjZTpzdHJpbmcpOkNvbXBvbmVudE9wdGlvbntcbiAgICBuYW1lPW5hbWUudG9Mb3dlckNhc2UoKVxuICAgIG5hbWVzcGFjZT1uYW1lc3BhY2UudG9Mb3dlckNhc2UoKVxuICAgIGxldCBvcHRpb249bmFtZXNwYWNlc1tuYW1lc3BhY2VdICYmIG5hbWVzcGFjZXNbbmFtZXNwYWNlXVtuYW1lXVxuICAgIGlmKG9wdGlvbiAmJiBvcHRpb24uJGlkPT1udWxsKVxuICAgICAgICBwcmVUcmVhdG1lbnQob3B0aW9uKVxuICAgIHJldHVybiBvcHRpb25cbn1cbmV4cG9ydCBmdW5jdGlvbiBJc0NvbXBvbmVudFJlZ2lzdGVyZWQobmFtZTpzdHJpbmcsbmFtZXNwYWNlOnN0cmluZyl7XG4gICAgbmFtZT1uYW1lLnRvTG93ZXJDYXNlKClcbiAgICBuYW1lc3BhY2U9bmFtZXNwYWNlLnRvTG93ZXJDYXNlKClcbiAgICBpZihuYW1lc3BhY2VzW25hbWVzcGFjZV0gJiYgbmFtZXNwYWNlc1tuYW1lc3BhY2VdW25hbWVdKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG59XG5mdW5jdGlvbiBwcmVUcmVhdG1lbnQob3B0aW9uOkNvbXBvbmVudE9wdGlvbil7XG4gICAgLy/llK/kuIDmoIfor4ZcbiAgICBvcHRpb24uJGlkPW9wdGlvbi4kbmFtZXNwYWNlK1wiX1wiK29wdGlvbi4kbmFtZVxuICAgIC8v5qih54mIXG4gICAgaWYob3B0aW9uLnRlbXBsYXRlVXJsIT1udWxsKXtcbiAgICAgICAgb3B0aW9uLnRlbXBsYXRlPUh0dHBHZXQob3B0aW9uLnRlbXBsYXRlVXJsKVxuICAgICAgICBpZihvcHRpb24udGVtcGxhdGU9PW51bGwpe1xuICAgICAgICAgICAgTG9nRXJyb3IoXCJwYXRoIFwiK29wdGlvbi50ZW1wbGF0ZVVybCtcIiBub3QgZm91bmRcIilcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGxldCBkb209KG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKG9wdGlvbi50ZW1wbGF0ZSxcInRleHQvaHRtbFwiKS5ib2R5LmNoaWxkcmVuWzBdXG4gICAgb3B0aW9uLiRkb210cmVlPVRyYXZlcnNlRG9tKGRvbSlcbiAgICAvL+agt+W8j1xuICAgIGlmKG9wdGlvbi5zdHlsZVVybCE9bnVsbCl7XG4gICAgICAgIG9wdGlvbi5zdHlsZT1IdHRwR2V0KG9wdGlvbi5zdHlsZVVybClcbiAgICB9XG4gICAgaWYob3B0aW9uLnN0eWxlIT1udWxsKXtcbiAgICAgICAgbGV0IGNzcz1vcHRpb24uc3R5bGUucmVwbGFjZSgvKD8hXFxzKShbXlxce1xcfV0rKSg/PVxce1teXFx7XFx9XSpcXH0pL2csZnVuY3Rpb24oc3RyKXtcbiAgICAgICAgICAgIHJldHVybiBzdHIrXCJbXCIrb3B0aW9uLiRpZCtcIl1cIlxuICAgICAgICB9KVxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gY3NzO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgYWRkQXR0cihvcHRpb24uJGRvbXRyZWUsb3B0aW9uLiRpZClcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRBdHRyKGRvbTpWRG9tLGF0dHI6c3RyaW5nKXtcbiAgICBkb20uQWRkQXR0cihhdHRyKVxuICAgIGlmKGRvbS5Ob2RlVHlwZT09MSl7XG4gICAgICAgIGRvbS5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkPT57XG4gICAgICAgICAgICBhZGRBdHRyKGNoaWxkLGF0dHIpXG4gICAgICAgIH0pXG4gICAgfVxufVxuZnVuY3Rpb24gY2hlY2tPcHRpb24ob3B0aW9uOkNvbXBvbmVudE9wdGlvbil7XG4gICAgaWYoSXNTdHJpbmdFbXB0eShvcHRpb24uJG5hbWUpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjb21wb25lbnQgbmFtZSBzaG91bGQgbm90IGJlIG51bGxcIilcbiAgICBpZihJc1N0cmluZ0VtcHR5KG9wdGlvbi50ZW1wbGF0ZSkgJiYgSXNTdHJpbmdFbXB0eShvcHRpb24udGVtcGxhdGVVcmwpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjb21wb25lbnQgdGVtcGxhdGUgc2hvdWxkIG5vdCBiZSBudWxsXCIpXG4gICAgaWYobmFtZXNwYWNlc1tvcHRpb24uJG5hbWVzcGFjZV0gJiYgbmFtZXNwYWNlc1tvcHRpb24uJG5hbWVzcGFjZV1bb3B0aW9uLiRuYW1lXSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tcG9uZW50IFwiK29wdGlvbi4kbmFtZSArXCIgaGFzIGFscmVhZHkgZXhpc3RcIilcbn0iLCJpbXBvcnQgeyBEaXJlY3RpdmVPcHRpb24gfSBmcm9tIFwiLi4vbW9kZWxzXCI7XG5pbXBvcnQgeyBJc1N0cmluZ0VtcHR5IH0gZnJvbSBcIi4uL3V0aWxcIjtcblxubGV0IG5hbWVzcGFjZXM6e1tuYW1lc3BhY2U6c3RyaW5nXTp7W2RpcmVjdGl2ZTpzdHJpbmddOkRpcmVjdGl2ZU9wdGlvbn19PXtcbiAgICBcImRlZmF1bHRcIjp7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVnaXN0ZXJEaXJlY3RpdmUob3B0aW9uOkRpcmVjdGl2ZU9wdGlvbil7XG4gICAgY2hlY2tPcHRpb24ob3B0aW9uKVxuICAgIG9wdGlvbi5kYXRhPW9wdGlvbi5kYXRhfHx7fVxuICAgIG9wdGlvbi5ldmVudHM9b3B0aW9uLmV2ZW50c3x8W11cbiAgICBvcHRpb24ubWV0aG9kcz1vcHRpb24ubWV0aG9kc3x8e31cbiAgICBvcHRpb24ucHJvcHM9b3B0aW9uLnByb3BzfHxbXVxuICAgIGlmKG5hbWVzcGFjZXNbb3B0aW9uLiRuYW1lc3BhY2VdPT1udWxsKVxuICAgICAgICBuYW1lc3BhY2VzW29wdGlvbi4kbmFtZXNwYWNlXT17fVxuICAgIGxldCBkaXJlY3RpdmVzPW5hbWVzcGFjZXNbb3B0aW9uLiRuYW1lc3BhY2VdXG4gICAgZGlyZWN0aXZlc1tvcHRpb24uJG5hbWVdPW9wdGlvblxufVxuZXhwb3J0IGZ1bmN0aW9uIEdldERpcmVjdGl2ZShuYW1lOnN0cmluZyxuYW1lc3BhY2U6c3RyaW5nKTpEaXJlY3RpdmVPcHRpb257XG4gICAgbmFtZT1uYW1lLnRvTG93ZXJDYXNlKClcbiAgICBuYW1lc3BhY2U9bmFtZXNwYWNlLnRvTG93ZXJDYXNlKClcbiAgICBsZXQgb3B0aW9uPW5hbWVzcGFjZXNbbmFtZXNwYWNlXSAmJiBuYW1lc3BhY2VzW25hbWVzcGFjZV1bbmFtZV1cbiAgICByZXR1cm4gb3B0aW9uXG59XG5leHBvcnQgZnVuY3Rpb24gSXNEaXJlY3RpdmVSZWdpc3RlcmVkKG5hbWU6c3RyaW5nLG5hbWVzcGFjZTpzdHJpbmcpe1xuICAgIG5hbWU9bmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgbmFtZXNwYWNlPW5hbWVzcGFjZS50b0xvd2VyQ2FzZSgpXG4gICAgaWYobmFtZXNwYWNlc1tuYW1lc3BhY2VdICYmIG5hbWVzcGFjZXNbbmFtZXNwYWNlXVtuYW1lXSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZVxufVxuZnVuY3Rpb24gY2hlY2tPcHRpb24ob3B0aW9uOkRpcmVjdGl2ZU9wdGlvbil7XG4gICAgaWYoSXNTdHJpbmdFbXB0eShvcHRpb24uJG5hbWUpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkaXJlY3RpdmUgbmFtZSBzaG91bGQgbm90IGJlIG51bGxcIilcbiAgICBpZihuYW1lc3BhY2VzW29wdGlvbi4kbmFtZXNwYWNlXSAmJiBuYW1lc3BhY2VzW29wdGlvbi4kbmFtZXNwYWNlXVtvcHRpb24uJG5hbWVdKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkaXJlY3RpdmUgXCIrb3B0aW9uLiRuYW1lICtcIiBoYXMgYWxyZWFkeSBleGlzdFwiKVxufSIsImltcG9ydCB7IFZEb20gfSBmcm9tICcuL3Zkb20vdmRvbSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50T3B0aW9ue1xuICAgICRuYW1lPzpzdHJpbmcsXG4gICAgdGVtcGxhdGU/OnN0cmluZyxcbiAgICB0ZW1wbGF0ZVVybD86c3RyaW5nLFxuICAgIGRhdGE/Ok9iamVjdCxcbiAgICBtZXRob2RzPzp7W25hbWU6c3RyaW5nXTpGdW5jdGlvbn0sXG4gICAgcHJvcHM/OlByb3BbXSxcbiAgICBldmVudHM/OnN0cmluZ1tdLFxuICAgIHN0eWxlPzpzdHJpbmcsXG4gICAgc3R5bGVVcmw/OnN0cmluZyxcbiAgICAkbmFtZXNwYWNlPzpzdHJpbmcsXG4gICAgJGlkPzpzdHJpbmcsXG4gICAgJGRvbXRyZWU/OlZEb20sXG4gICAgY29tcHV0ZWQ/OntbbmFtZTpzdHJpbmddOigpPT5hbnl9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcHtcbiAgICBuYW1lOnN0cmluZ1xuICAgIHJlcXVpcmVkOmJvb2xlYW5cbiAgICB0eXBlPzpcImFycmF5XCJ8XCJvYmplY3RcInxcIm51bWJlclwifFwic3RyaW5nXCJ8XCJib29sZWFuXCJcbn1cbmV4cG9ydCBpbnRlcmZhY2UgT25EYXRhQ2hhbmdlIHtcbiAgICAobmV3dmFsdWU6YW55LG9sZHZhbHVlOmFueSk6dm9pZFxufVxuLyoqZm9y6K+t5Y+lICovXG5leHBvcnQgY2xhc3MgRm9yRXhwe1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpdGVtRXhwOnN0cmluZyxwdWJsaWMgYXJyYXlFeHA6c3RyaW5nKXt9XG59XG5cbi8qKui/lOWbnuWAvCAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXR1cmVWYWx1ZXtcbiAgICBleHA6c3RyaW5nLFxuICAgIGRhdGE6YW55XG59XG5leHBvcnQgaW50ZXJmYWNlIERpcmVjdGl2ZU9wdGlvbntcbiAgICAkbmFtZTpzdHJpbmdcbiAgICAkbmFtZXNwYWNlOnN0cmluZ1xuICAgIGRhdGE/Ok9iamVjdFxuICAgIG1ldGhvZHM/OntbbmFtZTpzdHJpbmddOkZ1bmN0aW9ufVxuICAgIHByb3BzPzpQcm9wW11cbiAgICBldmVudHM/OnN0cmluZ1tdXG59XG5cbiIsImltcG9ydCB7IE9ic2VydmUgfSBmcm9tICcuLy4uL29ic2VydmVyL29ic2VydmUnO1xuaW1wb3J0IHsgUHJvcCB9IGZyb20gXCIuLi9tb2RlbHNcIjtcbmltcG9ydCB7IERpcmVjdGl2ZU9wdGlvbiwgT25EYXRhQ2hhbmdlIH0gZnJvbSAnLi8uLi9tb2RlbHMnO1xuaW1wb3J0IHsgRGlyZWN0aXZlIH0gZnJvbSBcIi4uL3Zub2RlL2RpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi4vdm5vZGUvdm5vZGVcIjtcbmV4cG9ydCBjbGFzcyBEaXJlY3RpdmVNVlZNIHtcbiAgICBcbiAgICBwcml2YXRlICRkYXRhOmFueVxuICAgIHByaXZhdGUgJG1ldGhvZHM6e1tuYW1lOnN0cmluZ106RnVuY3Rpb259PXt9XG4gICAgcHJpdmF0ZSAkbmFtZTpzdHJpbmdcbiAgICAkZWxlbWVudDpIVE1MRWxlbWVudFxuXG4gICAgJEluczpQcm9wW109W11cbiAgICAkT3V0czpzdHJpbmdbXT1bXVxuICAgICRvYnNlcnZlOk9ic2VydmVcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbjpEaXJlY3RpdmVPcHRpb24scHJpdmF0ZSAkZGlyZWN0aXZlOkRpcmVjdGl2ZSxwcml2YXRlICR2bm9kZTpWTm9kZSl7XG4gICAgICAgIGlmKG9wdGlvbi5kYXRhIT1udWxsKVxuICAgICAgICAgICAgdGhpcy4kZGF0YT1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9wdGlvbi5kYXRhKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy4kZGF0YT17fVxuICAgICAgICB0aGlzLiRtZXRob2RzPW9wdGlvbi5tZXRob2RzICB8fHt9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGhpcy4kSW5zPW9wdGlvbi5wcm9wcyB8fCBbXVxuICAgICAgICB0aGlzLiRPdXRzPW9wdGlvbi5ldmVudHMgfHwgW11cblxuICAgICAgICB0aGlzLnByb3h5RGF0YSgpXG4gICAgICAgIHRoaXMucHJveHlNZXRob2QoKVxuXG4gICAgICAgIHRoaXMuJG9ic2VydmU9bmV3IE9ic2VydmUodGhpcylcbiAgICAgICAgXG4gICAgfVxuICAgIHByaXZhdGUgcHJveHlEYXRhKCl7XG4gICAgICAgIGZvcihsZXQga2V5IGluIHRoaXMuJGRhdGEpe1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsa2V5LHtcbiAgICAgICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGRhdGFba2V5XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OmZ1bmN0aW9uKG5ld3ZhbCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFba2V5XT1uZXd2YWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgcHJveHlNZXRob2QoKXtcbiAgICAgICAgZm9yKGxldCBrZXkgaW4gdGhpcy4kbWV0aG9kcyl7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxrZXkse1xuICAgICAgICAgICAgICAgIGdldDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kbWV0aG9kc1trZXldXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBcbiAgICAkb25kZXN0cm95KCl7XG4gICAgICAgIGlmKHRoaXMuJG1ldGhvZHNbXCIkZGVzdHJveVwiXSE9bnVsbCl7XG4gICAgICAgICAgICB0aGlzLiRtZXRob2RzW1wiJGRlc3Ryb3lcIl0oKVxuICAgICAgICB9XG4gICAgfVxuICAgICR3YXRjaChleHA6c3RyaW5nfEZ1bmN0aW9uLGNiOk9uRGF0YUNoYW5nZSl7XG4gICAgICAgIHRoaXMuJG9ic2VydmUuQWRkV2F0Y2hlcih0aGlzLiR2bm9kZSxleHAsY2IpXG4gICAgfVxuICAgIFJlbmRlcigpe1xuICAgICAgICB0aGlzLiRlbGVtZW50PSh0aGlzLiR2bm9kZS5Eb20gYXMgSFRNTEVsZW1lbnQpXG4gICAgICAgIHRoaXMuJElucy5mb3JFYWNoKHByb3A9PntcbiAgICAgICAgICAgIGxldCBpbk5hbWU9dGhpcy4kZGlyZWN0aXZlLkdldEluKHByb3AubmFtZSlcbiAgICAgICAgICAgIGlmKGluTmFtZT09bnVsbCAmJiBwcm9wLnJlcXVpcmVkKXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjb21wb25lbnQgXFwnXCIrdGhpcy4kbmFtZStcIlxcJyBuZWVkIHByb3AgXFwnXCIrcHJvcC5uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoaW5OYW1lIT1udWxsKXtcbiAgICAgICAgICAgICAgICB0aGlzLiR2bm9kZS5tdnZtLiR3YXRjaCh0aGlzLiR2bm9kZSxpbk5hbWUsKG5ld3ZhbHVlOmFueSxvbGR2YWx1ZTphbnkpPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGNoZWNrUHJvcChwcm9wLG5ld3ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtwcm9wLm5hbWVdPW5ld3ZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy4kb2JzZXJ2ZS5SZWFjdGl2ZUtleSh0aGlzLHByb3AubmFtZSx0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBpZih0aGlzLiRtZXRob2RzICYmIHRoaXMuJG1ldGhvZHMuJGluaXQpe1xuICAgICAgICAgICAgdGhpcy4kbWV0aG9kcy4kaW5pdC5jYWxsKHRoaXMpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSAkY2hlY2tQcm9wKHByb3A6UHJvcCx2YWx1ZTphbnkpe1xuICAgICAgICBsZXQgZXJyb3I9KG5hbWU6c3RyaW5nLHByb3A6c3RyaW5nLHR5cGU6c3RyaW5nKT0+e1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tcG9uZW50IFxcJ1wiK25hbWUrXCJcXCcgcHJvcCBcXCdcIitwcm9wK1wiXFwnIG5vdCByZWNlaXZlIFwiK3R5cGUpXG4gICAgICAgIH1cbiAgICAgICAgaWYocHJvcC50eXBlPT1cImFycmF5XCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICBlcnJvcih0aGlzLiRuYW1lLHByb3AubmFtZSxwcm9wLnR5cGUpXG4gICAgICAgIH1cbiAgICAgICAgaWYocHJvcC50eXBlPT1cIm9iamVjdFwiICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpIT1cIltvYmplY3QgT2JqZWN0XVwiKXtcbiAgICAgICAgICAgIGVycm9yKHRoaXMuJG5hbWUscHJvcC5uYW1lLHByb3AudHlwZSlcbiAgICAgICAgfVxuICAgICAgICBpZihwcm9wLnR5cGU9PVwibnVtYmVyXCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBOdW1iZXJdXCIpe1xuICAgICAgICAgICAgZXJyb3IodGhpcy4kbmFtZSxwcm9wLm5hbWUscHJvcC50eXBlKVxuICAgICAgICB9XG4gICAgICAgIGlmKHByb3AudHlwZT09XCJib29sZWFuXCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBCb29sZWFuXVwiKXtcbiAgICAgICAgICAgIGVycm9yKHRoaXMuJG5hbWUscHJvcC5uYW1lLHByb3AudHlwZSlcbiAgICAgICAgfVxuICAgICAgICBpZihwcm9wLnR5cGU9PVwic3RyaW5nXCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBTdHJpbmddXCIpe1xuICAgICAgICAgICAgZXJyb3IodGhpcy4kbmFtZSxwcm9wLm5hbWUscHJvcC50eXBlKVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IENvbXBvbmVudE9wdGlvbiwgUHJvcCB9IGZyb20gXCIuLi9tb2RlbHNcIjtcbmltcG9ydCB7IEN1c3RvbU5vZGUgfSBmcm9tIFwiLi4vdm5vZGUvY3VzdG9tLW5vZGVcIjtcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4uL3Zub2RlL3Zub2RlXCI7XG5pbXBvcnQgeyBPbkRhdGFDaGFuZ2UgfSBmcm9tICcuLy4uL21vZGVscyc7XG5pbXBvcnQgeyBWRG9tIH0gZnJvbSAnLi8uLi92ZG9tL3Zkb20nO1xuaW1wb3J0IHsgUmV2b2tlRXZlbnQgfSBmcm9tICcuL3Jldm9rZS1ldmVudCc7XG5pbXBvcnQgeyBPYnNlcnZlIH0gZnJvbSBcIi4uL29ic2VydmVyL29ic2VydmVcIjtcbmV4cG9ydCBjbGFzcyBNVlZNIHtcbiAgICAkRmVuY2VOb2RlOkN1c3RvbU5vZGVcbiAgICAkVHJlZVJvb3Q6Vk5vZGVcbiAgICBcbiAgICBwcml2YXRlICRkYXRhOmFueVxuICAgIHByaXZhdGUgJG1ldGhvZHM6e1tuYW1lOnN0cmluZ106RnVuY3Rpb259PXt9XG4gICAgcHJpdmF0ZSAkdGVtcGxhdGU6c3RyaW5nXG4gICAgcHJpdmF0ZSAkZG9tdHJlZTpWRG9tXG4gICAgcHJpdmF0ZSAkY29tcHV0ZWQ6e1tuYW1lOnN0cmluZ106KCk9PmFueX09e31cblxuICAgICROYW1lc3BhY2U6c3RyaW5nXG4gICAgJEluczpQcm9wW109W11cbiAgICAkT3V0czpzdHJpbmdbXT1bXVxuICAgIHByaXZhdGUgJG9ic2VydmU6T2JzZXJ2ZVxuICAgIHByaXZhdGUgJG5hbWU6c3RyaW5nPVwiXCJcbiAgICBwcml2YXRlIGhpcmVudGVkPWZhbHNlICAgIFxuXG4gICAgY29uc3RydWN0b3Iob3B0aW9uOkNvbXBvbmVudE9wdGlvbil7XG4gICAgICAgIHRoaXMuJGRhdGE9SlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvcHRpb24uZGF0YSkpXG4gICAgICAgIHRoaXMuJG1ldGhvZHM9b3B0aW9uLm1ldGhvZHNcbiAgICAgICAgdGhpcy4kbmFtZT1vcHRpb24uJG5hbWVcbiAgICAgICAgdGhpcy4kY29tcHV0ZWQ9b3B0aW9uLmNvbXB1dGVkXG5cbiAgICAgICAgdGhpcy4kdGVtcGxhdGU9b3B0aW9uLnRlbXBsYXRlXG4gICAgICAgIHRoaXMuJE5hbWVzcGFjZT1vcHRpb24uJG5hbWVzcGFjZVxuICAgICAgICB0aGlzLiRkb210cmVlPW9wdGlvbi4kZG9tdHJlZVxuXG5cbiAgICAgICAgaWYob3B0aW9uLm1ldGhvZHMgJiYgb3B0aW9uLm1ldGhvZHMuJGluaXQpe1xuICAgICAgICAgICAgb3B0aW9uLm1ldGhvZHMuJGluaXQuY2FsbCh0aGlzKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuJElucz1vcHRpb24ucHJvcHNcbiAgICAgICAgdGhpcy4kT3V0cz1vcHRpb24uZXZlbnRzXG5cbiAgICAgICAgdGhpcy4kb2JzZXJ2ZT1uZXcgT2JzZXJ2ZSh0aGlzKVxuICAgICAgICB0aGlzLiRvYnNlcnZlLlJlYWN0aXZlRGF0YSh0aGlzLiRkYXRhKVxuICAgICAgICB0aGlzLnByb3h5RGF0YSgpXG4gICAgICAgIHRoaXMucHJveHlNZXRob2QoKVxuICAgICAgICBcbiAgICB9XG4gICAgcHJpdmF0ZSBwcm94eURhdGEoKXtcbiAgICAgICAgZm9yKGxldCBrZXkgaW4gdGhpcy4kZGF0YSl7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxrZXkse1xuICAgICAgICAgICAgICAgIGdldDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kZGF0YVtrZXldXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQ6ZnVuY3Rpb24obmV3dmFsKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZGF0YVtrZXldPW5ld3ZhbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBwcm94eU1ldGhvZCgpe1xuICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLiRtZXRob2RzKXtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLGtleSx7XG4gICAgICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRtZXRob2RzW2tleV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgcHJveHlDb21wdXRlZCgpe1xuICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLiRjb21wdXRlZCl7XG4gICAgICAgICAgICB0aGlzLiRvYnNlcnZlLldhdGNoQ29tcHV0ZWQodGhpcy4kRmVuY2VOb2RlLGtleSx0aGlzLiRjb21wdXRlZFtrZXldKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIFNldEhpcmVudGVkKGhpcmVudGVkRnJvbVBhcmVudDpib29sZWFuKXtcbiAgICAgICAgdGhpcy5oaXJlbnRlZD1oaXJlbnRlZEZyb21QYXJlbnRcbiAgICB9XG4gICAgR2V0VGVtcGxhdGUoKTpzdHJpbmd7XG4gICAgICAgIHJldHVybiB0aGlzLiR0ZW1wbGF0ZVxuICAgIH1cbiAgICBHZXREb21UcmVlKCk6VkRvbXtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGRvbXRyZWVcbiAgICB9XG4gICAgUmVuZGVyKCl7XG4gICAgICAgIHRoaXMucHJveHlDb21wdXRlZCgpXG4gICAgICAgIGlmKHRoaXMuaGlyZW50ZWQpe1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy4kRmVuY2VOb2RlLm12dm0uJGRhdGEpLmZvckVhY2goa2V5PT57XG4gICAgICAgICAgICAgICAgdGhpcy4kRmVuY2VOb2RlLm12dm0uJHdhdGNoKHRoaXMuJEZlbmNlTm9kZSxrZXksKG5ld3ZhbHVlOmFueSxvbGR2YWx1ZTphbnkpPT57XG4gICAgICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSlba2V5XT1uZXd2YWx1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgdGhpcy4kb2JzZXJ2ZS5SZWFjdGl2ZUtleSh0aGlzLGtleSx0cnVlKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy4kRmVuY2VOb2RlLm12dm0uJGNvbXB1dGVkKS5mb3JFYWNoKGtleT0+e1xuICAgICAgICAgICAgICAgIHRoaXMuJEZlbmNlTm9kZS5tdnZtLiR3YXRjaCh0aGlzLiRGZW5jZU5vZGUsa2V5LChuZXd2YWx1ZTphbnksb2xkdmFsdWU6YW55KT0+e1xuICAgICAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpW2tleV09bmV3dmFsdWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHRoaXMuJG9ic2VydmUuUmVhY3RpdmVLZXkodGhpcyxrZXksdHJ1ZSkgICAgICBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kSW5zLmZvckVhY2gocHJvcD0+e1xuICAgICAgICAgICAgbGV0IGluTmFtZT10aGlzLiRGZW5jZU5vZGUuR2V0SW4ocHJvcC5uYW1lKVxuICAgICAgICAgICAgaWYoaW5OYW1lPT1udWxsICYmIHByb3AucmVxdWlyZWQpe1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvbXBvbmVudCBcXCdcIit0aGlzLiRuYW1lK1wiXFwnIG5lZWQgcHJvcCBcXCdcIitwcm9wLm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihpbk5hbWUhPW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMuJEZlbmNlTm9kZS5tdnZtLiR3YXRjaCh0aGlzLiRGZW5jZU5vZGUsaW5OYW1lLChuZXd2YWx1ZTphbnksb2xkdmFsdWU6YW55KT0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRjaGVja1Byb3AocHJvcCxuZXd2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSlbcHJvcC5uYW1lXT1uZXd2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuJG9ic2VydmUuUmVhY3RpdmVLZXkodGhpcyxwcm9wLm5hbWUsdHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJFRyZWVSb290LlJlbmRlcigpXG4gICAgICAgIHJldHVybiB0aGlzLiRUcmVlUm9vdC5Eb21cbiAgICB9XG4gICAgUmV2b2tlTWV0aG9kKG1ldGhvZDpzdHJpbmcsLi4ucGFyYW1zOmFueVtdKXtcbiAgICAgICAgaWYodGhpcy5oaXJlbnRlZCl7XG4gICAgICAgICAgICB0aGlzLiRGZW5jZU5vZGUubXZ2bS5SZXZva2VNZXRob2QobWV0aG9kLC4uLnBhcmFtcylcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZih0aGlzLiRtZXRob2RzW21ldGhvZF0hPW51bGwpXG4gICAgICAgICAgICAgICAgdGhpcy4kbWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMscGFyYW1zKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIEdldEV4cFZhbHVlKGV4cDpzdHJpbmcpOmFueXtcbiAgICAgICAgcmV0dXJuIHRoaXMuJG9ic2VydmUuR2V0VmFsdWVXaXRoRXhwKGV4cClcbiAgICB9XG4gICAgXG4gICAgU2V0VmFsdWUoZXhwOnN0cmluZyx2YWx1ZTphbnkpe1xuICAgICAgICBsZXQga2V5cz1leHAuc3BsaXQoXCIuXCIpXG4gICAgICAgIGxldCB0YXJnZXQ9dGhpcy4kZGF0YVxuICAgICAgICBsZXQgaGFzVHJhZ2V0PXRydWVcbiAgICAgICAgZm9yKGxldCBpPTA7aTxrZXlzLmxlbmd0aC0xO2krKyl7XG4gICAgICAgICAgICBpZih0YXJnZXQhPW51bGwpXG4gICAgICAgICAgICAgICAgdGFyZ2V0PXRhcmdldFtrZXlzW2ldXVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBoYXNUcmFnZXQ9ZmFsc2VcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGhhc1RyYWdldCAmJiB0YXJnZXQhPW51bGwpXG4gICAgICAgICAgICB0YXJnZXRba2V5c1trZXlzLmxlbmd0aC0xXV09dmFsdWVcbiAgICB9XG4gICAgJGVtaXQoZXZlbnQ6c3RyaW5nLC4uLmRhdGE6YW55W10pe1xuICAgICAgICBpZih0aGlzLiRGZW5jZU5vZGUhPW51bGwgJiYgdGhpcy4kRmVuY2VOb2RlLm12dm0hPW51bGwpe1xuICAgICAgICAgICAgbGV0IG1ldGhvZD10aGlzLiRGZW5jZU5vZGUuR2V0T3V0KGV2ZW50KVxuICAgICAgICAgICAgUmV2b2tlRXZlbnQobWV0aG9kLGRhdGEsdGhpcy4kRmVuY2VOb2RlLm12dm0pXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHB1YmxpYyAkd2F0Y2godm5vZGU6Vk5vZGUsZXhwOnN0cmluZ3xGdW5jdGlvbixsaXN0ZW5lcjpPbkRhdGFDaGFuZ2UsYXJyYXlkZWVwPzpib29sZWFuKXtcbiAgICAgICAgdGhpcy4kb2JzZXJ2ZS5BZGRXYXRjaGVyKHZub2RlLGV4cCxsaXN0ZW5lcixhcnJheWRlZXApXG4gICAgfVxuICAgIFxuICAgICRvbmRlc3Ryb3koKXtcbiAgICAgICAgaWYodGhpcy4kbWV0aG9kc1tcIiRkZXN0cm95XCJdIT1udWxsKXtcbiAgICAgICAgICAgIHRoaXMuJG1ldGhvZHNbXCIkZGVzdHJveVwiXSgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kVHJlZVJvb3QuT25SZW1vdmVkKClcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSAkY2hlY2tQcm9wKHByb3A6UHJvcCx2YWx1ZTphbnkpe1xuICAgICAgICBsZXQgZXJyb3I9KG5hbWU6c3RyaW5nLHByb3A6c3RyaW5nLHR5cGU6c3RyaW5nKT0+e1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tcG9uZW50IFxcJ1wiK25hbWUrXCJcXCcgcHJvcCBcXCdcIitwcm9wK1wiXFwnIG5vdCByZWNlaXZlIFwiK3R5cGUpXG4gICAgICAgIH1cbiAgICAgICAgaWYocHJvcC50eXBlPT1cImFycmF5XCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICBlcnJvcih0aGlzLiRuYW1lLHByb3AubmFtZSxwcm9wLnR5cGUpXG4gICAgICAgIH1cbiAgICAgICAgaWYocHJvcC50eXBlPT1cIm9iamVjdFwiICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpIT1cIltvYmplY3QgT2JqZWN0XVwiKXtcbiAgICAgICAgICAgIGVycm9yKHRoaXMuJG5hbWUscHJvcC5uYW1lLHByb3AudHlwZSlcbiAgICAgICAgfVxuICAgICAgICBpZihwcm9wLnR5cGU9PVwibnVtYmVyXCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBOdW1iZXJdXCIpe1xuICAgICAgICAgICAgZXJyb3IodGhpcy4kbmFtZSxwcm9wLm5hbWUscHJvcC50eXBlKVxuICAgICAgICB9XG4gICAgICAgIGlmKHByb3AudHlwZT09XCJib29sZWFuXCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBCb29sZWFuXVwiKXtcbiAgICAgICAgICAgIGVycm9yKHRoaXMuJG5hbWUscHJvcC5uYW1lLHByb3AudHlwZSlcbiAgICAgICAgfVxuICAgICAgICBpZihwcm9wLnR5cGU9PVwic3RyaW5nXCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBTdHJpbmddXCIpe1xuICAgICAgICAgICAgZXJyb3IodGhpcy4kbmFtZSxwcm9wLm5hbWUscHJvcC50eXBlKVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7UkVHX0VWRU5ULCBSRUdfU1RSfSBmcm9tIFwiLi4vY29uc3RcIlxuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuL212dm1cIjtcbmV4cG9ydCBmdW5jdGlvbiBSZXZva2VFdmVudChtZXRob2Q6c3RyaW5nLGRhdGE6YW55LG12dm06TVZWTSl7XG4gICAgaWYgKFJFR19FVkVOVC50ZXN0KG1ldGhvZCkpIHtcbiAgICAgICAgbGV0IG1ldGhvZFN0ciA9IFJlZ0V4cC4kMVxuICAgICAgICBsZXQgcGFyYW1zU3RyID0gUmVnRXhwLiQyXG4gICAgICAgIGlmIChwYXJhbXNTdHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHBzID0gcGFyYW1zU3RyLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgbGV0IHBhcmFtczogYW55W10gPSBbXVxuICAgICAgICAgICAgcHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIVJFR19TVFIudGVzdChwKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocCA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocCA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKHA9PVwiJGV2ZW50XCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gbmV3IE51bWJlcihwKS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2gobi52YWx1ZU9mKCkpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+iCr+WumuaYr+acrOWcsOWPmOmHj1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2gobXZ2bS5HZXRFeHBWYWx1ZShwKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKFJlZ0V4cC4kMilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgbXZ2bS5SZXZva2VNZXRob2QobWV0aG9kU3RyLCAuLi5wYXJhbXMpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbXZ2bS5SZXZva2VNZXRob2QobWV0aG9kU3RyKSAgXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgV2F0Y2hlciB9IGZyb20gJy4vd2F0Y2hlcic7XG5cbmxldCBxdWV1ZTpXYXRjaGVyW109W11cbmxldCBzZXR0aW1lb3V0PWZhbHNlXG5leHBvcnQgZnVuY3Rpb24gQWRkV2F0Y2hlcih3YXRjaGVyOldhdGNoZXIpe1xuICAgIGlmKHF1ZXVlLmluZGV4T2Yod2F0Y2hlcik9PS0xKVxuICAgICAgICBxdWV1ZS5wdXNoKHdhdGNoZXIpXG4gICAgaWYoIXNldHRpbWVvdXQpe1xuICAgICAgICBzZXR0aW1lb3V0PXRydWVcbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgUmV2b2tlV2F0Y2hlcigpXG4gICAgICAgICAgICBzZXR0aW1lb3V0PWZhbHNlICAgICAgICAgICAgXG4gICAgICAgIH0sIDApO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBSZXZva2VXYXRjaGVyKCl7XG4gICAgbGV0IHRlbXA6V2F0Y2hlcltdPVtdXG4gICAgcXVldWUuZm9yRWFjaChxPT50ZW1wLnB1c2gocSkpXG4gICAgcXVldWU9W11cbiAgICB0ZW1wLmZvckVhY2god2F0Y2hlcj0+d2F0Y2hlci5VcGRhdGUoKSlcbiAgICBpZihxdWV1ZS5sZW5ndGg+MCl7XG4gICAgICAgIFJldm9rZVdhdGNoZXIoKVxuICAgIH1cbn0iLCJpbXBvcnQgeyBWTm9kZSB9IGZyb20gJy4uL3Zub2RlL3Zub2RlJztcbmltcG9ydCB7IE9uRGF0YUNoYW5nZSB9IGZyb20gJy4vLi4vbW9kZWxzJztcbmltcG9ydCB7IFdhdGNoZXIgfSBmcm9tIFwiLi93YXRjaGVyXCI7XG5pbXBvcnQgeyBBZGRXYXRjaGVyIH0gZnJvbSAnLi9tc2ctcXVldWUnO1xuaW1wb3J0IHsgVk5vZGVTdGF0dXMgfSBmcm9tICcuLi9jb25zdCc7XG5cbmRlY2xhcmUgbGV0IEV2YWxFeHA6KGNvbnRleHQ6YW55LGV4cDpzdHJpbmcpPT5hbnlcbmV4cG9ydCBjbGFzcyBPYnNlcnZle1xuICAgIHByaXZhdGUgc3RhdGljIHRhcmdldDpXYXRjaGVyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBkYXRhOmFueSl7fVxuICAgIEdldFZhbHVlKHdhdGNoZXI6V2F0Y2hlcil7XG4gICAgICAgIE9ic2VydmUudGFyZ2V0PXdhdGNoZXJcbiAgICAgICAgbGV0IHJlczphbnlcbiAgICAgICAgaWYodHlwZW9mIHdhdGNoZXIuRXhwT3JGdW5jID09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgcmVzPUV2YWxFeHAodGhpcy5kYXRhLHdhdGNoZXIuRXhwT3JGdW5jKVxuICAgICAgICB9XG4gICAgICAgIGlmKHR5cGVvZiB3YXRjaGVyLkV4cE9yRnVuYyA9PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICByZXM9d2F0Y2hlci5FeHBPckZ1bmMuY2FsbCh0aGlzLmRhdGEpXG4gICAgICAgIH1cbiAgICAgICAgT2JzZXJ2ZS50YXJnZXQ9bnVsbCAgIFxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuICAgIEdldFZhbHVlV2l0aEV4cChleHA6c3RyaW5nKXtcbiAgICAgICAgbGV0IHJlcz1FdmFsRXhwKHRoaXMuZGF0YSxleHApXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG4gICAgXG4gICAgQWRkV2F0Y2hlcih2bm9kZTpWTm9kZSxleHA6c3RyaW5nfEZ1bmN0aW9uLGxpc3RlbmVyOk9uRGF0YUNoYW5nZSxkZWVwPzpib29sZWFuKXtcbiAgICAgICAgbmV3IFdhdGNoZXIodm5vZGUsZXhwLGxpc3RlbmVyLHRoaXMsZGVlcClcbiAgICB9XG4gICAgXG4gICAgUmVhY3RpdmVEYXRhKGRhdGE6YW55KXtcbiAgICAgICAgaWYoZGF0YSE9bnVsbCAmJiB0eXBlb2YgZGF0YT09XCJvYmplY3RcIil7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGtleT0+e1xuICAgICAgICAgICAgICAgIGxldCBkZXBlbmQ9bmV3IERlcGVuZGVyKGtleSlcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZVJlYWN0aXZlKGRhdGEsa2V5LGZhbHNlLGRlcGVuZClcbiAgICAgICAgICAgICAgICB0aGlzLlJlYWN0aXZlRGF0YShkYXRhW2tleV0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIFJlYWN0aXZlS2V5KGRhdGE6YW55LGtleTpzdHJpbmcsc2hhbGxvdzpib29sZWFuKXtcbiAgICAgICAgbGV0IGRlcGVuZD1uZXcgRGVwZW5kZXIoa2V5KSAgICAgICAgXG4gICAgICAgIHRoaXMuZGVmaW5lUmVhY3RpdmUoZGF0YSxrZXksc2hhbGxvdyxkZXBlbmQpXG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgcmVhY3RpdmVBcnJheShhcnJheTphbnlbXSxkZXBlbmQ6RGVwZW5kZXIpe1xuICAgICAgICBpZihhcnJheS5wdXNoIT1BcnJheS5wcm90b3R5cGUucHVzaClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYXJyYXksXCJwdXNoXCIse1xuICAgICAgICAgICAgZW51bWVyYWJsZTpmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlLFxuICAgICAgICAgICAgdmFsdWU6KC4uLnBhcmFtczphbnlbXSk9PntcbiAgICAgICAgICAgICAgICBsZXQgb2xkPWFycmF5Lmxlbmd0aFxuICAgICAgICAgICAgICAgIGxldCByZXM9QXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChhcnJheSwuLi5wYXJhbXMpXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPW9sZDtpPHJlcztpKyspe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlJlYWN0aXZlS2V5KGFycmF5LFwiXCIraSxmYWxzZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVwZW5kLk5vdGlmeSgpICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFycmF5LFwicG9wXCIse1xuICAgICAgICAgICAgZW51bWVyYWJsZTpmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlLFxuICAgICAgICAgICAgdmFsdWU6KC4uLnBhcmFtczphbnlbXSk9PntcbiAgICAgICAgICAgICAgICBsZXQgcmVzPUFycmF5LnByb3RvdHlwZS5wb3AuY2FsbChhcnJheSwuLi5wYXJhbXMpXG4gICAgICAgICAgICAgICAgZGVwZW5kLk5vdGlmeSgpICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFycmF5LFwic3BsaWNlXCIse1xuICAgICAgICAgICAgZW51bWVyYWJsZTpmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlLFxuICAgICAgICAgICAgdmFsdWU6KC4uLnBhcmFtczphbnlbXSk9PntcbiAgICAgICAgICAgICAgICBsZXQgcmVzPUFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbChhcnJheSwuLi5wYXJhbXMpXG4gICAgICAgICAgICAgICAgaWYocGFyYW1zLmxlbmd0aD4yKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld2l0ZW1zPXBhcmFtcy5zbGljZSgyKVxuICAgICAgICAgICAgICAgICAgICBuZXdpdGVtcy5mb3JFYWNoKGl0ZW09PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleD1hcnJheS5pbmRleE9mKGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJlYWN0aXZlS2V5KGFycmF5LFwiXCIraW5kZXgsZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlcGVuZC5Ob3RpZnkoKSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhcnJheSxcInNoaWZ0XCIse1xuICAgICAgICAgICAgZW51bWVyYWJsZTpmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlLFxuICAgICAgICAgICAgdmFsdWU6KC4uLnBhcmFtczphbnlbXSk9PntcbiAgICAgICAgICAgICAgICBsZXQgcmVzPUFycmF5LnByb3RvdHlwZS5zaGlmdC5jYWxsKGFycmF5LC4uLnBhcmFtcylcbiAgICAgICAgICAgICAgICBkZXBlbmQuTm90aWZ5KCkgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBwcml2YXRlIGRlZmluZVJlYWN0aXZlKGRhdGE6YW55LGtleTpzdHJpbmcsc2hhbGxvdzpib29sZWFuLGRlcGVuZDpEZXBlbmRlcil7XG4gICAgICAgIGxldCB2YWx1ZSA9IGRhdGFba2V5XVxuICAgICAgICBpZih0b1N0cmluZy5jYWxsKHZhbHVlKT09XCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgIHRoaXMucmVhY3RpdmVBcnJheSh2YWx1ZSxkZXBlbmQpXG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRhdGEsIGtleSwge1xuICAgICAgICAgICAgZ2V0OiAoKT0+IHtcbiAgICAgICAgICAgICAgICBpZihPYnNlcnZlLnRhcmdldCE9bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZC5BZGRUYXJnZXQoT2JzZXJ2ZS50YXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogKG5ld3ZhbCk9PntcbiAgICAgICAgICAgICAgICBpZiAobmV3dmFsICE9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPW5ld3ZhbFxuICAgICAgICAgICAgICAgICAgICBpZih0b1N0cmluZy5jYWxsKHZhbHVlKT09XCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVhY3RpdmVBcnJheSh2YWx1ZSxkZXBlbmQpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoIXNoYWxsb3cpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJlYWN0aXZlRGF0YShuZXd2YWwpICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kLk5vdGlmeSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6dHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlXG4gICAgICAgIH0pXG4gICAgfVxuICAgIFdhdGNoQ29tcHV0ZWQodm5vZGU6Vk5vZGUsa2V5OnN0cmluZyxmdW5jOigpPT5hbnkpe1xuICAgICAgICBsZXQgZGVwZW5kPW5ldyBEZXBlbmRlcihrZXkpXG4gICAgICAgIGxldCBmaXJzdGdldD10cnVlXG4gICAgICAgIGxldCB2YWx1ZTphbnlcbiAgICAgICAgXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmRhdGEsIGtleSwge1xuICAgICAgICAgICAgZ2V0OiAoKT0+IHtcbiAgICAgICAgICAgICAgICBpZihPYnNlcnZlLnRhcmdldCE9bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZC5BZGRUYXJnZXQoT2JzZXJ2ZS50YXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKGZpcnN0Z2V0KXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZD1PYnNlcnZlLnRhcmdldFxuICAgICAgICAgICAgICAgICAgICBPYnNlcnZlLnRhcmdldD1udWxsXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXYXRjaGVyKHZub2RlLGZ1bmMsKG5ld3ZhbCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPW5ld3ZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kLk5vdGlmeSgpXG4gICAgICAgICAgICAgICAgICAgIH0sdGhpcylcbiAgICAgICAgICAgICAgICAgICAgT2JzZXJ2ZS50YXJnZXQ9b2xkXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0Z2V0PWZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6dHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlXG4gICAgICAgIH0pXG4gICAgfVxuXG59XG5leHBvcnQgY2xhc3MgRGVwZW5kZXJ7XG4gICAgcHJpdmF0ZSB3YXRjaGVzOldhdGNoZXJbXT1bXVxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5OnN0cmluZyl7XG4gICAgfVxuICAgIEdldEtleSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5rZXlcbiAgICB9XG4gICAgQWRkVGFyZ2V0KHdhdGNoZXI6V2F0Y2hlcil7XG4gICAgICAgIGlmKHRoaXMud2F0Y2hlcy5pbmRleE9mKHdhdGNoZXIpPT0tMSlcbiAgICAgICAgICAgIHRoaXMud2F0Y2hlcy5wdXNoKHdhdGNoZXIpXG4gICAgfVxuICAgIE5vdGlmeSgpe1xuICAgICAgICB0aGlzLndhdGNoZXM9dGhpcy53YXRjaGVzLmZpbHRlcih3YXRjaGVyPT57XG4gICAgICAgICAgICBpZih3YXRjaGVyLkdldFZOb2RlKCkuR2V0U3RhdHVzKCk9PVZOb2RlU3RhdHVzLkFDVElWRSApe1xuICAgICAgICAgICAgICAgIEFkZFdhdGNoZXIod2F0Y2hlcilcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYod2F0Y2hlci5HZXRWTm9kZSgpLkdldFN0YXR1cygpPT1WTm9kZVN0YXR1cy5JTkFDVElWRSApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIGlmKHdhdGNoZXIuR2V0Vk5vZGUoKS5HZXRTdGF0dXMoKT09Vk5vZGVTdGF0dXMuREVQUkVDQVRFRCApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH0pXG4gICAgfVxufSIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSAnLi8uLi92bm9kZS92bm9kZSc7XG5pbXBvcnQgeyBPbkRhdGFDaGFuZ2UgfSBmcm9tICcuLy4uL21vZGVscyc7XG5pbXBvcnQgeyBPYnNlcnZlIH0gZnJvbSAnLi9vYnNlcnZlJztcbmltcG9ydCB7IFZOb2RlU3RhdHVzIH0gZnJvbSAnLi4vY29uc3QnO1xuXG5cbmV4cG9ydCBjbGFzcyBXYXRjaGVye1xuICAgIHByaXZhdGUgdmFsdWU6YW55XG4gICAgcHJpdmF0ZSBkZWVwUmVjb3JkOmFueVtdPVtdXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZub2RlOlZOb2RlLHB1YmxpYyBFeHBPckZ1bmM6c3RyaW5nfEZ1bmN0aW9uLHByaXZhdGUgY2I6T25EYXRhQ2hhbmdlLHByaXZhdGUgb2JzZXJ2ZXI6T2JzZXJ2ZSxwcml2YXRlIGRlZXA/OmJvb2xlYW4pe1xuICAgICAgICB0aGlzLnZhbHVlPXRoaXMub2JzZXJ2ZXIuR2V0VmFsdWUodGhpcylcbiAgICAgICAgaWYodGhpcy5kZWVwICYmIHRvU3RyaW5nLmNhbGwodGhpcy52YWx1ZSk9PVwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMudmFsdWUubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWVwUmVjb3JkW2ldPXRoaXMudmFsdWVbaV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNiKHRoaXMudmFsdWUsdW5kZWZpbmVkKVxuICAgIH1cbiAgICBHZXRWTm9kZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy52bm9kZVxuICAgIH1cbiAgICBVcGRhdGUoKXtcbiAgICAgICAgbGV0IG5ld3ZhbD10aGlzLm9ic2VydmVyLkdldFZhbHVlKHRoaXMpXG4gICAgICAgIGlmKHRoaXMudmFsdWUhPW5ld3ZhbCl7XG4gICAgICAgICAgICBpZih0aGlzLnZub2RlLkdldFN0YXR1cygpPT1WTm9kZVN0YXR1cy5BQ1RJVkUpXG4gICAgICAgICAgICAgICAgdGhpcy5jYihuZXd2YWwsdGhpcy52YWx1ZSlcbiAgICAgICAgICAgIHRoaXMudmFsdWU9bmV3dmFsXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgLy/liKTmlq3mlbDnu4TlhYPntKDmmK/lkKbmnInlj5jljJZcbiAgICAgICAgICAgIGlmKHRoaXMuZGVlcCAmJiB0b1N0cmluZy5jYWxsKHRoaXMudmFsdWUpPT1cIltvYmplY3QgQXJyYXldXCIgKXtcbiAgICAgICAgICAgICAgICBsZXQgZGlmZj1mYWxzZVxuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8bmV3dmFsLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZihuZXd2YWxbaV0hPXRoaXMuZGVlcFJlY29yZFtpXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNiKG5ld3ZhbCx0aGlzLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZj10cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKGRpZmYpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZXBSZWNvcmQ9W11cbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxuZXd2YWwubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZXBSZWNvcmRbaV09bmV3dmFsW2ldXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBMb2dFcnJvcihtc2c6YW55KXtcbiAgICBjb25zb2xlLmVycm9yKG1zZylcbn1cbmV4cG9ydCBmdW5jdGlvbiBMb2dJbmZvKG1zZzphbnkpe1xuICAgIGNvbnNvbGUubG9nKG1zZylcbn1cbmV4cG9ydCBmdW5jdGlvbiBHZXROUyhzdHI6c3RyaW5nKTp7bmFtZXNwYWNlOnN0cmluZyx2YWx1ZTpzdHJpbmd9e1xuICAgIGxldCByZXM9c3RyLnNwbGl0KFwiOlwiKVxuICAgIGlmKHJlcy5sZW5ndGg9PTEpXG4gICAgICAgIHJldHVybiB7bmFtZXNwYWNlOm51bGwsdmFsdWU6cmVzWzBdfVxuICAgIGlmKHJlcy5sZW5ndGg9PTIpXG4gICAgICAgIHJldHVybiB7bmFtZXNwYWNlOnJlc1swXSx2YWx1ZTpyZXNbMV19XG59XG5leHBvcnQgZnVuY3Rpb24gSHR0cEdldCh1cmw6c3RyaW5nKTpzdHJpbmd7XG4gICAgbGV0IHhocj1uZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHhoci5vcGVuKFwiR0VUXCIsdXJsLGZhbHNlKVxuICAgIHhoci5zZW5kKClcbiAgICBpZih4aHIucmVhZHlTdGF0ZT09NCAmJiB4aHIuc3RhdHVzPT0yMDApXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gbnVsbFxufVxuZXhwb3J0IGZ1bmN0aW9uIElzU3RyaW5nRW1wdHkoc3RyOnN0cmluZyl7XG4gICAgaWYoc3RyPT1udWxsKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHN0cj1zdHIudHJpbSgpXG4gICAgaWYoc3RyPT1cIlwiKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuZXhwb3J0IGZ1bmN0aW9uIFRyaW0oc3RyOnN0cmluZyxjaGFyOnN0cmluZyl7XG4gICAgaWYoY2hhci5sZW5ndGg+MSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwib25seSByZWNldmUgb25lIGNoYXJhY3RlclwiKVxuICAgIGxldCBzdGFydD0tMVxuICAgIHdoaWxlKHN0cltzdGFydCsxXT09Y2hhcil7XG4gICAgICAgIHN0YXJ0KytcbiAgICB9XG4gICAgbGV0IGVuZD1zdHIubGVuZ3RoXG4gICAgd2hpbGUoc3RyW2VuZC0xXT09Y2hhcil7XG4gICAgICAgIGVuZC0tXG4gICAgfVxuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKHN0YXJ0KzEsZW5kKVxufSIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4uL3Zub2RlL3Zub2RlXCI7XG5pbXBvcnQgeyBJc0NvbXBvbmVudFJlZ2lzdGVyZWQsIEdldENvbXBvbmVudCB9IGZyb20gXCIuLi9tYW5hZ2VyL2NvbXBvbmVudHMtbWFuYWdlclwiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IEdldE5TIH0gZnJvbSBcIi4uL3V0aWxcIjtcbmltcG9ydCB7IFBSRSB9IGZyb20gXCIuLi9jb25zdFwiO1xuaW1wb3J0IHsgVmluYWxsYU5vZGUgfSBmcm9tIFwiLi4vdm5vZGUvdmluYWxsYS1ub2RlXCI7XG5kZWNsYXJlIGxldCByZXF1aXJlOihtb2R1bGU6c3RyaW5nKT0+YW55XG5leHBvcnQgY2xhc3MgVkRvbXtcbiAgICBOb2RlVmFsdWU6IHN0cmluZ1xuICAgIE5vZGVOYW1lOiBzdHJpbmdcbiAgICBOb2RlVHlwZTogbnVtYmVyXG4gICAgQXR0cnM6IHsgTmFtZTogc3RyaW5nLCBWYWx1ZTogc3RyaW5nIH1bXSA9IFtdXG4gICAgQ2hpbGRyZW46IFZEb21bXSA9IFtdXG4gICAgR2V0QXR0cihuYW1lOnN0cmluZyl7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5BdHRycy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGlmKHRoaXMuQXR0cnNbaV0uTmFtZT09bmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5BdHRyc1tpXS5WYWx1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIEFkZEF0dHIoYXR0cjpzdHJpbmcpe1xuICAgICAgICB0aGlzLkF0dHJzLnB1c2goe05hbWU6YXR0cixWYWx1ZTpcIlwifSlcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gVHJhdmVyc2VEb20oZG9tOk5vZGUpOlZEb217XG4gICAgaWYoZG9tLm5vZGVUeXBlPT0zICYmIGRvbS5ub2RlVmFsdWUudHJpbSgpPT1cIlwiKVxuICAgICAgICByZXR1cm5cbiAgICBsZXQgcm9vdD1uZXcgVkRvbSgpXG4gICAgcm9vdC5Ob2RlVmFsdWU9ZG9tLm5vZGVWYWx1ZVxuICAgIGlmKHJvb3QuTm9kZVZhbHVlIT1udWxsKXtcbiAgICAgICAgcm9vdC5Ob2RlVmFsdWU9cm9vdC5Ob2RlVmFsdWUucmVwbGFjZSgvXFxzKy9nLFwiXCIpXG4gICAgfVxuICAgIHJvb3QuTm9kZU5hbWU9ZG9tLm5vZGVOYW1lXG4gICAgcm9vdC5Ob2RlVHlwZT1kb20ubm9kZVR5cGVcbiAgICBpZihkb20ubm9kZVR5cGU9PTEpe1xuICAgICAgICBsZXQgaHRtbGRvbT1kb20gYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgZm9yKGxldCBpPTA7aTxodG1sZG9tLmF0dHJpYnV0ZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICByb290LkF0dHJzLnB1c2goe05hbWU6aHRtbGRvbS5hdHRyaWJ1dGVzW2ldLm5hbWUsVmFsdWU6aHRtbGRvbS5hdHRyaWJ1dGVzW2ldLnZhbHVlfSlcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGk9MDtpPGh0bWxkb20uY2hpbGROb2Rlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGxldCBjaGlsZD1UcmF2ZXJzZURvbShodG1sZG9tLmNoaWxkTm9kZXNbaV0pXG4gICAgICAgICAgICBjaGlsZCAmJiByb290LkNoaWxkcmVuLnB1c2goY2hpbGQpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJvb3Rcbn1cbmV4cG9ydCBlbnVtIFByaW9yaXR5e1xuICAgIE5PUk1BTCxcbiAgICBJRixcbiAgICBGT1Jcbn1cbmV4cG9ydCBmdW5jdGlvbiBOZXdWTm9kZShkb206VkRvbSxtdnZtOk1WVk0scGFyZW50OlZOb2RlLHByaW9yaXR5OlByaW9yaXR5PVByaW9yaXR5LkZPUik6Vk5vZGV7XG4gICAgaWYoZG9tLk5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PVwic2xvdFwiKXtcbiAgICAgICAgbGV0IFNsb3ROb2RlPXJlcXVpcmUoXCIuLi92bm9kZS9zbG90LW5vZGVcIikuU2xvdE5vZGVcbiAgICAgICAgcmV0dXJuIG5ldyBTbG90Tm9kZShkb20sbXZ2bSxwYXJlbnQsZG9tLkdldEF0dHIoXCJuYW1lXCIpKVxuICAgIH1cblxuICAgIGlmKHByaW9yaXR5Pj1Qcmlvcml0eS5GT1IgJiYgZG9tLkdldEF0dHIoUFJFK1wiZm9yXCIpIT1udWxsKXtcbiAgICAgICAgbGV0IEZvck5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL2Zvci1ub2RlXCIpLkZvck5vZGVcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JOb2RlKGRvbSxtdnZtLHBhcmVudCxkb20uR2V0QXR0cihQUkUrXCJmb3JcIikpXG4gICAgfVxuICAgIGlmKHByaW9yaXR5Pj1Qcmlvcml0eS5JRiAmJiBkb20uR2V0QXR0cihQUkUrXCJpZlwiKSE9bnVsbCl7XG4gICAgICAgIGxldCBJZk5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL2lmLW5vZGVcIikuSWZOb2RlXG4gICAgICAgIHJldHVybiBuZXcgSWZOb2RlKGRvbSxtdnZtLHBhcmVudCxkb20uR2V0QXR0cihQUkUrXCJpZlwiKSkgICAgICAgICAgICAgIFxuICAgIH1cbiAgICBsZXQgbnM9R2V0TlMoZG9tLk5vZGVOYW1lKVxuICAgIGlmKElzQ29tcG9uZW50UmVnaXN0ZXJlZChucy52YWx1ZSxucy5uYW1lc3BhY2V8fFwiZGVmYXVsdFwiKSl7XG4gICAgICAgIGxldCBvcHRpb249R2V0Q29tcG9uZW50KG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8XCJkZWZhdWx0XCIpXG4gICAgICAgIGxldCBzZWxmbXZ2bT1uZXcgTVZWTShvcHRpb24pXG4gICAgICAgIGxldCBDdXN0b21Ob2RlPXJlcXVpcmUoXCIuLi92bm9kZS9jdXN0b20tbm9kZVwiKS5DdXN0b21Ob2RlXG4gICAgICAgIGxldCBjdXN0PSBuZXcgQ3VzdG9tTm9kZShkb20sbXZ2bSxwYXJlbnQsc2VsZm12dm0pXG4gICAgICAgIHNlbGZtdnZtLiRGZW5jZU5vZGU9Y3VzdFxuICAgICAgICBjdXN0LlBhcnNlVGVtcGxhdGUoKVxuICAgICAgICByZXR1cm4gY3VzdFxuICAgIH1cbiAgICAgICAgXG4gICAgcmV0dXJuIG5ldyBWaW5hbGxhTm9kZShkb20sbXZ2bSxwYXJlbnQpXG59IiwiaW1wb3J0IHsgVmluYWxsYU5vZGUgfSBmcm9tICcuL3ZpbmFsbGEtbm9kZSc7XG5pbXBvcnQgeyBSRUdfSU4sIFJFR19PVVQsIFZOb2RlU3RhdHVzIH0gZnJvbSBcIi4uL2NvbnN0XCI7XG5pbXBvcnQgeyBHZXRDb21wb25lbnQsIElzQ29tcG9uZW50UmVnaXN0ZXJlZCB9IGZyb20gXCIuLi9tYW5hZ2VyL2NvbXBvbmVudHMtbWFuYWdlclwiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IEdldE5TIH0gZnJvbSBcIi4uL3V0aWxcIjtcbmltcG9ydCB7IE5ld1ZOb2RlLCBWRG9tIH0gZnJvbSBcIi4uL3Zkb20vdmRvbVwiO1xuaW1wb3J0IHsgVGVtcGxhdGVOb2RlIH0gZnJvbSBcIi4vdGVtcGxhdGUtbm9kZVwiO1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi92bm9kZVwiO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tTm9kZSBleHRlbmRzIFZOb2Rle1xuICAgIC8v6L6T5YWl5LiO6L6T5Ye65YC8XG4gICAgcHJpdmF0ZSBpbnNfcHVyZTp7W25hbWU6c3RyaW5nXTphbnl9PXt9XG4gICAgcHJpdmF0ZSBpbnNfZXhwOntbbmFtZTpzdHJpbmddOnN0cmluZ309e31cbiAgICBwcml2YXRlIG91dHM6e1tuYW1lOnN0cmluZ106c3RyaW5nfT17fVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIFZkb206VkRvbSxwdWJsaWMgbXZ2bTogTVZWTSxwdWJsaWMgUGFyZW50OlZOb2RlLHB1YmxpYyBTdXJyb3VuZE12dm06TVZWTSkge1xuICAgICAgICBzdXBlcihWZG9tLG12dm0sUGFyZW50KVxuICAgIH1cbiAgICBBZGRJbnMobmFtZTpzdHJpbmcsZXhwOnN0cmluZyl7XG4gICAgICAgIHRoaXMuaW5zX2V4cFtuYW1lXT1leHBcbiAgICB9XG4gICAgLyoq6I635Y+W6Lefc2xvdOWMuemFjeeahOaooeeJiOWGheWuuSAqL1xuICAgIEdldFRlbXBsYXRlKG5hbWU6c3RyaW5nKTpUZW1wbGF0ZU5vZGV7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5DaGlsZHJlbi5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZT10aGlzLkNoaWxkcmVuW2ldIGFzIFRlbXBsYXRlTm9kZVxuICAgICAgICAgICAgaWYodGVtcGxhdGUudGVtcGxhdGVuYW1lPT1uYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIFJlbmRlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5Eb209dGhpcy5TdXJyb3VuZE12dm0uUmVuZGVyKClcbiAgICAgICAgaWYodGhpcy5Eb20gJiYgdGhpcy5QYXJlbnQgJiYgdGhpcy5QYXJlbnQuRG9tKVxuICAgICAgICAgICAgdGhpcy5QYXJlbnQuRG9tLmFwcGVuZENoaWxkKHRoaXMuRG9tKVxuICAgIH1cbiAgICBcblxuICAgIC8qKm92ZXJyaWRlIHZub2RlICovXG4gICAgcHJvdGVjdGVkIGNoaWxkU2V0KCl7XG4gICAgICAgIC8v5Yi26YCg5Lit6Ze06IqC54K5566h55CGdGVtcGxhdGVcbiAgICAgICAgbGV0IGRlZmF1bHRUZW1wbGF0ZT1uZXcgVGVtcGxhdGVOb2RlKHRoaXMuVmRvbSx0aGlzLm12dm0/dGhpcy5tdnZtOnRoaXMuU3Vycm91bmRNdnZtLHRoaXMsXCJkZWZhdWx0XCIpXG4gICAgICAgIGRlZmF1bHRUZW1wbGF0ZS5QYXJlbnQ9dGhpc1xuICAgICAgICBsZXQgdGVtcGxhdGVzOntbbmFtZTpzdHJpbmddOlZOb2RlfT17XCJkZWZhdWx0XCI6ZGVmYXVsdFRlbXBsYXRlfVxuICAgICAgICAvL+ino+aekOWtkOiKgueCuVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuVmRvbS5DaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNoaWxkbm9kZT10aGlzLlZkb20uQ2hpbGRyZW5baV1cblxuICAgICAgICAgICAgbGV0IG5hbWU9dGhpcy5WZG9tLkdldEF0dHIoXCJzbG90XCIpXG4gICAgICAgICAgICBpZihuYW1lPT1udWxsIHx8IG5hbWU9PVwiXCIpe1xuICAgICAgICAgICAgICAgIG5hbWU9XCJkZWZhdWx0XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRlbXBsYXRlc1tuYW1lXT09bnVsbCl7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzW25hbWVdPW5ldyBUZW1wbGF0ZU5vZGUodGhpcy5WZG9tLHRoaXMubXZ2bT90aGlzLm12dm06dGhpcy5TdXJyb3VuZE12dm0sdGhpcyxuYW1lKVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlc1tuYW1lXS5QYXJlbnQ9dGhpc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHZjaGlsZD1OZXdWTm9kZShjaGlsZG5vZGUsdGVtcGxhdGVzW25hbWVdLm12dm0sdGVtcGxhdGVzW25hbWVdKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2Y2hpbGQuQXR0YWNoRG9tKClcbiAgICAgICAgICAgIHRlbXBsYXRlc1tuYW1lXS5DaGlsZHJlbi5wdXNoKHZjaGlsZClcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IG5hbWUgaW4gdGVtcGxhdGVzKXtcbiAgICAgICAgICAgIHRoaXMuQ2hpbGRyZW4ucHVzaCh0ZW1wbGF0ZXNbbmFtZV0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgUGFyc2VUZW1wbGF0ZSgpe1xuICAgICAgICBsZXQgZG9tdHJlZT10aGlzLlN1cnJvdW5kTXZ2bS5HZXREb21UcmVlKClcbiAgICAgICAgbGV0IG5zPUdldE5TKGRvbXRyZWUuTm9kZU5hbWUpXG5cbiAgICAgICAgaWYoSXNDb21wb25lbnRSZWdpc3RlcmVkKG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8dGhpcy5TdXJyb3VuZE12dm0uJE5hbWVzcGFjZSkpe1xuICAgICAgICAgICAgbGV0IG9wdGlvbj1HZXRDb21wb25lbnQobnMudmFsdWUsbnMubmFtZXNwYWNlfHx0aGlzLlN1cnJvdW5kTXZ2bS4kTmFtZXNwYWNlKVxuICAgICAgICAgICAgbGV0IHNlbGZtdnZtPW5ldyBNVlZNKG9wdGlvbilcbiAgICAgICAgICAgIGxldCBjaGlsZD0gbmV3IEN1c3RvbU5vZGUoZG9tdHJlZSx0aGlzLlN1cnJvdW5kTXZ2bSxudWxsLHNlbGZtdnZtKVxuICAgICAgICAgICAgdGhpcy5TdXJyb3VuZE12dm0uJFRyZWVSb290PWNoaWxkXG4gICAgICAgICAgICBzZWxmbXZ2bS4kRmVuY2VOb2RlPXRoaXNcbiAgICAgICAgICAgIGNoaWxkLlBhcnNlVGVtcGxhdGUoKSAgICAgICAgICAgIFxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuU3Vycm91bmRNdnZtLiRUcmVlUm9vdD1uZXcgVmluYWxsYU5vZGUoZG9tdHJlZSx0aGlzLlN1cnJvdW5kTXZ2bSxudWxsKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuU3Vycm91bmRNdnZtLiRUcmVlUm9vdC5BdHRhY2hEb20oKVxuICAgICAgICBcbiAgICB9XG4gICAgR2V0SW5WYWx1ZShwcm9wOnN0cmluZyl7XG4gICAgICAgIGlmKHRoaXMuaW5zX3B1cmVbcHJvcF0hPW51bGwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnNfcHVyZVtwcm9wXVxuICAgICAgICBpZih0aGlzLmluc19leHBbcHJvcF0hPW51bGwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tdnZtLkdldEV4cFZhbHVlKHRoaXMuaW5zX2V4cFtwcm9wXSlcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgR2V0SW4ocHJvcDpzdHJpbmcpe1xuICAgICAgICByZXR1cm4gdGhpcy5pbnNfcHVyZVtwcm9wXSB8fHRoaXMuaW5zX2V4cFtwcm9wXVxuICAgIH1cbiAgICBHZXRPdXQocHJvcDpzdHJpbmcpe1xuICAgICAgICByZXR1cm4gdGhpcy5vdXRzW3Byb3BdXG4gICAgfVxuICAgIFxuICAgIFxuICAgIFJlZnJlc2goKSB7XG4gICAgICAgIHRoaXMuU3Vycm91bmRNdnZtLiRUcmVlUm9vdC5SZWZyZXNoKClcbiAgICB9XG4gICAgVXBkYXRlKCl7XG4gICAgICAgIHRoaXMuU3Vycm91bmRNdnZtLiRUcmVlUm9vdC5VcGRhdGUoKVxuICAgIH1cblxuICAgIE9uUmVtb3ZlZCgpe1xuICAgICAgICB0aGlzLlN1cnJvdW5kTXZ2bS4kb25kZXN0cm95KClcbiAgICB9XG4gICAgU2V0U3RhdHVzKHN0YXR1czpWTm9kZVN0YXR1cyl7XG4gICAgICAgIHRoaXMuc3RhdHVzPXN0YXR1c1xuICAgICAgICB0aGlzLlN1cnJvdW5kTXZ2bS4kVHJlZVJvb3QuU2V0U3RhdHVzKHN0YXR1cylcbiAgICB9XG4gICAgQWRkUHJvcGVydHkobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIC8v6L6T5YWlXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5TdXJyb3VuZE12dm0uJElucy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGxldCBwcm9wPXRoaXMuU3Vycm91bmRNdnZtLiRJbnNbaV1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoUkVHX0lOLnRlc3QobmFtZSkgJiYgcHJvcC5uYW1lPT1SZWdFeHAuJDEpe1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zX2V4cFtSZWdFeHAuJDFdPXZhbHVlXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihwcm9wLm5hbWU9PW5hbWUpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc19wdXJlW25hbWVdPXZhbHVlXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL+i+k+WHulxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuU3Vycm91bmRNdnZtLiRPdXRzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbGV0IGV2ZW50PXRoaXMuU3Vycm91bmRNdnZtLiRPdXRzW2ldXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKFJFR19PVVQudGVzdChuYW1lKSAmJiBldmVudD09UmVnRXhwLiQxKXtcbiAgICAgICAgICAgICAgICB0aGlzLm91dHNbUmVnRXhwLiQxXT12YWx1ZVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzdXBlci5BZGRQcm9wZXJ0eShuYW1lLHZhbHVlKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBSRUdfSU4sIFJFR19PVVQgfSBmcm9tICcuLi9jb25zdCc7XG5pbXBvcnQgeyBWRG9tIH0gZnJvbSAnLi4vdmRvbS92ZG9tJztcbmltcG9ydCB7IERpcmVjdGl2ZU9wdGlvbiB9IGZyb20gJy4vLi4vbW9kZWxzJztcblxuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZSB7XG4gICAgLy/ovpPlhaXkuI7ovpPlh7rlgLxcbiAgICBwcm90ZWN0ZWQgaW5zX3B1cmU6IHsgW25hbWU6IHN0cmluZ106IGFueSB9ID0ge31cbiAgICBwcm90ZWN0ZWQgaW5zX2V4cDogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fVxuICAgIHByb3RlY3RlZCBvdXRzOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZkb206VkRvbSxwcml2YXRlIGRpcmVjdGl2ZU9wdGlvbjpEaXJlY3RpdmVPcHRpb24pIHtcbiAgICAgICAgdGhpcy52ZG9tLkF0dHJzLmZvckVhY2goYXR0cj0+e1xuICAgICAgICAgICAgdGhpcy5hZGRQcm9wZXJ0eShhdHRyLk5hbWUsYXR0ci5WYWx1ZSlcbiAgICAgICAgfSlcbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOmJvb2xlYW57XG4gICAgICAgIC8v6L6T5YWlXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5kaXJlY3RpdmVPcHRpb24ucHJvcHMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBsZXQgcHJvcD10aGlzLmRpcmVjdGl2ZU9wdGlvbi5wcm9wc1tpXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihSRUdfSU4udGVzdChuYW1lKSAmJiBwcm9wLm5hbWU9PVJlZ0V4cC4kMSl7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNfZXhwW1JlZ0V4cC4kMV09dmFsdWVcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKHByb3AubmFtZT09bmFtZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zX3B1cmVbbmFtZV09dmFsdWVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v6L6T5Ye6XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5kaXJlY3RpdmVPcHRpb24uZXZlbnRzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbGV0IGV2ZW50PXRoaXMuZGlyZWN0aXZlT3B0aW9uLmV2ZW50c1tpXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihSRUdfT1VULnRlc3QobmFtZSkgJiYgZXZlbnQ9PVJlZ0V4cC4kMSl7XG4gICAgICAgICAgICAgICAgdGhpcy5vdXRzW1JlZ0V4cC4kMV09dmFsdWVcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBHZXRJbihwcm9wOnN0cmluZyl7XG4gICAgICAgIHJldHVybiB0aGlzLmluc19wdXJlW3Byb3BdIHx8dGhpcy5pbnNfZXhwW3Byb3BdXG4gICAgfVxuICAgIEdldE91dChwcm9wOnN0cmluZyl7XG4gICAgICAgIHJldHVybiB0aGlzLm91dHNbcHJvcF1cbiAgICB9XG59IiwiaW1wb3J0IHsgRm9yRXhwIH0gZnJvbSBcIi4uL21vZGVsc1wiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gJy4uL212dm0vbXZ2bSc7XG5pbXBvcnQgeyBWRG9tLCBOZXdWTm9kZSwgUHJpb3JpdHkgfSBmcm9tICcuLi92ZG9tL3Zkb20nO1xuaW1wb3J0IHsgQ3VzdG9tTm9kZSB9IGZyb20gJy4vY3VzdG9tLW5vZGUnO1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi92bm9kZVwiO1xuaW1wb3J0IHsgVk5vZGVTdGF0dXMgfSBmcm9tIFwiLi4vY29uc3RcIjtcblxuZXhwb3J0IGNsYXNzIEZvck5vZGUgZXh0ZW5kcyBWTm9kZXtcbiAgICBwcml2YXRlIGR5bmFtaWNWTm9kZXM6Q3VzdG9tTm9kZVtdID0gW11cbiAgICBwdWJsaWMgRm9yRXhwOkZvckV4cFxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBWZG9tOlZEb20scHVibGljIG12dm06IE1WVk0scHVibGljIFBhcmVudDpWTm9kZSxwcml2YXRlIG9yaWdpbkZvckV4cDpzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoVmRvbSxtdnZtLFBhcmVudClcbiAgICAgICAgdGhpcy5Jc1RlbXBsYXRlPXRydWUgICAgICAgXG4gICAgICAgIGxldCBmb3JTcGxpdD10aGlzLm9yaWdpbkZvckV4cC50cmltKCkuc3BsaXQoL1xccysvKVxuICAgICAgICB0aGlzLkZvckV4cD1uZXcgRm9yRXhwKGZvclNwbGl0WzBdLGZvclNwbGl0WzJdKSBcbiAgICB9XG4gICAgcHJpdmF0ZSBuZXdDb3B5Tm9kZShuOm51bWJlcil7XG4gICAgICAgIGxldCBpdGVtZXhwPXRoaXMuRm9yRXhwLml0ZW1FeHBcbiAgICAgICAgbGV0IG12dm09bmV3IE1WVk0oeyRuYW1lOlwiXCIsZGF0YTp7fSxtZXRob2RzOnt9LGNvbXB1dGVkOnt9LGV2ZW50czpbXSwkbmFtZXNwYWNlOnRoaXMubXZ2bS4kTmFtZXNwYWNlLHByb3BzOlt7bmFtZTppdGVtZXhwLHJlcXVpcmVkOnRydWV9XX0pXG4gICAgICAgIG12dm0uU2V0SGlyZW50ZWQodHJ1ZSlcblxuICAgICAgICBsZXQgZmVuY2Vub2RlPW5ldyBDdXN0b21Ob2RlKHRoaXMuVmRvbSx0aGlzLm12dm0sbnVsbCxtdnZtKVxuICAgICAgICBtdnZtLiRGZW5jZU5vZGU9ZmVuY2Vub2RlICAgICAgICBcbiAgICAgICAgZmVuY2Vub2RlLklzQ29weT10cnVlXG4gICAgICAgIGZlbmNlbm9kZS5BZGRJbnMoaXRlbWV4cCx0aGlzLkZvckV4cC5hcnJheUV4cCtcIltcIituK1wiXVwiKVxuICAgICAgICByZXR1cm4gZmVuY2Vub2RlXG4gICAgfVxuICAgIHByaXZhdGUgcmVJbXBsZW1lbnRGb3JFeHAobmV3Y291bnQ6bnVtYmVyKXtcbiAgICAgICAgaWYobmV3Y291bnQ+dGhpcy5keW5hbWljVk5vZGVzLmxlbmd0aCl7XG4gICAgICAgICAgICBsZXQgY3VzdG5vZGVzOkN1c3RvbU5vZGVbXT1bXVxuICAgICAgICAgICAgbGV0IG9sZGNvdW50PXRoaXMuZHluYW1pY1ZOb2Rlcy5sZW5ndGhcbiAgICAgICAgICAgIGZvcihsZXQgaT10aGlzLmR5bmFtaWNWTm9kZXMubGVuZ3RoO2k8bmV3Y291bnQ7aSsrKXsgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGN1c3Rub2RlPXRoaXMubmV3Q29weU5vZGUoaSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgdm5vZGU9TmV3Vk5vZGUodGhpcy5WZG9tLGN1c3Rub2RlLlN1cnJvdW5kTXZ2bSxudWxsLFByaW9yaXR5LklGKVxuICAgICAgICAgICAgICAgIHZub2RlLkF0dGFjaERvbSgpXG4gICAgICAgICAgICAgICAgY3VzdG5vZGUuU3Vycm91bmRNdnZtLiRUcmVlUm9vdD12bm9kZVxuICAgICAgICAgICAgICAgIGN1c3Rub2Rlcy5wdXNoKGN1c3Rub2RlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VzdG5vZGVzLmZvckVhY2goY3VzdG5vZGU9PntcbiAgICAgICAgICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZXMucHVzaChjdXN0bm9kZSkgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGN1c3Rub2RlLlJlbmRlcigpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5QYXJlbnQuQWRkQ2hpbGRyZW4odGhpcyxjdXN0bm9kZXMsb2xkY291bnQpXG4gICAgICAgICAgICB0aGlzLlBhcmVudC5SZWZyZXNoKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmKG5ld2NvdW50PHRoaXMuZHluYW1pY1ZOb2Rlcy5sZW5ndGgpe1xuICAgICAgICAgICAgbGV0IG1vdmVkPXRoaXMuZHluYW1pY1ZOb2Rlcy5zcGxpY2UobmV3Y291bnQpXG4gICAgICAgICAgICBtb3ZlZC5mb3JFYWNoKHZub2RlPT52bm9kZS5TZXRTdGF0dXMoVk5vZGVTdGF0dXMuREVQUkVDQVRFRCkpXG4gICAgICAgICAgICB0aGlzLlBhcmVudC5SZW1vdmVDaGlsZHJlbihtb3ZlZClcbiAgICAgICAgICAgIG1vdmVkLmZvckVhY2goaXRlbT0+e1xuICAgICAgICAgICAgICAgIGl0ZW0uT25SZW1vdmVkKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLlBhcmVudC5SZWZyZXNoKClcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBVcGRhdGUoKXtcbiAgICAgICAgbGV0IGl0ZW1zPXRoaXMubXZ2bS5HZXRFeHBWYWx1ZSh0aGlzLkZvckV4cC5hcnJheUV4cClcbiAgICAgICAgaWYodG9TdHJpbmcuY2FsbChpdGVtcykgPT09IFwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICB0aGlzLnJlSW1wbGVtZW50Rm9yRXhwKGl0ZW1zLmxlbmd0aClcbiAgICAgICAgfVxuICAgIH1cbiAgICBBdHRhY2hEb20oKSB7fVxuICAgIFJlbmRlcigpe1xuICAgICAgICB0aGlzLm12dm0uJHdhdGNoKHRoaXMsdGhpcy5Gb3JFeHAuYXJyYXlFeHArXCIubGVuZ3RoXCIsdGhpcy5yZUltcGxlbWVudEZvckV4cC5iaW5kKHRoaXMpKVxuICAgIH1cbiAgICBPblJlbW92ZWQoKXtcbiAgICAgICAgdGhpcy5keW5hbWljVk5vZGVzLmZvckVhY2godm5vZGU9PnZub2RlLk9uUmVtb3ZlZCgpKVxuICAgIH1cbiAgICBTZXRTdGF0dXMoc3RhdHVzOlZOb2RlU3RhdHVzKXtcbiAgICAgICAgdGhpcy5zdGF0dXM9c3RhdHVzXG4gICAgICAgIHRoaXMuZHluYW1pY1ZOb2Rlcy5mb3JFYWNoKHZub2RlPT52bm9kZS5TZXRTdGF0dXMoc3RhdHVzKSlcbiAgICB9XG59IiwiaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4vdm5vZGVcIjtcbmltcG9ydCB7IFZEb20sIE5ld1ZOb2RlLCBQcmlvcml0eSB9IGZyb20gXCIuLi92ZG9tL3Zkb21cIjtcbmltcG9ydCB7IFZOb2RlU3RhdHVzIH0gZnJvbSBcIi4uL2NvbnN0XCI7XG5cbmV4cG9ydCBjbGFzcyBJZk5vZGUgZXh0ZW5kcyBWTm9kZSB7XG4gICAgcHJpdmF0ZSBkeW5hbWljVk5vZGU6IFZOb2RlXG4gICAgY29uc3RydWN0b3IocHVibGljIFZkb206VkRvbSxwdWJsaWMgbXZ2bTogTVZWTSwgcHVibGljIFBhcmVudDogVk5vZGUsIHByaXZhdGUgaWZFeHA6IHN0cmluZykge1xuICAgICAgICBzdXBlcihWZG9tLG12dm0sIFBhcmVudClcbiAgICAgICAgdGhpcy5Jc1RlbXBsYXRlPXRydWVcbiAgICB9XG4gICAgXG4gICAgQXR0YWNoRG9tKCkge31cbiAgICBSZW5kZXIoKXtcbiAgICAgICAgdGhpcy5tdnZtLiR3YXRjaCh0aGlzLHRoaXMuaWZFeHAsIG5ld3ZhbHVlPT50aGlzLnJlSW1wbGV0ZW1lbnQobmV3dmFsdWUpKVxuICAgIH1cbiAgICBVcGRhdGUoKXtcbiAgICAgICAgbGV0IGF0dGFjaGVkID0gdGhpcy5tdnZtLkdldEV4cFZhbHVlKHRoaXMuaWZFeHApXG4gICAgICAgIHRoaXMucmVJbXBsZXRlbWVudChhdHRhY2hlZClcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlSW1wbGV0ZW1lbnQobmV3dmFsdWU6Ym9vbGVhbil7XG4gICAgICAgIGlmIChuZXd2YWx1ZSkge1xuICAgICAgICAgICAgaWYodGhpcy5keW5hbWljVk5vZGU9PW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UoKVxuICAgICAgICAgICAgICAgIHRoaXMuZHluYW1pY1ZOb2RlLlJlbmRlcigpXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZS5VcGRhdGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy5QYXJlbnQhPW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMuUGFyZW50LkFkZENoaWxkcmVuKHRoaXMsIFt0aGlzLmR5bmFtaWNWTm9kZV0sMClcbiAgICAgICAgICAgICAgICB0aGlzLlBhcmVudC5SZWZyZXNoKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5tdnZtLiRGZW5jZU5vZGUuRG9tPXRoaXMuZHluYW1pY1ZOb2RlLkRvbVxuICAgICAgICAgICAgICAgIHRoaXMubXZ2bS4kRmVuY2VOb2RlLlBhcmVudC5SZWZyZXNoKCkgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5keW5hbWljVk5vZGUuU2V0U3RhdHVzKFZOb2RlU3RhdHVzLkFDVElWRSlcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5keW5hbWljVk5vZGUhPW51bGwpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuUGFyZW50IT1udWxsKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXJlbnQuUmVtb3ZlQ2hpbGRyZW4oW3RoaXMuZHluYW1pY1ZOb2RlXSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXJlbnQuUmVmcmVzaCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm12dm0uJEZlbmNlTm9kZS5Eb209bnVsbFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm12dm0uJEZlbmNlTm9kZS5QYXJlbnQuUmVmcmVzaCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZHluYW1pY1ZOb2RlLlNldFN0YXR1cyhWTm9kZVN0YXR1cy5JTkFDVElWRSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaW5zdGFuY2UoKXtcbiAgICAgICAgdGhpcy5keW5hbWljVk5vZGU9TmV3Vk5vZGUodGhpcy5WZG9tLHRoaXMubXZ2bSxudWxsLFByaW9yaXR5Lk5PUk1BTClcbiAgICAgICAgdGhpcy5keW5hbWljVk5vZGUuSXNDb3B5PXRydWVcbiAgICAgICAgdGhpcy5keW5hbWljVk5vZGUuQXR0YWNoRG9tKClcbiAgICB9XG4gICAgT25SZW1vdmVkKCl7XG4gICAgICAgIGlmKHRoaXMuZHluYW1pY1ZOb2RlIT1udWxsKVxuICAgICAgICAgICAgdGhpcy5keW5hbWljVk5vZGUuT25SZW1vdmVkKClcbiAgICB9XG4gICAgU2V0U3RhdHVzKHN0YXR1czpWTm9kZVN0YXR1cyl7XG4gICAgICAgIHRoaXMuc3RhdHVzPXN0YXR1c1xuICAgICAgICBpZih0aGlzLmR5bmFtaWNWTm9kZSE9bnVsbClcbiAgICAgICAgICAgIHRoaXMuZHluYW1pY1ZOb2RlLlNldFN0YXR1cyhzdGF0dXMpXG4gICAgfVxufSIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4vdm5vZGVcIjtcbmltcG9ydCB7IE1WVk0gfSBmcm9tIFwiLi4vbXZ2bS9tdnZtXCI7XG5pbXBvcnQgeyBWRG9tIH0gZnJvbSBcIi4uL3Zkb20vdmRvbVwiO1xuaW1wb3J0IHsgVk5vZGVTdGF0dXMgfSBmcm9tIFwiLi4vY29uc3RcIjtcblxuZXhwb3J0IGNsYXNzIFNsb3ROb2RlIGV4dGVuZHMgVk5vZGV7XG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHZkb206VkRvbSxwdWJsaWMgbXZ2bTogTVZWTSwgcHVibGljIFBhcmVudDogVk5vZGUsIHByaXZhdGUgbmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHZkb20sbXZ2bSxQYXJlbnQpXG4gICAgICAgIGlmKHRoaXMubmFtZT09bnVsbCB8fCB0aGlzLm5hbWU9PVwiXCIpXG4gICAgICAgICAgICB0aGlzLm5hbWU9XCJkZWZhdWx0XCJcbiAgICB9XG4gICAgUmVuZGVyKCk6IHZvaWQge1xuICAgICAgICBsZXQgdGVtcGxhdGU9dGhpcy5tdnZtLiRGZW5jZU5vZGUuR2V0VGVtcGxhdGUodGhpcy5uYW1lKVxuICAgICAgICBpZih0ZW1wbGF0ZSE9bnVsbCl7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5SZW5kZXIoKVxuICAgICAgICAgICAgdGhpcy5Eb20gPSB0ZW1wbGF0ZS5Eb21cbiAgICAgICAgICAgIHdoaWxlKHRoaXMuRG9tLmZpcnN0Q2hpbGQhPW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMuUGFyZW50LkRvbS5hcHBlbmRDaGlsZCh0aGlzLkRvbS5maXJzdENoaWxkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIFxuICAgIFVwZGF0ZSgpe1xuICAgICAgICBsZXQgdGVtcGxhdGU9dGhpcy5tdnZtLiRGZW5jZU5vZGUuR2V0VGVtcGxhdGUodGhpcy5uYW1lKVxuICAgICAgICBpZih0ZW1wbGF0ZSE9bnVsbCl7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5VcGRhdGUoKVxuICAgICAgICB9XG4gICAgfVxuICAgIFNldFN0YXR1cyhzdGF0dXM6Vk5vZGVTdGF0dXMpe1xuICAgICAgICB0aGlzLnN0YXR1cz1zdGF0dXNcbiAgICAgICAgbGV0IHRlbXBsYXRlPXRoaXMubXZ2bS4kRmVuY2VOb2RlLkdldFRlbXBsYXRlKHRoaXMubmFtZSlcbiAgICAgICAgdGVtcGxhdGUuU2V0U3RhdHVzKHN0YXR1cylcbiAgICB9XG4gICAgT25SZW1vdmVkKCl7XG4gICAgICAgIGxldCB0ZW1wbGF0ZT10aGlzLm12dm0uJEZlbmNlTm9kZS5HZXRUZW1wbGF0ZSh0aGlzLm5hbWUpXG4gICAgICAgIHRlbXBsYXRlLk9uUmVtb3ZlZCgpXG4gICAgfVxufSIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4vdm5vZGVcIjtcbmltcG9ydCB7IE1WVk0gfSBmcm9tIFwiLi4vbXZ2bS9tdnZtXCI7XG5pbXBvcnQgeyBWRG9tIH0gZnJvbSBcIi4uL3Zkb20vdmRvbVwiO1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVOb2RlIGV4dGVuZHMgVk5vZGV7XG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHZkb206VkRvbSxwdWJsaWMgbXZ2bTogTVZWTSxwdWJsaWMgUGFyZW50OlZOb2RlLHB1YmxpYyB0ZW1wbGF0ZW5hbWU6c3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHZkb20sbXZ2bSxQYXJlbnQpXG4gICAgfVxuICAgIFxuICAgIFJlbmRlcigpIDp2b2lke1xuICAgICAgICB0aGlzLkRvbT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICAgIHRoaXMuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZD0+e1xuICAgICAgICAgICAgY2hpbGQuUmVuZGVyKClcbiAgICAgICAgfSlcbiAgICB9XG4gICAgXG4gICAgVXBkYXRlKCl7XG4gICAgICAgIGxldCBjaGlsZHJlbjogVk5vZGVbXSA9IFtdXG4gICAgICAgIHRoaXMuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKVxuICAgICAgICB9KVxuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGNoaWxkLlVwZGF0ZSgpXG4gICAgICAgIH0pXG4gICAgfVxufSIsImltcG9ydCB7IEdldERpcmVjdGl2ZSwgSXNEaXJlY3RpdmVSZWdpc3RlcmVkIH0gZnJvbSAnLi4vbWFuYWdlci9kaXJlY3RpdmUtbWFuYWdlcic7XG5pbXBvcnQgeyBEaXJlY3RpdmVNVlZNIH0gZnJvbSAnLi4vbXZ2bS9kaXJlY3RpdmUtbXZ2bSc7XG5pbXBvcnQgeyBHZXROUyB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHsgUkVHX0FUVFIsIFJFR19JTiwgUkVHX09VVCwgUFJFIH0gZnJvbSAnLi8uLi9jb25zdCc7XG5pbXBvcnQgeyBEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZSc7XG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJy4vdm5vZGUnO1xuaW1wb3J0IHsgRGlyTW9kZWwgfSBmcm9tICcuLi9kaXJlY3RpdmUvbW9kZWwnO1xuaW1wb3J0IHsgT25DbGljayB9IGZyb20gJy4uL2RpcmVjdGl2ZS9vbmNsaWNrJztcbmV4cG9ydCBjbGFzcyBWaW5hbGxhTm9kZSBleHRlbmRzIFZOb2Rle1xuICAgIFxuICAgIHByaXZhdGUgZGlyZWN0aXZlczpEaXJlY3RpdmVNVlZNW109W11cbiAgICBwcml2YXRlIGlubmVyRGlyZWN0aXZlOntuYW1lOnN0cmluZyx2YWx1ZTpzdHJpbmd9W109W11cbiAgICBcbiAgICBBZGRQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYoUkVHX0FUVFIudGVzdChuYW1lKSl7XG4gICAgICAgICAgICB0aGlzLkF0dHJzLnB1c2goe25hbWU6bmFtZSx2YWx1ZTp2YWx1ZX0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgT25SZW1vdmVkKCl7XG4gICAgICAgIHN1cGVyLk9uUmVtb3ZlZCgpXG4gICAgICAgIHRoaXMuZGlyZWN0aXZlcy5mb3JFYWNoKGRpcj0+ZGlyLiRvbmRlc3Ryb3koKSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZGlyZWN0aXZlQmluZCgpe1xuICAgICAgICB0aGlzLmRpcmVjdGl2ZXMuZm9yRWFjaChkaXI9PmRpci5SZW5kZXIoKSlcbiAgICAgICAgdGhpcy5pbm5lckRpcmVjdGl2ZS5mb3JFYWNoKGRpcj0+e1xuICAgICAgICAgICAgaWYoZGlyLm5hbWU9PVBSRStcIm1vZGVsXCIpe1xuICAgICAgICAgICAgICAgIERpck1vZGVsKGRpci52YWx1ZSx0aGlzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoZGlyLm5hbWU9PVBSRStcImNsaWNrXCIpe1xuICAgICAgICAgICAgICAgIE9uQ2xpY2soZGlyLnZhbHVlLHRoaXMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIFxuICAgIC8qKuino+aekOWfuuacrOS/oeaBryAqL1xuICAgIHByb3RlY3RlZCBiYXNpY1NldCgpe1xuICAgICAgICB0aGlzLk5vZGVWYWx1ZSA9IHRoaXMuVmRvbS5Ob2RlVmFsdWVcbiAgICAgICAgdGhpcy5Ob2RlTmFtZSA9IHRoaXMuVmRvbS5Ob2RlTmFtZVxuICAgICAgICB0aGlzLk5vZGVUeXBlID0gdGhpcy5WZG9tLk5vZGVUeXBlXG4gICAgICAgIC8v5L+d5a2Y5YWD57Sg5bGe5oCnXG4gICAgICAgIGxldCB2YW5pbGxhQXR0cnM9dGhpcy5WZG9tLkF0dHJzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5WZG9tLkF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYXR0cj10aGlzLlZkb20uQXR0cnNbaV1cbiAgICAgICAgICAgIGxldCBucz1HZXROUyhhdHRyLk5hbWUpXG4gICAgICAgICAgICBpZihucy5uYW1lc3BhY2U9PW51bGwpXG4gICAgICAgICAgICAgICAgbnMubmFtZXNwYWNlPXRoaXMubXZ2bS4kTmFtZXNwYWNlXG4gICAgICAgICAgICBpZihJc0RpcmVjdGl2ZVJlZ2lzdGVyZWQobnMudmFsdWUsbnMubmFtZXNwYWNlKSl7XG4gICAgICAgICAgICAgICAgbGV0IGRpcmVjdGl2ZW9wdGlvbj1HZXREaXJlY3RpdmUobnMudmFsdWUsbnMubmFtZXNwYWNlKVxuICAgICAgICAgICAgICAgIHZhbmlsbGFBdHRycz12YW5pbGxhQXR0cnMuZmlsdGVyKGF0dHI9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWU9YXR0ci5OYW1lXG4gICAgICAgICAgICAgICAgICAgIGlmKFJFR19JTi50ZXN0KGF0dHIuTmFtZSkgfHwgUkVHX09VVC50ZXN0KGF0dHIuTmFtZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVJlZ0V4cC4kMVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzcHJvcD0gZGlyZWN0aXZlb3B0aW9uLnByb3BzLnNvbWUocHJvcD0+cHJvcC5uYW1lPT1uYW1lKVxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNldmVudD1kaXJlY3RpdmVvcHRpb24uZXZlbnRzLnNvbWUoZXZlbnQ9PmV2ZW50PT1uYW1lKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIShpc3Byb3AgfHwgaXNldmVudClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGxldCBkaXJlY3RpdmU9bmV3IERpcmVjdGl2ZSh0aGlzLlZkb20sZGlyZWN0aXZlb3B0aW9uKVxuICAgICAgICAgICAgICAgIGxldCBkaXJlY3RpdmVtdnZtPW5ldyBEaXJlY3RpdmVNVlZNKGRpcmVjdGl2ZW9wdGlvbixkaXJlY3RpdmUsdGhpcylcbiAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMucHVzaChkaXJlY3RpdmVtdnZtKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhbmlsbGFBdHRycz0gdmFuaWxsYUF0dHJzLmZpbHRlcihhdHRyPT57XG4gICAgICAgICAgICBpZihhdHRyLk5hbWU9PVBSRStcIm1vZGVsXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJEaXJlY3RpdmUucHVzaCh7bmFtZTphdHRyLk5hbWUsdmFsdWU6YXR0ci5WYWx1ZX0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihhdHRyLk5hbWU9PVBSRStcImNsaWNrXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJEaXJlY3RpdmUucHVzaCh7bmFtZTphdHRyLk5hbWUsdmFsdWU6YXR0ci5WYWx1ZX0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICB2YW5pbGxhQXR0cnMuZm9yRWFjaChhdHRyPT57XG4gICAgICAgICAgICB0aGlzLkFkZFByb3BlcnR5KGF0dHIuTmFtZSxhdHRyLlZhbHVlKVxuICAgICAgICB9KVxuICAgIH1cbn0iLCJpbXBvcnQgeyBSRUdfU0lOR0xFIH0gZnJvbSBcIi4uL2NvbnN0XCI7XG5pbXBvcnQgeyBNVlZNIH0gZnJvbSAnLi4vbXZ2bS9tdnZtJztcbmltcG9ydCB7IE5ld1ZOb2RlLCBWRG9tIH0gZnJvbSAnLi4vdmRvbS92ZG9tJztcbmltcG9ydCB7IFJFR19BVFRSLCBSRUdfTVVMVEksIFZOb2RlU3RhdHVzIH0gZnJvbSAnLi8uLi9jb25zdCc7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVk5vZGUge1xuICAgIE5vZGVWYWx1ZTogc3RyaW5nXG4gICAgTm9kZU5hbWU6IHN0cmluZ1xuICAgIE5vZGVUeXBlOiBudW1iZXJcbiAgICAvKirmma7pgJrlsZ7mgKcgKi9cbiAgICBBdHRyczogeyBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfVtdID0gW11cbiAgICBcbiAgICBDaGlsZHJlbjogVk5vZGVbXSA9IFtdXG4gICAgRG9tOiBOb2RlXG4gICAgSXNUZW1wbGF0ZSA9IGZhbHNlXG4gICAgSXNDb3B5PWZhbHNlXG4gICAgXG4gICAgcHJvdGVjdGVkIHN0YXR1czpWTm9kZVN0YXR1cz1WTm9kZVN0YXR1cy5BQ1RJVkVcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBWZG9tOlZEb20scHVibGljIG12dm06IE1WVk0scHVibGljIFBhcmVudDpWTm9kZSkge1xuICAgIH1cbiAgICBcbiAgICBBZGRQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYoUkVHX0FUVFIudGVzdChuYW1lKSl7XG4gICAgICAgICAgICB0aGlzLkF0dHJzLnB1c2goe25hbWU6bmFtZSx2YWx1ZTp2YWx1ZX0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJvdGVjdGVkIGRpcmVjdGl2ZUJpbmQoKXt9XG4gICAgLyoq55Sf5oiQ6Jma5ouf6IqC54K55Luj6KGo55qEZG9t5bm25oqK6Ieq5bex5Yqg5YWl54i25LqyZG9t5LitICovXG4gICAgUmVuZGVyKCkgOnZvaWR7XG4gICAgICAgIGlmICh0aGlzLk5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICAgIGxldCBkb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMuTm9kZU5hbWUpXG4gICAgICAgICAgICB0aGlzLkF0dHJzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICAgICAgZG9tLnNldEF0dHJpYnV0ZShwcm9wLm5hbWUsIHByb3AudmFsdWUpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5Eb20gPSBkb20gXG4gICAgICAgICAgICBsZXQgY2hpbGRyZW46Vk5vZGVbXT1bXVxuICAgICAgICAgICAgdGhpcy5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgICAgICBpZighY2hpbGQuSXNDb3B5KVxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAgIGNoaWxkLlJlbmRlcigpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZUJpbmQoKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLk5vZGVUeXBlID09IDMpIHtcbiAgICAgICAgICAgIHRoaXMuRG9tID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5Ob2RlVmFsdWUpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChSRUdfU0lOR0xFLnRlc3QodGhpcy5Ob2RlVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tdnZtLiR3YXRjaCh0aGlzLFJlZ0V4cC4kMSwobmV3dmFsdWUsIG9sZHZhbHVlKT0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkRvbS50ZXh0Q29udGVudCA9IG5ld3ZhbHVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKFJFR19NVUxUSS50ZXN0KHRoaXMuTm9kZVZhbHVlKSl7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXM9dGhpcy5tdWx0aUJpbmRQYXJzZSh0aGlzLk5vZGVWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tdnZtLiR3YXRjaCh0aGlzLHJlcywobmV3dmFsdWUsIG9sZHZhbHVlKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Eb20udGV4dENvbnRlbnQgPSBuZXd2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkRvbS50ZXh0Q29udGVudD10aGlzLk5vZGVWYWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLlBhcmVudCAmJiB0aGlzLlBhcmVudC5Eb20pXG4gICAgICAgICAgICB0aGlzLlBhcmVudC5Eb20uYXBwZW5kQ2hpbGQodGhpcy5Eb20pXG4gICAgfVxuICAgIHByaXZhdGUgbXVsdGlCaW5kUGFyc2Uobm9kZXZhbHVlOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICBsZXQgcmVnPS9cXHtcXHsoW15cXHtcXH1dKilcXH1cXH0vZ1xuICAgICAgICBsZXQgcmVzPXJlZy5leGVjKG5vZGV2YWx1ZSlcbiAgICAgICAgbGV0IGV4cD1cIlwiXG4gICAgICAgIGxldCBsYXN0aW5kZXg9MFxuICAgICAgICB3aGlsZShyZXMpe1xuICAgICAgICAgICAgaWYocmVzLmluZGV4IT1sYXN0aW5kZXgpe1xuICAgICAgICAgICAgICAgIGV4cCs9XCJcXCdcIitub2RldmFsdWUuc3Vic3RyaW5nKGxhc3RpbmRleCxyZXMuaW5kZXgpK1wiXFwnK1wiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0aW5kZXg9cmVzLmluZGV4K3Jlc1swXS5sZW5ndGhcbiAgICAgICAgICAgIGV4cCs9XCIoXCIrUmVnRXhwLiQxK1wiKStcIlxuICAgICAgICAgICAgcmVzPXJlZy5leGVjKG5vZGV2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBpZihleHAubGFzdEluZGV4T2YoXCIrXCIpPT1leHAubGVuZ3RoLTEpe1xuICAgICAgICAgICAgZXhwPWV4cC5zdWJzdHJpbmcoMCxleHAubGVuZ3RoLTEpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwXG4gICAgfVxuICAgIFVwZGF0ZSgpe1xuICAgICAgICAvL3RvZG8g5pu05paw5bGe5oCnXG4gICAgICAgIGlmICh0aGlzLk5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbjogVk5vZGVbXSA9IFtdXG4gICAgICAgICAgICB0aGlzLkNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICAgICAgY2hpbGQuVXBkYXRlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvL3RvZG8g6K6+572u5bGe5oCnXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5Ob2RlVHlwZSA9PSAzKSB7XG4gICAgICAgICAgICBpZiAoUkVHX1NJTkdMRS50ZXN0KHRoaXMuTm9kZVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuRG9tLnRleHRDb250ZW50PXRoaXMubXZ2bS5HZXRFeHBWYWx1ZShSZWdFeHAuJDEpXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihSRUdfTVVMVEkudGVzdCh0aGlzLk5vZGVWYWx1ZSkpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzPXRoaXMubXVsdGlCaW5kUGFyc2UodGhpcy5Ob2RlVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLnRleHRDb250ZW50PXRoaXMubXZ2bS5HZXRFeHBWYWx1ZShyZXMpICAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Eb20udGV4dENvbnRlbnQ9dGhpcy5Ob2RlVmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgUmVmcmVzaCgpIHtcbiAgICAgICAgaWYgKHRoaXMuSXNUZW1wbGF0ZSl7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsZXQgYWxsbm9kZXMgPSB0aGlzLkRvbS5jaGlsZE5vZGVzXG4gICAgICAgIGxldCBhbGx2bm9kZXM6IFZOb2RlW10gPSBbXVxuICAgICAgICB0aGlzLkNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgaWYgKCFjaGlsZC5Jc1RlbXBsYXRlICYmIGNoaWxkLkRvbSE9bnVsbCkge1xuICAgICAgICAgICAgICAgIGFsbHZub2RlcyA9IGFsbHZub2Rlcy5jb25jYXQoY2hpbGQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IHJ1bGVyID0ge1xuICAgICAgICAgICAgb2xkX2o6IC0xLFxuICAgICAgICAgICAgaTogMCxcbiAgICAgICAgICAgIGo6IDBcbiAgICAgICAgfVxuICAgICAgICBsZXQgb3BlcnM6IGFueVtdID0gW11cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGlmIChydWxlci5pID4gYWxsbm9kZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVsZXIuaiA+IGFsbHZub2Rlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgb3BlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGFsbG5vZGVzW3J1bGVyLmldXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBydWxlci5pKytcbiAgICAgICAgICAgICAgICBydWxlci5qID0gcnVsZXIub2xkX2ogKyAxXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbGxub2Rlc1tydWxlci5pXSAhPSBhbGx2bm9kZXNbcnVsZXIual0uRG9tKSB7XG4gICAgICAgICAgICAgICAgcnVsZXIuaisrXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbGxub2Rlc1tydWxlci5pXSA9PSBhbGx2bm9kZXNbcnVsZXIual0uRG9tKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJ1bGVyLmkgPCBydWxlci5qKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHJ1bGVyLm9sZF9qICsgMVxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5kZXggPCBydWxlci5qKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZU5vZGU6IGFsbG5vZGVzW3J1bGVyLmldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGFsbHZub2Rlc1tpbmRleF0uRG9tXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgrK1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJ1bGVyLm9sZF9qID0gcnVsZXIualxuICAgICAgICAgICAgICAgIHJ1bGVyLmkrK1xuICAgICAgICAgICAgICAgIHJ1bGVyLmorK1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHJ1bGVyLmogPCBhbGx2bm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBvcGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIGJlZm9yZU5vZGU6IG51bGwsXG4gICAgICAgICAgICAgICAgbm9kZTogYWxsdm5vZGVzW3J1bGVyLmpdLkRvbVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJ1bGVyLmorK1xuICAgICAgICB9XG4gICAgICAgIG9wZXJzLmZvckVhY2gob3BlciA9PiB7XG4gICAgICAgICAgICBpZiAob3Blci50eXBlID09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgICAgICBpZihvcGVyLmJlZm9yZU5vZGUhPW51bGwpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLmluc2VydEJlZm9yZShvcGVyLm5vZGUsIG9wZXIuYmVmb3JlTm9kZSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLmFwcGVuZENoaWxkKG9wZXIubm9kZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcGVyLnR5cGUgPT0gXCJyZW1vdmVcIilcbiAgICAgICAgICAgICAgICAob3Blci5ub2RlIGFzIEhUTUxFbGVtZW50KS5yZW1vdmUoKVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICB9XG4gICAgQWRkQ2hpbGRyZW4oY2hpbGQ6IFZOb2RlLCBub2RlczogVk5vZGVbXSxvZmZzZXQ6bnVtYmVyKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5DaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuQ2hpbGRyZW5baV0gPT0gY2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNoaWxkcmVuLnNwbGljZShpICsgMStvZmZzZXQsIDAsIC4uLm5vZGVzKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgUmVtb3ZlQ2hpbGRyZW4obm9kZXM6Vk5vZGVbXSl7XG4gICAgICAgIHRoaXMuQ2hpbGRyZW49dGhpcy5DaGlsZHJlbi5maWx0ZXIoY2hpbGQ9PntcbiAgICAgICAgICAgIHJldHVybiBub2Rlcy5pbmRleE9mKGNoaWxkKT09LTFcbiAgICAgICAgfSlcbiAgICB9XG4gICAgT25SZW1vdmVkKCl7XG4gICAgICAgIHRoaXMuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZD0+e1xuICAgICAgICAgICAgaWYoIWNoaWxkLklzQ29weSlcbiAgICAgICAgICAgICAgICBjaGlsZC5PblJlbW92ZWQoKVxuICAgICAgICB9KVxuICAgIH1cbiAgICBcbiAgICBcbiAgICAvKirop6PmnpDln7rmnKzkv6Hmga8gKi9cbiAgICBwcm90ZWN0ZWQgYmFzaWNTZXQoKXtcbiAgICAgICAgdGhpcy5Ob2RlVmFsdWUgPSB0aGlzLlZkb20uTm9kZVZhbHVlXG4gICAgICAgIHRoaXMuTm9kZU5hbWUgPSB0aGlzLlZkb20uTm9kZU5hbWVcbiAgICAgICAgdGhpcy5Ob2RlVHlwZSA9IHRoaXMuVmRvbS5Ob2RlVHlwZVxuICAgICAgICAvL+S/neWtmOWFg+e0oOWxnuaAp1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuVmRvbS5BdHRycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5BZGRQcm9wZXJ0eSh0aGlzLlZkb20uQXR0cnNbaV0uTmFtZSx0aGlzLlZkb20uQXR0cnNbaV0uVmFsdWUpXG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoq6Kej5p6Q6Ieq6IqC54K55L+h5oGvICovXG4gICAgcHJvdGVjdGVkIGNoaWxkU2V0KCl7XG4gICAgICAgIC8v6Kej5p6Q5a2Q6IqC54K5XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5WZG9tLkNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRkb209dGhpcy5WZG9tLkNoaWxkcmVuW2ldXG4gICAgICAgICAgICBsZXQgdmNoaWxkPU5ld1ZOb2RlKGNoaWxkZG9tLHRoaXMubXZ2bSx0aGlzKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZih2Y2hpbGQhPW51bGwpe1xuICAgICAgICAgICAgICAgIHZjaGlsZC5BdHRhY2hEb20oKVxuICAgICAgICAgICAgICAgIHRoaXMuQ2hpbGRyZW4ucHVzaCh2Y2hpbGQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgQXR0YWNoRG9tKCkge1xuICAgICAgICB0aGlzLmJhc2ljU2V0KClcbiAgICAgICAgdGhpcy5jaGlsZFNldCgpXG4gICAgfVxuICAgIFNldFN0YXR1cyhzdGF0dXM6Vk5vZGVTdGF0dXMpe1xuICAgICAgICB0aGlzLnN0YXR1cz1zdGF0dXNcbiAgICAgICAgdGhpcy5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkPT57XG4gICAgICAgICAgICBpZighY2hpbGQuSXNDb3B5KVxuICAgICAgICAgICAgICAgIGNoaWxkLlNldFN0YXR1cyhzdGF0dXMpXG4gICAgICAgIH0pXG4gICAgfVxuICAgIEdldFN0YXR1cygpe1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXNcbiAgICB9XG59Il19
