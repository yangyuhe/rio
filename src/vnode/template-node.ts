import { DomStatus } from '../models';
import { VNode } from "./vnode";

export class TemplateNode extends VNode{
    Render():DomStatus[]{
        this.Children.forEach(child=>{
            this.DomSet=this.DomSet.concat(child.Render())
        })
        return this.DomSet;
    }
    Update(){

    }
}