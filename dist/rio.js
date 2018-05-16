(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIR_MODEL = "model";
exports.DIR_EVENT_CLICK = "click";
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
/**测试输入项 */
exports.REG_TEST_INPUT = /^((model))$/;
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
var model_1 = require("./model");
var onclick_1 = require("./onclick");
function DirectiveBind(vnode) {
    var inputs = vnode.GetInput();
    for (var name_1 in inputs) {
        switch (name_1) {
            case "model":
                model_1.DirModel(inputs[name_1], vnode);
                break;
        }
    }
    var outputs = vnode.GetOutput();
    for (var name_2 in outputs) {
        switch (name_2) {
            case "click":
                onclick_1.OnClick(outputs[name_2], vnode);
                break;
        }
    }
}
exports.DirectiveBind = DirectiveBind;

},{"./model":3,"./onclick":4}],3:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
function DirModel(exp, vnode) {
    var inputtype = vnode.Vdom.GetAttr("type");
    var input = vnode.Vdom.NodeName.toLowerCase();
    if (input == "input" && inputtype == "checkbox") {
        vnode.mvvm.$watchExpOrFunc(vnode, exp, function (newvalue) {
            setValue(vnode, newvalue);
        }, true);
    }
    else {
        vnode.mvvm.$watchExpOrFunc(vnode, exp, function (newvalue) {
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

},{}],4:[function(require,module,exports){
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

},{"../const":1}],5:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var components_manager_1 = require("./manager/components-manager");
var value_manager_1 = require("./manager/value-manager");
window.Rio = {
    component: function (name, option) {
        option.$name = name;
        components_manager_1.RegisterComponent(option, "default");
        return this;
    },
    value: function (value) {
        value_manager_1.RegisterValue(value, "default");
        return this;
    },
    namespace: function (namespace) {
        var nc = function (name, options) {
            options.$name = name;
            components_manager_1.RegisterComponent(options, namespace);
            return wrap;
        };
        var nv = function (value) {
            value_manager_1.RegisterValue(value, namespace);
            return wrap;
        };
        var wrap = {
            component: nc,
            value: nv
        };
        return wrap;
    }
};
document.addEventListener("DOMContentLoaded", function () {
    components_manager_1.Start();
});

},{"./manager/components-manager":6,"./manager/value-manager":7}],6:[function(require,module,exports){
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
function RegisterComponent(option, namespace) {
    option.$namespace = namespace.toLowerCase();
    if (namespaces[namespace] == null)
        namespaces[namespace] = {};
    var components = namespaces[namespace];
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

},{"../mvvm/mvvm":9,"../util":14,"../vdom/vdom":15,"../vnode/custom-node":16}],7:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var namespaces = {
    "default": {}
};
function RegisterValue(value, namespace) {
    if (namespaces[namespace] == null)
        namespaces[namespace] = {};
    var values = namespaces[namespace];
    for (var key in value) {
        values[key] = value[key];
    }
}
exports.RegisterValue = RegisterValue;
function GetValue(name, namespace) {
    return namespaces[namespace] && namespaces[namespace][name];
}
exports.GetValue = GetValue;
function GetValues(namespace) {
    return namespaces[namespace];
}
exports.GetValues = GetValues;
function IsValueRegistered(name, namespace) {
    if (namespaces[namespace] && namespaces[namespace][name])
        return true;
    else
        return false;
}
exports.IsValueRegistered = IsValueRegistered;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
        if (option.data != null)
            this.$data = JSON.parse(JSON.stringify(option.data));
        else
            this.$data = {};
        this.$methods = option.methods || {};
        this.$name = option.$name || "";
        this.$computed = option.computed || {};
        this.$template = option.template;
        this.$Namespace = option.$namespace;
        this.$domtree = option.$domtree;
        if (option.methods && option.methods.$init) {
            option.methods.$init.call(this);
        }
        this.$Ins = option.props || [];
        this.$Outs = option.events || [];
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
                _this.$FenceNode.mvvm.$watchExpOrFunc(_this.$FenceNode, key, function (newvalue, oldvalue) {
                    _this[key] = newvalue;
                });
                _this.$observe.ReactiveKey(_this, key, true);
            });
            Object.keys(this.$FenceNode.mvvm.$computed).forEach(function (key) {
                _this.$FenceNode.mvvm.$watchExpOrFunc(_this.$FenceNode, key, function (newvalue, oldvalue) {
                    _this[key] = newvalue;
                });
                _this.$observe.ReactiveKey(_this, key, true);
            });
        }
        this.$Ins.forEach(function (prop) {
            if (_this.$FenceNode.GetIn(prop.name) == null && prop.required) {
                throw new Error("component \'" + _this.$name + "\' need prop \'" + prop.name);
            }
            var inName = _this.$FenceNode.GetIn(prop.name);
            _this.$FenceNode.mvvm.$watchExpOrFunc(_this.$FenceNode, inName, function (newvalue, oldvalue) {
                _this.$checkProp(prop, newvalue);
                _this[prop.name] = newvalue;
            });
            _this.$observe.ReactiveKey(_this, prop.name, true);
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
    MVVM.prototype.$watchExpOrFunc = function (vnode, exp, listener, arraydeep) {
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

},{}],15:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("../vnode/vnode");
var components_manager_1 = require("../manager/components-manager");
var mvvm_1 = require("../mvvm/mvvm");
var util_1 = require("../util");
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
function NewVNode(dom, mvvm, parent) {
    if (dom.NodeName.toLowerCase() == "slot") {
        var SlotNode = require("../vnode/slot-node").SlotNode;
        return new SlotNode(dom, mvvm, parent, dom.GetAttr("name"));
    }
    if (dom.GetAttr("[for]") != null) {
        var ForNode = require("../vnode/for-node").ForNode;
        return new ForNode(dom, mvvm, parent, dom.GetAttr("[for]"));
    }
    if (dom.GetAttr("[if]") != null) {
        var IfNode = require("../vnode/if-node").IfNode;
        return new IfNode(dom, mvvm, parent, dom.GetAttr("[if]"));
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
    return new vnode_1.VNode(dom, mvvm, parent);
}
exports.NewVNode = NewVNode;
function NewVNodeNoFor(dom, mvvm, parent) {
    if (dom.NodeName.toLowerCase() == "slot") {
        var SlotNode = require("../vnode/slot-node").SlotNode;
        return new SlotNode(dom, mvvm, parent, dom.GetAttr("name"));
    }
    if (dom.GetAttr("[if]") != null) {
        var IfNode = require("../vnode/if-node").IfNode;
        return new IfNode(dom, mvvm, parent, dom.GetAttr("[if]"));
    }
    var ns = util_1.GetNS(dom.NodeName);
    if (components_manager_1.IsComponentRegistered(ns.value, ns.namespace || "default")) {
        var option = components_manager_1.GetComponent(ns.value, ns.namespace || "default");
        var surroundmvvm = new mvvm_1.MVVM(option);
        var CustomNode = require("../vnode/custom-node").CustomNode;
        var cust = new CustomNode(dom, mvvm, parent, surroundmvvm);
        surroundmvvm.$FenceNode = cust;
        cust.ParseTemplate();
        return cust;
    }
    return new vnode_1.VNode(dom, mvvm, parent);
}
exports.NewVNodeNoFor = NewVNodeNoFor;
function NewVNodeNoForNoIf(dom, mvvm, parent) {
    if (dom.NodeName.toLowerCase() == "slot") {
        var SlotNode = require("../vnode/slot-node").SlotNode;
        return new SlotNode(dom, mvvm, parent, dom.GetAttr("name"));
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
    return new vnode_1.VNode(dom, mvvm, parent);
}
exports.NewVNodeNoForNoIf = NewVNodeNoForNoIf;

},{"../manager/components-manager":6,"../mvvm/mvvm":9,"../util":14,"../vnode/custom-node":16,"../vnode/for-node":17,"../vnode/if-node":18,"../vnode/slot-node":19,"../vnode/vnode":21}],16:[function(require,module,exports){
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
            this.SurroundMvvm.$TreeRoot = new vnode_1.VNode(domtree, this.SurroundMvvm, null);
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
    CustomNode.prototype.testOutput = function (name) {
        if (this.SurroundMvvm.$Outs.indexOf(name) == -1)
            return false;
        return true;
    };
    CustomNode.prototype.testInput = function (name) {
        return this.SurroundMvvm.$Ins.some(function (prop) {
            return prop.name == name;
        });
    };
    CustomNode.prototype.OnRemoved = function () {
        this.SurroundMvvm.$ondestroy();
    };
    CustomNode.prototype.SetStatus = function (status) {
        this.status = status;
        this.SurroundMvvm.$TreeRoot.SetStatus(status);
    };
    return CustomNode;
}(vnode_1.VNode));
exports.CustomNode = CustomNode;

},{"../manager/components-manager":6,"../mvvm/mvvm":9,"../util":14,"../vdom/vdom":15,"./template-node":20,"./vnode":21}],17:[function(require,module,exports){
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
        var mvvm = new mvvm_1.MVVM({ props: [{ name: itemexp, required: true }] });
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
                var vnode = vdom_1.NewVNodeNoFor(this.Vdom, custnode.SurroundMvvm, null);
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
        this.mvvm.$watchExpOrFunc(this, this.ForExp.arrayExp + ".length", this.reImplementForExp.bind(this));
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

},{"../const":1,"../models":8,"../mvvm/mvvm":9,"../vdom/vdom":15,"./custom-node":16,"./vnode":21}],18:[function(require,module,exports){
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
        this.mvvm.$watchExpOrFunc(this, this.ifExp, function (newvalue) { return _this.reImpletement(newvalue); });
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
        this.dynamicVNode = vdom_1.NewVNodeNoForNoIf(this.Vdom, this.mvvm, null);
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

},{"../const":1,"../vdom/vdom":15,"./vnode":21}],19:[function(require,module,exports){
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

},{"./vnode":21}],20:[function(require,module,exports){
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

},{"./vnode":21}],21:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./../const");
var const_2 = require("../const");
var dir_handler_1 = require("../directive/dir-handler");
var vdom_1 = require("../vdom/vdom");
var util_1 = require("../util");
var VNode = /** @class */ (function () {
    function VNode(Vdom, mvvm, Parent) {
        this.Vdom = Vdom;
        this.mvvm = mvvm;
        this.Parent = Parent;
        /**普通属性 */
        this.Attrs = [];
        /**指令属性 */
        this.Children = [];
        this.IsTemplate = false;
        this.IsCopy = false;
        //输入与输出值
        this.ins_pure = {};
        this.ins_exp = {};
        this.outs = {};
        this.status = const_1.VNodeStatus.ACTIVE;
    }
    VNode.prototype.AddProperty = function (name, value) {
        value = value.trim();
        if (const_1.REG_IN.test(name)) {
            var attr = RegExp.$1;
            if (attr == "for" || attr == "if")
                return;
            if (!this.testInput(attr)) {
                util_1.LogError("prop " + attr + " not exist on " + this.NodeName);
                return;
            }
            if (const_1.REG_STR.test(value))
                this.ins_pure[attr] = RegExp.$2;
            else
                this.ins_exp[attr] = value;
            return;
        }
        if (const_1.REG_OUT.test(name)) {
            if (!this.testOutput(RegExp.$1)) {
                util_1.LogError("event " + RegExp.$1 + " not exist on " + this.NodeName);
                return;
            }
            this.outs[RegExp.$1] = value;
            return;
        }
        if (const_1.REG_ATTR.test(name)) {
            this.Attrs.push({ name: name, value: value });
        }
    };
    VNode.prototype.GetOutput = function () {
        return this.outs;
    };
    VNode.prototype.GetInput = function () {
        return this.ins_exp;
    };
    VNode.prototype.testOutput = function (name) {
        return const_1.REG_TEST_OUTPUT.test(name);
    };
    VNode.prototype.testInput = function (name) {
        return const_1.REG_TEST_INPUT.test(name);
    };
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
            //todo 设置属性
            dir_handler_1.DirectiveBind(this);
        }
        if (this.NodeType == 3) {
            this.Dom = document.createTextNode(this.NodeValue);
            if (const_2.REG_SINGLE.test(this.NodeValue)) {
                this.mvvm.$watchExpOrFunc(this, RegExp.$1, function (newvalue, oldvalue) {
                    _this.Dom.textContent = newvalue;
                });
            }
            else {
                if (const_1.REG_MULTI.test(this.NodeValue)) {
                    var res = this.multiBindParse(this.NodeValue);
                    this.mvvm.$watchExpOrFunc(this, res, function (newvalue, oldvalue) {
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
            if (const_2.REG_SINGLE.test(this.NodeValue)) {
                this.Dom.textContent = this.mvvm.GetExpValue(RegExp.$1);
            }
            else {
                if (const_1.REG_MULTI.test(this.NodeValue)) {
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

},{"../const":1,"../directive/dir-handler":2,"../util":14,"../vdom/vdom":15,"./../const":1}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3QudHMiLCJzcmMvZGlyZWN0aXZlL2Rpci1oYW5kbGVyLnRzIiwic3JjL2RpcmVjdGl2ZS9tb2RlbC50cyIsInNyYy9kaXJlY3RpdmUvb25jbGljay50cyIsInNyYy9tYWluLnRzIiwic3JjL21hbmFnZXIvY29tcG9uZW50cy1tYW5hZ2VyLnRzIiwic3JjL21hbmFnZXIvdmFsdWUtbWFuYWdlci50cyIsInNyYy9tb2RlbHMudHMiLCJzcmMvbXZ2bS9tdnZtLnRzIiwic3JjL212dm0vcmV2b2tlLWV2ZW50LnRzIiwic3JjL29ic2VydmVyL21zZy1xdWV1ZS50cyIsInNyYy9vYnNlcnZlci9vYnNlcnZlLnRzIiwic3JjL29ic2VydmVyL3dhdGNoZXIudHMiLCJzcmMvdXRpbC50cyIsInNyYy92ZG9tL3Zkb20udHMiLCJzcmMvdm5vZGUvY3VzdG9tLW5vZGUudHMiLCJzcmMvdm5vZGUvZm9yLW5vZGUudHMiLCJzcmMvdm5vZGUvaWYtbm9kZS50cyIsInNyYy92bm9kZS9zbG90LW5vZGUudHMiLCJzcmMvdm5vZGUvdGVtcGxhdGUtbm9kZS50cyIsInNyYy92bm9kZS92bm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBYSxRQUFBLFNBQVMsR0FBRyxPQUFPLENBQUE7QUFDbkIsUUFBQSxlQUFlLEdBQUcsT0FBTyxDQUFBO0FBRXRDLGdCQUFnQjtBQUNILFFBQUEsVUFBVSxHQUFHLHNCQUFzQixDQUFBO0FBQ25DLFFBQUEsU0FBUyxHQUFHLGVBQWUsQ0FBQTtBQUN4QyxjQUFjO0FBQ0QsUUFBQSxTQUFTLEdBQUMsaUJBQWlCLENBQUE7QUFDeEMsU0FBUztBQUNJLFFBQUEsT0FBTyxHQUFDLGlCQUFpQixDQUFBO0FBQ3pCLFFBQUEsV0FBVyxHQUFDLGVBQWUsQ0FBQTtBQUV4QyxVQUFVO0FBQ0csUUFBQSxNQUFNLEdBQUMsYUFBYSxDQUFBO0FBQ2pDLFVB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Q25CLENBQUM7SUFDRCx5QkFBUyxHQUFULFVBQVUsTUFBa0I7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBQyxNQUFNLENBQUE7UUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1lBQ3ZCLElBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFDWixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQy9CLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUNELHlCQUFTLEdBQVQ7UUFDSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDdEIsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQXJSQSxBQXFSQyxJQUFBO0FBclJZLHNCQUFLIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0IGNvbnN0IERJUl9NT0RFTCA9IFwibW9kZWxcIlxuZXhwb3J0IGNvbnN0IERJUl9FVkVOVF9DTElDSyA9IFwiY2xpY2tcIlxuXG4vKiroirHmi6zlj7fmlbDmja7nu5Hlrprooajovr7lvI8gKi9cbmV4cG9ydCBjb25zdCBSRUdfU0lOR0xFID0gL15cXHtcXHsoW15cXHtcXH1dKilcXH1cXH0kL1xuZXhwb3J0IGNvbnN0IFJFR19NVUxUSSA9IC9cXHtcXHsoLio/KVxcfVxcfS9cbi8qKuS6i+S7tuebkeWQrOWTjeW6lOWHveaVsCAqL1xuZXhwb3J0IGNvbnN0IFJFR19FVkVOVD0vXihcXHcrKVxcKCguKilcXCkkL1xuLyoq5a2X56ym5LiyICovXG5leHBvcnQgY29uc3QgUkVHX1NUUj0vXihbJ1wiXSkoLio/KVxcMSQvXG5leHBvcnQgY29uc3QgUkVHX01JRF9TVFI9LyhbJ1wiXSkoLio/KVxcMS9cblxuLyoq6L6T5YWl5bGe5oCnICovXG5leHBvcnQgY29uc3QgUkVHX0lOPS9eXFxbKFxcdyspXFxdJC9cbi8qKui+k+WHuuS6i+S7tiAqL1xuZXhwb3J0IGNvbnN0IFJFR19PVVQ9L15cXCgoXFx3KylcXCkkL1xuLyoq5q2j5bi45bGe5oCnICovXG5leHBvcnQgY29uc3QgUkVHX0FUVFI9L15bQS16X11cXHcqJC9cblxuLyoq5rWL6K+V6L6T5YWl6aG5ICovXG5leHBvcnQgY29uc3QgUkVHX1RFU1RfSU5QVVQ9L14oKG1vZGVsKSkkL1xuLyoq5rWL6K+V6L6T5Ye66aG5ICovXG5leHBvcnQgY29uc3QgUkVHX1RFU1RfT1VUUFVUPS9eKChjbGljaykpJC9cblxuZXhwb3J0IGVudW0gVk5vZGVTdGF0dXN7XG4gICAgLyoq5L6d54S25aSE5LqOdm5vZGXmoJHkuK0gKi9cbiAgICBBQ1RJVkUsXG4gICAgLyoq5LiN5Zyodm5vZGXmoJHkuK3kvYbmmK/mnInlj6/og73ph43mlrDliqDlm57mnaUgKi9cbiAgICBJTkFDVElWRSxcbiAgICAvKirmipvlvIMgKi9cbiAgICBERVBSRUNBVEVEXG59IiwiaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi4vdm5vZGUvdm5vZGVcIjtcbmltcG9ydCB7IERpck1vZGVsIH0gZnJvbSBcIi4vbW9kZWxcIjtcbmltcG9ydCB7IE9uQ2xpY2sgfSBmcm9tIFwiLi9vbmNsaWNrXCI7XG5leHBvcnQgZnVuY3Rpb24gRGlyZWN0aXZlQmluZCh2bm9kZTogVk5vZGUpIHtcbiAgICBsZXQgaW5wdXRzPXZub2RlLkdldElucHV0KClcbiAgICBmb3IobGV0IG5hbWUgaW4gaW5wdXRzKXtcbiAgICAgICAgc3dpdGNoKG5hbWUpe1xuICAgICAgICAgICAgY2FzZSBcIm1vZGVsXCI6XG4gICAgICAgICAgICBEaXJNb2RlbChpbnB1dHNbbmFtZV0sdm5vZGUpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBsZXQgb3V0cHV0cz12bm9kZS5HZXRPdXRwdXQoKVxuICAgIGZvcihsZXQgbmFtZSBpbiBvdXRwdXRzKXtcbiAgICAgICAgc3dpdGNoKG5hbWUpe1xuICAgICAgICAgICAgY2FzZSBcImNsaWNrXCI6XG4gICAgICAgICAgICBPbkNsaWNrKG91dHB1dHNbbmFtZV0sdm5vZGUpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBWTm9kZSB9IGZyb20gXCIuLi92bm9kZS92bm9kZVwiXG5leHBvcnQgZnVuY3Rpb24gRGlyTW9kZWwoZXhwOiBzdHJpbmcsIHZub2RlOiBWTm9kZSkge1xuICAgIGxldCBpbnB1dHR5cGU9dm5vZGUuVmRvbS5HZXRBdHRyKFwidHlwZVwiKVxuICAgIGxldCBpbnB1dD12bm9kZS5WZG9tLk5vZGVOYW1lLnRvTG93ZXJDYXNlKClcbiAgICBpZihpbnB1dD09XCJpbnB1dFwiICYmIGlucHV0dHlwZT09XCJjaGVja2JveFwiKXtcbiAgICAgICAgdm5vZGUubXZ2bS4kd2F0Y2hFeHBPckZ1bmModm5vZGUsZXhwLCAobmV3dmFsdWUpID0+IHtcbiAgICAgICAgICAgIHNldFZhbHVlKHZub2RlLCBuZXd2YWx1ZSlcbiAgICAgICAgfSx0cnVlKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgdm5vZGUubXZ2bS4kd2F0Y2hFeHBPckZ1bmModm5vZGUsZXhwLCAobmV3dmFsdWUpID0+IHtcbiAgICAgICAgICAgIHNldFZhbHVlKHZub2RlLCBuZXd2YWx1ZSlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHZub2RlLkRvbS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgLy9zZWxlY3Tmjqfku7ZcbiAgICAgICAgaWYgKHZub2RlLk5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgdm5vZGUubXZ2bS5TZXRWYWx1ZShleHAsIGV2ZW50LnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIC8vdGV4dCByYWRpbyBjaGVja2JveOaOp+S7tlxuICAgICAgICBsZXQgaW5wdXRUeXBlID0gKHZub2RlLkRvbSBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwidHlwZVwiKVxuICAgICAgICBpZiAoaW5wdXRUeXBlID09IG51bGwgfHwgaW5wdXRUeXBlID09IFwiXCIpXG4gICAgICAgICAgICBpbnB1dFR5cGUgPSBcInRleHRcIlxuICAgICAgICBzd2l0Y2ggKGlucHV0VHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJyYWRpb1wiOlxuICAgICAgICAgICAgICAgIHZub2RlLm12dm0uU2V0VmFsdWUoZXhwLCBldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxuICAgICAgICAgICAgICAgIGxldCBjdXIgPSB2bm9kZS5tdnZtLkdldEV4cFZhbHVlKGV4cClcbiAgICAgICAgICAgICAgICBpZiAodG9TdHJpbmcuY2FsbChjdXIpID09IFwiW29iamVjdCBBcnJheV1cIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkYXJyYXkgPSBjdXIgYXMgQXJyYXk8YW55PjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gb2xkYXJyYXkuaW5kZXhPZihldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkYXJyYXkucHVzaChldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRhcnJheS5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIHNldFZhbHVlKHZub2RlOiBWTm9kZSwgbmV3dmFsdWU6IGFueSkge1xuICAgIC8vc2VsZWN05o6n5Lu2XG4gICAgaWYgKHZub2RlLk5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJzZWxlY3RcIikge1xuICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gbmV3dmFsdWVcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vdGV4dCByYWRpbyBjaGVja2JveOaOp+S7tlxuICAgIGxldCBpbnB1dFR5cGUgPSAodm5vZGUuRG9tIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpXG4gICAgaWYgKGlucHV0VHlwZSA9PSBudWxsIHx8IGlucHV0VHlwZSA9PSBcIlwiKVxuICAgICAgICBpbnB1dFR5cGUgPSBcInRleHRcIlxuICAgIHN3aXRjaCAoaW5wdXRUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gbmV3dmFsdWVcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJyYWRpb1wiOlxuICAgICAgICAgICAgaWYgKCh2bm9kZS5Eb20gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPT0gbmV3dmFsdWUpIHtcbiAgICAgICAgICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxuICAgICAgICAgICAgaWYgKHRvU3RyaW5nLmNhbGwobmV3dmFsdWUpID09IFwiW29iamVjdCBBcnJheV1cIikge1xuICAgICAgICAgICAgICAgIGlmIChuZXd2YWx1ZS5pbmRleE9mKCh2bm9kZS5Eb20gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICh2bm9kZS5Eb20gYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICh2bm9kZS5Eb20gYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxufSIsImltcG9ydCB7UkVHX0VWRU5ULCBSRUdfU1RSfSBmcm9tIFwiLi4vY29uc3RcIlxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi4vdm5vZGUvdm5vZGVcIjtcbmV4cG9ydCBmdW5jdGlvbiBPbkNsaWNrKGRpcjpzdHJpbmcsdm5vZGU6Vk5vZGUpe1xuICAgIGlmIChSRUdfRVZFTlQudGVzdChkaXIpKSB7XG4gICAgICAgIGxldCBtZXRob2RTdHIgPSBSZWdFeHAuJDFcbiAgICAgICAgbGV0IHBhcmFtc1N0ciA9IFJlZ0V4cC4kMlxuICAgICAgICBpZiAocGFyYW1zU3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwcyA9IHBhcmFtc1N0ci5zcGxpdChcIixcIilcbiAgICAgICAgICAgIHZub2RlLkRvbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwYXJhbXM6IGFueVtdID0gW11cbiAgICAgICAgICAgICAgICBwcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIVJFR19TVFIudGVzdChwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2godHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwID09PSBcImZhbHNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuID0gbmV3IE51bWJlcihwKS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4obikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChuLnZhbHVlT2YoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ogq/lrprmmK/mnKzlnLDlj5jph49cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaCh2bm9kZS5tdnZtLkdldEV4cFZhbHVlKHApKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goUmVnRXhwLiQyKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB2bm9kZS5tdnZtLlJldm9rZU1ldGhvZChtZXRob2RTdHIsIC4uLnBhcmFtcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdm5vZGUuRG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdm5vZGUubXZ2bS5SZXZva2VNZXRob2QobWV0aG9kU3RyKSAgXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IFJlZ2lzdGVyQ29tcG9uZW50LCBTdGFydCB9IGZyb20gXCIuL21hbmFnZXIvY29tcG9uZW50cy1tYW5hZ2VyXCI7XG5pbXBvcnQgeyBNVlZNQ29tcG9uZW50T3B0aW9uIH0gZnJvbSBcIi4vbW9kZWxzXCI7XG5pbXBvcnQgeyBSZWdpc3RlclZhbHVlIH0gZnJvbSBcIi4vbWFuYWdlci92YWx1ZS1tYW5hZ2VyXCI7XG4oPGFueT53aW5kb3cpLlJpbz17XG4gICAgY29tcG9uZW50OmZ1bmN0aW9uKG5hbWU6c3RyaW5nLG9wdGlvbjpNVlZNQ29tcG9uZW50T3B0aW9uKXtcbiAgICAgICAgb3B0aW9uLiRuYW1lPW5hbWVcbiAgICAgICAgUmVnaXN0ZXJDb21wb25lbnQob3B0aW9uLFwiZGVmYXVsdFwiKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG4gICAgdmFsdWU6ZnVuY3Rpb24odmFsdWU6e1tuYW1lOnN0cmluZ106YW55fSl7XG4gICAgICAgIFJlZ2lzdGVyVmFsdWUodmFsdWUsXCJkZWZhdWx0XCIpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICBuYW1lc3BhY2U6ZnVuY3Rpb24obmFtZXNwYWNlOnN0cmluZyl7XG4gICAgICAgIGxldCBuYz1mdW5jdGlvbihuYW1lOnN0cmluZyxvcHRpb25zOk1WVk1Db21wb25lbnRPcHRpb24pe1xuICAgICAgICAgICAgb3B0aW9ucy4kbmFtZT1uYW1lXG4gICAgICAgICAgICBSZWdpc3RlckNvbXBvbmVudChvcHRpb25zLG5hbWVzcGFjZSlcbiAgICAgICAgICAgIHJldHVybiB3cmFwXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG52PWZ1bmN0aW9uKHZhbHVlOmFueSl7XG4gICAgICAgICAgICBSZWdpc3RlclZhbHVlKHZhbHVlLG5hbWVzcGFjZSlcbiAgICAgICAgICAgIHJldHVybiB3cmFwXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHdyYXA9e1xuICAgICAgICAgICAgY29tcG9uZW50Om5jLFxuICAgICAgICAgICAgdmFsdWU6bnZcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd3JhcFxuICAgIH1cbn1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24oKXtcbiAgICBTdGFydCgpXG59KSIsImltcG9ydCB7IFZEb20gfSBmcm9tICcuLy4uL3Zkb20vdmRvbSc7XG5pbXBvcnQgeyBNVlZNQ29tcG9uZW50T3B0aW9uIH0gZnJvbSBcIi4uL21vZGVsc1wiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IEN1c3RvbU5vZGUgfSBmcm9tIFwiLi4vdm5vZGUvY3VzdG9tLW5vZGVcIjtcbmltcG9ydCB7IFRyYXZlcnNlRG9tIH0gZnJvbSBcIi4uL3Zkb20vdmRvbVwiO1xuaW1wb3J0IHsgR2V0TlMsIEh0dHBHZXQsIExvZ0Vycm9yIH0gZnJvbSBcIi4uL3V0aWxcIjtcblxubGV0IHJvb3RzOntvcHRpb246TVZWTUNvbXBvbmVudE9wdGlvbixkb206Tm9kZX1bXT1bXVxubGV0IG5hbWVzcGFjZXM6e1tuYW1lc3BhY2U6c3RyaW5nXTp7W2NvbXBvbmVudDpzdHJpbmddOk1WVk1Db21wb25lbnRPcHRpb259fT17XG4gICAgXCJkZWZhdWx0XCI6e1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBTdGFydCgpe1xuICAgIGZpcnN0UmVuZGVyKGRvY3VtZW50LmJvZHkpXG4gICAgcm9vdHMuZm9yRWFjaChyb290PT57XG4gICAgICAgIGxldCBkb210cmVlPVRyYXZlcnNlRG9tKHJvb3QuZG9tKVxuXG4gICAgICAgIGxldCBtb3VudG12dm09bmV3IE1WVk0ocm9vdC5vcHRpb24pXG4gICAgICAgIGxldCBjdXN0bm9kZT1uZXcgQ3VzdG9tTm9kZShkb210cmVlLG51bGwsbnVsbCxtb3VudG12dm0pXG4gICAgICAgIGN1c3Rub2RlLlBhcnNlVGVtcGxhdGUoKVxuICAgICAgICBtb3VudG12dm0uJEZlbmNlTm9kZT1jdXN0bm9kZVxuICAgICAgICBjdXN0bm9kZS5BdHRhY2hEb20oKVxuICAgICAgICBsZXQgY29udGVudD1tb3VudG12dm0uUmVuZGVyKClcbiAgICAgICAgcm9vdC5kb20ucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQoY29udGVudCxyb290LmRvbSlcbiAgICB9KVxufVxuZnVuY3Rpb24gZmlyc3RSZW5kZXIoZG9tOkhUTUxFbGVtZW50KXtcbiAgICBsZXQgbnM9R2V0TlMoZG9tLm5vZGVOYW1lKVxuICAgIGlmKElzQ29tcG9uZW50UmVnaXN0ZXJlZChucy52YWx1ZSxucy5uYW1lc3BhY2V8fFwiZGVmYXVsdFwiKSl7XG4gICAgICAgIGxldCBjb21wb25lbnQ9R2V0Q29tcG9uZW50KG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8XCJkZWZhdWx0XCIpXG4gICAgICAgIHJvb3RzLnB1c2goe29wdGlvbjpjb21wb25lbnQsZG9tOmRvbX0pXG4gICAgfWVsc2V7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZG9tLmNoaWxkcmVuLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbGV0IGNoaWxkPWRvbS5jaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudFxuICAgICAgICAgICAgZmlyc3RSZW5kZXIoY2hpbGQpXG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gUmVnaXN0ZXJDb21wb25lbnQob3B0aW9uOk1WVk1Db21wb25lbnRPcHRpb24sbmFtZXNwYWNlOnN0cmluZyl7XG4gICAgb3B0aW9uLiRuYW1lc3BhY2U9bmFtZXNwYWNlLnRvTG93ZXJDYXNlKClcbiAgICBcbiAgICBpZihuYW1lc3BhY2VzW25hbWVzcGFjZV09PW51bGwpXG4gICAgICAgIG5hbWVzcGFjZXNbbmFtZXNwYWNlXT17fVxuICAgIGxldCBjb21wb25lbnRzPW5hbWVzcGFjZXNbbmFtZXNwYWNlXVxuICAgIGNvbXBvbmVudHNbb3B0aW9uLiRuYW1lXT1vcHRpb25cbn1cbmV4cG9ydCBmdW5jdGlvbiBHZXRDb21wb25lbnQobmFtZTpzdHJpbmcsbmFtZXNwYWNlOnN0cmluZyk6TVZWTUNvbXBvbmVudE9wdGlvbntcbiAgICBuYW1lPW5hbWUudG9Mb3dlckNhc2UoKVxuICAgIG5hbWVzcGFjZT1uYW1lc3BhY2UudG9Mb3dlckNhc2UoKVxuICAgIGxldCBvcHRpb249bmFtZXNwYWNlc1tuYW1lc3BhY2VdICYmIG5hbWVzcGFjZXNbbmFtZXNwYWNlXVtuYW1lXVxuICAgIGlmKG9wdGlvbiAmJiBvcHRpb24uJGlkPT1udWxsKVxuICAgICAgICBwcmVUcmVhdG1lbnQob3B0aW9uKVxuICAgIHJldHVybiBvcHRpb25cbn1cbmV4cG9ydCBmdW5jdGlvbiBJc0NvbXBvbmVudFJlZ2lzdGVyZWQobmFtZTpzdHJpbmcsbmFtZXNwYWNlOnN0cmluZyl7XG4gICAgbmFtZT1uYW1lLnRvTG93ZXJDYXNlKClcbiAgICBuYW1lc3BhY2U9bmFtZXNwYWNlLnRvTG93ZXJDYXNlKClcbiAgICBpZihuYW1lc3BhY2VzW25hbWVzcGFjZV0gJiYgbmFtZXNwYWNlc1tuYW1lc3BhY2VdW25hbWVdKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG59XG5mdW5jdGlvbiBwcmVUcmVhdG1lbnQob3B0aW9uOk1WVk1Db21wb25lbnRPcHRpb24pe1xuICAgIC8v5ZSv5LiA5qCH6K+GXG4gICAgb3B0aW9uLiRpZD1vcHRpb24uJG5hbWVzcGFjZStcIl9cIitvcHRpb24uJG5hbWVcbiAgICAvL+aooeeJiFxuICAgIGlmKG9wdGlvbi50ZW1wbGF0ZVVybCE9bnVsbCl7XG4gICAgICAgIG9wdGlvbi50ZW1wbGF0ZT1IdHRwR2V0KG9wdGlvbi50ZW1wbGF0ZVVybClcbiAgICAgICAgaWYob3B0aW9uLnRlbXBsYXRlPT1udWxsKXtcbiAgICAgICAgICAgIExvZ0Vycm9yKFwicGF0aCBcIitvcHRpb24udGVtcGxhdGVVcmwrXCIgbm90IGZvdW5kXCIpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBsZXQgZG9tPShuZXcgRE9NUGFyc2VyKCkpLnBhcnNlRnJvbVN0cmluZyhvcHRpb24udGVtcGxhdGUsXCJ0ZXh0L2h0bWxcIikuYm9keS5jaGlsZHJlblswXVxuICAgIG9wdGlvbi4kZG9tdHJlZT1UcmF2ZXJzZURvbShkb20pXG4gICAgLy/moLflvI9cbiAgICBpZihvcHRpb24uc3R5bGVVcmwhPW51bGwpe1xuICAgICAgICBvcHRpb24uc3R5bGU9SHR0cEdldChvcHRpb24uc3R5bGVVcmwpXG4gICAgfVxuICAgIGlmKG9wdGlvbi5zdHlsZSE9bnVsbCl7XG4gICAgICAgIGxldCBjc3M9b3B0aW9uLnN0eWxlLnJlcGxhY2UoLyg/IVxccykoW15cXHtcXH1dKykoPz1cXHtbXlxce1xcfV0qXFx9KS9nLGZ1bmN0aW9uKHN0cil7XG4gICAgICAgICAgICByZXR1cm4gc3RyK1wiW1wiK29wdGlvbi4kaWQrXCJdXCJcbiAgICAgICAgfSlcbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGNzcztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgIGFkZEF0dHIob3B0aW9uLiRkb210cmVlLG9wdGlvbi4kaWQpXG4gICAgfVxufVxuZnVuY3Rpb24gYWRkQXR0cihkb206VkRvbSxhdHRyOnN0cmluZyl7XG4gICAgZG9tLkFkZEF0dHIoYXR0cilcbiAgICBpZihkb20uTm9kZVR5cGU9PTEpe1xuICAgICAgICBkb20uQ2hpbGRyZW4uZm9yRWFjaChjaGlsZD0+e1xuICAgICAgICAgICAgYWRkQXR0cihjaGlsZCxhdHRyKVxuICAgICAgICB9KVxuICAgIH1cbn0iLCJcbmxldCBuYW1lc3BhY2VzOntbbmFtZXNwYWNlOnN0cmluZ106e1t2YWx1ZW5hbWU6c3RyaW5nXTphbnl9fT17XG4gICAgXCJkZWZhdWx0XCI6e1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBSZWdpc3RlclZhbHVlKHZhbHVlOntbbmFtZTpzdHJpbmddOmFueX0sbmFtZXNwYWNlOnN0cmluZyl7XG4gICAgaWYobmFtZXNwYWNlc1tuYW1lc3BhY2VdPT1udWxsKVxuICAgICAgICBuYW1lc3BhY2VzW25hbWVzcGFjZV09e31cbiAgICBsZXQgdmFsdWVzPW5hbWVzcGFjZXNbbmFtZXNwYWNlXVxuICAgIGZvcihsZXQga2V5IGluIHZhbHVlKXtcbiAgICAgICAgdmFsdWVzW2tleV09dmFsdWVba2V5XVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBHZXRWYWx1ZShuYW1lOnN0cmluZyxuYW1lc3BhY2U6c3RyaW5nKTphbnl7XG4gICAgcmV0dXJuIG5hbWVzcGFjZXNbbmFtZXNwYWNlXSAmJiBuYW1lc3BhY2VzW25hbWVzcGFjZV1bbmFtZV1cbn1cbmV4cG9ydCBmdW5jdGlvbiBHZXRWYWx1ZXMobmFtZXNwYWNlOnN0cmluZyk6YW55e1xuICAgIHJldHVybiBuYW1lc3BhY2VzW25hbWVzcGFjZV1cbn1cbmV4cG9ydCBmdW5jdGlvbiBJc1ZhbHVlUmVnaXN0ZXJlZChuYW1lOnN0cmluZyxuYW1lc3BhY2U6c3RyaW5nKXtcbiAgICBpZihuYW1lc3BhY2VzW25hbWVzcGFjZV0gJiYgbmFtZXNwYWNlc1tuYW1lc3BhY2VdW25hbWVdKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG59IiwiaW1wb3J0IHsgVkRvbSB9IGZyb20gJy4vdmRvbS92ZG9tJztcblxuZXhwb3J0IGludGVyZmFjZSBNVlZNQ29tcG9uZW50T3B0aW9ue1xuICAgICRuYW1lPzpzdHJpbmcsXG4gICAgdGVtcGxhdGU/OnN0cmluZyxcbiAgICB0ZW1wbGF0ZVVybD86c3RyaW5nLFxuICAgIGRhdGE/Ok9iamVjdCxcbiAgICBtZXRob2RzPzp7W25hbWU6c3RyaW5nXTpGdW5jdGlvbn0sXG4gICAgcHJvcHM/OlByb3BbXSxcbiAgICBldmVudHM/OnN0cmluZ1tdLFxuICAgIHN0eWxlPzpzdHJpbmcsXG4gICAgc3R5bGVVcmw/OnN0cmluZyxcbiAgICAkbmFtZXNwYWNlPzpzdHJpbmcsXG4gICAgJGlkPzpzdHJpbmcsXG4gICAgJGRvbXRyZWU/OlZEb20sXG4gICAgY29tcHV0ZWQ/OntbbmFtZTpzdHJpbmddOigpPT5hbnl9XG59XG5leHBvcnQgaW50ZXJmYWNlIFByb3B7XG4gICAgbmFtZTpzdHJpbmdcbiAgICByZXF1aXJlZDpib29sZWFuXG4gICAgdHlwZT86XCJhcnJheVwifFwib2JqZWN0XCJ8XCJudW1iZXJcInxcInN0cmluZ1wifFwiYm9vbGVhblwiXG59XG5leHBvcnQgaW50ZXJmYWNlIE9uRGF0YUNoYW5nZSB7XG4gICAgKG5ld3ZhbHVlOmFueSxvbGR2YWx1ZTphbnkpOnZvaWRcbn1cbi8qKmZvcuivreWPpSAqL1xuZXhwb3J0IGNsYXNzIEZvckV4cHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaXRlbUV4cDpzdHJpbmcscHVibGljIGFycmF5RXhwOnN0cmluZyl7fVxufVxuXG4vKirov5Tlm57lgLwgKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmV0dXJlVmFsdWV7XG4gICAgZXhwOnN0cmluZyxcbiAgICBkYXRhOmFueVxufVxuXG5cbiIsImltcG9ydCB7IE1WVk1Db21wb25lbnRPcHRpb24sIFByb3AgfSBmcm9tIFwiLi4vbW9kZWxzXCI7XG5pbXBvcnQgeyBDdXN0b21Ob2RlIH0gZnJvbSBcIi4uL3Zub2RlL2N1c3RvbS1ub2RlXCI7XG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gXCIuLi92bm9kZS92bm9kZVwiO1xuaW1wb3J0IHsgT25EYXRhQ2hhbmdlIH0gZnJvbSAnLi8uLi9tb2RlbHMnO1xuaW1wb3J0IHsgVkRvbSB9IGZyb20gJy4vLi4vdmRvbS92ZG9tJztcbmltcG9ydCB7IFJldm9rZUV2ZW50IH0gZnJvbSAnLi9yZXZva2UtZXZlbnQnO1xuaW1wb3J0IHsgT2JzZXJ2ZSB9IGZyb20gXCIuLi9vYnNlcnZlci9vYnNlcnZlXCI7XG5leHBvcnQgY2xhc3MgTVZWTSB7XG4gICAgJEZlbmNlTm9kZTpDdXN0b21Ob2RlXG4gICAgJFRyZWVSb290OlZOb2RlXG4gICAgXG4gICAgcHJpdmF0ZSAkZGF0YTphbnlcbiAgICBwcml2YXRlICRtZXRob2RzOntbbmFtZTpzdHJpbmddOkZ1bmN0aW9ufT17fVxuICAgIHByaXZhdGUgJHRlbXBsYXRlOnN0cmluZ1xuICAgIHByaXZhdGUgJGRvbXRyZWU6VkRvbVxuICAgIHByaXZhdGUgJGNvbXB1dGVkOntbbmFtZTpzdHJpbmddOigpPT5hbnl9PXt9XG5cbiAgICAkTmFtZXNwYWNlOnN0cmluZ1xuICAgICRJbnM6UHJvcFtdPVtdXG4gICAgJE91dHM6c3RyaW5nW109W11cbiAgICBwcml2YXRlICRvYnNlcnZlOk9ic2VydmVcbiAgICBwcml2YXRlICRuYW1lOnN0cmluZz1cIlwiXG4gICAgcHJpdmF0ZSBoaXJlbnRlZD1mYWxzZSAgICBcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbjpNVlZNQ29tcG9uZW50T3B0aW9uKXtcbiAgICAgICAgaWYob3B0aW9uLmRhdGEhPW51bGwpXG4gICAgICAgICAgICB0aGlzLiRkYXRhPUpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3B0aW9uLmRhdGEpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLiRkYXRhPXt9XG4gICAgICAgIHRoaXMuJG1ldGhvZHM9b3B0aW9uLm1ldGhvZHMgIHx8e31cbiAgICAgICAgdGhpcy4kbmFtZT1vcHRpb24uJG5hbWV8fFwiXCJcbiAgICAgICAgdGhpcy4kY29tcHV0ZWQ9b3B0aW9uLmNvbXB1dGVkfHx7fVxuXG4gICAgICAgIHRoaXMuJHRlbXBsYXRlPW9wdGlvbi50ZW1wbGF0ZVxuICAgICAgICB0aGlzLiROYW1lc3BhY2U9b3B0aW9uLiRuYW1lc3BhY2VcbiAgICAgICAgdGhpcy4kZG9tdHJlZT1vcHRpb24uJGRvbXRyZWVcblxuXG4gICAgICAgIGlmKG9wdGlvbi5tZXRob2RzICYmIG9wdGlvbi5tZXRob2RzLiRpbml0KXtcbiAgICAgICAgICAgIG9wdGlvbi5tZXRob2RzLiRpbml0LmNhbGwodGhpcylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRJbnM9b3B0aW9uLnByb3BzIHx8IFtdXG4gICAgICAgIHRoaXMuJE91dHM9b3B0aW9uLmV2ZW50cyB8fCBbXVxuXG4gICAgICAgIHRoaXMuJG9ic2VydmU9bmV3IE9ic2VydmUodGhpcylcbiAgICAgICAgdGhpcy4kb2JzZXJ2ZS5SZWFjdGl2ZURhdGEodGhpcy4kZGF0YSlcbiAgICAgICAgdGhpcy5wcm94eURhdGEoKVxuICAgICAgICB0aGlzLnByb3h5TWV0aG9kKClcbiAgICAgICAgXG4gICAgfVxuICAgIHByaXZhdGUgcHJveHlEYXRhKCl7XG4gICAgICAgIGZvcihsZXQga2V5IGluIHRoaXMuJGRhdGEpe1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsa2V5LHtcbiAgICAgICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGRhdGFba2V5XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OmZ1bmN0aW9uKG5ld3ZhbCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFba2V5XT1uZXd2YWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgcHJveHlNZXRob2QoKXtcbiAgICAgICAgZm9yKGxldCBrZXkgaW4gdGhpcy4kbWV0aG9kcyl7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxrZXkse1xuICAgICAgICAgICAgICAgIGdldDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kbWV0aG9kc1trZXldXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHByb3h5Q29tcHV0ZWQoKXtcbiAgICAgICAgZm9yKGxldCBrZXkgaW4gdGhpcy4kY29tcHV0ZWQpe1xuICAgICAgICAgICAgdGhpcy4kb2JzZXJ2ZS5XYXRjaENvbXB1dGVkKHRoaXMuJEZlbmNlTm9kZSxrZXksdGhpcy4kY29tcHV0ZWRba2V5XSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBTZXRIaXJlbnRlZChoaXJlbnRlZEZyb21QYXJlbnQ6Ym9vbGVhbil7XG4gICAgICAgIHRoaXMuaGlyZW50ZWQ9aGlyZW50ZWRGcm9tUGFyZW50XG4gICAgfVxuICAgIEdldFRlbXBsYXRlKCk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gdGhpcy4kdGVtcGxhdGVcbiAgICB9XG4gICAgR2V0RG9tVHJlZSgpOlZEb217XG4gICAgICAgIHJldHVybiB0aGlzLiRkb210cmVlXG4gICAgfVxuICAgIFJlbmRlcigpe1xuICAgICAgICB0aGlzLnByb3h5Q29tcHV0ZWQoKVxuICAgICAgICBpZih0aGlzLmhpcmVudGVkKXtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuJEZlbmNlTm9kZS5tdnZtLiRkYXRhKS5mb3JFYWNoKGtleT0+e1xuICAgICAgICAgICAgICAgIHRoaXMuJEZlbmNlTm9kZS5tdnZtLiR3YXRjaEV4cE9yRnVuYyh0aGlzLiRGZW5jZU5vZGUsa2V5LChuZXd2YWx1ZTphbnksb2xkdmFsdWU6YW55KT0+e1xuICAgICAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpW2tleV09bmV3dmFsdWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHRoaXMuJG9ic2VydmUuUmVhY3RpdmVLZXkodGhpcyxrZXksdHJ1ZSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuJEZlbmNlTm9kZS5tdnZtLiRjb21wdXRlZCkuZm9yRWFjaChrZXk9PntcbiAgICAgICAgICAgICAgICB0aGlzLiRGZW5jZU5vZGUubXZ2bS4kd2F0Y2hFeHBPckZ1bmModGhpcy4kRmVuY2VOb2RlLGtleSwobmV3dmFsdWU6YW55LG9sZHZhbHVlOmFueSk9PntcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtrZXldPW5ld3ZhbHVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB0aGlzLiRvYnNlcnZlLlJlYWN0aXZlS2V5KHRoaXMsa2V5LHRydWUpICAgICAgXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuJElucy5mb3JFYWNoKHByb3A9PntcbiAgICAgICAgICAgIGlmKHRoaXMuJEZlbmNlTm9kZS5HZXRJbihwcm9wLm5hbWUpPT1udWxsICYmIHByb3AucmVxdWlyZWQpe1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvbXBvbmVudCBcXCdcIit0aGlzLiRuYW1lK1wiXFwnIG5lZWQgcHJvcCBcXCdcIitwcm9wLm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgaW5OYW1lPXRoaXMuJEZlbmNlTm9kZS5HZXRJbihwcm9wLm5hbWUpXG4gICAgICAgICAgICB0aGlzLiRGZW5jZU5vZGUubXZ2bS4kd2F0Y2hFeHBPckZ1bmModGhpcy4kRmVuY2VOb2RlLGluTmFtZSwobmV3dmFsdWU6YW55LG9sZHZhbHVlOmFueSk9PntcbiAgICAgICAgICAgICAgICB0aGlzLiRjaGVja1Byb3AocHJvcCxuZXd2YWx1ZSk7XG4gICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtwcm9wLm5hbWVdPW5ld3ZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuJG9ic2VydmUuUmVhY3RpdmVLZXkodGhpcyxwcm9wLm5hbWUsdHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJFRyZWVSb290LlJlbmRlcigpXG4gICAgICAgIHJldHVybiB0aGlzLiRUcmVlUm9vdC5Eb21cbiAgICB9XG4gICAgUmV2b2tlTWV0aG9kKG1ldGhvZDpzdHJpbmcsLi4ucGFyYW1zOmFueVtdKXtcbiAgICAgICAgaWYodGhpcy5oaXJlbnRlZCl7XG4gICAgICAgICAgICB0aGlzLiRGZW5jZU5vZGUubXZ2bS5SZXZva2VNZXRob2QobWV0aG9kLC4uLnBhcmFtcylcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZih0aGlzLiRtZXRob2RzW21ldGhvZF0hPW51bGwpXG4gICAgICAgICAgICAgICAgdGhpcy4kbWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMscGFyYW1zKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIEdldEV4cFZhbHVlKGV4cDpzdHJpbmcpOmFueXtcbiAgICAgICAgcmV0dXJuIHRoaXMuJG9ic2VydmUuR2V0VmFsdWVXaXRoRXhwKGV4cClcbiAgICB9XG4gICAgXG4gICAgU2V0VmFsdWUoZXhwOnN0cmluZyx2YWx1ZTphbnkpe1xuICAgICAgICBsZXQga2V5cz1leHAuc3BsaXQoXCIuXCIpXG4gICAgICAgIGxldCB0YXJnZXQ9dGhpcy4kZGF0YVxuICAgICAgICBsZXQgaGFzVHJhZ2V0PXRydWVcbiAgICAgICAgZm9yKGxldCBpPTA7aTxrZXlzLmxlbmd0aC0xO2krKyl7XG4gICAgICAgICAgICBpZih0YXJnZXQhPW51bGwpXG4gICAgICAgICAgICAgICAgdGFyZ2V0PXRhcmdldFtrZXlzW2ldXVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBoYXNUcmFnZXQ9ZmFsc2VcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGhhc1RyYWdldCAmJiB0YXJnZXQhPW51bGwpXG4gICAgICAgICAgICB0YXJnZXRba2V5c1trZXlzLmxlbmd0aC0xXV09dmFsdWVcbiAgICB9XG4gICAgJGVtaXQoZXZlbnQ6c3RyaW5nLC4uLmRhdGE6YW55W10pe1xuICAgICAgICBpZih0aGlzLiRGZW5jZU5vZGUhPW51bGwgJiYgdGhpcy4kRmVuY2VOb2RlLm12dm0hPW51bGwpe1xuICAgICAgICAgICAgbGV0IG1ldGhvZD10aGlzLiRGZW5jZU5vZGUuR2V0T3V0KGV2ZW50KVxuICAgICAgICAgICAgUmV2b2tlRXZlbnQobWV0aG9kLGRhdGEsdGhpcy4kRmVuY2VOb2RlLm12dm0pXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHB1YmxpYyAkd2F0Y2hFeHBPckZ1bmModm5vZGU6Vk5vZGUsZXhwOnN0cmluZ3xGdW5jdGlvbixsaXN0ZW5lcjpPbkRhdGFDaGFuZ2UsYXJyYXlkZWVwPzpib29sZWFuKXtcbiAgICAgICAgdGhpcy4kb2JzZXJ2ZS5BZGRXYXRjaGVyKHZub2RlLGV4cCxsaXN0ZW5lcixhcnJheWRlZXApXG4gICAgfVxuICAgIFxuICAgICRvbmRlc3Ryb3koKXtcbiAgICAgICAgaWYodGhpcy4kbWV0aG9kc1tcIiRkZXN0cm95XCJdIT1udWxsKXtcbiAgICAgICAgICAgIHRoaXMuJG1ldGhvZHNbXCIkZGVzdHJveVwiXSgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kVHJlZVJvb3QuT25SZW1vdmVkKClcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSAkY2hlY2tQcm9wKHByb3A6UHJvcCx2YWx1ZTphbnkpe1xuICAgICAgICBsZXQgZXJyb3I9KG5hbWU6c3RyaW5nLHByb3A6c3RyaW5nLHR5cGU6c3RyaW5nKT0+e1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tcG9uZW50IFxcJ1wiK25hbWUrXCJcXCcgcHJvcCBcXCdcIitwcm9wK1wiXFwnIG5vdCByZWNlaXZlIFwiK3R5cGUpXG4gICAgICAgIH1cbiAgICAgICAgaWYocHJvcC50eXBlPT1cImFycmF5XCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICBlcnJvcih0aGlzLiRuYW1lLHByb3AubmFtZSxwcm9wLnR5cGUpXG4gICAgICAgIH1cbiAgICAgICAgaWYocHJvcC50eXBlPT1cIm9iamVjdFwiICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpIT1cIltvYmplY3QgT2JqZWN0XVwiKXtcbiAgICAgICAgICAgIGVycm9yKHRoaXMuJG5hbWUscHJvcC5uYW1lLHByb3AudHlwZSlcbiAgICAgICAgfVxuICAgICAgICBpZihwcm9wLnR5cGU9PVwibnVtYmVyXCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBOdW1iZXJdXCIpe1xuICAgICAgICAgICAgZXJyb3IodGhpcy4kbmFtZSxwcm9wLm5hbWUscHJvcC50eXBlKVxuICAgICAgICB9XG4gICAgICAgIGlmKHByb3AudHlwZT09XCJib29sZWFuXCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBCb29sZWFuXVwiKXtcbiAgICAgICAgICAgIGVycm9yKHRoaXMuJG5hbWUscHJvcC5uYW1lLHByb3AudHlwZSlcbiAgICAgICAgfVxuICAgICAgICBpZihwcm9wLnR5cGU9PVwic3RyaW5nXCIgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkhPVwiW29iamVjdCBTdHJpbmddXCIpe1xuICAgICAgICAgICAgZXJyb3IodGhpcy4kbmFtZSxwcm9wLm5hbWUscHJvcC50eXBlKVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7UkVHX0VWRU5ULCBSRUdfU1RSfSBmcm9tIFwiLi4vY29uc3RcIlxuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuL212dm1cIjtcbmV4cG9ydCBmdW5jdGlvbiBSZXZva2VFdmVudChtZXRob2Q6c3RyaW5nLGRhdGE6YW55LG12dm06TVZWTSl7XG4gICAgaWYgKFJFR19FVkVOVC50ZXN0KG1ldGhvZCkpIHtcbiAgICAgICAgbGV0IG1ldGhvZFN0ciA9IFJlZ0V4cC4kMVxuICAgICAgICBsZXQgcGFyYW1zU3RyID0gUmVnRXhwLiQyXG4gICAgICAgIGlmIChwYXJhbXNTdHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHBzID0gcGFyYW1zU3RyLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgbGV0IHBhcmFtczogYW55W10gPSBbXVxuICAgICAgICAgICAgcHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIVJFR19TVFIudGVzdChwKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocCA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocCA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKHA9PVwiJGV2ZW50XCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goLi4uZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gbmV3IE51bWJlcihwKS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2gobi52YWx1ZU9mKCkpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+iCr+WumuaYr+acrOWcsOWPmOmHj1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2gobXZ2bS5HZXRFeHBWYWx1ZShwKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKFJlZ0V4cC4kMilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgbXZ2bS5SZXZva2VNZXRob2QobWV0aG9kU3RyLCAuLi5wYXJhbXMpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbXZ2bS5SZXZva2VNZXRob2QobWV0aG9kU3RyKSAgXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgV2F0Y2hlciB9IGZyb20gJy4vd2F0Y2hlcic7XG5cbmxldCBxdWV1ZTpXYXRjaGVyW109W11cbmxldCBzZXR0aW1lb3V0PWZhbHNlXG5leHBvcnQgZnVuY3Rpb24gQWRkV2F0Y2hlcih3YXRjaGVyOldhdGNoZXIpe1xuICAgIGlmKHF1ZXVlLmluZGV4T2Yod2F0Y2hlcik9PS0xKVxuICAgICAgICBxdWV1ZS5wdXNoKHdhdGNoZXIpXG4gICAgaWYoIXNldHRpbWVvdXQpe1xuICAgICAgICBzZXR0aW1lb3V0PXRydWVcbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgUmV2b2tlV2F0Y2hlcigpXG4gICAgICAgICAgICBzZXR0aW1lb3V0PWZhbHNlICAgICAgICAgICAgXG4gICAgICAgIH0sIDApO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBSZXZva2VXYXRjaGVyKCl7XG4gICAgbGV0IHRlbXA6V2F0Y2hlcltdPVtdXG4gICAgcXVldWUuZm9yRWFjaChxPT50ZW1wLnB1c2gocSkpXG4gICAgcXVldWU9W11cbiAgICB0ZW1wLmZvckVhY2god2F0Y2hlcj0+d2F0Y2hlci5VcGRhdGUoKSlcbiAgICBpZihxdWV1ZS5sZW5ndGg+MCl7XG4gICAgICAgIFJldm9rZVdhdGNoZXIoKVxuICAgIH1cbn0iLCJpbXBvcnQgeyBWTm9kZSB9IGZyb20gJy4uL3Zub2RlL3Zub2RlJztcbmltcG9ydCB7IE9uRGF0YUNoYW5nZSB9IGZyb20gJy4vLi4vbW9kZWxzJztcbmltcG9ydCB7IFdhdGNoZXIgfSBmcm9tIFwiLi93YXRjaGVyXCI7XG5pbXBvcnQgeyBBZGRXYXRjaGVyIH0gZnJvbSAnLi9tc2ctcXVldWUnO1xuaW1wb3J0IHsgVk5vZGVTdGF0dXMgfSBmcm9tICcuLi9jb25zdCc7XG5cbmRlY2xhcmUgbGV0IEV2YWxFeHA6KGNvbnRleHQ6YW55LGV4cDpzdHJpbmcpPT5hbnlcbmV4cG9ydCBjbGFzcyBPYnNlcnZle1xuICAgIHByaXZhdGUgc3RhdGljIHRhcmdldDpXYXRjaGVyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBkYXRhOmFueSl7fVxuICAgIEdldFZhbHVlKHdhdGNoZXI6V2F0Y2hlcil7XG4gICAgICAgIE9ic2VydmUudGFyZ2V0PXdhdGNoZXJcbiAgICAgICAgbGV0IHJlczphbnlcbiAgICAgICAgaWYodHlwZW9mIHdhdGNoZXIuRXhwT3JGdW5jID09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgcmVzPUV2YWxFeHAodGhpcy5kYXRhLHdhdGNoZXIuRXhwT3JGdW5jKVxuICAgICAgICB9XG4gICAgICAgIGlmKHR5cGVvZiB3YXRjaGVyLkV4cE9yRnVuYyA9PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICByZXM9d2F0Y2hlci5FeHBPckZ1bmMuY2FsbCh0aGlzLmRhdGEpXG4gICAgICAgIH1cbiAgICAgICAgT2JzZXJ2ZS50YXJnZXQ9bnVsbCAgIFxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuICAgIEdldFZhbHVlV2l0aEV4cChleHA6c3RyaW5nKXtcbiAgICAgICAgbGV0IHJlcz1FdmFsRXhwKHRoaXMuZGF0YSxleHApXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG4gICAgXG4gICAgQWRkV2F0Y2hlcih2bm9kZTpWTm9kZSxleHA6c3RyaW5nfEZ1bmN0aW9uLGxpc3RlbmVyOk9uRGF0YUNoYW5nZSxkZWVwPzpib29sZWFuKXtcbiAgICAgICAgbmV3IFdhdGNoZXIodm5vZGUsZXhwLGxpc3RlbmVyLHRoaXMsZGVlcClcbiAgICB9XG4gICAgXG4gICAgUmVhY3RpdmVEYXRhKGRhdGE6YW55KXtcbiAgICAgICAgaWYoZGF0YSE9bnVsbCAmJiB0eXBlb2YgZGF0YT09XCJvYmplY3RcIil7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGtleT0+e1xuICAgICAgICAgICAgICAgIGxldCBkZXBlbmQ9bmV3IERlcGVuZGVyKGtleSlcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZVJlYWN0aXZlKGRhdGEsa2V5LGZhbHNlLGRlcGVuZClcbiAgICAgICAgICAgICAgICB0aGlzLlJlYWN0aXZlRGF0YShkYXRhW2tleV0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIFJlYWN0aXZlS2V5KGRhdGE6YW55LGtleTpzdHJpbmcsc2hhbGxvdzpib29sZWFuKXtcbiAgICAgICAgbGV0IGRlcGVuZD1uZXcgRGVwZW5kZXIoa2V5KSAgICAgICAgXG4gICAgICAgIHRoaXMuZGVmaW5lUmVhY3RpdmUoZGF0YSxrZXksc2hhbGxvdyxkZXBlbmQpXG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgcmVhY3RpdmVBcnJheShhcnJheTphbnlbXSxkZXBlbmQ6RGVwZW5kZXIpe1xuICAgICAgICBpZihhcnJheS5wdXNoIT1BcnJheS5wcm90b3R5cGUucHVzaClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYXJyYXksXCJwdXNoXCIse1xuICAgICAgICAgICAgZW51bWVyYWJsZTpmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlLFxuICAgICAgICAgICAgdmFsdWU6KC4uLnBhcmFtczphbnlbXSk9PntcbiAgICAgICAgICAgICAgICBsZXQgb2xkPWFycmF5Lmxlbmd0aFxuICAgICAgICAgICAgICAgIGxldCByZXM9QXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChhcnJheSwuLi5wYXJhbXMpXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPW9sZDtpPHJlcztpKyspe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlJlYWN0aXZlS2V5KGFycmF5LFwiXCIraSxmYWxzZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVwZW5kLk5vdGlmeSgpICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFycmF5LFwicG9wXCIse1xuICAgICAgICAgICAgZW51bWVyYWJsZTpmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlLFxuICAgICAgICAgICAgdmFsdWU6KC4uLnBhcmFtczphbnlbXSk9PntcbiAgICAgICAgICAgICAgICBsZXQgcmVzPUFycmF5LnByb3RvdHlwZS5wb3AuY2FsbChhcnJheSwuLi5wYXJhbXMpXG4gICAgICAgICAgICAgICAgZGVwZW5kLk5vdGlmeSgpICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFycmF5LFwic3BsaWNlXCIse1xuICAgICAgICAgICAgZW51bWVyYWJsZTpmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlLFxuICAgICAgICAgICAgdmFsdWU6KC4uLnBhcmFtczphbnlbXSk9PntcbiAgICAgICAgICAgICAgICBsZXQgcmVzPUFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbChhcnJheSwuLi5wYXJhbXMpXG4gICAgICAgICAgICAgICAgaWYocGFyYW1zLmxlbmd0aD4yKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld2l0ZW1zPXBhcmFtcy5zbGljZSgyKVxuICAgICAgICAgICAgICAgICAgICBuZXdpdGVtcy5mb3JFYWNoKGl0ZW09PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleD1hcnJheS5pbmRleE9mKGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJlYWN0aXZlS2V5KGFycmF5LFwiXCIraW5kZXgsZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlcGVuZC5Ob3RpZnkoKSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhcnJheSxcInNoaWZ0XCIse1xuICAgICAgICAgICAgZW51bWVyYWJsZTpmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlLFxuICAgICAgICAgICAgdmFsdWU6KC4uLnBhcmFtczphbnlbXSk9PntcbiAgICAgICAgICAgICAgICBsZXQgcmVzPUFycmF5LnByb3RvdHlwZS5zaGlmdC5jYWxsKGFycmF5LC4uLnBhcmFtcylcbiAgICAgICAgICAgICAgICBkZXBlbmQuTm90aWZ5KCkgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBwcml2YXRlIGRlZmluZVJlYWN0aXZlKGRhdGE6YW55LGtleTpzdHJpbmcsc2hhbGxvdzpib29sZWFuLGRlcGVuZDpEZXBlbmRlcil7XG4gICAgICAgIGxldCB2YWx1ZSA9IGRhdGFba2V5XVxuICAgICAgICBpZih0b1N0cmluZy5jYWxsKHZhbHVlKT09XCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgIHRoaXMucmVhY3RpdmVBcnJheSh2YWx1ZSxkZXBlbmQpXG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRhdGEsIGtleSwge1xuICAgICAgICAgICAgZ2V0OiAoKT0+IHtcbiAgICAgICAgICAgICAgICBpZihPYnNlcnZlLnRhcmdldCE9bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZC5BZGRUYXJnZXQoT2JzZXJ2ZS50YXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogKG5ld3ZhbCk9PntcbiAgICAgICAgICAgICAgICBpZiAobmV3dmFsICE9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPW5ld3ZhbFxuICAgICAgICAgICAgICAgICAgICBpZih0b1N0cmluZy5jYWxsKHZhbHVlKT09XCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVhY3RpdmVBcnJheSh2YWx1ZSxkZXBlbmQpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoIXNoYWxsb3cpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJlYWN0aXZlRGF0YShuZXd2YWwpICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kLk5vdGlmeSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6dHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlXG4gICAgICAgIH0pXG4gICAgfVxuICAgIFdhdGNoQ29tcHV0ZWQodm5vZGU6Vk5vZGUsa2V5OnN0cmluZyxmdW5jOigpPT5hbnkpe1xuICAgICAgICBsZXQgZGVwZW5kPW5ldyBEZXBlbmRlcihrZXkpXG4gICAgICAgIGxldCBmaXJzdGdldD10cnVlXG4gICAgICAgIGxldCB2YWx1ZTphbnlcbiAgICAgICAgXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmRhdGEsIGtleSwge1xuICAgICAgICAgICAgZ2V0OiAoKT0+IHtcbiAgICAgICAgICAgICAgICBpZihPYnNlcnZlLnRhcmdldCE9bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZC5BZGRUYXJnZXQoT2JzZXJ2ZS50YXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKGZpcnN0Z2V0KXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZD1PYnNlcnZlLnRhcmdldFxuICAgICAgICAgICAgICAgICAgICBPYnNlcnZlLnRhcmdldD1udWxsXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXYXRjaGVyKHZub2RlLGZ1bmMsKG5ld3ZhbCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPW5ld3ZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kLk5vdGlmeSgpXG4gICAgICAgICAgICAgICAgICAgIH0sdGhpcylcbiAgICAgICAgICAgICAgICAgICAgT2JzZXJ2ZS50YXJnZXQ9b2xkXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0Z2V0PWZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6dHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTp0cnVlXG4gICAgICAgIH0pXG4gICAgfVxuXG59XG5leHBvcnQgY2xhc3MgRGVwZW5kZXJ7XG4gICAgcHJpdmF0ZSB3YXRjaGVzOldhdGNoZXJbXT1bXVxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5OnN0cmluZyl7XG4gICAgfVxuICAgIEdldEtleSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5rZXlcbiAgICB9XG4gICAgQWRkVGFyZ2V0KHdhdGNoZXI6V2F0Y2hlcil7XG4gICAgICAgIGlmKHRoaXMud2F0Y2hlcy5pbmRleE9mKHdhdGNoZXIpPT0tMSlcbiAgICAgICAgICAgIHRoaXMud2F0Y2hlcy5wdXNoKHdhdGNoZXIpXG4gICAgfVxuICAgIE5vdGlmeSgpe1xuICAgICAgICB0aGlzLndhdGNoZXM9dGhpcy53YXRjaGVzLmZpbHRlcih3YXRjaGVyPT57XG4gICAgICAgICAgICBpZih3YXRjaGVyLkdldFZOb2RlKCkuR2V0U3RhdHVzKCk9PVZOb2RlU3RhdHVzLkFDVElWRSApe1xuICAgICAgICAgICAgICAgIEFkZFdhdGNoZXIod2F0Y2hlcilcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYod2F0Y2hlci5HZXRWTm9kZSgpLkdldFN0YXR1cygpPT1WTm9kZVN0YXR1cy5JTkFDVElWRSApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIGlmKHdhdGNoZXIuR2V0Vk5vZGUoKS5HZXRTdGF0dXMoKT09Vk5vZGVTdGF0dXMuREVQUkVDQVRFRCApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH0pXG4gICAgfVxufSIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSAnLi8uLi92bm9kZS92bm9kZSc7XG5pbXBvcnQgeyBPbkRhdGFDaGFuZ2UgfSBmcm9tICcuLy4uL21vZGVscyc7XG5pbXBvcnQgeyBPYnNlcnZlIH0gZnJvbSAnLi9vYnNlcnZlJztcbmltcG9ydCB7IFZOb2RlU3RhdHVzIH0gZnJvbSAnLi4vY29uc3QnO1xuXG5cbmV4cG9ydCBjbGFzcyBXYXRjaGVye1xuICAgIHByaXZhdGUgdmFsdWU6YW55XG4gICAgcHJpdmF0ZSBkZWVwUmVjb3JkOmFueVtdPVtdXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZub2RlOlZOb2RlLHB1YmxpYyBFeHBPckZ1bmM6c3RyaW5nfEZ1bmN0aW9uLHByaXZhdGUgY2I6T25EYXRhQ2hhbmdlLHByaXZhdGUgb2JzZXJ2ZXI6T2JzZXJ2ZSxwcml2YXRlIGRlZXA/OmJvb2xlYW4pe1xuICAgICAgICB0aGlzLnZhbHVlPXRoaXMub2JzZXJ2ZXIuR2V0VmFsdWUodGhpcylcbiAgICAgICAgaWYodGhpcy5kZWVwICYmIHRvU3RyaW5nLmNhbGwodGhpcy52YWx1ZSk9PVwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMudmFsdWUubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWVwUmVjb3JkW2ldPXRoaXMudmFsdWVbaV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNiKHRoaXMudmFsdWUsdW5kZWZpbmVkKVxuICAgIH1cbiAgICBHZXRWTm9kZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy52bm9kZVxuICAgIH1cbiAgICBVcGRhdGUoKXtcbiAgICAgICAgbGV0IG5ld3ZhbD10aGlzLm9ic2VydmVyLkdldFZhbHVlKHRoaXMpXG4gICAgICAgIGlmKHRoaXMudmFsdWUhPW5ld3ZhbCl7XG4gICAgICAgICAgICBpZih0aGlzLnZub2RlLkdldFN0YXR1cygpPT1WTm9kZVN0YXR1cy5BQ1RJVkUpXG4gICAgICAgICAgICAgICAgdGhpcy5jYihuZXd2YWwsdGhpcy52YWx1ZSlcbiAgICAgICAgICAgIHRoaXMudmFsdWU9bmV3dmFsXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgLy/liKTmlq3mlbDnu4TlhYPntKDmmK/lkKbmnInlj5jljJZcbiAgICAgICAgICAgIGlmKHRoaXMuZGVlcCAmJiB0b1N0cmluZy5jYWxsKHRoaXMudmFsdWUpPT1cIltvYmplY3QgQXJyYXldXCIgKXtcbiAgICAgICAgICAgICAgICBsZXQgZGlmZj1mYWxzZVxuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8bmV3dmFsLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZihuZXd2YWxbaV0hPXRoaXMuZGVlcFJlY29yZFtpXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNiKG5ld3ZhbCx0aGlzLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZj10cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKGRpZmYpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZXBSZWNvcmQ9W11cbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxuZXd2YWwubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZXBSZWNvcmRbaV09bmV3dmFsW2ldXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBMb2dFcnJvcihtc2c6YW55KXtcbiAgICBjb25zb2xlLmVycm9yKG1zZylcbn1cbmV4cG9ydCBmdW5jdGlvbiBMb2dJbmZvKG1zZzphbnkpe1xuICAgIGNvbnNvbGUubG9nKG1zZylcbn1cbmV4cG9ydCBmdW5jdGlvbiBHZXROUyhzdHI6c3RyaW5nKTp7bmFtZXNwYWNlOnN0cmluZyx2YWx1ZTpzdHJpbmd9e1xuICAgIGxldCByZXM9c3RyLnNwbGl0KFwiOlwiKVxuICAgIGlmKHJlcy5sZW5ndGg9PTEpXG4gICAgICAgIHJldHVybiB7bmFtZXNwYWNlOm51bGwsdmFsdWU6cmVzWzBdfVxuICAgIGlmKHJlcy5sZW5ndGg9PTIpXG4gICAgICAgIHJldHVybiB7bmFtZXNwYWNlOnJlc1swXSx2YWx1ZTpyZXNbMV19XG59XG5leHBvcnQgZnVuY3Rpb24gSHR0cEdldCh1cmw6c3RyaW5nKTpzdHJpbmd7XG4gICAgbGV0IHhocj1uZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHhoci5vcGVuKFwiR0VUXCIsdXJsLGZhbHNlKVxuICAgIHhoci5zZW5kKClcbiAgICBpZih4aHIucmVhZHlTdGF0ZT09NCAmJiB4aHIuc3RhdHVzPT0yMDApXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gbnVsbFxufSIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4uL3Zub2RlL3Zub2RlXCI7XG5pbXBvcnQgeyBJc0NvbXBvbmVudFJlZ2lzdGVyZWQsIEdldENvbXBvbmVudCB9IGZyb20gXCIuLi9tYW5hZ2VyL2NvbXBvbmVudHMtbWFuYWdlclwiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IEdldE5TIH0gZnJvbSBcIi4uL3V0aWxcIjtcbmRlY2xhcmUgbGV0IHJlcXVpcmU6KG1vZHVsZTpzdHJpbmcpPT5hbnlcbmV4cG9ydCBjbGFzcyBWRG9te1xuICAgIE5vZGVWYWx1ZTogc3RyaW5nXG4gICAgTm9kZU5hbWU6IHN0cmluZ1xuICAgIE5vZGVUeXBlOiBudW1iZXJcbiAgICBBdHRyczogeyBOYW1lOiBzdHJpbmcsIFZhbHVlOiBzdHJpbmcgfVtdID0gW11cbiAgICBDaGlsZHJlbjogVkRvbVtdID0gW11cbiAgICBHZXRBdHRyKG5hbWU6c3RyaW5nKXtcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLkF0dHJzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgaWYodGhpcy5BdHRyc1tpXS5OYW1lPT1uYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkF0dHJzW2ldLlZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgQWRkQXR0cihhdHRyOnN0cmluZyl7XG4gICAgICAgIHRoaXMuQXR0cnMucHVzaCh7TmFtZTphdHRyLFZhbHVlOlwiXCJ9KVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBUcmF2ZXJzZURvbShkb206Tm9kZSk6VkRvbXtcbiAgICBpZihkb20ubm9kZVR5cGU9PTMgJiYgZG9tLm5vZGVWYWx1ZS50cmltKCk9PVwiXCIpXG4gICAgICAgIHJldHVyblxuICAgIGxldCByb290PW5ldyBWRG9tKClcbiAgICByb290Lk5vZGVWYWx1ZT1kb20ubm9kZVZhbHVlXG4gICAgaWYocm9vdC5Ob2RlVmFsdWUhPW51bGwpe1xuICAgICAgICByb290Lk5vZGVWYWx1ZT1yb290Lk5vZGVWYWx1ZS5yZXBsYWNlKC9cXHMrL2csXCJcIilcbiAgICB9XG4gICAgcm9vdC5Ob2RlTmFtZT1kb20ubm9kZU5hbWVcbiAgICByb290Lk5vZGVUeXBlPWRvbS5ub2RlVHlwZVxuICAgIGlmKGRvbS5ub2RlVHlwZT09MSl7XG4gICAgICAgIGxldCBodG1sZG9tPWRvbSBhcyBIVE1MRWxlbWVudFxuICAgICAgICBmb3IobGV0IGk9MDtpPGh0bWxkb20uYXR0cmlidXRlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIHJvb3QuQXR0cnMucHVzaCh7TmFtZTpodG1sZG9tLmF0dHJpYnV0ZXNbaV0ubmFtZSxWYWx1ZTpodG1sZG9tLmF0dHJpYnV0ZXNbaV0udmFsdWV9KVxuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgaT0wO2k8aHRtbGRvbS5jaGlsZE5vZGVzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbGV0IGNoaWxkPVRyYXZlcnNlRG9tKGh0bWxkb20uY2hpbGROb2Rlc1tpXSlcbiAgICAgICAgICAgIGNoaWxkICYmIHJvb3QuQ2hpbGRyZW4ucHVzaChjaGlsZClcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcm9vdFxufVxuZXhwb3J0IGZ1bmN0aW9uIE5ld1ZOb2RlKGRvbTpWRG9tLG12dm06TVZWTSxwYXJlbnQ6Vk5vZGUpOlZOb2Rle1xuICAgIGlmKGRvbS5Ob2RlTmFtZS50b0xvd2VyQ2FzZSgpPT1cInNsb3RcIil7XG4gICAgICAgIGxldCBTbG90Tm9kZT1yZXF1aXJlKFwiLi4vdm5vZGUvc2xvdC1ub2RlXCIpLlNsb3ROb2RlXG4gICAgICAgIHJldHVybiBuZXcgU2xvdE5vZGUoZG9tLG12dm0scGFyZW50LGRvbS5HZXRBdHRyKFwibmFtZVwiKSlcbiAgICB9XG5cbiAgICBpZihkb20uR2V0QXR0cihcIltmb3JdXCIpIT1udWxsKXtcbiAgICAgICAgbGV0IEZvck5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL2Zvci1ub2RlXCIpLkZvck5vZGVcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JOb2RlKGRvbSxtdnZtLHBhcmVudCxkb20uR2V0QXR0cihcIltmb3JdXCIpKVxuICAgIH1cbiAgICBpZihkb20uR2V0QXR0cihcIltpZl1cIikhPW51bGwpe1xuICAgICAgICBsZXQgSWZOb2RlPXJlcXVpcmUoXCIuLi92bm9kZS9pZi1ub2RlXCIpLklmTm9kZVxuICAgICAgICByZXR1cm4gbmV3IElmTm9kZShkb20sbXZ2bSxwYXJlbnQsZG9tLkdldEF0dHIoXCJbaWZdXCIpKSAgICAgICAgICAgICAgXG4gICAgfVxuICAgIGxldCBucz1HZXROUyhkb20uTm9kZU5hbWUpXG4gICAgaWYoSXNDb21wb25lbnRSZWdpc3RlcmVkKG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8XCJkZWZhdWx0XCIpKXtcbiAgICAgICAgbGV0IG9wdGlvbj1HZXRDb21wb25lbnQobnMudmFsdWUsbnMubmFtZXNwYWNlfHxcImRlZmF1bHRcIilcbiAgICAgICAgbGV0IHNlbGZtdnZtPW5ldyBNVlZNKG9wdGlvbilcbiAgICAgICAgbGV0IEN1c3RvbU5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL2N1c3RvbS1ub2RlXCIpLkN1c3RvbU5vZGVcbiAgICAgICAgbGV0IGN1c3Q9IG5ldyBDdXN0b21Ob2RlKGRvbSxtdnZtLHBhcmVudCxzZWxmbXZ2bSlcbiAgICAgICAgc2VsZm12dm0uJEZlbmNlTm9kZT1jdXN0XG4gICAgICAgIGN1c3QuUGFyc2VUZW1wbGF0ZSgpXG4gICAgICAgIHJldHVybiBjdXN0XG4gICAgfVxuICAgICAgICBcbiAgICByZXR1cm4gbmV3IFZOb2RlKGRvbSxtdnZtLHBhcmVudClcbn1cbmV4cG9ydCBmdW5jdGlvbiBOZXdWTm9kZU5vRm9yKGRvbTpWRG9tLG12dm06TVZWTSxwYXJlbnQ6Vk5vZGUpOlZOb2Rle1xuICAgIGlmKGRvbS5Ob2RlTmFtZS50b0xvd2VyQ2FzZSgpPT1cInNsb3RcIil7XG4gICAgICAgIGxldCBTbG90Tm9kZT1yZXF1aXJlKFwiLi4vdm5vZGUvc2xvdC1ub2RlXCIpLlNsb3ROb2RlXG4gICAgICAgIHJldHVybiBuZXcgU2xvdE5vZGUoZG9tLG12dm0scGFyZW50LGRvbS5HZXRBdHRyKFwibmFtZVwiKSlcbiAgICB9XG5cbiAgICBpZihkb20uR2V0QXR0cihcIltpZl1cIikhPW51bGwpe1xuICAgICAgICBsZXQgSWZOb2RlPXJlcXVpcmUoXCIuLi92bm9kZS9pZi1ub2RlXCIpLklmTm9kZVxuICAgICAgICByZXR1cm4gbmV3IElmTm9kZShkb20sbXZ2bSxwYXJlbnQsZG9tLkdldEF0dHIoXCJbaWZdXCIpKSAgICAgICAgICAgICAgXG4gICAgfVxuICAgIGxldCBucz1HZXROUyhkb20uTm9kZU5hbWUpXG4gICAgaWYoSXNDb21wb25lbnRSZWdpc3RlcmVkKG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8XCJkZWZhdWx0XCIpKXtcbiAgICAgICAgbGV0IG9wdGlvbj1HZXRDb21wb25lbnQobnMudmFsdWUsbnMubmFtZXNwYWNlfHxcImRlZmF1bHRcIilcbiAgICAgICAgbGV0IHN1cnJvdW5kbXZ2bT1uZXcgTVZWTShvcHRpb24pXG4gICAgICAgIGxldCBDdXN0b21Ob2RlPXJlcXVpcmUoXCIuLi92bm9kZS9jdXN0b20tbm9kZVwiKS5DdXN0b21Ob2RlXG4gICAgICAgIGxldCBjdXN0PSBuZXcgQ3VzdG9tTm9kZShkb20sbXZ2bSxwYXJlbnQsc3Vycm91bmRtdnZtKVxuICAgICAgICBzdXJyb3VuZG12dm0uJEZlbmNlTm9kZT1jdXN0XG4gICAgICAgIGN1c3QuUGFyc2VUZW1wbGF0ZSgpXG4gICAgICAgIHJldHVybiBjdXN0XG4gICAgfVxuICAgICAgICBcbiAgICByZXR1cm4gbmV3IFZOb2RlKGRvbSxtdnZtLHBhcmVudClcbn1cbmV4cG9ydCBmdW5jdGlvbiBOZXdWTm9kZU5vRm9yTm9JZihkb206VkRvbSxtdnZtOk1WVk0scGFyZW50OlZOb2RlKTpWTm9kZXtcbiAgICBpZihkb20uTm9kZU5hbWUudG9Mb3dlckNhc2UoKT09XCJzbG90XCIpe1xuICAgICAgICBsZXQgU2xvdE5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL3Nsb3Qtbm9kZVwiKS5TbG90Tm9kZVxuICAgICAgICByZXR1cm4gbmV3IFNsb3ROb2RlKGRvbSxtdnZtLHBhcmVudCxkb20uR2V0QXR0cihcIm5hbWVcIikpXG4gICAgfVxuICAgIGxldCBucz1HZXROUyhkb20uTm9kZU5hbWUpXG4gICAgaWYoSXNDb21wb25lbnRSZWdpc3RlcmVkKG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8XCJkZWZhdWx0XCIpKXtcbiAgICAgICAgbGV0IG9wdGlvbj1HZXRDb21wb25lbnQobnMudmFsdWUsbnMubmFtZXNwYWNlfHxcImRlZmF1bHRcIilcbiAgICAgICAgbGV0IHNlbGZtdnZtPW5ldyBNVlZNKG9wdGlvbilcbiAgICAgICAgbGV0IEN1c3RvbU5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL2N1c3RvbS1ub2RlXCIpLkN1c3RvbU5vZGVcbiAgICAgICAgbGV0IGN1c3Q9IG5ldyBDdXN0b21Ob2RlKGRvbSxtdnZtLHBhcmVudCxzZWxmbXZ2bSlcbiAgICAgICAgc2VsZm12dm0uJEZlbmNlTm9kZT1jdXN0XG4gICAgICAgIGN1c3QuUGFyc2VUZW1wbGF0ZSgpXG4gICAgICAgIHJldHVybiBjdXN0XG4gICAgfVxuICAgICAgICBcbiAgICByZXR1cm4gbmV3IFZOb2RlKGRvbSxtdnZtLHBhcmVudClcbn0iLCJpbXBvcnQgeyBHZXRDb21wb25lbnQsIElzQ29tcG9uZW50UmVnaXN0ZXJlZCB9IGZyb20gXCIuLi9tYW5hZ2VyL2NvbXBvbmVudHMtbWFuYWdlclwiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IEdldE5TIH0gZnJvbSBcIi4uL3V0aWxcIjtcbmltcG9ydCB7IE5ld1ZOb2RlLCBWRG9tIH0gZnJvbSBcIi4uL3Zkb20vdmRvbVwiO1xuaW1wb3J0IHsgVGVtcGxhdGVOb2RlIH0gZnJvbSBcIi4vdGVtcGxhdGUtbm9kZVwiO1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi92bm9kZVwiO1xuaW1wb3J0IHsgVk5vZGVTdGF0dXMgfSBmcm9tIFwiLi4vY29uc3RcIjtcblxuZXhwb3J0IGNsYXNzIEN1c3RvbU5vZGUgZXh0ZW5kcyBWTm9kZXtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgVmRvbTpWRG9tLHB1YmxpYyBtdnZtOiBNVlZNLHB1YmxpYyBQYXJlbnQ6Vk5vZGUscHVibGljIFN1cnJvdW5kTXZ2bTpNVlZNKSB7XG4gICAgICAgIHN1cGVyKFZkb20sbXZ2bSxQYXJlbnQpXG4gICAgfVxuICAgIEFkZElucyhuYW1lOnN0cmluZyxleHA6c3RyaW5nKXtcbiAgICAgICAgdGhpcy5pbnNfZXhwW25hbWVdPWV4cFxuICAgIH1cbiAgICAvKirojrflj5bot59zbG905Yy56YWN55qE5qih54mI5YaF5a65ICovXG4gICAgR2V0VGVtcGxhdGUobmFtZTpzdHJpbmcpOlRlbXBsYXRlTm9kZXtcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLkNoaWxkcmVuLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbGV0IHRlbXBsYXRlPXRoaXMuQ2hpbGRyZW5baV0gYXMgVGVtcGxhdGVOb2RlXG4gICAgICAgICAgICBpZih0ZW1wbGF0ZS50ZW1wbGF0ZW5hbWU9PW5hbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgUmVuZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLkRvbT10aGlzLlN1cnJvdW5kTXZ2bS5SZW5kZXIoKVxuICAgICAgICBpZih0aGlzLkRvbSAmJiB0aGlzLlBhcmVudCAmJiB0aGlzLlBhcmVudC5Eb20pXG4gICAgICAgICAgICB0aGlzLlBhcmVudC5Eb20uYXBwZW5kQ2hpbGQodGhpcy5Eb20pXG4gICAgfVxuICAgIFxuXG4gICAgLyoqb3ZlcnJpZGUgdm5vZGUgKi9cbiAgICBwcm90ZWN0ZWQgY2hpbGRTZXQoKXtcbiAgICAgICAgLy/liLbpgKDkuK3pl7ToioLngrnnrqHnkIZ0ZW1wbGF0ZVxuICAgICAgICBsZXQgZGVmYXVsdFRlbXBsYXRlPW5ldyBUZW1wbGF0ZU5vZGUodGhpcy5WZG9tLHRoaXMubXZ2bT90aGlzLm12dm06dGhpcy5TdXJyb3VuZE12dm0sdGhpcyxcImRlZmF1bHRcIilcbiAgICAgICAgZGVmYXVsdFRlbXBsYXRlLlBhcmVudD10aGlzXG4gICAgICAgIGxldCB0ZW1wbGF0ZXM6e1tuYW1lOnN0cmluZ106Vk5vZGV9PXtcImRlZmF1bHRcIjpkZWZhdWx0VGVtcGxhdGV9XG4gICAgICAgIC8v6Kej5p6Q5a2Q6IqC54K5XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5WZG9tLkNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRub2RlPXRoaXMuVmRvbS5DaGlsZHJlbltpXVxuXG4gICAgICAgICAgICBsZXQgbmFtZT10aGlzLlZkb20uR2V0QXR0cihcInNsb3RcIilcbiAgICAgICAgICAgIGlmKG5hbWU9PW51bGwgfHwgbmFtZT09XCJcIil7XG4gICAgICAgICAgICAgICAgbmFtZT1cImRlZmF1bHRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGVtcGxhdGVzW25hbWVdPT1udWxsKXtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXNbbmFtZV09bmV3IFRlbXBsYXRlTm9kZSh0aGlzLlZkb20sdGhpcy5tdnZtP3RoaXMubXZ2bTp0aGlzLlN1cnJvdW5kTXZ2bSx0aGlzLG5hbWUpXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzW25hbWVdLlBhcmVudD10aGlzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmNoaWxkPU5ld1ZOb2RlKGNoaWxkbm9kZSx0ZW1wbGF0ZXNbbmFtZV0ubXZ2bSx0ZW1wbGF0ZXNbbmFtZV0pXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZjaGlsZC5BdHRhY2hEb20oKVxuICAgICAgICAgICAgdGVtcGxhdGVzW25hbWVdLkNoaWxkcmVuLnB1c2godmNoaWxkKVxuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgbmFtZSBpbiB0ZW1wbGF0ZXMpe1xuICAgICAgICAgICAgdGhpcy5DaGlsZHJlbi5wdXNoKHRlbXBsYXRlc1tuYW1lXSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBQYXJzZVRlbXBsYXRlKCl7XG4gICAgICAgIGxldCBkb210cmVlPXRoaXMuU3Vycm91bmRNdnZtLkdldERvbVRyZWUoKVxuICAgICAgICBsZXQgbnM9R2V0TlMoZG9tdHJlZS5Ob2RlTmFtZSlcblxuICAgICAgICBpZihJc0NvbXBvbmVudFJlZ2lzdGVyZWQobnMudmFsdWUsbnMubmFtZXNwYWNlfHx0aGlzLlN1cnJvdW5kTXZ2bS4kTmFtZXNwYWNlKSl7XG4gICAgICAgICAgICBsZXQgb3B0aW9uPUdldENvbXBvbmVudChucy52YWx1ZSxucy5uYW1lc3BhY2V8fHRoaXMuU3Vycm91bmRNdnZtLiROYW1lc3BhY2UpXG4gICAgICAgICAgICBsZXQgc2VsZm12dm09bmV3IE1WVk0ob3B0aW9uKVxuICAgICAgICAgICAgbGV0IGNoaWxkPSBuZXcgQ3VzdG9tTm9kZShkb210cmVlLHRoaXMuU3Vycm91bmRNdnZtLG51bGwsc2VsZm12dm0pXG4gICAgICAgICAgICB0aGlzLlN1cnJvdW5kTXZ2bS4kVHJlZVJvb3Q9Y2hpbGRcbiAgICAgICAgICAgIHNlbGZtdnZtLiRGZW5jZU5vZGU9dGhpc1xuICAgICAgICAgICAgY2hpbGQuUGFyc2VUZW1wbGF0ZSgpICAgICAgICAgICAgXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5TdXJyb3VuZE12dm0uJFRyZWVSb290PW5ldyBWTm9kZShkb210cmVlLHRoaXMuU3Vycm91bmRNdnZtLG51bGwpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5TdXJyb3VuZE12dm0uJFRyZWVSb290LkF0dGFjaERvbSgpXG4gICAgICAgIFxuICAgIH1cbiAgICBHZXRJblZhbHVlKHByb3A6c3RyaW5nKXtcbiAgICAgICAgaWYodGhpcy5pbnNfcHVyZVtwcm9wXSE9bnVsbClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc19wdXJlW3Byb3BdXG4gICAgICAgIGlmKHRoaXMuaW5zX2V4cFtwcm9wXSE9bnVsbClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm12dm0uR2V0RXhwVmFsdWUodGhpcy5pbnNfZXhwW3Byb3BdKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBHZXRJbihwcm9wOnN0cmluZyl7XG4gICAgICAgIHJldHVybiB0aGlzLmluc19wdXJlW3Byb3BdIHx8dGhpcy5pbnNfZXhwW3Byb3BdXG4gICAgfVxuICAgIEdldE91dChwcm9wOnN0cmluZyl7XG4gICAgICAgIHJldHVybiB0aGlzLm91dHNbcHJvcF1cbiAgICB9XG4gICAgXG4gICAgXG4gICAgUmVmcmVzaCgpIHtcbiAgICAgICAgdGhpcy5TdXJyb3VuZE12dm0uJFRyZWVSb290LlJlZnJlc2goKVxuICAgIH1cbiAgICBVcGRhdGUoKXtcbiAgICAgICAgdGhpcy5TdXJyb3VuZE12dm0uJFRyZWVSb290LlVwZGF0ZSgpXG4gICAgfVxuICAgIHByb3RlY3RlZCB0ZXN0T3V0cHV0KG5hbWU6c3RyaW5nKTpib29sZWFue1xuICAgICAgICBpZih0aGlzLlN1cnJvdW5kTXZ2bS4kT3V0cy5pbmRleE9mKG5hbWUpPT0tMSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBwcm90ZWN0ZWQgdGVzdElucHV0KG5hbWU6c3RyaW5nKTpib29sZWFue1xuICAgICAgICByZXR1cm4gdGhpcy5TdXJyb3VuZE12dm0uJElucy5zb21lKHByb3A9PntcbiAgICAgICAgICAgIHJldHVybiBwcm9wLm5hbWU9PW5hbWVcbiAgICAgICAgfSlcbiAgICB9XG4gICAgT25SZW1vdmVkKCl7XG4gICAgICAgIHRoaXMuU3Vycm91bmRNdnZtLiRvbmRlc3Ryb3koKVxuICAgIH1cbiAgICBTZXRTdGF0dXMoc3RhdHVzOlZOb2RlU3RhdHVzKXtcbiAgICAgICAgdGhpcy5zdGF0dXM9c3RhdHVzXG4gICAgICAgIHRoaXMuU3Vycm91bmRNdnZtLiRUcmVlUm9vdC5TZXRTdGF0dXMoc3RhdHVzKVxuICAgIH1cblxufSIsImltcG9ydCB7IEZvckV4cCB9IGZyb20gXCIuLi9tb2RlbHNcIjtcbmltcG9ydCB7IE1WVk0gfSBmcm9tICcuLi9tdnZtL212dm0nO1xuaW1wb3J0IHsgVkRvbSwgTmV3Vk5vZGVOb0ZvciB9IGZyb20gJy4uL3Zkb20vdmRvbSc7XG5pbXBvcnQgeyBDdXN0b21Ob2RlIH0gZnJvbSAnLi9jdXN0b20tbm9kZSc7XG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gXCIuL3Zub2RlXCI7XG5pbXBvcnQgeyBWTm9kZVN0YXR1cyB9IGZyb20gXCIuLi9jb25zdFwiO1xuXG5leHBvcnQgY2xhc3MgRm9yTm9kZSBleHRlbmRzIFZOb2Rle1xuICAgIHByaXZhdGUgZHluYW1pY1ZOb2RlczpDdXN0b21Ob2RlW10gPSBbXVxuICAgIHB1YmxpYyBGb3JFeHA6Rm9yRXhwXG4gICAgY29uc3RydWN0b3IocHVibGljIFZkb206VkRvbSxwdWJsaWMgbXZ2bTogTVZWTSxwdWJsaWMgUGFyZW50OlZOb2RlLHByaXZhdGUgb3JpZ2luRm9yRXhwOnN0cmluZykge1xuICAgICAgICBzdXBlcihWZG9tLG12dm0sUGFyZW50KVxuICAgICAgICB0aGlzLklzVGVtcGxhdGU9dHJ1ZSAgICAgICBcbiAgICAgICAgbGV0IGZvclNwbGl0PXRoaXMub3JpZ2luRm9yRXhwLnRyaW0oKS5zcGxpdCgvXFxzKy8pXG4gICAgICAgIHRoaXMuRm9yRXhwPW5ldyBGb3JFeHAoZm9yU3BsaXRbMF0sZm9yU3BsaXRbMl0pIFxuICAgIH1cbiAgICBwcml2YXRlIG5ld0NvcHlOb2RlKG46bnVtYmVyKXtcbiAgICAgICAgbGV0IGl0ZW1leHA9dGhpcy5Gb3JFeHAuaXRlbUV4cFxuICAgICAgICBsZXQgbXZ2bT1uZXcgTVZWTSh7cHJvcHM6W3tuYW1lOml0ZW1leHAscmVxdWlyZWQ6dHJ1ZX1dfSlcbiAgICAgICAgbXZ2bS5TZXRIaXJlbnRlZCh0cnVlKVxuXG4gICAgICAgIGxldCBmZW5jZW5vZGU9bmV3IEN1c3RvbU5vZGUodGhpcy5WZG9tLHRoaXMubXZ2bSxudWxsLG12dm0pXG4gICAgICAgIG12dm0uJEZlbmNlTm9kZT1mZW5jZW5vZGUgICAgICAgIFxuICAgICAgICBmZW5jZW5vZGUuSXNDb3B5PXRydWVcbiAgICAgICAgZmVuY2Vub2RlLkFkZElucyhpdGVtZXhwLHRoaXMuRm9yRXhwLmFycmF5RXhwK1wiW1wiK24rXCJdXCIpXG4gICAgICAgIHJldHVybiBmZW5jZW5vZGVcbiAgICB9XG4gICAgcHJpdmF0ZSByZUltcGxlbWVudEZvckV4cChuZXdjb3VudDpudW1iZXIpe1xuICAgICAgICBpZihuZXdjb3VudD50aGlzLmR5bmFtaWNWTm9kZXMubGVuZ3RoKXtcbiAgICAgICAgICAgIGxldCBjdXN0bm9kZXM6Q3VzdG9tTm9kZVtdPVtdXG4gICAgICAgICAgICBsZXQgb2xkY291bnQ9dGhpcy5keW5hbWljVk5vZGVzLmxlbmd0aFxuICAgICAgICAgICAgZm9yKGxldCBpPXRoaXMuZHluYW1pY1ZOb2Rlcy5sZW5ndGg7aTxuZXdjb3VudDtpKyspeyAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgY3VzdG5vZGU9dGhpcy5uZXdDb3B5Tm9kZShpKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCB2bm9kZT1OZXdWTm9kZU5vRm9yKHRoaXMuVmRvbSxjdXN0bm9kZS5TdXJyb3VuZE12dm0sbnVsbClcbiAgICAgICAgICAgICAgICB2bm9kZS5BdHRhY2hEb20oKVxuICAgICAgICAgICAgICAgIGN1c3Rub2RlLlN1cnJvdW5kTXZ2bS4kVHJlZVJvb3Q9dm5vZGVcbiAgICAgICAgICAgICAgICBjdXN0bm9kZXMucHVzaChjdXN0bm9kZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1c3Rub2Rlcy5mb3JFYWNoKGN1c3Rub2RlPT57XG4gICAgICAgICAgICAgICAgdGhpcy5keW5hbWljVk5vZGVzLnB1c2goY3VzdG5vZGUpICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjdXN0bm9kZS5SZW5kZXIoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuUGFyZW50LkFkZENoaWxkcmVuKHRoaXMsY3VzdG5vZGVzLG9sZGNvdW50KVxuICAgICAgICAgICAgdGhpcy5QYXJlbnQuUmVmcmVzaCgpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZihuZXdjb3VudDx0aGlzLmR5bmFtaWNWTm9kZXMubGVuZ3RoKXtcbiAgICAgICAgICAgIGxldCBtb3ZlZD10aGlzLmR5bmFtaWNWTm9kZXMuc3BsaWNlKG5ld2NvdW50KVxuICAgICAgICAgICAgbW92ZWQuZm9yRWFjaCh2bm9kZT0+dm5vZGUuU2V0U3RhdHVzKFZOb2RlU3RhdHVzLkRFUFJFQ0FURUQpKVxuICAgICAgICAgICAgdGhpcy5QYXJlbnQuUmVtb3ZlQ2hpbGRyZW4obW92ZWQpXG4gICAgICAgICAgICBtb3ZlZC5mb3JFYWNoKGl0ZW09PntcbiAgICAgICAgICAgICAgICBpdGVtLk9uUmVtb3ZlZCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5QYXJlbnQuUmVmcmVzaCgpXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgVXBkYXRlKCl7XG4gICAgICAgIGxldCBpdGVtcz10aGlzLm12dm0uR2V0RXhwVmFsdWUodGhpcy5Gb3JFeHAuYXJyYXlFeHApXG4gICAgICAgIGlmKHRvU3RyaW5nLmNhbGwoaXRlbXMpID09PSBcIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgdGhpcy5yZUltcGxlbWVudEZvckV4cChpdGVtcy5sZW5ndGgpXG4gICAgICAgIH1cbiAgICB9XG4gICAgQXR0YWNoRG9tKCkge31cbiAgICBSZW5kZXIoKXtcbiAgICAgICAgdGhpcy5tdnZtLiR3YXRjaEV4cE9yRnVuYyh0aGlzLHRoaXMuRm9yRXhwLmFycmF5RXhwK1wiLmxlbmd0aFwiLHRoaXMucmVJbXBsZW1lbnRGb3JFeHAuYmluZCh0aGlzKSlcbiAgICB9XG4gICAgT25SZW1vdmVkKCl7XG4gICAgICAgIHRoaXMuZHluYW1pY1ZOb2Rlcy5mb3JFYWNoKHZub2RlPT52bm9kZS5PblJlbW92ZWQoKSlcbiAgICB9XG4gICAgU2V0U3RhdHVzKHN0YXR1czpWTm9kZVN0YXR1cyl7XG4gICAgICAgIHRoaXMuc3RhdHVzPXN0YXR1c1xuICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZXMuZm9yRWFjaCh2bm9kZT0+dm5vZGUuU2V0U3RhdHVzKHN0YXR1cykpXG4gICAgfVxufSIsImltcG9ydCB7IE1WVk0gfSBmcm9tIFwiLi4vbXZ2bS9tdnZtXCI7XG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gXCIuL3Zub2RlXCI7XG5pbXBvcnQgeyBWRG9tLCBOZXdWTm9kZU5vRm9yTm9JZiB9IGZyb20gXCIuLi92ZG9tL3Zkb21cIjtcbmltcG9ydCB7IFZOb2RlU3RhdHVzIH0gZnJvbSBcIi4uL2NvbnN0XCI7XG5cbmV4cG9ydCBjbGFzcyBJZk5vZGUgZXh0ZW5kcyBWTm9kZSB7XG4gICAgcHJpdmF0ZSBkeW5hbWljVk5vZGU6IFZOb2RlXG4gICAgY29uc3RydWN0b3IocHVibGljIFZkb206VkRvbSxwdWJsaWMgbXZ2bTogTVZWTSwgcHVibGljIFBhcmVudDogVk5vZGUsIHByaXZhdGUgaWZFeHA6IHN0cmluZykge1xuICAgICAgICBzdXBlcihWZG9tLG12dm0sIFBhcmVudClcbiAgICAgICAgdGhpcy5Jc1RlbXBsYXRlPXRydWVcbiAgICB9XG4gICAgXG4gICAgQXR0YWNoRG9tKCkge31cbiAgICBSZW5kZXIoKXtcbiAgICAgICAgdGhpcy5tdnZtLiR3YXRjaEV4cE9yRnVuYyh0aGlzLHRoaXMuaWZFeHAsIG5ld3ZhbHVlPT50aGlzLnJlSW1wbGV0ZW1lbnQobmV3dmFsdWUpKVxuICAgIH1cbiAgICBVcGRhdGUoKXtcbiAgICAgICAgbGV0IGF0dGFjaGVkID0gdGhpcy5tdnZtLkdldEV4cFZhbHVlKHRoaXMuaWZFeHApXG4gICAgICAgIHRoaXMucmVJbXBsZXRlbWVudChhdHRhY2hlZClcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlSW1wbGV0ZW1lbnQobmV3dmFsdWU6Ym9vbGVhbil7XG4gICAgICAgIGlmIChuZXd2YWx1ZSkge1xuICAgICAgICAgICAgaWYodGhpcy5keW5hbWljVk5vZGU9PW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UoKVxuICAgICAgICAgICAgICAgIHRoaXMuZHluYW1pY1ZOb2RlLlJlbmRlcigpXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZS5VcGRhdGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy5QYXJlbnQhPW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMuUGFyZW50LkFkZENoaWxkcmVuKHRoaXMsIFt0aGlzLmR5bmFtaWNWTm9kZV0sMClcbiAgICAgICAgICAgICAgICB0aGlzLlBhcmVudC5SZWZyZXNoKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5tdnZtLiRGZW5jZU5vZGUuRG9tPXRoaXMuZHluYW1pY1ZOb2RlLkRvbVxuICAgICAgICAgICAgICAgIHRoaXMubXZ2bS4kRmVuY2VOb2RlLlBhcmVudC5SZWZyZXNoKCkgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5keW5hbWljVk5vZGUuU2V0U3RhdHVzKFZOb2RlU3RhdHVzLkFDVElWRSlcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5keW5hbWljVk5vZGUhPW51bGwpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuUGFyZW50IT1udWxsKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXJlbnQuUmVtb3ZlQ2hpbGRyZW4oW3RoaXMuZHluYW1pY1ZOb2RlXSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXJlbnQuUmVmcmVzaCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm12dm0uJEZlbmNlTm9kZS5Eb209bnVsbFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm12dm0uJEZlbmNlTm9kZS5QYXJlbnQuUmVmcmVzaCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZHluYW1pY1ZOb2RlLlNldFN0YXR1cyhWTm9kZVN0YXR1cy5JTkFDVElWRSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaW5zdGFuY2UoKXtcbiAgICAgICAgdGhpcy5keW5hbWljVk5vZGU9TmV3Vk5vZGVOb0Zvck5vSWYodGhpcy5WZG9tLHRoaXMubXZ2bSxudWxsKVxuICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZS5Jc0NvcHk9dHJ1ZVxuICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZS5BdHRhY2hEb20oKVxuICAgIH1cbiAgICBPblJlbW92ZWQoKXtcbiAgICAgICAgaWYodGhpcy5keW5hbWljVk5vZGUhPW51bGwpXG4gICAgICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZS5PblJlbW92ZWQoKVxuICAgIH1cbiAgICBTZXRTdGF0dXMoc3RhdHVzOlZOb2RlU3RhdHVzKXtcbiAgICAgICAgdGhpcy5zdGF0dXM9c3RhdHVzXG4gICAgICAgIGlmKHRoaXMuZHluYW1pY1ZOb2RlIT1udWxsKVxuICAgICAgICAgICAgdGhpcy5keW5hbWljVk5vZGUuU2V0U3RhdHVzKHN0YXR1cylcbiAgICB9XG59IiwiaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi92bm9kZVwiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IFZEb20gfSBmcm9tIFwiLi4vdmRvbS92ZG9tXCI7XG5pbXBvcnQgeyBWTm9kZVN0YXR1cyB9IGZyb20gXCIuLi9jb25zdFwiO1xuXG5leHBvcnQgY2xhc3MgU2xvdE5vZGUgZXh0ZW5kcyBWTm9kZXtcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdmRvbTpWRG9tLHB1YmxpYyBtdnZtOiBNVlZNLCBwdWJsaWMgUGFyZW50OiBWTm9kZSwgcHJpdmF0ZSBuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIodmRvbSxtdnZtLFBhcmVudClcbiAgICAgICAgaWYodGhpcy5uYW1lPT1udWxsIHx8IHRoaXMubmFtZT09XCJcIilcbiAgICAgICAgICAgIHRoaXMubmFtZT1cImRlZmF1bHRcIlxuICAgIH1cbiAgICBSZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZT10aGlzLm12dm0uJEZlbmNlTm9kZS5HZXRUZW1wbGF0ZSh0aGlzLm5hbWUpXG4gICAgICAgIGlmKHRlbXBsYXRlIT1udWxsKXtcbiAgICAgICAgICAgIHRlbXBsYXRlLlJlbmRlcigpXG4gICAgICAgICAgICB0aGlzLkRvbSA9IHRlbXBsYXRlLkRvbVxuICAgICAgICAgICAgd2hpbGUodGhpcy5Eb20uZmlyc3RDaGlsZCE9bnVsbCl7XG4gICAgICAgICAgICAgICAgdGhpcy5QYXJlbnQuRG9tLmFwcGVuZENoaWxkKHRoaXMuRG9tLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgXG4gICAgVXBkYXRlKCl7XG4gICAgICAgIGxldCB0ZW1wbGF0ZT10aGlzLm12dm0uJEZlbmNlTm9kZS5HZXRUZW1wbGF0ZSh0aGlzLm5hbWUpXG4gICAgICAgIGlmKHRlbXBsYXRlIT1udWxsKXtcbiAgICAgICAgICAgIHRlbXBsYXRlLlVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICB9XG4gICAgU2V0U3RhdHVzKHN0YXR1czpWTm9kZVN0YXR1cyl7XG4gICAgICAgIHRoaXMuc3RhdHVzPXN0YXR1c1xuICAgICAgICBsZXQgdGVtcGxhdGU9dGhpcy5tdnZtLiRGZW5jZU5vZGUuR2V0VGVtcGxhdGUodGhpcy5uYW1lKVxuICAgICAgICB0ZW1wbGF0ZS5TZXRTdGF0dXMoc3RhdHVzKVxuICAgIH1cbiAgICBPblJlbW92ZWQoKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlPXRoaXMubXZ2bS4kRmVuY2VOb2RlLkdldFRlbXBsYXRlKHRoaXMubmFtZSlcbiAgICAgICAgdGVtcGxhdGUuT25SZW1vdmVkKClcbiAgICB9XG59IiwiaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi92bm9kZVwiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IFZEb20gfSBmcm9tIFwiLi4vdmRvbS92ZG9tXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZU5vZGUgZXh0ZW5kcyBWTm9kZXtcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdmRvbTpWRG9tLHB1YmxpYyBtdnZtOiBNVlZNLHB1YmxpYyBQYXJlbnQ6Vk5vZGUscHVibGljIHRlbXBsYXRlbmFtZTpzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIodmRvbSxtdnZtLFBhcmVudClcbiAgICB9XG4gICAgXG4gICAgUmVuZGVyKCkgOnZvaWR7XG4gICAgICAgIHRoaXMuRG9tPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgdGhpcy5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkPT57XG4gICAgICAgICAgICBjaGlsZC5SZW5kZXIoKVxuICAgICAgICB9KVxuICAgIH1cbiAgICBcbiAgICBVcGRhdGUoKXtcbiAgICAgICAgbGV0IGNoaWxkcmVuOiBWTm9kZVtdID0gW11cbiAgICAgICAgdGhpcy5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpXG4gICAgICAgIH0pXG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgY2hpbGQuVXBkYXRlKClcbiAgICAgICAgfSlcbiAgICB9XG59IiwiaW1wb3J0IHsgUkVHX0lOLCBSRUdfT1VULCBSRUdfU1RSLCBSRUdfQVRUUiwgUkVHX1RFU1RfT1VUUFVULCBSRUdfVEVTVF9JTlBVVCwgUkVHX01VTFRJLCBWTm9kZVN0YXR1cyB9IGZyb20gJy4vLi4vY29uc3QnO1xuaW1wb3J0IHsgUkVHX1NJTkdMRSB9IGZyb20gXCIuLi9jb25zdFwiO1xuaW1wb3J0IHsgRGlyZWN0aXZlQmluZCB9IGZyb20gXCIuLi9kaXJlY3RpdmUvZGlyLWhhbmRsZXJcIjtcbmltcG9ydCB7IE1WVk0gfSBmcm9tICcuLi9tdnZtL212dm0nO1xuaW1wb3J0IHsgTmV3Vk5vZGUsIFZEb20gfSBmcm9tICcuLi92ZG9tL3Zkb20nO1xuaW1wb3J0IHsgTG9nRXJyb3IgfSBmcm9tICcuLi91dGlsJztcbmV4cG9ydCBjbGFzcyBWTm9kZSB7XG4gICAgTm9kZVZhbHVlOiBzdHJpbmdcbiAgICBOb2RlTmFtZTogc3RyaW5nXG4gICAgTm9kZVR5cGU6IG51bWJlclxuICAgIC8qKuaZrumAmuWxnuaApyAqL1xuICAgIEF0dHJzOiB7IG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyB9W10gPSBbXVxuICAgIC8qKuaMh+S7pOWxnuaApyAqL1xuICAgIENoaWxkcmVuOiBWTm9kZVtdID0gW11cbiAgICBEb206IE5vZGVcbiAgICBJc1RlbXBsYXRlID0gZmFsc2VcbiAgICBJc0NvcHk9ZmFsc2VcbiAgICAvL+i+k+WFpeS4jui+k+WHuuWAvFxuICAgIHByb3RlY3RlZCBpbnNfcHVyZTp7W25hbWU6c3RyaW5nXTphbnl9PXt9XG4gICAgcHJvdGVjdGVkIGluc19leHA6e1tuYW1lOnN0cmluZ106c3RyaW5nfT17fVxuICAgIHByb3RlY3RlZCBvdXRzOntbbmFtZTpzdHJpbmddOnN0cmluZ309e31cbiAgICBwcm90ZWN0ZWQgc3RhdHVzOlZOb2RlU3RhdHVzPVZOb2RlU3RhdHVzLkFDVElWRVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIFZkb206VkRvbSxwdWJsaWMgbXZ2bTogTVZWTSxwdWJsaWMgUGFyZW50OlZOb2RlKSB7XG4gICAgfVxuICAgIFxuICAgIEFkZFByb3BlcnR5KG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKVxuICAgICAgICBpZihSRUdfSU4udGVzdChuYW1lKSl7XG4gICAgICAgICAgICBsZXQgYXR0cj1SZWdFeHAuJDFcbiAgICAgICAgICAgIGlmKGF0dHI9PVwiZm9yXCIgfHwgYXR0cj09XCJpZlwiKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgaWYoIXRoaXMudGVzdElucHV0KGF0dHIpKXtcbiAgICAgICAgICAgICAgICBMb2dFcnJvcihcInByb3AgXCIrYXR0citcIiBub3QgZXhpc3Qgb24gXCIrdGhpcy5Ob2RlTmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKFJFR19TVFIudGVzdCh2YWx1ZSkpXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNfcHVyZVthdHRyXT1SZWdFeHAuJDJcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmluc19leHBbYXR0cl09dmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmKFJFR19PVVQudGVzdChuYW1lKSl7XG4gICAgICAgICAgICBpZighdGhpcy50ZXN0T3V0cHV0KFJlZ0V4cC4kMSkpe1xuICAgICAgICAgICAgICAgIExvZ0Vycm9yKFwiZXZlbnQgXCIrUmVnRXhwLiQxK1wiIG5vdCBleGlzdCBvbiBcIit0aGlzLk5vZGVOYW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vdXRzW1JlZ0V4cC4kMV09dmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmKFJFR19BVFRSLnRlc3QobmFtZSkpe1xuICAgICAgICAgICAgdGhpcy5BdHRycy5wdXNoKHtuYW1lOm5hbWUsdmFsdWU6dmFsdWV9KVxuICAgICAgICB9XG4gICAgfVxuICAgIEdldE91dHB1dCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5vdXRzXG4gICAgfVxuICAgIEdldElucHV0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmluc19leHBcbiAgICB9XG4gICAgcHJvdGVjdGVkIHRlc3RPdXRwdXQobmFtZTpzdHJpbmcpOmJvb2xlYW57XG4gICAgICAgIHJldHVybiBSRUdfVEVTVF9PVVRQVVQudGVzdChuYW1lKVxuICAgIH1cbiAgICBwcm90ZWN0ZWQgdGVzdElucHV0KG5hbWU6c3RyaW5nKTpib29sZWFue1xuICAgICAgICByZXR1cm4gUkVHX1RFU1RfSU5QVVQudGVzdChuYW1lKVxuICAgIH1cbiAgICBcbiAgICAvKirnlJ/miJDomZrmi5/oioLngrnku6PooajnmoRkb23lubbmioroh6rlt7HliqDlhaXniLbkurJkb23kuK0gKi9cbiAgICBSZW5kZXIoKSA6dm9pZHtcbiAgICAgICAgaWYgKHRoaXMuTm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgICAgbGV0IGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5Ob2RlTmFtZSlcbiAgICAgICAgICAgIHRoaXMuQXR0cnMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICAgICAgICBkb20uc2V0QXR0cmlidXRlKHByb3AubmFtZSwgcHJvcC52YWx1ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLkRvbSA9IGRvbSBcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbjpWTm9kZVtdPVtdXG4gICAgICAgICAgICB0aGlzLkNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFjaGlsZC5Jc0NvcHkpXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICAgICAgY2hpbGQuUmVuZGVyKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvL3RvZG8g6K6+572u5bGe5oCnXG4gICAgICAgICAgICBEaXJlY3RpdmVCaW5kKHRoaXMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuTm9kZVR5cGUgPT0gMykge1xuICAgICAgICAgICAgdGhpcy5Eb20gPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLk5vZGVWYWx1ZSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKFJFR19TSU5HTEUudGVzdCh0aGlzLk5vZGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm12dm0uJHdhdGNoRXhwT3JGdW5jKHRoaXMsUmVnRXhwLiQxLChuZXd2YWx1ZSwgb2xkdmFsdWUpPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLnRleHRDb250ZW50ID0gbmV3dmFsdWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYoUkVHX01VTFRJLnRlc3QodGhpcy5Ob2RlVmFsdWUpKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlcz10aGlzLm11bHRpQmluZFBhcnNlKHRoaXMuTm9kZVZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm12dm0uJHdhdGNoRXhwT3JGdW5jKHRoaXMscmVzLChuZXd2YWx1ZSwgb2xkdmFsdWUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkRvbS50ZXh0Q29udGVudCA9IG5ld3ZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLnRleHRDb250ZW50PXRoaXMuTm9kZVZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuUGFyZW50ICYmIHRoaXMuUGFyZW50LkRvbSlcbiAgICAgICAgICAgIHRoaXMuUGFyZW50LkRvbS5hcHBlbmRDaGlsZCh0aGlzLkRvbSlcbiAgICB9XG4gICAgcHJpdmF0ZSBtdWx0aUJpbmRQYXJzZShub2RldmFsdWU6c3RyaW5nKTpzdHJpbmd7XG4gICAgICAgIGxldCByZWc9L1xce1xceyhbXlxce1xcfV0qKVxcfVxcfS9nXG4gICAgICAgIGxldCByZXM9cmVnLmV4ZWMobm9kZXZhbHVlKVxuICAgICAgICBsZXQgZXhwPVwiXCJcbiAgICAgICAgbGV0IGxhc3RpbmRleD0wXG4gICAgICAgIHdoaWxlKHJlcyl7XG4gICAgICAgICAgICBpZihyZXMuaW5kZXghPWxhc3RpbmRleCl7XG4gICAgICAgICAgICAgICAgZXhwKz1cIlxcJ1wiK25vZGV2YWx1ZS5zdWJzdHJpbmcobGFzdGluZGV4LHJlcy5pbmRleCkrXCJcXCcrXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RpbmRleD1yZXMuaW5kZXgrcmVzWzBdLmxlbmd0aFxuICAgICAgICAgICAgZXhwKz1cIihcIitSZWdFeHAuJDErXCIpK1wiXG4gICAgICAgICAgICByZXM9cmVnLmV4ZWMobm9kZXZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIGlmKGV4cC5sYXN0SW5kZXhPZihcIitcIik9PWV4cC5sZW5ndGgtMSl7XG4gICAgICAgICAgICBleHA9ZXhwLnN1YnN0cmluZygwLGV4cC5sZW5ndGgtMSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHBcbiAgICB9XG4gICAgVXBkYXRlKCl7XG4gICAgICAgIC8vdG9kbyDmm7TmlrDlsZ7mgKdcbiAgICAgICAgaWYgKHRoaXMuTm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgICAgbGV0IGNoaWxkcmVuOiBWTm9kZVtdID0gW11cbiAgICAgICAgICAgIHRoaXMuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgICAgICBjaGlsZC5VcGRhdGUoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vdG9kbyDorr7nva7lsZ7mgKdcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLk5vZGVUeXBlID09IDMpIHtcbiAgICAgICAgICAgIGlmIChSRUdfU0lOR0xFLnRlc3QodGhpcy5Ob2RlVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Eb20udGV4dENvbnRlbnQ9dGhpcy5tdnZtLkdldEV4cFZhbHVlKFJlZ0V4cC4kMSlcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKFJFR19NVUxUSS50ZXN0KHRoaXMuTm9kZVZhbHVlKSl7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXM9dGhpcy5tdWx0aUJpbmRQYXJzZSh0aGlzLk5vZGVWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Eb20udGV4dENvbnRlbnQ9dGhpcy5tdnZtLkdldEV4cFZhbHVlKHJlcykgICAgIFxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkRvbS50ZXh0Q29udGVudD10aGlzLk5vZGVWYWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBSZWZyZXNoKCkge1xuICAgICAgICBpZiAodGhpcy5Jc1RlbXBsYXRlKXtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGxldCBhbGxub2RlcyA9IHRoaXMuRG9tLmNoaWxkTm9kZXNcbiAgICAgICAgbGV0IGFsbHZub2RlczogVk5vZGVbXSA9IFtdXG4gICAgICAgIHRoaXMuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWNoaWxkLklzVGVtcGxhdGUgJiYgY2hpbGQuRG9tIT1udWxsKSB7XG4gICAgICAgICAgICAgICAgYWxsdm5vZGVzID0gYWxsdm5vZGVzLmNvbmNhdChjaGlsZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgcnVsZXIgPSB7XG4gICAgICAgICAgICBvbGRfajogLTEsXG4gICAgICAgICAgICBpOiAwLFxuICAgICAgICAgICAgajogMFxuICAgICAgICB9XG4gICAgICAgIGxldCBvcGVyczogYW55W10gPSBbXVxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHJ1bGVyLmkgPiBhbGxub2Rlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydWxlci5qID4gYWxsdm5vZGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBvcGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJyZW1vdmVcIixcbiAgICAgICAgICAgICAgICAgICAgbm9kZTogYWxsbm9kZXNbcnVsZXIuaV1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJ1bGVyLmkrK1xuICAgICAgICAgICAgICAgIHJ1bGVyLmogPSBydWxlci5vbGRfaiArIDFcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFsbG5vZGVzW3J1bGVyLmldICE9IGFsbHZub2Rlc1tydWxlci5qXS5Eb20pIHtcbiAgICAgICAgICAgICAgICBydWxlci5qKytcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFsbG5vZGVzW3J1bGVyLmldID09IGFsbHZub2Rlc1tydWxlci5qXS5Eb20pIHtcbiAgICAgICAgICAgICAgICBpZiAocnVsZXIuaSA8IHJ1bGVyLmopIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gcnVsZXIub2xkX2ogKyAxXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbmRleCA8IHJ1bGVyLmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVmb3JlTm9kZTogYWxsbm9kZXNbcnVsZXIuaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogYWxsdm5vZGVzW2luZGV4XS5Eb21cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCsrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcnVsZXIub2xkX2ogPSBydWxlci5qXG4gICAgICAgICAgICAgICAgcnVsZXIuaSsrXG4gICAgICAgICAgICAgICAgcnVsZXIuaisrXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAocnVsZXIuaiA8IGFsbHZub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG9wZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgYmVmb3JlTm9kZTogbnVsbCxcbiAgICAgICAgICAgICAgICBub2RlOiBhbGx2bm9kZXNbcnVsZXIual0uRG9tXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcnVsZXIuaisrXG4gICAgICAgIH1cbiAgICAgICAgb3BlcnMuZm9yRWFjaChvcGVyID0+IHtcbiAgICAgICAgICAgIGlmIChvcGVyLnR5cGUgPT0gXCJhZGRcIikge1xuICAgICAgICAgICAgICAgIGlmKG9wZXIuYmVmb3JlTm9kZSE9bnVsbClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Eb20uaW5zZXJ0QmVmb3JlKG9wZXIubm9kZSwgb3Blci5iZWZvcmVOb2RlKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Eb20uYXBwZW5kQ2hpbGQob3Blci5ub2RlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wZXIudHlwZSA9PSBcInJlbW92ZVwiKVxuICAgICAgICAgICAgICAgIChvcGVyLm5vZGUgYXMgSFRNTEVsZW1lbnQpLnJlbW92ZSgpXG4gICAgICAgIH0pXG4gICAgICAgIFxuICAgIH1cbiAgICBBZGRDaGlsZHJlbihjaGlsZDogVk5vZGUsIG5vZGVzOiBWTm9kZVtdLG9mZnNldDpudW1iZXIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5DaGlsZHJlbltpXSA9PSBjaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuQ2hpbGRyZW4uc3BsaWNlKGkgKyAxK29mZnNldCwgMCwgLi4ubm9kZXMpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBSZW1vdmVDaGlsZHJlbihub2RlczpWTm9kZVtdKXtcbiAgICAgICAgdGhpcy5DaGlsZHJlbj10aGlzLkNoaWxkcmVuLmZpbHRlcihjaGlsZD0+e1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLmluZGV4T2YoY2hpbGQpPT0tMVxuICAgICAgICB9KVxuICAgIH1cbiAgICBPblJlbW92ZWQoKXtcbiAgICAgICAgdGhpcy5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkPT57XG4gICAgICAgICAgICBpZighY2hpbGQuSXNDb3B5KVxuICAgICAgICAgICAgICAgIGNoaWxkLk9uUmVtb3ZlZCgpXG4gICAgICAgIH0pXG4gICAgfVxuICAgIFxuICAgIFxuICAgIC8qKuino+aekOWfuuacrOS/oeaBryAqL1xuICAgIHByb3RlY3RlZCBiYXNpY1NldCgpe1xuICAgICAgICB0aGlzLk5vZGVWYWx1ZSA9IHRoaXMuVmRvbS5Ob2RlVmFsdWVcbiAgICAgICAgdGhpcy5Ob2RlTmFtZSA9IHRoaXMuVmRvbS5Ob2RlTmFtZVxuICAgICAgICB0aGlzLk5vZGVUeXBlID0gdGhpcy5WZG9tLk5vZGVUeXBlXG4gICAgICAgIC8v5L+d5a2Y5YWD57Sg5bGe5oCnXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5WZG9tLkF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLkFkZFByb3BlcnR5KHRoaXMuVmRvbS5BdHRyc1tpXS5OYW1lLHRoaXMuVmRvbS5BdHRyc1tpXS5WYWx1ZSlcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKirop6PmnpDoh6roioLngrnkv6Hmga8gKi9cbiAgICBwcm90ZWN0ZWQgY2hpbGRTZXQoKXtcbiAgICAgICAgICAgIC8v6Kej5p6Q5a2Q6IqC54K5XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuVmRvbS5DaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZGRvbT10aGlzLlZkb20uQ2hpbGRyZW5baV1cbiAgICAgICAgICAgICAgICBsZXQgdmNoaWxkPU5ld1ZOb2RlKGNoaWxkZG9tLHRoaXMubXZ2bSx0aGlzKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKHZjaGlsZCE9bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIHZjaGlsZC5BdHRhY2hEb20oKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLkNoaWxkcmVuLnB1c2godmNoaWxkKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICB9XG4gICAgQXR0YWNoRG9tKCkge1xuICAgICAgICB0aGlzLmJhc2ljU2V0KClcbiAgICAgICAgdGhpcy5jaGlsZFNldCgpXG4gICAgfVxuICAgIFNldFN0YXR1cyhzdGF0dXM6Vk5vZGVTdGF0dXMpe1xuICAgICAgICB0aGlzLnN0YXR1cz1zdGF0dXNcbiAgICAgICAgdGhpcy5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkPT57XG4gICAgICAgICAgICBpZighY2hpbGQuSXNDb3B5KVxuICAgICAgICAgICAgICAgIGNoaWxkLlNldFN0YXR1cyhzdGF0dXMpXG4gICAgICAgIH0pXG4gICAgfVxuICAgIEdldFN0YXR1cygpe1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXNcbiAgICB9XG59Il19

var EvalExp=function(context,exp){
    var res
    with(context){
        res=eval(exp)
    }
    return res
}
