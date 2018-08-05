import { VNode } from "../vnode/vnode";
import { IsComponentRegistered, InitComponent } from "../manager/components-manager";
import { Mvvm } from "../mvvm/mvvm";
import { GetNS } from "../util";
import { PRE } from "../const";
import { VinallaNode } from "../vnode/vinalla-node";
import { CustDom } from "./parser";

declare let require:(module:string)=>any

export enum Priority{
    NORMAL,
    IF,
    FOR
}
export function NewVNode(dom:CustDom,mvvm:Mvvm,parent:VNode,priority:Priority=Priority.FOR):VNode{
    if(dom.Name.toLowerCase()=="slot"){
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
    if(dom.Name=="r-template"){
        let TemplateNode=require("../vnode/template-node").TemplateNode
        let vnode= new TemplateNode(dom,mvvm,parent)
        return vnode
    }
    if(dom.Name=="router-view"){
        let RouterNode=require("../vnode/router-node").RouterNode
        let vnode= new RouterNode(dom,mvvm,parent,dom.GetAttr("name"))
        return vnode
    }
    let ns=GetNS(dom.Name)
    if(IsComponentRegistered(ns.value,ns.namespace||mvvm.$namespace)){
        let construct=InitComponent(ns.value,ns.namespace||mvvm.$namespace)
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