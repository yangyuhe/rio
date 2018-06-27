import { DomStatus } from '../models';
import { Mvvm } from "../mvvm/mvvm";
import { VDom } from "../vdom/vdom";
import { VNode } from "./vnode";

export class PlugNode extends VNode{
    constructor(protected vdom:VDom,public mvvm: Mvvm,public Parent:VNode,public templatename:string) {
        super(vdom,mvvm,Parent)
    }
    
    Render():DomStatus[]{
        this.Children.forEach(child=>{
            let doms=child.Render()
            this.DomSet=this.DomSet.concat(doms)
        })
        return this.DomSet
    }
    
    Update(){
        let children: VNode[] = []
        this.Children.forEach(child => {
            children.push(child)
        })
        children.forEach(child => {
            child.Update()
        })
    }
    
}