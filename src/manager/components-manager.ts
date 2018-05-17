import { VDom } from './../vdom/vdom';
import { ComponentOption } from "../models";
import { MVVM } from "../mvvm/mvvm";
import { CustomNode } from "../vnode/custom-node";
import { TraverseDom } from "../vdom/vdom";
import { GetNS, HttpGet, LogError, IsStringEmpty } from "../util";

let roots:{option:ComponentOption,dom:Node}[]=[]
let namespaces:{[namespace:string]:{[component:string]:ComponentOption}}={
    "default":{
    }
}
export function Start(){
    firstRender(document.body)
    roots.forEach(root=>{
        let domtree=TraverseDom(root.dom)

        let mountmvvm=new MVVM(root.option)
        let custnode=new CustomNode(domtree,null,null,mountmvvm)
        custnode.ParseTemplate()
        mountmvvm.$FenceNode=custnode
        custnode.AttachDom()
        let content=mountmvvm.Render()
        root.dom.parentElement.replaceChild(content,root.dom)
    })
}
function firstRender(dom:HTMLElement){
    let ns=GetNS(dom.nodeName)
    if(IsComponentRegistered(ns.value,ns.namespace||"default")){
        let component=GetComponent(ns.value,ns.namespace||"default")
        roots.push({option:component,dom:dom})
    }else{
        for(let i=0;i<dom.children.length;i++){
            let child=dom.children[i] as HTMLElement
            firstRender(child)
        }
    }
}
export function RegisterComponent(option:ComponentOption){
    checkOption(option)
    option.data=option.data||{}
    option.events=option.events||[]
    option.methods=option.methods||{}
    option.props=option.props||[]
    option.$name=option.$name||""
    option.computed=option.computed||{}
    if(namespaces[option.$namespace]==null)
        namespaces[option.$namespace]={}
    let components=namespaces[option.$namespace]
    components[option.$name]=option
}

export function GetComponent(name:string,namespace:string):ComponentOption{
    name=name.toLowerCase()
    namespace=namespace.toLowerCase()
    let option=namespaces[namespace] && namespaces[namespace][name]
    if(option && option.$id==null)
        preTreatment(option)
    return option
}
export function IsComponentRegistered(name:string,namespace:string){
    name=name.toLowerCase()
    namespace=namespace.toLowerCase()
    if(namespaces[namespace] && namespaces[namespace][name])
        return true
    else
        return false
}
function preTreatment(option:ComponentOption){
    //唯一标识
    option.$id=option.$namespace+"_"+option.$name
    //模版
    if(option.templateUrl!=null){
        option.template=HttpGet(option.templateUrl)
        if(option.template==null){
            LogError("path "+option.templateUrl+" not found")
            return
        }
    }
    
    let dom=(new DOMParser()).parseFromString(option.template,"text/html").body.children[0]
    option.$domtree=TraverseDom(dom)
    //样式
    if(option.styleUrl!=null){
        option.style=HttpGet(option.styleUrl)
    }
    if(option.style!=null){
        let css=option.style.replace(/(?!\s)([^\{\}]+)(?=\{[^\{\}]*\})/g,function(str){
            return str+"["+option.$id+"]"
        })
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
        addAttr(option.$domtree,option.$id)
    }
}
function addAttr(dom:VDom,attr:string){
    dom.AddAttr(attr)
    if(dom.NodeType==1){
        dom.Children.forEach(child=>{
            addAttr(child,attr)
        })
    }
}
function checkOption(option:ComponentOption){
    if(IsStringEmpty(option.$name))
        throw new Error("component name should not be null")
    if(IsStringEmpty(option.template) && IsStringEmpty(option.templateUrl))
        throw new Error("component template should not be null")
    if(namespaces[option.$namespace] && namespaces[option.$namespace][option.$name])
        throw new Error("component "+option.$name +" has already exist")
}