import { VNode } from "../vnode/vnode";
import { StrToEvalstr } from "../util";
import { PRE } from "../const";

export function Href(exp:string,vnode:VNode,isconst:boolean){
    let href:string=""
    if(vnode.Dom.nodeName.toLowerCase()=="a"){
        if(isconst){
            let streval=StrToEvalstr(exp)
            if(streval.isconst)
                (vnode.Dom as HTMLElement).setAttribute(PRE+"href",streval.exp);
            else{
                vnode.mvvm.$Watch(vnode,streval.exp,newvalue=>{
                    href=newvalue;
                    (vnode.Dom as HTMLElement).setAttribute(PRE+"href",newvalue);
                })                
            }
        }else{
            vnode.mvvm.$Watch(vnode,exp,newvalue=>{
                href=newvalue;
                (vnode.Dom as HTMLElement).setAttribute(PRE+"href",newvalue);
            })
        }
        
    }
    vnode.Dom.addEventListener("click",()=>{
        vnode.NavigateTo(href)
    })
}
