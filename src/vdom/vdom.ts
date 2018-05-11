import { VNode } from "../vnode/vnode";
import { IsComponentRegistered, GetComponent } from "../manager/components-manager";
import { MVVM } from "../mvvm/mvvm";
import { GetNS } from "../util";
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
    AddAttr(attr:string){
        this.Attrs.push({Name:attr,Value:""})
    }
}
export function TraverseDom(dom:Node):VDom{
    if(dom.nodeType==3 && dom.nodeValue.trim()=="")
        return
    let root=new VDom()
    root.NodeValue=dom.nodeValue
    root.NodeName=dom.nodeName
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
export function NewVNode(dom:VDom,mvvm:MVVM,parent:VNode):VNode{
    if(dom.NodeName.toLowerCase()=="slot"){
        let SlotNode=require("../vnode/slot-node").SlotNode
        return new SlotNode(dom,mvvm,parent,dom.GetAttr("name"))
    }

    if(dom.GetAttr("[for]")!=null){
        let ForNode=require("../vnode/for-node").ForNode
        return new ForNode(dom,mvvm,parent,dom.GetAttr("[for]"))
    }
    if(dom.GetAttr("[if]")!=null){
        let IfNode=require("../vnode/if-node").IfNode
        return new IfNode(dom,mvvm,parent,dom.GetAttr("[if]"))              
    }
    let ns=GetNS(dom.NodeName)
    if(IsComponentRegistered(ns.value,ns.namespace||"default")){
        let option=GetComponent(ns.value,ns.namespace||"default")
        let selfmvvm=new MVVM(option)
        let CustomNode=require("../vnode/custom-node").CustomNode
        let cust= new CustomNode(dom,mvvm,parent,selfmvvm)
        selfmvvm.FenceNode=cust
        cust.ParseTemplate()
        return cust
    }
        
    return new VNode(dom,mvvm,parent)
}
export function NewVNodeNoFor(dom:VDom,mvvm:MVVM,parent:VNode):VNode{
    if(dom.NodeName.toLowerCase()=="slot"){
        let SlotNode=require("../vnode/slot-node").SlotNode
        return new SlotNode(dom,mvvm,parent,dom.GetAttr("name"))
    }

    if(dom.GetAttr("[if]")!=null){
        let IfNode=require("../vnode/if-node").IfNode
        return new IfNode(dom,mvvm,parent,dom.GetAttr("[if]"))              
    }
    let ns=GetNS(dom.NodeName)
    if(IsComponentRegistered(ns.value,ns.namespace||"default")){
        let option=GetComponent(ns.value,ns.namespace||"default")
        let surroundmvvm=new MVVM(option)
        let CustomNode=require("../vnode/custom-node").CustomNode
        let cust= new CustomNode(dom,mvvm,parent,surroundmvvm)
        surroundmvvm.FenceNode=cust
        cust.ParseTemplate()
        return cust
    }
        
    return new VNode(dom,mvvm,parent)
}
export function NewVNodeNoForNoIf(dom:VDom,mvvm:MVVM,parent:VNode):VNode{
    if(dom.NodeName.toLowerCase()=="slot"){
        let SlotNode=require("../vnode/slot-node").SlotNode
        return new SlotNode(dom,mvvm,parent,dom.GetAttr("name"))
    }
    let ns=GetNS(dom.NodeName)
    if(IsComponentRegistered(ns.value,ns.namespace||"default")){
        let option=GetComponent(ns.value,ns.namespace||"default")
        let selfmvvm=new MVVM(option)
        let CustomNode=require("../vnode/custom-node").CustomNode
        let cust= new CustomNode(dom,mvvm,parent,selfmvvm)
        selfmvvm.FenceNode=cust
        cust.ParseTemplate()
        return cust
    }
        
    return new VNode(dom,mvvm,parent)
}