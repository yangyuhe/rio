import { PRE } from "../const";
import { StrToEvalstr } from "../util";
import { VinallaNode } from './../vnode/vinalla-node';

export function Href(exp:string,vnode:VinallaNode,isconst:boolean){
    let href:string="";
    if(isconst){
        let streval=StrToEvalstr(exp)
        if(streval.isconst){
            href=streval.exp;
            (vnode.DomSet[0].dom as HTMLElement).setAttribute(PRE+"href",streval.exp);
        }
        else{                
            let watcher=vnode.mvvm.$CreateWatcher(vnode,streval.exp,newvalue=>{
                href=newvalue;
                (vnode.DomSet[0].dom as HTMLElement).setAttribute(PRE+"href",newvalue);
            });
            href=watcher.GetCurValue();
            (vnode.DomSet[0].dom as HTMLElement).setAttribute(PRE+"href",href);
        }
    }else{
        let watcher=vnode.mvvm.$CreateWatcher(vnode,exp,newvalue=>{
            href=newvalue;
            (vnode.DomSet[0].dom as HTMLElement).setAttribute(PRE+"href",newvalue);
        });
        href=watcher.GetCurValue();
    }
        
    vnode.DomSet[0].dom.addEventListener("click",()=>{
        vnode.mvvm.$NavigateTo(href);
    })
}
