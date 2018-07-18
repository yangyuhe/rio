import { ParseStyle } from '../util';
import { VNode } from '../vnode/vnode';
export function Classes(exp:string,vnode:VNode){

    let reg=/^\{([^:,]+:[^:,]+)(,[^:,]+:[^:,]+)*\}$/;
    if(!reg.test(exp)){
        throw new Error("exp format error:"+exp);
    }
    let classJson=ParseStyle(exp);
    for(let key in classJson){            
        let watcher=vnode.mvvm.$CreateWatcher(vnode,classJson[key],(newvalue)=>{
            if(newvalue){
                (vnode.DomSet[0].dom as HTMLElement).classList.add(key);
            }else{
                (vnode.DomSet[0].dom as HTMLElement).classList.remove(key);
            }
        });
        let value=watcher.GetCurValue();
        if(value){
            (vnode.DomSet[0].dom as HTMLElement).classList.add(key);
        }
    }
}