import { VDom } from './../vdom/vdom';
import { MVVMComponentOption } from "../models";
import { MVVM } from "../mvvm/mvvm";
import { CustomNode } from "../vnode/custom-node";
import { TraverseDom } from "../vdom/vdom";
import { GetNS, HttpGet, LogError } from "../util";

let roots:{option:MVVMComponentOption,dom:Node}[]=[]
let namespaces:{[namespace:string]:{[component:string]:MVVMComponentOption}}={
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
        mountmvvm.FenceNode=custnode
        custnode.AttachDom()
        mountmvvm.Reconstruct()
        let content=mountmvvm.Render()
        mountmvvm.StartWatch()
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
export function RegisterComponent(option:MVVMComponentOption,namespace:string){
    option.$namespace=namespace.toLowerCase()
    
    if(namespaces[namespace]==null)
        namespaces[namespace]={}
    let components=namespaces[namespace]
    components[option.$name]=option
}
export function GetComponent(name:string,namespace:string):MVVMComponentOption{
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
function preTreatment(option:MVVMComponentOption){
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
            return "["+option.$id+"]"+str
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