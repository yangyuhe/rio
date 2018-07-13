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

let active:RouterInfo=new _RouterInfo("",[]);
let previous:RouterInfo=null;

let listeners:{cb:RouterChangeCallback,vnode:VNode}[]=[]

export function SetActiveRouter(path:string,params:{name:string,value:any}[]){
    previous=active;
    active=new _RouterInfo(path,params)

    listeners= listeners.filter(listen=>listen.vnode.GetStatus()!=VNodeStatus.DEPRECATED)
    listeners.forEach(listen=>{
        if(listen.vnode.GetStatus()==VNodeStatus.ACTIVE)
            listen.cb(active,previous)
    })
}
export function GetActiveRouter(){
    return {active:active,previous:previous}
}
export function WatchRouterChange(vnode:VNode,listener:RouterChangeCallback){
    listeners.push({cb:listener,vnode:vnode})
}


