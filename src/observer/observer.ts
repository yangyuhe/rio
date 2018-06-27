import { VNode } from '../vnode/vnode';
import { Watcher } from "./watcher";
import { Mvvm } from '../mvvm/mvvm';
import { WatcherCollecter } from './watcher-collect';

let $target:Watcher

export function SetTarget(target:Watcher){
    $target=target
}
export function CleanTarget(){
    $target=null
}
    
export function ReactiveData(data:any){
    if(data!=null && typeof data=="object"){
        Object.keys(data).forEach(key=>{
            reactiveKey(data,key)
            ReactiveData(data[key])
        })
    }
}
function reactiveKey(data:any,key:string){
    let collecter=new WatcherCollecter(key)        
    let value = data[key]
    if(toString.call(value)=="[object Array]"){
        reactiveArray(value,collecter)
    }
    Object.defineProperty(data, key, {
        get: ()=> {
            if($target!=null){
                collecter.AddTarget($target)
            }
            return value
        },
        set: (newval)=>{
            if (newval != value) {
                value=newval
                if(toString.call(value)=="[object Array]"){
                    reactiveArray(value,collecter)
                }
                ReactiveData(newval)                    
                collecter.Notify()
            }
        },
        enumerable:true,
        configurable:true
    })
}
    
function reactiveArray(array:any[],collecter:WatcherCollecter){
    if(array.push!=Array.prototype.push)
        return
    Object.defineProperty(array,"push",{
        enumerable:false,
        configurable:true,
        value:(...params:any[])=>{
            let old=array.length
            let res=Array.prototype.push.call(array,...params)
            for(let i=old;i<res;i++){
                reactiveKey(array,""+i)
            }
            collecter.Notify()                
            return res
        }
    })
    Object.defineProperty(array,"pop",{
        enumerable:false,
        configurable:true,
        value:(...params:any[])=>{
            let res=Array.prototype.pop.call(array,...params)
            collecter.Notify()                
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
                    reactiveKey(array,""+index)
                })
            }
            collecter.Notify()                
            return res
        }
    })
    Object.defineProperty(array,"shift",{
        enumerable:false,
        configurable:true,
        value:(...params:any[])=>{
            let res=Array.prototype.shift.call(array,...params)
            collecter.Notify()                
            return res
        }
    })
}
    
export function ReactiveComputed(mvvm:Mvvm,vnode:VNode,key:string,func:()=>any){
    let collecter=new WatcherCollecter(key)
    let firstget=true
    let value:any
    
    Object.defineProperty(mvvm, key, {
        get: ()=> {
            if($target!=null){
                collecter.AddTarget($target)
            }
            if(firstget){
                let old=$target
                $target=null
                value=func.call(mvvm)
                new Watcher(mvvm,vnode,func,(newval)=>{
                    value=newval
                    collecter.Notify()
                })
                $target=old
                firstget=false
            }
            return value
        },
        enumerable:true,
        configurable:true
    })
}

