import { VNode } from "./vnode";
import { Mvvm } from "../mvvm/mvvm";
import { CustomNode } from "./custom-node";
import { InitComponent } from "../manager/components-manager";
import { GetNS } from '../util';
import { VDom } from '../vdom/vdom';
import { NextRouter, MoveBack } from "../router/router-manager";

export class RouterNode extends VNode{
    private dynamicVNode: CustomNode

    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode) {
        super(Vdom,mvvm,Parent)
    }

    Render() :void{
        let router=NextRouter(this)
        if(router!=null){
            this.instance(router)
            this.dynamicVNode.Render()
            MoveBack()
            this.Parent.AddChildren(this, [this.dynamicVNode],0)
            this.Parent.Refresh()
        }
        
    }
    OnRouterChange(){
        let router=NextRouter(this)
        if(router!=null){
            this.Parent.RemoveChildren([this.dynamicVNode])
            this.instance(router)

            this.dynamicVNode.Render()
            MoveBack()
            this.Parent.AddChildren(this, [this.dynamicVNode],0)
            this.Parent.Refresh()
        }else{
            this.Parent.RemoveChildren([this.dynamicVNode])
            this.Parent.Refresh()
        }
    }
    
    private instance(componentStr:string){

        let ns=GetNS(componentStr)
        if(ns.namespace==null)
            ns.namespace="default"
        let construct=InitComponent(ns.value,ns.namespace)
        
        if(construct==null){
            throw new Error(`router can not find component name:${ns.value},namespace:${ns.namespace}`)
        }
        let mvvm=new construct()
        mvvm.$initialize()
        
        let custnode=new CustomNode(null,this.mvvm,null,mvvm)
        mvvm.$SetFenceNode(custnode)
        this.dynamicVNode=custnode
    }
}
