import { VinallaNode } from './../vnode/vinalla-node';
import { StrToEvalstr } from "../util";

export function Html(exp:string,vnode:VinallaNode){
    let strEval=StrToEvalstr(exp);
    if(strEval.isconst)
        (vnode.DomSet[0].dom as HTMLElement).innerHTML=strEval.exp;
    else{
        let watcher=vnode.mvvm.$CreateWatcher(vnode,strEval.exp,newvalue=>{
            (vnode.DomSet[0].dom as HTMLElement).innerHTML=newvalue
        });
        (vnode.DomSet[0].dom as HTMLElement).innerHTML=watcher.GetCurValue();
    }
}