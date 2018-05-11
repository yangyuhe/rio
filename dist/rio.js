(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIR_MODEL = "model";
exports.DIR_EVENT_CLICK = "click";
/**花括号数据绑定表达式 */
exports.REG_SINGLE = /^\{\{(.*)\}\}$/;
exports.REG_MULTI = /\{\{(.*)\}\}/;
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
function DirectiveSet(vnode) {
    var inputs = vnode.GetInput();
    for (var name_1 in inputs) {
        switch (name_1) {
            case "model":
                model_1.ModelSet(inputs[name_1], vnode);
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
exports.DirectiveSet = DirectiveSet;
function DirectiveWatch(vnode) {
    var inputs = vnode.GetInput();
    for (var name_3 in inputs) {
        switch (name_3) {
            case "model":
                model_1.ModelWatch(inputs[name_3], vnode);
                break;
        }
    }
}
exports.DirectiveWatch = DirectiveWatch;

},{"./model":3,"./onclick":4}],3:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
function ModelWatch(exp, vnode) {
    var inputtype = vnode.Vdom.GetAttr("type");
    var input = vnode.Vdom.NodeName.toLowerCase();
    if (input == "input" && inputtype == "checkbox") {
        vnode.mvvm.$watchExp(vnode, exp, function (newvalue) {
            setValue(vnode, newvalue);
        }, true);
    }
    else {
        vnode.mvvm.$watchExp(vnode, exp, function (newvalue) {
            setValue(vnode, newvalue);
        });
    }
}
exports.ModelWatch = ModelWatch;
function ModelSet(exp, vnode) {
    var initValue = vnode.mvvm.GetExpValue(exp);
    setValue(vnode, initValue);
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
exports.ModelSet = ModelSet;
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
        mountmvvm.FenceNode = custnode;
        custnode.AttachDom();
        mountmvvm.Reconstruct();
        var content = mountmvvm.Render();
        mountmvvm.StartWatch();
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
            return "[" + option.$id + "]" + str;
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

},{"../mvvm/mvvm":9,"../util":15,"../vdom/vdom":16,"../vnode/custom-node":17}],7:[function(require,module,exports){
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
        this.methods = {};
        this.Ins = [];
        this.Outs = [];
        this.hirented = false;
        if (option.data != null)
            this.data = JSON.parse(JSON.stringify(option.data));
        else
            this.data = {};
        this.methods = option.methods || {};
        this.template = option.template;
        this.Namespace = option.$namespace;
        this.domtree = option.$domtree;
        if (option.methods && option.methods.$init) {
            option.methods.$init.call(this);
        }
        this.Ins = option.props || [];
        this.Outs = option.events || [];
        this.observe = new observe_1.Observe(this.data);
        this.observe.Walk();
        for (var key in this.data) {
            this.proxyData(key);
        }
    }
    MVVM.prototype.proxyData = function (key) {
        Object.defineProperty(this, key, {
            get: function () {
                return this.data[key];
            },
            set: function (newval) {
                this.data[key] = newval;
            }
        });
    };
    MVVM.prototype.SetHirented = function (hirentedFromParent) {
        this.hirented = hirentedFromParent;
    };
    MVVM.prototype.GetTemplate = function () {
        return this.template;
    };
    MVVM.prototype.GetDomTree = function () {
        return this.domtree;
    };
    MVVM.prototype.Render = function () {
        this.TreeRoot.Render();
        return this.TreeRoot.Dom;
    };
    MVVM.prototype.RevokeMethod = function (method) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (this.hirented) {
            (_a = this.FenceNode.mvvm).RevokeMethod.apply(_a, [method].concat(params));
        }
        else {
            if (this.methods[method] != null)
                this.methods[method].apply(this, params);
        }
        var _a;
    };
    MVVM.prototype.GetExpValue = function (exp) {
        return this.observe.GetValueWithExp(exp);
    };
    MVVM.prototype.SetValue = function (exp, value) {
        var keys = exp.split(".");
        var target = this.data;
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
        if (this.FenceNode != null && this.FenceNode.mvvm != null) {
            var method = this.FenceNode.GetOut(event);
            revoke_event_1.RevokeEvent(method, data, this.FenceNode.mvvm);
        }
    };
    ;
    MVVM.prototype.$watchExp = function (vnode, exp, listener, deep) {
        this.observe.AddWatcher(vnode, exp, listener, deep);
    };
    MVVM.prototype.$ondestroy = function () {
    };
    MVVM.prototype.Reconstruct = function () {
        var _this = this;
        if (this.hirented) {
            Object.keys(this.FenceNode.mvvm.data).forEach(function (key) {
                _this.data[key] = _this.FenceNode.mvvm.data[key];
                _this.proxyData(key);
                _this.observe.DefineReactive(_this.data, key);
            });
        }
        this.Ins.forEach(function (prop) {
            _this.data[prop] = _this.FenceNode.GetInValue(prop);
            _this.proxyData(prop);
            _this.observe.DefineReactive(_this.data, prop);
        });
        this.TreeRoot.Reconstruct();
    };
    MVVM.prototype.StartWatch = function () {
        var _this = this;
        if (this.hirented) {
            Object.keys(this.FenceNode.mvvm.data).forEach(function (key) {
                _this.FenceNode.mvvm.$watchExp(_this.FenceNode, key, function (newvalue, oldvalue) {
                    _this.data[key] = newvalue;
                });
            });
        }
        this.Ins.forEach(function (prop) {
            var inName = _this.FenceNode.GetIn(prop);
            _this.FenceNode.mvvm.$watchExp(_this.FenceNode, inName, function (newvalue, oldvalue) {
                _this.data[prop] = newvalue;
            });
        });
        this.TreeRoot.StartWatch();
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
    queue.forEach(function (watcher) { return watcher.Update(); });
    queue = [];
}
exports.RevokeWatcher = RevokeWatcher;

},{}],12:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
require("./redefine-array");
var watcher_1 = require("./watcher");
var msg_queue_1 = require("./msg-queue");
var const_1 = require("../const");
var Observe = /** @class */ (function () {
    function Observe(data) {
        this.data = data;
    }
    Observe.prototype.GetValue = function (watcher) {
        Observe.target = watcher;
        var res = EvalSingle(this.data, watcher.Exp);
        Observe.target = null;
        return res;
    };
    Observe.prototype.GetValueWithExp = function (exp) {
        var res = EvalSingle(this.data, exp);
        return res;
    };
    Observe.prototype.Walk = function () {
        this.walk(this.data);
    };
    Observe.prototype.AddWatcher = function (vnode, exp, listener, deep) {
        new watcher_1.Watcher(vnode, exp, listener, this, deep);
    };
    Observe.prototype.RemoveWatcher = function (exp, listener) {
    };
    Observe.prototype.walk = function (data) {
        var _this = this;
        if (data != null && typeof data == "object") {
            Object.keys(data).forEach(function (key) {
                var depend = new Depender(key);
                _this.defineReactive(data, key, false, depend);
                _this.walk(data[key]);
            });
        }
    };
    Observe.prototype.DefineReactive = function (data, key) {
        var depend = new Depender(key);
        this.defineReactive(data, key, true, depend);
    };
    Observe.prototype.addArrayListener = function (array, depend) {
        if (array.$obs == null) {
            Object.defineProperty(array, "$obs", {
                enumerable: false,
                configurable: true,
                value: []
            });
        }
        if (array.$obs.indexOf(depend) == -1)
            array.$obs.push(depend);
    };
    Observe.prototype.defineReactive = function (data, key, shallow, depend) {
        var _this = this;
        var value = data[key];
        if (toString.call(value) == "[object Array]") {
            this.addArrayListener(value, depend);
        }
        Object.defineProperty(data, key, {
            get: function () {
                console.log("get key " + key, Observe.target);
                if (Observe.target != null) {
                    depend.AddTarget(Observe.target);
                }
                return value;
            },
            set: function (newval) {
                if (newval != value) {
                    value = newval;
                    if (toString.call(value) == "[object Array]") {
                        _this.addArrayListener(value, depend);
                    }
                    if (!shallow)
                        _this.walk(newval);
                    depend.Notify();
                }
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

},{"../const":1,"./msg-queue":11,"./redefine-array":13,"./watcher":14}],13:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var push = Array.prototype.push;
var splice = Array.prototype.splice;
var pop = Array.prototype.pop;
var shift = Array.prototype.shift;
var unshift = Array.prototype.shift;
var notify = function (obs) {
    if (obs != null)
        obs.forEach(function (ob) { return ob.Notify(); });
};
Array.prototype.push = function () {
    var res = push.apply(this, arguments);
    notify(this.$obs);
    return res;
};
Array.prototype.splice = function () {
    var old = this.length;
    var res = splice.apply(this, arguments);
    if (this.length != old) {
        notify(this.$obs);
    }
    return res;
};
Array.prototype.pop = function () {
    var res = pop.apply(this, arguments);
    notify(this.$obs);
    return res;
};
Array.prototype.shift = function () {
    var res = shift.apply(this, arguments);
    notify(this.$obs);
    return res;
};
Array.prototype.unshift = function () {
    var res = unshift.apply(this, arguments);
    notify(this.$obs);
    return res;
};

},{}],14:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../const");
var Watcher = /** @class */ (function () {
    function Watcher(vnode, Exp, cb, observer, deep) {
        this.vnode = vnode;
        this.Exp = Exp;
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
    }
    Watcher.prototype.GetVNode = function () {
        return this.vnode;
    };
    Watcher.prototype.Update = function () {
        var newval = this.observer.GetValue(this);
        if (this.value != newval) {
            console.log(this.Exp + " callback");
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

},{"../const":1}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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
        selfmvvm.FenceNode = cust;
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
        surroundmvvm.FenceNode = cust;
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
        selfmvvm.FenceNode = cust;
        cust.ParseTemplate();
        return cust;
    }
    return new vnode_1.VNode(dom, mvvm, parent);
}
exports.NewVNodeNoForNoIf = NewVNodeNoForNoIf;

},{"../manager/components-manager":6,"../mvvm/mvvm":9,"../util":15,"../vnode/custom-node":17,"../vnode/for-node":18,"../vnode/if-node":19,"../vnode/slot-node":20,"../vnode/vnode":22}],17:[function(require,module,exports){
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
        if (components_manager_1.IsComponentRegistered(ns.value, ns.namespace || this.SurroundMvvm.Namespace)) {
            var option = components_manager_1.GetComponent(ns.value, ns.namespace || this.SurroundMvvm.Namespace);
            var selfmvvm = new mvvm_1.MVVM(option);
            var child = new CustomNode(domtree, this.SurroundMvvm, null, selfmvvm);
            this.SurroundMvvm.TreeRoot = child;
            selfmvvm.FenceNode = this;
            child.ParseTemplate();
        }
        else {
            this.SurroundMvvm.TreeRoot = new vnode_1.VNode(domtree, this.SurroundMvvm, null);
        }
        this.SurroundMvvm.TreeRoot.AttachDom();
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
    CustomNode.prototype.Reconstruct = function () {
        this.SurroundMvvm.Reconstruct();
    };
    CustomNode.prototype.Refresh = function () {
        this.SurroundMvvm.TreeRoot.Refresh();
    };
    CustomNode.prototype.StartWatch = function () {
        this.SurroundMvvm.StartWatch();
    };
    CustomNode.prototype.Update = function () {
        this.SurroundMvvm.TreeRoot.Update();
    };
    CustomNode.prototype.testOutput = function (name) {
        if (this.SurroundMvvm.Outs.indexOf(name) == -1)
            return false;
        return true;
    };
    CustomNode.prototype.testInput = function (name) {
        if (this.SurroundMvvm.Ins.indexOf(name) == -1)
            return false;
        return true;
    };
    return CustomNode;
}(vnode_1.VNode));
exports.CustomNode = CustomNode;

},{"../manager/components-manager":6,"../mvvm/mvvm":9,"../util":15,"../vdom/vdom":16,"./template-node":21,"./vnode":22}],18:[function(require,module,exports){
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
        var mvvm = new mvvm_1.MVVM({ props: [itemexp] });
        mvvm.SetHirented(true);
        var fencenode = new custom_node_1.CustomNode(this.Vdom, this.mvvm, null, mvvm);
        mvvm.FenceNode = fencenode;
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
                custnode.SurroundMvvm.TreeRoot = vnode;
                custnodes.push(custnode);
            }
            custnodes.forEach(function (custnode) {
                _this.dynamicVNodes.push(custnode);
                custnode.Reconstruct();
                custnode.Render();
                custnode.StartWatch();
            });
            this.Parent.AddChildren(this, custnodes, oldcount);
            this.Parent.Refresh();
            return;
        }
        if (newcount < this.dynamicVNodes.length) {
            var moved = this.dynamicVNodes.splice(newcount);
            moved.forEach(function (vnode) { return vnode.SetStatus(const_1.VNodeStatus.DEPRECATED); });
            this.Parent.RemoveChildren(moved);
            this.Parent.Refresh();
        }
    };
    ForNode.prototype.Reconstruct = function () {
        var _this = this;
        var items = this.mvvm.GetExpValue(this.ForExp.arrayExp);
        this.dynamicVNodes = [];
        if (toString.call(items) === "[object Array]") {
            var copynodes = [];
            for (var i = 0; i < items.length; i++) {
                var copynode = this.newCopyNode(i);
                var vnode = vdom_1.NewVNodeNoFor(this.Vdom, copynode.SurroundMvvm, null);
                vnode.AttachDom();
                copynode.SurroundMvvm.TreeRoot = vnode;
                copynodes.push(copynode);
            }
            copynodes.forEach(function (copynode) {
                _this.dynamicVNodes.push(copynode);
                copynode.Reconstruct();
            });
            this.Parent.AddChildren(this, copynodes, 0);
        }
    };
    ForNode.prototype.StartWatch = function () {
        this.mvvm.$watchExp(this, this.ForExp.arrayExp + ".length", this.reImplementForExp.bind(this));
        this.dynamicVNodes.forEach(function (node) { return node.StartWatch(); });
    };
    ForNode.prototype.Update = function () {
        var items = this.mvvm.GetExpValue(this.ForExp.arrayExp);
        if (toString.call(items) === "[object Array]") {
            this.reImplementForExp(items.length);
        }
    };
    ForNode.prototype.AttachDom = function () { };
    ForNode.prototype.Render = function () {
        var _this = this;
        this.dynamicVNodes.forEach(function (node) {
            node.Render();
            if (node.Dom != null)
                _this.Parent.Dom.appendChild(node.Dom);
        });
    };
    return ForNode;
}(vnode_1.VNode));
exports.ForNode = ForNode;

},{"../const":1,"../models":8,"../mvvm/mvvm":9,"../vdom/vdom":16,"./custom-node":17,"./vnode":22}],19:[function(require,module,exports){
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
        if (this.dynamicVNode != null) {
            this.dynamicVNode.Render();
            if (this.Parent != null) {
                this.Parent.Dom.appendChild(this.dynamicVNode.Dom);
            }
            else {
                this.Dom = this.dynamicVNode.Dom;
            }
        }
    };
    IfNode.prototype.Update = function () {
        var attached = this.mvvm.GetExpValue(this.ifExp);
        this.reImpletement(attached);
    };
    IfNode.prototype.StartWatch = function () {
        var _this = this;
        this.mvvm.$watchExp(this, this.ifExp, function (newvalue) { return _this.reImpletement(newvalue); });
        if (this.dynamicVNode != null)
            this.dynamicVNode.StartWatch();
    };
    IfNode.prototype.reImpletement = function (newvalue) {
        if (newvalue) {
            if (this.dynamicVNode == null) {
                this.instance();
                this.dynamicVNode.Render();
                this.dynamicVNode.StartWatch();
            }
            else {
                this.dynamicVNode.Update();
            }
            if (this.Parent != null) {
                this.Parent.AddChildren(this, [this.dynamicVNode], 0);
                this.Parent.Refresh();
            }
            else {
                this.mvvm.FenceNode.Dom = this.dynamicVNode.Dom;
                this.mvvm.FenceNode.Parent.Refresh();
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
                    this.mvvm.FenceNode.Dom = null;
                    this.mvvm.FenceNode.Parent.Refresh();
                }
                this.dynamicVNode.SetStatus(const_1.VNodeStatus.INACTIVE);
            }
        }
    };
    IfNode.prototype.Reconstruct = function () {
        var attached = this.mvvm.GetExpValue(this.ifExp);
        if (attached) {
            this.instance();
            if (this.Parent != null)
                this.Parent.AddChildren(this, [this.dynamicVNode], 0);
        }
    };
    IfNode.prototype.instance = function () {
        this.dynamicVNode = vdom_1.NewVNodeNoForNoIf(this.Vdom, this.mvvm, null);
        this.dynamicVNode.IsCopy = true;
        this.dynamicVNode.AttachDom();
        this.dynamicVNode.Reconstruct();
    };
    return IfNode;
}(vnode_1.VNode));
exports.IfNode = IfNode;

},{"../const":1,"../vdom/vdom":16,"./vnode":22}],20:[function(require,module,exports){
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
        var template = this.mvvm.FenceNode.GetTemplate(this.name);
        if (template != null) {
            template.Render();
            this.Dom = template.Dom;
            while (this.Dom.firstChild != null) {
                this.Parent.Dom.appendChild(this.Dom.firstChild);
            }
        }
        return null;
    };
    SlotNode.prototype.StartWatch = function () {
        var template = this.mvvm.FenceNode.GetTemplate(this.name);
        if (template != null) {
            template.StartWatch();
        }
    };
    SlotNode.prototype.Update = function () {
        var template = this.mvvm.FenceNode.GetTemplate(this.name);
        if (template != null) {
            template.Update();
        }
    };
    return SlotNode;
}(vnode_1.VNode));
exports.SlotNode = SlotNode;

},{"./vnode":22}],21:[function(require,module,exports){
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
    TemplateNode.prototype.StartWatch = function () {
        this.Children.forEach(function (child) {
            child.StartWatch();
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

},{"./vnode":22}],22:[function(require,module,exports){
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
                util_1.LogError("input " + attr + " not exist on " + this.NodeName);
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
                util_1.LogError("output " + RegExp.$1 + " not exist on " + this.NodeName);
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
        if (this.NodeType == 1) {
            var dom_1 = document.createElement(this.NodeName);
            this.Attrs.forEach(function (prop) {
                dom_1.setAttribute(prop.name, prop.value);
            });
            this.Dom = dom_1;
            this.Children.forEach(function (child) {
                if (!child.IsCopy)
                    child.Render();
            });
            //todo 设置属性
            dir_handler_1.DirectiveSet(this);
        }
        if (this.NodeType == 3) {
            this.Dom = document.createTextNode(this.NodeValue);
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
        if (this.Parent && this.Parent.Dom)
            this.Parent.Dom.appendChild(this.Dom);
    };
    VNode.prototype.multiBindParse = function (nodevalue) {
        var res = "";
        var values = nodevalue.match(/\{\{(.*?)\}\}/g);
        var start = 0;
        var end = 0;
        for (var i = 0; i < values.length; i++) {
            end = nodevalue.indexOf(values[i]);
            res += "\"" + nodevalue.substring(start, end) + "\"+(" + values[i].substring(2, values[i].length - 2) + ")";
            start = end + values[i].length;
        }
        return res;
    };
    VNode.prototype.StartWatch = function () {
        var _this = this;
        if (this.NodeType == 1) {
            this.Children.forEach(function (child) {
                if (!child.IsCopy)
                    child.StartWatch();
            });
            dir_handler_1.DirectiveWatch(this);
            return;
        }
        if (this.NodeType == 3) {
            console.log("xx");
            if (const_2.REG_SINGLE.test(this.NodeValue)) {
                this.mvvm.$watchExp(this, RegExp.$1, function (newvalue, oldvalue) {
                    _this.Dom.textContent = newvalue;
                });
            }
            else {
                if (const_1.REG_MULTI.test(this.NodeValue)) {
                    var res = this.multiBindParse(this.NodeValue);
                    this.mvvm.$watchExp(this, res, function (newvalue, oldvalue) {
                        _this.Dom.textContent = newvalue;
                    });
                }
            }
        }
    };
    VNode.prototype.Update = function () {
        //todo 更新属性
        if (this.NodeType == 1) {
            var children_1 = [];
            this.Children.forEach(function (child) {
                children_1.push(child);
            });
            children_1.forEach(function (child) {
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
        if (ruler.j < allvnodes.length) {
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
        nodes.forEach(function (node) { return node.onremove(); });
        this.Children = this.Children.filter(function (child) {
            return nodes.indexOf(child) == -1;
        });
    };
    VNode.prototype.onremove = function () { };
    /**根据当前model值渲染虚拟dom结构 */
    VNode.prototype.Reconstruct = function () {
        var children = [];
        this.Children.forEach(function (child) {
            children.push(child);
        });
        children.forEach(function (child) {
            child.Reconstruct();
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
        this.Children.forEach(function (child) { return child.SetStatus(status); });
    };
    VNode.prototype.GetStatus = function () {
        return this.status;
    };
    return VNode;
}());
exports.VNode = VNode;

},{"../const":1,"../directive/dir-handler":2,"../util":15,"../vdom/vdom":16,"./../const":1}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3QudHMiLCJzcmMvZGlyZWN0aXZlL2Rpci1oYW5kbGVyLnRzIiwic3JjL2RpcmVjdGl2ZS9tb2RlbC50cyIsInNyYy9kaXJlY3RpdmUvb25jbGljay50cyIsInNyYy9tYWluLnRzIiwic3JjL21hbmFnZXIvY29tcG9uZW50cy1tYW5hZ2VyLnRzIiwic3JjL21hbmFnZXIvdmFsdWUtbWFuYWdlci50cyIsInNyYy9tb2RlbHMudHMiLCJzcmMvbXZ2bS9tdnZtLnRzIiwic3JjL212dm0vcmV2b2tlLWV2ZW50LnRzIiwic3JjL29ic2VydmVyL21zZy1xdWV1ZS50cyIsInNyYy9vYnNlcnZlci9vYnNlcnZlLnRzIiwic3JjL29ic2VydmVyL3JlZGVmaW5lLWFycmF5LnRzIiwic3JjL29ic2VydmVyL3dhdGNoZXIudHMiLCJzcmMvdXRpbC50cyIsInNyYy92ZG9tL3Zkb20udHMiLCJzcmMvdm5vZGUvY3VzdG9tLW5vZGUudHMiLCJzcmMvdm5vZGUvZm9yLW5vZGUudHMiLCJzcmMvdm5vZGUvaWYtbm9kZS50cyIsInNyYy92bm9kZS9zbG90LW5vZGUudHMiLCJzcmMvdm5vZGUvdGVtcGxhdGUtbm9kZS50cyIsInNyYy92bm9kZS92bm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBYSxRQUFBLFNBQVMsR0FBRyxPQUFPLENBQUE7QUFDbkIsUUFBQSxlQUFlLEdBQUcsT0FBTyxDQUFBO0FBRXRDLGdCQUFnQjtBQUNILFFBQUEsVUFBVSxHQUFHLGdCQUFnQixDQUFBO0FBQzdCLFFBQUEsU0FBUyxHQUFHLGNBQWMsQ0FBQTtBQUN2QyxjQUFjO0FBQ0QsUUFBQSxTQUFTLEdBQUMsaUJBQWlCLENBQUE7QUFDeEMsU0FBUztBQUNJLFFBQUEsT0FBTyxHQUFDLGlCQUFpQixDQUFBO0FBQ3pCLFFBQUEsV0FBVyxHQUFDLGVBQWUsQ0FBQTtBQUV4QyxVQUFVO0FBQ0cs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N0I7U0FDSjtJQUNULENBQUM7SUFDRCx5QkFBUyxHQUFUO1FBQ0ksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ2YsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQ25CLENBQUM7SUFDRCx5QkFBUyxHQUFULFVBQVUsTUFBa0I7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBQyxNQUFNLENBQUE7UUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLElBQUUsT0FBQSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUE7SUFDekQsQ0FBQztJQUNELHlCQUFTLEdBQVQ7UUFDSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDdEIsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQWpTQSxBQWlTQyxJQUFBO0FBalNZLHNCQUFLIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0IGNvbnN0IERJUl9NT0RFTCA9IFwibW9kZWxcIlxuZXhwb3J0IGNvbnN0IERJUl9FVkVOVF9DTElDSyA9IFwiY2xpY2tcIlxuXG4vKiroirHmi6zlj7fmlbDmja7nu5Hlrprooajovr7lvI8gKi9cbmV4cG9ydCBjb25zdCBSRUdfU0lOR0xFID0gL15cXHtcXHsoLiopXFx9XFx9JC9cbmV4cG9ydCBjb25zdCBSRUdfTVVMVEkgPSAvXFx7XFx7KC4qKVxcfVxcfS9cbi8qKuS6i+S7tuebkeWQrOWTjeW6lOWHveaVsCAqL1xuZXhwb3J0IGNvbnN0IFJFR19FVkVOVD0vXihcXHcrKVxcKCguKilcXCkkL1xuLyoq5a2X56ym5LiyICovXG5leHBvcnQgY29uc3QgUkVHX1NUUj0vXihbJ1wiXSkoLio/KVxcMSQvXG5leHBvcnQgY29uc3QgUkVHX01JRF9TVFI9LyhbJ1wiXSkoLio/KVxcMS9cblxuLyoq6L6T5YWl5bGe5oCnICovXG5leHBvcnQgY29uc3QgUkVHX0lOPS9eXFxbKFxcdyspXFxdJC9cbi8qKui+k+WHuuS6i+S7tiAqL1xuZXhwb3J0IGNvbnN0IFJFR19PVVQ9L15cXCgoXFx3KylcXCkkL1xuLyoq5q2j5bi45bGe5oCnICovXG5leHBvcnQgY29uc3QgUkVHX0FUVFI9L15bQS16X11cXHcqJC9cblxuLyoq5rWL6K+V6L6T5YWl6aG5ICovXG5leHBvcnQgY29uc3QgUkVHX1RFU1RfSU5QVVQ9L14oKG1vZGVsKSkkL1xuLyoq5rWL6K+V6L6T5Ye66aG5ICovXG5leHBvcnQgY29uc3QgUkVHX1RFU1RfT1VUUFVUPS9eKChjbGljaykpJC9cblxuZXhwb3J0IGVudW0gVk5vZGVTdGF0dXN7XG4gICAgLyoq5L6d54S25aSE5LqOdm5vZGXmoJHkuK0gKi9cbiAgICBBQ1RJVkUsXG4gICAgLyoq5LiN5Zyodm5vZGXmoJHkuK3kvYbmmK/mnInlj6/og73ph43mlrDliqDlm57mnaUgKi9cbiAgICBJTkFDVElWRSxcbiAgICAvKirmipvlvIMgKi9cbiAgICBERVBSRUNBVEVEXG59IiwiaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi4vdm5vZGUvdm5vZGVcIjtcbmltcG9ydCB7IE1vZGVsV2F0Y2gsIE1vZGVsU2V0IH0gZnJvbSBcIi4vbW9kZWxcIjtcbmltcG9ydCB7IE9uQ2xpY2sgfSBmcm9tIFwiLi9vbmNsaWNrXCI7XG5leHBvcnQgZnVuY3Rpb24gRGlyZWN0aXZlU2V0KHZub2RlOiBWTm9kZSkge1xuICAgIGxldCBpbnB1dHM9dm5vZGUuR2V0SW5wdXQoKVxuICAgIGZvcihsZXQgbmFtZSBpbiBpbnB1dHMpe1xuICAgICAgICBzd2l0Y2gobmFtZSl7XG4gICAgICAgICAgICBjYXNlIFwibW9kZWxcIjpcbiAgICAgICAgICAgIE1vZGVsU2V0KGlucHV0c1tuYW1lXSx2bm9kZSlcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGxldCBvdXRwdXRzPXZub2RlLkdldE91dHB1dCgpXG4gICAgZm9yKGxldCBuYW1lIGluIG91dHB1dHMpe1xuICAgICAgICBzd2l0Y2gobmFtZSl7XG4gICAgICAgICAgICBjYXNlIFwiY2xpY2tcIjpcbiAgICAgICAgICAgIE9uQ2xpY2sob3V0cHV0c1tuYW1lXSx2bm9kZSlcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufVxuZXhwb3J0IGZ1bmN0aW9uIERpcmVjdGl2ZVdhdGNoKHZub2RlOiBWTm9kZSl7XG4gICAgbGV0IGlucHV0cz12bm9kZS5HZXRJbnB1dCgpXG4gICAgZm9yKGxldCBuYW1lIGluIGlucHV0cyl7XG4gICAgICAgIHN3aXRjaChuYW1lKXtcbiAgICAgICAgICAgIGNhc2UgXCJtb2RlbFwiOlxuICAgICAgICAgICAgTW9kZWxXYXRjaChpbnB1dHNbbmFtZV0sdm5vZGUpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBWTm9kZSB9IGZyb20gXCIuLi92bm9kZS92bm9kZVwiXG5leHBvcnQgZnVuY3Rpb24gTW9kZWxXYXRjaChleHA6IHN0cmluZywgdm5vZGU6IFZOb2RlKSB7XG4gICAgbGV0IGlucHV0dHlwZT12bm9kZS5WZG9tLkdldEF0dHIoXCJ0eXBlXCIpXG4gICAgbGV0IGlucHV0PXZub2RlLlZkb20uTm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuICAgIGlmKGlucHV0PT1cImlucHV0XCIgJiYgaW5wdXR0eXBlPT1cImNoZWNrYm94XCIpe1xuICAgICAgICB2bm9kZS5tdnZtLiR3YXRjaEV4cCh2bm9kZSxleHAsIChuZXd2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgc2V0VmFsdWUodm5vZGUsIG5ld3ZhbHVlKVxuICAgICAgICB9LHRydWUpO1xuICAgIH1lbHNle1xuICAgICAgICB2bm9kZS5tdnZtLiR3YXRjaEV4cCh2bm9kZSxleHAsIChuZXd2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgc2V0VmFsdWUodm5vZGUsIG5ld3ZhbHVlKVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gTW9kZWxTZXQoZXhwOiBzdHJpbmcsIHZub2RlOiBWTm9kZSkge1xuICAgIGxldCBpbml0VmFsdWUgPSB2bm9kZS5tdnZtLkdldEV4cFZhbHVlKGV4cClcbiAgICBzZXRWYWx1ZSh2bm9kZSwgaW5pdFZhbHVlKVxuICAgIHZub2RlLkRvbS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgLy9zZWxlY3Tmjqfku7ZcbiAgICAgICAgaWYgKHZub2RlLk5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgdm5vZGUubXZ2bS5TZXRWYWx1ZShleHAsIGV2ZW50LnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIC8vdGV4dCByYWRpbyBjaGVja2JveOaOp+S7tlxuICAgICAgICBsZXQgaW5wdXRUeXBlID0gKHZub2RlLkRvbSBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwidHlwZVwiKVxuICAgICAgICBpZiAoaW5wdXRUeXBlID09IG51bGwgfHwgaW5wdXRUeXBlID09IFwiXCIpXG4gICAgICAgICAgICBpbnB1dFR5cGUgPSBcInRleHRcIlxuICAgICAgICBzd2l0Y2ggKGlucHV0VHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJyYWRpb1wiOlxuICAgICAgICAgICAgICAgIHZub2RlLm12dm0uU2V0VmFsdWUoZXhwLCBldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxuICAgICAgICAgICAgICAgIGxldCBjdXIgPSB2bm9kZS5tdnZtLkdldEV4cFZhbHVlKGV4cClcbiAgICAgICAgICAgICAgICBpZiAodG9TdHJpbmcuY2FsbChjdXIpID09IFwiW29iamVjdCBBcnJheV1cIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkYXJyYXkgPSBjdXIgYXMgQXJyYXk8YW55PjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gb2xkYXJyYXkuaW5kZXhPZihldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkYXJyYXkucHVzaChldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRhcnJheS5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH0pXG59XG5mdW5jdGlvbiBzZXRWYWx1ZSh2bm9kZTogVk5vZGUsIG5ld3ZhbHVlOiBhbnkpIHtcbiAgICAvL3NlbGVjdOaOp+S7tlxuICAgIGlmICh2bm9kZS5Ob2RlTmFtZS50b0xvd2VyQ2FzZSgpID09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgKHZub2RlLkRvbSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IG5ld3ZhbHVlXG4gICAgICAgIHJldHVyblxuICAgIH1cbiAgICAvL3RleHQgcmFkaW8gY2hlY2tib3jmjqfku7ZcbiAgICBsZXQgaW5wdXRUeXBlID0gKHZub2RlLkRvbSBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwidHlwZVwiKVxuICAgIGlmIChpbnB1dFR5cGUgPT0gbnVsbCB8fCBpbnB1dFR5cGUgPT0gXCJcIilcbiAgICAgICAgaW5wdXRUeXBlID0gXCJ0ZXh0XCJcbiAgICBzd2l0Y2ggKGlucHV0VHlwZSkge1xuICAgICAgICBjYXNlIFwidGV4dFwiOlxuICAgICAgICAgICAgKHZub2RlLkRvbSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IG5ld3ZhbHVlXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwicmFkaW9cIjpcbiAgICAgICAgICAgIGlmICgodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID09IG5ld3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgKHZub2RlLkRvbSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgKHZub2RlLkRvbSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwiY2hlY2tib3hcIjpcbiAgICAgICAgICAgIGlmICh0b1N0cmluZy5jYWxsKG5ld3ZhbHVlKSA9PSBcIltvYmplY3QgQXJyYXldXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3dmFsdWUuaW5kZXhPZigodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAodm5vZGUuRG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBicmVha1xuICAgIH1cbn0iLCJpbXBvcnQge1JFR19FVkVOVCwgUkVHX1NUUn0gZnJvbSBcIi4uL2NvbnN0XCJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4uL3Zub2RlL3Zub2RlXCI7XG5leHBvcnQgZnVuY3Rpb24gT25DbGljayhkaXI6c3RyaW5nLHZub2RlOlZOb2RlKXtcbiAgICBpZiAoUkVHX0VWRU5ULnRlc3QoZGlyKSkge1xuICAgICAgICBsZXQgbWV0aG9kU3RyID0gUmVnRXhwLiQxXG4gICAgICAgIGxldCBwYXJhbXNTdHIgPSBSZWdFeHAuJDJcbiAgICAgICAgaWYgKHBhcmFtc1N0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgcHMgPSBwYXJhbXNTdHIuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgICB2bm9kZS5Eb20uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zOiBhbnlbXSA9IFtdXG4gICAgICAgICAgICAgICAgcHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFSRUdfU1RSLnRlc3QocCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocCA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbiA9IG5ldyBOdW1iZXIocCkudmFsdWVPZigpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKG4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2gobi52YWx1ZU9mKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6IKv5a6a5piv5pys5Zyw5Y+Y6YePXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2godm5vZGUubXZ2bS5HZXRFeHBWYWx1ZShwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKFJlZ0V4cC4kMilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgdm5vZGUubXZ2bS5SZXZva2VNZXRob2QobWV0aG9kU3RyLCAuLi5wYXJhbXMpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHZub2RlLkRvbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZub2RlLm12dm0uUmV2b2tlTWV0aG9kKG1ldGhvZFN0cikgIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBSZWdpc3RlckNvbXBvbmVudCwgU3RhcnQgfSBmcm9tIFwiLi9tYW5hZ2VyL2NvbXBvbmVudHMtbWFuYWdlclwiO1xuaW1wb3J0IHsgTVZWTUNvbXBvbmVudE9wdGlvbiB9IGZyb20gXCIuL21vZGVsc1wiO1xuaW1wb3J0IHsgUmVnaXN0ZXJWYWx1ZSB9IGZyb20gXCIuL21hbmFnZXIvdmFsdWUtbWFuYWdlclwiO1xuKDxhbnk+d2luZG93KS5SaW89e1xuICAgIGNvbXBvbmVudDpmdW5jdGlvbihuYW1lOnN0cmluZyxvcHRpb246TVZWTUNvbXBvbmVudE9wdGlvbil7XG4gICAgICAgIG9wdGlvbi4kbmFtZT1uYW1lXG4gICAgICAgIFJlZ2lzdGVyQ29tcG9uZW50KG9wdGlvbixcImRlZmF1bHRcIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIHZhbHVlOmZ1bmN0aW9uKHZhbHVlOntbbmFtZTpzdHJpbmddOmFueX0pe1xuICAgICAgICBSZWdpc3RlclZhbHVlKHZhbHVlLFwiZGVmYXVsdFwiKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG4gICAgbmFtZXNwYWNlOmZ1bmN0aW9uKG5hbWVzcGFjZTpzdHJpbmcpe1xuICAgICAgICBsZXQgbmM9ZnVuY3Rpb24obmFtZTpzdHJpbmcsb3B0aW9uczpNVlZNQ29tcG9uZW50T3B0aW9uKXtcbiAgICAgICAgICAgIG9wdGlvbnMuJG5hbWU9bmFtZVxuICAgICAgICAgICAgUmVnaXN0ZXJDb21wb25lbnQob3B0aW9ucyxuYW1lc3BhY2UpXG4gICAgICAgICAgICByZXR1cm4gd3JhcFxuICAgICAgICB9XG4gICAgICAgIGxldCBudj1mdW5jdGlvbih2YWx1ZTphbnkpe1xuICAgICAgICAgICAgUmVnaXN0ZXJWYWx1ZSh2YWx1ZSxuYW1lc3BhY2UpXG4gICAgICAgICAgICByZXR1cm4gd3JhcFxuICAgICAgICB9XG4gICAgICAgIGxldCB3cmFwPXtcbiAgICAgICAgICAgIGNvbXBvbmVudDpuYyxcbiAgICAgICAgICAgIHZhbHVlOm52XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdyYXBcbiAgICB9XG59XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uKCl7XG4gICAgU3RhcnQoKVxufSkiLCJpbXBvcnQgeyBWRG9tIH0gZnJvbSAnLi8uLi92ZG9tL3Zkb20nO1xuaW1wb3J0IHsgTVZWTUNvbXBvbmVudE9wdGlvbiB9IGZyb20gXCIuLi9tb2RlbHNcIjtcbmltcG9ydCB7IE1WVk0gfSBmcm9tIFwiLi4vbXZ2bS9tdnZtXCI7XG5pbXBvcnQgeyBDdXN0b21Ob2RlIH0gZnJvbSBcIi4uL3Zub2RlL2N1c3RvbS1ub2RlXCI7XG5pbXBvcnQgeyBUcmF2ZXJzZURvbSB9IGZyb20gXCIuLi92ZG9tL3Zkb21cIjtcbmltcG9ydCB7IEdldE5TLCBIdHRwR2V0LCBMb2dFcnJvciB9IGZyb20gXCIuLi91dGlsXCI7XG5cbmxldCByb290czp7b3B0aW9uOk1WVk1Db21wb25lbnRPcHRpb24sZG9tOk5vZGV9W109W11cbmxldCBuYW1lc3BhY2VzOntbbmFtZXNwYWNlOnN0cmluZ106e1tjb21wb25lbnQ6c3RyaW5nXTpNVlZNQ29tcG9uZW50T3B0aW9ufX09e1xuICAgIFwiZGVmYXVsdFwiOntcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gU3RhcnQoKXtcbiAgICBmaXJzdFJlbmRlcihkb2N1bWVudC5ib2R5KVxuICAgIHJvb3RzLmZvckVhY2gocm9vdD0+e1xuICAgICAgICBsZXQgZG9tdHJlZT1UcmF2ZXJzZURvbShyb290LmRvbSlcblxuICAgICAgICBsZXQgbW91bnRtdnZtPW5ldyBNVlZNKHJvb3Qub3B0aW9uKVxuICAgICAgICBsZXQgY3VzdG5vZGU9bmV3IEN1c3RvbU5vZGUoZG9tdHJlZSxudWxsLG51bGwsbW91bnRtdnZtKVxuICAgICAgICBjdXN0bm9kZS5QYXJzZVRlbXBsYXRlKClcbiAgICAgICAgbW91bnRtdnZtLkZlbmNlTm9kZT1jdXN0bm9kZVxuICAgICAgICBjdXN0bm9kZS5BdHRhY2hEb20oKVxuICAgICAgICBtb3VudG12dm0uUmVjb25zdHJ1Y3QoKVxuICAgICAgICBsZXQgY29udGVudD1tb3VudG12dm0uUmVuZGVyKClcbiAgICAgICAgbW91bnRtdnZtLlN0YXJ0V2F0Y2goKVxuICAgICAgICByb290LmRvbS5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChjb250ZW50LHJvb3QuZG9tKVxuICAgIH0pXG59XG5mdW5jdGlvbiBmaXJzdFJlbmRlcihkb206SFRNTEVsZW1lbnQpe1xuICAgIGxldCBucz1HZXROUyhkb20ubm9kZU5hbWUpXG4gICAgaWYoSXNDb21wb25lbnRSZWdpc3RlcmVkKG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8XCJkZWZhdWx0XCIpKXtcbiAgICAgICAgbGV0IGNvbXBvbmVudD1HZXRDb21wb25lbnQobnMudmFsdWUsbnMubmFtZXNwYWNlfHxcImRlZmF1bHRcIilcbiAgICAgICAgcm9vdHMucHVzaCh7b3B0aW9uOmNvbXBvbmVudCxkb206ZG9tfSlcbiAgICB9ZWxzZXtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxkb20uY2hpbGRyZW4ubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBsZXQgY2hpbGQ9ZG9tLmNoaWxkcmVuW2ldIGFzIEhUTUxFbGVtZW50XG4gICAgICAgICAgICBmaXJzdFJlbmRlcihjaGlsZClcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBSZWdpc3RlckNvbXBvbmVudChvcHRpb246TVZWTUNvbXBvbmVudE9wdGlvbixuYW1lc3BhY2U6c3RyaW5nKXtcbiAgICBvcHRpb24uJG5hbWVzcGFjZT1uYW1lc3BhY2UudG9Mb3dlckNhc2UoKVxuICAgIFxuICAgIGlmKG5hbWVzcGFjZXNbbmFtZXNwYWNlXT09bnVsbClcbiAgICAgICAgbmFtZXNwYWNlc1tuYW1lc3BhY2VdPXt9XG4gICAgbGV0IGNvbXBvbmVudHM9bmFtZXNwYWNlc1tuYW1lc3BhY2VdXG4gICAgY29tcG9uZW50c1tvcHRpb24uJG5hbWVdPW9wdGlvblxufVxuZXhwb3J0IGZ1bmN0aW9uIEdldENvbXBvbmVudChuYW1lOnN0cmluZyxuYW1lc3BhY2U6c3RyaW5nKTpNVlZNQ29tcG9uZW50T3B0aW9ue1xuICAgIG5hbWU9bmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgbmFtZXNwYWNlPW5hbWVzcGFjZS50b0xvd2VyQ2FzZSgpXG4gICAgbGV0IG9wdGlvbj1uYW1lc3BhY2VzW25hbWVzcGFjZV0gJiYgbmFtZXNwYWNlc1tuYW1lc3BhY2VdW25hbWVdXG4gICAgaWYob3B0aW9uICYmIG9wdGlvbi4kaWQ9PW51bGwpXG4gICAgICAgIHByZVRyZWF0bWVudChvcHRpb24pXG4gICAgcmV0dXJuIG9wdGlvblxufVxuZXhwb3J0IGZ1bmN0aW9uIElzQ29tcG9uZW50UmVnaXN0ZXJlZChuYW1lOnN0cmluZyxuYW1lc3BhY2U6c3RyaW5nKXtcbiAgICBuYW1lPW5hbWUudG9Mb3dlckNhc2UoKVxuICAgIG5hbWVzcGFjZT1uYW1lc3BhY2UudG9Mb3dlckNhc2UoKVxuICAgIGlmKG5hbWVzcGFjZXNbbmFtZXNwYWNlXSAmJiBuYW1lc3BhY2VzW25hbWVzcGFjZV1bbmFtZV0pXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gZmFsc2Vcbn1cbmZ1bmN0aW9uIHByZVRyZWF0bWVudChvcHRpb246TVZWTUNvbXBvbmVudE9wdGlvbil7XG4gICAgLy/llK/kuIDmoIfor4ZcbiAgICBvcHRpb24uJGlkPW9wdGlvbi4kbmFtZXNwYWNlK1wiX1wiK29wdGlvbi4kbmFtZVxuICAgIC8v5qih54mIXG4gICAgaWYob3B0aW9uLnRlbXBsYXRlVXJsIT1udWxsKXtcbiAgICAgICAgb3B0aW9uLnRlbXBsYXRlPUh0dHBHZXQob3B0aW9uLnRlbXBsYXRlVXJsKVxuICAgICAgICBpZihvcHRpb24udGVtcGxhdGU9PW51bGwpe1xuICAgICAgICAgICAgTG9nRXJyb3IoXCJwYXRoIFwiK29wdGlvbi50ZW1wbGF0ZVVybCtcIiBub3QgZm91bmRcIilcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGxldCBkb209KG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKG9wdGlvbi50ZW1wbGF0ZSxcInRleHQvaHRtbFwiKS5ib2R5LmNoaWxkcmVuWzBdXG4gICAgb3B0aW9uLiRkb210cmVlPVRyYXZlcnNlRG9tKGRvbSlcbiAgICAvL+agt+W8j1xuICAgIGlmKG9wdGlvbi5zdHlsZVVybCE9bnVsbCl7XG4gICAgICAgIG9wdGlvbi5zdHlsZT1IdHRwR2V0KG9wdGlvbi5zdHlsZVVybClcbiAgICB9XG4gICAgaWYob3B0aW9uLnN0eWxlIT1udWxsKXtcbiAgICAgICAgbGV0IGNzcz1vcHRpb24uc3R5bGUucmVwbGFjZSgvKD8hXFxzKShbXlxce1xcfV0rKSg/PVxce1teXFx7XFx9XSpcXH0pL2csZnVuY3Rpb24oc3RyKXtcbiAgICAgICAgICAgIHJldHVybiBcIltcIitvcHRpb24uJGlkK1wiXVwiK3N0clxuICAgICAgICB9KVxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gY3NzO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgYWRkQXR0cihvcHRpb24uJGRvbXRyZWUsb3B0aW9uLiRpZClcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRBdHRyKGRvbTpWRG9tLGF0dHI6c3RyaW5nKXtcbiAgICBkb20uQWRkQXR0cihhdHRyKVxuICAgIGlmKGRvbS5Ob2RlVHlwZT09MSl7XG4gICAgICAgIGRvbS5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkPT57XG4gICAgICAgICAgICBhZGRBdHRyKGNoaWxkLGF0dHIpXG4gICAgICAgIH0pXG4gICAgfVxufSIsIlxubGV0IG5hbWVzcGFjZXM6e1tuYW1lc3BhY2U6c3RyaW5nXTp7W3ZhbHVlbmFtZTpzdHJpbmddOmFueX19PXtcbiAgICBcImRlZmF1bHRcIjp7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIFJlZ2lzdGVyVmFsdWUodmFsdWU6e1tuYW1lOnN0cmluZ106YW55fSxuYW1lc3BhY2U6c3RyaW5nKXtcbiAgICBpZihuYW1lc3BhY2VzW25hbWVzcGFjZV09PW51bGwpXG4gICAgICAgIG5hbWVzcGFjZXNbbmFtZXNwYWNlXT17fVxuICAgIGxldCB2YWx1ZXM9bmFtZXNwYWNlc1tuYW1lc3BhY2VdXG4gICAgZm9yKGxldCBrZXkgaW4gdmFsdWUpe1xuICAgICAgICB2YWx1ZXNba2V5XT12YWx1ZVtrZXldXG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIEdldFZhbHVlKG5hbWU6c3RyaW5nLG5hbWVzcGFjZTpzdHJpbmcpOmFueXtcbiAgICByZXR1cm4gbmFtZXNwYWNlc1tuYW1lc3BhY2VdICYmIG5hbWVzcGFjZXNbbmFtZXNwYWNlXVtuYW1lXVxufVxuZXhwb3J0IGZ1bmN0aW9uIEdldFZhbHVlcyhuYW1lc3BhY2U6c3RyaW5nKTphbnl7XG4gICAgcmV0dXJuIG5hbWVzcGFjZXNbbmFtZXNwYWNlXVxufVxuZXhwb3J0IGZ1bmN0aW9uIElzVmFsdWVSZWdpc3RlcmVkKG5hbWU6c3RyaW5nLG5hbWVzcGFjZTpzdHJpbmcpe1xuICAgIGlmKG5hbWVzcGFjZXNbbmFtZXNwYWNlXSAmJiBuYW1lc3BhY2VzW25hbWVzcGFjZV1bbmFtZV0pXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gZmFsc2Vcbn0iLCJpbXBvcnQgeyBWRG9tIH0gZnJvbSAnLi92ZG9tL3Zkb20nO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1WVk1Db21wb25lbnRPcHRpb257XG4gICAgJG5hbWU/OnN0cmluZyxcbiAgICB0ZW1wbGF0ZT86c3RyaW5nLFxuICAgIHRlbXBsYXRlVXJsPzpzdHJpbmcsXG4gICAgZGF0YT86T2JqZWN0LFxuICAgIG1ldGhvZHM/OntbbmFtZTpzdHJpbmddOkZ1bmN0aW9ufSxcbiAgICBwcm9wcz86c3RyaW5nW10sXG4gICAgZXZlbnRzPzpzdHJpbmdbXSxcbiAgICBzdHlsZT86c3RyaW5nLFxuICAgIHN0eWxlVXJsPzpzdHJpbmcsXG4gICAgJG5hbWVzcGFjZT86c3RyaW5nLFxuICAgICRpZD86c3RyaW5nLFxuICAgICRkb210cmVlPzpWRG9tXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT25EYXRhQ2hhbmdlIHtcbiAgICAobmV3dmFsdWU6YW55LG9sZHZhbHVlOmFueSk6dm9pZFxufVxuLyoqZm9y6K+t5Y+lICovXG5leHBvcnQgY2xhc3MgRm9yRXhwe1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpdGVtRXhwOnN0cmluZyxwdWJsaWMgYXJyYXlFeHA6c3RyaW5nKXt9XG59XG5cbi8qKui/lOWbnuWAvCAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXR1cmVWYWx1ZXtcbiAgICBleHA6c3RyaW5nLFxuICAgIGRhdGE6YW55XG59XG5cblxuIiwiaW1wb3J0IHsgTVZWTUNvbXBvbmVudE9wdGlvbiB9IGZyb20gXCIuLi9tb2RlbHNcIjtcbmltcG9ydCB7IEN1c3RvbU5vZGUgfSBmcm9tIFwiLi4vdm5vZGUvY3VzdG9tLW5vZGVcIjtcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4uL3Zub2RlL3Zub2RlXCI7XG5pbXBvcnQgeyBPbkRhdGFDaGFuZ2UgfSBmcm9tICcuLy4uL21vZGVscyc7XG5pbXBvcnQgeyBWRG9tIH0gZnJvbSAnLi8uLi92ZG9tL3Zkb20nO1xuaW1wb3J0IHsgUmV2b2tlRXZlbnQgfSBmcm9tICcuL3Jldm9rZS1ldmVudCc7XG5pbXBvcnQgeyBPYnNlcnZlIH0gZnJvbSBcIi4uL29ic2VydmVyL29ic2VydmVcIjtcbmV4cG9ydCBjbGFzcyBNVlZNIHtcbiAgICBGZW5jZU5vZGU6Q3VzdG9tTm9kZVxuICAgIFRyZWVSb290OlZOb2RlXG4gICAgXG4gICAgcHJpdmF0ZSBkYXRhOmFueVxuICAgIHByaXZhdGUgbWV0aG9kczp7W25hbWU6c3RyaW5nXTpGdW5jdGlvbn09e31cbiAgICBwcml2YXRlIHRlbXBsYXRlOnN0cmluZ1xuICAgIHByaXZhdGUgZG9tdHJlZTpWRG9tXG5cbiAgICBOYW1lc3BhY2U6c3RyaW5nXG4gICAgSW5zOnN0cmluZ1tdPVtdXG4gICAgT3V0czpzdHJpbmdbXT1bXVxuICAgIHByaXZhdGUgb2JzZXJ2ZTpPYnNlcnZlXG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb246TVZWTUNvbXBvbmVudE9wdGlvbil7XG4gICAgICAgIGlmKG9wdGlvbi5kYXRhIT1udWxsKVxuICAgICAgICAgICAgdGhpcy5kYXRhPUpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3B0aW9uLmRhdGEpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmRhdGE9e31cbiAgICAgICAgdGhpcy5tZXRob2RzPW9wdGlvbi5tZXRob2RzICB8fHt9XG4gICAgICAgIHRoaXMudGVtcGxhdGU9b3B0aW9uLnRlbXBsYXRlXG4gICAgICAgIHRoaXMuTmFtZXNwYWNlPW9wdGlvbi4kbmFtZXNwYWNlXG4gICAgICAgIHRoaXMuZG9tdHJlZT1vcHRpb24uJGRvbXRyZWVcblxuICAgICAgICBpZihvcHRpb24ubWV0aG9kcyAmJiBvcHRpb24ubWV0aG9kcy4kaW5pdCl7XG4gICAgICAgICAgICBvcHRpb24ubWV0aG9kcy4kaW5pdC5jYWxsKHRoaXMpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5JbnM9b3B0aW9uLnByb3BzIHx8IFtdXG4gICAgICAgIHRoaXMuT3V0cz1vcHRpb24uZXZlbnRzIHx8IFtdXG5cbiAgICAgICAgdGhpcy5vYnNlcnZlPW5ldyBPYnNlcnZlKHRoaXMuZGF0YSlcbiAgICAgICAgdGhpcy5vYnNlcnZlLldhbGsoKVxuICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLmRhdGEpe1xuICAgICAgICAgICAgdGhpcy5wcm94eURhdGEoa2V5KVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgcHJveHlEYXRhKGtleTpzdHJpbmcpe1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxrZXkse1xuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtrZXldXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uKG5ld3ZhbCl7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2tleV09bmV3dmFsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHByaXZhdGUgaGlyZW50ZWQ9ZmFsc2VcbiAgICBcbiAgICBcbiAgICBTZXRIaXJlbnRlZChoaXJlbnRlZEZyb21QYXJlbnQ6Ym9vbGVhbil7XG4gICAgICAgIHRoaXMuaGlyZW50ZWQ9aGlyZW50ZWRGcm9tUGFyZW50XG4gICAgfVxuICAgIEdldFRlbXBsYXRlKCk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVxuICAgIH1cbiAgICBHZXREb21UcmVlKCk6VkRvbXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9tdHJlZVxuICAgIH1cbiAgICBSZW5kZXIoKXtcbiAgICAgICAgdGhpcy5UcmVlUm9vdC5SZW5kZXIoKVxuICAgICAgICByZXR1cm4gdGhpcy5UcmVlUm9vdC5Eb21cbiAgICB9XG4gICAgUmV2b2tlTWV0aG9kKG1ldGhvZDpzdHJpbmcsLi4ucGFyYW1zOmFueVtdKXtcbiAgICAgICAgaWYodGhpcy5oaXJlbnRlZCl7XG4gICAgICAgICAgICB0aGlzLkZlbmNlTm9kZS5tdnZtLlJldm9rZU1ldGhvZChtZXRob2QsLi4ucGFyYW1zKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGlmKHRoaXMubWV0aG9kc1ttZXRob2RdIT1udWxsKVxuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMscGFyYW1zKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIEdldEV4cFZhbHVlKGV4cDpzdHJpbmcpOmFueXtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZS5HZXRWYWx1ZVdpdGhFeHAoZXhwKVxuICAgIH1cbiAgICBcbiAgICBTZXRWYWx1ZShleHA6c3RyaW5nLHZhbHVlOmFueSl7XG4gICAgICAgIGxldCBrZXlzPWV4cC5zcGxpdChcIi5cIilcbiAgICAgICAgbGV0IHRhcmdldD10aGlzLmRhdGFcbiAgICAgICAgbGV0IGhhc1RyYWdldD10cnVlXG4gICAgICAgIGZvcihsZXQgaT0wO2k8a2V5cy5sZW5ndGgtMTtpKyspe1xuICAgICAgICAgICAgaWYodGFyZ2V0IT1udWxsKVxuICAgICAgICAgICAgICAgIHRhcmdldD10YXJnZXRba2V5c1tpXV1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgaGFzVHJhZ2V0PWZhbHNlXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZihoYXNUcmFnZXQgJiYgdGFyZ2V0IT1udWxsKVxuICAgICAgICAgICAgdGFyZ2V0W2tleXNba2V5cy5sZW5ndGgtMV1dPXZhbHVlXG4gICAgfVxuICAgICRlbWl0KGV2ZW50OnN0cmluZywuLi5kYXRhOmFueVtdKXtcbiAgICAgICAgaWYodGhpcy5GZW5jZU5vZGUhPW51bGwgJiYgdGhpcy5GZW5jZU5vZGUubXZ2bSE9bnVsbCl7XG4gICAgICAgICAgICBsZXQgbWV0aG9kPXRoaXMuRmVuY2VOb2RlLkdldE91dChldmVudClcbiAgICAgICAgICAgIFJldm9rZUV2ZW50KG1ldGhvZCxkYXRhLHRoaXMuRmVuY2VOb2RlLm12dm0pXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHB1YmxpYyAkd2F0Y2hFeHAodm5vZGU6Vk5vZGUsZXhwOnN0cmluZyxsaXN0ZW5lcjpPbkRhdGFDaGFuZ2UsZGVlcD86Ym9vbGVhbil7XG4gICAgICAgIHRoaXMub2JzZXJ2ZS5BZGRXYXRjaGVyKHZub2RlLGV4cCxsaXN0ZW5lcixkZWVwKVxuICAgIH1cbiAgICBcbiAgICAkb25kZXN0cm95KCl7XG4gICAgICAgIFxuICAgIH1cbiAgICBSZWNvbnN0cnVjdCgpe1xuICAgICAgICBpZih0aGlzLmhpcmVudGVkKXtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuRmVuY2VOb2RlLm12dm0uZGF0YSkuZm9yRWFjaChrZXk9PntcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFba2V5XT10aGlzLkZlbmNlTm9kZS5tdnZtLmRhdGFba2V5XVxuICAgICAgICAgICAgICAgIHRoaXMucHJveHlEYXRhKGtleSlcbiAgICAgICAgICAgICAgICB0aGlzLm9ic2VydmUuRGVmaW5lUmVhY3RpdmUodGhpcy5kYXRhLGtleSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5JbnMuZm9yRWFjaChwcm9wPT57XG4gICAgICAgICAgICB0aGlzLmRhdGFbcHJvcF09dGhpcy5GZW5jZU5vZGUuR2V0SW5WYWx1ZShwcm9wKVxuICAgICAgICAgICAgdGhpcy5wcm94eURhdGEocHJvcClcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZS5EZWZpbmVSZWFjdGl2ZSh0aGlzLmRhdGEscHJvcClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5UcmVlUm9vdC5SZWNvbnN0cnVjdCgpXG4gICAgfVxuICAgIFN0YXJ0V2F0Y2goKXtcbiAgICAgICAgaWYodGhpcy5oaXJlbnRlZCl7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLkZlbmNlTm9kZS5tdnZtLmRhdGEpLmZvckVhY2goa2V5PT57XG4gICAgICAgICAgICAgICAgdGhpcy5GZW5jZU5vZGUubXZ2bS4kd2F0Y2hFeHAodGhpcy5GZW5jZU5vZGUsa2V5LChuZXd2YWx1ZTphbnksb2xkdmFsdWU6YW55KT0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFba2V5XT1uZXd2YWx1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuSW5zLmZvckVhY2gocHJvcD0+e1xuICAgICAgICAgICAgbGV0IGluTmFtZT10aGlzLkZlbmNlTm9kZS5HZXRJbihwcm9wKVxuICAgICAgICAgICAgdGhpcy5GZW5jZU5vZGUubXZ2bS4kd2F0Y2hFeHAodGhpcy5GZW5jZU5vZGUsaW5OYW1lLChuZXd2YWx1ZTphbnksb2xkdmFsdWU6YW55KT0+e1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtwcm9wXT1uZXd2YWx1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5UcmVlUm9vdC5TdGFydFdhdGNoKClcbiAgICB9XG59IiwiaW1wb3J0IHtSRUdfRVZFTlQsIFJFR19TVFJ9IGZyb20gXCIuLi9jb25zdFwiXG5pbXBvcnQgeyBNVlZNIH0gZnJvbSBcIi4vbXZ2bVwiO1xuZXhwb3J0IGZ1bmN0aW9uIFJldm9rZUV2ZW50KG1ldGhvZDpzdHJpbmcsZGF0YTphbnksbXZ2bTpNVlZNKXtcbiAgICBpZiAoUkVHX0VWRU5ULnRlc3QobWV0aG9kKSkge1xuICAgICAgICBsZXQgbWV0aG9kU3RyID0gUmVnRXhwLiQxXG4gICAgICAgIGxldCBwYXJhbXNTdHIgPSBSZWdFeHAuJDJcbiAgICAgICAgaWYgKHBhcmFtc1N0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgcHMgPSBwYXJhbXNTdHIuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgICBsZXQgcGFyYW1zOiBhbnlbXSA9IFtdXG4gICAgICAgICAgICBwcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghUkVHX1NUUi50ZXN0KHApKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2godHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwID09PSBcImZhbHNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYocD09XCIkZXZlbnRcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaCguLi5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IG4gPSBuZXcgTnVtYmVyKHApLnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKG4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChuLnZhbHVlT2YoKSlcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6IKv5a6a5piv5pys5Zyw5Y+Y6YePXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChtdnZtLkdldEV4cFZhbHVlKHApKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goUmVnRXhwLiQyKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBtdnZtLlJldm9rZU1ldGhvZChtZXRob2RTdHIsIC4uLnBhcmFtcylcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBtdnZtLlJldm9rZU1ldGhvZChtZXRob2RTdHIpICBcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBXYXRjaGVyIH0gZnJvbSAnLi93YXRjaGVyJztcblxubGV0IHF1ZXVlOldhdGNoZXJbXT1bXVxubGV0IHNldHRpbWVvdXQ9ZmFsc2VcbmV4cG9ydCBmdW5jdGlvbiBBZGRXYXRjaGVyKHdhdGNoZXI6V2F0Y2hlcil7XG4gICAgaWYocXVldWUuaW5kZXhPZih3YXRjaGVyKT09LTEpXG4gICAgICAgIHF1ZXVlLnB1c2god2F0Y2hlcilcbiAgICBpZighc2V0dGltZW91dCl7XG4gICAgICAgIHNldHRpbWVvdXQ9dHJ1ZVxuICAgICAgICBcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBSZXZva2VXYXRjaGVyKClcbiAgICAgICAgICAgIHNldHRpbWVvdXQ9ZmFsc2UgICAgICAgICAgICBcbiAgICAgICAgfSwgMCk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIFJldm9rZVdhdGNoZXIoKXtcbiAgICBxdWV1ZS5mb3JFYWNoKHdhdGNoZXI9PndhdGNoZXIuVXBkYXRlKCkpXG4gICAgcXVldWU9W11cbn0iLCJpbXBvcnQgeyBWTm9kZSB9IGZyb20gJy4uL3Zub2RlL3Zub2RlJztcbmltcG9ydCB7IE9uRGF0YUNoYW5nZSB9IGZyb20gJy4vLi4vbW9kZWxzJztcbmltcG9ydCBcIi4vcmVkZWZpbmUtYXJyYXlcIjtcbmltcG9ydCB7IFdhdGNoZXIgfSBmcm9tIFwiLi93YXRjaGVyXCI7XG5pbXBvcnQgeyBBZGRXYXRjaGVyIH0gZnJvbSAnLi9tc2ctcXVldWUnO1xuaW1wb3J0IHsgVk5vZGVTdGF0dXMgfSBmcm9tICcuLi9jb25zdCc7XG5cbmRlY2xhcmUgbGV0IEV2YWxTaW5nbGU6KGNvbnRleHQ6YW55LGV4cDpzdHJpbmcpPT5hbnlcbmV4cG9ydCBjbGFzcyBPYnNlcnZle1xuICAgIHByaXZhdGUgc3RhdGljIHRhcmdldDpXYXRjaGVyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBkYXRhOmFueSl7fVxuICAgIEdldFZhbHVlKHdhdGNoZXI6V2F0Y2hlcil7XG4gICAgICAgIE9ic2VydmUudGFyZ2V0PXdhdGNoZXJcbiAgICAgICAgbGV0IHJlcz1FdmFsU2luZ2xlKHRoaXMuZGF0YSx3YXRjaGVyLkV4cClcbiAgICAgICAgT2JzZXJ2ZS50YXJnZXQ9bnVsbCAgICAgICAgXG4gICAgICAgIHJldHVybiByZXNcbiAgICAgICAgXG4gICAgfVxuICAgIEdldFZhbHVlV2l0aEV4cChleHA6c3RyaW5nKXtcbiAgICAgICAgbGV0IHJlcz1FdmFsU2luZ2xlKHRoaXMuZGF0YSxleHApXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG4gICAgV2Fsaygpe1xuICAgICAgICB0aGlzLndhbGsodGhpcy5kYXRhKVxuICAgIH1cbiAgICBBZGRXYXRjaGVyKHZub2RlOlZOb2RlLGV4cDpzdHJpbmcsbGlzdGVuZXI6T25EYXRhQ2hhbmdlLGRlZXA/OmJvb2xlYW4pe1xuICAgICAgICBuZXcgV2F0Y2hlcih2bm9kZSxleHAsbGlzdGVuZXIsdGhpcyxkZWVwKVxuICAgIH1cbiAgICBSZW1vdmVXYXRjaGVyKGV4cDpzdHJpbmcsbGlzdGVuZXI6T25EYXRhQ2hhbmdlKXtcblxuICAgIH1cbiAgICBwcml2YXRlIHdhbGsoZGF0YTphbnkpe1xuICAgICAgICBpZihkYXRhIT1udWxsICYmIHR5cGVvZiBkYXRhPT1cIm9iamVjdFwiKXtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goa2V5PT57XG4gICAgICAgICAgICAgICAgbGV0IGRlcGVuZD1uZXcgRGVwZW5kZXIoa2V5KVxuICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lUmVhY3RpdmUoZGF0YSxrZXksZmFsc2UsZGVwZW5kKVxuICAgICAgICAgICAgICAgIHRoaXMud2FsayhkYXRhW2tleV0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIERlZmluZVJlYWN0aXZlKGRhdGE6YW55LGtleTpzdHJpbmcpe1xuICAgICAgICBsZXQgZGVwZW5kPW5ldyBEZXBlbmRlcihrZXkpICAgICAgICBcbiAgICAgICAgdGhpcy5kZWZpbmVSZWFjdGl2ZShkYXRhLGtleSx0cnVlLGRlcGVuZClcbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRBcnJheUxpc3RlbmVyKGFycmF5OmFueSxkZXBlbmQ6RGVwZW5kZXIpe1xuICAgICAgICBpZihhcnJheS4kb2JzPT1udWxsKXtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhcnJheSxcIiRvYnNcIix7XG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTpmYWxzZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6dHJ1ZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTpbXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZihhcnJheS4kb2JzLmluZGV4T2YoZGVwZW5kKT09LTEpXG4gICAgICAgICAgICBhcnJheS4kb2JzLnB1c2goZGVwZW5kKVxuICAgICAgICBcbiAgICB9XG4gICAgcHJpdmF0ZSBkZWZpbmVSZWFjdGl2ZShkYXRhOmFueSxrZXk6c3RyaW5nLHNoYWxsb3c6Ym9vbGVhbixkZXBlbmQ6RGVwZW5kZXIpe1xuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhW2tleV1cbiAgICAgICAgaWYodG9TdHJpbmcuY2FsbCh2YWx1ZSk9PVwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICB0aGlzLmFkZEFycmF5TGlzdGVuZXIodmFsdWUsZGVwZW5kKVxuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkYXRhLCBrZXksIHtcbiAgICAgICAgICAgIGdldDogKCk9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXQga2V5IFwiK2tleSxPYnNlcnZlLnRhcmdldClcbiAgICAgICAgICAgICAgICBpZihPYnNlcnZlLnRhcmdldCE9bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZC5BZGRUYXJnZXQoT2JzZXJ2ZS50YXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogKG5ld3ZhbCk9PntcbiAgICAgICAgICAgICAgICBpZiAobmV3dmFsICE9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPW5ld3ZhbFxuICAgICAgICAgICAgICAgICAgICBpZih0b1N0cmluZy5jYWxsKHZhbHVlKT09XCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQXJyYXlMaXN0ZW5lcih2YWx1ZSxkZXBlbmQpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoIXNoYWxsb3cpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndhbGsobmV3dmFsKSAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZC5Ob3RpZnkoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOnRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6dHJ1ZVxuICAgICAgICB9KVxuICAgIH1cblxufVxuZXhwb3J0IGNsYXNzIERlcGVuZGVye1xuICAgIHByaXZhdGUgd2F0Y2hlczpXYXRjaGVyW109W11cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleTpzdHJpbmcpe1xuICAgIH1cbiAgICBHZXRLZXkoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5XG4gICAgfVxuICAgIEFkZFRhcmdldCh3YXRjaGVyOldhdGNoZXIpe1xuICAgICAgICBpZih0aGlzLndhdGNoZXMuaW5kZXhPZih3YXRjaGVyKT09LTEpXG4gICAgICAgICAgICB0aGlzLndhdGNoZXMucHVzaCh3YXRjaGVyKVxuICAgIH1cbiAgICBOb3RpZnkoKXtcbiAgICAgICAgdGhpcy53YXRjaGVzPXRoaXMud2F0Y2hlcy5maWx0ZXIod2F0Y2hlcj0+e1xuICAgICAgICAgICAgaWYod2F0Y2hlci5HZXRWTm9kZSgpLkdldFN0YXR1cygpPT1WTm9kZVN0YXR1cy5BQ1RJVkUgKXtcbiAgICAgICAgICAgICAgICBBZGRXYXRjaGVyKHdhdGNoZXIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHdhdGNoZXIuR2V0Vk5vZGUoKS5HZXRTdGF0dXMoKT09Vk5vZGVTdGF0dXMuSU5BQ1RJVkUgKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICBpZih3YXRjaGVyLkdldFZOb2RlKCkuR2V0U3RhdHVzKCk9PVZOb2RlU3RhdHVzLkRFUFJFQ0FURUQgKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9KVxuICAgIH1cbn0iLCJpbXBvcnQgeyBEZXBlbmRlciB9IGZyb20gXCIuL29ic2VydmVcIjtcblxubGV0IHB1c2g9QXJyYXkucHJvdG90eXBlLnB1c2g7XG5sZXQgc3BsaWNlPUFycmF5LnByb3RvdHlwZS5zcGxpY2U7XG5sZXQgcG9wPUFycmF5LnByb3RvdHlwZS5wb3A7XG5sZXQgc2hpZnQ9QXJyYXkucHJvdG90eXBlLnNoaWZ0O1xubGV0IHVuc2hpZnQ9QXJyYXkucHJvdG90eXBlLnNoaWZ0O1xuXG5sZXQgbm90aWZ5PWZ1bmN0aW9uKG9iczpEZXBlbmRlcltdKXtcbiAgICBpZihvYnMhPW51bGwpXG4gICAgICAgIG9icy5mb3JFYWNoKG9iPT5vYi5Ob3RpZnkoKSlcbn07XG4oQXJyYXkucHJvdG90eXBlLnB1c2ggYXMgYW55KT1mdW5jdGlvbigpe1xuICAgIGxldCByZXM9cHVzaC5hcHBseSh0aGlzLGFyZ3VtZW50cylcbiAgICBub3RpZnkodGhpcy4kb2JzKVxuICAgIHJldHVybiByZXNcbn07XG4oQXJyYXkucHJvdG90eXBlLnNwbGljZSBhcyBhbnkpPWZ1bmN0aW9uKCl7XG4gICAgbGV0IG9sZD10aGlzLmxlbmd0aFxuICAgIGxldCByZXM9c3BsaWNlLmFwcGx5KHRoaXMsYXJndW1lbnRzKVxuICAgIGlmKHRoaXMubGVuZ3RoIT1vbGQpe1xuICAgICAgICBub3RpZnkodGhpcy4kb2JzKVxuICAgIH1cbiAgICByZXR1cm4gcmVzXG59O1xuKEFycmF5LnByb3RvdHlwZS5wb3AgYXMgYW55KT1mdW5jdGlvbigpe1xuICAgIGxldCByZXM9cG9wLmFwcGx5KHRoaXMsYXJndW1lbnRzKVxuICAgIG5vdGlmeSh0aGlzLiRvYnMpXG4gICAgcmV0dXJuIHJlc1xufTtcbihBcnJheS5wcm90b3R5cGUuc2hpZnQgYXMgYW55KT1mdW5jdGlvbigpe1xuICAgIGxldCByZXM9c2hpZnQuYXBwbHkodGhpcyxhcmd1bWVudHMpXG4gICAgbm90aWZ5KHRoaXMuJG9icylcbiAgICByZXR1cm4gcmVzXG59O1xuKEFycmF5LnByb3RvdHlwZS51bnNoaWZ0IGFzIGFueSk9ZnVuY3Rpb24oKXtcbiAgICBsZXQgcmVzPXVuc2hpZnQuYXBwbHkodGhpcyxhcmd1bWVudHMpXG4gICAgbm90aWZ5KHRoaXMuJG9icylcbiAgICByZXR1cm4gcmVzXG59OyIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSAnLi8uLi92bm9kZS92bm9kZSc7XG5pbXBvcnQgeyBPbkRhdGFDaGFuZ2UgfSBmcm9tICcuLy4uL21vZGVscyc7XG5pbXBvcnQgeyBPYnNlcnZlIH0gZnJvbSAnLi9vYnNlcnZlJztcbmltcG9ydCB7IFZOb2RlU3RhdHVzIH0gZnJvbSAnLi4vY29uc3QnO1xuXG5cbmV4cG9ydCBjbGFzcyBXYXRjaGVye1xuICAgIHByaXZhdGUgdmFsdWU6YW55XG4gICAgcHJpdmF0ZSBkZWVwUmVjb3JkOmFueVtdPVtdXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB2bm9kZTpWTm9kZSxwdWJsaWMgRXhwOnN0cmluZyxwcml2YXRlIGNiOk9uRGF0YUNoYW5nZSxwcml2YXRlIG9ic2VydmVyOk9ic2VydmUscHJpdmF0ZSBkZWVwPzpib29sZWFuKXtcbiAgICAgICAgdGhpcy52YWx1ZT10aGlzLm9ic2VydmVyLkdldFZhbHVlKHRoaXMpXG4gICAgICAgIGlmKHRoaXMuZGVlcCAmJiB0b1N0cmluZy5jYWxsKHRoaXMudmFsdWUpPT1cIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLnZhbHVlLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuZGVlcFJlY29yZFtpXT10aGlzLnZhbHVlW2ldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgR2V0Vk5vZGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMudm5vZGVcbiAgICB9XG4gICAgVXBkYXRlKCl7XG4gICAgICAgIGxldCBuZXd2YWw9dGhpcy5vYnNlcnZlci5HZXRWYWx1ZSh0aGlzKVxuICAgICAgICBpZih0aGlzLnZhbHVlIT1uZXd2YWwpe1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5FeHArXCIgY2FsbGJhY2tcIilcbiAgICAgICAgICAgIGlmKHRoaXMudm5vZGUuR2V0U3RhdHVzKCk9PVZOb2RlU3RhdHVzLkFDVElWRSlcbiAgICAgICAgICAgICAgICB0aGlzLmNiKG5ld3ZhbCx0aGlzLnZhbHVlKVxuICAgICAgICAgICAgdGhpcy52YWx1ZT1uZXd2YWxcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAvL+WIpOaWreaVsOe7hOWFg+e0oOaYr+WQpuacieWPmOWMllxuICAgICAgICAgICAgaWYodGhpcy5kZWVwICYmIHRvU3RyaW5nLmNhbGwodGhpcy52YWx1ZSk9PVwiW29iamVjdCBBcnJheV1cIiApe1xuICAgICAgICAgICAgICAgIGxldCBkaWZmPWZhbHNlXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxuZXd2YWwubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKG5ld3ZhbFtpXSE9dGhpcy5kZWVwUmVjb3JkW2ldKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2IobmV3dmFsLHRoaXMudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmPXRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoZGlmZil7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVlcFJlY29yZD1bXVxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPG5ld3ZhbC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVlcFJlY29yZFtpXT1uZXd2YWxbaV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgXG4gICAgfVxufSIsImV4cG9ydCBmdW5jdGlvbiBMb2dFcnJvcihtc2c6YW55KXtcbiAgICBjb25zb2xlLmVycm9yKG1zZylcbn1cbmV4cG9ydCBmdW5jdGlvbiBMb2dJbmZvKG1zZzphbnkpe1xuICAgIGNvbnNvbGUubG9nKG1zZylcbn1cbmV4cG9ydCBmdW5jdGlvbiBHZXROUyhzdHI6c3RyaW5nKTp7bmFtZXNwYWNlOnN0cmluZyx2YWx1ZTpzdHJpbmd9e1xuICAgIGxldCByZXM9c3RyLnNwbGl0KFwiOlwiKVxuICAgIGlmKHJlcy5sZW5ndGg9PTEpXG4gICAgICAgIHJldHVybiB7bmFtZXNwYWNlOm51bGwsdmFsdWU6cmVzWzBdfVxuICAgIGlmKHJlcy5sZW5ndGg9PTIpXG4gICAgICAgIHJldHVybiB7bmFtZXNwYWNlOnJlc1swXSx2YWx1ZTpyZXNbMV19XG59XG5leHBvcnQgZnVuY3Rpb24gSHR0cEdldCh1cmw6c3RyaW5nKTpzdHJpbmd7XG4gICAgbGV0IHhocj1uZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHhoci5vcGVuKFwiR0VUXCIsdXJsLGZhbHNlKVxuICAgIHhoci5zZW5kKClcbiAgICBpZih4aHIucmVhZHlTdGF0ZT09NCAmJiB4aHIuc3RhdHVzPT0yMDApXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gbnVsbFxufSIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4uL3Zub2RlL3Zub2RlXCI7XG5pbXBvcnQgeyBJc0NvbXBvbmVudFJlZ2lzdGVyZWQsIEdldENvbXBvbmVudCB9IGZyb20gXCIuLi9tYW5hZ2VyL2NvbXBvbmVudHMtbWFuYWdlclwiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IEdldE5TIH0gZnJvbSBcIi4uL3V0aWxcIjtcbmRlY2xhcmUgbGV0IHJlcXVpcmU6KG1vZHVsZTpzdHJpbmcpPT5hbnlcbmV4cG9ydCBjbGFzcyBWRG9te1xuICAgIE5vZGVWYWx1ZTogc3RyaW5nXG4gICAgTm9kZU5hbWU6IHN0cmluZ1xuICAgIE5vZGVUeXBlOiBudW1iZXJcbiAgICBBdHRyczogeyBOYW1lOiBzdHJpbmcsIFZhbHVlOiBzdHJpbmcgfVtdID0gW11cbiAgICBDaGlsZHJlbjogVkRvbVtdID0gW11cbiAgICBHZXRBdHRyKG5hbWU6c3RyaW5nKXtcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLkF0dHJzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgaWYodGhpcy5BdHRyc1tpXS5OYW1lPT1uYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkF0dHJzW2ldLlZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgQWRkQXR0cihhdHRyOnN0cmluZyl7XG4gICAgICAgIHRoaXMuQXR0cnMucHVzaCh7TmFtZTphdHRyLFZhbHVlOlwiXCJ9KVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBUcmF2ZXJzZURvbShkb206Tm9kZSk6VkRvbXtcbiAgICBpZihkb20ubm9kZVR5cGU9PTMgJiYgZG9tLm5vZGVWYWx1ZS50cmltKCk9PVwiXCIpXG4gICAgICAgIHJldHVyblxuICAgIGxldCByb290PW5ldyBWRG9tKClcbiAgICByb290Lk5vZGVWYWx1ZT1kb20ubm9kZVZhbHVlXG4gICAgcm9vdC5Ob2RlTmFtZT1kb20ubm9kZU5hbWVcbiAgICByb290Lk5vZGVUeXBlPWRvbS5ub2RlVHlwZVxuICAgIGlmKGRvbS5ub2RlVHlwZT09MSl7XG4gICAgICAgIGxldCBodG1sZG9tPWRvbSBhcyBIVE1MRWxlbWVudFxuICAgICAgICBmb3IobGV0IGk9MDtpPGh0bWxkb20uYXR0cmlidXRlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIHJvb3QuQXR0cnMucHVzaCh7TmFtZTpodG1sZG9tLmF0dHJpYnV0ZXNbaV0ubmFtZSxWYWx1ZTpodG1sZG9tLmF0dHJpYnV0ZXNbaV0udmFsdWV9KVxuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgaT0wO2k8aHRtbGRvbS5jaGlsZE5vZGVzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbGV0IGNoaWxkPVRyYXZlcnNlRG9tKGh0bWxkb20uY2hpbGROb2Rlc1tpXSlcbiAgICAgICAgICAgIGNoaWxkICYmIHJvb3QuQ2hpbGRyZW4ucHVzaChjaGlsZClcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcm9vdFxufVxuZXhwb3J0IGZ1bmN0aW9uIE5ld1ZOb2RlKGRvbTpWRG9tLG12dm06TVZWTSxwYXJlbnQ6Vk5vZGUpOlZOb2Rle1xuICAgIGlmKGRvbS5Ob2RlTmFtZS50b0xvd2VyQ2FzZSgpPT1cInNsb3RcIil7XG4gICAgICAgIGxldCBTbG90Tm9kZT1yZXF1aXJlKFwiLi4vdm5vZGUvc2xvdC1ub2RlXCIpLlNsb3ROb2RlXG4gICAgICAgIHJldHVybiBuZXcgU2xvdE5vZGUoZG9tLG12dm0scGFyZW50LGRvbS5HZXRBdHRyKFwibmFtZVwiKSlcbiAgICB9XG5cbiAgICBpZihkb20uR2V0QXR0cihcIltmb3JdXCIpIT1udWxsKXtcbiAgICAgICAgbGV0IEZvck5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL2Zvci1ub2RlXCIpLkZvck5vZGVcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JOb2RlKGRvbSxtdnZtLHBhcmVudCxkb20uR2V0QXR0cihcIltmb3JdXCIpKVxuICAgIH1cbiAgICBpZihkb20uR2V0QXR0cihcIltpZl1cIikhPW51bGwpe1xuICAgICAgICBsZXQgSWZOb2RlPXJlcXVpcmUoXCIuLi92bm9kZS9pZi1ub2RlXCIpLklmTm9kZVxuICAgICAgICByZXR1cm4gbmV3IElmTm9kZShkb20sbXZ2bSxwYXJlbnQsZG9tLkdldEF0dHIoXCJbaWZdXCIpKSAgICAgICAgICAgICAgXG4gICAgfVxuICAgIGxldCBucz1HZXROUyhkb20uTm9kZU5hbWUpXG4gICAgaWYoSXNDb21wb25lbnRSZWdpc3RlcmVkKG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8XCJkZWZhdWx0XCIpKXtcbiAgICAgICAgbGV0IG9wdGlvbj1HZXRDb21wb25lbnQobnMudmFsdWUsbnMubmFtZXNwYWNlfHxcImRlZmF1bHRcIilcbiAgICAgICAgbGV0IHNlbGZtdnZtPW5ldyBNVlZNKG9wdGlvbilcbiAgICAgICAgbGV0IEN1c3RvbU5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL2N1c3RvbS1ub2RlXCIpLkN1c3RvbU5vZGVcbiAgICAgICAgbGV0IGN1c3Q9IG5ldyBDdXN0b21Ob2RlKGRvbSxtdnZtLHBhcmVudCxzZWxmbXZ2bSlcbiAgICAgICAgc2VsZm12dm0uRmVuY2VOb2RlPWN1c3RcbiAgICAgICAgY3VzdC5QYXJzZVRlbXBsYXRlKClcbiAgICAgICAgcmV0dXJuIGN1c3RcbiAgICB9XG4gICAgICAgIFxuICAgIHJldHVybiBuZXcgVk5vZGUoZG9tLG12dm0scGFyZW50KVxufVxuZXhwb3J0IGZ1bmN0aW9uIE5ld1ZOb2RlTm9Gb3IoZG9tOlZEb20sbXZ2bTpNVlZNLHBhcmVudDpWTm9kZSk6Vk5vZGV7XG4gICAgaWYoZG9tLk5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PVwic2xvdFwiKXtcbiAgICAgICAgbGV0IFNsb3ROb2RlPXJlcXVpcmUoXCIuLi92bm9kZS9zbG90LW5vZGVcIikuU2xvdE5vZGVcbiAgICAgICAgcmV0dXJuIG5ldyBTbG90Tm9kZShkb20sbXZ2bSxwYXJlbnQsZG9tLkdldEF0dHIoXCJuYW1lXCIpKVxuICAgIH1cblxuICAgIGlmKGRvbS5HZXRBdHRyKFwiW2lmXVwiKSE9bnVsbCl7XG4gICAgICAgIGxldCBJZk5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL2lmLW5vZGVcIikuSWZOb2RlXG4gICAgICAgIHJldHVybiBuZXcgSWZOb2RlKGRvbSxtdnZtLHBhcmVudCxkb20uR2V0QXR0cihcIltpZl1cIikpICAgICAgICAgICAgICBcbiAgICB9XG4gICAgbGV0IG5zPUdldE5TKGRvbS5Ob2RlTmFtZSlcbiAgICBpZihJc0NvbXBvbmVudFJlZ2lzdGVyZWQobnMudmFsdWUsbnMubmFtZXNwYWNlfHxcImRlZmF1bHRcIikpe1xuICAgICAgICBsZXQgb3B0aW9uPUdldENvbXBvbmVudChucy52YWx1ZSxucy5uYW1lc3BhY2V8fFwiZGVmYXVsdFwiKVxuICAgICAgICBsZXQgc3Vycm91bmRtdnZtPW5ldyBNVlZNKG9wdGlvbilcbiAgICAgICAgbGV0IEN1c3RvbU5vZGU9cmVxdWlyZShcIi4uL3Zub2RlL2N1c3RvbS1ub2RlXCIpLkN1c3RvbU5vZGVcbiAgICAgICAgbGV0IGN1c3Q9IG5ldyBDdXN0b21Ob2RlKGRvbSxtdnZtLHBhcmVudCxzdXJyb3VuZG12dm0pXG4gICAgICAgIHN1cnJvdW5kbXZ2bS5GZW5jZU5vZGU9Y3VzdFxuICAgICAgICBjdXN0LlBhcnNlVGVtcGxhdGUoKVxuICAgICAgICByZXR1cm4gY3VzdFxuICAgIH1cbiAgICAgICAgXG4gICAgcmV0dXJuIG5ldyBWTm9kZShkb20sbXZ2bSxwYXJlbnQpXG59XG5leHBvcnQgZnVuY3Rpb24gTmV3Vk5vZGVOb0Zvck5vSWYoZG9tOlZEb20sbXZ2bTpNVlZNLHBhcmVudDpWTm9kZSk6Vk5vZGV7XG4gICAgaWYoZG9tLk5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PVwic2xvdFwiKXtcbiAgICAgICAgbGV0IFNsb3ROb2RlPXJlcXVpcmUoXCIuLi92bm9kZS9zbG90LW5vZGVcIikuU2xvdE5vZGVcbiAgICAgICAgcmV0dXJuIG5ldyBTbG90Tm9kZShkb20sbXZ2bSxwYXJlbnQsZG9tLkdldEF0dHIoXCJuYW1lXCIpKVxuICAgIH1cbiAgICBsZXQgbnM9R2V0TlMoZG9tLk5vZGVOYW1lKVxuICAgIGlmKElzQ29tcG9uZW50UmVnaXN0ZXJlZChucy52YWx1ZSxucy5uYW1lc3BhY2V8fFwiZGVmYXVsdFwiKSl7XG4gICAgICAgIGxldCBvcHRpb249R2V0Q29tcG9uZW50KG5zLnZhbHVlLG5zLm5hbWVzcGFjZXx8XCJkZWZhdWx0XCIpXG4gICAgICAgIGxldCBzZWxmbXZ2bT1uZXcgTVZWTShvcHRpb24pXG4gICAgICAgIGxldCBDdXN0b21Ob2RlPXJlcXVpcmUoXCIuLi92bm9kZS9jdXN0b20tbm9kZVwiKS5DdXN0b21Ob2RlXG4gICAgICAgIGxldCBjdXN0PSBuZXcgQ3VzdG9tTm9kZShkb20sbXZ2bSxwYXJlbnQsc2VsZm12dm0pXG4gICAgICAgIHNlbGZtdnZtLkZlbmNlTm9kZT1jdXN0XG4gICAgICAgIGN1c3QuUGFyc2VUZW1wbGF0ZSgpXG4gICAgICAgIHJldHVybiBjdXN0XG4gICAgfVxuICAgICAgICBcbiAgICByZXR1cm4gbmV3IFZOb2RlKGRvbSxtdnZtLHBhcmVudClcbn0iLCJpbXBvcnQgeyBHZXRDb21wb25lbnQsIElzQ29tcG9uZW50UmVnaXN0ZXJlZCB9IGZyb20gXCIuLi9tYW5hZ2VyL2NvbXBvbmVudHMtbWFuYWdlclwiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IEdldE5TIH0gZnJvbSBcIi4uL3V0aWxcIjtcbmltcG9ydCB7IE5ld1ZOb2RlLCBWRG9tIH0gZnJvbSBcIi4uL3Zkb20vdmRvbVwiO1xuaW1wb3J0IHsgVGVtcGxhdGVOb2RlIH0gZnJvbSBcIi4vdGVtcGxhdGUtbm9kZVwiO1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi92bm9kZVwiO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tTm9kZSBleHRlbmRzIFZOb2Rle1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBWZG9tOlZEb20scHVibGljIG12dm06IE1WVk0scHVibGljIFBhcmVudDpWTm9kZSxwdWJsaWMgU3Vycm91bmRNdnZtOk1WVk0pIHtcbiAgICAgICAgc3VwZXIoVmRvbSxtdnZtLFBhcmVudClcbiAgICB9XG4gICAgQWRkSW5zKG5hbWU6c3RyaW5nLGV4cDpzdHJpbmcpe1xuICAgICAgICB0aGlzLmluc19leHBbbmFtZV09ZXhwXG4gICAgfVxuICAgIC8qKuiOt+WPlui3n3Nsb3TljLnphY3nmoTmqKHniYjlhoXlrrkgKi9cbiAgICBHZXRUZW1wbGF0ZShuYW1lOnN0cmluZyk6VGVtcGxhdGVOb2Rle1xuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuQ2hpbGRyZW4ubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBsZXQgdGVtcGxhdGU9dGhpcy5DaGlsZHJlbltpXSBhcyBUZW1wbGF0ZU5vZGVcbiAgICAgICAgICAgIGlmKHRlbXBsYXRlLnRlbXBsYXRlbmFtZT09bmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBSZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuRG9tPXRoaXMuU3Vycm91bmRNdnZtLlJlbmRlcigpXG4gICAgICAgIGlmKHRoaXMuRG9tICYmIHRoaXMuUGFyZW50ICYmIHRoaXMuUGFyZW50LkRvbSlcbiAgICAgICAgICAgIHRoaXMuUGFyZW50LkRvbS5hcHBlbmRDaGlsZCh0aGlzLkRvbSlcbiAgICB9XG4gICAgXG5cbiAgICAvKipvdmVycmlkZSB2bm9kZSAqL1xuICAgIHByb3RlY3RlZCBjaGlsZFNldCgpe1xuICAgICAgICAvL+WItumAoOS4remXtOiKgueCueeuoeeQhnRlbXBsYXRlXG4gICAgICAgIGxldCBkZWZhdWx0VGVtcGxhdGU9bmV3IFRlbXBsYXRlTm9kZSh0aGlzLlZkb20sdGhpcy5tdnZtP3RoaXMubXZ2bTp0aGlzLlN1cnJvdW5kTXZ2bSx0aGlzLFwiZGVmYXVsdFwiKVxuICAgICAgICBkZWZhdWx0VGVtcGxhdGUuUGFyZW50PXRoaXNcbiAgICAgICAgbGV0IHRlbXBsYXRlczp7W25hbWU6c3RyaW5nXTpWTm9kZX09e1wiZGVmYXVsdFwiOmRlZmF1bHRUZW1wbGF0ZX1cbiAgICAgICAgLy/op6PmnpDlrZDoioLngrlcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLlZkb20uQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZG5vZGU9dGhpcy5WZG9tLkNoaWxkcmVuW2ldXG5cbiAgICAgICAgICAgIGxldCBuYW1lPXRoaXMuVmRvbS5HZXRBdHRyKFwic2xvdFwiKVxuICAgICAgICAgICAgaWYobmFtZT09bnVsbCB8fCBuYW1lPT1cIlwiKXtcbiAgICAgICAgICAgICAgICBuYW1lPVwiZGVmYXVsdFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0ZW1wbGF0ZXNbbmFtZV09PW51bGwpe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlc1tuYW1lXT1uZXcgVGVtcGxhdGVOb2RlKHRoaXMuVmRvbSx0aGlzLm12dm0/dGhpcy5tdnZtOnRoaXMuU3Vycm91bmRNdnZtLHRoaXMsbmFtZSlcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXNbbmFtZV0uUGFyZW50PXRoaXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2Y2hpbGQ9TmV3Vk5vZGUoY2hpbGRub2RlLHRlbXBsYXRlc1tuYW1lXS5tdnZtLHRlbXBsYXRlc1tuYW1lXSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmNoaWxkLkF0dGFjaERvbSgpXG4gICAgICAgICAgICB0ZW1wbGF0ZXNbbmFtZV0uQ2hpbGRyZW4ucHVzaCh2Y2hpbGQpXG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBuYW1lIGluIHRlbXBsYXRlcyl7XG4gICAgICAgICAgICB0aGlzLkNoaWxkcmVuLnB1c2godGVtcGxhdGVzW25hbWVdKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIFBhcnNlVGVtcGxhdGUoKXtcbiAgICAgICAgbGV0IGRvbXRyZWU9dGhpcy5TdXJyb3VuZE12dm0uR2V0RG9tVHJlZSgpXG4gICAgICAgIGxldCBucz1HZXROUyhkb210cmVlLk5vZGVOYW1lKVxuXG4gICAgICAgIGlmKElzQ29tcG9uZW50UmVnaXN0ZXJlZChucy52YWx1ZSxucy5uYW1lc3BhY2V8fHRoaXMuU3Vycm91bmRNdnZtLk5hbWVzcGFjZSkpe1xuICAgICAgICAgICAgbGV0IG9wdGlvbj1HZXRDb21wb25lbnQobnMudmFsdWUsbnMubmFtZXNwYWNlfHx0aGlzLlN1cnJvdW5kTXZ2bS5OYW1lc3BhY2UpXG4gICAgICAgICAgICBsZXQgc2VsZm12dm09bmV3IE1WVk0ob3B0aW9uKVxuICAgICAgICAgICAgbGV0IGNoaWxkPSBuZXcgQ3VzdG9tTm9kZShkb210cmVlLHRoaXMuU3Vycm91bmRNdnZtLG51bGwsc2VsZm12dm0pXG4gICAgICAgICAgICB0aGlzLlN1cnJvdW5kTXZ2bS5UcmVlUm9vdD1jaGlsZFxuICAgICAgICAgICAgc2VsZm12dm0uRmVuY2VOb2RlPXRoaXNcbiAgICAgICAgICAgIGNoaWxkLlBhcnNlVGVtcGxhdGUoKSAgICAgICAgICAgIFxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuU3Vycm91bmRNdnZtLlRyZWVSb290PW5ldyBWTm9kZShkb210cmVlLHRoaXMuU3Vycm91bmRNdnZtLG51bGwpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5TdXJyb3VuZE12dm0uVHJlZVJvb3QuQXR0YWNoRG9tKClcbiAgICAgICAgXG4gICAgfVxuICAgIEdldEluVmFsdWUocHJvcDpzdHJpbmcpe1xuICAgICAgICBpZih0aGlzLmluc19wdXJlW3Byb3BdIT1udWxsKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zX3B1cmVbcHJvcF1cbiAgICAgICAgaWYodGhpcy5pbnNfZXhwW3Byb3BdIT1udWxsKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubXZ2bS5HZXRFeHBWYWx1ZSh0aGlzLmluc19leHBbcHJvcF0pXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIEdldEluKHByb3A6c3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zX3B1cmVbcHJvcF0gfHx0aGlzLmluc19leHBbcHJvcF1cbiAgICB9XG4gICAgR2V0T3V0KHByb3A6c3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0c1twcm9wXVxuICAgIH1cbiAgICBSZWNvbnN0cnVjdCgpIHtcbiAgICAgICAgdGhpcy5TdXJyb3VuZE12dm0uUmVjb25zdHJ1Y3QoKVxuICAgIH1cbiAgICBcbiAgICBSZWZyZXNoKCkge1xuICAgICAgICB0aGlzLlN1cnJvdW5kTXZ2bS5UcmVlUm9vdC5SZWZyZXNoKClcbiAgICB9XG4gICAgU3RhcnRXYXRjaCgpe1xuICAgICAgICB0aGlzLlN1cnJvdW5kTXZ2bS5TdGFydFdhdGNoKClcbiAgICB9XG4gICAgVXBkYXRlKCl7XG4gICAgICAgIHRoaXMuU3Vycm91bmRNdnZtLlRyZWVSb290LlVwZGF0ZSgpXG4gICAgfVxuICAgIHByb3RlY3RlZCB0ZXN0T3V0cHV0KG5hbWU6c3RyaW5nKTpib29sZWFue1xuICAgICAgICBpZih0aGlzLlN1cnJvdW5kTXZ2bS5PdXRzLmluZGV4T2YobmFtZSk9PS0xKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHByb3RlY3RlZCB0ZXN0SW5wdXQobmFtZTpzdHJpbmcpOmJvb2xlYW57XG4gICAgICAgIGlmKHRoaXMuU3Vycm91bmRNdnZtLklucy5pbmRleE9mKG5hbWUpPT0tMSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxufSIsImltcG9ydCB7IEZvckV4cCB9IGZyb20gXCIuLi9tb2RlbHNcIjtcbmltcG9ydCB7IE1WVk0gfSBmcm9tICcuLi9tdnZtL212dm0nO1xuaW1wb3J0IHsgVkRvbSwgTmV3Vk5vZGVOb0ZvciB9IGZyb20gJy4uL3Zkb20vdmRvbSc7XG5pbXBvcnQgeyBDdXN0b21Ob2RlIH0gZnJvbSAnLi9jdXN0b20tbm9kZSc7XG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gXCIuL3Zub2RlXCI7XG5pbXBvcnQgeyBWTm9kZVN0YXR1cyB9IGZyb20gXCIuLi9jb25zdFwiO1xuXG5leHBvcnQgY2xhc3MgRm9yTm9kZSBleHRlbmRzIFZOb2Rle1xuICAgIHByaXZhdGUgZHluYW1pY1ZOb2RlczpDdXN0b21Ob2RlW10gPSBbXVxuICAgIHB1YmxpYyBGb3JFeHA6Rm9yRXhwXG4gICAgY29uc3RydWN0b3IocHVibGljIFZkb206VkRvbSxwdWJsaWMgbXZ2bTogTVZWTSxwdWJsaWMgUGFyZW50OlZOb2RlLHByaXZhdGUgb3JpZ2luRm9yRXhwOnN0cmluZykge1xuICAgICAgICBzdXBlcihWZG9tLG12dm0sUGFyZW50KVxuICAgICAgICB0aGlzLklzVGVtcGxhdGU9dHJ1ZSAgICAgICBcbiAgICAgICAgbGV0IGZvclNwbGl0PXRoaXMub3JpZ2luRm9yRXhwLnRyaW0oKS5zcGxpdCgvXFxzKy8pXG4gICAgICAgIHRoaXMuRm9yRXhwPW5ldyBGb3JFeHAoZm9yU3BsaXRbMF0sZm9yU3BsaXRbMl0pIFxuICAgIH1cbiAgICBwcml2YXRlIG5ld0NvcHlOb2RlKG46bnVtYmVyKXtcbiAgICAgICAgbGV0IGl0ZW1leHA9dGhpcy5Gb3JFeHAuaXRlbUV4cFxuICAgICAgICBsZXQgbXZ2bT1uZXcgTVZWTSh7cHJvcHM6W2l0ZW1leHBdfSlcbiAgICAgICAgbXZ2bS5TZXRIaXJlbnRlZCh0cnVlKVxuXG4gICAgICAgIGxldCBmZW5jZW5vZGU9bmV3IEN1c3RvbU5vZGUodGhpcy5WZG9tLHRoaXMubXZ2bSxudWxsLG12dm0pXG4gICAgICAgIG12dm0uRmVuY2VOb2RlPWZlbmNlbm9kZSAgICAgICAgXG4gICAgICAgIGZlbmNlbm9kZS5Jc0NvcHk9dHJ1ZVxuICAgICAgICBmZW5jZW5vZGUuQWRkSW5zKGl0ZW1leHAsdGhpcy5Gb3JFeHAuYXJyYXlFeHArXCJbXCIrbitcIl1cIilcbiAgICAgICAgcmV0dXJuIGZlbmNlbm9kZVxuICAgIH1cbiAgICBwcml2YXRlIHJlSW1wbGVtZW50Rm9yRXhwKG5ld2NvdW50Om51bWJlcil7XG4gICAgICAgIGlmKG5ld2NvdW50PnRoaXMuZHluYW1pY1ZOb2Rlcy5sZW5ndGgpe1xuICAgICAgICAgICAgbGV0IGN1c3Rub2RlczpDdXN0b21Ob2RlW109W11cbiAgICAgICAgICAgIGxldCBvbGRjb3VudD10aGlzLmR5bmFtaWNWTm9kZXMubGVuZ3RoXG4gICAgICAgICAgICBmb3IobGV0IGk9dGhpcy5keW5hbWljVk5vZGVzLmxlbmd0aDtpPG5ld2NvdW50O2krKyl7ICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBjdXN0bm9kZT10aGlzLm5ld0NvcHlOb2RlKGkpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IHZub2RlPU5ld1ZOb2RlTm9Gb3IodGhpcy5WZG9tLGN1c3Rub2RlLlN1cnJvdW5kTXZ2bSxudWxsKVxuICAgICAgICAgICAgICAgIHZub2RlLkF0dGFjaERvbSgpXG4gICAgICAgICAgICAgICAgY3VzdG5vZGUuU3Vycm91bmRNdnZtLlRyZWVSb290PXZub2RlXG4gICAgICAgICAgICAgICAgY3VzdG5vZGVzLnB1c2goY3VzdG5vZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXN0bm9kZXMuZm9yRWFjaChjdXN0bm9kZT0+e1xuICAgICAgICAgICAgICAgIHRoaXMuZHluYW1pY1ZOb2Rlcy5wdXNoKGN1c3Rub2RlKSAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY3VzdG5vZGUuUmVjb25zdHJ1Y3QoKVxuICAgICAgICAgICAgICAgIGN1c3Rub2RlLlJlbmRlcigpXG4gICAgICAgICAgICAgICAgY3VzdG5vZGUuU3RhcnRXYXRjaCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5QYXJlbnQuQWRkQ2hpbGRyZW4odGhpcyxjdXN0bm9kZXMsb2xkY291bnQpXG4gICAgICAgICAgICB0aGlzLlBhcmVudC5SZWZyZXNoKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmKG5ld2NvdW50PHRoaXMuZHluYW1pY1ZOb2Rlcy5sZW5ndGgpe1xuICAgICAgICAgICAgbGV0IG1vdmVkPXRoaXMuZHluYW1pY1ZOb2Rlcy5zcGxpY2UobmV3Y291bnQpXG4gICAgICAgICAgICBtb3ZlZC5mb3JFYWNoKHZub2RlPT52bm9kZS5TZXRTdGF0dXMoVk5vZGVTdGF0dXMuREVQUkVDQVRFRCkpXG4gICAgICAgICAgICB0aGlzLlBhcmVudC5SZW1vdmVDaGlsZHJlbihtb3ZlZClcbiAgICAgICAgICAgIHRoaXMuUGFyZW50LlJlZnJlc2goKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIFJlY29uc3RydWN0KCl7XG4gICAgICAgIGxldCBpdGVtcz10aGlzLm12dm0uR2V0RXhwVmFsdWUodGhpcy5Gb3JFeHAuYXJyYXlFeHApXG4gICAgICAgIHRoaXMuZHluYW1pY1ZOb2Rlcz1bXVxuICAgICAgICBpZih0b1N0cmluZy5jYWxsKGl0ZW1zKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgIGxldCBjb3B5bm9kZXM6Q3VzdG9tTm9kZVtdPVtdXG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPGl0ZW1zLmxlbmd0aDtpKyspeyAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgY29weW5vZGU9dGhpcy5uZXdDb3B5Tm9kZShpKVxuXG4gICAgICAgICAgICAgICAgbGV0IHZub2RlPU5ld1ZOb2RlTm9Gb3IodGhpcy5WZG9tLGNvcHlub2RlLlN1cnJvdW5kTXZ2bSxudWxsKVxuICAgICAgICAgICAgICAgIHZub2RlLkF0dGFjaERvbSgpXG4gICAgICAgICAgICAgICAgY29weW5vZGUuU3Vycm91bmRNdnZtLlRyZWVSb290PXZub2RlXG4gICAgICAgICAgICAgICAgY29weW5vZGVzLnB1c2goY29weW5vZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3B5bm9kZXMuZm9yRWFjaChjb3B5bm9kZT0+e1xuICAgICAgICAgICAgICAgIHRoaXMuZHluYW1pY1ZOb2Rlcy5wdXNoKGNvcHlub2RlKSAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29weW5vZGUuUmVjb25zdHJ1Y3QoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuUGFyZW50LkFkZENoaWxkcmVuKHRoaXMsY29weW5vZGVzLDApXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuICAgIFN0YXJ0V2F0Y2goKXtcbiAgICAgICAgdGhpcy5tdnZtLiR3YXRjaEV4cCh0aGlzLHRoaXMuRm9yRXhwLmFycmF5RXhwK1wiLmxlbmd0aFwiLHRoaXMucmVJbXBsZW1lbnRGb3JFeHAuYmluZCh0aGlzKSlcbiAgICAgICAgdGhpcy5keW5hbWljVk5vZGVzLmZvckVhY2gobm9kZT0+bm9kZS5TdGFydFdhdGNoKCkpXG4gICAgfVxuICAgIFVwZGF0ZSgpe1xuICAgICAgICBsZXQgaXRlbXM9dGhpcy5tdnZtLkdldEV4cFZhbHVlKHRoaXMuRm9yRXhwLmFycmF5RXhwKVxuICAgICAgICBpZih0b1N0cmluZy5jYWxsKGl0ZW1zKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgIHRoaXMucmVJbXBsZW1lbnRGb3JFeHAoaXRlbXMubGVuZ3RoKVxuICAgICAgICB9XG4gICAgfVxuICAgIEF0dGFjaERvbSgpIHt9XG4gICAgUmVuZGVyKCl7XG4gICAgICAgIHRoaXMuZHluYW1pY1ZOb2Rlcy5mb3JFYWNoKG5vZGU9PntcbiAgICAgICAgICAgIG5vZGUuUmVuZGVyKClcbiAgICAgICAgICAgIGlmKG5vZGUuRG9tIT1udWxsKVxuICAgICAgICAgICAgICAgIHRoaXMuUGFyZW50LkRvbS5hcHBlbmRDaGlsZChub2RlLkRvbSlcbiAgICAgICAgfSlcbiAgICB9XG59IiwiaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4vdm5vZGVcIjtcbmltcG9ydCB7IFZEb20sIE5ld1ZOb2RlTm9Gb3JOb0lmIH0gZnJvbSBcIi4uL3Zkb20vdmRvbVwiO1xuaW1wb3J0IHsgVk5vZGVTdGF0dXMgfSBmcm9tIFwiLi4vY29uc3RcIjtcblxuZXhwb3J0IGNsYXNzIElmTm9kZSBleHRlbmRzIFZOb2RlIHtcbiAgICBwcml2YXRlIGR5bmFtaWNWTm9kZTogVk5vZGVcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgVmRvbTpWRG9tLHB1YmxpYyBtdnZtOiBNVlZNLCBwdWJsaWMgUGFyZW50OiBWTm9kZSwgcHJpdmF0ZSBpZkV4cDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKFZkb20sbXZ2bSwgUGFyZW50KVxuICAgICAgICB0aGlzLklzVGVtcGxhdGU9dHJ1ZVxuICAgIH1cbiAgICBcbiAgICBBdHRhY2hEb20oKSB7fVxuICAgIFJlbmRlcigpe1xuICAgICAgICBpZih0aGlzLmR5bmFtaWNWTm9kZSE9bnVsbCl7XG4gICAgICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZS5SZW5kZXIoKVxuICAgICAgICAgICAgaWYodGhpcy5QYXJlbnQhPW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMuUGFyZW50LkRvbS5hcHBlbmRDaGlsZCh0aGlzLmR5bmFtaWNWTm9kZS5Eb20pXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLkRvbT10aGlzLmR5bmFtaWNWTm9kZS5Eb21cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBVcGRhdGUoKXtcbiAgICAgICAgbGV0IGF0dGFjaGVkID0gdGhpcy5tdnZtLkdldEV4cFZhbHVlKHRoaXMuaWZFeHApXG4gICAgICAgIHRoaXMucmVJbXBsZXRlbWVudChhdHRhY2hlZClcbiAgICB9XG4gICAgU3RhcnRXYXRjaCgpe1xuICAgICAgICB0aGlzLm12dm0uJHdhdGNoRXhwKHRoaXMsdGhpcy5pZkV4cCwgbmV3dmFsdWU9PnRoaXMucmVJbXBsZXRlbWVudChuZXd2YWx1ZSkpXG4gICAgICAgIGlmKHRoaXMuZHluYW1pY1ZOb2RlIT1udWxsKVxuICAgICAgICAgICAgdGhpcy5keW5hbWljVk5vZGUuU3RhcnRXYXRjaCgpXG4gICAgfVxuICAgIHByaXZhdGUgcmVJbXBsZXRlbWVudChuZXd2YWx1ZTpib29sZWFuKXtcbiAgICAgICAgaWYgKG5ld3ZhbHVlKSB7XG4gICAgICAgICAgICBpZih0aGlzLmR5bmFtaWNWTm9kZT09bnVsbCl7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnN0YW5jZSgpXG4gICAgICAgICAgICAgICAgdGhpcy5keW5hbWljVk5vZGUuUmVuZGVyKClcbiAgICAgICAgICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZS5TdGFydFdhdGNoKClcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuZHluYW1pY1ZOb2RlLlVwZGF0ZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLlBhcmVudCE9bnVsbCl7XG4gICAgICAgICAgICAgICAgdGhpcy5QYXJlbnQuQWRkQ2hpbGRyZW4odGhpcywgW3RoaXMuZHluYW1pY1ZOb2RlXSwwKVxuICAgICAgICAgICAgICAgIHRoaXMuUGFyZW50LlJlZnJlc2goKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLm12dm0uRmVuY2VOb2RlLkRvbT10aGlzLmR5bmFtaWNWTm9kZS5Eb21cbiAgICAgICAgICAgICAgICB0aGlzLm12dm0uRmVuY2VOb2RlLlBhcmVudC5SZWZyZXNoKCkgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5keW5hbWljVk5vZGUuU2V0U3RhdHVzKFZOb2RlU3RhdHVzLkFDVElWRSlcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5keW5hbWljVk5vZGUhPW51bGwpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuUGFyZW50IT1udWxsKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXJlbnQuUmVtb3ZlQ2hpbGRyZW4oW3RoaXMuZHluYW1pY1ZOb2RlXSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXJlbnQuUmVmcmVzaCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm12dm0uRmVuY2VOb2RlLkRvbT1udWxsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXZ2bS5GZW5jZU5vZGUuUGFyZW50LlJlZnJlc2goKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZS5TZXRTdGF0dXMoVk5vZGVTdGF0dXMuSU5BQ1RJVkUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgUmVjb25zdHJ1Y3QoKSB7XG4gICAgICAgIGxldCBhdHRhY2hlZCA9IHRoaXMubXZ2bS5HZXRFeHBWYWx1ZSh0aGlzLmlmRXhwKVxuICAgICAgICBpZiAoYXR0YWNoZWQpe1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZSgpXG4gICAgICAgICAgICBpZih0aGlzLlBhcmVudCE9bnVsbClcbiAgICAgICAgICAgICAgICB0aGlzLlBhcmVudC5BZGRDaGlsZHJlbih0aGlzLCBbdGhpcy5keW5hbWljVk5vZGVdLDApXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBpbnN0YW5jZSgpe1xuICAgICAgICB0aGlzLmR5bmFtaWNWTm9kZT1OZXdWTm9kZU5vRm9yTm9JZih0aGlzLlZkb20sdGhpcy5tdnZtLG51bGwpXG4gICAgICAgIHRoaXMuZHluYW1pY1ZOb2RlLklzQ29weT10cnVlXG4gICAgICAgIHRoaXMuZHluYW1pY1ZOb2RlLkF0dGFjaERvbSgpXG4gICAgICAgIHRoaXMuZHluYW1pY1ZOb2RlLlJlY29uc3RydWN0KClcbiAgICB9XG59IiwiaW1wb3J0IHsgVk5vZGUgfSBmcm9tIFwiLi92bm9kZVwiO1xuaW1wb3J0IHsgTVZWTSB9IGZyb20gXCIuLi9tdnZtL212dm1cIjtcbmltcG9ydCB7IFZEb20gfSBmcm9tIFwiLi4vdmRvbS92ZG9tXCI7XG5cbmV4cG9ydCBjbGFzcyBTbG90Tm9kZSBleHRlbmRzIFZOb2Rle1xuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCB2ZG9tOlZEb20scHVibGljIG12dm06IE1WVk0sIHB1YmxpYyBQYXJlbnQ6IFZOb2RlLCBwcml2YXRlIG5hbWU6IHN0cmluZykge1xuICAgICAgICBzdXBlcih2ZG9tLG12dm0sUGFyZW50KVxuICAgICAgICBpZih0aGlzLm5hbWU9PW51bGwgfHwgdGhpcy5uYW1lPT1cIlwiKVxuICAgICAgICAgICAgdGhpcy5uYW1lPVwiZGVmYXVsdFwiXG4gICAgfVxuICAgIFJlbmRlcigpOiB2b2lkIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlPXRoaXMubXZ2bS5GZW5jZU5vZGUuR2V0VGVtcGxhdGUodGhpcy5uYW1lKVxuICAgICAgICBpZih0ZW1wbGF0ZSE9bnVsbCl7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5SZW5kZXIoKVxuICAgICAgICAgICAgdGhpcy5Eb20gPSB0ZW1wbGF0ZS5Eb21cbiAgICAgICAgICAgIHdoaWxlKHRoaXMuRG9tLmZpcnN0Q2hpbGQhPW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMuUGFyZW50LkRvbS5hcHBlbmRDaGlsZCh0aGlzLkRvbS5maXJzdENoaWxkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIFN0YXJ0V2F0Y2goKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlPXRoaXMubXZ2bS5GZW5jZU5vZGUuR2V0VGVtcGxhdGUodGhpcy5uYW1lKVxuICAgICAgICBpZih0ZW1wbGF0ZSE9bnVsbCl7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5TdGFydFdhdGNoKClcbiAgICAgICAgfVxuICAgIH1cbiAgICBVcGRhdGUoKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlPXRoaXMubXZ2bS5GZW5jZU5vZGUuR2V0VGVtcGxhdGUodGhpcy5uYW1lKVxuICAgICAgICBpZih0ZW1wbGF0ZSE9bnVsbCl7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5VcGRhdGUoKVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IFZOb2RlIH0gZnJvbSBcIi4vdm5vZGVcIjtcbmltcG9ydCB7IE1WVk0gfSBmcm9tIFwiLi4vbXZ2bS9tdnZtXCI7XG5pbXBvcnQgeyBWRG9tIH0gZnJvbSBcIi4uL3Zkb20vdmRvbVwiO1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVOb2RlIGV4dGVuZHMgVk5vZGV7XG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHZkb206VkRvbSxwdWJsaWMgbXZ2bTogTVZWTSxwdWJsaWMgUGFyZW50OlZOb2RlLHB1YmxpYyB0ZW1wbGF0ZW5hbWU6c3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHZkb20sbXZ2bSxQYXJlbnQpXG4gICAgfVxuICAgIFxuICAgIFJlbmRlcigpIDp2b2lke1xuICAgICAgICB0aGlzLkRvbT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICAgIHRoaXMuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZD0+e1xuICAgICAgICAgICAgY2hpbGQuUmVuZGVyKClcbiAgICAgICAgfSlcbiAgICB9XG4gICAgU3RhcnRXYXRjaCgpe1xuICAgICAgICB0aGlzLkNoaWxkcmVuLmZvckVhY2goY2hpbGQ9PntcbiAgICAgICAgICAgIGNoaWxkLlN0YXJ0V2F0Y2goKVxuICAgICAgICB9KVxuICAgIH1cbiAgICBVcGRhdGUoKXtcbiAgICAgICAgbGV0IGNoaWxkcmVuOiBWTm9kZVtdID0gW11cbiAgICAgICAgdGhpcy5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpXG4gICAgICAgIH0pXG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgY2hpbGQuVXBkYXRlKClcbiAgICAgICAgfSlcbiAgICB9XG59IiwiaW1wb3J0IHsgUkVHX0lOLCBSRUdfT1VULCBSRUdfU1RSLCBSRUdfQVRUUiwgUkVHX1RFU1RfT1VUUFVULCBSRUdfVEVTVF9JTlBVVCwgUkVHX01VTFRJLCBWTm9kZVN0YXR1cyB9IGZyb20gJy4vLi4vY29uc3QnO1xuaW1wb3J0IHsgUkVHX1NJTkdMRSB9IGZyb20gXCIuLi9jb25zdFwiO1xuaW1wb3J0IHsgRGlyZWN0aXZlU2V0LCBEaXJlY3RpdmVXYXRjaCB9IGZyb20gXCIuLi9kaXJlY3RpdmUvZGlyLWhhbmRsZXJcIjtcbmltcG9ydCB7IE1WVk0gfSBmcm9tICcuLi9tdnZtL212dm0nO1xuaW1wb3J0IHsgTmV3Vk5vZGUsIFZEb20gfSBmcm9tICcuLi92ZG9tL3Zkb20nO1xuaW1wb3J0IHsgTG9nRXJyb3IgfSBmcm9tICcuLi91dGlsJztcbmV4cG9ydCBjbGFzcyBWTm9kZSB7XG4gICAgTm9kZVZhbHVlOiBzdHJpbmdcbiAgICBOb2RlTmFtZTogc3RyaW5nXG4gICAgTm9kZVR5cGU6IG51bWJlclxuICAgIC8qKuaZrumAmuWxnuaApyAqL1xuICAgIEF0dHJzOiB7IG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyB9W10gPSBbXVxuICAgIC8qKuaMh+S7pOWxnuaApyAqL1xuICAgIENoaWxkcmVuOiBWTm9kZVtdID0gW11cbiAgICBEb206IE5vZGVcbiAgICBJc1RlbXBsYXRlID0gZmFsc2VcbiAgICBJc0NvcHk9ZmFsc2VcbiAgICAvL+i+k+WFpeS4jui+k+WHuuWAvFxuICAgIHByb3RlY3RlZCBpbnNfcHVyZTp7W25hbWU6c3RyaW5nXTphbnl9PXt9XG4gICAgcHJvdGVjdGVkIGluc19leHA6e1tuYW1lOnN0cmluZ106c3RyaW5nfT17fVxuICAgIHByb3RlY3RlZCBvdXRzOntbbmFtZTpzdHJpbmddOnN0cmluZ309e31cbiAgICBwcml2YXRlIHN0YXR1czpWTm9kZVN0YXR1cz1WTm9kZVN0YXR1cy5BQ1RJVkVcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBWZG9tOlZEb20scHVibGljIG12dm06IE1WVk0scHVibGljIFBhcmVudDpWTm9kZSkge1xuICAgIH1cbiAgICBcbiAgICBBZGRQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKClcbiAgICAgICAgaWYoUkVHX0lOLnRlc3QobmFtZSkpe1xuICAgICAgICAgICAgbGV0IGF0dHI9UmVnRXhwLiQxXG4gICAgICAgICAgICBpZihhdHRyPT1cImZvclwiIHx8IGF0dHI9PVwiaWZcIilcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIGlmKCF0aGlzLnRlc3RJbnB1dChhdHRyKSl7XG4gICAgICAgICAgICAgICAgTG9nRXJyb3IoXCJpbnB1dCBcIithdHRyK1wiIG5vdCBleGlzdCBvbiBcIit0aGlzLk5vZGVOYW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoUkVHX1NUUi50ZXN0KHZhbHVlKSlcbiAgICAgICAgICAgICAgICB0aGlzLmluc19wdXJlW2F0dHJdPVJlZ0V4cC4kMlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuaW5zX2V4cFthdHRyXT12YWx1ZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYoUkVHX09VVC50ZXN0KG5hbWUpKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLnRlc3RPdXRwdXQoUmVnRXhwLiQxKSl7XG4gICAgICAgICAgICAgICAgTG9nRXJyb3IoXCJvdXRwdXQgXCIrUmVnRXhwLiQxK1wiIG5vdCBleGlzdCBvbiBcIit0aGlzLk5vZGVOYW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vdXRzW1JlZ0V4cC4kMV09dmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmKFJFR19BVFRSLnRlc3QobmFtZSkpe1xuICAgICAgICAgICAgdGhpcy5BdHRycy5wdXNoKHtuYW1lOm5hbWUsdmFsdWU6dmFsdWV9KVxuICAgICAgICB9XG4gICAgfVxuICAgIEdldE91dHB1dCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5vdXRzXG4gICAgfVxuICAgIEdldElucHV0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmluc19leHBcbiAgICB9XG4gICAgcHJvdGVjdGVkIHRlc3RPdXRwdXQobmFtZTpzdHJpbmcpOmJvb2xlYW57XG4gICAgICAgIHJldHVybiBSRUdfVEVTVF9PVVRQVVQudGVzdChuYW1lKVxuICAgIH1cbiAgICBwcm90ZWN0ZWQgdGVzdElucHV0KG5hbWU6c3RyaW5nKTpib29sZWFue1xuICAgICAgICByZXR1cm4gUkVHX1RFU1RfSU5QVVQudGVzdChuYW1lKVxuICAgIH1cbiAgICBcbiAgICAvKirnlJ/miJDomZrmi5/oioLngrnku6PooajnmoRkb23lubbmioroh6rlt7HliqDlhaXniLbkurJkb23kuK0gKi9cbiAgICBSZW5kZXIoKSA6dm9pZHtcbiAgICAgICAgaWYgKHRoaXMuTm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgICAgbGV0IGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5Ob2RlTmFtZSlcbiAgICAgICAgICAgIHRoaXMuQXR0cnMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICAgICAgICBkb20uc2V0QXR0cmlidXRlKHByb3AubmFtZSwgcHJvcC52YWx1ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLkRvbSA9IGRvbSBcbiAgICAgICAgICAgIHRoaXMuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIWNoaWxkLklzQ29weSlcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuUmVuZGVyKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvL3RvZG8g6K6+572u5bGe5oCnXG4gICAgICAgICAgICBEaXJlY3RpdmVTZXQodGhpcylcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5Ob2RlVHlwZSA9PSAzKSB7XG4gICAgICAgICAgICB0aGlzLkRvbSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMuTm9kZVZhbHVlKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoUkVHX1NJTkdMRS50ZXN0KHRoaXMuTm9kZVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuRG9tLnRleHRDb250ZW50PXRoaXMubXZ2bS5HZXRFeHBWYWx1ZShSZWdFeHAuJDEpXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihSRUdfTVVMVEkudGVzdCh0aGlzLk5vZGVWYWx1ZSkpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzPXRoaXMubXVsdGlCaW5kUGFyc2UodGhpcy5Ob2RlVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLnRleHRDb250ZW50PXRoaXMubXZ2bS5HZXRFeHBWYWx1ZShyZXMpICAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Eb20udGV4dENvbnRlbnQ9dGhpcy5Ob2RlVmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5QYXJlbnQgJiYgdGhpcy5QYXJlbnQuRG9tKVxuICAgICAgICAgICAgdGhpcy5QYXJlbnQuRG9tLmFwcGVuZENoaWxkKHRoaXMuRG9tKVxuICAgIH1cbiAgICBwcml2YXRlIG11bHRpQmluZFBhcnNlKG5vZGV2YWx1ZTpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgbGV0IHJlcz1cIlwiXG4gICAgICAgIGxldCB2YWx1ZXM9bm9kZXZhbHVlLm1hdGNoKC9cXHtcXHsoLio/KVxcfVxcfS9nKVxuICAgICAgICBsZXQgc3RhcnQ9MFxuICAgICAgICBsZXQgZW5kPTBcbiAgICAgICAgZm9yKGxldCBpPTA7aTx2YWx1ZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBlbmQ9bm9kZXZhbHVlLmluZGV4T2YodmFsdWVzW2ldKVxuICAgICAgICAgICAgcmVzKz1cIlxcXCJcIitub2RldmFsdWUuc3Vic3RyaW5nKHN0YXJ0LGVuZCkrXCJcXFwiKyhcIit2YWx1ZXNbaV0uc3Vic3RyaW5nKDIsdmFsdWVzW2ldLmxlbmd0aC0yKStcIilcIlxuICAgICAgICAgICAgc3RhcnQ9ZW5kK3ZhbHVlc1tpXS5sZW5ndGhcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuICAgIFN0YXJ0V2F0Y2goKXtcbiAgICAgICAgaWYgKHRoaXMuTm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgICAgICBpZighY2hpbGQuSXNDb3B5KVxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5TdGFydFdhdGNoKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBEaXJlY3RpdmVXYXRjaCh0aGlzKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuTm9kZVR5cGUgPT0gMykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ4eFwiKVxuICAgICAgICAgICAgaWYgKFJFR19TSU5HTEUudGVzdCh0aGlzLk5vZGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm12dm0uJHdhdGNoRXhwKHRoaXMsUmVnRXhwLiQxLChuZXd2YWx1ZSwgb2xkdmFsdWUpPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLnRleHRDb250ZW50ID0gbmV3dmFsdWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYoUkVHX01VTFRJLnRlc3QodGhpcy5Ob2RlVmFsdWUpKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlcz10aGlzLm11bHRpQmluZFBhcnNlKHRoaXMuTm9kZVZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm12dm0uJHdhdGNoRXhwKHRoaXMscmVzLChuZXd2YWx1ZSwgb2xkdmFsdWUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkRvbS50ZXh0Q29udGVudCA9IG5ld3ZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFVwZGF0ZSgpe1xuICAgICAgICAvL3RvZG8g5pu05paw5bGe5oCnXG4gICAgICAgIGlmICh0aGlzLk5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbjogVk5vZGVbXSA9IFtdXG4gICAgICAgICAgICB0aGlzLkNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICAgICAgY2hpbGQuVXBkYXRlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvL3RvZG8g6K6+572u5bGe5oCnXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5Ob2RlVHlwZSA9PSAzKSB7XG4gICAgICAgICAgICBpZiAoUkVHX1NJTkdMRS50ZXN0KHRoaXMuTm9kZVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuRG9tLnRleHRDb250ZW50PXRoaXMubXZ2bS5HZXRFeHBWYWx1ZShSZWdFeHAuJDEpXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihSRUdfTVVMVEkudGVzdCh0aGlzLk5vZGVWYWx1ZSkpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzPXRoaXMubXVsdGlCaW5kUGFyc2UodGhpcy5Ob2RlVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLnRleHRDb250ZW50PXRoaXMubXZ2bS5HZXRFeHBWYWx1ZShyZXMpICAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Eb20udGV4dENvbnRlbnQ9dGhpcy5Ob2RlVmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgUmVmcmVzaCgpIHtcbiAgICAgICAgaWYgKHRoaXMuSXNUZW1wbGF0ZSl7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsZXQgYWxsbm9kZXMgPSB0aGlzLkRvbS5jaGlsZE5vZGVzXG4gICAgICAgIGxldCBhbGx2bm9kZXM6IFZOb2RlW10gPSBbXVxuICAgICAgICB0aGlzLkNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgaWYgKCFjaGlsZC5Jc1RlbXBsYXRlICYmIGNoaWxkLkRvbSE9bnVsbCkge1xuICAgICAgICAgICAgICAgIGFsbHZub2RlcyA9IGFsbHZub2Rlcy5jb25jYXQoY2hpbGQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IHJ1bGVyID0ge1xuICAgICAgICAgICAgb2xkX2o6IC0xLFxuICAgICAgICAgICAgaTogMCxcbiAgICAgICAgICAgIGo6IDBcbiAgICAgICAgfVxuICAgICAgICBsZXQgb3BlcnM6IGFueVtdID0gW11cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGlmIChydWxlci5pID4gYWxsbm9kZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVsZXIuaiA+IGFsbHZub2Rlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgb3BlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGFsbG5vZGVzW3J1bGVyLmldXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBydWxlci5pKytcbiAgICAgICAgICAgICAgICBydWxlci5qID0gcnVsZXIub2xkX2ogKyAxXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbGxub2Rlc1tydWxlci5pXSAhPSBhbGx2bm9kZXNbcnVsZXIual0uRG9tKSB7XG4gICAgICAgICAgICAgICAgcnVsZXIuaisrXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbGxub2Rlc1tydWxlci5pXSA9PSBhbGx2bm9kZXNbcnVsZXIual0uRG9tKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJ1bGVyLmkgPCBydWxlci5qKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHJ1bGVyLm9sZF9qICsgMVxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5kZXggPCBydWxlci5qKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZU5vZGU6IGFsbG5vZGVzW3J1bGVyLmldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGFsbHZub2Rlc1tpbmRleF0uRG9tXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgrK1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJ1bGVyLm9sZF9qID0gcnVsZXIualxuICAgICAgICAgICAgICAgIHJ1bGVyLmkrK1xuICAgICAgICAgICAgICAgIHJ1bGVyLmorK1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bGVyLmogPCBhbGx2bm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBvcGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIGJlZm9yZU5vZGU6IG51bGwsXG4gICAgICAgICAgICAgICAgbm9kZTogYWxsdm5vZGVzW3J1bGVyLmpdLkRvbVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJ1bGVyLmorK1xuICAgICAgICB9XG4gICAgICAgIG9wZXJzLmZvckVhY2gob3BlciA9PiB7XG4gICAgICAgICAgICBpZiAob3Blci50eXBlID09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgICAgICBpZihvcGVyLmJlZm9yZU5vZGUhPW51bGwpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLmluc2VydEJlZm9yZShvcGVyLm5vZGUsIG9wZXIuYmVmb3JlTm9kZSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRG9tLmFwcGVuZENoaWxkKG9wZXIubm9kZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcGVyLnR5cGUgPT0gXCJyZW1vdmVcIilcbiAgICAgICAgICAgICAgICAob3Blci5ub2RlIGFzIEhUTUxFbGVtZW50KS5yZW1vdmUoKVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICB9XG4gICAgQWRkQ2hpbGRyZW4oY2hpbGQ6IFZOb2RlLCBub2RlczogVk5vZGVbXSxvZmZzZXQ6bnVtYmVyKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5DaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuQ2hpbGRyZW5baV0gPT0gY2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNoaWxkcmVuLnNwbGljZShpICsgMStvZmZzZXQsIDAsIC4uLm5vZGVzKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgUmVtb3ZlQ2hpbGRyZW4obm9kZXM6Vk5vZGVbXSl7XG4gICAgICAgIG5vZGVzLmZvckVhY2gobm9kZT0+bm9kZS5vbnJlbW92ZSgpKVxuICAgICAgICB0aGlzLkNoaWxkcmVuPXRoaXMuQ2hpbGRyZW4uZmlsdGVyKGNoaWxkPT57XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMuaW5kZXhPZihjaGlsZCk9PS0xXG4gICAgICAgIH0pXG4gICAgfVxuICAgIHByb3RlY3RlZCBvbnJlbW92ZSgpe31cbiAgICAvKirmoLnmja7lvZPliY1cYlxibW9kZWzlgLzmuLLmn5PomZrmi59cYmRvbee7k+aehCAqL1xuICAgIFJlY29uc3RydWN0KCkge1xuICAgICAgICBsZXQgY2hpbGRyZW46IFZOb2RlW10gPSBbXVxuICAgICAgICB0aGlzLkNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZClcbiAgICAgICAgfSlcbiAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBjaGlsZC5SZWNvbnN0cnVjdCgpXG4gICAgICAgIH0pXG4gICAgfVxuICAgIFxuICAgIC8qKuino+aekOWfuuacrOS/oeaBryAqL1xuICAgIHByb3RlY3RlZCBiYXNpY1NldCgpe1xuICAgICAgICB0aGlzLk5vZGVWYWx1ZSA9IHRoaXMuVmRvbS5Ob2RlVmFsdWVcbiAgICAgICAgdGhpcy5Ob2RlTmFtZSA9IHRoaXMuVmRvbS5Ob2RlTmFtZVxuICAgICAgICB0aGlzLk5vZGVUeXBlID0gdGhpcy5WZG9tLk5vZGVUeXBlXG4gICAgICAgIC8v5L+d5a2Y5YWD57Sg5bGe5oCnXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5WZG9tLkF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLkFkZFByb3BlcnR5KHRoaXMuVmRvbS5BdHRyc1tpXS5OYW1lLHRoaXMuVmRvbS5BdHRyc1tpXS5WYWx1ZSlcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKirop6PmnpDoh6roioLngrnkv6Hmga8gKi9cbiAgICBwcm90ZWN0ZWQgY2hpbGRTZXQoKXtcbiAgICAgICAgICAgIC8v6Kej5p6Q5a2Q6IqC54K5XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuVmRvbS5DaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZGRvbT10aGlzLlZkb20uQ2hpbGRyZW5baV1cbiAgICAgICAgICAgICAgICBsZXQgdmNoaWxkPU5ld1ZOb2RlKGNoaWxkZG9tLHRoaXMubXZ2bSx0aGlzKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKHZjaGlsZCE9bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIHZjaGlsZC5BdHRhY2hEb20oKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLkNoaWxkcmVuLnB1c2godmNoaWxkKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICB9XG4gICAgQXR0YWNoRG9tKCkge1xuICAgICAgICB0aGlzLmJhc2ljU2V0KClcbiAgICAgICAgdGhpcy5jaGlsZFNldCgpXG4gICAgfVxuICAgIFNldFN0YXR1cyhzdGF0dXM6Vk5vZGVTdGF0dXMpe1xuICAgICAgICB0aGlzLnN0YXR1cz1zdGF0dXNcbiAgICAgICAgdGhpcy5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkPT5jaGlsZC5TZXRTdGF0dXMoc3RhdHVzKSlcbiAgICB9XG4gICAgR2V0U3RhdHVzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXR1c1xuICAgIH1cbn0iXX0=

var EvalSingle=function(context,exp){
    var res
    with(context){
        res=eval(exp)
    }
    return res
}
function EvalMulti(context,str){
    var res=""
    var values=str.match(/\{\{(.*?)\}\}/g)
    var start=0
    var end=0
    for(var i=0;i<values.length;i++){
        end=str.indexOf(values[i])
        with(context){
            res+=str.substring(start,end)+eval(values[i].substring(2,values[i].length-2))
        }
        start=end+values[i].length
    }
    return res
}