import { VinallaNode } from './../vnode/vinalla-node';
import { LogError } from '../util';
export function Style(exp:string,vnode:VinallaNode,isconst:boolean){
    if(isconst){
        let hacked="var a="+exp+";a";
        let styleexp:any;
        try {
            styleexp=eval(hacked);
        } catch (error) {
            LogError("json format error:"+exp)
            return;
        }
        
        for(let key in styleexp){
            let istrue=vnode.mvvm.$GetExpOrFunValue(key);
            let styles=styleexp[key];
            if(istrue){
                for(let stylename in styles){
                    ((vnode.DomSet[0].dom as HTMLElement).style as any)[stylename]=styles[stylename];
                }
            }
            vnode.mvvm.$CreateWatcher(vnode,key,(newvalue)=>{
                if(newvalue){
                    for(let stylename in styles){
                        ((vnode.DomSet[0].dom as HTMLElement).style as any)[stylename]=styles[stylename];
                    }
                }else{
                    for(let stylename in styles){
                        ((vnode.DomSet[0].dom as HTMLElement).style as any)[stylename]="";
                    }
                }
            })
        }
    }
}