import { ParseStyle } from '../util';
import { VNode } from '../vnode/vnode';
export function Style(exp:string,vnode:VNode){
    let reg=/^([^:,]+:[^,]+)(,[^:,]+:[^,]+)*$/;
    if(!reg.test(exp)){
        throw new Error("exp format error:"+exp);
    }
    let styleJson=ParseStyle(exp);
    let htmlElement=(vnode.statefulDom[0].dom as HTMLElement);
    for(let key in styleJson){
        let watcher=vnode.mvvm.$CreateWatcher(vnode,styleJson[key],(newvalue)=>{
            for(let key in styleJson){
                
                let value=vnode.mvvm.$GetExpOrFunValue(styleJson[key]);
                if(toString.call(value)=="[object String]" && value!=""){
                    (htmlElement.style as any)[key]=value;
                }else{
                    (htmlElement.style as any)[key]="";
                }
            }
        });
        let value=watcher.GetCurValue();
        if(toString.call(value)=="[object String]" && value!=""){
            (htmlElement.style as any)[key]=value;
        }
    }
}
