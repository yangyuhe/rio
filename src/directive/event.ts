import { VinallaNode } from './../vnode/vinalla-node';
import {REG_EVENT, REG_STR} from "../const"
export function OnEvent(exp:string,vnode:VinallaNode,options:string[]){
    if(options==null || options.length==0)
        throw new Error("r-on need specify event name");
    if (REG_EVENT.test(exp)) {
        let methodStr = RegExp.$1
        let paramsStr = RegExp.$2
        if (paramsStr.length > 0) {
            let ps = paramsStr.split(",")
            vnode.DomSet[0].dom.addEventListener(options[0], (event) => {
                let params: any[] = []
                ps.forEach(p => {
                    if (!REG_STR.test(p)) {
                        if (p === "true") {
                            params.push(true)
                            return
                        }
                        if (p === "false") {
                            params.push(false);
                            return;
                        }
                        if(p=="$event"){
                            params.push(event);
                            return;
                        }
                        let n = new Number(p).valueOf()
                        if (!isNaN(n)) {
                            params.push(n.valueOf())
                        } else {
                            //肯定是本地变量
                            params.push(vnode.mvvm.$GetExpOrFunValue(p))
                        }
                    } else {
                        params.push(RegExp.$2)
                    }
                })
                vnode.mvvm.$RevokeMethod(methodStr, ...params)
            })
        }else{
            vnode.DomSet[0].dom.addEventListener(options[0], () => {
                vnode.mvvm.$RevokeMethod(methodStr)  
            })
        }
    }
}