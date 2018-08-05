import { DomType } from './../const';
import { Mvvm } from "../mvvm/mvvm";
import { VNode } from "./vnode";
import {  NewVNode, Priority } from "../vdom/vdom";
import { VNodeStatus } from "../const";
import { DomStatus } from '../models';
import { CustDom } from '../vdom/parser';

export class IfNode extends VNode {
    constructor(public Vdom:CustDom,public mvvm: Mvvm, public Parent: VNode, private ifExp: string) {
        super(Vdom,mvvm, Parent)
    }
    
    AttachChildren() {
        let boolvalue=this.mvvm.$GetExpOrFunValue(this.ifExp)
        if(boolvalue){
            let vnode=NewVNode(this.Vdom,this.mvvm,null,Priority.NORMAL)
            vnode.AttachChildren()
            this.Children=[vnode]
        }
    }
    Render():DomStatus[]{
        this.Children.forEach(child=>{
            this.DomSet=this.DomSet.concat(child.Render())
        })
        this.mvvm.$CreateWatcher(this,this.ifExp, newvalue=>this.reImpletement(newvalue))
        return this.DomSet
    }
    Update(){
        let attached = this.mvvm.$GetExpOrFunValue(this.ifExp)
        this.reImpletement(attached)
    }

    private reImpletement(newvalue:boolean){
        if (newvalue) {
            let vnode=NewVNode(this.Vdom,this.mvvm,null,Priority.NORMAL)
            vnode.AttachChildren()
            this.Children=[vnode]
            this.Children.forEach(child=>{
                this.DomSet=this.DomSet.concat(child.Render())
            })
            this.Parent.Reflow();
        }else{
            this.Children.forEach(child=>{
                child.SetStatus(VNodeStatus.DEPRECATED);
                child.OnDestroy();
            });
            this.Children=[]
            this.DomSet.forEach(dom=>{
                dom.type=DomType.DELETE
            });
        }
    }

    OnDestroy(){
        if(this.Children.length>0)
            this.Children[0].OnDestroy()
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        if(this.Children.length>0)
            this.Children[0].SetStatus(status)
    }
    
}