import { VNode } from "./vnode";
import { MVVM } from "../mvvm/mvvm";
import { VDom } from "../vdom/vdom";
import { VNodeStatus } from "../const";

export class SlotNode extends VNode{
    constructor(protected vdom:VDom,public mvvm: MVVM, public Parent: VNode, private name: string) {
        super(vdom,mvvm,Parent)
        if(this.name==null || this.name=="")
            this.name="default"
    }
    Render(): void {
        let template=this.mvvm.$FenceNode.GetTemplate(this.name)
        if(template!=null){
            template.Render()
            this.Dom = template.Dom
            while(this.Dom.firstChild!=null){
                this.Parent.Dom.appendChild(this.Dom.firstChild)
            }
        }
        return null
    }
    
    Update(){
        let template=this.mvvm.$FenceNode.GetTemplate(this.name)
        if(template!=null){
            template.Update()
        }
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        let template=this.mvvm.$FenceNode.GetTemplate(this.name)
        template.SetStatus(status)
    }
    OnRemoved(){
        let template=this.mvvm.$FenceNode.GetTemplate(this.name)
        template.OnRemoved()
    }
}