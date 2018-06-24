import { RouterInfo, RouterChangeCallback } from './../models';
import { VNode } from '../vnode/vnode';
import { VNodeStatus } from '../const';

class _RouterInfo implements RouterInfo{
    constructor(public path:string,public params:{name:string,value:string}[]){

    }
    getParam(name:string):string{
        let p=this.params.find(p=>p.name==name)
        return p && p.value ||null
    }
}

let active:RouterInfo=new _RouterInfo("",[])

let listeners:{cb:RouterChangeCallback,vnode:VNode}[]=[]

export function SetActiveRouter(path:string,params:{name:string,value:any}[]){
    let old:RouterInfo=new _RouterInfo(path,params)
    
    active.path=path
    active.params=params

    listeners= listeners.filter(listen=>listen.vnode.GetStatus()!=VNodeStatus.DEPRECATED)
    listeners.forEach(listen=>{
        if(listen.vnode.GetStatus()==VNodeStatus.ACTIVE)
            listen.cb(active,old)
    })
}
export function GetActiveRouter(){
    return active
}
export function WatchRouterChange(vnode:VNode,listener:RouterChangeCallback){
    listeners.push({cb:listener,vnode:vnode})
}


