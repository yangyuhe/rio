import { DomStatus } from '../models';
import { VNode } from "./vnode";

export class TemplateNode extends VNode{
    Render():DomStatus[]{
        this.Children.forEach(child=>{
            this.statefulDom=this.statefulDom.concat(child.Render())
        })
        return this.statefulDom;
    }
    Update(){

    }
}