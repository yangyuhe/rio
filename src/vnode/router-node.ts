import { PopPath, GetRouter } from './../router/router';
import { VNode } from "./vnode";
import { Mvvm } from "../mvvm/mvvm";
import { CustomNode } from "./custom-node";
import { InitComponent } from "../manager/components-manager";
import { GetNS } from '../util';
import { VDom } from '../vdom/vdom';

export class RouterNode extends VNode{
    private dynamicVNode: CustomNode
    private component:string

    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode) {
        super(Vdom,mvvm,Parent)
    }

    Render() :void{
        let router=GetRouter(this)
        if(router!=null){
            this.instance(router)
            this.dynamicVNode.Render()
            PopPath()
            this.Parent.AddChildren(this, [this.dynamicVNode],0)
            this.Parent.Refresh()
        }
        
    }
    OnRouterChange(){
        let router=GetRouter(this)
        if(router!=null){
            if(router.component!=this.component){
                this.Parent.RemoveChildren([this.dynamicVNode])
                this.instance(router)
    
                this.dynamicVNode.Render()
                PopPath()
                this.Parent.AddChildren(this, [this.dynamicVNode],0)
                this.Parent.Refresh()
                return
            }else{
                if(this.dynamicVNode!=null){
                    this.dynamicVNode.SurroundMvvm.$OnRouterChange()
                    PopPath()
                }
            }
        }else{
            this.Parent.RemoveChildren([this.dynamicVNode])
            this.Parent.Refresh()
        }
    }
    
    private instance(router:{component:string,params:{name:string,value:string}[]}){
        this.component=router.component

        let ns=GetNS(router.component)
        if(ns.namespace==null)
            ns.namespace="default"
        let construct=InitComponent(ns.value,ns.namespace)
        
        if(construct==null){
            throw new Error(`router can not find component name:${ns.value},namespace:${ns.namespace}`)
        }
        let mvvm=new construct()
        mvvm.$GetParams().forEach(param=>{
            let i=router.params.find((p)=>p.name==param.name)
            if(i==null && param.required){
                throw new Error("no specified router params "+param.name)
            }
            if(i!=null)
                (mvvm as any)[param.alias]=i.value
        })
        let custnode=new CustomNode(null,this.mvvm,null,mvvm)
        mvvm.$SetFenceNode(custnode)
        this.dynamicVNode=custnode
    }
}
