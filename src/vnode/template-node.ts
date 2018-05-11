import { VNode } from "./vnode";
import { MVVM } from "../mvvm/mvvm";
import { VDom } from "../vdom/vdom";

export class TemplateNode extends VNode{
    constructor(protected vdom:VDom,public mvvm: MVVM,public Parent:VNode,public templatename:string) {
        super(vdom,mvvm,Parent)
    }
    
    Render() :void{
        this.Dom=document.createElement("div")
        this.Children.forEach(child=>{
            child.Render()
        })
    }
    StartWatch(){
        this.Children.forEach(child=>{
            child.StartWatch()
        })
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