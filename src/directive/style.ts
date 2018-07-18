import { ParseStyle } from '../util';
import { VNode } from '../vnode/vnode';
export function Style(exp:string,vnode:VNode){
    let reg=/^\{([^:,]+:[^:\?,]+\?[^:,]+:[^:,]+)(,[^:,]+:[^:\?,]+\?[^:,]+:[^:,]+)*\}$/;
    if(!reg.test(exp)){
        throw new Error("exp format error:"+exp);
    }
    let styleJson=ParseStyle(exp);
    for(let key in styleJson){
        let watcher=vnode.mvvm.$CreateWatcher(vnode,styleJson[key],(newvalue)=>{
            if(toString.call(newvalue)=="[object String]" && newvalue!=""){
                ((vnode.DomSet[0].dom as HTMLElement).style as any)[key]=newvalue;
            }else{
                ((vnode.DomSet[0].dom as HTMLElement).style as any)[key]="";
            }
        });
        let value=watcher.GetCurValue();
        if(toString.call(value)=="[object String]" && value!=""){
            ((vnode.DomSet[0].dom as HTMLElement).style as any)[key]=value;
        }
    }
}
