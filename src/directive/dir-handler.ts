import { VNode } from "../vnode/vnode";
import { DirModel } from "./model";
import { OnClick } from "./onclick";
export function DirectiveBind(vnode: VNode) {
    let inputs=vnode.GetInput()
    for(let name in inputs){
        switch(name){
            case "model":
            DirModel(inputs[name],vnode)
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