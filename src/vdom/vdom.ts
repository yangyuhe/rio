import { VNode } from "../vnode/vnode";
import { IsComponentRegistered, InitComponent } from "../manager/components-manager";
import { Mvvm } from "../mvvm/mvvm";
import { GetNS } from "../util";
import { PRE } from "../const";
import { VinallaNode } from "../vnode/vinalla-node";

declare let require:(module:string)=>any
export class VDom{
    NodeValue: string
    NodeName: string
    NodeType: number
    Attrs: { Name: string, Value: string }[] = []
    Children: VDom[] = []
    GetAttr(name:string){
        for(let i=0;i<this.Attrs.length;i++){
            if(this.Attrs[i].Name==name)
                return this.Attrs[i].Value
        }
        return null
    }
    AddAttr(attr:string,value:string=""){
        this.Attrs.push({Name:attr,Value:value})
    }
}
export function TraverseDom(dom:Node):VDom{
    if(dom.nodeType==3 && dom.nodeValue.trim()=="")
        return
    let root=new VDom()
    root.NodeValue=dom.nodeValue
    if(root.NodeValue!=null){
        root.NodeValue=root.NodeValue.trim().replace(/\s+/g," ")
    }
    root.NodeName=dom.nodeName.toLowerCase()
    root.NodeType=dom.nodeType
    if(dom.nodeType==1){
        let htmldom=dom as HTMLElement
        for(let i=0;i<htmldom.attributes.length;i++){
            root.Attrs.push({Name:htmldom.attributes[i].name,Value:htmldom.attributes[i].value})
        }
        for(let i=0;i<htmldom.childNodes.length;i++){
            let child=TraverseDom(htmldom.childNodes[i])
            child && root.Children.push(child)
        }
    }
    return root
}
export enum Priority{
    NORMAL,
    IF,
    FOR
}
export function NewVNode(dom:VDom,mvvm:Mvvm,parent:VNode,priority:Priority=Priority.FOR):VNode{
    if(dom.NodeName.toLowerCase()=="slot"){
        let SlotNode=require("../vnode/slot-node").SlotNode
        let vnode=new SlotNode(dom,mvvm,parent,dom.GetAttr("name"))
        return vnode
    }

    if(priority>=Priority.FOR && dom.GetAttr(PRE+"for")!=null){
        let ForNode=require("../vnode/for-node").ForNode
        let vnode= new ForNode(dom,mvvm,parent,dom.GetAttr(PRE+"for"))
        return vnode
    }
    if(priority>=Priority.IF && dom.GetAttr(PRE+"if")!=null){
        let IfNode=require("../vnode/if-node").IfNode
        let vnode= new IfNode(dom,mvvm,parent,dom.GetAttr(PRE+"if"))              
        return vnode
    }
    if(dom.NodeName=="r-template"){
        let TemplateNode=require("../vnode/template-node").TemplateNode
        let vnode= new TemplateNode(dom,mvvm,parent)
        return vnode
    }
    if(dom.NodeName=="router-view"){
        let RouterNode=require("../vnode/router-node").RouterNode
        let vnode= new RouterNode(dom,mvvm,parent)
        return vnode
    }
    let ns=GetNS(dom.NodeName)
    if(IsComponentRegistered(ns.value,ns.namespace||"default")){
        let construct=InitComponent(ns.value,ns.namespace||"default")
        let selfmvvm=new construct()

        let CustomNode=require("../vnode/custom-node").CustomNode
        let cust= new CustomNode(dom,mvvm,parent,selfmvvm)
        selfmvvm.$SetFenceNode(cust)

        selfmvvm.$initialize()
        selfmvvm.$AttachChildren()
        
        
        return cust
    }
        
    return new VinallaNode(dom,mvvm,parent)
}