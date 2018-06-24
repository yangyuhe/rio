import { VNode } from "../vnode/vnode";
import { StrToEvalstr } from "../util";

export function Html(exp:string,vnode:VNode,noBracket:boolean){
    if(noBracket){
        let strEval=StrToEvalstr(exp);
        if(strEval.isconst)
            (vnode.Dom as HTMLElement).innerHTML=strEval.exp;
        else
            vnode.mvvm.$Watch(vnode,strEval.exp,newvalue=>{
                (vnode.Dom as HTMLElement).innerHTML=newvalue
            })
    }else{
        vnode.mvvm.$Watch(vnode,exp,newvalue=>{
            (vnode.Dom as HTMLElement).innerHTML=newvalue
        })
    }
}