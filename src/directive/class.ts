import { VinallaNode } from './../vnode/vinalla-node';
import { LogError } from '../util';
export function Classes(exp:string,vnode:VinallaNode,isconst:boolean){
    if(isconst){
        let hacked="var a="+exp+";a";
        let classes:any;
        try {
            classes=eval(hacked);
        } catch (error) {
            LogError("json format error:"+exp)
            return;
        }
        for(let key in classes){
            let istrue=vnode.mvvm.$GetExpOrFunValue(key);
            if(istrue){
                (vnode.DomSet[0].dom as HTMLElement).classList.add(classes[key]);
            }
            vnode.mvvm.$CreateWatcher(vnode,key,(newvalue)=>{
                if(newvalue){
                    (vnode.DomSet[0].dom as HTMLElement).classList.add(classes[key]);
                }else{
                    (vnode.DomSet[0].dom as HTMLElement).classList.remove(classes[key]);
                }
            })
        }
    }
}