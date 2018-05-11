import { VNode } from '../vnode/vnode';
import { OnDataChange } from './../models';
import "./redefine-array";
import { Watcher } from "./watcher";
import { AddWatcher } from './msg-queue';
import { VNodeStatus } from '../const';

declare let EvalSingle:(context:any,exp:string)=>any
export class Observe{
    private static target:Watcher
    constructor(private data:any){}
    GetValue(watcher:Watcher){
        Observe.target=watcher
        let res=EvalSingle(this.data,watcher.Exp)
        Observe.target=null        
        return res
        
    }
    GetValueWithExp(exp:string){
        let res=EvalSingle(this.data,exp)
        return res
    }
    Walk(){
        this.walk(this.data)
    }
    AddWatcher(vnode:VNode,exp:string,listener:OnDataChange,deep?:boolean){
        new Watcher(vnode,exp,listener,this,deep)
    }
    RemoveWatcher(exp:string,listener:OnDataChange){

    }
    private walk(data:any){
        if(data!=null && typeof data=="object"){
            Object.keys(data).forEach(key=>{
                let depend=new Depender(key)
                this.defineReactive(data,key,false,depend)
                this.walk(data[key])
            })
        }
    }
    DefineReactive(data:any,key:string){
        let depend=new Depender(key)        
        this.defineReactive(data,key,true,depend)
    }
    private addArrayListener(array:any,depend:Depender){
        if(array.$obs==null){
            Object.defineProperty(array,"$obs",{
                enumerable:false,
                configurable:true,
                value:[]
            })
        }
        if(array.$obs.indexOf(depend)==-1)
            array.$obs.push(depend)
        
    }
    private defineReactive(data:any,key:string,shallow:boolean,depend:Depender){
        let value = data[key]
        if(toString.call(value)=="[object Array]"){
            this.addArrayListener(value,depend)
        }
        Object.defineProperty(data, key, {
            get: ()=> {
                if(Observe.target!=null){
                    depend.AddTarget(Observe.target)
                }
                return value
            },
            set: (newval)=>{
                if (newval != value) {
                    value=newval
                    if(toString.call(value)=="[object Array]"){
                        this.addArrayListener(value,depend)
                    }
                    if(!shallow)
                        this.walk(newval)                    
                    depend.Notify()
                }
            },
            enumerable:true,
            configurable:true
        })
    }

}
export class Depender{
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