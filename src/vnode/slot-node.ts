import { VNodeStatus } from "../const";
import { DomStatus } from '../models';
import { ComponentMvvm } from './../mvvm/component-mvvm';
import { VNode } from "./vnode";
import { CustDom } from "../vdom/parser";

export class SlotNode extends VNode{
    constructor(protected vdom:CustDom,public mvvm: ComponentMvvm, public Parent: VNode, private name: string) {
        super(vdom,mvvm,Parent)
        if(this.name==null || this.name=="")
            this.name="default"
    }
    Render(): DomStatus[] {
        let template=this.mvvm.$GetFenceNode().GetTemplate(this.name)
        if(template!=null){
            template.Parent=this;
            this.Children=[template];
            this.DomSet=template.Render();
        }
        return this.DomSet;
    }
    
    Update(){
        let template=this.mvvm.$GetFenceNode().GetTemplate(this.name)
        if(template!=null){
            template.Update()
        }
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        let template=this.mvvm.$GetFenceNode().GetTemplate(this.name)
        template.SetStatus(status)
    }
    OnDestroy(){
        let template=this.mvvm.$GetFenceNode().GetTemplate(this.name)
        template.OnDestroy()
    }
    
}