import { VinallaNode } from './../vnode/vinalla-node';
import { StrToEvalstr } from "../util";

export function Html(exp:string,vnode:VinallaNode,noBracket:boolean){
    if(noBracket){
        let strEval=StrToEvalstr(exp);
        if(strEval.isconst)
            (vnode.DomSet[0].dom as HTMLElement).innerHTML=strEval.exp;
        else{
            let newvalue=vnode.mvvm.$GetExpOrFunValue(strEval.exp);
            (vnode.DomSet[0].dom as HTMLElement).innerHTML=newvalue;
            vnode.mvvm.$CreateWatcher(vnode,strEval.exp,newvalue=>{
                (vnode.DomSet[0].dom as HTMLElement).innerHTML=newvalue
            })
        }
    }else{
        let newvalue=vnode.mvvm.$GetExpOrFunValue(exp);
        (vnode.DomSet[0].dom as HTMLElement).innerHTML=newvalue;
        vnode.mvvm.$CreateWatcher(vnode,exp,newvalue=>{
            (vnode.DomSet[0].dom as HTMLElement).innerHTML=newvalue
        })
    }
}