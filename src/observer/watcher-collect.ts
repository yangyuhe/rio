import { Watcher } from "./watcher";
import { AddWatcher } from "./msg-queue";
import { VNodeStatus } from "../const";

export class WatcherCollecter{
    private watches:Watcher[]=[]
    constructor(private key:string){
    }
    GetKey(){
        return this.key
    }
    AddTarget(watcher:Watcher){
        if(this.watches.indexOf(watcher)==-1)
            this.watches.push(watcher)
    }
    
    Notify(){
        this.watches=this.watches.filter(watcher=>{
            if(watcher.GetVNode().GetStatus()==VNodeStatus.ACTIVE ){
                AddWatcher(watcher)
                return true
            }
            if(watcher.GetVNode().GetStatus()==VNodeStatus.INACTIVE )
                return true
            if(watcher.GetVNode().GetStatus()==VNodeStatus.DEPRECATED )
                return false
        })
    }
}