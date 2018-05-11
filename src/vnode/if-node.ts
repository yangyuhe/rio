import { MVVM } from "../mvvm/mvvm";
import { VNode } from "./vnode";
import { VDom, NewVNodeNoForNoIf } from "../vdom/vdom";
import { VNodeStatus } from "../const";

export class IfNode extends VNode {
    private dynamicVNode: VNode
    constructor(public Vdom:VDom,public mvvm: MVVM, public Parent: VNode, private ifExp: string) {
        super(Vdom,mvvm, Parent)
        this.IsTemplate=true
    }
    
    AttachDom() {}
    Render(){
        if(this.dynamicVNode!=null){
            this.dynamicVNode.Render()
            if(this.Parent!=null){
                this.Parent.Dom.appendChild(this.dynamicVNode.Dom)
            }else{
                this.Dom=this.dynamicVNode.Dom
            }
        }
    }
    Update(){
        let attached = this.mvvm.GetExpValue(this.ifExp)
        this.reImpletement(attached)
    }
    StartWatch(){
        this.mvvm.$watchExp(this,this.ifExp, newvalue=>this.reImpletement(newvalue))
        if(this.dynamicVNode!=null)
            this.dynamicVNode.StartWatch()
    }
    private reImpletement(newvalue:boolean){
        if (newvalue) {
            if(this.dynamicVNode==null){
                this.instance()
                this.dynamicVNode.Render()
                this.dynamicVNode.StartWatch()
            }else{
                this.dynamicVNode.Update()
            }
            if(this.Parent!=null){
                this.Parent.AddChildren(this, [this.dynamicVNode],0)
                this.Parent.Refresh()
            }
            else{
                this.mvvm.FenceNode.Dom=this.dynamicVNode.Dom
                this.mvvm.FenceNode.Parent.Refresh()           
            }
            this.dynamicVNode.SetStatus(VNodeStatus.ACTIVE)
            
        } else {
            if(this.dynamicVNode!=null){
                if(this.Parent!=null){
                    this.Parent.RemoveChildren([this.dynamicVNode])
                    this.Parent.Refresh()
                }
                else{                
                    this.mvvm.FenceNode.Dom=null
                    this.mvvm.FenceNode.Parent.Refresh()
                }
                this.dynamicVNode.SetStatus(VNodeStatus.INACTIVE)
            }
        }
    }
    Reconstruct() {
        let attached = this.mvvm.GetExpValue(this.ifExp)
        if (attached){
            this.instance()
            if(this.Parent!=null)
                this.Parent.AddChildren(this, [this.dynamicVNode],0)
        }
    }
    private instance(){
        this.dynamicVNode=NewVNodeNoForNoIf(this.Vdom,this.mvvm,null)
        this.dynamicVNode.IsCopy=true
        this.dynamicVNode.AttachDom()
        this.dynamicVNode.Reconstruct()
    }
}