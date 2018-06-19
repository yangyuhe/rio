import { ComponentMvvm } from './../mvvm/component-mvvm';
import { Mvvm } from "../mvvm/mvvm";
import { VNode } from "./vnode";
import { VDom, NewVNode, Priority } from "../vdom/vdom";
import { VNodeStatus } from "../const";

export class IfNode extends VNode {
    private dynamicVNode: VNode
    private rendered=false
    constructor(public Vdom:VDom,public mvvm: Mvvm, public Parent: VNode, private ifExp: string) {
        super(Vdom,mvvm, Parent)
        this.IsTemplate=true
    }
    
    AttachDom() {}
    Render(){
        this.mvvm.$Watch(this,this.ifExp, newvalue=>this.reImpletement(newvalue))
    }
    Update(){
        let attached = this.mvvm.$GetExpValue(this.ifExp)
        this.reImpletement(attached)
    }

    private reImpletement(newvalue:boolean){
        if(!this.rendered){
            this.rendered=true
            if (newvalue) {
                this.instance()
                this.dynamicVNode.Render()
                this.Dom=this.dynamicVNode.Dom
                if(this.Parent!=null){
                    this.Parent.AddChildren(this, [this.dynamicVNode],0)
                    this.Parent.Refresh()
                }
            }
        }else{
            if (newvalue) {
                if(this.dynamicVNode==null){
                    this.instance()
                    this.dynamicVNode.Render()
                    this.Dom=this.dynamicVNode.Dom
                }else{
                    this.dynamicVNode.Update()
                }
                if(this.Parent!=null){
                    this.Parent.AddChildren(this, [this.dynamicVNode],0)
                    this.Parent.Refresh()
                }
                else{
                    (this.mvvm as ComponentMvvm).$GetFenceNode().Dom=this.Dom;
                    (this.mvvm as ComponentMvvm).$GetFenceNode().Source.Parent.Refresh()           
                }
                this.dynamicVNode.SetStatus(VNodeStatus.ACTIVE)
                
            } else {
                if(this.Parent!=null){
                    this.Parent.RemoveChildren([this.dynamicVNode])
                    this.Parent.Refresh()
                }
                else{                
                    (this.mvvm as ComponentMvvm).$GetFenceNode().Dom=null;
                    (this.mvvm as ComponentMvvm).$GetFenceNode().Source.Parent.Refresh()
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