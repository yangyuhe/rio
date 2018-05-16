import { VNode } from '../vnode/vnode';
import { OnDataChange } from './../models';
import { Watcher } from "./watcher";
import { AddWatcher } from './msg-queue';
import { VNodeStatus } from '../const';

declare let EvalExp:(context:any,exp:string)=>any
export class Observe{
    private static target:Watcher
    constructor(private data:any){}
    GetValue(watcher:Watcher){
        Observe.target=watcher
        let res:any
        if(typeof watcher.ExpOrFunc == "string"){
            res=EvalExp(this.data,watcher.ExpOrFunc)
        }
        if(typeof watcher.ExpOrFunc =="function"){
            res=watcher.ExpOrFunc.call(this.data)
        }
        Observe.target=null   
        return res
    }
    GetValueWithExp(exp:string){
        let res=EvalExp(this.data,exp)
        return res
    }
    
    AddWatcher(vnode:VNode,exp:string|Function,listener:OnDataChange,deep?:boolean){
        new Watcher(vnode,exp,listener,this,deep)
    }
    
    ReactiveData(data:any){
        if(data!=null && typeof data=="object"){
            Object.keys(data).forEach(key=>{
                let depend=new Depender(key)
                this.defineReactive(data,key,false,depend)
                this.ReactiveData(data[key])
            })
        }
    }
    ReactiveKey(data:any,key:string,shallow:boolean){
        let depend=new Depender(key)        
        this.defineReactive(data,key,shallow,depend)
    }
    
    private reactiveArray(array:any[],depend:Depender){
        if(array.push!=Array.prototype.push)
            return
        Object.defineProperty(array,"push",{
            enumerable:false,
            configurable:true,
            value:(...params:any[])=>{
                let old=array.length
                let res=Array.prototype.push.call(array,...params)
                for(let i=old;i<res;i++){
                    this.ReactiveKey(array,""+i,false)
                }
                depend.Notify()                
                return res
            }
        })
        Object.defineProperty(array,"pop",{
            enumerable:false,
            configurable:true,
            value:(...params:any[])=>{
                let res=Array.prototype.pop.call(array,...params)
                depend.Notify()                
                return res
            }
        })
        Object.defineProperty(array,"splice",{
            enumerable:false,
            configurable:true,
            value:(...params:any[])=>{
                let res=Array.prototype.splice.call(array,...params)
                if(params.length>2){
                    let newitems=params.slice(2)
                    newitems.forEach(item=>{
                        let index=array.indexOf(item)
                        this.ReactiveKey(array,""+index,false)
                    })
                }
                depend.Notify()                
                return res
            }
        })
        Object.defineProperty(array,"shift",{
            enumerable:false,
            configurable:true,
            value:(...params:any[])=>{
                let res=Array.prototype.shift.call(array,...params)
                depend.Notify()                
                return res
            }
        })
    }
    private defineReactive(data:any,key:string,shallow:boolean,depend:Depender){
        let value = data[key]
        if(toString.call(value)=="[object Array]"){
            this.reactiveArray(value,depend)
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
                        this.reactiveArray(value,depend)
                    }
                    if(!shallow)
                        this.ReactiveData(newval)                    
                    depend.Notify()
                }
            },
            enumerable:true,
            configurable:true
        })
    }
    WatchComputed(vnode:VNode,key:string,func:()=>any){
        let depend=new Depender(key)
        let firstget=true
        let value:any
        
        Object.defineProperty(this.data, key, {
            get: ()=> {
                if(Observe.target!=null){
                    depend.AddTarget(Observe.target)
                }
                if(firstget){
                    let old=Observe.target
                    Observe.target=null
                    new Watcher(vnode,func,(newval)=>{
                        value=newval
                        depend.Notify()
                    },this)
                    Observe.target=old
                    firstget=false
                }
                return value
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