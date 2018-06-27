import { PRE } from "../const";
import { StrToEvalstr } from "../util";
import { VinallaNode } from './../vnode/vinalla-node';

export function Href(exp:string,vnode:VinallaNode,isconst:boolean){
    let href:string=""
    if(vnode.DomSet[0].dom.nodeName.toLowerCase()=="a"){
        if(isconst){
            let streval=StrToEvalstr(exp)
            if(streval.isconst){
                href=streval.exp;
                (vnode.DomSet[0].dom as HTMLElement).setAttribute(PRE+"href",streval.exp);
            }
            else{
                let newvalue=vnode.mvvm.$GetExpOrFunValue(streval.exp);
                href=newvalue;
                (vnode.DomSet[0].dom as HTMLElement).setAttribute(PRE+"href",newvalue);
                vnode.mvvm.$CreateWatcher(vnode,streval.exp,newvalue=>{
                    href=newvalue;
                    (vnode.DomSet[0].dom as HTMLElement).setAttribute(PRE+"href",newvalue);
                })                
            }
        }else{
            let newvalue=vnode.mvvm.$GetExpOrFunValue(exp);
            href=newvalue;
            vnode.mvvm.$CreateWatcher(vnode,exp,newvalue=>{
                href=newvalue;
                (vnode.DomSet[0].dom as HTMLElement).setAttribute(PRE+"href",newvalue);
            });
        }
        
    }
    vnode.DomSet[0].dom.addEventListener("click",()=>{
        vnode.NavigateTo(href)
    })
}
