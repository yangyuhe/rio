import { DomType, VNodeStatus } from './../const';
import { VNode } from "./vnode";
import { Mvvm } from "../mvvm/mvvm";
import { CustomNode } from "./custom-node";
import { InitComponent } from "../manager/components-manager";
import { GetNS } from '../util';
import { VDom } from '../vdom/vdom';
import { NextRouter, MoveBack } from "../router/router-manager";
import { DomStatus } from '../models';

export class RouterNode extends VNode{

    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode) {
        super(Vdom,mvvm,Parent)
    }

    Render() :DomStatus[]{
        let router=NextRouter(this)
        if(router!=null){
            let vnode=this.instance(router)
            this.Children=[vnode]
            this.DomSet=vnode.Render()
            MoveBack()
        }
        return this.DomSet
        
    }
    OnRouterChange(){
        let router=NextRouter(this);
        //释放旧的资源
        this.Children.forEach(child=>{
            child.SetStatus(VNodeStatus.DEPRECATED);
            child.OnDestroy();
        });
        
        if(router!=null){
            let vnode=this.instance(router)
            this.Children=[vnode]
            this.DomSet.forEach(dom=>dom.type=DomType.DELETE)
            this.DomSet= this.DomSet.concat(vnode.Render())
            this.Parent.Reflow();
            MoveBack()
        }else{

            this.Children=[]
            this.DomSet.forEach(dom=>{
                dom.type=DomType.DELETE
            })
        }
    }
    private instance(componentStr:string):VNode{

        let ns=GetNS(componentStr)
        if(ns.namespace==null)
            ns.namespace="default"
        let construct=InitComponent(ns.value,ns.namespace)
        
        if(construct==null){
            throw new Error(`router can not find component name:${ns.value},namespace:${ns.namespace}`)
        }
        let mvvm=new construct()
        let custnode=new CustomNode(null,this.mvvm,null,mvvm)
        mvvm.$SetFenceNode(custnode)

        mvvm.$initialize()
        mvvm.$AttachChildren()
        
        return custnode
    }
    Update(){

    }
    Reflow(){
    }
}
