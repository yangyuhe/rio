import { VNode } from "../vnode/vnode";
import { ModelWatch, ModelSet } from "./model";
import { OnClick } from "./onclick";
export function DirectiveSet(vnode: VNode) {
    let inputs=vnode.GetInput()
    for(let name in inputs){
        switch(name){
            case "model":
            ModelSet(inputs[name],vnode)
            break;
        }
    }
    
    let outputs=vnode.GetOutput()
    for(let name in outputs){
        switch(name){
            case "click":
            OnClick(outputs[name],vnode)
            break;
        }
    }
    
}
export function DirectiveWatch(vnode: VNode){
    let inputs=vnode.GetInput()
    for(let name in inputs){
        switch(name){
            case "model":
            ModelWatch(inputs[name],vnode)
            break;
        }
    }
}