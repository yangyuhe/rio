import {REG_EVENT, REG_STR} from "../const"
import { MVVM } from "./mvvm";
export function RevokeEvent(method:string,data:any,mvvm:MVVM){
    if (REG_EVENT.test(method)) {
        let methodStr = RegExp.$1
        let paramsStr = RegExp.$2
        if (paramsStr.length > 0) {
            let ps = paramsStr.split(",")
            let params: any[] = []
            ps.forEach(p => {
                if (!REG_STR.test(p)) {
                    if (p === "true") {
                        params.push(true)
                        return
                    }
                    if (p === "false") {
                        params.push(false)
                        return
                    }
                    if(p=="$event"){
                        params.push(...data)
                        return
                    }
                    let n = new Number(p).valueOf()
                    if (!isNaN(n)) {
                        params.push(n.valueOf())
                    } else {
                        //肯定是本地变量
                        params.push(mvvm.GetExpValue(p))
                    }
                } else {
                    params.push(RegExp.$2)
                }
            })
            mvvm.RevokeMethod(methodStr, ...params)
        }else{
            mvvm.RevokeMethod(methodStr)  
        }
    }
}