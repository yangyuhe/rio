import { MVVM } from "../mvvm/mvvm";
import { VNode } from "./vnode";
import { VDom, NewVNode, Priority } from "../vdom/vdom";
import { VNodeStatus } from "../const";

export class IfNode extends VNode {
    private dynamicVNode: VNode
    constructor(public Vdom:VDom,public mvvm: MVVM, public Parent: VNode, private ifExp: string) {
        super(Vdom,mvvm, Parent)
        this.IsTemplate=true
    }
    
    AttachDom() {}
    Render(){
        this.mvvm.$watch(this,this.ifExp, newvalue=>this.reImpletement(newvalue))
    }
    Update(){
        let attached = this.mvvm.GetExpValue(this.ifExp)
        this.reImpletement(attached)
    }

    private reImpletement(newvalue:boolean){
        if (newvalue) {
            if(this.dynamicVNode==null){
                this.instance()
                this.dynamicVNode.Render()
            }else{
                this.dynamicVNode.Update()
            }
            if(this.Parent!=null){
                this.Parent.AddChildren(this, [this.dynamicVNode],0)
                this.Parent.Refresh()
            }
            else{
                this.mvvm.$FenceNode.Dom=this.dynamicVNode.Dom
                this.mvvm.$FenceNode.Parent.Refresh()           
            }
            this.dynamicVNode.SetStatus(VNodeStatus.ACTIVE)
            
        } else {
            if(this.dynamicVNode!=null){
                if(this.Parent!=null){
                    this.Parent.RemoveChildren([this.dynamicVNode])
                    this.Parent.Refresh()
                }
                else{                
                    this.mvvm.$FenceNode.Dom=null
                    this.mvvm.$FenceNode.Parent.Refresh()
                }
                this.dynamicVNode.SetStatus(VNodeStatus.INACTIVE)
            }
        }
    }

    private instance(){
        this.dynamicVNode=NewVNode(this.Vdom,this.mvvm,null,Priority.NORMAL)
        this.dynamicVNode.IsCopy=true
        this.dynamicVNode.AttachDom()
    }
    OnRemoved(){
        if(this.dynamicVNode!=null)
            this.dynamicVNode.OnRemoved()
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        if(this.dynamicVNode!=null)
            this.dynamicVNode.SetStatus(status)
    }
}