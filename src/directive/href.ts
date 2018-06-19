import { VNode } from "../vnode/vnode";

export function Href(exp:string,vnode:VNode,isconst:boolean){
    vnode.Dom.addEventListener("click",()=>{
        if(isconst)
            vnode.NavigateTo(exp)
        else{
            let path=vnode.mvvm.$GetExpValue(exp)
            vnode.NavigateTo(path)
        }
    })
}
