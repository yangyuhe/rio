import { DomStatus } from '../models';
import { Mvvm } from "../mvvm/mvvm";
import { MoveBack, NextRouter } from "../router/router-manager";
import { VDom } from '../vdom/vdom';
import { DomType, VNodeStatus } from './../const';
import { IComponentMvvm } from './../models';
import { CustomNode } from "./custom-node";
import { VNode } from "./vnode";

export class RouterNode extends VNode{
    private lastConstructor:IComponentMvvm=null;
    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode,private routername:string) {
        super(Vdom,mvvm,Parent)
    }

    Render() :DomStatus[]{
        let router=NextRouter(this,this.routername);
        this.lastConstructor=router;
        if(router!=null){
            let vnode=this.instance(router)
            this.Children=[vnode]
            this.DomSet=vnode.Render()
            MoveBack()
        }
        return this.DomSet
        
    }
    OnRouterChange(){
        let constructor=NextRouter(this,this.routername);
        if(this.lastConstructor!=constructor){
            this.lastConstructor=constructor;
            //释放旧的资源
            this.Children.forEach(child=>{
                child.SetStatus(VNodeStatus.DEPRECATED);
                child.OnDestroy();
            });

            if(constructor!=null){
                let vnode=this.instance(constructor)
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
        }else{
            this.Children.forEach(child=>child.OnRouterChange());
            MoveBack();
        }
        
    }
    private instance(construct:IComponentMvvm):VNode{
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
