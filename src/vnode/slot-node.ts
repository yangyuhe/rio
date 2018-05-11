import { VNode } from "./vnode";
import { MVVM } from "../mvvm/mvvm";
import { VDom } from "../vdom/vdom";

export class SlotNode extends VNode{
    constructor(protected vdom:VDom,public mvvm: MVVM, public Parent: VNode, private name: string) {
        super(vdom,mvvm,Parent)
        if(this.name==null || this.name=="")
            this.name="default"
    }
    Render(): void {
        let template=this.mvvm.FenceNode.GetTemplate(this.name)
        if(template!=null){
            template.Render()
            this.Dom = template.Dom
            while(this.Dom.firstChild!=null){
                this.Parent.Dom.appendChild(this.Dom.firstChild)
            }
        }
        return null
    }
    StartWatch(){
        let template=this.mvvm.FenceNode.GetTemplate(this.name)
        if(template!=null){
            template.StartWatch()
        }
    }
    Update(){
        let template=this.mvvm.FenceNode.GetTemplate(this.name)
        if(template!=null){
            template.Update()
        }
    }
}